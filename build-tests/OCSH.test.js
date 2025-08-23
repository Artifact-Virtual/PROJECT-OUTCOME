"use strict";
var import_chai = require("chai");
var import_hardhat = require("hardhat");
describe("OCSH NFT Game Contract", function() {
  let ocsh;
  let owner;
  let player1;
  let player2;
  let player3;
  beforeEach(async function() {
    [owner, player1, player2, player3] = await import_hardhat.ethers.getSigners();
    const OCShArtifact = require("../artifacts/contracts/OCSH.sol/OCSH.json");
    const OCShFactory = await import_hardhat.ethers.getContractFactory(OCShArtifact.abi, OCShArtifact.bytecode);
    ocsh = await OCShFactory.deploy();
    await ocsh.waitForDeployment();
  });
  describe("Deployment", function() {
    it("Should set the right owner", async function() {
      (0, import_chai.expect)(await ocsh.owner()).to.equal(owner.address);
    });
    it("Should initialize with zero tokens", async function() {
      (0, import_chai.expect)(await ocsh.nextTokenId()).to.equal(0);
    });
    it("Should set up correct roles", async function() {
      const DEFAULT_ADMIN_ROLE = await ocsh.DEFAULT_ADMIN_ROLE();
      const GAME_ADMIN_ROLE = await ocsh.GAME_ADMIN_ROLE();
      (0, import_chai.expect)(await ocsh.hasRole(DEFAULT_ADMIN_ROLE, owner.address)).to.be.true;
      (0, import_chai.expect)(await ocsh.hasRole(GAME_ADMIN_ROLE, owner.address)).to.be.true;
    });
    it("Should set correct constants", async function() {
      (0, import_chai.expect)(await ocsh.MAX_MSG_LEN()).to.equal(64);
      (0, import_chai.expect)(await ocsh.BASE_MSG_FEE()).to.equal(import_hardhat.ethers.parseEther("0.00001"));
      (0, import_chai.expect)(await ocsh.MSG_COOLDOWN_BLOCKS()).to.equal(10);
      (0, import_chai.expect)(await ocsh.NUM_TERRITORIES()).to.equal(10);
    });
  });
  describe("Minting", function() {
    const customData = import_hardhat.ethers.encodeBytes32String("test-data");
    it("Should mint NFT with correct data", async function() {
      await (0, import_chai.expect)(ocsh.mint(player1.address, customData)).to.emit(ocsh, "Minted").withArgs(player1.address, 0, 0, anyValue);
      (0, import_chai.expect)(await ocsh.ownerOf(0)).to.equal(player1.address);
      (0, import_chai.expect)(await ocsh.nextTokenId()).to.equal(1);
      const chainLink = await ocsh.chain(0);
      (0, import_chai.expect)(chainLink.prevTokenId).to.equal(0);
      (0, import_chai.expect)(chainLink.timestamp).to.be.greaterThan(0);
    });
    it("Should only allow owner to mint", async function() {
      await (0, import_chai.expect)(
        ocsh.connect(player1).mint(player1.address, customData)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
    it("Should mint multiple tokens with correct chain links", async function() {
      await ocsh.mint(player1.address, customData);
      await ocsh.mint(player2.address, customData);
      const chainLink1 = await ocsh.chain(1);
      (0, import_chai.expect)(chainLink1.prevTokenId).to.equal(0);
      (0, import_chai.expect)(await ocsh.nextTokenId()).to.equal(2);
    });
  });
  describe("Messaging System", function() {
    beforeEach(async function() {
      await ocsh.mint(player1.address, import_hardhat.ethers.encodeBytes32String("player1"));
      await ocsh.mint(player2.address, import_hardhat.ethers.encodeBytes32String("player2"));
    });
    it("Should send message with correct fee", async function() {
      const message = "Hello World!";
      const fee = await ocsh.BASE_MSG_FEE();
      await (0, import_chai.expect)(
        ocsh.connect(player1).sendMessage(0, message, { value: fee })
      ).to.emit(ocsh, "MessageSent").withArgs(0, player1.address, anyValue, fee);
      (0, import_chai.expect)(await ocsh.msgCount(0)).to.equal(1);
      const [storedMessage] = await ocsh.messages(0, 0);
      (0, import_chai.expect)(storedMessage.from).to.equal(player1.address);
      (0, import_chai.expect)(storedMessage.textHash).to.equal(import_hardhat.ethers.keccak256(import_hardhat.ethers.toUtf8Bytes(message)));
    });
    it("Should reject insufficient fee", async function() {
      const message = "Hello World!";
      const insufficientFee = import_hardhat.ethers.parseEther("0.000005");
      await (0, import_chai.expect)(
        ocsh.connect(player1).sendMessage(0, message, { value: insufficientFee })
      ).to.be.revertedWith("Insufficient fee");
    });
    it("Should enforce message length limits", async function() {
      const longMessage = "A".repeat(65);
      const fee = await ocsh.BASE_MSG_FEE();
      await (0, import_chai.expect)(
        ocsh.connect(player1).sendMessage(0, longMessage, { value: fee })
      ).to.be.revertedWith("Message length");
    });
    it("Should only allow NFT owner to send messages", async function() {
      const message = "Hello World!";
      const fee = await ocsh.BASE_MSG_FEE();
      await (0, import_chai.expect)(
        ocsh.connect(player2).sendMessage(0, message, { value: fee })
      ).to.be.revertedWith("Not NFT owner");
    });
    it("Should implement cooldown mechanism", async function() {
      const message = "Hello World!";
      const fee = await ocsh.BASE_MSG_FEE();
      await ocsh.connect(player1).sendMessage(0, message, { value: fee });
      await (0, import_chai.expect)(
        ocsh.connect(player1).sendMessage(0, message, { value: fee })
      ).to.be.revertedWith("Cooldown");
      await mine(10);
      await (0, import_chai.expect)(
        ocsh.connect(player1).sendMessage(0, message, { value: fee })
      ).to.not.be.reverted;
    });
    it("Should implement exponential fee system", async function() {
      const message = "Hello World!";
      const baseFee = await ocsh.BASE_MSG_FEE();
      await ocsh.connect(player1).sendMessage(0, message, { value: baseFee });
      await mine(10);
      const expectedFee2 = baseFee * 2n;
      await (0, import_chai.expect)(
        ocsh.connect(player1).sendMessage(0, message, { value: expectedFee2 })
      ).to.emit(ocsh, "MessageSent").withArgs(0, player1.address, anyValue, expectedFee2);
    });
  });
  describe("Alliance System", function() {
    beforeEach(async function() {
      await ocsh.mint(player1.address, import_hardhat.ethers.encodeBytes32String("player1"));
      await ocsh.mint(player1.address, import_hardhat.ethers.encodeBytes32String("player1-2"));
      await ocsh.mint(player2.address, import_hardhat.ethers.encodeBytes32String("player2"));
      await ocsh.mint(player3.address, import_hardhat.ethers.encodeBytes32String("player3"));
    });
    it("Should create alliance with multiple tokens", async function() {
      const memberTokens = [0, 1];
      await (0, import_chai.expect)(
        ocsh.connect(player1).createAlliance(memberTokens)
      ).to.emit(ocsh, "AllianceCreated").withArgs(0, memberTokens, player1.address);
      const alliance = await ocsh.alliances(0);
      (0, import_chai.expect)(alliance.exists).to.be.true;
      (0, import_chai.expect)(alliance.leader).to.equal(player1.address);
      (0, import_chai.expect)(alliance.members).to.deep.equal(memberTokens);
      (0, import_chai.expect)(await ocsh.allianceOf(0)).to.equal(0);
      (0, import_chai.expect)(await ocsh.allianceOf(1)).to.equal(0);
    });
    it("Should only allow token owner to create alliance", async function() {
      const memberTokens = [0, 2];
      await (0, import_chai.expect)(
        ocsh.connect(player1).createAlliance(memberTokens)
      ).to.be.revertedWith("Not owner of all NFTs");
    });
    it("Should allow joining existing alliance", async function() {
      await ocsh.connect(player1).createAlliance([0, 1]);
      await (0, import_chai.expect)(
        ocsh.connect(player2).joinAlliance(0, 2)
      ).to.emit(ocsh, "AllianceJoined").withArgs(0, 2);
      (0, import_chai.expect)(await ocsh.allianceOf(2)).to.equal(0);
      const alliance = await ocsh.alliances(0);
      (0, import_chai.expect)(alliance.members.length).to.equal(3);
    });
    it("Should reject joining non-existent alliance", async function() {
      await (0, import_chai.expect)(
        ocsh.connect(player2).joinAlliance(999, 2)
      ).to.be.revertedWith("Alliance does not exist");
    });
    it("Should assign alliance leader role", async function() {
      await ocsh.connect(player1).createAlliance([0, 1]);
      const ALLIANCE_LEADER_ROLE = await ocsh.ALLIANCE_LEADER_ROLE();
      (0, import_chai.expect)(await ocsh.hasRole(ALLIANCE_LEADER_ROLE, player1.address)).to.be.true;
    });
  });
  describe("Challenge System", function() {
    beforeEach(async function() {
      await ocsh.mint(player1.address, import_hardhat.ethers.encodeBytes32String("player1"));
      await ocsh.mint(player2.address, import_hardhat.ethers.encodeBytes32String("player2"));
    });
    it("Should issue challenge between tokens", async function() {
      await (0, import_chai.expect)(
        ocsh.connect(player1).issueChallenge(0, 1)
      ).to.emit(ocsh, "ChallengeIssued").withArgs(0, 0, 1);
      const challenge = await ocsh.challenges(0);
      (0, import_chai.expect)(challenge.challenger).to.equal(0);
      (0, import_chai.expect)(challenge.opponent).to.equal(1);
      (0, import_chai.expect)(challenge.status).to.equal(1);
    });
    it("Should not allow self-challenge", async function() {
      await (0, import_chai.expect)(
        ocsh.connect(player1).issueChallenge(0, 0)
      ).to.be.revertedWith("Cannot challenge self");
    });
    it("Should only allow challenger owner to issue challenge", async function() {
      await (0, import_chai.expect)(
        ocsh.connect(player2).issueChallenge(0, 1)
      ).to.be.revertedWith("Not challenger owner");
    });
    it("Should accept and resolve challenge", async function() {
      await ocsh.connect(player1).issueChallenge(0, 1);
      await (0, import_chai.expect)(
        ocsh.connect(player2).acceptChallenge(0)
      ).to.emit(ocsh, "ChallengeResolved").withArgs(0, anyValue);
      const challenge = await ocsh.challenges(0);
      (0, import_chai.expect)(challenge.status).to.equal(3);
      (0, import_chai.expect)(challenge.winner).to.not.equal(import_hardhat.ethers.ZeroAddress);
    });
    it("Should only allow opponent to accept challenge", async function() {
      await ocsh.connect(player1).issueChallenge(0, 1);
      await (0, import_chai.expect)(
        ocsh.connect(player1).acceptChallenge(0)
      ).to.be.revertedWith("Not opponent owner");
    });
    it("Should award XP to winner", async function() {
      await ocsh.connect(player1).issueChallenge(0, 1);
      const initialLevel0 = await ocsh.levels(0);
      const initialLevel1 = await ocsh.levels(1);
      await ocsh.connect(player2).acceptChallenge(0);
      const finalLevel0 = await ocsh.levels(0);
      const finalLevel1 = await ocsh.levels(1);
      (0, import_chai.expect)(
        finalLevel0.xp > initialLevel0.xp || finalLevel1.xp > initialLevel1.xp
      ).to.be.true;
    });
  });
  describe("Trading System", function() {
    beforeEach(async function() {
      await ocsh.mint(player1.address, import_hardhat.ethers.encodeBytes32String("player1"));
      await ocsh.mint(player2.address, import_hardhat.ethers.encodeBytes32String("player2"));
    });
    it("Should propose trade between tokens", async function() {
      await (0, import_chai.expect)(
        ocsh.connect(player1).proposeTrade(0, 1)
      ).to.emit(ocsh, "TradeProposed").withArgs(0, 1);
      (0, import_chai.expect)(await ocsh.tradeProposals(0)).to.equal(1);
    });
    it("Should only allow token owner to propose trade", async function() {
      await (0, import_chai.expect)(
        ocsh.connect(player2).proposeTrade(0, 1)
      ).to.be.revertedWith("Not owner");
    });
    it("Should accept trade and swap tokens", async function() {
      await ocsh.connect(player1).proposeTrade(0, 1);
      await (0, import_chai.expect)(
        ocsh.connect(player2).acceptTrade(0, 1)
      ).to.emit(ocsh, "TradeAccepted").withArgs(0, 1);
      (0, import_chai.expect)(await ocsh.ownerOf(0)).to.equal(player2.address);
      (0, import_chai.expect)(await ocsh.ownerOf(1)).to.equal(player1.address);
      (0, import_chai.expect)(await ocsh.tradeProposals(0)).to.equal(0);
    });
    it("Should only allow proposed trade acceptance", async function() {
      await (0, import_chai.expect)(
        ocsh.connect(player2).acceptTrade(0, 1)
      ).to.be.revertedWith("No proposal");
    });
  });
  describe("Territory System", function() {
    beforeEach(async function() {
      await ocsh.mint(player1.address, import_hardhat.ethers.encodeBytes32String("player1"));
      await ocsh.mint(player2.address, import_hardhat.ethers.encodeBytes32String("player2"));
    });
    it("Should claim territory with valid token", async function() {
      await (0, import_chai.expect)(
        ocsh.connect(player1).claimTerritory(0, 0)
      ).to.emit(ocsh, "TerritoryClaimed").withArgs(0, 0, 0);
      const territory = await ocsh.territories(0);
      (0, import_chai.expect)(territory.ownerTokenId).to.equal(0);
      (0, import_chai.expect)(territory.lastClaimed).to.be.greaterThan(0);
    });
    it("Should reject invalid territory ID", async function() {
      await (0, import_chai.expect)(
        ocsh.connect(player1).claimTerritory(10, 0)
        // Invalid territory (max is 9)
      ).to.be.revertedWith("Invalid territory");
    });
    it("Should only allow token owner to claim territory", async function() {
      await (0, import_chai.expect)(
        ocsh.connect(player2).claimTerritory(0, 0)
      ).to.be.revertedWith("Not NFT owner");
    });
    it("Should award XP for territory claim", async function() {
      const initialLevel = await ocsh.levels(0);
      await ocsh.connect(player1).claimTerritory(0, 0);
      const finalLevel = await ocsh.levels(0);
      (0, import_chai.expect)(finalLevel.xp).to.equal(initialLevel.xp + 50n);
    });
    it("Should associate territory with alliance", async function() {
      await ocsh.connect(player1).createAlliance([0]);
      await ocsh.connect(player1).claimTerritory(0, 0);
      const territory = await ocsh.territories(0);
      (0, import_chai.expect)(territory.allianceId).to.equal(0);
    });
  });
  describe("Leveling System", function() {
    beforeEach(async function() {
      await ocsh.mint(player1.address, import_hardhat.ethers.encodeBytes32String("player1"));
    });
    it("Should start at level 1 with 0 XP", async function() {
      const level = await ocsh.levels(0);
      (0, import_chai.expect)(level.level).to.equal(0);
      (0, import_chai.expect)(level.xp).to.equal(0);
    });
    it("Should level up with enough XP", async function() {
      await ocsh.connect(player1).claimTerritory(0, 0);
      await ocsh.connect(player1).claimTerritory(1, 0);
      const level = await ocsh.levels(0);
      (0, import_chai.expect)(level.xp).to.equal(100);
      (0, import_chai.expect)(level.level).to.be.greaterThan(0);
    });
  });
  describe("Chain Traversal", function() {
    beforeEach(async function() {
      await ocsh.mint(player1.address, import_hardhat.ethers.encodeBytes32String("token0"));
      await ocsh.mint(player1.address, import_hardhat.ethers.encodeBytes32String("token1"));
      await ocsh.mint(player1.address, import_hardhat.ethers.encodeBytes32String("token2"));
    });
    it("Should return chain links with correct depth", async function() {
      const chainLinks = await ocsh.getChain(2, 3);
      (0, import_chai.expect)(chainLinks.length).to.equal(3);
      (0, import_chai.expect)(chainLinks[0].prevTokenId).to.equal(1);
      (0, import_chai.expect)(chainLinks[1].prevTokenId).to.equal(0);
      (0, import_chai.expect)(chainLinks[2].prevTokenId).to.equal(0);
    });
  });
  describe("On-chain Guide", function() {
    it("Should return darknet guide content", async function() {
      const [guide1, guide2, guide3] = await ocsh.getDarknetGuide();
      (0, import_chai.expect)(guide1).to.include("Darknet Continuum");
      (0, import_chai.expect)(guide1).to.include("MOVING VALUE WITHOUT THE INTERNET");
      (0, import_chai.expect)(guide2).to.include("PHYSICAL HANDSHAKE");
      (0, import_chai.expect)(guide3).to.include("SKYCHAIN RELAY");
    });
  });
  describe("Token URI", function() {
    it("Should return embedded image data for any token", async function() {
      const tokenURI = await ocsh.tokenURI(0);
      (0, import_chai.expect)(tokenURI).to.include("data:image/png;base64");
    });
  });
  async function mine(blocks) {
    for (let i = 0; i < blocks; i++) {
      await import_hardhat.ethers.provider.send("evm_mine", []);
    }
  }
  const anyValue = () => true;
});
