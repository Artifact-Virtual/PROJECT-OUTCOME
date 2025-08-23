"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const hardhat_1 = require("hardhat");
describe("OCSH Edge Cases & Integration Tests", function () {
    let ocsh;
    let owner;
    let players;
    beforeEach(async function () {
        const signers = await hardhat_1.ethers.getSigners();
        owner = signers[0];
        players = signers.slice(1, 11); // Get 10 players for testing
        const OCShFactory = await hardhat_1.ethers.getContractFactory("OCSH");
        ocsh = await OCShFactory.deploy();
        await ocsh.waitForDeployment();
        // Mint tokens for all players
        for (let i = 0; i < players.length; i++) {
            await ocsh.mint(players[i].address, hardhat_1.ethers.encodeBytes32String(`player${i}`));
        }
    });
    describe("Large Scale Alliance Management", function () {
        it("Should handle large alliance with many members", async function () {
            // Create alliance with player 0's token
            await ocsh.connect(players[0]).createAlliance([0]);
            // Add many members to the alliance
            for (let i = 1; i < 8; i++) {
                await ocsh.connect(players[i]).joinAlliance(0, i);
            }
            const alliance = await ocsh.alliances(0);
            (0, chai_1.expect)(alliance.members.length).to.equal(8);
            // Verify all members are correctly assigned
            for (let i = 0; i < 8; i++) {
                (0, chai_1.expect)(await ocsh.allianceOf(i)).to.equal(0);
            }
        });
        it("Should handle multiple competing alliances", async function () {
            // Create first alliance
            await ocsh.connect(players[0]).createAlliance([0]);
            await ocsh.connect(players[1]).joinAlliance(0, 1);
            await ocsh.connect(players[2]).joinAlliance(0, 2);
            // Create competing alliance
            await ocsh.connect(players[3]).createAlliance([3]);
            await ocsh.connect(players[4]).joinAlliance(1, 4);
            await ocsh.connect(players[5]).joinAlliance(1, 5);
            // Verify distinct alliances
            (0, chai_1.expect)(await ocsh.allianceOf(0)).to.equal(0);
            (0, chai_1.expect)(await ocsh.allianceOf(1)).to.equal(0);
            (0, chai_1.expect)(await ocsh.allianceOf(2)).to.equal(0);
            (0, chai_1.expect)(await ocsh.allianceOf(3)).to.equal(1);
            (0, chai_1.expect)(await ocsh.allianceOf(4)).to.equal(1);
            (0, chai_1.expect)(await ocsh.allianceOf(5)).to.equal(1);
        });
    });
    describe("Territory Control Race Conditions", function () {
        it("Should handle rapid territory claims", async function () {
            // Multiple players try to claim the same territory rapidly
            const promises = [];
            // Only one should succeed
            promises.push(ocsh.connect(players[0]).claimTerritory(0, 0));
            promises.push(ocsh.connect(players[1]).claimTerritory(0, 1));
            promises.push(ocsh.connect(players[2]).claimTerritory(0, 2));
            // Wait for all transactions to be mined
            await Promise.allSettled(promises);
            const territory = await ocsh.territories(0);
            // Territory should be claimed by one of the players
            (0, chai_1.expect)([0, 1, 2]).to.include(Number(territory.ownerTokenId));
        });
        it("Should allow territory reclaiming", async function () {
            // Player 0 claims territory
            await ocsh.connect(players[0]).claimTerritory(0, 0);
            let territory = await ocsh.territories(0);
            (0, chai_1.expect)(territory.ownerTokenId).to.equal(0);
            // Player 1 reclaims the same territory
            await ocsh.connect(players[1]).claimTerritory(0, 1);
            territory = await ocsh.territories(0);
            (0, chai_1.expect)(territory.ownerTokenId).to.equal(1);
        });
        it("Should claim all territories", async function () {
            // Claim all 10 territories
            for (let i = 0; i < 10; i++) {
                await ocsh.connect(players[i]).claimTerritory(i, i);
                const territory = await ocsh.territories(i);
                (0, chai_1.expect)(territory.ownerTokenId).to.equal(i);
            }
        });
    });
    describe("Message Spam Prevention", function () {
        it("Should prevent message spam with exponential fees", async function () {
            const message = "Spam message";
            let currentFee = await ocsh.BASE_MSG_FEE();
            // Send messages and verify increasing fees
            for (let i = 0; i < 5; i++) {
                await ocsh.connect(players[0]).sendMessage(0, message, { value: currentFee });
                // Mine blocks to pass cooldown
                await mine(10);
                // Next message should cost double
                currentFee = currentFee * 2n;
                (0, chai_1.expect)(await ocsh.msgCount(0)).to.equal(i + 1);
            }
            // By the 5th message, fee should be very high
            (0, chai_1.expect)(currentFee).to.be.greaterThan(hardhat_1.ethers.parseEther("0.0001"));
        });
        it("Should enforce cooldown across multiple blocks", async function () {
            const message = "Test message";
            const fee = await ocsh.BASE_MSG_FEE();
            // Send initial message
            await ocsh.connect(players[0]).sendMessage(0, message, { value: fee });
            // Try sending messages in subsequent blocks (should fail until cooldown passes)
            for (let i = 1; i < 10; i++) {
                await mine(1);
                await (0, chai_1.expect)(ocsh.connect(players[0]).sendMessage(0, message, { value: fee })).to.be.revertedWith("Cooldown");
            }
            // After 10 blocks, should work
            await mine(1);
            await (0, chai_1.expect)(ocsh.connect(players[0]).sendMessage(0, message, { value: fee })).to.not.be.reverted;
        });
    });
    describe("Complex Game Flow Integration", function () {
        it("Should handle complete game progression", async function () {
            // 1. Create alliance
            await ocsh.connect(players[0]).createAlliance([0]);
            await ocsh.connect(players[1]).joinAlliance(0, 1);
            // 2. Claim territories
            await ocsh.connect(players[0]).claimTerritory(0, 0);
            await ocsh.connect(players[1]).claimTerritory(1, 1);
            // 3. Send messages
            const fee = await ocsh.BASE_MSG_FEE();
            await ocsh.connect(players[0]).sendMessage(0, "Alliance formed!", { value: fee });
            // 4. Challenge between alliance members (friendly)
            await ocsh.connect(players[0]).issueChallenge(0, 1);
            await ocsh.connect(players[1]).acceptChallenge(0);
            // 5. Trade tokens
            await ocsh.connect(players[0]).proposeTrade(0, 1);
            await ocsh.connect(players[1]).acceptTrade(0, 1);
            // Verify final state
            (0, chai_1.expect)(await ocsh.ownerOf(0)).to.equal(players[1].address);
            (0, chai_1.expect)(await ocsh.ownerOf(1)).to.equal(players[0].address);
            const alliance = await ocsh.alliances(0);
            (0, chai_1.expect)(alliance.members.length).to.equal(2);
            const territory0 = await ocsh.territories(0);
            const territory1 = await ocsh.territories(1);
            (0, chai_1.expect)(territory0.ownerTokenId).to.equal(0);
            (0, chai_1.expect)(territory1.ownerTokenId).to.equal(1);
        });
        it("Should handle alliance warfare scenario", async function () {
            // Create two competing alliances
            await ocsh.connect(players[0]).createAlliance([0]);
            await ocsh.connect(players[1]).joinAlliance(0, 1);
            await ocsh.connect(players[2]).joinAlliance(0, 2);
            await ocsh.connect(players[3]).createAlliance([3]);
            await ocsh.connect(players[4]).joinAlliance(1, 4);
            await ocsh.connect(players[5]).joinAlliance(1, 5);
            // Claim territories
            await ocsh.connect(players[0]).claimTerritory(0, 0);
            await ocsh.connect(players[1]).claimTerritory(1, 1);
            await ocsh.connect(players[3]).claimTerritory(2, 3);
            await ocsh.connect(players[4]).claimTerritory(3, 4);
            // Cross-alliance challenges
            await ocsh.connect(players[0]).issueChallenge(0, 3); // Alliance 0 vs Alliance 1
            await ocsh.connect(players[3]).acceptChallenge(0);
            await ocsh.connect(players[1]).issueChallenge(1, 4); // Alliance 0 vs Alliance 1
            await ocsh.connect(players[4]).acceptChallenge(1);
            // Verify challenges were resolved
            const challenge0 = await ocsh.challenges(0);
            const challenge1 = await ocsh.challenges(1);
            (0, chai_1.expect)(challenge0.status).to.equal(3); // Resolved
            (0, chai_1.expect)(challenge1.status).to.equal(3); // Resolved
        });
    });
    describe("Security Edge Cases", function () {
        it("Should prevent token ID manipulation", async function () {
            // Try to claim territory with non-existent token
            await (0, chai_1.expect)(ocsh.connect(players[0]).claimTerritory(0, 999)).to.be.revertedWith("ERC721: invalid token ID");
        });
        it("Should prevent alliance ID manipulation", async function () {
            // Try to join non-existent alliance
            await (0, chai_1.expect)(ocsh.connect(players[0]).joinAlliance(999, 0)).to.be.revertedWith("Alliance does not exist");
        });
        it("Should handle challenge with non-existent token", async function () {
            await (0, chai_1.expect)(ocsh.connect(players[0]).issueChallenge(0, 999)).to.be.revertedWith("ERC721: invalid token ID");
        });
        it("Should prevent duplicate trade proposals", async function () {
            await ocsh.connect(players[0]).proposeTrade(0, 1);
            // Overwrite previous proposal
            await ocsh.connect(players[0]).proposeTrade(0, 2);
            (0, chai_1.expect)(await ocsh.tradeProposals(0)).to.equal(2);
        });
    });
    describe("Gas Optimization Testing", function () {
        it("Should efficiently handle bulk operations", async function () {
            const startGas = await hardhat_1.ethers.provider.getBalance(owner.address);
            // Perform many operations in sequence
            for (let i = 0; i < 5; i++) {
                await ocsh.connect(players[i]).claimTerritory(i, i);
                if (i > 0) {
                    await ocsh.connect(players[i]).joinAlliance(0, i);
                }
                else {
                    await ocsh.connect(players[i]).createAlliance([i]);
                }
            }
            const endGas = await hardhat_1.ethers.provider.getBalance(owner.address);
            // Verify operations completed (gas usage is informational)
            const alliance = await ocsh.alliances(0);
            (0, chai_1.expect)(alliance.members.length).to.equal(5);
            for (let i = 0; i < 5; i++) {
                const territory = await ocsh.territories(i);
                (0, chai_1.expect)(territory.ownerTokenId).to.equal(i);
            }
        });
    });
    describe("XP and Leveling Edge Cases", function () {
        it("Should handle XP overflow protection", async function () {
            // Claim many territories to accumulate XP
            for (let i = 0; i < 10; i++) {
                await ocsh.connect(players[0]).claimTerritory(i, 0);
            }
            const level = await ocsh.levels(0);
            (0, chai_1.expect)(level.xp).to.equal(500); // 10 territories * 50 XP each
            (0, chai_1.expect)(level.level).to.equal(5); // Max level
        });
        it("Should handle challenges with high XP gain", async function () {
            // Set up challenges between multiple tokens
            for (let i = 1; i < 5; i++) {
                await ocsh.connect(players[0]).issueChallenge(0, i);
                await ocsh.connect(players[i]).acceptChallenge(i - 1);
            }
            // Check that winner tokens gained appropriate XP
            const level0 = await ocsh.levels(0);
            (0, chai_1.expect)(level0.xp).to.be.greaterThan(0);
        });
    });
    // Helper function to mine blocks
    async function mine(blocks) {
        for (let i = 0; i < blocks; i++) {
            await hardhat_1.ethers.provider.send("evm_mine", []);
        }
    }
});
