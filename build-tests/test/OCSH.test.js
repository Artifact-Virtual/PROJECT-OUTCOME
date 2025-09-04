"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const hardhat_1 = __importStar(require("hardhat"));
const path = require("path");
describe("OCSH NFT Game Contract", function () {
    let ocsh;
    let owner;
    let player1;
    let player2;
    let player3;
    beforeEach(async function () {
        // Get signers
        [owner, player1, player2, player3] = await hardhat_1.ethers.getSigners();
        // Deploy mock SBT and OCSH
        // artifacts are expected to be compiled before tests via npm scripts
        let mockSbtArtifact;
        try {
            mockSbtArtifact = await hardhat_1.default.artifacts.readArtifact("MockIdentitySBT");
        }
        catch (_) {
            mockSbtArtifact = await hardhat_1.default.artifacts.readArtifact("contracts/mocks/MockIdentitySBT.sol:MockIdentitySBT");
        }
        const MockSBT = await hardhat_1.ethers.getContractFactory(mockSbtArtifact.abi, mockSbtArtifact.bytecode);
        const mockSbt = await MockSBT.deploy();
        await mockSbt.waitForDeployment();
        let ocshArtifact;
        try {
            ocshArtifact = await hardhat_1.default.artifacts.readArtifact("OCSH");
        }
        catch (_) {
            ocshArtifact = await hardhat_1.default.artifacts.readArtifact("contracts/OCSH.sol:OCSH");
        }
        const OCSHFactory = await hardhat_1.ethers.getContractFactory(ocshArtifact.abi, ocshArtifact.bytecode);
        ocsh = (await OCSHFactory.deploy(await mockSbt.getAddress()));
        await ocsh.waitForDeployment?.();
        // Seed SBT roles/weights used in tests
        const SBT_ROLE_COMMANDER = await ocsh.SBT_ROLE_COMMANDER();
        const SBT_ROLE_VETERAN = await ocsh.SBT_ROLE_VETERAN();
        await mockSbt.setRole(owner.address, SBT_ROLE_COMMANDER, true);
        await mockSbt.setRole(player1.address, SBT_ROLE_COMMANDER, true);
        await mockSbt.setRole(player1.address, SBT_ROLE_VETERAN, true);
        await mockSbt.setWeight(player1.address, hardhat_1.ethers.parseEther("6"));
    });
    describe("Deployment", function () {
        it("Should set the right owner", async function () {
            (0, chai_1.expect)(await ocsh.owner()).to.equal(owner.address);
        });
        it("Should initialize with zero tokens", async function () {
            (0, chai_1.expect)(await ocsh.nextTokenId()).to.equal(0);
        });
        it("Should set up correct roles", async function () {
            const DEFAULT_ADMIN_ROLE = await ocsh.DEFAULT_ADMIN_ROLE();
            const GAME_ADMIN_ROLE = await ocsh.GAME_ADMIN_ROLE();
            (0, chai_1.expect)(await ocsh.hasRole(DEFAULT_ADMIN_ROLE, owner.address)).to.be.true;
            (0, chai_1.expect)(await ocsh.hasRole(GAME_ADMIN_ROLE, owner.address)).to.be.true;
        });
        it("Should set correct constants", async function () {
            (0, chai_1.expect)(await ocsh.MAX_MSG_LEN()).to.equal(64);
            (0, chai_1.expect)(await ocsh.BASE_MSG_FEE()).to.equal(hardhat_1.ethers.parseEther("0.00001"));
            (0, chai_1.expect)(await ocsh.MSG_COOLDOWN_BLOCKS()).to.equal(10);
            (0, chai_1.expect)(await ocsh.NUM_TERRITORIES()).to.equal(10);
        });
    });
    describe("Minting", function () {
        const customData = hardhat_1.ethers.encodeBytes32String("test-data");
        it("Should mint NFT with correct data", async function () {
            await (0, chai_1.expect)(ocsh.mint(player1.address, customData))
                .to.emit(ocsh, "Minted")
                .withArgs(player1.address, 0, 0, anyValue);
            (0, chai_1.expect)(await ocsh.ownerOf(0)).to.equal(player1.address);
            (0, chai_1.expect)(await ocsh.nextTokenId()).to.equal(1);
            const chainLink = await ocsh.chain(0);
            (0, chai_1.expect)(chainLink.prevTokenId).to.equal(0);
            (0, chai_1.expect)(chainLink.timestamp).to.be.greaterThan(0);
        });
        it("Should only allow owner to mint", async function () {
            await (0, chai_1.expect)(ocsh.connect(player1).mint(player1.address, customData)).to.be.revertedWith("Ownable: caller is not the owner");
        });
        it("Should mint multiple tokens with correct chain links", async function () {
            // Mint first token
            await ocsh.mint(player1.address, customData);
            // Mint second token
            await ocsh.mint(player2.address, customData);
            const chainLink1 = await ocsh.chain(1);
            (0, chai_1.expect)(chainLink1.prevTokenId).to.equal(0); // Links to previous token
            (0, chai_1.expect)(await ocsh.nextTokenId()).to.equal(2);
        });
    });
    describe("Messaging System", function () {
        beforeEach(async function () {
            // Mint tokens for players
            await ocsh.mint(player1.address, hardhat_1.ethers.encodeBytes32String("player1"));
            await ocsh.mint(player2.address, hardhat_1.ethers.encodeBytes32String("player2"));
        });
        it("Should send message with correct fee", async function () {
            const message = "Hello World!";
            const fee = await ocsh.BASE_MSG_FEE();
            await (0, chai_1.expect)(ocsh.connect(player1).sendMessage(0, message, { value: fee })).to.emit(ocsh, "MessageSent")
                .withArgs(0, player1.address, anyValue, fee);
            (0, chai_1.expect)(await ocsh.msgCount(0)).to.equal(1);
            const storedMessage = await ocsh.messages(0, 0);
            const msgFrom = storedMessage[0];
            const msgTextHash = storedMessage[1];
            (0, chai_1.expect)(msgFrom).to.equal(player1.address);
            (0, chai_1.expect)(msgTextHash).to.equal(hardhat_1.ethers.keccak256(hardhat_1.ethers.toUtf8Bytes(message)));
        });
        it("Should reject insufficient fee", async function () {
            const message = "Hello World!";
            const insufficientFee = hardhat_1.ethers.parseEther("0.000005"); // Half the required fee
            await (0, chai_1.expect)(ocsh.connect(player1).sendMessage(0, message, { value: insufficientFee })).to.be.revertedWith("Insufficient fee");
        });
        it("Should enforce message length limits", async function () {
            const longMessage = "A".repeat(65); // Exceeds MAX_MSG_LEN
            const fee = await ocsh.BASE_MSG_FEE();
            await (0, chai_1.expect)(ocsh.connect(player1).sendMessage(0, longMessage, { value: fee })).to.be.revertedWith("Message length");
        });
        it("Should only allow NFT owner to send messages", async function () {
            const message = "Hello World!";
            const fee = await ocsh.BASE_MSG_FEE();
            await (0, chai_1.expect)(ocsh.connect(player2).sendMessage(0, message, { value: fee })).to.be.revertedWith("Not NFT owner");
        });
        it("Should implement cooldown mechanism", async function () {
            const message = "Hello World!";
            const fee = await ocsh.BASE_MSG_FEE();
            // Send first message
            await ocsh.connect(player1).sendMessage(0, message, { value: fee });
            // Try to send second message immediately (should fail due to cooldown)
            await (0, chai_1.expect)(ocsh.connect(player1).sendMessage(0, message, { value: fee })).to.be.revertedWith("Cooldown");
            // Mine 10 blocks to pass cooldown
            await mine(10);
            // Now second message should work
            await (0, chai_1.expect)(ocsh.connect(player1).sendMessage(0, message, { value: fee })).to.not.be.reverted;
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
            await (0, chai_1.expect)(ocsh.connect(player1).sendMessage(0, message, { value: expectedFee2 })).to.emit(ocsh, "MessageSent")
                .withArgs(0, player1.address, anyValue, expectedFee2);
        });
    });
    describe("Alliance System", function () {
        beforeEach(async function () {
            // Mint tokens for alliance testing
            await ocsh.mint(player1.address, hardhat_1.ethers.encodeBytes32String("player1"));
            await ocsh.mint(player1.address, hardhat_1.ethers.encodeBytes32String("player1-2"));
            await ocsh.mint(player2.address, hardhat_1.ethers.encodeBytes32String("player2"));
            await ocsh.mint(player3.address, hardhat_1.ethers.encodeBytes32String("player3"));
        });
        it("Should create alliance with multiple tokens", async function () {
            const memberTokens = [0, 1]; // Player1's tokens
            await (0, chai_1.expect)(ocsh.connect(player1).createAlliance(memberTokens)).to.emit(ocsh, "AllianceCreated")
                .withArgs(0, memberTokens, player1.address);
            const alliance = await ocsh.alliances(0);
            (0, chai_1.expect)(alliance.exists).to.be.true;
            (0, chai_1.expect)(alliance.leader).to.equal(player1.address);
            (0, chai_1.expect)(alliance.members).to.deep.equal(memberTokens);
            // Check alliance membership
            (0, chai_1.expect)(await ocsh.allianceOf(0)).to.equal(0);
            (0, chai_1.expect)(await ocsh.allianceOf(1)).to.equal(0);
        });
        it("Should only allow token owner to create alliance", async function () {
            const memberTokens = [0, 2]; // Mix of player1 and player2 tokens
            await (0, chai_1.expect)(ocsh.connect(player1).createAlliance(memberTokens)).to.be.revertedWith("Not owner of all NFTs");
        });
        it("Should allow joining existing alliance", async function () {
            // Create alliance with player1's tokens
            await ocsh.connect(player1).createAlliance([0, 1]);
            // Player2 joins with their token
            await (0, chai_1.expect)(ocsh.connect(player2).joinAlliance(0, 2)).to.emit(ocsh, "AllianceJoined")
                .withArgs(0, 2);
            (0, chai_1.expect)(await ocsh.allianceOf(2)).to.equal(0);
            // Check updated alliance membership
            const alliance = await ocsh.alliances(0);
            (0, chai_1.expect)(alliance.members.length).to.equal(3);
        });
        it("Should reject joining non-existent alliance", async function () {
            await (0, chai_1.expect)(ocsh.connect(player2).joinAlliance(999, 2)).to.be.revertedWith("Alliance does not exist");
        });
        it("Should assign alliance leader role", async function () {
            await ocsh.connect(player1).createAlliance([0, 1]);
            const ALLIANCE_LEADER_ROLE = await ocsh.ALLIANCE_LEADER_ROLE();
            (0, chai_1.expect)(await ocsh.hasRole(ALLIANCE_LEADER_ROLE, player1.address)).to.be.true;
        });
    });
    describe("Challenge System", function () {
        beforeEach(async function () {
            await ocsh.mint(player1.address, hardhat_1.ethers.encodeBytes32String("player1"));
            await ocsh.mint(player2.address, hardhat_1.ethers.encodeBytes32String("player2"));
        });
        it("Should issue challenge between tokens", async function () {
            await (0, chai_1.expect)(ocsh.connect(player1).issueChallenge(0, 1)).to.emit(ocsh, "ChallengeIssued")
                .withArgs(0, 0, 1);
            const challenge = await ocsh.challenges(0);
            (0, chai_1.expect)(challenge.challenger).to.equal(0);
            (0, chai_1.expect)(challenge.opponent).to.equal(1);
            (0, chai_1.expect)(challenge.status).to.equal(1); // Pending
        });
        it("Should not allow self-challenge", async function () {
            await (0, chai_1.expect)(ocsh.connect(player1).issueChallenge(0, 0)).to.be.revertedWith("Cannot challenge self");
        });
        it("Should only allow challenger owner to issue challenge", async function () {
            await (0, chai_1.expect)(ocsh.connect(player2).issueChallenge(0, 1)).to.be.revertedWith("Not challenger owner");
        });
        it("Should accept and resolve challenge", async function () {
            // Issue challenge
            await ocsh.connect(player1).issueChallenge(0, 1);
            // Accept challenge
            await (0, chai_1.expect)(ocsh.connect(player2).acceptChallenge(0)).to.emit(ocsh, "ChallengeResolved")
                .withArgs(0, anyValue);
            const challenge = await ocsh.challenges(0);
            (0, chai_1.expect)(challenge.status).to.equal(3); // Resolved
            (0, chai_1.expect)(challenge.winner).to.not.equal(hardhat_1.ethers.ZeroAddress);
        });
        it("Should only allow opponent to accept challenge", async function () {
            await ocsh.connect(player1).issueChallenge(0, 1);
            await (0, chai_1.expect)(ocsh.connect(player1).acceptChallenge(0)).to.be.revertedWith("Not opponent owner");
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
            (0, chai_1.expect)(finalLevel0.xp > initialLevel0.xp || finalLevel1.xp > initialLevel1.xp).to.be.true;
        });
    });
    describe("Trading System", function () {
        beforeEach(async function () {
            await ocsh.mint(player1.address, hardhat_1.ethers.encodeBytes32String("player1"));
            await ocsh.mint(player2.address, hardhat_1.ethers.encodeBytes32String("player2"));
        });
        it("Should propose trade between tokens", async function () {
            await (0, chai_1.expect)(ocsh.connect(player1).proposeTrade(0, 1)).to.emit(ocsh, "TradeProposed")
                .withArgs(0, 1);
            (0, chai_1.expect)(await ocsh.tradeProposals(0)).to.equal(1);
        });
        it("Should only allow token owner to propose trade", async function () {
            await (0, chai_1.expect)(ocsh.connect(player2).proposeTrade(0, 1)).to.be.revertedWith("Not owner");
        });
        it("Should accept trade and swap tokens", async function () {
            // Propose trade
            await ocsh.connect(player1).proposeTrade(0, 1);
            // Accept trade
            await (0, chai_1.expect)(ocsh.connect(player2).acceptTrade(0, 1)).to.emit(ocsh, "TradeAccepted")
                .withArgs(0, 1);
            // Verify ownership swap
            (0, chai_1.expect)(await ocsh.ownerOf(0)).to.equal(player2.address);
            (0, chai_1.expect)(await ocsh.ownerOf(1)).to.equal(player1.address);
            // Verify proposal cleanup
            (0, chai_1.expect)(await ocsh.tradeProposals(0)).to.equal(0);
        });
        it("Should only allow proposed trade acceptance", async function () {
            await (0, chai_1.expect)(ocsh.connect(player2).acceptTrade(0, 1)).to.be.revertedWith("No proposal");
        });
    });
    describe("Territory System", function () {
        beforeEach(async function () {
            await ocsh.mint(player1.address, hardhat_1.ethers.encodeBytes32String("player1"));
            await ocsh.mint(player2.address, hardhat_1.ethers.encodeBytes32String("player2"));
        });
        it("Should claim territory with valid token", async function () {
            await (0, chai_1.expect)(ocsh.connect(player1).claimTerritory(0, 0)).to.emit(ocsh, "TerritoryClaimed")
                .withArgs(0, 0, 0); // territory, token, alliance (0 = no alliance)
            const territory = await ocsh.territories(0);
            (0, chai_1.expect)(territory.ownerTokenId).to.equal(0);
            (0, chai_1.expect)(territory.lastClaimed).to.be.greaterThan(0);
        });
        it("Should reject invalid territory ID", async function () {
            await (0, chai_1.expect)(ocsh.connect(player1).claimTerritory(10, 0) // Invalid territory (max is 9)
            ).to.be.revertedWith("Invalid territory");
        });
        it("Should only allow token owner to claim territory", async function () {
            await (0, chai_1.expect)(ocsh.connect(player2).claimTerritory(0, 0)).to.be.revertedWith("Not NFT owner");
        });
        it("Should award XP for territory claim", async function () {
            const initialLevel = await ocsh.levels(0);
            await ocsh.connect(player1).claimTerritory(0, 0);
            const finalLevel = await ocsh.levels(0);
            (0, chai_1.expect)(finalLevel.xp).to.equal(initialLevel.xp + 50n);
        });
        it("Should associate territory with alliance", async function () {
            // Create alliance first
            await ocsh.connect(player1).createAlliance([0]);
            // Claim territory
            await ocsh.connect(player1).claimTerritory(0, 0);
            const territory = await ocsh.territories(0);
            (0, chai_1.expect)(territory.allianceId).to.equal(0); // Alliance ID 0
        });
    });
    describe("Leveling System", function () {
        beforeEach(async function () {
            await ocsh.mint(player1.address, hardhat_1.ethers.encodeBytes32String("player1"));
        });
        it("Should start at level 1 with 0 XP", async function () {
            const level = await ocsh.levels(0);
            (0, chai_1.expect)(level.level).to.equal(0); // Default level
            (0, chai_1.expect)(level.xp).to.equal(0);
        });
        it("Should level up with enough XP", async function () {
            // Claim territory to get 50 XP
            await ocsh.connect(player1).claimTerritory(0, 0);
            // Claim another territory to get to 100 XP (level 2)
            await ocsh.connect(player1).claimTerritory(1, 0);
            const level = await ocsh.levels(0);
            (0, chai_1.expect)(level.xp).to.equal(100);
            (0, chai_1.expect)(level.level).to.be.greaterThan(0);
        });
    });
    describe("Chain Traversal", function () {
        beforeEach(async function () {
            // Mint several tokens to create a chain
            await ocsh.mint(player1.address, hardhat_1.ethers.encodeBytes32String("token0"));
            await ocsh.mint(player1.address, hardhat_1.ethers.encodeBytes32String("token1"));
            await ocsh.mint(player1.address, hardhat_1.ethers.encodeBytes32String("token2"));
        });
        it("Should return chain links with correct depth", async function () {
            const chainLinks = await ocsh.getChain(2, 3); // Get 3 links starting from token 2
            (0, chai_1.expect)(chainLinks.length).to.equal(3);
            (0, chai_1.expect)(chainLinks[0].prevTokenId).to.equal(1); // Token 2 links to token 1
            (0, chai_1.expect)(chainLinks[1].prevTokenId).to.equal(0); // Token 1 links to token 0
            (0, chai_1.expect)(chainLinks[2].prevTokenId).to.equal(0); // Token 0 links to itself (first token)
        });
    });
    describe("On-chain Guide", function () {
        it("Should return darknet guide content", async function () {
            const [guide1, guide2, guide3] = await ocsh.getDarknetGuide();
            (0, chai_1.expect)(guide1).to.include("Darknet Continuum");
            (0, chai_1.expect)(guide1).to.include("MOVING VALUE WITHOUT THE INTERNET");
            (0, chai_1.expect)(guide2).to.include("PHYSICAL HANDSHAKE");
            (0, chai_1.expect)(guide3).to.include("SKYCHAIN RELAY");
        });
    });
    // tokenURI embedded image was removed from contract; test removed
    // Helper function to mine blocks (for cooldown testing)
    async function mine(blocks) {
        for (let i = 0; i < blocks; i++) {
            await hardhat_1.ethers.provider.send("evm_mine", []);
        }
    }
    // Helper for matching any value in events
    const anyValue = () => true;
});
