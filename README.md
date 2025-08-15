# OCSH NFT Game - Comprehensive Web3 Trading Platform

## Overview

The OCSH (On-Chain Survival Handbook) NFT Game is a cutting-edge post-apocalyptic web3 social gaming platform that revolutionizes digital interaction through advanced technological integration and immersive user experiences. This document details the complete trading system implementation.

## 🎮 Game Features

### Core Gameplay
- **Strategic Territory Control**: Risk-inspired gameplay with alliance systems
- **Real-time Combat**: Turn-based battles with XP rewards and reputation tracking  
- **Alliance Management**: Multi-role alliance system (leader, member, invited)
- **On-chain Messaging**: Decentralized communication with anti-spam mechanisms
- **Territory Claiming**: 24-hour territory control with strategic positioning

### Trading System
- **NFT Marketplace**: Complete marketplace with fixed-price and auction listings
- **Direct Trading**: Peer-to-peer trade offers with multi-item exchanges
- **Escrow Contracts**: Smart contract-based secure trading
- **Trading Posts**: Territory-based trading hubs with specializations
- **Web3 Integration**: Full blockchain integration with MetaMask support

## 🏗️ Technical Architecture

### Frontend Stack
- **React 18** with TypeScript and Vite for fast development
- **Shadcn/ui** components built on Radix UI primitives
- **Tailwind CSS** with custom cyberpunk theme and CSS variables
- **TanStack Query** for server state management
- **Wouter** for lightweight client-side routing
- **WebSocket** integration for real-time game updates

### Backend Stack
- **Node.js** with Express.js framework
- **TypeScript** with ES modules
- **PostgreSQL** with Drizzle ORM for type-safe database operations
- **WebSocket Server** for multiplayer features
- **Session Management** with PostgreSQL-backed sessions

### Database Schema
- **Users**: Player profiles with XP, wins, and reputation
- **Alliances**: Multi-role alliance management system
- **Territories**: Strategic map locations with ownership tracking
- **Battles**: Combat system with XP rewards
- **Messages**: On-chain messaging with cooldowns
- **Items**: NFT items with attributes and ownership
- **Marketplace Listings**: Fixed-price and auction listings
- **Trade Offers**: Direct peer-to-peer trading
- **Escrow Contracts**: Secure smart contract trading
- **Trading Posts**: Territory-based trading hubs
- **Courier Transactions**: Offline blockchain transaction handling

### Web3 Integration
- **Base Network** primary deployment with Ethereum expansion
- **MetaMask** wallet integration
- **Smart Contracts**: Marketplace, NFT, and Escrow contracts
- **Transaction Management**: Comprehensive lifecycle handling
- **Offline Capabilities**: Foundry Courier integration

## 🔗 API Endpoints

### User Management
```
GET    /api/users/:address          - Get user by wallet address
POST   /api/users                   - Create new user
GET    /api/users/:id/alliance      - Get user's alliance
```

### Alliance System
```
POST   /api/alliances               - Create alliance
POST   /api/alliances/:id/join      - Join alliance
```

### Territory Control
```
GET    /api/territories             - List territories
POST   /api/territories             - Claim territory
GET    /api/territories/:x/:y       - Get specific territory
```

### Combat System
```
POST   /api/battles                 - Create battle
GET    /api/battles/:id             - Get battle details
POST   /api/battles/:id/complete    - Complete battle
```

### Messaging
```
POST   /api/messages                - Send message
GET    /api/messages/:channel       - Get messages
```

### NFT Minting System
```
GET    /api/nft/eligibility/:walletAddress  - Check wallet eligibility
GET    /api/nft/available-territories       - Get available territories
POST   /api/nft/mint                        - Create NFT mint record
POST   /api/nft/confirm                     - Confirm blockchain mint
GET    /api/nft/mint/:tokenId               - Get mint status
GET    /api/nft/user/:walletAddress         - Get user NFT status
```

### Trading System
```
# Items
GET    /api/items                   - Get user items
POST   /api/items                   - Create item
GET    /api/items/:id               - Get item details
PATCH  /api/items/:id               - Update item

# Marketplace
GET    /api/marketplace             - Browse listings
POST   /api/marketplace             - Create listing
GET    /api/marketplace/:id         - Get listing details
PATCH  /api/marketplace/:id         - Update listing
POST   /api/marketplace/:id/buy     - Purchase item

# Trade Offers
GET    /api/trades                  - Get trade offers
POST   /api/trades                  - Create trade offer
GET    /api/trades/:id              - Get offer details
PATCH  /api/trades/:id              - Update offer
POST   /api/trades/:id/respond      - Accept/decline offer

# Escrow Contracts
GET    /api/escrow                  - Get escrow contracts
POST   /api/escrow                  - Create escrow
GET    /api/escrow/:id              - Get contract details
PATCH  /api/escrow/:id              - Update contract
POST   /api/escrow/:id/complete     - Complete escrow
POST   /api/escrow/:id/dispute      - Dispute escrow

# Trading Posts
GET    /api/trading-posts           - List trading posts
POST   /api/trading-posts           - Create trading post
GET    /api/trading-posts/:id       - Get post details
PATCH  /api/trading-posts/:id       - Update post
```

