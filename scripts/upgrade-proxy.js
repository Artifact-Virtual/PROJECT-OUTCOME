const { ethers, upgrades } = require("hardhat");

async function main() {
  console.log("🔄 Starting OCSH Proxy Upgrade...");

  const [deployer] = await ethers.getSigners();
  console.log("Upgrading contracts with account:", deployer.address);

  // Get current proxy addresses (these should be stored somewhere, like in a deployment file)
  // For now, we'll use hardcoded addresses - in production, read from a deployment file
  const IDENTITY_SBT_PROXY = process.env.IDENTITY_SBT_PROXY || "0x0000000000000000000000000000000000000000";
  const ELIGIBILITY_PROXY = process.env.ELIGIBILITY_PROXY || "0x0000000000000000000000000000000000000000";

  if (IDENTITY_SBT_PROXY === "0x0000000000000000000000000000000000000000") {
    console.error("❌ Please set IDENTITY_SBT_PROXY environment variable");
    process.exit(1);
  }

  // 1. Upgrade IdentitySBT
  console.log("\n📋 Upgrading IdentitySBT...");
  const IdentitySBT = await ethers.getContractFactory("ARC_IdentitySBT");
  const upgradedIdentitySBT = await upgrades.upgradeProxy(IDENTITY_SBT_PROXY, IdentitySBT);
  await upgradedIdentitySBT.waitForDeployment();
  console.log("✅ IdentitySBT upgraded at:", await upgradedIdentitySBT.getAddress());

  // 2. Upgrade Eligibility (if proxy exists)
  if (ELIGIBILITY_PROXY !== "0x0000000000000000000000000000000000000000") {
    console.log("\n🎯 Upgrading Eligibility...");
    const Eligibility = await ethers.getContractFactory("ARC_Eligibility");
    const upgradedEligibility = await upgrades.upgradeProxy(ELIGIBILITY_PROXY, Eligibility);
    await upgradedEligibility.waitForDeployment();
    console.log("✅ Eligibility upgraded at:", await upgradedEligibility.getAddress());
  }

  // 3. Verify upgrade
  console.log("\n🔍 Verifying upgrade...");
  const version = await upgradedIdentitySBT.version();
  console.log("✅ New IdentitySBT version:", version);

  console.log("\n🎉 Upgrade Summary:");
  console.log("═══════════════════════════════════════");
  console.log("IdentitySBT Proxy:", IDENTITY_SBT_PROXY);
  console.log("Eligibility Proxy:", ELIGIBILITY_PROXY);
  console.log("═══════════════════════════════════════");

  return {
    identitySBT: IDENTITY_SBT_PROXY,
    eligibility: ELIGIBILITY_PROXY,
    deployer: deployer.address
  };
}

if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error("❌ Upgrade failed:", error);
      process.exit(1);
    });
}

module.exports = main;
