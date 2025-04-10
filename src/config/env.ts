// Environment variables configuration
export const env = {
  // Network configuration
  privateKey: import.meta.env.VITE_PRIVATE_KEY || process.env.PRIVATE_KEY,
  mumbaiRpcUrl: import.meta.env.VITE_MUMBAI_RPC_URL || process.env.MUMBAI_RPC_URL,
  polygonRpcUrl: import.meta.env.VITE_POLYGON_RPC_URL || process.env.POLYGON_RPC_URL,
  
  // Development mode
  isDevelopment: import.meta.env.DEV,
  
  // Other API keys
  geminiApiKey: import.meta.env.VITE_GEMINI_API_KEY,
};

// Log available configuration in development
if (env.isDevelopment) {
  console.log('Environment configuration:');
  console.log('- Mumbai RPC URL available:', !!env.mumbaiRpcUrl);
  console.log('- Polygon RPC URL available:', !!env.polygonRpcUrl);
  console.log('- Private key available:', !!env.privateKey);
  console.log('- Gemini API key available:', !!env.geminiApiKey);
}
