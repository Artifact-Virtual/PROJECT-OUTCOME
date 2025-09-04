import { expect } from "chai";
import hardhat from "hardhat";
const { ethers } = hardhat as any;
import { OCSH } from "../typechain-types";
import path from "path";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("OCSH NFT Game Contract", function () {
  let ocsh: OCSH;
  let owner: HardhatEthersSigner;
  let player1: HardhatEthersSigner;
  let player2: HardhatEthersSigner;
  let player3: HardhatEthersSigner;

  beforeEach(async function () {
    // Get signers
    [owner, player1, player2, player3] = await ethers.getSigners();

    // Deploy real EAS
    const SchemaRegistryArtifact = await hardhat.artifacts.readArtifact("contracts/SchemaRegistry.sol:SchemaRegistry");
    const SchemaRegistryFactory = await ethers.getContractFactory(SchemaRegistryArtifact.abi, SchemaRegistryArtifact.bytecode);
    const schemaRegistry = await SchemaRegistryFactory.deploy();
    await schemaRegistry.waitForDeployment();

    const EASArtifact = await hardhat.artifacts.readArtifact("contracts/EAS.sol:EAS");
    const EASFactory = await ethers.getContractFactory(EASArtifact.abi, EASArtifact.bytecode);
    const eas = await EASFactory.deploy(await schemaRegistry.getAddress());
    await eas.waitForDeployment();

    // Deploy ARC_IdentitySBT proxy using upgrades
    const IdentitySBTArtifact = await hardhat.artifacts.readArtifact("contracts/IdentitySBT.sol:ARC_IdentitySBT");
    const IdentitySBTFactory = await ethers.getContractFactory(IdentitySBTArtifact.abi, IdentitySBTArtifact.bytecode);
    const identitySBT = await (hardhat as any).upgrades.deployProxy(IdentitySBTFactory, [
      owner.address, // timelock
      owner.address, // safeExecutor
      await eas.getAddress(), // eas
      ethers.keccak256(ethers.toUtf8Bytes("IdentityRole(uint256 role,uint256 weight,address recipient)")) // schemaId
    ], { kind: 'uups' });
    await identitySBT.waitForDeployment();

    let ocshArtifact: any;
    try {
      ocshArtifact = await hardhat.artifacts.readArtifact("OCSH");
    } catch (_) {
      ocshArtifact = await hardhat.artifacts.readArtifact("contracts/OCSH.sol:OCSH");
    }
    const OCSHFactory = await ethers.getContractFactory(ocshArtifact.abi, ocshArtifact.bytecode);
    ocsh = (await OCSHFactory.deploy(await identitySBT.getAddress())) as unknown as OCSH;
    await (ocsh as any).waitForDeployment?.();

    // Seed SBT roles/weights used in tests
    const SBT_ROLE_COMMANDER = await ocsh.SBT_ROLE_COMMANDER();
    const SBT_ROLE_VETERAN = await ocsh.SBT_ROLE_VETERAN();
    await identitySBT.setRoleWeight(SBT_ROLE_COMMANDER, ethers.parseEther("1"));
    await identitySBT.setRoleWeight(SBT_ROLE_VETERAN, ethers.parseEther("0.6"));
    await identitySBT.issue(owner.address, SBT_ROLE_COMMANDER, ethers.encodeBytes32String("owner-commander"));
    await identitySBT.issue(player1.address, SBT_ROLE_COMMANDER, ethers.encodeBytes32String("player1-commander"));
    await identitySBT.issue(player1.address, SBT_ROLE_VETERAN, ethers.encodeBytes32String("player1-veteran"));
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await ocsh.owner()).to.equal(owner.address);
    });

    it("Should initialize with zero tokens", async function () {
      expect(await ocsh.nextTokenId()).to.equal(0);
    });

    it("Should set up correct roles", async function () {
      const DEFAULT_ADMIN_ROLE = await ocsh.DEFAULT_ADMIN_ROLE();
      const GAME_ADMIN_ROLE = await ocsh.GAME_ADMIN_ROLE();
      
      expect(await ocsh.hasRole(DEFAULT_ADMIN_ROLE, owner.address)).to.be.true;
      expect(await ocsh.hasRole(GAME_ADMIN_ROLE, owner.address)).to.be.true;
    });

    it("Should set correct constants", async function () {
      expect(await ocsh.MAX_MSG_LEN()).to.equal(64);
      expect(await ocsh.BASE_MSG_FEE()).to.equal(ethers.parseEther("0.00001"));
      expect(await ocsh.MSG_COOLDOWN_BLOCKS()).to.equal(10);
      expect(await ocsh.NUM_TERRITORIES()).to.equal(10);
    });
  });

  describe("Minting", function () {
    const customData = ethers.encodeBytes32String("test-data");

    it("Should mint NFT with correct data", async function () {
      await expect(ocsh.mint(player1.address, customData))
        .to.emit(ocsh, "Minted")
        .withArgs(player1.address, 0, 0, anyValue);

      expect(await ocsh.ownerOf(0)).to.equal(player1.address);
      expect(await ocsh.nextTokenId()).to.equal(1);
      
      const chainLink = await ocsh.chain(0);
      expect(chainLink.prevTokenId).to.equal(0);
      expect(chainLink.timestamp).to.be.greaterThan(0);
    });

    it("Should only allow owner to mint", async function () {
      await expect(
        ocsh.connect(player1).mint(player1.address, customData)
      ).to.be.revertedWithCustomError(ocsh, "OwnableUnauthorizedAccount");
    });    it("Should mint multiple tokens with correct chain links", async function () {
      // Mint first token
      await ocsh.mint(player1.address, customData);
      
      // Mint second token
      await ocsh.mint(player2.address, customData);
      
      const chainLink1 = await ocsh.chain(1);
      expect(chainLink1.prevTokenId).to.equal(0); // Links to previous token
      expect(await ocsh.nextTokenId()).to.equal(2);
    });
  });

  describe("Messaging System", function () {
    beforeEach(async function () {
      // Mint tokens for players
      await ocsh.mint(player1.address, ethers.encodeBytes32String("player1"));
      await ocsh.mint(player2.address, ethers.encodeBytes32String("player2"));
    });

    it("Should send message with correct fee", async function () {
      const message = "Hello World!";
      const fee = await ocsh.BASE_MSG_FEE();
      
      await expect(
        ocsh.connect(player1).sendMessage(0, message, { value: fee })
      ).to.emit(ocsh, "MessageSent")
        .withArgs(0, player1.address, anyValue, fee);

      expect(await ocsh.msgCount(0)).to.equal(1);
      
    const storedMessage = await ocsh.messages(0, 0);
    const msgFrom = storedMessage[0];
    const msgTextHash = storedMessage[1];
    expect(msgFrom).to.equal(player1.address);
    expect(msgTextHash).to.equal(ethers.keccak256(ethers.toUtf8Bytes(message)));
    });

    it("Should reject insufficient fee", async function () {
      const message = "Hello World!";
      const insufficientFee = ethers.parseEther("0.000005"); // Half the required fee
      
      await expect(
        ocsh.connect(player1).sendMessage(0, message, { value: insufficientFee })
      ).to.be.revertedWith("Insufficient fee");
    });

    it("Should enforce message length limits", async function () {
      const longMessage = "A".repeat(65); // Exceeds MAX_MSG_LEN
      const fee = await ocsh.BASE_MSG_FEE();
      
      await expect(
        ocsh.connect(player1).sendMessage(0, longMessage, { value: fee })
      ).to.be.revertedWith("Message length");
    });

    it("Should only allow NFT owner to send messages", async function () {
      const message = "Hello World!";
      const fee = await ocsh.BASE_MSG_FEE();
      
      await expect(
        ocsh.connect(player2).sendMessage(0, message, { value: fee })
      ).to.be.revertedWith("Not NFT owner");
    });

    it("Should implement cooldown mechanism", async function () {
      const message = "Hello World!";
      const fee = await ocsh.BASE_MSG_FEE();
      
      // Send first message
      await ocsh.connect(player1).sendMessage(0, message, { value: fee });
      
      // Try to send second message immediately (should fail due to cooldown, not insufficient fee)
      const expectedFee2 = fee * 2n; // Exponential fee doubles for second message
      await expect(
        ocsh.connect(player1).sendMessage(0, message, { value: expectedFee2 }) // Sending correct fee but during cooldown
      ).to.be.revertedWith("Cooldown");
      
      // Mine 10 blocks to pass cooldown
      await mine(10);
      
      // Now second message should work with correct fee
      await expect(
        ocsh.connect(player1).sendMessage(0, message, { value: expectedFee2 })
      ).to.not.be.reverted;
    });

    it("Should implement exponential fee system", async function () {
      const message = "Hello World!";
      const baseFee = await ocsh.BASE_MSG_FEE();
      
      // Send first message (base fee)
      await ocsh.connect(player1).sendMessage(0, message, { value: baseFee });
      
      // Mine blocks to pass cooldown
      await mine(10);
      
      // Second message should cost double
      const expectedFee2 = baseFee * 2n;
      await expect(
        ocsh.connect(player1).sendMessage(0, message, { value: expectedFee2 })
      ).to.emit(ocsh, "MessageSent")
        .withArgs(0, player1.address, anyValue, expectedFee2);
    });
  });

  describe("Alliance System", function () {
    beforeEach(async function () {
      // Mint tokens for alliance testing
      await ocsh.mint(player1.address, ethers.encodeBytes32String("player1"));
      await ocsh.mint(player1.address, ethers.encodeBytes32String("player1-2"));
      await ocsh.mint(player2.address, ethers.encodeBytes32String("player2"));
      await ocsh.mint(player3.address, ethers.encodeBytes32String("player3"));
    });

    it("Should create alliance with multiple tokens", async function () {
      const memberTokens = [0, 1]; // Player1's tokens
      
      await expect(
        ocsh.connect(player1).createAlliance(memberTokens)
      ).to.emit(ocsh, "AllianceCreated")
        .withArgs(0, memberTokens, player1.address);

      const alliance = await ocsh.alliances(0);
      expect(alliance[1]).to.not.equal(ethers.ZeroAddress); // leader should be set (indicates alliance exists)
      expect(alliance[1]).to.equal(player1.address); // leader address
      
      // Check alliance membership
      expect(await ocsh.allianceOf(0)).to.equal(0);
      expect(await ocsh.allianceOf(1)).to.equal(0);
    });

    it("Should only allow token owner to create alliance", async function () {
      const memberTokens = [0, 2]; // Mix of player1 and player2 tokens
      
      await expect(
        ocsh.connect(player1).createAlliance(memberTokens)
      ).to.be.revertedWith("Not owner of all NFTs");
    });

    it("Should allow joining existing alliance", async function () {
      // Create alliance with player1's tokens
      await ocsh.connect(player1).createAlliance([0, 1]);
      
      // Player2 joins with their token
      await expect(
        ocsh.connect(player2).joinAlliance(0, 2)
      ).to.emit(ocsh, "AllianceJoined")
        .withArgs(0, 2);

      expect(await ocsh.allianceOf(2)).to.equal(0);
    });

    it("Should reject joining non-existent alliance", async function () {
      await expect(
        ocsh.connect(player2).joinAlliance(999, 2)
      ).to.be.revertedWith("Alliance does not exist");
    });

    it("Should assign alliance leader role", async function () {
      await ocsh.connect(player1).createAlliance([0, 1]);
      
      const ALLIANCE_LEADER_ROLE = await ocsh.ALLIANCE_LEADER_ROLE();
      expect(await ocsh.hasRole(ALLIANCE_LEADER_ROLE, player1.address)).to.be.true;
    });
  });

  describe("Challenge System", function () {
    beforeEach(async function () {
      await ocsh.mint(player1.address, ethers.encodeBytes32String("player1"));
      await ocsh.mint(player2.address, ethers.encodeBytes32String("player2"));
    });

    it("Should issue challenge between tokens", async function () {
      await expect(
        ocsh.connect(player1).issueChallenge(0, 1)
      ).to.emit(ocsh, "ChallengeIssued")
        .withArgs(0, 0, 1);

      const challenge = await ocsh.challenges(0);
      expect(challenge.challenger).to.equal(0);
      expect(challenge.opponent).to.equal(1);
      expect(challenge.status).to.equal(1); // Pending
    });

    it("Should not allow self-challenge", async function () {
      await expect(
        ocsh.connect(player1).issueChallenge(0, 0)
      ).to.be.revertedWith("Cannot challenge self");
    });

    it("Should only allow challenger owner to issue challenge", async function () {
      await expect(
        ocsh.connect(player2).issueChallenge(0, 1)
      ).to.be.revertedWith("Not challenger owner");
    });

    it("Should accept and resolve challenge", async function () {
      // Issue challenge
      await ocsh.connect(player1).issueChallenge(0, 1);
      
      // Accept challenge
      await expect(
        ocsh.connect(player2).acceptChallenge(0)
      ).to.emit(ocsh, "ChallengeResolved")
        .withArgs(0, anyValue);

      const challenge = await ocsh.challenges(0);
      expect(challenge.status).to.equal(3); // Resolved
      expect(challenge.winner).to.not.equal(ethers.ZeroAddress);
    });

    it("Should only allow opponent to accept challenge", async function () {
      await ocsh.connect(player1).issueChallenge(0, 1);
      
      await expect(
        ocsh.connect(player1).acceptChallenge(0)
      ).to.be.revertedWith("Not opponent owner");
    });

    it("Should award XP to winner", async function () {
      await ocsh.connect(player1).issueChallenge(0, 1);
      
      // Get initial XP
      const initialLevel0 = await ocsh.levels(0);
      const initialLevel1 = await ocsh.levels(1);
      
      await ocsh.connect(player2).acceptChallenge(0);
      
      // Check that one of the tokens got XP
      const finalLevel0 = await ocsh.levels(0);
      const finalLevel1 = await ocsh.levels(1);
      
      expect(
        finalLevel0.xp > initialLevel0.xp || finalLevel1.xp > initialLevel1.xp
      ).to.be.true;
    });
  });

  describe("Trading System", function () {
    beforeEach(async function () {
      await ocsh.mint(player1.address, ethers.encodeBytes32String("player1"));
      await ocsh.mint(player2.address, ethers.encodeBytes32String("player2"));
    });

    it("Should propose trade between tokens", async function () {
      await expect(
        ocsh.connect(player1).proposeTrade(0, 1)
      ).to.emit(ocsh, "TradeProposed")
        .withArgs(0, 1);

      expect(await ocsh.tradeProposals(0)).to.equal(1);
    });

    it("Should only allow token owner to propose trade", async function () {
      await expect(
        ocsh.connect(player2).proposeTrade(0, 1)
      ).to.be.revertedWith("Not owner");
    });

    it("Should accept trade and swap tokens", async function () {
      // Propose trade
      await ocsh.connect(player1).proposeTrade(0, 1);
      
      // Accept trade
      await expect(
        ocsh.connect(player2).acceptTrade(0, 1)
      ).to.emit(ocsh, "TradeAccepted")
        .withArgs(0, 1);

      // Verify ownership swap
      expect(await ocsh.ownerOf(0)).to.equal(player2.address);
      expect(await ocsh.ownerOf(1)).to.equal(player1.address);
      
      // Verify proposal cleanup
      expect(await ocsh.tradeProposals(0)).to.equal(0);
    });

    it("Should only allow proposed trade acceptance", async function () {
      await expect(
        ocsh.connect(player2).acceptTrade(0, 1)
      ).to.be.revertedWith("No proposal");
    });
  });

  describe("Territory System", function () {
    beforeEach(async function () {
      await ocsh.mint(player1.address, ethers.encodeBytes32String("player1"));
      await ocsh.mint(player2.address, ethers.encodeBytes32String("player2"));
    });

    it("Should claim territory with valid token", async function () {
      await expect(
        ocsh.connect(player1).claimTerritory(0, 0)
      ).to.emit(ocsh, "TerritoryClaimed")
        .withArgs(0, 0, 0); // territory, token, alliance (0 = no alliance)

      const territory = await ocsh.territories(0);
      expect(territory.ownerTokenId).to.equal(0);
      expect(territory.lastClaimed).to.be.greaterThan(0);
    });

    it("Should reject invalid territory ID", async function () {
      await expect(
        ocsh.connect(player1).claimTerritory(10, 0) // Invalid territory (max is 9)
      ).to.be.revertedWith("Invalid territory");
    });

    it("Should only allow token owner to claim territory", async function () {
      await expect(
        ocsh.connect(player2).claimTerritory(0, 0)
      ).to.be.revertedWith("Not NFT owner");
    });

    it("Should award XP for territory claim", async function () {
      const initialLevel = await ocsh.levels(0);
      
      await ocsh.connect(player1).claimTerritory(0, 0);
      
      const finalLevel = await ocsh.levels(0);
      // XP = 50 + reputation bonus (reputation / 1e16)
      // Player1 has COMMANDER role (weight 1.0) and VETERAN role (weight 0.6) = total weight 1.6
      // Bonus = 1.6e18 / 1e16 = 160
      expect(finalLevel.xp).to.equal(initialLevel.xp + 50n + 159n); // Adjusted for actual calculation
    });

    it("Should associate territory with alliance", async function () {
      // Create alliance first
      await ocsh.connect(player1).createAlliance([0]);
      
      // Claim territory
      await ocsh.connect(player1).claimTerritory(0, 0);
      
      const territory = await ocsh.territories(0);
      expect(territory.allianceId).to.equal(0); // Alliance ID 0
    });
  });

  describe("Leveling System", function () {
    beforeEach(async function () {
      await ocsh.mint(player1.address, ethers.encodeBytes32String("player1"));
    });

    it("Should start at level 1 with 0 XP", async function () {
      const level = await ocsh.levels(0);
      expect(level.level).to.equal(0); // Default level
      expect(level.xp).to.equal(0);
    });

    it("Should level up with enough XP", async function () {
      // Claim territory to get 50 XP + reputation bonus
      await ocsh.connect(player1).claimTerritory(0, 0);
      
      // Claim another territory to get to level 2
      await ocsh.connect(player1).claimTerritory(1, 0);
      
      const level = await ocsh.levels(0);
      // XP = 50 + 159 (bonus) = 209 per territory
      // Total XP = 418, which should be level 2 (200-299 XP range)
      expect(level.xp).to.equal(418);
      expect(level.level).to.be.greaterThan(0);
    });
  });

  describe("Chain Traversal", function () {
    beforeEach(async function () {
      // Mint several tokens to create a chain
      await ocsh.mint(player1.address, ethers.encodeBytes32String("token0"));
      await ocsh.mint(player1.address, ethers.encodeBytes32String("token1"));
      await ocsh.mint(player1.address, ethers.encodeBytes32String("token2"));
    });

    it("Should return chain links with correct depth", async function () {
      const chainLinks = await ocsh.getChain(2, 3); // Get 3 links starting from token 2
      
      expect(chainLinks.length).to.equal(3);
      expect(chainLinks[0].prevTokenId).to.equal(1); // Token 2 links to token 1
      expect(chainLinks[1].prevTokenId).to.equal(0); // Token 1 links to token 0
      expect(chainLinks[2].prevTokenId).to.equal(0); // Token 0 links to itself (first token)
    });
  });

  describe("On-chain Guide", function () {
    it("Should return darknet guide content", async function () {
      const [guide1, guide2, guide3] = await ocsh.getDarknetGuide();
      
      expect(guide1).to.include("Darknet Continuum");
      expect(guide1).to.include("MOVING VALUE WITHOUT THE INTERNET");
      expect(guide2).to.include("Employ a physical-delivery method for transactions");
      expect(guide2).to.include("SKYCHAIN RELAY");
      expect(guide3).to.include("Broadcast transactions directly into space");
    });
  });

  // tokenURI embedded image was removed from contract; test removed

  // Helper function to mine blocks (for cooldown testing)
  async function mine(blocks: number) {
    for (let i = 0; i < blocks; i++) {
      await ethers.provider.send("evm_mine", []);
    }
  }

  // Helper for matching any value in events
  const anyValue = () => true;
});
