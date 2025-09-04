
# OCSH Project Overview

OCSH (Onchain Survival Handbook) is a post-apocalyptic, web3 social gaming platform featuring deterministic territorial control, alliance-based warfare, and offline blockchain transaction capabilities. The project combines a modern React frontend, robust smart contract infrastructure, and a real-time backend for a seamless, strategic multiplayer experience.

**CURRENT STATUS: PRODUCTION READY** 🚀
- ✅ **100% Test Pass Rate** (60/60 tests passing)
- ✅ **Upgradeable Proxy System** fully implemented
- ✅ **Complete Documentation** and deployment guides
- ✅ **Production Deployment Scripts** ready
- ✅ **Frontend/Backend Integration** complete

---

## Architecture Overview

- **Monorepo Structure:**
    - `client/` — React 18 + TypeScript frontend (Vite, Tailwind, shadcn/ui, PWA, real-time features)
    - `contracts/` — Solidity smart contracts (Hardhat, OpenZeppelin, tests, deployment scripts)
    - `server/` — Node.js + Express backend (TypeScript, WebSocket, Drizzle ORM, PostgreSQL)
    - `shared/` — Shared game logic, schema, and types
    - `test/` — Contract and integration tests
    - `docs/` — Documentation, security, and technical guides
- **Documentation:**
    - `README.md`, `RELEASE-NOTES.md`, `SECURITY.md`, deployment checklists
    - Architecture diagrams, technical breakdowns, and deployment guides

---


## Directory Structure

```
client/         # React 18 + TypeScript frontend (PWA, Vite, Tailwind, shadcn/ui)
contracts/      # Solidity smart contracts, deployment scripts, artifacts
server/         # Node.js + Express backend, WebSocket, Drizzle ORM
shared/         # Shared game logic, schema, and types
test/           # Contract and integration tests
docs/           # Documentation, security, and technical guides
```

---


## Backend / Server (`server/`)

- **Tech Stack:** Node.js, Express, TypeScript, Drizzle ORM, PostgreSQL, WebSocket
- **API Endpoints:**
    - Game actions, NFT minting, trading, alliance management, territory control
    - Real-time updates via WebSocket
- **Features:**
    - Secure session management, rate limiting, CORS, logging
    - Integrates with smart contracts and frontend
    - Environment config via `.env`

---


## Smart Contracts (`contracts/`)

- **Solidity Contracts:**
    - `OCSH.sol` — Main game logic (NFT minting, alliances, territory, trading, messaging)
    - `OSCHLib.sol` — Library and shared logic
- **Hardhat:** Compilation, deployment, and testing (`hardhat.config.ts`)
- **Scripts:**
    - `deploy-testnet.ts`, `send-op-tx.ts`, `test-basic.ts` for deployment and testing
- **Testing:**
    - Unit and integration tests in `test/`
- **Artifacts:**
    - Compiled contract ABIs and build info in `artifacts/`

---


## Frontend (`client/`)

- **Tech Stack:** React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui, PWA
- **State Management:** TanStack Query, React Context, custom hooks
- **Routing:** Wouter (or React Router)
- **Structure:**
    - Main entry: `src/main.tsx`, `App.tsx`
    - Modular components in `components/` (e.g., trading, alliances, ai-npc-factions, mesh-network, pwa-inventory)
    - Pages in `pages/` (dashboard, handheld, nft-gate, not-found, pwa-interface)
- **UI:** Custom and third-party components, cyberpunk/military-industrial theme
- **Features:**
    - NFT minting, territory claiming, alliance management, trading, real-time comms
    - Offline-first PWA, Blokboy 1000 terminal, Foundry Courier integration
    - Real-time map, power rankings, and notifications

---


## Configuration & Scripts

- **Deployment & Automation:**
    - Scripts for testnet/mainnet deployment, contract verification, and testing (`scripts/`)
    - Hardhat and Vite config files
- **Environment:**
    - `.env` files for secrets and RPC endpoints (see below)

---


## Documentation (`docs/`)

- **Guides:** `README.md`, `ROADMAP.md`, `SECURITY.md`, deployment checklists
- **Technical Docs:** Architecture diagrams, feature breakdowns, and security notes
- **Game Design:** In-depth game mechanics, economic models, and user guides

---


## Shared & Data

- **Shared Logic:** `shared/` for game items, schema, and types
- **Artifacts:** `artifacts/` for contract ABIs and build info
- **Test Data:** `test/` for contract and integration tests

---


## Notable Patterns & Features

- **Deterministic Game Logic:** Pure aggregate calculations, zero randomness, predictable outcomes
- **Alliance & Territory Control:** Multi-role alliances, territory bonuses, real-time map
- **Trading & Economy:** NFT trading, real-time price feeds, portfolio management
- **Offline-First:** PWA, Blokboy 1000 terminal, Foundry Courier CLI for offline tx
- **Real-Time Communication:** WebSocket, global and alliance messaging, notifications
- **Security:** Role-based access, reentrancy protection, audit logging, compliance
- **DevOps:** Automated deployment scripts, environment configs, monitoring

