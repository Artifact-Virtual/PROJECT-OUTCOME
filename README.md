# OCSH NFT Game - Hybrid Web3 Gaming dApp

## Project Overview

OCSH (On-Chain Survival Handbook) is a decentralized gaming platform featuring a post-apocalyptic web3 social gaming experience with territorial control mechanics. The platform consists of two integrated applications: a main dashboard for strategic gameplay and a companion PWA for offline blockchain transaction handling.

### Key Features
- **Territorial Control**: Risk-inspired gameplay with 24-hour territory claiming mechanics
- **Alliance System**: Multi-role alliance management with leader/member hierarchies
- **Battle System**: Turn-based combat with XP rewards and reputation tracking
- **On-Chain Messaging**: Blockchain-based communication with anti-spam mechanisms
- **Offline Transaction Handling**: Foundry Courier integration for radio/mesh/SMS networks
- **Real-time Updates**: WebSocket integration for multiplayer features
- **Progressive Web App**: Dedicated handheld terminal for offline blockchain operations

## Technical Architecture

### Technology Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Node.js + Express.js + TypeScript
- **Database**: PostgreSQL + Drizzle ORM
- **UI Framework**: Tailwind CSS + Shadcn/ui + Radix UI
- **Real-time**: WebSocket (ws library)
- **Web3**: Browser wallet integration (MetaMask)
- **Blockchain**: Base Network (primary), Ethereum (expansion)
- **Offline Handling**: Foundry Courier (Python-based CLI)

### Project Structure
```
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility libraries
│   │   └── pages/          # Application pages/routes
├── server/                 # Express.js backend
│   ├── services/           # Business logic services
│   ├── index.ts           # Main server entry point
│   ├── routes.ts          # API route definitions
│   ├── storage.ts         # Database storage interface
│   └── db.ts              # Database connection setup
├── shared/                 # Shared types and schemas
│   └── schema.ts          # Drizzle database schema
└── attached_assets/        # Static assets and documentation
```

---

## Part 1: Main Dashboard Application

### Overview
The main dashboard serves as the primary interface for strategic gameplay, featuring a cyberpunk-themed UI with holographic elements and professional military aesthetics.

### Core Features

#### 1. Territory Control System
- **Grid-based Map**: Interactive territory grid with visual ownership indicators
- **24-Hour Claims**: Territories can be claimed for 24-hour periods
- **Strategic Positioning**: Adjacent territory bonuses and defensive advantages
- **Visual Indicators**: Color-coded ownership and status displays

#### 2. Alliance Management
- **Role-based Access**: Leaders, members, and invited user roles
- **Alliance Creation**: Form strategic partnerships with other players
- **Member Management**: Invite, promote, and manage alliance members
- **Coordination Tools**: Internal messaging and strategy planning

#### 3. Battle System
- **Turn-based Combat**: Strategic battle mechanics with skill-based outcomes
- **XP Rewards**: Experience points for victories and participation
- **Reputation Tracking**: Player ranking system based on performance
- **Battle History**: Complete record of past engagements

#### 4. On-Chain Messaging
- **Blockchain Messages**: Immutable communication system
- **Anti-spam Protection**: Cooldown mechanisms and rate limiting
- **Message Threading**: Organized conversation flows
- **Public/Private Options**: Different message visibility levels

### Technical Implementation

#### Database Schema (PostgreSQL + Drizzle)
```typescript
// Users table
users: {
  id: serial primary key
  username: varchar(50) unique not null
  walletAddress: varchar(42)
  xp: integer default 0
  reputation: integer default 0
  createdAt: timestamp default now()
}

// Alliances table
alliances: {
  id: serial primary key
  name: varchar(100) not null
  description: text
  leaderId: integer references users(id)
  createdAt: timestamp default now()
}

// Alliance Members table
allianceMembers: {
  id: serial primary key
  allianceId: integer references alliances(id)
  userId: integer references users(id)
  role: enum('leader', 'member', 'invited')
  joinedAt: timestamp default now()
}

// Territories table
territories: {
  id: serial primary key
  x: integer not null
  y: integer not null
  ownerId: integer references users(id)
  claimedAt: timestamp
  expiresAt: timestamp
}

// Battles table
battles: {
  id: serial primary key
  attackerId: integer references users(id)
  defenderId: integer references users(id)
  territoryId: integer references territories(id)
  winner: integer references users(id)
  xpReward: integer
  createdAt: timestamp default now()
}

// Messages table
messages: {
  id: serial primary key
  senderId: integer references users(id)
  recipientId: integer references users(id)
  content: text not null
  isPublic: boolean default false
  transactionHash: varchar(66)
  createdAt: timestamp default now()
}
```

