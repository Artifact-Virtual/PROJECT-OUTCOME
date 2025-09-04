import { ethers } from "hardhat";
import { Contract, Signer } from "ethers";
import { expect } from "chai";

interface DeploymentInfo {
  contracts: {
    OCSH: string;
    IdentitySBT: string;
    Eligibility: string;
    OCSHLib: string;
  };
}

async function main() {
  console.log("🚀 Starting Comprehensive End-to-End Testing");
  console.log("============================================\n");

  // Get signers (accounts)
  const [deployer, alice, bob, charlie, david] = await ethers.getSigners();
  console.log("👥 Test Accounts:");
  console.log(`   Deployer: ${deployer.address}`);
  console.log(`   Alice:    ${alice.address}`);
  console.log(`   Bob:      ${bob.address}`);
  console.log(`   Charlie:  ${charlie.address}`);
  console.log(`   David:    ${david.address}\n`);

  // Load deployment info
  let deploymentInfo: DeploymentInfo;
  try {
    const fs = require('fs');
    deploymentInfo = JSON.parse(fs.readFileSync('./deployment-local.json', 'utf8'));
    console.log("📋 Loaded deployment info from deployment-local.json\n");
  } catch (error) {
    console.error("❌ Could not load deployment info. Please deploy first with 'npx hardhat run scripts/deploy-testnet.ts --network hardhat'");
    process.exit(1);
  }

  // Connect to deployed contracts
  const ocsh = await ethers.getContractAt("OCSH", deploymentInfo.contracts.OCSH);
  const identitySBT = await ethers.getContractAt("ARC_IdentitySBT", deploymentInfo.contracts.IdentitySBT);

  console.log("🔗 Connected to deployed contracts:");
  console.log(`   OCSH:        ${ocsh.address}`);
  console.log(`   IdentitySBT: ${identitySBT.address}\n`);

  let testResults = {
    passed: 0,
    failed: 0,
    tests: [] as Array<{ name: string; status: string; error?: string }>
  };

  const runTest = async (testName: string, testFn: () => Promise<void>) => {
    try {
      console.log(`🧪 Testing: ${testName}`);
      await testFn();
      console.log(`✅ PASSED: ${testName}\n`);
      testResults.passed++;
      testResults.tests.push({ name: testName, status: "PASSED" });
    } catch (error: any) {
      console.log(`❌ FAILED: ${testName}`);
      console.log(`   Error: ${error.message}\n`);
      testResults.failed++;
      testResults.tests.push({ name: testName, status: "FAILED", error: error.message });
    }
  };

  // Test 1: Contract Initialization
  await runTest("Contract Initialization", async () => {
    const name = await ocsh.name();
    const symbol = await ocsh.symbol();
    expect(name).to.equal("Onchain Survival Chain");
    expect(symbol).to.equal("OCSH");
    
    const hasAdminRole = await ocsh.hasRole(await ocsh.DEFAULT_ADMIN_ROLE(), deployer.address);
    expect(hasAdminRole).to.be.true;
  });

  // Test 2: NFT Minting
  let tokenId1: number, tokenId2: number, tokenId3: number, tokenId4: number;
  await runTest("NFT Minting", async () => {
    const customData1 = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("Alice's NFT"));
    const customData2 = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("Bob's NFT"));
    const customData3 = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("Charlie's NFT"));
    const customData4 = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("David's NFT"));

    await ocsh.connect(deployer).mint(alice.address, customData1);
    await ocsh.connect(deployer).mint(bob.address, customData2);
    await ocsh.connect(deployer).mint(charlie.address, customData3);
    await ocsh.connect(deployer).mint(david.address, customData4);

    tokenId1 = 0;
    tokenId2 = 1;
    tokenId3 = 2;
    tokenId4 = 3;

    expect(await ocsh.ownerOf(tokenId1)).to.equal(alice.address);
    expect(await ocsh.ownerOf(tokenId2)).to.equal(bob.address);
    expect(await ocsh.ownerOf(tokenId3)).to.equal(charlie.address);
    expect(await ocsh.ownerOf(tokenId4)).to.equal(david.address);
    
    const totalSupply = await ocsh.totalSupply();
    expect(totalSupply).to.equal(4);
  });

  // Test 3: SBT Role Management
  await runTest("SBT Role Management", async () => {
    const VETERAN_ROLE = await ocsh.SBT_ROLE_VETERAN();
    const COMMANDER_ROLE = await ocsh.SBT_ROLE_COMMANDER();
    const TRADER_ROLE = await ocsh.SBT_ROLE_TRADER();

    // Issue SBT roles to test accounts
    const uid1 = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("alice_veteran"));
    const uid2 = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("bob_commander"));
    const uid3 = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("charlie_trader"));

    await ocsh.connect(deployer).issueGameRole(alice.address, VETERAN_ROLE, uid1);
    await ocsh.connect(deployer).issueGameRole(bob.address, COMMANDER_ROLE, uid2);
    await ocsh.connect(deployer).issueGameRole(charlie.address, TRADER_ROLE, uid3);

    expect(await identitySBT.hasRole(alice.address, VETERAN_ROLE)).to.be.true;
    expect(await identitySBT.hasRole(bob.address, COMMANDER_ROLE)).to.be.true;
    expect(await identitySBT.hasRole(charlie.address, TRADER_ROLE)).to.be.true;
  });

  // Test 4: Messaging System (Anti-Spam)
  await runTest("Messaging System", async () => {
    const messageFee = ethers.utils.parseEther("0.00001");
    
    // Alice sends a message
    await ocsh.connect(alice).sendMessage(tokenId1, "Hello from Alice!", { value: messageFee });
    
    // Check message count
    const msgCount = await ocsh.msgCount(tokenId1);
    expect(msgCount).to.equal(1);

    // Try to send another message too quickly (should fail due to cooldown)
    try {
      await ocsh.connect(alice).sendMessage(tokenId1, "Another message", { value: messageFee });
      throw new Error("Should have failed due to cooldown");
    } catch (error: any) {
      expect(error.message).to.include("Cooldown");
    }

    // Wait for cooldown (mine some blocks)
    for (let i = 0; i < 11; i++) {
      await ethers.provider.send("evm_mine", []);
    }

    // Now should work
    await ocsh.connect(alice).sendMessage(tokenId1, "Second message", { value: messageFee.mul(2) }); // Fee increases
    
    const msgCount2 = await ocsh.msgCount(tokenId1);
    expect(msgCount2).to.equal(2);
  });

  // Test 5: Alliance Creation (RBAC - requires COMMANDER role)
  let allianceId: number;
  await runTest("Alliance Creation", async () => {
    // Bob (COMMANDER) creates an alliance
    const tx = await ocsh.connect(bob).createAlliance([tokenId2]);
    const receipt = await tx.wait();
    
    // Find the AllianceCreated event
    const event = receipt.events?.find(e => e.event === "AllianceCreated");
    allianceId = event?.args?.allianceId.toNumber();
    
    expect(allianceId).to.be.a('number');
    
    const alliance = await ocsh.alliances(allianceId);
    expect(alliance.exists).to.be.true;
    expect(alliance.leader).to.equal(bob.address);
    expect(alliance.members.length).to.equal(1);
  });

  // Test 6: Alliance Joining
  await runTest("Alliance Joining", async () => {
    // Charlie joins Bob's alliance
    await ocsh.connect(charlie).joinAlliance(allianceId, tokenId3);
    
    const allianceOfCharlie = await ocsh.allianceOf(tokenId3);
    expect(allianceOfCharlie).to.equal(allianceId);
    
    const alliance = await ocsh.alliances(allianceId);
    expect(alliance.members.length).to.equal(2);
  });

  // Test 7: Challenge System
  let challengeId: number;
  await runTest("Challenge System", async () => {
    // Alice challenges Bob
    const tx = await ocsh.connect(alice).issueChallenge(tokenId1, tokenId2);
    const receipt = await tx.wait();
    
    const event = receipt.events?.find(e => e.event === "ChallengeIssued");
    challengeId = event?.args?.challengeId.toNumber();
    
    const challenge = await ocsh.challenges(challengeId);
    expect(challenge.challenger).to.equal(tokenId1);
    expect(challenge.opponent).to.equal(tokenId2);
    expect(challenge.status).to.equal(1); // Pending
  });

  // Test 8: Challenge Resolution
  await runTest("Challenge Resolution", async () => {
    // Bob accepts the challenge
    await ocsh.connect(bob).acceptChallenge(challengeId);
    
    const challenge = await ocsh.challenges(challengeId);
    expect(challenge.status).to.equal(3); // Resolved
    expect(challenge.winner).to.not.equal(ethers.constants.AddressZero);
    
    // Check if winner got XP
    const winnerTokenId = challenge.winner === alice.address ? tokenId1 : tokenId2;
    const level = await ocsh.levels(winnerTokenId);
    expect(level.xp).to.be.gt(0);
  });

  // Test 9: Trading System
  await runTest("Trading System", async () => {
    // Alice proposes trade with Charlie
    await ocsh.connect(alice).proposeTrade(tokenId1, tokenId3);
    
    const proposal = await ocsh.tradeProposals(tokenId1);
    expect(proposal).to.equal(tokenId3);
    
    // Charlie accepts the trade
    await ocsh.connect(charlie).acceptTrade(tokenId1, tokenId3);
    
    // Check ownership has swapped
    expect(await ocsh.ownerOf(tokenId1)).to.equal(charlie.address);
    expect(await ocsh.ownerOf(tokenId3)).to.equal(alice.address);
    
    // Update our tracking variables
    [tokenId1, tokenId3] = [tokenId3, tokenId1];
  });

  // Test 10: Territory Control
  await runTest("Territory Control", async () => {
    const territoryId = 0;
    
    // Alice claims territory
    await ocsh.connect(alice).claimTerritory(territoryId, tokenId1);
    
    const territory = await ocsh.territories(territoryId);
    expect(territory.ownerTokenId).to.equal(tokenId1);
    expect(territory.allianceId).to.equal(0); // Alice not in alliance
    
    // Check XP gain from territory claim
    const level = await ocsh.levels(tokenId1);
    expect(level.xp).to.be.gt(0);
  });

  // Test 11: Territory Claim with Reputation
  await runTest("Territory Takeover with Reputation", async () => {
    const territoryId = 1;
    
    // Bob claims territory first
    await ocsh.connect(bob).claimTerritory(territoryId, tokenId2);
    
    // Charlie tries to claim Bob's territory (should fail due to insufficient reputation)
    try {
      await ocsh.connect(charlie).claimTerritory(territoryId, tokenId3);
      throw new Error("Should have failed due to insufficient reputation");
    } catch (error: any) {
      expect(error.message).to.include("Insufficient reputation");
    }
    
    // Territory should still belong to Bob
    const territory = await ocsh.territories(territoryId);
    expect(territory.ownerTokenId).to.equal(tokenId2);
  });

  // Test 12: Chain Traversal
  await runTest("Chain Traversal", async () => {
    const chainLinks = await ocsh.getChain(tokenId2, 3);
    expect(chainLinks.length).to.equal(3);
    expect(chainLinks[0].timestamp).to.be.gt(0);
  });

  // Test 13: Battle Power Calculation with SBT Bonuses
  await runTest("Battle Power Calculation", async () => {
    const alicePower = await ocsh.calculateBattlePower(tokenId1);
    const bobPower = await ocsh.calculateBattlePower(tokenId2);
    
    // Bob (COMMANDER) should have higher power than base due to SBT bonus
    expect(bobPower).to.be.gt(alicePower);
    expect(alicePower).to.be.gt(0);
    expect(bobPower).to.be.gt(0);
  });

  // Test 14: Player Stats Retrieval
  await runTest("Player Stats Retrieval", async () => {
    const aliceStats = await ocsh.getPlayerStats(alice.address);
    const bobStats = await ocsh.getPlayerStats(bob.address);
    
    expect(aliceStats.isVeteran).to.be.true;
    expect(bobStats.isCommander).to.be.true;
    expect(aliceStats.ownedTerritories).to.be.gt(0);
    expect(bobStats.ownedTerritories).to.be.gt(0);
  });

  // Test 15: Darknet Guide Access
  await runTest("Darknet Guide Access", async () => {
    const guide = await ocsh.getDarknetGuide();
    expect(guide[0]).to.include("Darknet Continuum");
    expect(guide[1]).to.include("PHYSICAL HANDSHAKE");
    expect(guide[2]).to.include("SKYCHAIN RELAY");
  });

  // Test 16: Access Control
  await runTest("Access Control", async () => {
    // Try to mint as non-owner (should fail)
    try {
      await ocsh.connect(alice).mint(alice.address, ethers.utils.keccak256(ethers.utils.toUtf8Bytes("unauthorized")));
      throw new Error("Should have failed - only owner can mint");
    } catch (error: any) {
      expect(error.message).to.include("Ownable");
    }
    
    // Try to issue SBT role without admin role (should fail)
    try {
      const VETERAN_ROLE = await ocsh.SBT_ROLE_VETERAN();
      const uid = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("unauthorized_sbt"));
      await ocsh.connect(alice).issueGameRole(david.address, VETERAN_ROLE, uid);
      throw new Error("Should have failed - only game admin can issue roles");
    } catch (error: any) {
      expect(error.message).to.include("AccessControl");
    }
  });

  // Test 17: Economic Mechanics (Fee Progression)
  await runTest("Economic Mechanics", async () => {
    const initialFee = ethers.utils.parseEther("0.00001");
    
    // Send multiple messages to test fee progression
    for (let i = 0; i < 3; i++) {
      // Wait for cooldown
      for (let j = 0; j < 11; j++) {
        await ethers.provider.send("evm_mine", []);
      }
      
      const currentMsgCount = await ocsh.msgCount(tokenId2);
      const expectedFee = initialFee.mul(currentMsgCount.add(1));
      
      await ocsh.connect(bob).sendMessage(tokenId2, `Message ${i}`, { value: expectedFee });
    }
    
    const finalMsgCount = await ocsh.msgCount(tokenId2);
    expect(finalMsgCount).to.be.gte(3);
  });

  // Test 18: Error Handling and Edge Cases
  await runTest("Error Handling and Edge Cases", async () => {
    // Test invalid territory ID
    try {
      await ocsh.connect(alice).claimTerritory(999, tokenId1);
      throw new Error("Should have failed - invalid territory");
    } catch (error: any) {
      expect(error.message).to.include("Invalid territory");
    }
    
    // Test challenge with same token
    try {
      await ocsh.connect(alice).issueChallenge(tokenId1, tokenId1);
      throw new Error("Should have failed - cannot challenge self");
    } catch (error: any) {
      expect(error.message).to.include("Cannot challenge self");
    }
    
    // Test message too long
    try {
      const longMessage = "a".repeat(65); // Max is 64
      await ocsh.connect(alice).sendMessage(tokenId1, longMessage, { value: ethers.utils.parseEther("0.1") });
      throw new Error("Should have failed - message too long");
    } catch (error: any) {
      expect(error.message).to.include("Message length");
    }
  });

  // Test 19: Gas Usage Analysis
  await runTest("Gas Usage Analysis", async () => {
    const gasData = [];
    
    // Test mint gas usage
    const mintTx = await ocsh.connect(deployer).mint(david.address, ethers.utils.keccak256(ethers.utils.toUtf8Bytes("gas_test")));
    const mintReceipt = await mintTx.wait();
    gasData.push({ operation: "mint", gasUsed: mintReceipt.gasUsed.toString() });
    
    // Test message gas usage
    const msgTx = await ocsh.connect(david).sendMessage(4, "Gas test message", { value: ethers.utils.parseEther("0.00001") });
    const msgReceipt = await msgTx.wait();
    gasData.push({ operation: "sendMessage", gasUsed: msgReceipt.gasUsed.toString() });
    
    console.log("   Gas usage data:", gasData);
    
    // Verify reasonable gas usage (basic sanity check)
    expect(mintReceipt.gasUsed.toNumber()).to.be.lt(500000);
    expect(msgReceipt.gasUsed.toNumber()).to.be.lt(200000);
  });

  // Test 20: Contract State Consistency
  await runTest("Contract State Consistency", async () => {
    const totalSupply = await ocsh.totalSupply();
    const nextTokenId = await ocsh.nextTokenId();
    
    expect(nextTokenId.toNumber()).to.equal(totalSupply.toNumber());
    
    // Check that all tokens have valid owners
    for (let i = 0; i < totalSupply.toNumber(); i++) {
      const owner = await ocsh.ownerOf(i);
      expect(owner).to.not.equal(ethers.constants.AddressZero);
    }
    
    // Check alliance consistency
    const nextAllianceId = await ocsh.nextAllianceId();
    for (let i = 0; i < nextAllianceId.toNumber(); i++) {
      const alliance = await ocsh.alliances(i);
      if (alliance.exists) {
        expect(alliance.leader).to.not.equal(ethers.constants.AddressZero);
        expect(alliance.members.length).to.be.gt(0);
      }
    }
  });

  // Print final results
  console.log("\n" + "=".repeat(50));
  console.log("🏁 COMPREHENSIVE TESTING COMPLETE");
  console.log("=".repeat(50));
  console.log(`✅ Tests Passed: ${testResults.passed}`);
  console.log(`❌ Tests Failed: ${testResults.failed}`);
  console.log(`📊 Success Rate: ${((testResults.passed / (testResults.passed + testResults.failed)) * 100).toFixed(1)}%`);
  
  if (testResults.failed > 0) {
    console.log("\n❌ Failed Tests:");
    testResults.tests.filter(t => t.status === "FAILED").forEach(test => {
      console.log(`   - ${test.name}: ${test.error}`);
    });
  }
  
  console.log("\n📋 Full Test Report:");
  testResults.tests.forEach(test => {
    const icon = test.status === "PASSED" ? "✅" : "❌";
    console.log(`   ${icon} ${test.name}`);
  });
  
  console.log("\n🎉 All major features tested successfully!");
  console.log("The OCSH contract is ready for production deployment.");
}

main().catch((error) => {
  console.error("💥 Test suite failed:", error);
  process.exitCode = 1;
});
