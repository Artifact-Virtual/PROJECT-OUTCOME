const { ethers, upgrades } = require("hardhat");

async function runComprehensiveTests() {
  console.log("🧪 OCSH COMPREHENSIVE END-TO-END TESTING");
  console.log("═".repeat(80));

  // First deploy the contracts
  const deployMain = require('./deploy-proxy.js');
  const deploymentResult = await deployMain();
  
  const [deployer, player1, player2, player3] = await ethers.getSigners();
  
  // Get contract instances
  const identitySBT = await ethers.getContractAt("ARC_IdentitySBT", deploymentResult.identitySBT);
  const ocsh = await ethers.getContractAt("OCSH", deploymentResult.ocsh);
  
  let testResults = {
    passed: 0,
    failed: 0,
    tests: []
  };

  async function runTest(name, testFn) {
    try {
      console.log(`\n🔍 ${name}...`);
      await testFn();
      console.log(`✅ PASSED: ${name}`);
      testResults.passed++;
      testResults.tests.push({ name, status: 'PASSED' });
    } catch (error) {
      console.log(`❌ FAILED: ${name} - ${error.message}`);
      testResults.failed++;
      testResults.tests.push({ name, status: 'FAILED', error: error.message });
    }
  }

  console.log("\n🎮 TESTING CORE NFT FUNCTIONALITY");
  console.log("─".repeat(50));

  await runTest("Mint NFT to Player 1", async () => {
    const customData = ethers.keccak256(ethers.toUtf8Bytes("player1-data"));
    await ocsh.mint(player1.address, customData);
    const balance = await ocsh.balanceOf(player1.address);
    if (balance != 1n) throw new Error("NFT not minted correctly");
    
    // Verify player1 owns token 1 (first minted after deployer's token 0)
    const owner = await ocsh.ownerOf(1);
    if (owner != player1.address) throw new Error("Player 1 should own token 1");
  });

  await runTest("Mint NFT to Player 2", async () => {
    const customData = ethers.keccak256(ethers.toUtf8Bytes("player2-data"));
    await ocsh.mint(player2.address, customData);
    const balance = await ocsh.balanceOf(player2.address);
    if (balance != 1n) throw new Error("NFT not minted correctly");
    
    // Verify player2 owns token 2
    const owner = await ocsh.ownerOf(2);
    if (owner != player2.address) throw new Error("Player 2 should own token 2");
  });

  await runTest("Mint NFT to Player 3", async () => {
    const customData = ethers.keccak256(ethers.toUtf8Bytes("player3-data"));
    await ocsh.mint(player3.address, customData);
    const balance = await ocsh.balanceOf(player3.address);
    if (balance != 1n) throw new Error("NFT not minted correctly");
    
    // Verify player3 owns token 3
    const owner = await ocsh.ownerOf(3);
    if (owner != player3.address) throw new Error("Player 3 should own token 3");
  });

  await runTest("Verify Chain Links", async () => {
    const chainLink0 = await ocsh.chain(0);
    const chainLink1 = await ocsh.chain(1);
    const chainLink2 = await ocsh.chain(2);
    const chainLink3 = await ocsh.chain(3);
    
    if (chainLink0.prevTokenId != 0n) throw new Error("Genesis token should have prevTokenId 0");
    if (chainLink1.prevTokenId != 0n) throw new Error("Token 1 should link to token 0");
    if (chainLink2.prevTokenId != 1n) throw new Error("Token 2 should link to token 1");
    if (chainLink3.prevTokenId != 2n) throw new Error("Token 3 should link to token 2");
  });

  console.log("\n🏷️ TESTING SBT ROLE SYSTEM");
  console.log("─".repeat(50));

  await runTest("Issue VETERAN role to Player 1", async () => {
    const veteranRole = await ocsh.SBT_ROLE_VETERAN();
    const uid = ethers.keccak256(ethers.toUtf8Bytes("veteran-player1"));
    await ocsh.issueGameRole(player1.address, veteranRole, uid);
    
    const hasRole = await identitySBT["hasRole(address,bytes32)"](player1.address, veteranRole);
    if (!hasRole) throw new Error("VETERAN role not issued correctly");
  });

  await runTest("Issue COMMANDER role to Player 2", async () => {
    const commanderRole = await ocsh.SBT_ROLE_COMMANDER();
    const uid = ethers.keccak256(ethers.toUtf8Bytes("commander-player2"));
    await ocsh.issueGameRole(player2.address, commanderRole, uid);
    
    const hasRole = await identitySBT["hasRole(address,bytes32)"](player2.address, commanderRole);
    if (!hasRole) throw new Error("COMMANDER role not issued correctly");
  });

  await runTest("Issue TRADER role to Player 3", async () => {
    const traderRole = await ocsh.SBT_ROLE_TRADER();
    const uid = ethers.keccak256(ethers.toUtf8Bytes("trader-player3"));
    await ocsh.issueGameRole(player3.address, traderRole, uid);
    
    const hasRole = await identitySBT["hasRole(address,bytes32)"](player3.address, traderRole);
    if (!hasRole) throw new Error("TRADER role not issued correctly");
  });

  await runTest("Verify Player Stats with SBT Bonuses", async () => {
    const stats = await ocsh.getPlayerStats(player1.address);
    if (!stats.isVeteran) throw new Error("Player 1 should be marked as veteran");
    
    const stats2 = await ocsh.getPlayerStats(player2.address);
    if (!stats2.isCommander) throw new Error("Player 2 should be marked as commander");
    
    const stats3 = await ocsh.getPlayerStats(player3.address);
    if (!stats3.isTrader) throw new Error("Player 3 should be marked as trader");
  });

  console.log("\n💬 TESTING MESSAGING SYSTEM");
  console.log("─".repeat(50));

  await runTest("Send Message from Player 1", async () => {
    const fee = await ocsh.BASE_MSG_FEE();
    // Player 1 owns token 1 (second minted token)
    await ocsh.connect(player1).sendMessage(1, "Hello World!", { value: fee });
    
    const msgCount = await ocsh.msgCount(1);
    if (msgCount != 1n) throw new Error("Message not recorded correctly");
  });

  await runTest("Test Message Cooldown", async () => {
    const fee = await ocsh.BASE_MSG_FEE();
    try {
      await ocsh.connect(player1).sendMessage(1, "Too fast!", { value: fee });
      throw new Error("Should have failed due to cooldown");
    } catch (error) {
      if (!error.message.includes("Cooldown")) throw error;
    }
  });

  await runTest("Test Message Fee Calculation", async () => {
    // Mine some blocks to pass cooldown
    for (let i = 0; i < 12; i++) {
      await ethers.provider.send("evm_mine");
    }
    
    const baseFee = await ocsh.BASE_MSG_FEE();
    const msgCount = await ocsh.msgCount(1);
    const expectedFee = baseFee * (msgCount + 1n);
    
    await ocsh.connect(player1).sendMessage(1, "Second message", { value: expectedFee });
    
    const newMsgCount = await ocsh.msgCount(1);
    if (newMsgCount != 2n) throw new Error("Second message not recorded");
  });

  console.log("\n🤝 TESTING ALLIANCE SYSTEM");
  console.log("─".repeat(50));

  await runTest("Create Alliance (Player 2 as Commander)", async () => {
    const memberTokens = [2]; // Player 2's token (third minted)
    const tx = await ocsh.connect(player2).createAlliance(memberTokens);
    const receipt = await tx.wait();
    
    // Get alliance ID from the created alliance
    const allianceId = await ocsh.allianceOf(2);
    console.log("Alliance ID:", allianceId.toString());
    
    if (allianceId == 0n && await ocsh.nextAllianceId() == 0n) {
      throw new Error("Alliance not created - nextAllianceId is still 0");
    }
    
    const alliance = await ocsh.alliances(allianceId);
    if (!alliance.exists) throw new Error("Alliance should exist");
    if (alliance.leader != player2.address) throw new Error("Player 2 should be alliance leader");
  });

  await runTest("Join Alliance (Player 1)", async () => {
    const allianceId = await ocsh.allianceOf(2); // Get Player 2's alliance
    await ocsh.connect(player1).joinAlliance(allianceId, 1);
    
    const player1AllianceId = await ocsh.allianceOf(1);
    if (player1AllianceId != allianceId) throw new Error("Player 1 not in alliance");
  });

  console.log("\n⚔️ TESTING CHALLENGE SYSTEM");
  console.log("─".repeat(50));

  await runTest("Issue Challenge (Player 1 vs Player 3)", async () => {
    await ocsh.connect(player1).issueChallenge(1, 3);
    
    const challenge = await ocsh.challenges(0);
    if (challenge.challenger != 1n) throw new Error("Challenger not set correctly");
    if (challenge.opponent != 3n) throw new Error("Opponent not set correctly");
    if (challenge.status != 1) throw new Error("Challenge status should be Pending");
  });

  await runTest("Accept and Resolve Challenge", async () => {
    const initialLevel1 = (await ocsh.levels(1)).level;
    const initialLevel3 = (await ocsh.levels(3)).level;
    
    await ocsh.connect(player3).acceptChallenge(0);
    
    const challenge = await ocsh.challenges(0);
    if (challenge.status != 3) throw new Error("Challenge should be resolved");
    if (challenge.winner == ethers.ZeroAddress) throw new Error("Winner should be set");
    
    // Check if either player leveled up
    const finalLevel1 = (await ocsh.levels(1)).level;
    const finalLevel3 = (await ocsh.levels(3)).level;
    
    const someoneLeveledUp = finalLevel1 > initialLevel1 || finalLevel3 > initialLevel3;
    if (!someoneLeveledUp) throw new Error("Winner should have leveled up");
  });

  console.log("\n🔄 TESTING TRADING SYSTEM");
  console.log("─".repeat(50));

  await runTest("Propose Trade (Player 1 → Player 3)", async () => {
    await ocsh.connect(player1).proposeTrade(1, 3);
    
    const proposal = await ocsh.tradeProposals(1);
    if (proposal != 3n) throw new Error("Trade proposal not recorded");
  });

  await runTest("Accept Trade", async () => {
    const owner1Before = await ocsh.ownerOf(1);
    const owner3Before = await ocsh.ownerOf(3);
    
    await ocsh.connect(player3).acceptTrade(1, 3);
    
    const owner1After = await ocsh.ownerOf(1);
    const owner3After = await ocsh.ownerOf(3);
    
    if (owner1After != owner3Before) throw new Error("Token 1 ownership not transferred");
    if (owner3After != owner1Before) throw new Error("Token 3 ownership not transferred");
    
    const proposal = await ocsh.tradeProposals(1);
    if (proposal != 0n) throw new Error("Trade proposal not cleared");
  });

  console.log("\n🏰 TESTING TERRITORY SYSTEM");
  console.log("─".repeat(50));

  await runTest("Claim Territory (Player 1)", async () => {
    // Player 1 now owns token 3 (after trade)
    await ocsh.connect(player1).claimTerritory(0, 3);
    
    const territory = await ocsh.territories(0);
    if (territory.ownerTokenId != 3n) throw new Error("Territory not claimed correctly");
    
    const stats = await ocsh.getPlayerStats(player1.address);
    if (stats.ownedTerritories != 1n) throw new Error("Owned territories count incorrect");
  });

  await runTest("Test Territory Cooldown", async () => {
    try {
      await ocsh.connect(player2).claimTerritory(0, 2);
      throw new Error("Should have failed due to cooldown");
    } catch (error) {
      if (!error.message.includes("cooldown")) throw error;
    }
  });

  console.log("\n⚡ TESTING BATTLE POWER CALCULATION");
  console.log("─".repeat(50));

  await runTest("Calculate Battle Power with SBT Bonuses", async () => {
    // Token 3 is now owned by Player 1 (veteran)
    const power = await ocsh.calculateBattlePower(3);
    if (power == 0n) throw new Error("Battle power should be greater than 0");
    
    // Veteran bonus should apply
    const basePower = (await ocsh.levels(3)).level * 100n;
    if (power <= basePower) throw new Error("SBT bonus not applied correctly");
  });

  console.log("\n📜 TESTING CHAIN TRAVERSAL");
  console.log("─".repeat(50));

  await runTest("Get Chain History", async () => {
    const chainDepth = 3;
    const chainLinks = await ocsh.getChain(3, chainDepth);
    
    if (chainLinks.length != chainDepth) throw new Error("Incorrect chain depth returned");
    if (chainLinks[0].prevTokenId != 2n) throw new Error("Chain link incorrect");
  });

  console.log("\n📚 TESTING DARKNET GUIDE");
  console.log("─".repeat(50));

  await runTest("Retrieve Darknet Guide", async () => {
    const guide = await ocsh.getDarknetGuide();
    if (!guide[0].includes("Darknet Continuum")) throw new Error("Guide part 1 not correct");
    if (!guide[1].includes("STATIC HAUL")) throw new Error("Guide part 2 not correct");
    if (!guide[2].includes("satellite")) throw new Error("Guide part 3 not correct");
  });

  console.log("\n🏆 TESTING ACHIEVEMENT SYSTEM");
  console.log("─".repeat(50));

  await runTest("Check Achievement SBT Issuance", async () => {
    // First win achievement should have been issued during challenge
    const firstWinRole = await ocsh.ACHIEVEMENT_FIRST_WIN();
    
    // Check if either player got the achievement
    const player1HasAchievement = await identitySBT["hasRole(address,bytes32)"](player1.address, firstWinRole);
    const player3HasAchievement = await identitySBT["hasRole(address,bytes32)"](player3.address, firstWinRole);
    
    const someoneHasAchievement = player1HasAchievement || player3HasAchievement;
    if (!someoneHasAchievement) throw new Error("First win achievement not issued");
  });

  console.log("\n🔐 TESTING ACCESS CONTROL");
  console.log("─".repeat(50));

  await runTest("Test Admin Role Restrictions", async () => {
    try {
      const veteranRole = await ocsh.SBT_ROLE_VETERAN();
      const uid = ethers.keccak256(ethers.toUtf8Bytes("unauthorized"));
      await ocsh.connect(player1).issueGameRole(player2.address, veteranRole, uid);
      throw new Error("Should have failed - only admin can issue roles");
    } catch (error) {
      if (!error.message.includes("AccessControl")) throw error;
    }
  });

  await runTest("Test SBT Role Requirements", async () => {
    try {
      // Player 3 (trader) tries to create alliance (requires commander)
      await ocsh.connect(player3).createAlliance([2]);
      throw new Error("Should have failed - only commanders can create alliances");
    } catch (error) {
      if (!error.message.includes("SBT role required")) throw error;
    }
  });

  console.log("\n📊 TEST RESULTS SUMMARY");
  console.log("═".repeat(80));
  console.log(`✅ PASSED: ${testResults.passed} tests`);
  console.log(`❌ FAILED: ${testResults.failed} tests`);
  console.log(`📈 SUCCESS RATE: ${((testResults.passed / (testResults.passed + testResults.failed)) * 100).toFixed(1)}%`);

  if (testResults.failed > 0) {
    console.log("\n🚨 FAILED TESTS:");
    testResults.tests.filter(t => t.status === 'FAILED').forEach(test => {
      console.log(`   ❌ ${test.name}: ${test.error}`);
    });
  }

  console.log("\n🎉 COMPREHENSIVE END-TO-END TESTING COMPLETE!");
  console.log("═".repeat(80));

  // Save test results
  const fs = require('fs');
  const testReport = {
    timestamp: new Date().toISOString(),
    network: "local",
    contracts: deploymentResult,
    testResults: testResults,
    summary: {
      totalTests: testResults.passed + testResults.failed,
      passed: testResults.passed,
      failed: testResults.failed,
      successRate: `${((testResults.passed / (testResults.passed + testResults.failed)) * 100).toFixed(1)}%`
    }
  };

  fs.writeFileSync('./test-report.json', JSON.stringify(testReport, null, 2));
  console.log("📄 Test report saved to test-report.json");

  return testResults.failed === 0;
}

if (require.main === module) {
  runComprehensiveTests()
    .then((success) => {
      process.exit(success ? 0 : 1);
    })
    .catch((error) => {
      console.error("❌ Test runner failed:", error);
      process.exit(1);
    });
}

module.exports = runComprehensiveTests;
