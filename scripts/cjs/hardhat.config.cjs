// Isolated CommonJS Hardhat config for test runs
require('@nomicfoundation/hardhat-toolbox');
const path = require('path');

/** @type {import('hardhat/config').HardhatUserConfig} */
module.exports = {
  solidity: {
    version: '0.8.27',
    settings: {
      optimizer: { enabled: true, runs: 200 },
      evmVersion: 'cancun',
    },
  },
  paths: {
    // Treat the repo root as the Hardhat project root even though this config is nested
    root: path.resolve(__dirname, '..', '..'),
    // Ensure sources point to the repo root 'contracts'
    sources: path.resolve(__dirname, '..', '..', 'contracts'),
    artifacts: path.resolve(__dirname, '..', '..', 'artifacts'),
    // Use a dedicated cache folder for this isolated config to avoid cross-config interference
    cache: path.resolve(__dirname, '..', '..', 'cache-cjs'),
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
  typechain: {
    outDir: path.resolve(__dirname, '..', '..', 'typechain-types'),
    target: 'ethers-v6',
  },
};
