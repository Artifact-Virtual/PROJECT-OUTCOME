// Isolated CommonJS Hardhat config for test runs
require('@nomicfoundation/hardhat-toolbox');
const path = require('path');

/** @type {import('hardhat/config').HardhatUserConfig} */
module.exports = {
  solidity: {
    version: '0.8.22',
    settings: {
      optimizer: { enabled: true, runs: 200 },
    },
  },
  paths: {
  artifacts: path.resolve(__dirname, '..', '..', 'artifacts'),
  tests: path.resolve(__dirname, '..', '..', 'build-tests', 'test')
  },
  networks: {
    hardhat: { type: 'edr-simulated' },
    baseSepolia: {
      type: 'http',
      url: process.env.BASE_SEPOLIA_RPC_URL || 'https://sepolia.base.org',
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
    base: {
      type: 'http',
      url: process.env.BASE_RPC_URL || 'https://mainnet.base.org',
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
    sepolia: {
      type: 'http',
      url: process.env.SEPOLIA_RPC_URL || 'https://ethereum-sepolia.publicnode.com',
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },
  mocha: { timeout: 40000 },
};