#### Component Architecture
- **Dashboard Layout**: Main game interface with navigation
- **Territory Map**: Interactive grid-based territory visualization
- **Alliance Panel**: Alliance management and member tools
- **Battle Interface**: Combat mechanics and battle history
- **Message Center**: On-chain messaging and communication
- **Player Stats**: XP, reputation, and achievement tracking

#### State Management
- **TanStack Query**: Server state synchronization and caching
- **React Hooks**: Local component state management
- **WebSocket Integration**: Real-time game updates and notifications

---

## Part 2: Handheld PWA Terminal

### Overview
The handheld PWA (Progressive Web App) serves as a companion terminal for offline blockchain transaction handling, designed with authentic military-grade aesthetics and hardware-level interaction capabilities.

### Core Features

#### 1. Terminal Interface
- **Boot Sequence**: Realistic system initialization with technical diagnostics
- **Command Line**: Unix-style terminal with custom command set
- **System Monitoring**: Real-time hardware metrics and status displays
- **Responsive Design**: Optimized for mobile and tablet devices

#### 2. Transaction Encoder/Decoder
- **Frame Encoding**: Convert blockchain transactions to transmittable data frames
- **QR Code Generation**: Visual encoding for offline transmission
- **Radio/Mesh Support**: Integration with alternative communication networks
- **Batch Processing**: Handle multiple transactions efficiently

#### 3. Device Sensor Integration
- **Hardware Access**: Battery, GPS, accelerometer, gyroscope sensors
- **Environmental Data**: Temperature, humidity, and ambient light monitoring
- **Network Status**: Connection quality and availability tracking
- **Permission Management**: Secure access control for device features

#### 4. Offline Capabilities
- **Service Worker**: Background processing and caching
- **Local Storage**: Persistent data storage without network
- **Queue Management**: Transaction queuing for network restoration
- **Sync Protocols**: Automatic synchronization when online

### Technical Implementation

#### PWA Configuration
```json
{
  "name": "BLOKBOY 1000",
  "short_name": "BLOKBOY",
  "description": "Handheld Transaction Terminal",
  "start_url": "/handheld",
  "display": "standalone",
  "theme_color": "#0891b2",
  "background_color": "#000000",
  "orientation": "portrait"
}
```

#### Device Sensor Hook (useDeviceSensors)
```typescript
interface DeviceInfo {
  battery: { level: number; charging: boolean }
  location: { latitude: number; longitude: number; accuracy: number }
  motion: { acceleration: DeviceMotionEvent['acceleration'] }
  orientation: { alpha: number; beta: number; gamma: number }
  network: { effectiveType: string; downlink: number }
  permissions: Record<string, PermissionState>
}

interface SystemMetrics {
  temperature: number
  humidity: number
  pressure: number
  lightLevel: number
  cpuUsage: number
  memoryUsage: number
  storageUsage: number
}
```

#### Weather Integration Hook (useWeather)
```typescript
interface WeatherData {
  temperature: number
  humidity: number
  pressure: number
  windSpeed: number
  windDirection: number
  visibility: number
  uvIndex: number
  conditions: string
  location: string
  timestamp: number
}
```

#### Foundry Courier Integration
- **Python CLI Tool**: External service for transaction processing
- **Frame Protocol**: Custom encoding/decoding format
- **Network Abstraction**: Support for multiple transmission methods
- **Error Handling**: Robust retry and recovery mechanisms

### UI/UX Design

#### Visual Theme
- **Cyberpunk Aesthetic**: Neon colors with dark backgrounds
- **Military Typography**: Monospace fonts with technical styling
- **Holographic Effects**: CSS animations and glow effects
- **Grid Patterns**: Technical blueprint-style layouts

#### Component Library
- **RealisticWastelandCard**: Post-apocalyptic themed containers
- **RealisticText**: Typography with multiple variants
- **RealisticButton**: Military-style interactive elements
- **HolographicProtocol**: Animated protocol diagrams
- **ScreenGlow**: Immersive visual effects

