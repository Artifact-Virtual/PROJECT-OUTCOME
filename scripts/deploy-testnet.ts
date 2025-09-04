const hardhat = require("hardhat");
const { ethers } = hardhat;

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  // Deploy EAS mock for local testing (if not available)
  let easAddress: string;
  try {
    const EASMock = await ethers.getContractFactory("EASMock");
    const eas = await EASMock.deploy();
    await eas.deployed();
    easAddress = eas.address;
    console.log("EASMock deployed to:", eas.address);
  } catch {
    // If EASMock doesn't exist, use a mock address
    easAddress = "0x0000000000000000000000000000000000000000";
    console.log("Using mock EAS address:", easAddress);
  }

  // Deploy IdentitySBT
  const IdentitySBTFactory = await ethers.getContractFactory("ARC_IdentitySBT");
  const identitySBT = await IdentitySBTFactory.deploy();
  await identitySBT.deployed();
  console.log("IdentitySBT deployed to:", identitySBT.address);

  // Initialize IdentitySBT
  const schemaId = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("IdentityRole(uint256 role,uint256 weight,address recipient)"));
  await identitySBT.initialize(deployer.address, deployer.address, easAddress, schemaId);
  console.log("IdentitySBT initialized");

  // Deploy Eligibility contract
  const EligibilityFactory = await ethers.getContractFactory("ARC_Eligibility");
  const eligibility = await EligibilityFactory.deploy();
  await eligibility.deployed();
  console.log("Eligibility deployed to:", eligibility.address);

  // Initialize Eligibility
  await eligibility.initialize(identitySBT.address);
  console.log("Eligibility initialized");

  // Deploy the library first
  const LibFactory = await ethers.getContractFactory("OCSHLib");
  const lib = await LibFactory.deploy();
  await lib.deployed();
  console.log("OCSHLib deployed to:", lib.address);

  // Deploy the main contract, linking the library and SBT
  const OCSHFactory = await ethers.getContractFactory("OCSH", {
    libraries: {
      OCSHLib: lib.address,
    },
  });
  const ocsh = await OCSHFactory.deploy(identitySBT.address);
  await ocsh.deployed();
  console.log("OCSH deployed to:", ocsh.address);

  // Grant ISSUER_ROLE to OCSH contract on IdentitySBT
  const ISSUER_ROLE = await identitySBT.ISSUER_ROLE();
  await identitySBT.grantRole(ISSUER_ROLE, ocsh.address);
  console.log("Granted ISSUER_ROLE to OCSH contract");

  // Grant GAME_ADMIN_ROLE to deployer on OCSH
  const GAME_ADMIN_ROLE = await ocsh.GAME_ADMIN_ROLE();
  await ocsh.grantRole(GAME_ADMIN_ROLE, deployer.address);
  console.log("Granted GAME_ADMIN_ROLE to deployer");

  // Setup default roles in IdentitySBT
  const VETERAN_ROLE = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("VETERAN"));
  const COMMANDER_ROLE = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("COMMANDER"));
  const TRADER_ROLE = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("TRADER"));

  await identitySBT.setRoleConfig(VETERAN_ROLE, ethers.utils.parseEther("0.2"), 365 * 24 * 60 * 60); // 20% weight, 1 year expiry
  await identitySBT.setRoleConfig(COMMANDER_ROLE, ethers.utils.parseEther("0.3"), 365 * 24 * 60 * 60);
  await identitySBT.setRoleConfig(TRADER_ROLE, ethers.utils.parseEther("0.15"), 365 * 24 * 60 * 60);

  console.log("Default SBT roles configured");

  // Save deployment addresses
  const deploymentInfo = {
    network: "local",
    deployer: deployer.address,
    contracts: {
      IdentitySBT: identitySBT.address,
      Eligibility: eligibility.address,
      OCSHLib: lib.address,
      OCSH: ocsh.address,
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
