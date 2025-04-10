
# OpenChain Science Publishing Platform

## Overview
OpenChain is a decentralized scientific publishing platform built on blockchain technology. This platform allows researchers to submit papers, get peer reviews, receive DOI registrations, and earn rewards through tokenization.

## Prerequisites
Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or later)
- [npm](https://www.npmjs.com/) (v8 or later)
- [Git](https://git-scm.com/)
- [VS Code](https://code.visualstudio.com/)
- [MetaMask](https://metamask.io/) (browser extension)
- solidity

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd openchain-publish
```

### 2. Install Dependencies
```bash
npm install
```



Note: These are development keys. In a production environment, never commit your private keys to the repository.

### 4. Compile Smart Contracts
```bash
npx hardhat compile
```

This command compiles the Solidity smart contracts in the `contracts/` directory.

### 5. Deploy Smart Contracts (Optional)
To deploy the contracts to a local Hardhat network:

```bash
npx hardhat node
```

Then in a separate terminal:

```bash
npx hardhat run scripts/deploy.js --network localhost
```

To deploy to Mumbai testnet:

```bash
npx hardhat run scripts/deploy.js --network mumbai
```

Note: Make sure to update the contract addresses in `src/services/contractService.ts` after deployment.

### 6. Start the Development Server
```bash
npm run dev
```

This command starts the Vite development server. The application will be available at [http://localhost:8080](http://localhost:8080).

## Project Structure

```
openchain-publish/
├── contracts/           # Solidity smart contracts
│   ├── DOIRegistry.sol
│   ├── GovernanceDAO.sol
│   ├── IncentiveDistribution.sol
│   ├── PaperSubmission.sol
│   ├── ReviewManager.sol
│   ├── Token.sol
│   └── ZKPVerifier.sol
├── scripts/             # Deployment scripts
│   └── deploy.js
├── src/
│   ├── artifacts/       # Compiled contract ABIs
│   ├── components/      # React components
│   ├── config/          # Configuration files
│   ├── contexts/        # React contexts
│   ├── data/            # Static data
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility libraries
│   ├── pages/           # Page components
│   └── services/        # Services for API calls
├── .env                 # Environment variables
├── hardhat.config.js    # Hardhat configuration
└── vite.config.ts       # Vite configuration
```

## Features
- Submit research papers to the blockchain
- Peer review management
- DOI registration
- Tokenized incentives for researchers and reviewers
- DAO governance for community decisions
- ZK proofs for privacy-preserving verification

## Troubleshooting

### Contract Compilation Errors
If you encounter errors during contract compilation, ensure you have the correct version of Solidity specified in `hardhat.config.js` and that all dependencies are correctly installed.

### RPC Connection Issues
If you experience issues connecting to the Polygon or Mumbai networks:
1. Check your internet connection
2. Verify that your `.env` file contains the correct RPC URLs
3. Ensure your MetaMask is connected to the appropriate network

### MetaMask Integration
To interact with the blockchain features:
1. Install the MetaMask browser extension
2. Connect MetaMask to the appropriate network (Mumbai testnet for development)
3. Import a wallet using the private key or create a new one
4. Request test MATIC from a faucet if testing on Mumbai

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## License
This project is licensed under the MIT License - see the LICENSE file for details.
