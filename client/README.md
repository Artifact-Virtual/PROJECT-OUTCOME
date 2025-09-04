# BLOKBOY 1000 - Onchain Survival Handbook (OCSH) Gaming Platform

A cutting-edge post-apocalyptic web3 social gaming platform featuring deterministic territorial control, alliance-based warfare, and offline blockchain transaction capabilities. Built with authentic military-industrial aesthetics for strategic multiplayer experiences.

## 🎯 Core Features

### ✅ Web3 Authentication & NFT Gating
- **MetaMask Integration**: Seamless wallet connection with Base Network support
- **NFT Minting System**: 1 NFT per wallet limit with territory selection during mint
- **Automatic Territory Claiming**: Territory ownership assigned upon successful NFT mint
- **Access Control**: Core game requires OCSH NFT ownership for entry

### ✅ Deterministic Battle System
- **Pure Aggregate Calculation**: Higher total power always wins - zero randomness
- **Alliance Supremacy**: Member stats sum directly into battle power with coordination bonuses
- **Territory Mathematics**: Holdings create exponential power advantages through logistics
- **Strategic Positioning**: Border and central territories provide calculated bonuses
- **Predictable Outcomes**: Battle results can be calculated before engagement
- **Power Rankings**: Real-time alliance and player power leaderboards

### ✅ Alliance & Territory Control
- **Multi-role Alliance System**: Leader, member, and invited user management
- **24-hour Territory Claims**: Strategic positioning with adjacent territory bonuses
- **Real-time Territory Updates**: Live map showing ownership and control zones
- **Supply Line Advantages**: Multiple territories create logistical power multipliers

### ✅ Trading & Economy System
- **25+ Trading API Endpoints**: Comprehensive marketplace with order management
- **NFT Trading Interface**: Buy, sell, and transfer OCSH NFTs
- **Real-time Price Feeds**: Live market data with price history charts
- **Portfolio Management**: Complete asset tracking and transaction history

### ✅ Real-time Communication
- **WebSocket Integration**: Live updates for battles, messages, and territory changes
- **Global Messaging System**: Anti-spam mechanisms with cooldowns
- **Alliance Communications**: Private channels for strategic coordination
- **Battle Notifications**: Real-time alerts for alliance conflicts

### ✅ Offline-First Handheld Interface
- **BLOKBOY 1000 Terminal**: Dedicated PWA companion app for offline operations
- **Foundry Courier Integration**: Python-based CLI for offline transaction encoding/decoding
- **Transaction Queuing System**: Batch processing when connectivity returns
- **Frame Encoding Support**: Radio/mesh/SMS transmission capabilities

## 🏗️ Technical Architecture

### Frontend Stack
- **React 18 + TypeScript**: Type-safe component development with Vite
- **Shadcn/UI + Radix**: Accessible, unstyled component primitives
- **Tailwind CSS**: Utility-first styling with custom cyberpunk theme
- **TanStack Query**: Powerful server state management
- **Wouter**: Lightweight client-side routing
- **Framer Motion**: Smooth animations and transitions

### Backend Stack
- **Node.js + Express**: TypeScript server with ES modules
- **PostgreSQL + Drizzle ORM**: Type-safe database operations
- **WebSocket Server**: Real-time multiplayer functionality
- **Session Management**: PostgreSQL-backed secure sessions

### Database Design
- **Modular Schema**: Separate tables for users, alliances, territories, battles, messages
- **Foreign Key Relationships**: Well-defined entity connections
- **Type Safety**: Zod schemas for runtime validation
- **Migration System**: Drizzle-kit for schema management

### Game Logic
- **Mathematical Warfare**: Pure calculations determine all battle outcomes
- **Alliance Aggregate Power**: Direct summation of member stats with coordination bonuses
- **Exponential Territory Scaling**: More holdings = exponentially greater strategic advantage
- **Zero Randomness**: Battles are 100% predictable based on alliance and territory mathematics

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- MetaMask or Web3 wallet

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
```bash
DATABASE_URL=postgresql://user:pass@host:port/db
PGHOST=localhost
PGPORT=5432
PGUSER=username
PGPASSWORD=password
PGDATABASE=database_name
```

## 📡 API Documentation

### Authentication System
```
POST   /api/auth/login           - User login
POST   /api/auth/logout          - User logout  
GET    /api/auth/session         - Get current session
```

### User Management
```
GET    /api/users                - Get all users
POST   /api/users                - Create user
GET    /api/users/:id            - Get user by ID
PATCH  /api/users/:id            - Update user
GET    /api/users/:id/alliance   - Get user's alliance
```

