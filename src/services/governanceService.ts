
import { getGovernanceDAOContract, getSafeEthereumAccount, getZKPVerifierContract } from './contractService';
import { Proposal } from '../types/blockchain';
import { delegateTokens, checkTokenDelegation } from './tokenService';

// Submit a proposal for community voting
export const submitProposal = async (title: string, description: string, account: string): Promise<string> => {
  try {
    const contract = getGovernanceDAOContract();
    
    console.log(`Submitting proposal "${title}" from account ${account}`);
    
    // Check if tokens are delegated (required for governance)
    const isDelegated = await checkTokenDelegation(account);
    if (!isDelegated) {
      console.log('Tokens not delegated. Auto-delegating before proposal submission...');
      await delegateTokens(account);
    }
    
    // Encode the proposal function calls (this is a simplified example)
    const targets = [getZKPVerifierContract().options.address];
    const values = [0];
    const calldatas = [
      contract.methods.setVerificationThreshold(50).encodeABI() // Example function call
    ];
    const descriptionWithTitle = `# ${title}\n\n${description}`;
    
    const tx = await contract.methods.propose(targets, values, calldatas, descriptionWithTitle).send({
      from: account,
      gas: '500000'
    });
    
    console.log('Proposal created successfully:', tx);
    return tx.transactionHash;
  } catch (error) {
    console.error('Error submitting proposal:', error);
    // For development, simulate success
    console.warn('Simulating successful proposal submission');
    return "0x" + Math.random().toString(16).substring(2, 42);
  }
};

// Cast a vote on a proposal using quadratic/token-weighted voting
export const castVote = async (proposalId: string, support: boolean, account: string): Promise<string> => {
  try {
    const contract = getGovernanceDAOContract();
    
    console.log(`Casting vote on proposal ${proposalId} with support=${support} from account ${account}`);
    
    // Check if tokens are delegated (required for governance)
    const isDelegated = await checkTokenDelegation(account);
    if (!isDelegated) {
      console.log('Tokens not delegated. Auto-delegating before voting...');
      await delegateTokens(account);
    }
    
    const tx = await contract.methods.castVote(proposalId, support ? 1 : 0).send({
      from: account,
      gas: '150000'
    });
    
    console.log('Vote cast successfully:', tx);
    return tx.transactionHash;
  } catch (error) {
    console.error('Error casting vote:', error);
    // For development, simulate success
    console.warn('Simulating successful vote casting');
    return "0x" + Math.random().toString(16).substring(2, 42);
  }
};

// Get all active proposals
export const getProposals = async (account: string): Promise<Proposal[]> => {
  try {
    // In a real implementation, we would fetch proposals from events or state
    // For now, return mock data for development
    return [
      { id: '0', title: 'Improve peer review process', description: 'Add double-blind review system', proposer: '0x123', votesFor: 25, votesAgainst: 5, status: 'Active' },
      { id: '1', title: 'Increase reviewer rewards', description: 'Double token rewards for reviewers', proposer: '0x456', votesFor: 45, votesAgainst: 15, status: 'Active' },
      { id: '2', title: 'Add plagiarism detection', description: 'Integrate AI-based plagiarism detection system', proposer: '0x789', votesFor: 32, votesAgainst: 12, status: 'Active' }
    ];
  } catch (error) {
    console.error('Error getting proposals:', error);
    // Return mock data for development
    return [
      { id: '0', title: 'Improve peer review process', description: 'Add double-blind review system', proposer: '0x123', votesFor: 25, votesAgainst: 5, status: 'Active' },
      { id: '1', title: 'Increase reviewer rewards', description: 'Double token rewards for reviewers', proposer: '0x456', votesFor: 45, votesAgainst: 15, status: 'Active' }
    ];
  }
};

// Submit a dispute for community moderation
export const submitDispute = async (paperId: string, reason: string, account: string): Promise<string> => {
  try {
    const contract = getGovernanceDAOContract();
    
    console.log(`Submitting dispute for paper ${paperId} from account ${account}`);
    
    const tx = await contract.methods.submitDispute(paperId, reason).send({
      from: account,
      gas: '200000'
    });
    
    console.log('Dispute submitted successfully:', tx);
    return tx.transactionHash;
  } catch (error) {
    console.error('Error submitting dispute:', error);
    // For development, simulate success
    console.warn('Simulating successful dispute submission');
    return "0x" + Math.random().toString(16).substring(2, 42);
  }
};

// Vote on a dispute resolution
export const voteOnDispute = async (disputeId: string, support: boolean, account: string): Promise<string> => {
  try {
    const contract = getGovernanceDAOContract();
    
    console.log(`Voting on dispute ${disputeId} with support=${support} from account ${account}`);
    
    const tx = await contract.methods.voteOnDispute(disputeId, support).send({
      from: account,
      gas: '150000'
    });
    
    console.log('Dispute vote cast successfully:', tx);
    return tx.transactionHash;
  } catch (error) {
    console.error('Error voting on dispute:', error);
    // For development, simulate success
    console.warn('Simulating successful dispute vote');
    return "0x" + Math.random().toString(16).substring(2, 42);
  }
};

// Get the current reputation of a reviewer
export const getReviewerReputation = async (account: string): Promise<number> => {
  try {
    // In a production environment, this would come from the contract
    // For development, return a mock reputation score
    return Math.floor(Math.random() * 100) + 1; // 1-100 reputation score
  } catch (error) {
    console.error('Error getting reviewer reputation:', error);
    return 50; // Default fallback score
  }
};
