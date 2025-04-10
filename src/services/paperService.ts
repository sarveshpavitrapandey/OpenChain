
import { getPaperSubmissionContract, getDOIRegistryContract, getIncentiveDistributionContract, getSafeEthereumAccount } from './contractService';
import { signMessage } from './signatureService';
import { storePaperMetadata } from './metadataService';
import { PaperSubmittedEvent, DOIRegisteredEvent, OffchainMetadata } from '../types/blockchain';

// Paper publishing with smart contract and signature verification
export const publishPaper = async (
  paperCid: string, 
  title: string, 
  account: string,
  metadata?: OffchainMetadata
): Promise<string> => {
  try {
    // Check if plagiarism score exists and is above the threshold
    if (metadata?.originalityScore !== undefined) {
      const plagiarismPercentage = 100 - metadata.originalityScore;
      const PLAGIARISM_THRESHOLD = 15; // 15% threshold
      
      if (plagiarismPercentage > PLAGIARISM_THRESHOLD) {
        throw new Error(`Publication rejected: Content analysis detected ${plagiarismPercentage.toFixed(1)}% similarity with existing content, which exceeds our originality standards.`);
      }
      
      console.log(`Content originality check passed: ${metadata.originalityScore.toFixed(1)}% original content`);
    } else {
      console.log('No content originality check results provided');
    }
    
    const contract = getPaperSubmissionContract();
    
    console.log(`Publishing paper "${title}" with CID ${paperCid} from account ${account}`);
    
    // Create and sign the message (cid:title format)
    const message = `${paperCid}:${title}`;
    const signature = await signMessage(message, account);
    
    console.log(`Generated signature: ${signature}`);
    
    // Call our PaperSubmission contract
    const tx = await contract.methods.submitPaper(paperCid, title, signature).send({
      from: account,
      gas: '300000' // Gas limit for the more complex function
    });
    
    console.log('Transaction successful:', tx);
    
    // Convert returnValues to our defined type with appropriate type casting
    const paperSubmittedEvent = tx.events?.PaperSubmitted?.returnValues as unknown as PaperSubmittedEvent;
    const paperId = paperSubmittedEvent?.paperId || '';
    
    // After successful submission, trigger DOI registration
    await registerDOI(paperId, account, title);
    
    // Reward the author for submission
    await rewardAuthorForSubmission(account, paperId);
    
    // Store off-chain metadata in Supabase if provided
    if (metadata && paperId) {
      await storePaperMetadata(paperId, account, metadata);
    }
    
    return tx.transactionHash;
  } catch (error) {
    console.error('Error publishing paper to blockchain:', error);
    throw error;
  }
};

// Register a DOI for a published paper
const registerDOI = async (paperId: string, author: string, title: string): Promise<string | null> => {
  try {
    const contract = getDOIRegistryContract();
    const account = await getSafeEthereumAccount();
    
    console.log(`Registering DOI for paper ${paperId} by author ${author}`);
    
    const tx = await contract.methods.registerDOI(paperId, author, title).send({
      from: account,
      gas: '200000'
    });
    
    console.log('DOI registration successful:', tx);
    
    // Type assertion with proper conversion
    const doiEvent = tx.events?.DOIRegistered?.returnValues as unknown as DOIRegisteredEvent;
    return doiEvent?.doi || null;
  } catch (error) {
    console.error('Error registering DOI:', error);
    // Allow the paper to be published even if DOI registration fails
    return null;
  }
};

// Reward an author for submitting a paper
const rewardAuthorForSubmission = async (author: string, paperId: string): Promise<string | null> => {
  try {
    const contract = getIncentiveDistributionContract();
    const account = await getSafeEthereumAccount();
    
    console.log(`Rewarding author ${author} for paper ${paperId}`);
    
    const tx = await contract.methods.rewardAuthor(author, paperId).send({
      from: account,
      gas: '200000'
    });
    
    console.log('Author reward transaction successful:', tx);
    return tx.transactionHash;
  } catch (error) {
    console.error('Error rewarding author:', error);
    // Allow the paper to be published even if rewarding fails
    return null;
  }
};
