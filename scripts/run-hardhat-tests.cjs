// Register ts-node for TypeScript support and then invoke Hardhat programmatically
require('ts-node').register({ transpileOnly: true });
const hardhat = require('hardhat');

async function main() {
  try {
    await hardhat.run('test', { testFiles: ['test/OCSH.test.ts'] });
  } catch (e) {
    console.error(e);
    process.exitCode = 1;
  }
}

main();
