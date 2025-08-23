// Print artifacts known to Hardhat (CommonJS script)
const hre = require('hardhat');

(async () => {
  try {
    const names = await hre.artifacts.getAllFullyQualifiedNames();
    console.log('Artifacts count:', names.length);
    names.forEach(n => console.log(n));
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  }
})();