### Alliance System
```
GET    /api/alliances                    - Get all alliances
POST   /api/alliances                    - Create alliance
GET    /api/alliances/:id                - Get alliance details
PATCH  /api/alliances/:id                - Update alliance
POST   /api/alliances/:id/join           - Join alliance
DELETE /api/alliances/:id/leave          - Leave alliance
GET    /api/alliances/power-rankings     - Alliance power leaderboard
GET    /api/alliances/:id/power          - Detailed alliance power breakdown
POST   /api/alliances/battle-prediction  - Predict battle outcome between alliances
```

### Territory Control
```
GET    /api/territories             - Get all territories
POST   /api/territories/claim       - Claim territory
GET    /api/territories/user/:id    - Get user territories
```

### Battle System
```
GET    /api/battles                 - Get user battles
POST   /api/battles                 - Create battle
GET    /api/battles/:id             - Get battle details
POST   /api/battles/:id/resolve     - Resolve battle using aggregate calculations
GET    /api/users/:id/battles       - Get user battle history
```

### Trading Platform
```
GET    /api/nft/marketplace         - Get marketplace listings
POST   /api/nft/list                - List NFT for sale
GET    /api/nft/user/:address       - Get user's NFTs
POST   /api/nft/buy                 - Purchase NFT
POST   /api/nft/transfer            - Transfer NFT
GET    /api/nft/history/:tokenId    - Get NFT transaction history
```

### Communication
```
GET    /api/messages/global         - Get global messages
POST   /api/messages                - Send message
GET    /api/messages/alliance/:id   - Get alliance messages
```

### Leaderboards
```
GET    /api/leaderboard             - Get player rankings
GET    /api/leaderboard/alliances   - Get alliance rankings
```

## 🎮 Game Mechanics

### Battle Resolution
Battles are resolved using pure mathematical calculations:

1. **Individual Power (40%)**:
   - Base Level × 50
   - √(XP) × 2  
   - Reputation × 5
   - Win Ratio × 200

2. **Alliance Power (35%)**:
   - Sum of all member levels × 40
   - √(Total XP) + Total Reputation × 3
   - Member count multiplier (1 + count × 0.1)
   - Coordination bonus from collective wins × 2

3. **Territory Power (15%)**:
   - Personal territories × 40
   - Adjacent allied territories × 25
   - Logistical advantage for 3+ territories × 10
   - Defensive bonus (+80 for defenders)

4. **Strategic Position (10%)**:
   - Border territory bonus (+30)
   - Central territory bonus (+20)

**Winner**: The participant with higher total aggregate power always wins.

### Alliance Advantages
- **Size Scaling**: More members = exponentially more power
- **Quality Matters**: Elite members contribute more than numerous weak ones
- **Territory Synergy**: Alliance territories create supply line bonuses
- **Coordination Effects**: Collective victories multiply alliance strength

### Economic Model
- **1 NFT Per Wallet**: Prevents farming and ensures fair distribution
- **Territory Selection**: Strategic choice during minting affects starting position
- **Market Dynamics**: Player-driven economy with real trading mechanics
- **Scarcity Value**: Limited NFTs create genuine ownership stakes

## 🛠️ Development

### Project Structure
```
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

### Key Components
- **dashboard-realistic.tsx**: Main strategic command interface
- **handheld-realistic.tsx**: Offline-capable PWA terminal
- **nft-gate.tsx**: Access control and wallet connection
- **realistic-wasteland.tsx**: Core UI component library
- **battle-engine.ts**: Deterministic combat calculations
- **alliance-power-calculator.ts**: Alliance strength mathematics

### Database Schema
- **users**: Player accounts with stats and wallet addresses  
- **alliances**: Alliance organizations with leadership hierarchy
- **territories**: Geographic control zones with ownership tracking
- **battles**: Combat records with mathematical power calculations
- **messages**: Communication system with anti-spam controls
- **courier_transactions**: Offline transaction queue management

## 🌐 Deployment

### Replit Deployment
1. Ensure all tests pass and application builds successfully
2. Configure production environment variables
3. Click the "Deploy" button in Replit interface
4. Application will be available at `<project-name>.replit.app`

### Manual Deployment
```bash
# Build for production
npm run build

# Start production server
npm start
```

## 🔧 Configuration

### Database Setup
```bash
# Push schema to database
npm run db:push

# Generate migrations
npm run db:generate

# Apply migrations
npm run db:migrate
```

### Environment Configuration
- **Development**: Uses local PostgreSQL with development settings
- **Production**: Requires production DATABASE_URL and secrets
- **WebSocket**: Automatically configures wss:// for HTTPS, ws:// for HTTP

## 📜 License & Credits

**BLOKBOY 1000** - Built by **ARTIFACT VIRTUAL** (AV)

A next-generation web3 gaming platform combining strategic gameplay with cutting-edge blockchain technology. Experience authentic military-industrial aesthetics in a deterministic combat environment where skill and coordination determine victory.

---

*"In the wasteland, only the strongest alliances survive. Mathematics, not luck, determines who controls the territories."*