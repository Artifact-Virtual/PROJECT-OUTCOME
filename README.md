# PROJECT: OUTCOME

> **Onchain Survival Handbook - Social Gaming Platform**  
> *A post-apocalyptic web3 strategy game where alliances, territory, and mathematics rule the wasteland.*


[**→ Read the OCS Field Manual**](README-ONCHAIN.md)

---

![OCSH Banner](https://user-images.githubusercontent.com/placeholder/ocsh-banner.png)

---

## 🧭 Overview

OCSH is a cutting-edge, post-apocalyptic web3 social gaming platform. Experience deterministic territorial control, alliance-based warfare, and offline blockchain transactions—all wrapped in authentic military-industrial aesthetics for deep, strategic multiplayer gameplay.


## ✨ What's New (September 2025)

- Hand-to-Hand Bribes (on-chain, opt-in): New BribeEscrow contract supports ETH, ERC20, and ERC721 “offers” that recipients can accept or decline. No global in-app notification is sent; offers are visible to the recipient UI only (still transparent on-chain).
- Alliance visuals client-only: Alliance emblem/color/description remain frontend-defined; no on-chain storage to keep gas low and let communities theme freely.
- Docs refresh: Gameplay guide, on-chain manual, and security posture updated for the new mechanics.


### Web3 Authentication & NFT Gating

- 🔑 **MetaMask Integration**: Seamless wallet connection (Base Network support)
- 🪙 **NFT Minting System**: 1 NFT per wallet, territory selection at mint
- 🏴 **Automatic Territory Claiming**: Ownership assigned on mint
- 🚪 **Access Control**: OCSH NFT required for core gameplay

### Soulbound Identity System (SBT)

- 🏷️ **Non-Transferable Identity Tokens**: ERC-5192 compliant SBTs proving roles and achievements
- 🎖️ **Role-Based Access Control**: Veteran, Commander, Trader roles with game mechanics integration
- 📊 **Reputation System**: Decay-weighted reputation scores influencing gameplay
- 🏆 **Achievement System**: Automatic SBT minting for milestones (First Win, Territory Master, Alliance Builder)
- ⚖️ **Governance Eligibility**: Topic-based voting power based on SBT roles and reputation
- 🔐 **EAS Integration**: Ethereum Attestation Service for verifiable credentials

### Deterministic Battle System

- 🧮 **Pure Aggregate Calculation**: Higher total power always wins—no randomness
- 🤝 **Alliance Supremacy**: Member stats sum directly, with coordination bonuses
- 🗺️ **Territory Mathematics**: Holdings create exponential power advantages
- 🏰 **Strategic Positioning**: Border/central bonuses, predictable outcomes
- 🏆 **Power Rankings**: Real-time leaderboards
- ⚔️ **SBT Battle Bonuses**: Role-based power multipliers (Veteran +20%, Commander +30%)

### Alliance & Territory Control

- 👑 **Multi-role Alliance System**: Leader/member/invite management
- ⏳ **24-hour Territory Claims**: Strategic adjacency bonuses
- 🗺️ **Live Map**: Real-time territory updates
- 🚚 **Supply Line Advantages**: Logistical multipliers

### Trading & Economy System

- 🔄 **25+ Trading API Endpoints**: Full-featured marketplace
- 💸 **NFT Trading Interface**: Buy, sell, transfer OCSH NFTs
- 📈 **Real-time Price Feeds**: Live data & charts
- 📊 **Portfolio Management**: Asset tracking & history
- 🤝 **Hand-to-Hand Bribes (New)**: Offer ETH/tokens/NFTs to another player via on-chain escrow; they must accept or can decline/cancel offers

### Bribe System (Detailed)

The BribeEscrow contract enables players to offer discreet incentives to other players without broadcasting to the entire game world. This adds a layer of strategic diplomacy and social engineering to the gameplay.

#### How Bribes Work

- **Offer Creation**: Players can create bribe offers using ETH, ERC20 tokens, or ERC721 NFTs
- **Recipient Control**: The recipient must explicitly accept the bribe for funds/NFTs to transfer
- **Cancellation**: Senders can cancel pending offers before acceptance
- **Decline Option**: Recipients can decline offers, returning assets to the sender
- **On-Chain Transparency**: All transactions are recorded on-chain, but not globally announced in-game
- **No Global Notifications**: Offers are private between sender and recipient

#### Bribe Types

1. **ETH Bribes**: Direct Ether transfers
2. **ERC20 Bribes**: Token-based incentives (e.g., stablecoins, game tokens)
3. **ERC721 Bribes**: NFT offers for character trades or special items

#### Strategic Uses

- **Alliance Recruitment**: Offer tokens to recruit players to your alliance
- **Ceasefire Negotiations**: Pay tribute to avoid conflicts
- **Territory Trades**: Bribe for territory control without public bidding
- **Social Signaling**: Use accept/decline as diplomatic communication

#### Contract Functions

```solidity
// Create an ETH bribe
createEthBribe(address recipient, uint256 amount)

// Create an ERC20 bribe
createErc20Bribe(address recipient, address token, uint256 amount)

// Create an ERC721 bribe
createErc721Bribe(address recipient, address token, uint256 tokenId)

// Accept a bribe
acceptBribe(uint256 bribeId)

// Decline a bribe
declineBribe(uint256 bribeId)

// Cancel a pending bribe
cancelBribe(uint256 bribeId)
```

#### Security Features

- **Reentrancy Protection**: Uses OpenZeppelin's ReentrancyGuard
- **Safe Token Handling**: ERC20 transfers use SafeERC20
- **Event Logging**: All actions emit events for transparency
- **Access Control**: Only sender/recipient can interact with their offers

### Real-time Communication

- 🌐 **WebSocket Integration**: Live updates for battles, messages, territory
- 💬 **Global Messaging**: Anti-spam, cooldowns
- 🕵️ **Alliance Channels**: Private strategy rooms
- ⚔️ **Battle Notifications**: Real-time alerts

### Offline-First Handheld Interface

- 🕹️ **BLOKBOY 1000 Terminal**: PWA companion app
- 📨 **Foundry Courier**: Python CLI for offline transactions
- 🗃️ **Transaction Queuing**: Batch processing when online
- 📡 **Frame Encoding**: Radio/mesh/SMS support

---

## 🏗️ Technical Architecture

| Layer      | Tech Stack                                                                 |
|------------|---------------------------------------------------------------------------|
| **Frontend** | React 18, TypeScript, Vite, Shadcn/UI, Radix, Tailwind CSS, TanStack Query, Wouter, Framer Motion |
| **Backend**  | Node.js, Express, TypeScript, PostgreSQL, Drizzle ORM, WebSocket Server, PostgreSQL-backed sessions |
| **Database** | Modular schema (users, alliances, territories, battles, messages), Zod validation, Drizzle-kit migrations |
| **Game Logic** | Pure math-based deterministic outcomes, alliance/territory scaling, zero randomness |
| **Smart Contracts** | Solidity 0.8.21, OpenZeppelin, Hardhat, Ethers.js v6, ERC-721/ERC-5192 SBTs |
| **Identity System** | Soulbound Tokens (ERC-5192), Ethereum Attestation Service (EAS), decay-weighted reputation |

---

## ⚡ Quick Start

### Prerequisites

- [Node.js 18+](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/)
- [Ganache](https://trufflesuite.com/ganache/) or [Hardhat](https://hardhat.org/) for local blockchain
- MetaMask or compatible Web3 wallet

### Installation

```bash
# Clone and install dependencies
npm install

# Set up database
npm run db:push

# Compile smart contracts
npm run compile

# Start local blockchain (choose one)
npm run node:ganache    # Ganache on port 8545
# OR
npm run node:hardhat    # Hardhat on port 8545

# Deploy contracts to local blockchain
npm run deploy:ganache  # For Ganache
# OR
npm run deploy:testnet  # For Hardhat

# Deploy BribeEscrow (new)
npx hardhat run scripts/deploy-bribe-escrow.ts --network hardhat

# Start development server
npm run dev
```

### Environment Variables

```env
DATABASE_URL=postgresql://user:pass@host:port/db
PGHOST=localhost
PGPORT=5432
PGUSER=username
PGPASSWORD=password
PGDATABASE=database_name

# Blockchain Configuration
GANACHE_RPC_URL=http://127.0.0.1:8545
HARDHAT_RPC_URL=http://127.0.0.1:8545
PRIVATE_KEY=your_private_key_here
```

### Smart Contract Deployment

The deployment scripts will automatically:

1. Deploy EAS mock contract for local testing
2. Deploy IdentitySBT contract with role configurations
3. Deploy Eligibility contract for governance
4. Deploy OCSH main contract with SBT integration
5. Grant necessary permissions between contracts
6. Save deployment addresses to `deployment-ganache.json`
7. Deploy `BribeEscrow` and record its address for the client

### SBT Role Configuration

Default roles are automatically configured:

- **VETERAN**: +20% battle power, 1-year expiry
- **COMMANDER**: +30% battle power, alliance creation, 1-year expiry  
- **TRADER**: Enhanced trading privileges, 1-year expiry

---

## 📡 API Documentation

### Authentication

```http
POST   /api/auth/login           # User login
POST   /api/auth/logout          # User logout  
GET    /api/auth/session         # Get current session
```

### User Management

```http
GET    /api/users                # Get all users
POST   /api/users                # Create user
GET    /api/users/:id            # Get user by ID
PATCH  /api/users/:id            # Update user
GET    /api/users/:id/alliance   # Get user's alliance
```

### Alliance System

```http
GET    /api/alliances                    # Get all alliances
POST   /api/alliances                    # Create alliance
GET    /api/alliances/:id                # Get alliance details
PATCH  /api/alliances/:id                # Update alliance
POST   /api/alliances/:id/join           # Join alliance
DELETE /api/alliances/:id/leave          # Leave alliance
GET    /api/alliances/power-rankings     # Alliance power leaderboard
GET    /api/alliances/:id/power          # Detailed alliance power breakdown
POST   /api/alliances/battle-prediction  # Predict battle outcome
```

### Territory Control

```http
GET    /api/territories             # Get all territories
POST   /api/territories/claim       # Claim territory
GET    /api/territories/user/:id    # Get user territories
```

### Battle System

```http
GET    /api/battles                 # Get user battles
POST   /api/battles                 # Create battle
GET    /api/battles/:id             # Get battle details
POST   /api/battles/:id/resolve     # Resolve battle
GET    /api/users/:id/battles       # Get user battle history
```

### Trading Platform

```http
GET    /api/nft/marketplace         # Get marketplace listings
POST   /api/nft/list                # List NFT for sale
GET    /api/nft/user/:address       # Get user's NFTs
POST   /api/nft/buy                 # Purchase NFT
POST   /api/nft/transfer            # Transfer NFT
GET    /api/nft/history/:tokenId    # NFT transaction history
```

### Communication

```http
GET    /api/messages/global         # Get global messages
POST   /api/messages                # Send message
GET    /api/messages/alliance/:id   # Get alliance messages
```

### Leaderboards

```http
GET    /api/leaderboard             # Player rankings
GET    /api/leaderboard/alliances   # Alliance rankings
```

---

## 🎮 Game Mechanics

### 🛡️ Battle Resolution

Battles are resolved using pure mathematical calculations:

| Component             | Calculation Details                                                                 |
|-----------------------|------------------------------------------------------------------------------------|
| **Individual Power**  | Base Level × 50; √(XP) × 2; Reputation × 5; Win Ratio × 200 |
| **Alliance Power**    | Sum of all member levels × 40; √(Total XP) + Total Reputation × 3; Member count multiplier (1 + count × 0.1); Coordination bonus from collective wins × 2 |
| **Territory Power**   | Personal territories × 40; Adjacent allied territories × 25; Logistical advantage for 3+ territories × 10; Defensive bonus (+80 for defenders) |
| **Strategic Position**| Border territory bonus (+30); Central territory bonus (+20) |

> **Winner:** The participant with higher total aggregate power always wins.

---

### 🤝 Alliance Advantages

- **Size Scaling:** More members = exponentially more power
- **Quality Matters:** Elite members > numerous weak ones
- **Territory Synergy:** Supply line bonuses for alliances
- **Coordination Effects:** Collective victories multiply strength

---

### 💰 Economic Model

- **1 NFT Per Wallet:** Prevents farming, ensures fairness
- **Territory Selection:** Strategic choice at mint
- **Market Dynamics:** Player-driven economy
- **Scarcity Value:** Limited NFTs = genuine ownership

---

### 🫱🏻‍🫲 Hand-to-Hand Bribes (New)

- Contract: `BribeEscrow` (on-chain)
- Asset types: ETH, ERC20, ERC721
- Flow: Sender creates an offer → recipient accepts (funds/NFT transfer) or declines (refund to sender) → sender can cancel if still pending
- Visibility: The app does not broadcast offers in global channels; however, all transactions remain visible on-chain
- Use cases: Side payments for ceasefires, allegiance shifts, recruitment incentives, tribute, reparations

Ethers v6 examples:

```ts
const escrow = new Contract(escrowAddress, abi, signer);
// Offer 0.1 ETH
await (await escrow.createEthBribe(recipient, { value: parseEther("0.1") })).wait();
// Recipient
await (await escrow.acceptBribe(offerId)).wait(); // or declineBribe/cancelBribe
```

Game impact:

- Diplomacy at speed: Players can quickly propose incentives without public fanfare
- Roleplay lever: Accept/decline conveys inclination; leaders can test loyalties
- Still fair: On-chain transparency ensures post-hoc auditability

See also: `client/integration.md` for frontend wiring and UX notes, and `docs/SECURITY.md` for the bribe escrow threat model.

---

## 🛠️ Development

### 📁 Project Structure

```text
├── client/src/
│   ├── components/     # UI components and game interfaces
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utility libraries and API clients
│   ├── pages/          # Main application pages
│   └── App.tsx         # Root application component
├── server/
│   ├── services/       # Business logic and game engines
│   ├── routes.ts       # API endpoint definitions
│   ├── storage.ts      # Database interface layer
│   └── index.ts        # Server entry point
├── shared/
│   └── schema.ts       # Database schema and type definitions
└── README.md
```

### 🧩 Key Components

- **dashboard-realistic.tsx**: Main strategic command interface
- **handheld-realistic.tsx**: Offline-capable PWA terminal
- **nft-gate.tsx**: Access control and wallet connection
- **realistic-wasteland.tsx**: Core UI component library
- **battle-engine.ts**: Deterministic combat calculations
- **alliance-power-calculator.ts**: Alliance strength mathematics
- **BribeEscrow.sol**: On-chain bribe offers (ETH/ERC20/ERC721) with accept/decline/cancel

### 🗄️ Database Schema

- **users**: Player accounts with stats and wallet addresses  
- **alliances**: Alliance organizations with leadership hierarchy
- **territories**: Geographic control zones with ownership tracking
- **battles**: Combat records with mathematical power calculations
- **messages**: Communication system with anti-spam controls
- **courier_transactions**: Offline transaction queue management

---

## 🌐 Deployment

### 🚀 Replit Deployment

1. Ensure all tests pass and application builds successfully
2. Configure production environment variables
3. Click the **Deploy** button in Replit
4. App available at `<project-name>.replit.app`

### 🏭 Manual Deployment

```bash
# Build for production
npm run build

# Start production server
npm start
```


### Client wiring for BribeEscrow

- Store the deployed `BribeEscrow` address in your client env and initialize a contract instance
- Add a simple “Offers” inbox UI that only the recipient sees (no global broadcast)
- Optionally index `BribeCreated` events off-chain to display pending offers without full-chain scans

---

## 🔧 Configuration

### 🗄️ Database Setup

```bash
# Push schema to database
npm run db:push

# Generate migrations
npm run db:generate

# Apply migrations
npm run db:migrate
```

### ⚙️ Environment Configuration

- **Development:** Local PostgreSQL, dev settings
- **Production:** Production DATABASE_URL and secrets
- **WebSocket:** wss:// for HTTPS, ws:// for HTTP

---

## 📜 License & Credits

**BLOKBOY 1000** — Built by **ARTIFACT VIRTUAL (AV)**

*A next-generation web3 gaming platform combining strategic gameplay with blockchain technology. Experience authentic military-industrial aesthetics in a deterministic combat environment where skill and coordination determine victory.*

---

> *"In the wasteland, only the strongest alliances survive. Mathematics, not luck, determines who controls the territories."*
