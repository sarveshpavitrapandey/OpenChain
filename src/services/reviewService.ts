
import { getReviewManagerContract, getIncentiveDistributionContract, getSafeEthereumAccount } from './contractService';
import { ReviewSubmittedEvent } from '../types/blockchain';

// Review submission with smart contract
export const submitReview = async (paperId: string, reviewCid: string, rating: number, account: string): Promise<string> => {
  try {
    const contract = getReviewManagerContract();
    
    console.log(`Submitting review for paper ${paperId} with CID ${reviewCid} and rating ${rating} from account ${account}`);
    
    const tx = await contract.methods.submitReview(paperId, reviewCid, rating).send({
      from: account,
      gas: '200000'
    });
    
    console.log('Review submission successful:', tx);
    
    // Type assertion with proper conversion
    const reviewEvent = tx.events?.ReviewSubmitted?.returnValues as unknown as ReviewSubmittedEvent;
    const reviewId = reviewEvent?.reviewId || '';
    
    // Reward the reviewer for submitting a review
    await rewardReviewerForSubmission(account, reviewId);
    
    return tx.transactionHash;
  } catch (error) {
    console.error('Error submitting review to blockchain:', error);
    throw error;
  }
};

// Reward a reviewer for submitting a review
const rewardReviewerForSubmission = async (reviewer: string, reviewId: string): Promise<string | null> => {
  try {
    const contract = getIncentiveDistributionContract();
    const account = await getSafeEthereumAccount();
    
    console.log(`Rewarding reviewer ${reviewer} for review ${reviewId}`);
    
    const tx = await contract.methods.rewardReviewer(reviewer, reviewId).send({
      from: account,
      gas: '200000'
    });
    
    console.log('Reviewer reward transaction successful:', tx);
    return tx.transactionHash;
  } catch (error) {
    console.error('Error rewarding reviewer:', error);
    // Allow the review to be submitted even if rewarding fails
    return null;
  }
};

// Get the reputation score of a reviewer
export const getReviewerReputation = async (address: string): Promise<number> => {
  try {
    const contract = getReviewManagerContract();
    
    // Use the helper function to get a safe account
    const activeAccount = await getSafeEthereumAccount();
    
    const reputation = await contract.methods.getReviewerReputation(address).call({
      from: activeAccount
    });
    
    return parseInt(String(reputation));
  } catch (error) {
    console.error('Error getting reviewer reputation:', error);
    // Return mock data for development
    return Math.floor(Math.random() * 100);
  }
};
