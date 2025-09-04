import { expect } from "chai";
import hardhat from "hardhat";
const { ethers } = hardhat as any;
const path = require("path");
import { OCSH } from "../typechain-types";

describe("OCSH Contract - Basic Tests", function () {
  let ocsh: OCSH;
  let owner: any;
  let player1: any;
  let player2: any;

  beforeEach(async function () {
    // Get signers
    [owner, player1, player2] = await ethers.getSigners();

    // Deploy EASMock
    const EASMockArtifact = await hardhat.artifacts.readArtifact("contracts/mocks/EASMock.sol:EASMock");
    const EASMockFactory = await ethers.getContractFactory(EASMockArtifact.abi, EASMockArtifact.bytecode);
    const easMock = await EASMockFactory.deploy();
    await easMock.waitForDeployment();

    // Deploy ARC_IdentitySBT proxy using upgrades
    const IdentitySBTArtifact = await hardhat.artifacts.readArtifact("contracts/IdentitySBT.sol:ARC_IdentitySBT");
    const IdentitySBTFactory = await ethers.getContractFactory(IdentitySBTArtifact.abi, IdentitySBTArtifact.bytecode);
    const identitySBT = await hardhat.upgrades.deployProxy(IdentitySBTFactory, [
      owner.address, // timelock
      owner.address, // safeExecutor
      await easMock.getAddress(), // eas
      ethers.keccak256(ethers.toUtf8Bytes("IdentityRole(uint256 role,uint256 weight,address recipient)")) // schemaId
    ], { kind: 'uups' });
    await identitySBT.waitForDeployment();

    let ocshArtifact;
    try {
      ocshArtifact = await hardhat.artifacts.readArtifact("OCSH");
    } catch (_) {
      ocshArtifact = await hardhat.artifacts.readArtifact("contracts/OCSH.sol:OCSH");
    }
    const OCSHFactory = await ethers.getContractFactory(ocshArtifact.abi, ocshArtifact.bytecode);
    ocsh = (await OCSHFactory.deploy(await identitySBT.getAddress())) as unknown as OCSH;
    await (ocsh as any).waitForDeployment?.();

    // Issue SBT roles for testing
    const COMMANDER_ROLE = ethers.keccak256(ethers.toUtf8Bytes("COMMANDER"));
    await identitySBT.issue(owner.address, COMMANDER_ROLE, ethers.randomBytes(32));
    await identitySBT.issue(player1.address, COMMANDER_ROLE, ethers.randomBytes(32));
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await ocsh.owner()).to.equal(owner.address);
    });

    it("Should initialize with zero tokens", async function () {
      expect(await ocsh.nextTokenId()).to.equal(0);
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
      await ocsh.mint(player1.address, customData);

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
    });
  });

  describe("Basic Alliance System", function () {
    beforeEach(async function () {
      // Mint tokens for alliance testing
      await ocsh.mint(player1.address, ethers.encodeBytes32String("player1"));
      await ocsh.mint(player1.address, ethers.encodeBytes32String("player1-2"));
      await ocsh.mint(player2.address, ethers.encodeBytes32String("player2"));
    });

    it("Should create alliance with multiple tokens", async function () {
      const memberTokens = [0, 1]; // Player1's tokens
      
      await ocsh.connect(player1).createAlliance(memberTokens);

      const alliance = await ocsh.alliances(0);
      expect(alliance.exists).to.be.true;
      expect(alliance.leader).to.equal(player1.address);
      
      // Check alliance membership
      expect(await ocsh.allianceOf(0)).to.equal(0);
      expect(await ocsh.allianceOf(1)).to.equal(0);
    });
  });

  describe("Territory System", function () {
    beforeEach(async function () {
      await ocsh.mint(player1.address, ethers.encodeBytes32String("player1"));
    });

    it("Should claim territory with valid token", async function () {
      await ocsh.connect(player1).claimTerritory(0, 0);

      const territory = await ocsh.territories(0);
      expect(territory.ownerTokenId).to.equal(0);
      expect(territory.lastClaimed).to.be.greaterThan(0);
    });
  });
});
