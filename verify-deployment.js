#!/usr/bin/env node

/**
 * OCSH Pre-Deployment Verification Script
 * Verifies all contracts are ready for deployment
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 OCSH Pre-Deployment Verification');
console.log('=====================================\n');

let allChecksPass = true;

function checkCommand(command, description) {
  try {
    console.log(`📋 ${description}...`);
    const result = execSync(command, { encoding: 'utf8', stdio: 'pipe' });
    console.log('✅ PASSED\n');
    return { success: true, output: result };
  } catch (error) {
    console.log('❌ FAILED\n');
    console.log('Error:', error.message);
    return { success: false, error: error.message };
  }
}

function checkFile(filePath, description) {
  try {
    console.log(`📄 ${description}...`);
    if (fs.existsSync(filePath)) {
      console.log('✅ FOUND\n');
      return true;
    } else {
      console.log('❌ MISSING\n');
      return false;
    }
  } catch (error) {
    console.log('❌ ERROR\n');
    console.log('Error:', error.message);
    return false;
  }
}

// 1. Check Node.js and npm versions
console.log('1. 🔧 ENVIRONMENT CHECKS');
console.log('------------------------');

const nodeVersion = checkCommand('node --version', 'Check Node.js version (>=18.0.0)');
if (nodeVersion.success && !nodeVersion.output.includes('v18') && !nodeVersion.output.includes('v19') && !nodeVersion.output.includes('v20')) {
  console.log('⚠️  WARNING: Node.js version might be too old\n');
}

const npmVersion = checkCommand('npm --version', 'Check npm version (>=9.0.0)');
if (npmVersion.success && parseFloat(npmVersion.output) < 9.0) {
  console.log('⚠️  WARNING: npm version might be too old\n');
}

// 2. Check project structure
console.log('2. 📁 PROJECT STRUCTURE');
console.log('-----------------------');

const requiredFiles = [
  { path: 'package.json', desc: 'Package configuration' },
  { path: 'hardhat.config.ts', desc: 'Hardhat configuration' },
  { path: 'contracts/OCSH.sol', desc: 'Main game contract' },
  { path: 'contracts/IdentitySBT.sol', desc: 'Identity SBT contract' },
  { path: 'contracts/Eligibility.sol', desc: 'Eligibility contract' },
  { path: 'contracts/BribeEscrow.sol', desc: 'Bribe escrow contract' },
  { path: 'scripts/deploy-proxy.js', desc: 'Proxy deployment script' },
  { path: 'test/OCSH.test.ts', desc: 'Main test suite' }
];

requiredFiles.forEach(file => {
  const exists = checkFile(file.path, `Check ${file.desc}`);
  if (!exists) allChecksPass = false;
});

// 3. Check dependencies
console.log('3. 📦 DEPENDENCIES');
console.log('------------------');

const depCheck = checkCommand('npm list --depth=0', 'Check installed dependencies');
if (!depCheck.success) {
  allChecksPass = false;
}

// 4. Compile contracts
console.log('4. ⚙️  CONTRACT COMPILATION');
console.log('---------------------------');

const compileCheck = checkCommand('npx hardhat compile', 'Compile all contracts');
if (!compileCheck.success) {
  allChecksPass = false;
}

// 5. Run tests
console.log('5. 🧪 TEST SUITE');
console.log('----------------');

const testCheck = checkCommand('npm test', 'Run complete test suite');
if (!testCheck.success) {
  allChecksPass = false;
}

// Extract test results
const testOutput = testCheck.output || '';
const passingTests = (testOutput.match(/(\d+) passing/g) || []).reduce((sum, match) => sum + parseInt(match.replace(' passing', '')), 0);
const failingTests = (testOutput.match(/(\d+) failing/g) || []).reduce((sum, match) => sum + parseInt(match.replace(' failing', '')), 0);

console.log(`📊 Test Results: ${passingTests} passing, ${failingTests} failing\n`);

if (failingTests > 0) {
  console.log('⚠️  WARNING: Some tests are failing. Check test output above.\n');
}

// 6. Check gas estimates
console.log('6. ⛽ GAS ESTIMATES');
console.log('------------------');

const gasCheck = checkCommand('npx hardhat test --grep "should" | grep -E "(gas|Gas)" | head -10', 'Check gas usage');
if (gasCheck.success && gasCheck.output) {
  console.log('📊 Recent gas usage:');
  console.log(gasCheck.output);
} else {
  console.log('ℹ️  Gas estimates not available in test output\n');
}

// 7. Environment check
console.log('7. 🌍 ENVIRONMENT');
console.log('-----------------');

const envCheck = checkFile('.env', 'Check environment file');
if (!envCheck) {
  console.log('⚠️  WARNING: .env file not found. Create one with your private key and RPC URLs.\n');
}

// 8. Network configuration
console.log('8. 🌐 NETWORK CONFIG');
console.log('--------------------');

const networkCheck = checkCommand('npx hardhat run scripts/deploy-proxy.js --network hardhat | head -20', 'Test deployment script (dry run)');
if (!networkCheck.success) {
  console.log('⚠️  WARNING: Deployment script has issues. Check the output above.\n');
  allChecksPass = false;
}

// Final summary
console.log('🎯 FINAL VERIFICATION SUMMARY');
console.log('=============================\n');

if (allChecksPass) {
  console.log('🎉 ALL CHECKS PASSED!');
  console.log('✅ Your OCSH contracts are ready for deployment\n');

  console.log('🚀 NEXT STEPS:');
  console.log('1. Ensure your .env file has the correct PRIVATE_KEY and RPC URLs');
  console.log('2. Fund your deployment wallet with testnet ETH');
  console.log('3. Run: npm run deploy:proxy');
  console.log('4. Verify contracts on the block explorer');
  console.log('5. Update your frontend with the deployed addresses\n');

} else {
  console.log('❌ SOME CHECKS FAILED!');
  console.log('🔧 Please fix the issues above before deploying\n');
}

console.log('📞 For help, contact: dev@artifactvirtual.com\n');

process.exit(allChecksPass ? 0 : 1);
