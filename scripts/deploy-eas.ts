// Deploy the real Ethereum Attestation Service (EAS) contract locally for testing
import { ethers } from "hardhat";

async function main() {
  console.log("Deploying real EAS contract...");

  // Deploy the EAS contract
  const EAS = await ethers.getContractFactory("EAS");
  const eas = await EAS.deploy();
  await eas.waitForDeployment();

  console.log("EAS deployed to:", await eas.getAddress());

  // Optionally deploy SchemaRegistry if needed
  const SchemaRegistry = await ethers.getContractFactory("SchemaRegistry");
  const schemaRegistry = await SchemaRegistry.deploy();
  await schemaRegistry.waitForDeployment();

  console.log("SchemaRegistry deployed to:", await schemaRegistry.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