#### Professional AV Logo
- **Military-Grade Design**: 64x40 SVG with stencil styling
- **Technical Documentation**: Grid patterns, circuit traces, corner brackets
- **Manufacturing Specs**: MIL-STD-810 reference and AUTONOMOUS VENTURES branding
- **Holographic Effects**: Advanced glow filters and status indicators
- **Consistent Placement**: Appears across all PWA tabs

---

## Web3 Integration

### Blockchain Architecture
- **Smart Contracts**: Proxy pattern for upgradeability
- **Multi-chain Support**: Base Network primary, Ethereum expansion
- **Wallet Integration**: MetaMask and browser wallet compatibility
- **Transaction Management**: Comprehensive lifecycle handling

### On-Chain Data
- **Territory Ownership**: Immutable territorial claims
- **Alliance Records**: Decentralized alliance management
- **Battle Results**: Transparent combat outcomes
- **Message Storage**: Censorship-resistant communication

### Offline Transaction Handling
- **Foundry Courier**: Python-based transaction encoding/decoding
- **Frame Transmission**: Radio, mesh, and SMS network support
- **Queue Management**: Local storage for pending transactions
- **Synchronization**: Automatic broadcast when connectivity returns

---

## Security & Performance

### Security Measures
- **Input Validation**: Zod schemas for all data inputs
- **Rate Limiting**: Built-in cooldowns and spam protection
- **Session Management**: PostgreSQL-backed secure sessions
- **Error Boundaries**: Comprehensive error handling and logging

### Performance Optimizations
- **Code Splitting**: Lazy loading of route components
- **Image Optimization**: SVG-based icons and graphics
- **Caching Strategy**: TanStack Query for server state
- **Bundle Optimization**: Vite build optimizations

### Offline-First Architecture
- **Service Workers**: Background sync and caching
- **Local Database**: IndexedDB for offline data storage
- **Progressive Enhancement**: Graceful degradation without network
- **Conflict Resolution**: Merge strategies for concurrent updates

---

## Development Workflow

### Build System
```bash
# Development server
npm run dev              # Starts both frontend and backend

# Database operations
npm run db:push          # Push schema changes to database
npm run db:studio        # Open Drizzle Studio for database management

# Production build
npm run build            # Build optimized production bundle
npm run start            # Start production server
```

### Environment Configuration
```env
# Database
DATABASE_URL=postgresql://[credentials]
PGHOST=localhost
PGPORT=5432
PGUSER=postgres
PGPASSWORD=[password]
PGDATABASE=ocsh_game

# Application
NODE_ENV=development
PORT=5000
SESSION_SECRET=[random_secret]

# Web3 (Optional)
WEB3_PROVIDER_URL=[blockchain_rpc]
CONTRACT_ADDRESS=[deployed_contract]
```

### Code Quality
- **TypeScript**: Full type safety across the stack
- **ESLint**: Code quality and consistency
- **Prettier**: Automated code formatting
- **Drizzle Kit**: Type-safe database operations

---

## API Endpoint Mapping Chart

### Core Game API Endpoints

#### User Management
```
POST   /api/auth/register          # Create new user account
POST   /api/auth/login             # User authentication
POST   /api/auth/logout            # End user session
GET    /api/users/profile          # Get current user profile
PUT    /api/users/profile          # Update user profile
GET    /api/users/:id              # Get user by ID
GET    /api/users/leaderboard      # Get user rankings
```

#### Territory System
```
GET    /api/territories            # Get all territories and ownership
GET    /api/territories/:id        # Get specific territory details
POST   /api/territories/:id/claim  # Claim territory ownership
DELETE /api/territories/:id/claim  # Abandon territory claim
GET    /api/territories/user/:id   # Get territories owned by user
POST   /api/territories/validate   # Validate territory claim
```

#### Alliance Management
```
GET    /api/alliances              # Get all alliances
POST   /api/alliances              # Create new alliance
GET    /api/alliances/:id          # Get alliance details
PUT    /api/alliances/:id          # Update alliance information
DELETE /api/alliances/:id          # Disband alliance
POST   /api/alliances/:id/invite   # Invite user to alliance
POST   /api/alliances/:id/join     # Accept alliance invitation
POST   /api/alliances/:id/leave    # Leave alliance
PUT    /api/alliances/:id/role     # Change member role
GET    /api/alliances/:id/members  # Get alliance members
```

#### Battle System
```
GET    /api/battles                # Get battle history
POST   /api/battles                # Initiate new battle
GET    /api/battles/:id            # Get battle details
POST   /api/battles/:id/action     # Submit battle action
GET    /api/battles/user/:id       # Get user's battle history
POST   /api/battles/resolve        # Resolve battle outcome
```

