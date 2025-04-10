
import { Connection, clusterApiUrl, PublicKey } from '@solana/web3.js';

// Solana connection
export const getSolanaConnection = () => {
  return new Connection(clusterApiUrl('devnet'));
};

// Add more Solana-specific functions here as needed
