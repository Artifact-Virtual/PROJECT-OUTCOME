const hardhat = require("hardhat");
const { ethers } = hardhat;

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying to Ganache with account:", deployer.address);
  console.log("Account balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)));

  // Deploy EAS mock for local testing
  const EASMock = await ethers.getContractFactory("EASMock");
  const eas = await EASMock.deploy();
  await eas.waitForDeployment();
  const easAddress = await eas.getAddress();
  console.log("EASMock deployed to:", easAddress);

  // Deploy IdentitySBT
  const IdentitySBTFactory = await ethers.getContractFactory("ARC_IdentitySBT");
  const identitySBT = await IdentitySBTFactory.deploy();
  await identitySBT.waitForDeployment();
  const identitySBTAddress = await identitySBT.getAddress();
  console.log("IdentitySBT deployed to:", identitySBTAddress);

  // Initialize IdentitySBT
  const schemaId = ethers.keccak256(ethers.toUtf8Bytes("IdentityRole(uint256 role,uint256 weight,address recipient)"));
  await identitySBT.initialize(deployer.address, deployer.address, easAddress, schemaId);
  console.log("IdentitySBT initialized");

  // Deploy Eligibility contract
  const EligibilityFactory = await ethers.getContractFactory("ARC_Eligibility");
  const eligibility = await EligibilityFactory.deploy();
  await eligibility.waitForDeployment();
  const eligibilityAddress = await eligibility.getAddress();
  console.log("Eligibility deployed to:", eligibilityAddress);

  // Initialize Eligibility
  await eligibility.initialize(identitySBTAddress);
  console.log("Eligibility initialized");

  // Deploy the library first
  const LibFactory = await ethers.getContractFactory("OCSHLib");
  const lib = await LibFactory.deploy();
  await lib.waitForDeployment();
  const libAddress = await lib.getAddress();
  console.log("OCSHLib deployed to:", libAddress);

  // Deploy the main contract, linking the library and SBT
  const OCSHFactory = await ethers.getContractFactory("OCSH", {
    libraries: {
      OCSHLib: libAddress,
    },
  });
  const ocsh = await OCSHFactory.deploy(identitySBTAddress);
  await ocsh.waitForDeployment();
  const ocshAddress = await ocsh.getAddress();
  console.log("OCSH deployed to:", ocshAddress);

  // Grant ISSUER_ROLE to OCSH contract on IdentitySBT
  const ISSUER_ROLE = await identitySBT.ISSUER_ROLE();
  await identitySBT.grantRole(ISSUER_ROLE, ocshAddress);
  console.log("Granted ISSUER_ROLE to OCSH contract");

  // Grant GAME_ADMIN_ROLE to deployer on OCSH
  const GAME_ADMIN_ROLE = await ocsh.GAME_ADMIN_ROLE();
  await ocsh.grantRole(GAME_ADMIN_ROLE, deployer.address);
  console.log("Granted GAME_ADMIN_ROLE to deployer");

  // Setup default roles in IdentitySBT
  const VETERAN_ROLE = ethers.keccak256(ethers.toUtf8Bytes("VETERAN"));
  const COMMANDER_ROLE = ethers.keccak256(ethers.toUtf8Bytes("COMMANDER"));
  const TRADER_ROLE = ethers.keccak256(ethers.toUtf8Bytes("TRADER"));

  await identitySBT.setRoleConfig(VETERAN_ROLE, ethers.parseEther("0.2"), 365 * 24 * 60 * 60);
  await identitySBT.setRoleConfig(COMMANDER_ROLE, ethers.parseEther("0.3"), 365 * 24 * 60 * 60);
  await identitySBT.setRoleConfig(TRADER_ROLE, ethers.parseEther("0.15"), 365 * 24 * 60 * 60);

  console.log("Default SBT roles configured");

  // Save deployment addresses
  const deploymentInfo = {
    network: "ganache",
    deployer: deployer.address,
    contracts: {
      IdentitySBT: identitySBTAddress,
      Eligibility: eligibilityAddress,
      OCSHLib: libAddress,
      OCSH: ocshAddress,
      EAS: easAddress
    },
    timestamp: new Date().toISOString()
  };

  console.log("\n=== GANACHE DEPLOYMENT COMPLETE ===");
  console.log(JSON.stringify(deploymentInfo, null, 2));

  // Write to file
  const fs = require('fs');
  fs.writeFileSync('./deployment-ganache.json', JSON.stringify(deploymentInfo, null, 2));
  console.log("Deployment info saved to deployment-ganache.json");

  // Test basic functionality
  console.log("\n=== TESTING BASIC FUNCTIONALITY ===");

  // Test SBT role issuance
  const testRole = ethers.keccak256(ethers.toUtf8Bytes("TEST_ROLE"));
  const testUid = ethers.keccak256(ethers.toUtf8Bytes("test-uid-" + Date.now()));

  await identitySBT.issue(deployer.address, testRole, testUid);
  console.log("Test SBT issued successfully");

  // Test OCSH minting
  await ocsh.mint(deployer.address, ethers.keccak256(ethers.toUtf8Bytes("test-data")));
  console.log("Test OCSH NFT minted successfully");

  console.log("\n=== ALL TESTS PASSED ===");
}

main().catch((error) => {
  console.error("Deployment failed:", error);
  process.exitCode = 1;
});