### Courier System (Offline Blockchain)
```
POST   /api/courier/encode          - Encode transaction for offline transmission
POST   /api/courier/decode          - Decode received frames
POST   /api/courier/broadcast       - Broadcast transaction to network
GET    /api/courier/transactions/:userId - Get user transactions
```

## 🎨 UI Components

### Realistic Wasteland Theme
- **RealisticText**: Military-inspired typography variants
- **RealisticButton**: Post-apocalyptic button styles
- **RealisticWastelandCard**: Industrial card components
- **Consistent Theming**: Dark mode with amber/green accents

### Trading Interface
- **5-Tab System**: Marketplace, Inventory, Trades, Posts, Escrow
- **Advanced Filtering**: Category, sorting, search functionality
- **Real-time Updates**: WebSocket integration for live data
- **Responsive Design**: Mobile-first approach

## 🔐 Security Features

### Smart Contract Security
- **Escrow Protection**: Automated smart contract protection
- **Dispute Resolution**: Community arbitrator system
- **Item Verification**: Authenticity checks
- **Emergency Controls**: Cancellation with full refunds

### Application Security
- **Input Validation**: Zod schemas for all API inputs
- **Rate Limiting**: Built-in cooldowns and anti-spam
- **Session Management**: Secure PostgreSQL sessions
- **Error Handling**: Comprehensive error boundaries

## 🚀 Deployment

### Environment Setup
```bash
# Install dependencies
npm install

# Database setup
npm run db:push

# Start development server
npm run dev
```

### Environment Variables
```env
DATABASE_URL=postgresql://...
PGHOST=localhost
PGPORT=5432
PGUSER=postgres
PGPASSWORD=password
PGDATABASE=ocsh_game

# Web3 Contract Addresses (Base Network)
VITE_MARKETPLACE_CONTRACT_ADDRESS=0x...
VITE_NFT_CONTRACT_ADDRESS=0x...
VITE_ESCROW_CONTRACT_ADDRESS=0x...
```

### Production Deployment
- **Replit Deployments**: Automatic build and hosting
- **TLS/Health Checks**: Built-in monitoring
- **Custom Domains**: .replit.app or custom domain support

## 🎯 Key Features Implemented

### ✅ NFT Minting System
- **1 NFT per wallet limit**: Enforced at both database and smart contract level
- **Territory selection during mint**: Choose starting territory with strategic value
- **Automatic territory claiming**: Selected territory is claimed for 24 hours upon mint
- **Web3 integration**: Full blockchain transaction support with MetaMask
- **Eligibility checking**: Pre-mint validation ensures wallet compliance
- **NFT Gate**: Dashboard access requires OCSH NFT ownership

### ✅ Complete Trading System
- Full-stack marketplace with web3 integration
- Direct peer-to-peer trading with escrow protection
- Territory-based trading posts with specializations
- Comprehensive API with transaction lifecycle management

### ✅ Web3 Wallet Integration
- MetaMask connection and network switching
- Smart contract interaction hooks (Marketplace, NFT, Escrow)
- Transaction encoding/decoding for offline transmission
- Base Network deployment ready
- NFT minting with territory metadata

### ✅ Real-time Multiplayer
- WebSocket server for live updates
- Real-time messaging and battle notifications
- Live marketplace and trading updates

### ✅ Offline-First Architecture
- Foundry Courier integration for offline transactions
- Transaction queuing system
- Frame encoding for radio/mesh/SMS transmission

### ✅ Advanced UI/UX
- Military-industrial aesthetic with consistent theming
- Responsive design with mobile support
- Loading states and error handling
- Comprehensive testing hooks (data-testid attributes)

## 🔮 Future Enhancements

### Planned Features
- **Advanced Auctions**: Dutch auctions and reserve pricing
- **Cross-chain Trading**: Multi-blockchain support
- **NFT Fractionalization**: Shared ownership mechanisms
- **Advanced Analytics**: Trading volume and price tracking
- **Mobile PWA**: Dedicated handheld companion app

### Technical Improvements
- **Performance Optimization**: Caching and pagination
- **Advanced Search**: Elasticsearch integration
- **Real-time Notifications**: Push notification system
- **Analytics Dashboard**: Trading metrics and insights

## 📱 Mobile Companion (Part 2)

The project includes plans for a handheld PWA terminal for offline blockchain transaction handling:

- **Offline Transaction Encoding**: Convert blockchain transactions to transmittable frames
- **Radio/Mesh Network Support**: Transmission via alternative networks
- **SMS Integration**: Transaction broadcasting via cellular networks
- **Foundry Courier Backend**: Python-based CLI tool integration

## 🤝 Contributing

This is a comprehensive web3 gaming platform designed for post-apocalyptic survival gameplay with authentic military-industrial aesthetics. The trading system provides a complete solution for NFT marketplace functionality with secure escrow and peer-to-peer trading capabilities.

## 📄 License

This project is part of the OCSH NFT Game ecosystem developed by Artifact Virtual (AV).