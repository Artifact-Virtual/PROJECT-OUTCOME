# OCSH Game Guide: How to Play the Onchain Survival Chain

## 🎮 Game Overview

OCSH (Onchain Survival Chain) is a blockchain-based survival strategy game where players control NFT characters to battle, claim territories, form alliances, and build their reputation in a post-apocalyptic world. The game combines elements of territory control, RPG progression, and social strategy.

## 🚀 Getting Started

### 1. **Minting Your Character**
- Each player receives an NFT character (token) when they join
- Characters are linked in a blockchain "chain" - each new token references the previous one
- Your character has unique attributes: level, XP, and reputation

### 2. **Understanding Core Mechanics**
- **Reputation System**: Built through SBT (Soulbound Tokens) that track your achievements
- **Leveling**: Gain XP through battles, territory claims, and achievements
- **Anti-Spam Protection**: Message sending has cooldowns and increasing fees

## 🏰 Territory Control System

### **How Territories Work**
- **10 Total Territories**: The game world consists of 10 strategic territories (numbered 0-9)
- **Claim Mechanics**: Use your NFT character to claim any territory
- **Control Duration**: Territories have a 24-hour cooldown before they can be reclaimed
- **XP Rewards**: Claiming territories grants 50+ XP (with reputation bonuses)

### **Claiming Territory**
```solidity
claimTerritory(territoryId, tokenId)
```
- **Requirements**: You must own the token being used
- **Process**: 
  1. Choose an unclaimed territory (0-9)
  2. Use your character token to claim it
  3. Gain XP and potentially level up
  4. Territory becomes associated with your alliance (if any)

### **Territory Takeover**
- **Reputation-Based**: Higher reputation players can claim occupied territories
- **Requirements**: Your reputation must be 110% of the current owner's reputation
- **Cooldown**: Must wait 24 hours after last claim before attempting takeover

## ⚔️ Battle System

### **How Battles Work**
Battles in OCSH use a two-phase system:

#### **Phase 1: Challenge System (On-Chain)**
```solidity
issueChallenge(challengerToken, opponentToken)
acceptChallenge(challengeId)
```

1. **Issue Challenge**: Any player can challenge another player's token
2. **Accept Challenge**: The opponent must accept the challenge
3. **Random Resolution**: Uses blockchain randomness (blockhash + timestamps)
4. **Immediate XP**: Winner gains 100 XP and potentially levels up
5. **Achievement Tracking**: First win grants "FIRST_WIN" achievement SBT

#### **Phase 2: Advanced Battle Engine (Off-Chain/Server)**
For more complex territorial battles, the game uses an advanced battle engine that calculates:

- **Base Power**: Level × 100
- **SBT Bonuses**: 
  - Veteran: +20% power
  - Commander: +30% power
- **Reputation Bonus**: Up to +50% based on reputation score
- **Territorial Advantages**:
  - Adjacent allied territories: +25 power each
  - Defensive bonus: +80 power when defending
  - Supply lines: +10 power per territory owned (if >3)
  - Resource control multipliers

### **Battle Power Calculation**
```
Total Power = (Base Power × SBT Multipliers + Reputation Bonus) / 1e18
```

### **Winning Conditions**
- **Random Element**: 50/50 base chance modified by power differences
- **Power Advantage**: Higher power increases win probability
- **Defensive Bonus**: Defenders get significant advantages in their territory
- **Alliance Support**: Adjacent allied territories provide power bonuses

## 🤝 Alliance System

### **Creating Alliances**
```solidity
createAlliance(memberTokenIds[])
```
- **Requirements**: Must have COMMANDER SBT role
- **Leadership**: Alliance creator becomes the leader and gains ALLIANCE_LEADER_ROLE
- **Multiple Characters**: Can include multiple of your own tokens

### **Joining Alliances**
```solidity
joinAlliance(allianceId, tokenId)
```
- **Open System**: Any existing alliance can be joined
- **Territory Benefits**: Allied territories provide mutual support
- **Strategic Value**: Coordinated territory control and mutual defense

### **Alliance Benefits**
- **Territorial Control**: Allied territories support each other in battles
- **Power Bonuses**: Adjacent allied territories grant combat advantages
- **Achievement Potential**: Building large alliances can earn achievement SBTs
- **Strategic Coordination**: Plan coordinated attacks and defenses

## 📈 Progression System

### **Experience Points (XP)**
- **Battle Victories**: +100 XP per win
- **Territory Claims**: +50 XP (+ reputation bonus)
- **Achievements**: Various XP rewards for special accomplishments

### **Leveling Up**
- XP converts to levels using mathematical formulas
- Higher levels increase base battle power
- Level progression affects territorial control efficiency

