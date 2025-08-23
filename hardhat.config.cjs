// CommonJS Hardhat config generated from hardhat.config.ts
require('@nomicfoundation/hardhat-toolbox');

/** @type {import('hardhat/config').HardhatUserConfig} */
module.exports = {
	solidity: {
		version: '0.8.21',
		settings: {
			optimizer: { enabled: true, runs: 200 },
		},
	},
	networks: {
		hardhat: {
			type: 'edr-simulated',
		},
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
