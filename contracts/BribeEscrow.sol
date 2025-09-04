// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

/**
 * @title BribeEscrow
 * @notice Simple, transparent escrow for "under-the-table" transfers requiring recipient acceptance.
 *         Supports ETH, ERC20, and ERC721. Offers can be accepted (to recipient), declined (refund to sender), or canceled by sender.
 *         Events are emitted but the app can choose not to broadcast them broadly.
 */
contract BribeEscrow is ReentrancyGuard {
    using SafeERC20 for IERC20;

    enum AssetType { ETH, ERC20, ERC721 }

    struct Offer {
        address sender;
        address recipient;
        AssetType assetType;
        address token;     // ERC20/ERC721 address; zero for ETH
        uint256 amount;    // For ETH/ERC20
        uint256 tokenId;   // For ERC721
        bool active;
    }

    uint256 public nextOfferId;
    mapping(uint256 => Offer) public offers;

    event BribeCreated(
        uint256 indexed offerId,
        address indexed sender,
        address indexed recipient,
        AssetType assetType,
        address token,
        uint256 amount,
        uint256 tokenId
    );
    event BribeAccepted(uint256 indexed offerId);
    event BribeDeclined(uint256 indexed offerId);
    event BribeCanceled(uint256 indexed offerId);

    // --- Create Offers ---

    function createEthBribe(address recipient) external payable nonReentrant returns (uint256 offerId) {
        require(recipient != address(0), "invalid recipient");
        require(msg.value > 0, "no ETH sent");
        offerId = nextOfferId++;
        offers[offerId] = Offer({
            sender: msg.sender,
            recipient: recipient,
            assetType: AssetType.ETH,
            token: address(0),
            amount: msg.value,
            tokenId: 0,
            active: true
        });
        emit BribeCreated(offerId, msg.sender, recipient, AssetType.ETH, address(0), msg.value, 0);
    }

    function createErc20Bribe(address recipient, address token, uint256 amount) external nonReentrant returns (uint256 offerId) {
        require(recipient != address(0), "invalid recipient");
        require(token != address(0), "invalid token");
        require(amount > 0, "amount=0");
        // Pull tokens into escrow
        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);
        offerId = nextOfferId++;
        offers[offerId] = Offer({
            sender: msg.sender,
            recipient: recipient,
            assetType: AssetType.ERC20,
            token: token,
            amount: amount,
            tokenId: 0,
            active: true
        });
        emit BribeCreated(offerId, msg.sender, recipient, AssetType.ERC20, token, amount, 0);
    }

    function createErc721Bribe(address recipient, address token, uint256 tokenId) external nonReentrant returns (uint256 offerId) {
        require(recipient != address(0), "invalid recipient");
        require(token != address(0), "invalid token");
        // Pull NFT into escrow (requires approval)
        IERC721(token).transferFrom(msg.sender, address(this), tokenId);
        offerId = nextOfferId++;
        offers[offerId] = Offer({
            sender: msg.sender,
            recipient: recipient,
            assetType: AssetType.ERC721,
            token: token,
            amount: 0,
            tokenId: tokenId,
            active: true
        });
        emit BribeCreated(offerId, msg.sender, recipient, AssetType.ERC721, token, 0, tokenId);
    }

    // --- Resolve Offers ---

    function acceptBribe(uint256 offerId) external nonReentrant {
        Offer storage o = offers[offerId];
        require(o.active, "inactive");
        require(msg.sender == o.recipient, "not recipient");
        o.active = false; // effects first

        if (o.assetType == AssetType.ETH) {
            (bool ok, ) = o.recipient.call{value: o.amount}("");
            require(ok, "ETH transfer failed");
        } else if (o.assetType == AssetType.ERC20) {
            IERC20(o.token).safeTransfer(o.recipient, o.amount);
        } else if (o.assetType == AssetType.ERC721) {
            IERC721(o.token).safeTransferFrom(address(this), o.recipient, o.tokenId);
        }
        emit BribeAccepted(offerId);
    }

    function declineBribe(uint256 offerId) external nonReentrant {
        Offer storage o = offers[offerId];
        require(o.active, "inactive");
        require(msg.sender == o.recipient, "not recipient");
        o.active = false; // effects first
        _refund(o);
        emit BribeDeclined(offerId);
    }

    function cancelBribe(uint256 offerId) external nonReentrant {
        Offer storage o = offers[offerId];
        require(o.active, "inactive");
        require(msg.sender == o.sender, "not sender");
        o.active = false; // effects first
        _refund(o);
        emit BribeCanceled(offerId);
    }

    function _refund(Offer storage o) internal {
        if (o.assetType == AssetType.ETH) {
            (bool ok, ) = o.sender.call{value: o.amount}("");
            require(ok, "ETH refund failed");
        } else if (o.assetType == AssetType.ERC20) {
            IERC20(o.token).safeTransfer(o.sender, o.amount);
        } else if (o.assetType == AssetType.ERC721) {
            IERC721(o.token).safeTransferFrom(address(this), o.sender, o.tokenId);
        }
    }
}