### **Reputation & SBT System**
- **Soulbound Tokens**: Non-transferable achievements bound to your identity
- **Reputation Weight**: Accumulates through positive actions
- **Role-Based Access**: Special SBT roles unlock game features:
  - **VETERAN**: +20% battle power, general game benefits
  - **COMMANDER**: +30% battle power, can create alliances
  - **TRADER**: Enhanced trading capabilities

### **Achievement System**
- **FIRST_WIN**: Earned on first battle victory
- **TERRITORY_MASTER**: Control 5+ territories simultaneously
- **ALLIANCE_BUILDER**: Build and maintain large alliances

## 💬 Communication System

### **Messaging**
```solidity
sendMessage(tokenId, "message")
```
- **Anti-Spam**: 10-block cooldown between messages
- **Fee Structure**: Increasing fees based on message count (starts at 0.00001 ETH)
- **Character Limit**: 64 characters maximum
- **Token Association**: Messages are tied to specific character tokens

## 🔄 Trading System

### **Token Trading**
```solidity
proposeTrade(fromToken, toToken)
acceptTrade(fromToken, toToken)
```
- **Secure Exchange**: Atomic swap of NFT characters
- **Proposal System**: Must propose before accepting
- **Strategic Value**: Trade characters with different levels/positions

### **Hand-to-Hand Bribes (New)**

Bribes are simple offers that must be accepted by the recipient before funds/NFTs move. They enable discreet diplomacy without global notifications.

```text
Contract: BribeEscrow (on-chain)
Assets: ETH, ERC20, ERC721
Flow: Sender -> create offer; Recipient -> accept or decline; Sender can cancel while pending
Visibility: Offers are not broadcast in global channels; transactions are still on-chain
```

Gameplay impact:
- "Under the table" diplomacy: Reward ceasefires, recruit members, offer tribute
- Social signaling: Accept/decline communicates inclination and loyalty
- Roleplay depth: Leaders can nudge outcomes without explicit declarations

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

## 🏆 How to Win

### **Victory Conditions**

OCSH doesn't have a single "win condition" but multiple paths to dominance:

1. **Territorial Dominance**: Control multiple territories simultaneously
2. **Alliance Supremacy**: Build and lead the largest, most powerful alliance
3. **Combat Mastery**: Achieve high levels through consistent battle victories
4. **Reputation Leadership**: Build the highest reputation score through achievements
5. **Strategic Control**: Control key territories that provide maximum strategic advantage

### **Losing Scenarios**

- **Territory Loss**: Territories can be claimed by higher-reputation players
- **Battle Defeats**: Losing battles means no XP gain for that engagement
- **Alliance Collapse**: Poor leadership can lead to alliance fragmentation
- **Reputation Decline**: Negative actions can impact your reputation score

## 🛡️ Strategic Tips

### **Early Game**

1. **Claim Territory Quickly**: Get established in the world
2. **Engage in Battles**: Build XP and potentially get early wins
3. **Send Messages**: Build social connections (mind the anti-spam costs)
4. **Work Toward Commander Role**: Unlock alliance creation

### **Mid Game**

1. **Form/Join Strategic Alliances**: Coordinate with other players
2. **Focus on Reputation**: Build SBT achievements for permanent bonuses
3. **Control Adjacent Territories**: Create defensive networks
4. **Balance Offense/Defense**: Don't overextend your territorial control

### **Late Game**

1. **Master Territory Control**: Use reputation advantages to claim key territories
2. **Leverage Alliance Networks**: Coordinate large-scale strategic moves
3. **Optimize Battle Power**: Maximize SBT bonuses and territorial advantages
4. **Maintain Reputation**: Protect your competitive advantages

## 🌐 Offline/Resilient Features

### **Darknet Continuum Protocols**

The game includes revolutionary offline transaction methods:

- **Mesh Networking**: Peer-to-peer transaction relay
- **SMS Transactions**: Cellular-based blockchain interaction
- **Physical Handshake**: Manual transaction delivery
- **USB Sneakernet**: Portable storage-based transaction transfer
- **Ham Radio**: Long-distance blockchain communication
- **Satellite Relay**: Space-based transaction broadcasting

## 🎯 Core Game Loop

1. **Mint Character** → **Claim Territory** → **Gain XP**
2. **Engage in Battles** → **Win/Lose** → **Level Up**
3. **Build Reputation** → **Earn SBT Roles** → **Unlock Features**
4. **Form Alliances** → **Coordinate Strategy** → **Control Territory**
5. **Repeat and Scale** → **Dominate the Game World**

## 📊 Success Metrics

Track your progress through:
- **Territory Count**: How many territories you control
- **Alliance Size**: Number of members in your alliance
- **Battle Record**: Win/loss ratio and total victories
- **Reputation Score**: Overall community standing
- **Achievement SBTs**: Special recognition tokens earned
- **Character Level**: Individual character progression

---

*The blockchain battlefield awaits. Will you survive and thrive in the Onchain Survival Chain?*
