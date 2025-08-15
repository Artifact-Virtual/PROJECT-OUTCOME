import { ethers } from "ethers";
import hre from "hardhat";

async function main() {
  console.log("🧪 Testing OCSH Contract Deployment and Basic Functions...\n");

  try {
    // Get signers
    const [owner, player1, player2] = await hre.ethers.getSigners();
    console.log("✅ Got signers:", {
      owner: owner.address,
      player1: player1.address,
      player2: player2.address
    });

    // Deploy OCSH contract
    console.log("\n📦 Deploying OCSH contract...");
    const OCShFactory = await hre.ethers.getContractFactory("OCSH");
    const ocsh = await OCShFactory.deploy();
    await ocsh.waitForDeployment();
    const contractAddress = await ocsh.getAddress();
    console.log("✅ OCSH deployed at:", contractAddress);

    // Test 1: Basic deployment checks
    console.log("\n🔍 Test 1: Basic Deployment Checks");
    const contractOwner = await ocsh.owner();
    const nextTokenId = await ocsh.nextTokenId();
    const maxMsgLen = await ocsh.MAX_MSG_LEN();
    const baseMsgFee = await ocsh.BASE_MSG_FEE();
    
    console.log("Owner:", contractOwner);
    console.log("Next Token ID:", nextTokenId.toString());
    console.log("Max Message Length:", maxMsgLen.toString());
    console.log("Base Message Fee:", ethers.formatEther(baseMsgFee), "ETH");
    
    if (contractOwner === owner.address && nextTokenId === 0n) {
      console.log("✅ Deployment test PASSED");
    } else {
      console.log("❌ Deployment test FAILED");
      return;
    }

    // Test 2: Minting
    console.log("\n🔍 Test 2: Minting NFT");
    const customData = ethers.encodeBytes32String("test-data");
    const mintTx = await ocsh.mint(player1.address, customData);
    await mintTx.wait();
    
    const tokenOwner = await ocsh.ownerOf(0);
    const newNextTokenId = await ocsh.nextTokenId();
    const chainLink = await ocsh.chain(0);
    
    console.log("Token 0 owner:", tokenOwner);
    console.log("New next token ID:", newNextTokenId.toString());
    console.log("Chain link timestamp:", chainLink.timestamp.toString());
    
    if (tokenOwner === player1.address && newNextTokenId === 1n) {
      console.log("✅ Minting test PASSED");
    } else {
      console.log("❌ Minting test FAILED");
      return;
    }

    // Test 3: Alliance Creation
    console.log("\n🔍 Test 3: Alliance Creation");
    const memberTokens = [0];
    const allianceTx = await ocsh.connect(player1).createAlliance(memberTokens);
    await allianceTx.wait();
    
    const alliance = await ocsh.alliances(0);
    const allianceOf = await ocsh.allianceOf(0);
    
    console.log("Alliance exists:", alliance.exists);
    console.log("Alliance leader:", alliance.leader);
    console.log("Token 0 alliance ID:", allianceOf.toString());
    
    if (alliance.exists && alliance.leader === player1.address && allianceOf === 0n) {
      console.log("✅ Alliance creation test PASSED");
    } else {
      console.log("❌ Alliance creation test FAILED");
      return;
    }

    // Test 4: Territory Claiming
    console.log("\n🔍 Test 4: Territory Claiming");
    const territoryTx = await ocsh.connect(player1).claimTerritory(0, 0);
    await territoryTx.wait();
    
    const territory = await ocsh.territories(0);
    
    console.log("Territory owner token ID:", territory.ownerTokenId.toString());
    console.log("Territory alliance ID:", territory.allianceId.toString());
    console.log("Territory last claimed:", territory.lastClaimed.toString());
    
    if (territory.ownerTokenId === 0n && territory.allianceId === 0n) {
      console.log("✅ Territory claiming test PASSED");
    } else {
      console.log("❌ Territory claiming test FAILED");
      return;
    }

    // Test 5: Messaging (with fee)
    console.log("\n🔍 Test 5: Messaging System");
    const message = "Hello OCSH World!";
    const messageFee = await ocsh.BASE_MSG_FEE();
    const messageTx = await ocsh.connect(player1).sendMessage(0, message, { value: messageFee });
    await messageTx.wait();
    
    const msgCount = await ocsh.msgCount(0);
    const storedMessage = await ocsh.messages(0, 0);
    
    console.log("Message count for token 0:", msgCount.toString());
    console.log("Stored message from:", storedMessage.from);
    console.log("Message text hash:", storedMessage.textHash);
    
    if (msgCount === 1n && storedMessage.from === player1.address) {
      console.log("✅ Messaging test PASSED");
    } else {
      console.log("❌ Messaging test FAILED");
      return;
    }

    console.log("\n🎉 ALL TESTS PASSED! Contract is working correctly!");
    console.log("\n📋 Summary:");
    console.log("- Contract deployed successfully");
    console.log("- NFT minting works");
    console.log("- Alliance system functional");
    console.log("- Territory claiming works");
    console.log("- Messaging system operational");
    console.log("\n✅ Ready for comprehensive testing and deployment!");

  } catch (error) {
    console.error("❌ Test failed with error:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Script failed:", error);
    process.exit(1);
  });
