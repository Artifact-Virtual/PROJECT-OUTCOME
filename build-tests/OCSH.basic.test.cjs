"use strict";
var import_chai = require("chai");
var import_hardhat = require("hardhat");
describe("OCSH Contract - Basic Tests", function() {
  let ocsh;
  let owner;
  let player1;
  let player2;
  beforeEach(async function() {
    [owner, player1, player2] = await import_hardhat.ethers.getSigners();
    const OCShFactory = await import_hardhat.ethers.getContractFactory("OCSH");
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
      await ocsh.mint(player1.address, customData);
      (0, import_chai.expect)(await ocsh.ownerOf(0)).to.equal(player1.address);
      (0, import_chai.expect)(await ocsh.nextTokenId()).to.equal(1);
      const chainLink = await ocsh.chain(0);
      (0, import_chai.expect)(chainLink.prevTokenId).to.equal(0);
      (0, import_chai.expect)(chainLink.timestamp).to.be.greaterThan(0);
    });
    it("Should only allow owner to mint", async function() {
      await (0, import_chai.expect)(
        ocsh.connect(player1).mint(player1.address, customData)
      ).to.be.revertedWithCustomError(ocsh, "OwnableUnauthorizedAccount");
    });
  });
  describe("Basic Alliance System", function() {
    beforeEach(async function() {
      await ocsh.mint(player1.address, import_hardhat.ethers.encodeBytes32String("player1"));
      await ocsh.mint(player1.address, import_hardhat.ethers.encodeBytes32String("player1-2"));
      await ocsh.mint(player2.address, import_hardhat.ethers.encodeBytes32String("player2"));
    });
    it("Should create alliance with multiple tokens", async function() {
      const memberTokens = [0, 1];
      await ocsh.connect(player1).createAlliance(memberTokens);
      const alliance = await ocsh.alliances(0);
      (0, import_chai.expect)(alliance.exists).to.be.true;
      (0, import_chai.expect)(alliance.leader).to.equal(player1.address);
      (0, import_chai.expect)(await ocsh.allianceOf(0)).to.equal(0);
      (0, import_chai.expect)(await ocsh.allianceOf(1)).to.equal(0);
    });
  });
  describe("Territory System", function() {
    beforeEach(async function() {
      await ocsh.mint(player1.address, import_hardhat.ethers.encodeBytes32String("player1"));
    });
    it("Should claim territory with valid token", async function() {
      await ocsh.connect(player1).claimTerritory(0, 0);
      const territory = await ocsh.territories(0);
      (0, import_chai.expect)(territory.ownerTokenId).to.equal(0);
      (0, import_chai.expect)(territory.lastClaimed).to.be.greaterThan(0);
    });
  });
});
