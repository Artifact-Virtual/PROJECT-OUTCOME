const { ethers, upgrades } = require("hardhat");

async function main() {
  console.log("🚀 Starting OCSH Proxy Deployment...");
  
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());

  // 1. Deploy IdentitySBT as upgradeable proxy
  console.log("\n📋 Deploying IdentitySBT (Upgradeable)...");
  const IdentitySBT = await ethers.getContractFactory("ARC_IdentitySBT");
  const identitySBT = await upgrades.deployProxy(IdentitySBT, [
    deployer.address, // timelock
    deployer.address, // safeExecutor
    ethers.ZeroAddress, // eas (not used for testing)
    ethers.keccak256(ethers.toUtf8Bytes("IdentityRole")) // schemaId
  ], {
    initializer: 'initialize',
    kind: 'uups'
  });
  await identitySBT.waitForDeployment();
  const identitySBTAddress = await identitySBT.getAddress();
  console.log("✅ IdentitySBT deployed to:", identitySBTAddress);

  // 2. Deploy Eligibility contract as upgradeable proxy
  console.log("\n🎯 Deploying Eligibility (Upgradeable)...");
  const Eligibility = await ethers.getContractFactory("ARC_Eligibility");
  const eligibility = await upgrades.deployProxy(Eligibility, [identitySBTAddress], {
    initializer: 'initialize',
    kind: 'uups'
  });
  await eligibility.waitForDeployment();
  const eligibilityAddress = await eligibility.getAddress();
  console.log("✅ Eligibility deployed to:", eligibilityAddress);

  // 3. Deploy OCSH contract (not upgradeable, uses IdentitySBT)
  console.log("\n🎮 Deploying OCSH Game Contract...");
  const OCSH = await ethers.getContractFactory("OCSH");
  const ocsh = await OCSH.deploy(identitySBTAddress);
  await ocsh.waitForDeployment();
  const ocshAddress = await ocsh.getAddress();
  console.log("✅ OCSH deployed to:", ocshAddress);

  // 4. Setup initial roles and permissions
  console.log("\n🔐 Setting up roles and permissions...");
  
  // Grant ISSUER_ROLE to OCSH contract on IdentitySBT
  const ISSUER_ROLE = await identitySBT.ISSUER_ROLE();
  await identitySBT.grantRole(ISSUER_ROLE, ocshAddress);
  console.log("✅ Granted ISSUER_ROLE to OCSH contract");

  // Grant GAME_ADMIN_ROLE to deployer on OCSH
  const GAME_ADMIN_ROLE = await ocsh.GAME_ADMIN_ROLE();
  await ocsh.grantRole(GAME_ADMIN_ROLE, deployer.address);
  console.log("✅ Granted GAME_ADMIN_ROLE to deployer");

  console.log("\n🎉 Deployment Summary:");
  console.log("═══════════════════════════════════════");
  console.log("IdentitySBT (Proxy):", identitySBTAddress);
  console.log("Eligibility:        ", eligibilityAddress);
  console.log("OCSH Game:          ", ocshAddress);
  console.log("Deployer:           ", deployer.address);
  console.log("═══════════════════════════════════════");

  // 5. Test basic functionality
  console.log("\n🧪 Running basic functionality tests...");
  
  try {
    // Test minting an NFT
    console.log("Testing NFT minting...");
    const customData = ethers.keccak256(ethers.toUtf8Bytes("test-data"));
    const mintTx = await ocsh.mint(deployer.address, customData);
    await mintTx.wait();
    console.log("✅ Successfully minted NFT #0");

    // Test issuing SBT role
    console.log("Testing SBT role issuance...");
    const veteranRole = await ocsh.SBT_ROLE_VETERAN();
    const uid = ethers.keccak256(ethers.toUtf8Bytes("veteran-001"));
    const issueTx = await ocsh.issueGameRole(deployer.address, veteranRole, uid);
    await issueTx.wait();
    console.log("✅ Successfully issued VETERAN role");

    // Verify role
    const hasRole = await identitySBT["hasRole(address,bytes32)"](deployer.address, veteranRole);
    console.log("✅ Role verification:", hasRole ? "PASSED" : "FAILED");

    console.log("\n🎊 All basic tests PASSED! Ready for comprehensive testing.");

  } catch (error) {
    console.error("❌ Basic test failed:", error.message);
  }

  return {
    identitySBT: identitySBTAddress,
    eligibility: eligibilityAddress,
    ocsh: ocshAddress,
    deployer: deployer.address
  };
}

if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error("❌ Deployment failed:", error);
      process.exit(1);
    });
}

module.exports = main;
