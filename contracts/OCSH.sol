// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "./OSCHLib.sol";
import "./IdentitySBT.sol";

/**
 * @title OCSH NFT - Onchain Chain NFT with Game Mechanics, RBAC, Anti-Spam, Territory, Leveling
 * @notice Secure, transparent, and modular NFT game contract.
 */
contract OCSH is ERC721Enumerable, Ownable, AccessControl {
    using OCSHLib for *;

    // --- Roles ---
    bytes32 public constant GAME_ADMIN_ROLE = OCSHLib.GAME_ADMIN_ROLE;
    bytes32 public constant ALLIANCE_LEADER_ROLE = OCSHLib.ALLIANCE_LEADER_ROLE;

    // --- SBT Integration ---
    ARC_IdentitySBT public identitySBT;

    // SBT Role requirements for game actions
    bytes32 public constant SBT_ROLE_VETERAN = keccak256("VETERAN");
    bytes32 public constant SBT_ROLE_COMMANDER = keccak256("COMMANDER");
    bytes32 public constant SBT_ROLE_TRADER = keccak256("TRADER");

    // Achievement SBTs
    bytes32 public constant ACHIEVEMENT_FIRST_WIN = keccak256("FIRST_WIN");
    bytes32 public constant ACHIEVEMENT_TERRITORY_MASTER = keccak256("TERRITORY_MASTER");
    bytes32 public constant ACHIEVEMENT_ALLIANCE_BUILDER = keccak256("ALLIANCE_BUILDER");

    // Modifiers
    modifier requiresSBTRole(bytes32 role) {
        require(identitySBT.hasRole(msg.sender, role), "SBT role required");
        _;
    }

    modifier hasMinReputation(uint256 minRep) {
        uint256 reputation = identitySBT.weightOf(msg.sender);
        require(reputation >= minRep, "Insufficient reputation");
        _;
    }

    struct ChainLink {
        uint40 prevTokenId;
        bytes32 dataHash;
        uint40 timestamp;
    }
    mapping(uint256 => ChainLink) public chain;
    uint40 public nextTokenId;

    // --- Messaging ---
    struct Message {
        address from;
        bytes32 textHash;
        uint40 timestamp;
    }
    mapping(uint256 => Message[]) public messages;
    mapping(uint256 => uint256) public lastMsgBlock;
    mapping(uint256 => uint256) public msgCount;
    uint8 public constant MAX_MSG_LEN = 64;
    uint256 public constant BASE_MSG_FEE = 0.00001 ether;
    uint256 public constant MSG_COOLDOWN_BLOCKS = 10;

    // --- Alliances ---
    struct Alliance {
        uint40[] members;
        bool exists;
        address leader;
    }
    mapping(uint40 => uint40) public allianceOf; // tokenId => allianceId
    mapping(uint40 => Alliance) public alliances; // allianceId => Alliance
    uint40 public nextAllianceId;

    // --- Challenges ---
    enum ChallengeStatus { None, Pending, Accepted, Resolved }
    struct Challenge {
        uint40 challenger;
        uint40 opponent;
        ChallengeStatus status;
        address winner;
        uint40 timestamp;
    }
    mapping(uint40 => Challenge) public challenges;
    uint40 public nextChallengeId;

    // --- Trading/Gifting ---
    mapping(uint40 => uint40) public tradeProposals; // fromToken => toToken

    // --- Territory ---
    struct Territory {
        uint40 ownerTokenId;
        uint40 allianceId;
        uint40 lastClaimed;
    }
    mapping(uint40 => Territory) public territories;
    uint40 public constant NUM_TERRITORIES = 10;

    // --- Leveling ---
    mapping(uint40 => OCSHLib.LevelInfo) public levels;

    // --- Events ---
    event Minted(address indexed to, uint40 indexed tokenId, uint40 prevTokenId, bytes32 dataHash);
    event MessageSent(uint40 indexed tokenId, address indexed from, bytes32 textHash, uint256 fee);
    event AllianceCreated(uint40 indexed allianceId, uint40[] members, address leader);
    event AllianceJoined(uint40 indexed allianceId, uint40 indexed tokenId);
    event ChallengeIssued(uint40 indexed challengeId, uint40 challenger, uint40 opponent);
    event ChallengeResolved(uint40 indexed challengeId, address winner);
    event TradeProposed(uint40 indexed fromToken, uint40 indexed toToken);
    event TradeAccepted(uint40 indexed fromToken, uint40 indexed toToken);
    event TerritoryClaimed(uint40 indexed territoryId, uint40 indexed tokenId, uint40 indexed allianceId);
    event LeveledUp(uint40 indexed tokenId, uint8 newLevel);

    constructor(address _identitySBT) ERC721("Onchain Survival Chain", "OCSH") Ownable(msg.sender) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(GAME_ADMIN_ROLE, msg.sender);
        identitySBT = ARC_IdentitySBT(_identitySBT);
    }

    // Override supportsInterface to resolve conflict between ERC721Enumerable and AccessControl
    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721Enumerable, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    // --- Minting ---
    function mint(address to, bytes32 customData) external onlyOwner {
        uint40 tokenId = nextTokenId;
        uint40 prevTokenId = tokenId == 0 ? 0 : tokenId - 1;
        bytes32 dataHash = keccak256(abi.encodePacked(blockhash(block.number - 1), to, customData, prevTokenId));
        chain[tokenId] = ChainLink({
            prevTokenId: prevTokenId,
            dataHash: dataHash,
            timestamp: uint40(block.timestamp)
        });
        _safeMint(to, tokenId);
        nextTokenId++;
        emit Minted(to, tokenId, prevTokenId, dataHash);
    }

    // --- Messaging (Anti-Spam, Fee) ---
    function sendMessage(uint40 tokenId, string calldata text) external payable {
        require(ownerOf(tokenId) == msg.sender, "Not NFT owner");
        require(bytes(text).length > 0 && bytes(text).length <= MAX_MSG_LEN, "Message length");
        require(OCSHLib.messageCooldown(lastMsgBlock[tokenId], MSG_COOLDOWN_BLOCKS), "Cooldown");
        uint256 fee = OCSHLib.calcMessageFee(BASE_MSG_FEE, msgCount[tokenId]);
        require(msg.value >= fee, "Insufficient fee");
        bytes32 textHash = keccak256(bytes(text));
        messages[tokenId].push(Message({from: msg.sender, textHash: textHash, timestamp: uint40(block.timestamp)}));
        lastMsgBlock[tokenId] = block.number;
        msgCount[tokenId]++;
        emit MessageSent(tokenId, msg.sender, textHash, fee);
    }

    // --- Alliances (RBAC) ---
    function createAlliance(uint40[] calldata memberTokenIds) external requiresSBTRole(SBT_ROLE_COMMANDER) returns (uint40) {
        for (uint i = 0; i < memberTokenIds.length; i++) {
            require(ownerOf(memberTokenIds[i]) == msg.sender, "Not owner of all NFTs");
        }
        uint40 id = nextAllianceId++;
        alliances[id] = Alliance({members: memberTokenIds, exists: true, leader: msg.sender});
        for (uint i = 0; i < memberTokenIds.length; i++) {
            allianceOf[memberTokenIds[i]] = id;
        }
        _grantRole(ALLIANCE_LEADER_ROLE, msg.sender);
        emit AllianceCreated(id, memberTokenIds, msg.sender);
        return id;
    }

    function joinAlliance(uint40 allianceId, uint40 tokenId) external {
        require(alliances[allianceId].exists, "Alliance does not exist");
        require(ownerOf(tokenId) == msg.sender, "Not NFT owner");
        alliances[allianceId].members.push(tokenId);
        allianceOf[tokenId] = allianceId;
        emit AllianceJoined(allianceId, tokenId);
    }

    // --- Challenges ---
    function issueChallenge(uint40 challenger, uint40 opponent) external returns (uint40) {
        require(ownerOf(challenger) == msg.sender, "Not challenger owner");
        require(challenger != opponent, "Cannot challenge self");
        uint40 id = nextChallengeId++;
        challenges[id] = Challenge({
            challenger: challenger,
            opponent: opponent,
            status: ChallengeStatus.Pending,
            winner: address(0),
            timestamp: uint40(block.timestamp)
        });
        emit ChallengeIssued(id, challenger, opponent);
        return id;
    }

    function acceptChallenge(uint40 challengeId) external {
        Challenge storage c = challenges[challengeId];
        require(c.status == ChallengeStatus.Pending, "Not pending");
        require(ownerOf(c.opponent) == msg.sender, "Not opponent owner");
        c.status = ChallengeStatus.Accepted;
        // Sub-cent dice roll: blockhash + ids
        uint256 roll = uint256(keccak256(abi.encodePacked(blockhash(block.number - 1), c.challenger, c.opponent, block.timestamp)));
        address winner = roll % 2 == 0 ? ownerOf(c.challenger) : ownerOf(c.opponent);
        c.winner = winner;
        c.status = ChallengeStatus.Resolved;
        // Level up winner
        uint40 winnerToken = roll % 2 == 0 ? c.challenger : c.opponent;
        levels[winnerToken].xp += 100;
        uint8 newLevel = OCSHLib.xpToLevel(levels[winnerToken].xp);
        levels[winnerToken].level = newLevel;

        // Issue achievement SBT for first win
        address winnerAddress = ownerOf(winnerToken);
        if (!identitySBT.hasRole(winnerAddress, ACHIEVEMENT_FIRST_WIN)) {
            // Issue FIRST_WIN achievement SBT
            // Note: This would require the contract to have ISSUER_ROLE on IdentitySBT
            try identitySBT.issue(winnerAddress, ACHIEVEMENT_FIRST_WIN, keccak256(abi.encodePacked("FIRST_WIN", winnerAddress, block.timestamp))) {
                // Achievement issued successfully
            } catch {
                // Handle failure silently or emit event
            }
        }

        emit ChallengeResolved(challengeId, winner);
        emit LeveledUp(winnerToken, newLevel);
    }

    // --- Trading/Gifting ---
    function proposeTrade(uint40 fromToken, uint40 toToken) external {
        require(ownerOf(fromToken) == msg.sender, "Not owner");
        tradeProposals[fromToken] = toToken;
        emit TradeProposed(fromToken, toToken);
    }

    function acceptTrade(uint40 fromToken, uint40 toToken) external {
        require(ownerOf(toToken) == msg.sender, "Not owner");
        require(tradeProposals[fromToken] == toToken, "No proposal");
        address ownerFrom = ownerOf(fromToken);
        address ownerTo = ownerOf(toToken);
        _safeTransfer(ownerFrom, ownerTo, fromToken, "");
        _safeTransfer(ownerTo, ownerFrom, toToken, "");
        delete tradeProposals[fromToken];
        emit TradeAccepted(fromToken, toToken);
    }

    // --- Territory Control ---
    function claimTerritory(uint40 territoryId, uint40 tokenId) external {
        require(territoryId < NUM_TERRITORIES, "Invalid territory");
        require(ownerOf(tokenId) == msg.sender, "Not NFT owner");

        // Check if territory is already claimed and apply reputation bonus
        Territory memory existingTerritory = territories[territoryId];
        if (existingTerritory.ownerTokenId != 0) {
            // Territory is claimed, check cooldown and reputation
            require(block.timestamp >= existingTerritory.lastClaimed + 24 hours, "Territory claim cooldown");

            // Higher reputation allows claiming from others
            uint256 claimerRep = identitySBT.weightOf(msg.sender);
            address currentOwner = ownerOf(existingTerritory.ownerTokenId);
            uint256 currentRep = identitySBT.weightOf(currentOwner);

            require(claimerRep > currentRep * 1.1e18, "Insufficient reputation to claim occupied territory");
        }

        territories[territoryId] = Territory({ownerTokenId: tokenId, allianceId: allianceOf[tokenId], lastClaimed: uint40(block.timestamp)});

        // Level up for territory claim (with reputation bonus)
        uint256 repBonus = identitySBT.weightOf(msg.sender) / 1e16; // Small XP bonus based on reputation
        levels[tokenId].xp += 50 + uint32(repBonus);
        uint8 newLevel = OCSHLib.xpToLevel(levels[tokenId].xp);
        levels[tokenId].level = newLevel;

        // Issue achievement for territory master
        address owner = msg.sender;
        uint256 ownedTerritories = _countOwnedTerritories(owner);
        if (ownedTerritories >= 5 && !identitySBT.hasRole(owner, ACHIEVEMENT_TERRITORY_MASTER)) {
            try identitySBT.issue(owner, ACHIEVEMENT_TERRITORY_MASTER, keccak256(abi.encodePacked("TERRITORY_MASTER", owner, block.timestamp))) {
                // Achievement issued
            } catch {
                // Handle failure
            }
        }

        emit TerritoryClaimed(territoryId, tokenId, allianceOf[tokenId]);
        emit LeveledUp(tokenId, newLevel);
    }

    // Helper function to count owned territories
    function _countOwnedTerritories(address owner) internal view returns (uint256) {
        uint256 count = 0;
        for (uint40 i = 0; i < NUM_TERRITORIES; i++) {
            if (territories[i].ownerTokenId != 0 && ownerOf(territories[i].ownerTokenId) == owner) {
                count++;
            }
        }
        return count;
    }

    // --- Chain Traversal ---
    function getChain(uint40 tokenId, uint40 depth) external view returns (ChainLink[] memory) {
        ChainLink[] memory links = new ChainLink[](depth);
        uint40 current = tokenId;
        for (uint40 i = 0; i < depth && current < nextTokenId; i++) {
            links[i] = chain[current];
            if (current == 0) break;
            current = chain[current].prevTokenId;
        }
        return links;
    }

    // --- Onchain Guide: Darknet Continuum ---
    string private constant DARKNET_GUIDE_1 = "Darknet Continuum\nMOVING VALUE WITHOUT THE INTERNET\nOn-Chain Resilience Field Manual\nIn the evolving digital economy, reliance on the traditional internet infrastructure poses risks. In cases of power outages, cable damage, or grid failures, blockchain networks can endure by finding alternative data transmission routes. This guide provides protocols to maintain transaction flow, even when conventional networks fail.\nPRTCL1\n BONE NET (BONET)\nMesh Networking \nCreate a decentralized, peer-to-peer network where devices connect directly to each other. Transactions are passed from device to device like whispers through a crowd. This method is slower but highly effective for moving signed transactions without a central internet connection.\nPRTCL2\n SIGNAL SCRIPT\nSMS Transactions\nUtilize existing cellular towers for basic communication. Transactions can be sent via plain-text SMS, containing a simple command, wallet address, and signature. This method requires no apps or browsers, relying only on a cell signal and a keypad.\nPRTCL3\nPHYSICAL HANDSHAKE (LEDGER)\nOffline Hardware Transfer ";
    string private constant DARKNET_GUIDE_2 = "Employ a physical-delivery method for transactions. One person signs a transaction, and another person physically carries the data to a location with an internet connection to broadcast it. This method turns transaction delivery into a form of spycraft.\nPRTCL4\nDATA RELIC\nUSB Sneakernet\nUse a portable storage device as the data carrier. A signed transaction file is saved to a USB stick, physically moved to a device that has network access, and then broadcast to the blockchain.\nPRTCL5\n STATIC HAUL (LONG & SHORT)\nHam Radio Blockchain \nHarness the power of amateur radio. If ham radio can transmit emails over long distances, it can transmit blockchain data, offering a resilient, cross-border method of communication that is immune to physical infrastructure cuts.\nPRTCL6\nGHOST MODE\nRadio Broadcast\nLeverage radio broadcasts to transmit transactions. A signed, compressed data packet is converted into radio waves and broadcast over the air. Anyone with the right receiver can capture, decode, and\nPRTCL7\nSKYCHAIN RELAY\nSatellite Link ";
    string private constant DARKNET_GUIDE_3 = "Broadcast transactions directly into space using a satellite dish. The satellite then relays the data back down to a receiving station connected to the blockchain network, completely bypassing all terrestrial infrastructure.\nCore Doctrine\nThe blockchain's true home is not the internet; the internet is merely a convenient transport layer. When one pathway fails, a resilient network finds another. As long as you can move data, you can move value.";

    function getDarknetGuide() external pure returns (string memory, string memory, string memory) {
        return (DARKNET_GUIDE_1, DARKNET_GUIDE_2, DARKNET_GUIDE_3);
    }

    // --- SBT Integration Functions ---

    /**
     * @dev Issue SBT role for game achievements
     */
    function issueGameRole(address player, bytes32 role, bytes32 uid) external onlyRole(GAME_ADMIN_ROLE) {
        identitySBT.issue(player, role, uid);
    }

    /**
     * @dev Get enhanced player stats including SBT bonuses
     */
    function getPlayerStats(address player) external view returns (
        uint256 reputation,
        uint256 ownedTerritories,
        bool isVeteran,
        bool isCommander,
        bool isTrader,
        uint256[] memory achievements
    ) {
        reputation = identitySBT.weightOf(player);
        ownedTerritories = _countOwnedTerritories(player);
        isVeteran = identitySBT.hasRole(player, SBT_ROLE_VETERAN);
        isCommander = identitySBT.hasRole(player, SBT_ROLE_COMMANDER);
        isTrader = identitySBT.hasRole(player, SBT_ROLE_TRADER);

        // Count achievements
        uint256 achievementCount = 0;
        bytes32[] memory allRoles = new bytes32[](3);
        allRoles[0] = ACHIEVEMENT_FIRST_WIN;
        allRoles[1] = ACHIEVEMENT_TERRITORY_MASTER;
        allRoles[2] = ACHIEVEMENT_ALLIANCE_BUILDER;

        for (uint256 i = 0; i < allRoles.length; i++) {
            if (identitySBT.hasRole(player, allRoles[i])) {
                achievementCount++;
            }
        }

        achievements = new uint256[](achievementCount);
        uint256 index = 0;
        for (uint256 i = 0; i < allRoles.length; i++) {
            if (identitySBT.hasRole(player, allRoles[i])) {
                achievements[index++] = i;
            }
        }
    }

    /**
     * @dev Calculate battle power with SBT bonuses
     */
    function calculateBattlePower(uint40 tokenId) external view returns (uint256) {
        address owner = ownerOf(tokenId);
        uint256 basePower = levels[tokenId].level * 100;
        uint256 reputation = identitySBT.weightOf(owner);

        // SBT bonuses
        uint256 sbtMultiplier = 1e18; // 1x base

        if (identitySBT.hasRole(owner, SBT_ROLE_VETERAN)) {
            sbtMultiplier += 0.2e18; // +20% for veteran
        }
        if (identitySBT.hasRole(owner, SBT_ROLE_COMMANDER)) {
            sbtMultiplier += 0.3e18; // +30% for commander
        }

        // Reputation bonus (up to +50%)
        uint256 repBonus = reputation > 5e18 ? 0.5e18 : reputation / 10;

        return (basePower * (sbtMultiplier + repBonus)) / 1e18;
    }
}
