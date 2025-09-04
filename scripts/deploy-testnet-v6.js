const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  // Deploy IdentitySBT
  const IdentitySBTFactory = await ethers.getContractFactory("ARC_IdentitySBT");
  const identitySBT = await IdentitySBTFactory.deploy();
  await identitySBT.waitForDeployment();
  const identitySBTAddress = await identitySBT.getAddress();
  console.log("IdentitySBT deployed to:", identitySBTAddress);

  // Initialize IdentitySBT
  const schemaId = ethers.keccak256(ethers.toUtf8Bytes("IdentityRole(uint256 role,uint256 weight,address recipient)"));
  const easAddress = "0x0000000000000000000000000000000000000000"; // Mock EAS address
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

  await identitySBT.setRoleConfig(VETERAN_ROLE, ethers.parseEther("0.2"), 365 * 24 * 60 * 60); // 20% weight, 1 year expiry
  await identitySBT.setRoleConfig(COMMANDER_ROLE, ethers.parseEther("0.3"), 365 * 24 * 60 * 60);
  await identitySBT.setRoleConfig(TRADER_ROLE, ethers.parseEther("0.15"), 365 * 24 * 60 * 60);

  console.log("Default SBT roles configured");

  // Save deployment addresses
  const deploymentInfo = {
    network: "local",
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

  console.log("\n=== DEPLOYMENT COMPLETE ===");
  console.log(JSON.stringify(deploymentInfo, null, 2));

  // Write to file
  const fs = require('fs');
  fs.writeFileSync('./deployment-local.json', JSON.stringify(deploymentInfo, null, 2));
  console.log("Deployment info saved to deployment-local.json");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
