
# Smart Contracts

This directory contains the Solidity smart contracts for the decentralized scientific publishing platform.

## Compilation

To compile the contracts and generate the ABIs, run:

```bash
npx hardhat compile
```

This will generate the artifacts in the `src/artifacts` directory, which are then used by the frontend to interact with the contracts.

## Deployment

For local development and testing, you can deploy the contracts to a local Hardhat network:

```bash
npx hardhat node
npx hardhat run scripts/deploy.js --network localhost
```

For production, you can deploy to Polygon or Mumbai testnet:

```bash
npx hardhat run scripts/deploy.js --network polygon
# or
npx hardhat run scripts/deploy.js --network mumbai
```

Make sure to update the contract addresses in the frontend after deployment.
