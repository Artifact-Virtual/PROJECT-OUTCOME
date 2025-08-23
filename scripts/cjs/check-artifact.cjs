const hre = require('hardhat');

(async () => {
  try {
    const names = [
      'contracts/OCSH.sol:OCSH',
      'contracts/OSCHLib.sol:OCSHLib'
    ];

    for (const n of names) {
      try {
        const art = await hre.artifacts.readArtifact(n);
        console.log(`FOUND artifact ${n} - abi length: ${art.abi.length}`);
      } catch (err) {
        console.log(`MISSING artifact ${n} -> ${err.message}`);
      }
    }

    const all = await hre.artifacts.getAllFullyQualifiedNames();
    console.log('artifact count (hardhat runtime):', all.length);

    // Debug: print the configured artifacts path and list its files
    try {
      const cfg = hre.config.paths && hre.config.paths.artifacts;
      console.log('hre.config.paths.artifacts =', cfg);
      const fs = require('fs');
      const path = require('path');
      const files = fs.existsSync(cfg) ? fs.readdirSync(cfg) : null;
      console.log('artifacts dir exists:', !!files);
      if (files) console.log('artifacts dir entries:', files.slice(0, 50));
    } catch (e) {
      console.log('artifact dir check failed:', e && e.message);
    }
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  }
})();
