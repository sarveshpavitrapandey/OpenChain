
import { getEthereumProvider } from './ethereumService';
import PaperSubmissionArtifact from '../artifacts/contracts/PaperSubmission.sol/PaperSubmission.json';
import DOIRegistryArtifact from '../artifacts/contracts/DOIRegistry.sol/DOIRegistry.json';
import ReviewManagerArtifact from '../artifacts/contracts/ReviewManager.sol/ReviewManager.json';
import ScienceTokenArtifact from '../artifacts/contracts/Token.sol/ScienceToken.json';
import IncentiveDistributionArtifact from '../artifacts/contracts/IncentiveDistribution.sol/IncentiveDistribution.json';
import ScienceDAOArtifact from '../artifacts/contracts/GovernanceDAO.sol/ScienceDAO.json';
import ZKPVerifierArtifact from '../artifacts/contracts/ZKPVerifier.sol/ZKPVerifier.json';

// Contract addresses - would be set after deployment
const PAPER_SUBMISSION_ADDRESS = '0xdEF456789abcdef123456789abcdef123456789a'; // Replace with deployed address after deployment
const DOI_REGISTRY_ADDRESS = '0xaBC456789abcdef123456789abcdef123456789a'; // Replace after deployment
const REVIEW_MANAGER_ADDRESS = '0x789456789abcdef123456789abcdef123456789a'; // Replace after deployment
const SCIENCE_TOKEN_ADDRESS = '0x456456789abcdef123456789abcdef123456789a'; // Replace after deployment
const INCENTIVE_DISTRIBUTION_ADDRESS = '0x123456789abcdef123456789abcdef123456789b'; // Replace after deployment
const SCIENCE_DAO_ADDRESS = '0x123456789abcdef123456789abcdef123456789c'; // Replace after deployment
const ZKP_VERIFIER_ADDRESS = '0x123456789abcdef123456789abcdef123456789d'; // Replace after deployment

// Helper function to safely get Ethereum accounts with proper type checking
export const getSafeEthereumAccount = async (): Promise<string> => {
  if (!window.ethereum) {
    throw new Error('No Ethereum provider found');
  }
  
  try {
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    
    if (!accounts || !Array.isArray(accounts) || accounts.length === 0) {
      throw new Error('No connected accounts found');
    }
    
    const account = accounts[0];
    
    if (typeof account !== 'string' || !account) {
      throw new Error('Invalid account format');
    }
    
    return account;
  } catch (err) {
    console.error('Error getting ethereum accounts:', err);
    throw new Error('Failed to get Ethereum accounts');
  }
};

// Get PaperSubmission contract instance
export const getPaperSubmissionContract = () => {
  const web3 = getEthereumProvider();
  return new web3.eth.Contract(PaperSubmissionArtifact.abi, PAPER_SUBMISSION_ADDRESS);
};

// Get DOIRegistry contract instance
export const getDOIRegistryContract = () => {
  const web3 = getEthereumProvider();
  return new web3.eth.Contract(DOIRegistryArtifact.abi, DOI_REGISTRY_ADDRESS);
};

// Get ReviewManager contract instance
export const getReviewManagerContract = () => {
  const web3 = getEthereumProvider();
  return new web3.eth.Contract(ReviewManagerArtifact.abi, REVIEW_MANAGER_ADDRESS);
};

// Get ScienceToken contract instance
export const getScienceTokenContract = () => {
  const web3 = getEthereumProvider();
  return new web3.eth.Contract(ScienceTokenArtifact.abi, SCIENCE_TOKEN_ADDRESS);
};

// Get IncentiveDistribution contract instance
export const getIncentiveDistributionContract = () => {
  const web3 = getEthereumProvider();
  return new web3.eth.Contract(IncentiveDistributionArtifact.abi, INCENTIVE_DISTRIBUTION_ADDRESS);
};

// Get GovernanceDAO contract instance
export const getGovernanceDAOContract = () => {
  const web3 = getEthereumProvider();
  return new web3.eth.Contract(ScienceDAOArtifact.abi, SCIENCE_DAO_ADDRESS);
};

// Get ZKPVerifier contract instance
export const getZKPVerifierContract = () => {
  const web3 = getEthereumProvider();
  return new web3.eth.Contract(ZKPVerifierArtifact.abi, ZKP_VERIFIER_ADDRESS);
};