#### Messaging System
```
GET    /api/messages               # Get user messages
POST   /api/messages               # Send new message
GET    /api/messages/:id           # Get specific message
DELETE /api/messages/:id           # Delete message
GET    /api/messages/public        # Get public messages
POST   /api/messages/broadcast     # Send broadcast message
```

### PWA Terminal API Endpoints

#### Device Integration
```
GET    /api/device/sensors         # Get current sensor readings
POST   /api/device/permissions     # Request device permissions
GET    /api/device/status          # Get device status summary
POST   /api/device/calibrate       # Calibrate sensors
```

#### Transaction Processing
```
POST   /api/transactions/encode    # Encode transaction to frame
POST   /api/transactions/decode    # Decode frame to transaction
GET    /api/transactions/queue     # Get pending transactions
POST   /api/transactions/queue     # Add transaction to queue
DELETE /api/transactions/queue/:id # Remove from queue
POST   /api/transactions/broadcast # Broadcast queued transactions
```

#### Weather & Environment
```
GET    /api/weather/current        # Get current weather data
GET    /api/weather/forecast       # Get weather forecast
POST   /api/weather/update         # Update weather data
GET    /api/environment/sensors    # Get environmental readings
```

#### System Management
```
GET    /api/system/status          # Get system health status
GET    /api/system/metrics         # Get performance metrics
POST   /api/system/restart         # Restart system services
GET    /api/system/logs            # Get system logs
```

### WebSocket Events

#### Real-time Game Updates
```
territory_claimed         # Territory ownership change
battle_started           # New battle initiated
battle_resolved          # Battle outcome determined
alliance_invite          # Alliance invitation received
alliance_joined          # New alliance member
message_received         # New message received
player_online           # Player status change
system_announcement     # System-wide notifications
```

#### Device Sensor Streams
```
sensor_data             # Real-time sensor readings
battery_status          # Battery level changes
location_update         # GPS position changes
network_status          # Connection quality changes
environment_data        # Environmental sensor updates
```

### Integration Points for Final Assembly

#### 1. Authentication Bridge
- **Shared Session**: Single sign-on between dashboard and PWA
- **Wallet Integration**: MetaMask connection across both applications
- **Permission Sync**: Device permissions shared between interfaces

#### 2. Data Synchronization
- **Real-time Updates**: WebSocket events for both applications
- **Offline Queue**: Transaction queue management across platforms
- **State Consistency**: Shared game state between dashboard and terminal

#### 3. Transaction Flow
- **Dashboard Actions**: Initiate transactions from main interface
- **PWA Processing**: Handle encoding/decoding in terminal
- **Blockchain Submission**: Automated submission when online
- **Status Updates**: Real-time feedback across both interfaces

#### 4. Cross-Platform Features
- **Message Relay**: Send messages from either interface
- **Battle Notifications**: Real-time alerts in both applications
- **Territory Updates**: Live map updates across platforms
- **Alliance Coordination**: Synchronized alliance management

---

## Future Enhancements

### Planned Features
- **Smart Contract Deployment**: Full on-chain implementation
- **NFT Integration**: Territory and asset tokenization
- **Advanced AI**: Strategic battle assistance
- **Social Features**: Enhanced community tools
- **Mobile Native**: React Native mobile applications
- **Hardware Integration**: Physical device connectivity

### Scalability Considerations
- **Microservices**: Service-oriented architecture
- **CDN Integration**: Global content delivery
- **Database Sharding**: Horizontal scaling strategies
- **Load Balancing**: Multi-instance deployment
- **Caching Layers**: Redis integration for performance

---

## Deployment & Operations

### Production Deployment
- **Replit Deployments**: Automated build and hosting
- **Environment Variables**: Secure configuration management
- **Database Migrations**: Drizzle-based schema updates
- **Monitoring**: Application performance tracking
- **Error Reporting**: Comprehensive logging and alerting

### Maintenance Procedures
- **Database Backups**: Regular automated snapshots
- **Security Updates**: Dependency and framework updates
- **Performance Monitoring**: Real-time metrics and alerting
- **User Support**: Issue tracking and resolution workflows

This comprehensive documentation provides the technical foundation for the complete OCSH NFT Gaming dApp, covering both the strategic dashboard and handheld PWA terminal with clear integration pathways for final assembly.