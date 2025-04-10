
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import OpenChainPaperABI from '../contracts/OpenChainPaperABI.json';

// Contract addresses - would be set after deployment
const OPENCHAIN_CONTRACT_ADDRESS = '0x123456789abcdef123456789abcdef123456789a'; // Replace with actual deployed address

// Web3 provider
export const getEthereumProvider = () => {
  if (window.ethereum) {
    return new Web3(window.ethereum);
  }
  // Fallback to an HTTP provider (for read-only operations)
  return new Web3('https://eth-mainnet.g.alchemy.com/v2/demo');
};

// Get contract instance
export const getOpenChainContract = () => {
  const web3 = getEthereumProvider();
  return new web3.eth.Contract(OpenChainPaperABI as AbiItem[], OPENCHAIN_CONTRACT_ADDRESS);
};

// Connect wallet
export const connectWallet = async (): Promise<string[]> => {
  if (!window.ethereum) {
    throw new Error('No Ethereum provider found. Please install MetaMask.');
  }
  
  try {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    return accounts;
  } catch (error) {
    console.error('Error connecting to wallet:', error);
    throw error;
  }
};

// Check if wallet is connected
export const isWalletConnected = async (): Promise<boolean> => {
  if (!window.ethereum) {
    return false;
  }
  
  try {
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    return accounts.length > 0;
  } catch (error) {
    console.error('Error checking wallet connection:', error);
    return false;
  }
};

// Get ETH balance of an address
export const getEthBalance = async (address: string): Promise<string> => {
  try {
    const web3 = getEthereumProvider();
    const weiBalance = await web3.eth.getBalance(address);
    
    // Convert wei to ETH (1 ETH = 10^18 wei)
    const ethBalance = web3.utils.fromWei(weiBalance, 'ether');
    console.log(`ETH Balance for ${address}: ${ethBalance} ETH`);
    
    return ethBalance;
  } catch (error) {
    console.error('Error getting ETH balance:', error);
    throw error;
  }
};

// Get current ETH price in USD (mock implementation)
export const getEthPrice = async (): Promise<number> => {
  try {
    // In a real app, you would fetch this from a price API like CoinGecko
    // For demo purposes, we're using a mock value
    // Example API call would be:
    // const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
    // const data = await response.json();
    // return data.ethereum.usd;
    
    // Mock ETH price for demo
    const mockPrice = 2500 + Math.random() * 1000;
    console.log(`Current ETH price: $${mockPrice.toFixed(2)}`);
    return Number(mockPrice.toFixed(2));
  } catch (error) {
    console.error('Error fetching ETH price:', error);
    return 2500; // Fallback price
  }
};

// Calculate ETH value in USD
export const calculateEthValue = async (ethAmount: string): Promise<number> => {
  try {
    const ethPrice = await getEthPrice();
    const valueInUsd = Number(ethAmount) * ethPrice;
    console.log(`${ethAmount} ETH = $${valueInUsd.toFixed(2)} USD`);
    return Number(valueInUsd.toFixed(2));
  } catch (error) {
    console.error('Error calculating ETH value:', error);
    throw error;
  }
};

// Get staking APR (Annual Percentage Rate) - mock implementation
export const getEthStakingAPR = async (): Promise<number> => {
  // In a real app, you would fetch this from a staking provider API
  // Mock staking APR for demo (between 3% and 5%)
  const mockAPR = 3 + Math.random() * 2;
  console.log(`Current ETH staking APR: ${mockAPR.toFixed(2)}%`);
  return Number(mockAPR.toFixed(2));
};

// Calculate potential staking rewards
export const calculateStakingRewards = async (ethAmount: string, months: number): Promise<number> => {
  try {
    const apr = await getEthStakingAPR();
    const annualReward = Number(ethAmount) * (apr / 100);
    const monthlyReward = annualReward / 12;
    const totalReward = monthlyReward * months;
    console.log(`Staking ${ethAmount} ETH for ${months} months at ${apr}% APR would yield approximately ${totalReward.toFixed(4)} ETH`);
    return Number(totalReward.toFixed(4));
  } catch (error) {
    console.error('Error calculating staking rewards:', error);
    throw error;
  }
};

// Calculate gas cost in USD (for informational purposes)
export const estimateTransactionCost = async (gasUnits: number): Promise<{ethCost: string, usdCost: number}> => {
  try {
    const web3 = getEthereumProvider();
    
    // Get current gas price in wei
    const gasPriceWei = await web3.eth.getGasPrice();
    
    // Calculate total gas cost in wei
    const gasCostWei = BigInt(gasPriceWei) * BigInt(gasUnits);
    
    // Convert wei to ETH
    const gasCostEth = web3.utils.fromWei(gasCostWei.toString(), 'ether');
    
    // Calculate USD cost
    const ethPrice = await getEthPrice();
    const usdCost = Number(gasCostEth) * ethPrice;
    
    console.log(`Estimated transaction cost: ${gasCostEth} ETH ($${usdCost.toFixed(2)} USD)`);
    
    return {
      ethCost: gasCostEth,
      usdCost: Number(usdCost.toFixed(2))
    };
  } catch (error) {
    console.error('Error estimating transaction cost:', error);
    throw error;
  }
};
