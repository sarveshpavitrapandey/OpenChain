
const hre = require("hardhat");

async function main() {
  console.log("Deploying contracts...");

  // Get signer
  const [signer] = await hre.ethers.getSigners();
  console.log(`Deploying contracts with the account: ${signer.address}`);

  // Deploy PaperSubmission contract
  const PaperSubmission = await hre.ethers.getContractFactory("PaperSubmission");
  const paperSubmission = await PaperSubmission.deploy();
  await paperSubmission.waitForDeployment();

  console.log("PaperSubmission deployed to:", await paperSubmission.getAddress());

  // Deploy DOIRegistry contract
  const DOIRegistry = await hre.ethers.getContractFactory("DOIRegistry");
  const doiRegistry = await DOIRegistry.deploy();
  await doiRegistry.waitForDeployment();

  console.log("DOIRegistry deployed to:", await doiRegistry.getAddress());

  // Deploy ReviewManager contract
  const ReviewManager = await hre.ethers.getContractFactory("ReviewManager");
  const reviewManager = await ReviewManager.deploy();
  await reviewManager.waitForDeployment();

  console.log("ReviewManager deployed to:", await reviewManager.getAddress());

  // Deploy ScienceToken (ERC-20) contract
  const ScienceToken = await hre.ethers.getContractFactory("ScienceToken");
  const scienceToken = await ScienceToken.deploy(
    "ScienceToken",
    "SCT",
    18,
    hre.ethers.parseEther("100000000") // 100 million tokens max supply
  );
  await scienceToken.waitForDeployment();

  console.log("ScienceToken deployed to:", await scienceToken.getAddress());

  // Deploy IncentiveDistribution contract
  const IncentiveDistribution = await hre.ethers.getContractFactory("IncentiveDistribution");
  const incentiveDistribution = await IncentiveDistribution.deploy(
    await scienceToken.getAddress(),
    await reviewManager.getAddress()
  );
  await incentiveDistribution.waitForDeployment();

  console.log("IncentiveDistribution deployed to:", await incentiveDistribution.getAddress());

  // Set up ScienceToken to allow IncentiveDistribution to mint tokens
  const MINTER_ROLE = await scienceToken.MINTER_ROLE();
  await scienceToken.grantRole(MINTER_ROLE, await incentiveDistribution.getAddress());
  console.log("Granted minter role to IncentiveDistribution");

  // Deploy TimelockController for DAO governance
  const minDelay = 1 * 24 * 60 * 60; // 1 day
  const proposers = [signer.address];
  const executors = [signer.address];
  const admin = signer.address;

  const TimelockController = await hre.ethers.getContractFactory("TimelockController");
  const timelockController = await TimelockController.deploy(
    minDelay,
    proposers,
    executors,
    admin
  );
  await timelockController.waitForDeployment();

  console.log("TimelockController deployed to:", await timelockController.getAddress());

  // Deploy ScienceDAO contract
  const ScienceDAO = await hre.ethers.getContractFactory("ScienceDAO");
  const scienceDAO = await ScienceDAO.deploy(
    await scienceToken.getAddress(),
    await timelockController.getAddress()
  );
  await scienceDAO.waitForDeployment();

  console.log("ScienceDAO deployed to:", await scienceDAO.getAddress());

  // Deploy ZKPVerifier contract
  const ZKPVerifier = await hre.ethers.getContractFactory("ZKPVerifier");
  const zkpVerifier = await ZKPVerifier.deploy();
  await zkpVerifier.waitForDeployment();

  console.log("ZKPVerifier deployed to:", await zkpVerifier.getAddress());

  // Log the deployment information for easy update in the frontend
  console.log(`
  Update the contract addresses in src/services/contractService.ts:
  
  const PAPER_SUBMISSION_ADDRESS = '${await paperSubmission.getAddress()}';
  const DOI_REGISTRY_ADDRESS = '${await doiRegistry.getAddress()}';
  const REVIEW_MANAGER_ADDRESS = '${await reviewManager.getAddress()}';
  const SCIENCE_TOKEN_ADDRESS = '${await scienceToken.getAddress()}';
  const INCENTIVE_DISTRIBUTION_ADDRESS = '${await incentiveDistribution.getAddress()}';
  const SCIENCE_DAO_ADDRESS = '${await scienceDAO.getAddress()}';
  const ZKP_VERIFIER_ADDRESS = '${await zkpVerifier.getAddress()}';
  `);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
