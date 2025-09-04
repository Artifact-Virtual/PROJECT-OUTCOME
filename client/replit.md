# OCSH NFT Game - Hybrid Web3 Gaming dApp

## Overview

This is a decentralized gaming platform built around the OCSH (On-Chain Survival Handbook) NFT collection. The application implements a hybrid web3 gaming experience with both on-chain and off-chain components, featuring real-time multiplayer gameplay, territory control, alliance systems, and an innovative Foundry Courier integration for offline transaction handling.

The project consists of two integrated applications: Part 1 (Main Dashboard) for strategic gameplay and Part 2 (Handheld PWA Terminal) for offline blockchain transaction handling. The project follows a full-stack architecture with React/TypeScript frontend, Express.js backend, PostgreSQL database with Drizzle ORM, and WebSocket support for real-time features.

**Latest Major Update (August 2025)**: Revolutionary online-based alliance power system ensuring fair and dynamic battles. Alliance power is calculated ONLY from currently online members, creating strategic gameplay where coordination, timing, and active participation determine victory. No more static power calculations - battles require real-time alliance coordination and strategic timing for success.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for fast development
- **UI Library**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom cyberpunk theme and CSS variables
- **State Management**: TanStack Query for server state, React hooks for local state
- **Routing**: Wouter for lightweight client-side routing
- **Real-time**: WebSocket integration for live game updates

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Real-time**: WebSocket server for multiplayer features
- **Session Management**: PostgreSQL-backed sessions with connect-pg-simple

### Database Design
- **ORM**: Drizzle with PostgreSQL dialect
- **Schema**: Modular schema with separate tables for users, alliances, territories, battles, messages, and courier transactions
- **Relationships**: Well-defined foreign key relationships between entities
- **Migrations**: Drizzle-kit for schema management and migrations

### Game Architecture  
- **Online-Based Power System**: Alliance power calculated ONLY from currently online members for dynamic strategic gameplay
- **Real-Time Battle Coordination**: Victory requires coordinating online members and strategic timing rather than static power
- **Fair Competition**: No alliance can dominate through offline member accumulation - only active participation counts
- **Dynamic Rankings**: Alliance power rankings change in real-time as members come online/offline throughout the day
- **Strategic Timing**: Alliances must coordinate when to attack based on their online member availability
- **Territory Mathematics**: Holdings create exponential power advantages through supply lines and logistics
- **Alliance System**: Multi-role alliance management with ability to join/leave alliances at any time for strategic flexibility
- **Territory Control**: 24-hour territory claiming with strategic positioning
- **Messaging**: On-chain messaging with anti-spam mechanisms and cooldowns
- **Activity Rewards**: Higher online participation percentages provide coordination bonuses and power multipliers

### Strategic Equipment System
- **Combat Enhancement Items**: Tactical processors, war machine cores providing permanent battle power boosts
- **Communication Equipment**: Signal amplifiers, quantum relays reducing message costs and adding encryption
- **Territory Control Gear**: Beacons, fortress protocols enhancing defense and claim speed
- **Resource Generation**: Extractors, nano-fabricators increasing passive resource generation rates
- **Intelligence Tools**: Recon drones, stealth systems extending intel gathering capabilities
- **Alliance Management**: Command hubs providing coordination bonuses and supply line efficiency
- **Base ETH & ARCx Pricing**: Affordable strategic items using Base network tokens instead of expensive mainnet
- **Tier-Based Progression**: Basic to experimental items with level requirements and escalating power

### Offline-First Features
- **Courier Service**: Python-based Foundry Courier integration for offline transaction encoding/decoding
- **Handheld Interface**: Dedicated offline terminal for transaction management
- **Frame Encoding**: Support for encoding blockchain transactions into transmittable frames
- **Broadcast Queue**: Transaction queuing system for when connectivity returns

### Web3 Integration
- **Wallet Connection**: MetaMask and Web3 wallet integration
- **Multi-chain**: Designed for Base Network with Ethereum mainnet expansion
- **Transaction Management**: Comprehensive transaction lifecycle management
- **Smart Contract**: Proxy pattern contracts for upgradeability

### Security Considerations
- **Input Validation**: Zod schemas for all API inputs and database operations
- **Rate Limiting**: Built-in cooldowns for messaging and actions
- **Session Security**: Secure session management with PostgreSQL storage
- **Error Handling**: Comprehensive error boundaries and logging

## External Dependencies

### Database & Infrastructure
- **@neondatabase/serverless**: Neon PostgreSQL serverless database client
- **drizzle-orm**: Type-safe PostgreSQL ORM with schema validation
- **connect-pg-simple**: PostgreSQL session store for Express

### Web3 & Blockchain
- **Foundry Courier**: Python-based CLI tool for offline transaction handling
- **Web3 Providers**: Browser-based wallet integration (MetaMask, etc.)
- **Base Network**: Primary blockchain for deployment

### UI & Frontend
- **@radix-ui/***: Comprehensive set of unstyled, accessible UI primitives
- **@tanstack/react-query**: Powerful data synchronization for server state
- **tailwindcss**: Utility-first CSS framework with custom theme
- **wouter**: Lightweight routing library for React

### Development & Build Tools
- **vite**: Fast build tool with HMR and development server
- **typescript**: Type safety across the entire application
- **esbuild**: Fast bundling for production server builds
- **@replit/vite-plugin-cartographer**: Replit-specific development enhancements

### Real-time & Communication
- **ws**: WebSocket library for real-time multiplayer features
- **date-fns**: Date manipulation and formatting utilities

### Form Handling & Validation
- **react-hook-form**: Performant forms with easy validation
- **@hookform/resolvers**: Zod integration for form validation
- **zod**: Runtime type validation and schema definition