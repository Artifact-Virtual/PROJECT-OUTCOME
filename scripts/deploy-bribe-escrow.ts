import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying BribeEscrow with account:", deployer.address);

  const Factory = await ethers.getContractFactory("BribeEscrow");
  const escrow = await Factory.deploy();
  await escrow.waitForDeployment();

  console.log("BribeEscrow deployed to:", await escrow.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
