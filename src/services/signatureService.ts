
import { getEthereumProvider } from './ethereumService';
import { getPaperSubmissionContract } from './contractService';

// Helper function to sign a message
export const signMessage = async (message: string, account: string): Promise<string> => {
  try {
    const web3 = getEthereumProvider();
    
    // Create the message hash
    const messageHash = web3.utils.sha3(message);
    
    if (!messageHash) {
      throw new Error('Failed to create message hash');
    }
    
    // Sign the message hash
    const signature = await web3.eth.personal.sign(messageHash, account, '');
    
    return signature;
  } catch (error) {
    console.error('Error signing message:', error);
    throw error;
  }
};

// Verify if a signature is valid (client-side verification)
export const verifySignature = async (message: string, signature: string, signer: string): Promise<boolean> => {
  try {
    const contract = getPaperSubmissionContract();
    const paperId = 1; // Sample paper ID for verification
    
    // Call the contract's verification function
    const isValid = await contract.methods.verifyPaperSignature(paperId, message).call();
    
    return Boolean(isValid);
  } catch (error) {
    console.error('Error verifying signature:', error);
    return false;
  }
};
