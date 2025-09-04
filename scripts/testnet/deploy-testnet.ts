
import { ethers } from "hardhat";

async function main() {
  // Deploy the library first
  const LibFactory = await ethers.getContractFactory("OCSHLib");
  const lib = await LibFactory.deploy();
  await lib.waitForDeployment?.();
  console.log("OCSHLib deployed to:", lib.target || lib.address || lib.address);

  // Deploy the main contract, linking the library
  const OCSHFactory = await ethers.getContractFactory("OCSH", {
    libraries: {
      OCSHLib: lib.target || lib.address || lib.address,
    },
  });
  const ocsh = await OCSHFactory.deploy();
  await ocsh.waitForDeployment?.();
  console.log("OCSH deployed to:", ocsh.target || ocsh.address || ocsh.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
