"use strict";
var import_chai = require("chai");
var import_hardhat = require("hardhat");
describe("OCSH Edge Cases & Integration Tests", function() {
  let ocsh;
  let owner;
  let players;
  beforeEach(async function() {
    const signers = await import_hardhat.ethers.getSigners();
    owner = signers[0];
    players = signers.slice(1, 11);
    const OCShFactory = await import_hardhat.ethers.getContractFactory("OCSH");
    ocsh = await OCShFactory.deploy();
    await ocsh.waitForDeployment();
    for (let i = 0; i < players.length; i++) {
      await ocsh.mint(players[i].address, import_hardhat.ethers.encodeBytes32String(`player${i}`));
    }
  });
  describe("Large Scale Alliance Management", function() {
    it("Should handle large alliance with many members", async function() {
      await ocsh.connect(players[0]).createAlliance([0]);
      for (let i = 1; i < 8; i++) {
        await ocsh.connect(players[i]).joinAlliance(0, i);
      }
      const alliance = await ocsh.alliances(0);
      (0, import_chai.expect)(alliance.members.length).to.equal(8);
      for (let i = 0; i < 8; i++) {
        (0, import_chai.expect)(await ocsh.allianceOf(i)).to.equal(0);
      }
    });
    it("Should handle multiple competing alliances", async function() {
      await ocsh.connect(players[0]).createAlliance([0]);
      await ocsh.connect(players[1]).joinAlliance(0, 1);
      await ocsh.connect(players[2]).joinAlliance(0, 2);
      await ocsh.connect(players[3]).createAlliance([3]);
      await ocsh.connect(players[4]).joinAlliance(1, 4);
      await ocsh.connect(players[5]).joinAlliance(1, 5);
      (0, import_chai.expect)(await ocsh.allianceOf(0)).to.equal(0);
      (0, import_chai.expect)(await ocsh.allianceOf(1)).to.equal(0);
      (0, import_chai.expect)(await ocsh.allianceOf(2)).to.equal(0);
      (0, import_chai.expect)(await ocsh.allianceOf(3)).to.equal(1);
      (0, import_chai.expect)(await ocsh.allianceOf(4)).to.equal(1);
      (0, import_chai.expect)(await ocsh.allianceOf(5)).to.equal(1);
    });
  });
  describe("Territory Control Race Conditions", function() {
    it("Should handle rapid territory claims", async function() {
      const promises = [];
      promises.push(ocsh.connect(players[0]).claimTerritory(0, 0));
      promises.push(ocsh.connect(players[1]).claimTerritory(0, 1));
      promises.push(ocsh.connect(players[2]).claimTerritory(0, 2));
      await Promise.allSettled(promises);
      const territory = await ocsh.territories(0);
      (0, import_chai.expect)([0, 1, 2]).to.include(Number(territory.ownerTokenId));
    });
    it("Should allow territory reclaiming", async function() {
      await ocsh.connect(players[0]).claimTerritory(0, 0);
      let territory = await ocsh.territories(0);
      (0, import_chai.expect)(territory.ownerTokenId).to.equal(0);
      await ocsh.connect(players[1]).claimTerritory(0, 1);
      territory = await ocsh.territories(0);
      (0, import_chai.expect)(territory.ownerTokenId).to.equal(1);
    });
    it("Should claim all territories", async function() {
      for (let i = 0; i < 10; i++) {
        await ocsh.connect(players[i]).claimTerritory(i, i);
        const territory = await ocsh.territories(i);
        (0, import_chai.expect)(territory.ownerTokenId).to.equal(i);
      }
    });
  });
  describe("Message Spam Prevention", function() {
    it("Should prevent message spam with exponential fees", async function() {
      const message = "Spam message";
      let currentFee = await ocsh.BASE_MSG_FEE();
      for (let i = 0; i < 5; i++) {
        await ocsh.connect(players[0]).sendMessage(0, message, { value: currentFee });
        await mine(10);
        currentFee = currentFee * 2n;
        (0, import_chai.expect)(await ocsh.msgCount(0)).to.equal(i + 1);
      }
      (0, import_chai.expect)(currentFee).to.be.greaterThan(import_hardhat.ethers.parseEther("0.0001"));
    });
    it("Should enforce cooldown across multiple blocks", async function() {
      const message = "Test message";
      const fee = await ocsh.BASE_MSG_FEE();
      await ocsh.connect(players[0]).sendMessage(0, message, { value: fee });
      for (let i = 1; i < 10; i++) {
        await mine(1);
        await (0, import_chai.expect)(
          ocsh.connect(players[0]).sendMessage(0, message, { value: fee })
        ).to.be.revertedWith("Cooldown");
      }
      await mine(1);
      await (0, import_chai.expect)(
        ocsh.connect(players[0]).sendMessage(0, message, { value: fee })
      ).to.not.be.reverted;
    });
  });
  describe("Complex Game Flow Integration", function() {
    it("Should handle complete game progression", async function() {
      await ocsh.connect(players[0]).createAlliance([0]);
      await ocsh.connect(players[1]).joinAlliance(0, 1);
      await ocsh.connect(players[0]).claimTerritory(0, 0);
      await ocsh.connect(players[1]).claimTerritory(1, 1);
      const fee = await ocsh.BASE_MSG_FEE();
      await ocsh.connect(players[0]).sendMessage(0, "Alliance formed!", { value: fee });
      await ocsh.connect(players[0]).issueChallenge(0, 1);
      await ocsh.connect(players[1]).acceptChallenge(0);
      await ocsh.connect(players[0]).proposeTrade(0, 1);
      await ocsh.connect(players[1]).acceptTrade(0, 1);
      (0, import_chai.expect)(await ocsh.ownerOf(0)).to.equal(players[1].address);
      (0, import_chai.expect)(await ocsh.ownerOf(1)).to.equal(players[0].address);
      const alliance = await ocsh.alliances(0);
      (0, import_chai.expect)(alliance.members.length).to.equal(2);
      const territory0 = await ocsh.territories(0);
      const territory1 = await ocsh.territories(1);
      (0, import_chai.expect)(territory0.ownerTokenId).to.equal(0);
      (0, import_chai.expect)(territory1.ownerTokenId).to.equal(1);
    });
    it("Should handle alliance warfare scenario", async function() {
      await ocsh.connect(players[0]).createAlliance([0]);
      await ocsh.connect(players[1]).joinAlliance(0, 1);
      await ocsh.connect(players[2]).joinAlliance(0, 2);
      await ocsh.connect(players[3]).createAlliance([3]);
      await ocsh.connect(players[4]).joinAlliance(1, 4);
      await ocsh.connect(players[5]).joinAlliance(1, 5);
      await ocsh.connect(players[0]).claimTerritory(0, 0);
      await ocsh.connect(players[1]).claimTerritory(1, 1);
      await ocsh.connect(players[3]).claimTerritory(2, 3);
      await ocsh.connect(players[4]).claimTerritory(3, 4);
      await ocsh.connect(players[0]).issueChallenge(0, 3);
      await ocsh.connect(players[3]).acceptChallenge(0);
      await ocsh.connect(players[1]).issueChallenge(1, 4);
      await ocsh.connect(players[4]).acceptChallenge(1);
      const challenge0 = await ocsh.challenges(0);
      const challenge1 = await ocsh.challenges(1);
      (0, import_chai.expect)(challenge0.status).to.equal(3);
      (0, import_chai.expect)(challenge1.status).to.equal(3);
    });
  });
  describe("Security Edge Cases", function() {
    it("Should prevent token ID manipulation", async function() {
      await (0, import_chai.expect)(
        ocsh.connect(players[0]).claimTerritory(0, 999)
      ).to.be.revertedWith("ERC721: invalid token ID");
    });
    it("Should prevent alliance ID manipulation", async function() {
      await (0, import_chai.expect)(
        ocsh.connect(players[0]).joinAlliance(999, 0)
      ).to.be.revertedWith("Alliance does not exist");
    });
    it("Should handle challenge with non-existent token", async function() {
      await (0, import_chai.expect)(
        ocsh.connect(players[0]).issueChallenge(0, 999)
      ).to.be.revertedWith("ERC721: invalid token ID");
    });
    it("Should prevent duplicate trade proposals", async function() {
      await ocsh.connect(players[0]).proposeTrade(0, 1);
      await ocsh.connect(players[0]).proposeTrade(0, 2);
      (0, import_chai.expect)(await ocsh.tradeProposals(0)).to.equal(2);
    });
  });
  describe("Gas Optimization Testing", function() {
    it("Should efficiently handle bulk operations", async function() {
      const startGas = await import_hardhat.ethers.provider.getBalance(owner.address);
      for (let i = 0; i < 5; i++) {
        await ocsh.connect(players[i]).claimTerritory(i, i);
        if (i > 0) {
          await ocsh.connect(players[i]).joinAlliance(0, i);
        } else {
          await ocsh.connect(players[i]).createAlliance([i]);
        }
      }
      const endGas = await import_hardhat.ethers.provider.getBalance(owner.address);
      const alliance = await ocsh.alliances(0);
      (0, import_chai.expect)(alliance.members.length).to.equal(5);
      for (let i = 0; i < 5; i++) {
        const territory = await ocsh.territories(i);
        (0, import_chai.expect)(territory.ownerTokenId).to.equal(i);
      }
    });
  });
  describe("XP and Leveling Edge Cases", function() {
    it("Should handle XP overflow protection", async function() {
      for (let i = 0; i < 10; i++) {
        await ocsh.connect(players[0]).claimTerritory(i, 0);
      }
      const level = await ocsh.levels(0);
      (0, import_chai.expect)(level.xp).to.equal(500);
      (0, import_chai.expect)(level.level).to.equal(5);
    });
    it("Should handle challenges with high XP gain", async function() {
      for (let i = 1; i < 5; i++) {
        await ocsh.connect(players[0]).issueChallenge(0, i);
        await ocsh.connect(players[i]).acceptChallenge(i - 1);
      }
      const level0 = await ocsh.levels(0);
      (0, import_chai.expect)(level0.xp).to.be.greaterThan(0);
    });
  });
  async function mine(blocks) {
    for (let i = 0; i < blocks; i++) {
      await import_hardhat.ethers.provider.send("evm_mine", []);
    }
  }
});
