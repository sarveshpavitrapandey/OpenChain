
// Web3 service - main file that exports all functions
import { 
  connectWallet, 
  isWalletConnected, 
  getEthBalance, 
  getEthPrice, 
  calculateEthValue, 
  getEthStakingAPR, 
  calculateStakingRewards,
  estimateTransactionCost,
  getOpenChainContract,
  getEthereumProvider
} from './ethereumService';

import { getSolanaConnection } from './solanaService';

// Import services from contract interactions
import {
  getPaperSubmissionContract,
  getDOIRegistryContract,
  getReviewManagerContract,
  getScienceTokenContract,
  getIncentiveDistributionContract,
  getGovernanceDAOContract,
  getZKPVerifierContract,
  getSafeEthereumAccount
} from './contractService';

// Import paper services
import {
  publishPaper
} from './paperService';

// Import review services
import {
  submitReview,
  getReviewerReputation
} from './reviewService';

// Import token services
import {
  getRewardTokens
} from './tokenService';

// Import signature services
import {
  signMessage,
  verifySignature
} from './signatureService';

// Import governance services
import {
  submitProposal,
  castVote,
  getProposals,
  submitDispute,
  voteOnDispute
} from './governanceService';

// Import metadata services
import {
  storePaperMetadata,
  getPaperMetadata,
  updateUserProfile,
  getUserProfile
} from './metadataService';

// Export all functions
export {
  // Ethereum
  connectWallet,
  isWalletConnected,
  getEthBalance,
  getEthPrice,
  calculateEthValue,
  getEthStakingAPR,
  calculateStakingRewards,
  estimateTransactionCost,
  getOpenChainContract,
  getEthereumProvider,
  
  // Solana
  getSolanaConnection,
  
  // Contract instances
  getPaperSubmissionContract,
  getDOIRegistryContract,
  getReviewManagerContract,
  getScienceTokenContract,
  getIncentiveDistributionContract,
  getGovernanceDAOContract,
  getZKPVerifierContract,
  getSafeEthereumAccount,
  
  // Paper operations
  publishPaper,
  
  // Review operations
  submitReview,
  getReviewerReputation,
  
  // Token operations
  getRewardTokens,
  
  // Signature operations
  signMessage,
  verifySignature,
  
  // DAO Governance operations
  submitProposal,
  castVote,
  getProposals,
  submitDispute,
  voteOnDispute,
  
  // Metadata operations (Supabase)
  storePaperMetadata,
  getPaperMetadata,
  updateUserProfile,
  getUserProfile
};
