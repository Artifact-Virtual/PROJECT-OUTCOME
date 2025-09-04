"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const hardhat_1 = __importDefault(require("hardhat"));
const { ethers } = hardhat_1.default;
describe("OCSH Contract - Basic Tests", function () {
    let ocsh;
    let owner;
    let player1;
    let player2;
    beforeEach(async function () {
        // Get signers
        [owner, player1, player2] = await ethers.getSigners();
        // Deploy real EAS
        const SchemaRegistryArtifact = await hardhat_1.default.artifacts.readArtifact("contracts/SchemaRegistry.sol:SchemaRegistry");
        const SchemaRegistryFactory = await ethers.getContractFactory(SchemaRegistryArtifact.abi, SchemaRegistryArtifact.bytecode);
        const schemaRegistry = await SchemaRegistryFactory.deploy();
        await schemaRegistry.waitForDeployment();
        const EASArtifact = await hardhat_1.default.artifacts.readArtifact("contracts/EAS.sol:EAS");
        const EASFactory = await ethers.getContractFactory(EASArtifact.abi, EASArtifact.bytecode);
        const eas = await EASFactory.deploy(await schemaRegistry.getAddress());
        await eas.waitForDeployment();
        // Deploy ARC_IdentitySBT proxy using upgrades
        const IdentitySBTArtifact = await hardhat_1.default.artifacts.readArtifact("contracts/IdentitySBT.sol:ARC_IdentitySBT");
        const IdentitySBTFactory = await ethers.getContractFactory(IdentitySBTArtifact.abi, IdentitySBTArtifact.bytecode);
        const identitySBT = await hardhat_1.default.upgrades.deployProxy(IdentitySBTFactory, [
            owner.address, // timelock
            owner.address, // safeExecutor
            await eas.getAddress(), // eas
            ethers.keccak256(ethers.toUtf8Bytes("IdentityRole(uint256 role,uint256 weight,address recipient)")) // schemaId
        ], { kind: 'uups' });
        await identitySBT.waitForDeployment();
        let ocshArtifact;
        try {
            ocshArtifact = await hardhat_1.default.artifacts.readArtifact("OCSH");
        }
        catch (_) {
            ocshArtifact = await hardhat_1.default.artifacts.readArtifact("contracts/OCSH.sol:OCSH");
        }
        const OCSHFactory = await ethers.getContractFactory(ocshArtifact.abi, ocshArtifact.bytecode);
        ocsh = (await OCSHFactory.deploy(await identitySBT.getAddress()));
        await ocsh.waitForDeployment?.();
        // Issue SBT roles for testing
        const SBT_ROLE_COMMANDER = await ocsh.SBT_ROLE_COMMANDER();
        await identitySBT.setRoleWeight(SBT_ROLE_COMMANDER, ethers.parseEther("1")); // Set default weight for commander role
        await identitySBT.issue(owner.address, SBT_ROLE_COMMANDER, ethers.encodeBytes32String("commander-uid"));
        await identitySBT.issue(player1.address, SBT_ROLE_COMMANDER, ethers.encodeBytes32String("player1-commander"));
    });
    describe("Deployment", function () {
        it("Should set the right owner", async function () {
            (0, chai_1.expect)(await ocsh.owner()).to.equal(owner.address);
        });
        it("Should initialize with zero tokens", async function () {
            (0, chai_1.expect)(await ocsh.nextTokenId()).to.equal(0);
        });
        it("Should set correct constants", async function () {
            (0, chai_1.expect)(await ocsh.MAX_MSG_LEN()).to.equal(64);
            (0, chai_1.expect)(await ocsh.BASE_MSG_FEE()).to.equal(ethers.parseEther("0.00001"));
            (0, chai_1.expect)(await ocsh.MSG_COOLDOWN_BLOCKS()).to.equal(10);
            (0, chai_1.expect)(await ocsh.NUM_TERRITORIES()).to.equal(10);
        });
    });
    describe("Minting", function () {
        const customData = ethers.encodeBytes32String("test-data");
        it("Should mint NFT with correct data", async function () {
            await ocsh.mint(player1.address, customData);
            (0, chai_1.expect)(await ocsh.ownerOf(0)).to.equal(player1.address);
            (0, chai_1.expect)(await ocsh.nextTokenId()).to.equal(1);
            const chainLink = await ocsh.chain(0);
            (0, chai_1.expect)(chainLink.prevTokenId).to.equal(0);
            (0, chai_1.expect)(chainLink.timestamp).to.be.greaterThan(0);
        });
        it("Should only allow owner to mint", async function () {
            await (0, chai_1.expect)(ocsh.connect(player1).mint(player1.address, customData)).to.be.revertedWithCustomError(ocsh, "OwnableUnauthorizedAccount");
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
            (0, chai_1.expect)(alliance.exists).to.be.true;
            (0, chai_1.expect)(alliance.leader).to.equal(player1.address);
            // Check alliance membership
            (0, chai_1.expect)(await ocsh.allianceOf(0)).to.equal(0);
            (0, chai_1.expect)(await ocsh.allianceOf(1)).to.equal(0);
        });
    });
    describe("Territory System", function () {
        beforeEach(async function () {
            await ocsh.mint(player1.address, ethers.encodeBytes32String("player1"));
        });
        it("Should claim territory with valid token", async function () {
            await ocsh.connect(player1).claimTerritory(0, 0);
            const territory = await ocsh.territories(0);
            (0, chai_1.expect)(territory.ownerTokenId).to.equal(0);
            (0, chai_1.expect)(territory.lastClaimed).to.be.greaterThan(0);
        });
    });
});
