# PROJECT: OUTCOME 

> **Onchain Survival Handbook - Social Gaming Platform**  
> *A post-apocalyptic web3 strategy game where alliances, territory, and mathematics rule the wasteland.*

[**→ Read the OCS Field Manual**](README-ONCHAIN.md)
---

![OCSH Banner](https://user-images.githubusercontent.com/placeholder/ocsh-banner.png)

---

## 🧭 Overview

OCSH is a cutting-edge, post-apocalyptic web3 social gaming platform. Experience deterministic territorial control, alliance-based warfare, and offline blockchain transactions—all wrapped in authentic military-industrial aesthetics for deep, strategic multiplayer gameplay.

---

## 🎯 Core Features

<details>
   <summary><strong>Web3 Authentication & NFT Gating</strong></summary>

- 🔑 **MetaMask Integration**: Seamless wallet connection (Base Network support)
- 🪙 **NFT Minting System**: 1 NFT per wallet, territory selection at mint
- 🏴 **Automatic Territory Claiming**: Ownership assigned on mint
- 🚪 **Access Control**: OCSH NFT required for core gameplay
</details>

<details>
   <summary><strong>Deterministic Battle System</strong></summary>

- 🧮 **Pure Aggregate Calculation**: Higher total power always wins—no randomness
- 🤝 **Alliance Supremacy**: Member stats sum directly, with coordination bonuses
- 🗺️ **Territory Mathematics**: Holdings create exponential power advantages
- 🏰 **Strategic Positioning**: Border/central bonuses, predictable outcomes
- 🏆 **Power Rankings**: Real-time leaderboards
</details>

<details>
   <summary><strong>Alliance & Territory Control</strong></summary>

- 👑 **Multi-role Alliance System**: Leader/member/invite management
- ⏳ **24-hour Territory Claims**: Strategic adjacency bonuses
- 🗺️ **Live Map**: Real-time territory updates
- 🚚 **Supply Line Advantages**: Logistical multipliers
</details>

<details>
   <summary><strong>Trading & Economy System</strong></summary>

- 🔄 **25+ Trading API Endpoints**: Full-featured marketplace
- 💸 **NFT Trading Interface**: Buy, sell, transfer OCSH NFTs
- 📈 **Real-time Price Feeds**: Live data & charts
- 📊 **Portfolio Management**: Asset tracking & history
</details>

<details>
   <summary><strong>Real-time Communication</strong></summary>

- 🌐 **WebSocket Integration**: Live updates for battles, messages, territory
- 💬 **Global Messaging**: Anti-spam, cooldowns
- 🕵️ **Alliance Channels**: Private strategy rooms
- ⚔️ **Battle Notifications**: Real-time alerts
</details>

<details>
   <summary><strong>Offline-First Handheld Interface</strong></summary>

- 🕹️ **BLOKBOY 1000 Terminal**: PWA companion app
- 📨 **Foundry Courier**: Python CLI for offline transactions
- 🗃️ **Transaction Queuing**: Batch processing when online
- 📡 **Frame Encoding**: Radio/mesh/SMS support
</details>

---

## 🏗️ Technical Architecture

| Layer      | Tech Stack                                                                 |
|------------|---------------------------------------------------------------------------|
| **Frontend** | React 18, TypeScript, Vite, Shadcn/UI, Radix, Tailwind CSS, TanStack Query, Wouter, Framer Motion |
| **Backend**  | Node.js, Express, TypeScript, PostgreSQL, Drizzle ORM, WebSocket Server, PostgreSQL-backed sessions |
| **Database** | Modular schema (users, alliances, territories, battles, messages), Zod validation, Drizzle-kit migrations |
| **Game Logic** | Pure math-based deterministic outcomes, alliance/territory scaling, zero randomness |

---

## ⚡ Quick Start

### Prerequisites

- [Node.js 18+](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/)
- MetaMask or compatible Web3 wallet

### Installation

```bash
# Clone and install dependencies
npm install

# Set up database
npm run db:push

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
```

---

## 📡 API Documentation

<details>
   <summary><strong>Authentication</strong></summary>

```http
POST   /api/auth/login           # User login
POST   /api/auth/logout          # User logout  
GET    /api/auth/session         # Get current session
```
</details>

<details>
   <summary><strong>User Management</strong></summary>

```http
GET    /api/users                # Get all users
POST   /api/users                # Create user
GET    /api/users/:id            # Get user by ID
PATCH  /api/users/:id            # Update user
GET    /api/users/:id/alliance   # Get user's alliance
```
</details>

<details>
   <summary><strong>Alliance System</strong></summary>

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
</details>

<details>
   <summary><strong>Territory Control</strong></summary>

```http
GET    /api/territories             # Get all territories
POST   /api/territories/claim       # Claim territory
GET    /api/territories/user/:id    # Get user territories
```
</details>

<details>
   <summary><strong>Battle System</strong></summary>

```http
GET    /api/battles                 # Get user battles
POST   /api/battles                 # Create battle
GET    /api/battles/:id             # Get battle details
POST   /api/battles/:id/resolve     # Resolve battle
GET    /api/users/:id/battles       # Get user battle history
```
</details>

<details>
   <summary><strong>Trading Platform</strong></summary>

```http
GET    /api/nft/marketplace         # Get marketplace listings
POST   /api/nft/list                # List NFT for sale
GET    /api/nft/user/:address       # Get user's NFTs
POST   /api/nft/buy                 # Purchase NFT
POST   /api/nft/transfer            # Transfer NFT
GET    /api/nft/history/:tokenId    # NFT transaction history
```
</details>

<details>
   <summary><strong>Communication</strong></summary>

```http
GET    /api/messages/global         # Get global messages
POST   /api/messages                # Send message
GET    /api/messages/alliance/:id   # Get alliance messages
```
</details>

<details>
   <summary><strong>Leaderboards</strong></summary>

```http
GET    /api/leaderboard             # Player rankings
GET    /api/leaderboard/alliances   # Alliance rankings
```
</details>

---

## 🎮 Game Mechanics

### 🛡️ Battle Resolution

Battles are resolved using pure mathematical calculations:

| Component             | Calculation Details                                                                 |
|-----------------------|------------------------------------------------------------------------------------|
| **Individual Power**  | Base Level × 50<br>√(XP) × 2<br>Reputation × 5<br>Win Ratio × 200                 |
| **Alliance Power**    | Sum of all member levels × 40<br>√(Total XP) + Total Reputation × 3<br>Member count multiplier (1 + count × 0.1)<br>Coordination bonus from collective wins × 2 |
| **Territory Power**   | Personal territories × 40<br>Adjacent allied territories × 25<br>Logistical advantage for 3+ territories × 10<br>Defensive bonus (+80 for defenders) |
| **Strategic Position**| Border territory bonus (+30)<br>Central territory bonus (+20)                     |

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

---