---

> For a deeper dive, explore the documentation and architecture diagrams in the `/docs` directory.

---


# Full Workspace Context (Authoritative)

## 1. Directory & File Structure


- **contracts/**: OCSH.sol, OSCHLib.sol, Hardhat config, deployment/test scripts, contract artifacts, and tests
- **server/**: Node.js backend (Express), API endpoints for game actions, trading, alliances, territory, and real-time comms
- **client/**: React 18 + TypeScript frontend, Vite, Tailwind CSS, modular components, PWA, real-time features
- **shared/**: Game items, schema, and types
- **test/**: Contract and integration tests
- **docs/**: Markdown documentation for APIs, security, roadmap, and technical guides
- **Root**: Project-level docs (`README.md`, `ROADMAP.md`, `SECURITY.md`), deployment scripts, and configs


## 2. Backend (server/)

- **Express API**: Endpoints for NFT minting, trading, alliances, territory, and messaging
- **WebSocket**: Real-time updates for battles, messages, and territory changes
- **Database**: PostgreSQL via Drizzle ORM
- **Security**: Rate limiting, CORS, session management, error handling


## 3. Smart Contracts (contracts/)

- **OCSH.sol**: Main contract for NFT minting, alliances, territory, trading, and messaging
- **OSCHLib.sol**: Shared library for contract logic
- **Hardhat**: Compilation, deployment, and testing
- **Testing**: Unit and integration tests for all game logic


## 4. Frontend (client/)

- **React 18 + TypeScript**: SPA with modular, feature-specific components (e.g., ai-npc-factions, mesh-network, trading-interface, pwa-inventory)
- **Routing**: Wouter or React Router, lazy-loaded pages
- **State Management**: TanStack Query, Context, custom hooks
- **UI/UX**: Tailwind CSS, shadcn/ui, cyberpunk/military-industrial theme
- **Features**: NFT minting, territory claiming, alliances, trading, real-time comms, offline-first PWA
- **Integration**: Connects to backend APIs and smart contracts (ethers/viem), wallet connection, on-chain actions


## 5. Scripts & Configuration

- **Deployment Scripts**: For testnet/mainnet, contract verification, and testing
- **Config Files**: Hardhat, Vite, Tailwind, tsconfig, postcss
- **Environment**: `.env` files for secrets and RPC endpoints


## 6. Documentation (docs/)

- **API Docs**: Game API, contract integration, security, and deployment
- **Technical Roadmap**: `ROADMAP.md` with tasks, features, and status
- **Security**: `SECURITY.md` and in-code comments


## 7. Security & Compliance

- **Smart Contracts**: Role-based access, capped supply, emergency controls, reentrancy protection
- **Backend**: Rate limiting, CORS, session management, error handling
- **Frontend**: Secure wallet integration, user data privacy, best practices


## 8. DevOps & Deployment

- **Environments**: Dev, testnet, mainnet, with scripts for deployment and verification
- **Service Management**: Automated scripts, monitoring, and alerting


## 9. Patterns & Technologies

- **Deterministic Game Logic**: Pure aggregate calculations, territory mathematics, alliance bonuses
- **Offline-First**: PWA, Blokboy 1000 terminal, Foundry Courier CLI
- **Real-Time**: WebSocket, live map, notifications
- **Security**: Role-based access, audit logging, compliance

---


# Deep Insights Extracted


1. **Seamless Full-Stack Integration**: Tight coupling between smart contracts, backend APIs, and frontend UI enables rapid iteration and end-to-end feature delivery.
2. **Deterministic, Predictable Game Logic**: All outcomes are calculable, supporting strategic gameplay and transparency.
3. **Security-First Design**: Role-based access, reentrancy protection, and audit logging across all layers.
4. **Offline-First & Real-Time**: PWA, Blokboy 1000 terminal, and WebSocket for live and offline play.
5. **Comprehensive Documentation**: Deep technical, architectural, and operational guides for onboarding and maintenance.
6. **DevOps Maturity**: Automated scripts, multi-environment support, and monitoring for robust deployments.
7. **Community & Ecosystem Ready**: Plugin/template support, guides, and open architecture for future growth.

---


# Actionable Insights & Recommendations


1. **Maintain Documentation Rigor**: Keep all docs and checklists up to date as features evolve.
2. **Expand Automated Testing**: Increase test coverage for contracts, backend, and frontend.
3. **Formalize Security Audits**: Schedule regular audits for contracts and backend.
4. **Advance Multi-Chain Support**: Plan for future cross-chain and ENS integration.
5. **Enhance DevOps Automation**: Integrate CI/CD and automate deployments.
6. **Foster Community & Ecosystem**: Publish guides, support plugins, and encourage contributions.

---


> This file is the single source of truth for OCSH. All contributors (AI or human) must reference and update this document for any architectural, technical, or operational changes. For the most current and comprehensive understanding, always start here.

