
import hardhat from "hardhat";


async function main() {
  // Deploy the library first
  const LibFactory = await hardhat.ethers.getContractFactory("OCSHLib");
  const lib = await LibFactory.deploy();
  await lib.deployed();
  console.log("OCSHLib deployed to:", lib.address);

  // Deploy the main contract, linking the library
  const OCSHFactory = await hardhat.ethers.getContractFactory("OCSH", {
    libraries: {
      OCSHLib: lib.address,
    },
  });
  const ocsh = await OCSHFactory.deploy();
  await ocsh.deployed();
  console.log("OCSH deployed to:", ocsh.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
