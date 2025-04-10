
# Contract Artifacts

This directory contains the compiled artifacts of the smart contracts.

After compiling the contracts with `npx hardhat compile`, the artifacts will be generated here in the following structure:

- `contracts/`
  - `PaperSubmission.sol/`
    - `PaperSubmission.json`
  - `DOIRegistry.sol/`
    - `DOIRegistry.json`
  - ...and so on for each contract

These artifacts are used by the frontend to interact with the deployed contracts.
