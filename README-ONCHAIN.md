---
description: MOVING VALUE WITHOUT THE INTERNET
---

# Darknet Continuum

```
On-Chain Resilience Field Manual
```

In the evolving digital economy, reliance on the traditional internet infrastructure poses risks. In cases of power outages, cable damage, or grid failures, blockchain networks can endure by finding alternative data transmission routes. This guide provides protocols to maintain transaction flow, even when conventional networks fail.

## 🏷️ Soulbound Identity System

The OCSH ecosystem implements a comprehensive Soulbound Token (SBT) system for identity, reputation, and governance:

### Core Components

- **IdentitySBT Contract**: ERC-5192 compliant non-transferable tokens
- **Eligibility Contract**: Topic-based governance eligibility checker
- **Reputation System**: Decay-weighted scoring based on on-chain activity
- **Role-Based Access**: Hierarchical permissions for game mechanics

### SBT Roles & Benefits

| Role | Requirements | Benefits | Expiry |
|------|-------------|----------|--------|
| **VETERAN** | 10+ battles won | +20% battle power | 1 year |
| **COMMANDER** | Alliance leadership | +30% battle power, alliance creation | 1 year |
| **TRADER** | 50+ successful trades | Enhanced trading privileges | 1 year |

### Reputation Mechanics

- **Decay Function**: `reputation = initial_weight * e^(-t/τ)` where τ = 90 days
- **Activity Boost**: Recent on-chain activity increases reputation weight
- **Governance Power**: Reputation directly influences voting power in governance

### Integration Points

- **Battle System**: SBT roles provide power multipliers
- **Territory Claims**: Higher reputation enables claiming occupied territories
- **Alliance Creation**: Commander role required for alliance leadership
- **Achievement System**: Automatic SBT minting for game milestones

***

{% hint style="info" %}
#### **PRTCL**<sub>**1**</sub>  <kbd>BONE NET (BONET)</kbd>

Mesh Networking&#x20;

Create a decentralized, peer-to-peer network where devices connect directly to each other. Transactions are passed from device to device like whispers through a crowd. This method is slower but highly effective for moving signed transactions without a central internet connection.
{% endhint %}

{% hint style="info" %}
#### PRTCL<sub>2</sub>  <kbd>SIGNAL SCRIPT</kbd>

SMS Transactions

Utilize existing cellular towers for basic communication. Transactions can be sent via plain-text SMS, containing a simple command, wallet address, and signature. This method requires no apps or browsers, relying only on a cell signal and a keypad.
{% endhint %}

{% hint style="info" %}
#### **PRTCL**<sub>**3**</sub> <kbd>PHYSICAL HANDSHAKE (LEDGER)</kbd>

Offline Hardware Transfer&#x20;

Employ a physical-delivery method for transactions. One person signs a transaction, and another person physically carries the data to a location with an internet connection to broadcast it. This method turns transaction delivery into a form of spycraft.
{% endhint %}

{% hint style="info" %}
#### **PRTCL**<sub>**4**</sub> <kbd>**DATA RELIC**</kbd>

USB Sneakernet

Use a portable storage device as the data carrier. A signed transaction file is saved to a USB stick, physically moved to a device that has network access, and then broadcast to the blockchain.
{% endhint %}

{% hint style="info" %}
#### **PRTCL**<sub>**5**</sub>  <kbd>STATIC HAUL (LONG & SHORT)</kbd>

Ham Radio Blockchain&#x20;

Harness the power of amateur radio. If ham radio can transmit emails over long distances, it can transmit blockchain data, offering a resilient, cross-border method of communication that is immune to physical infrastructure cuts.
{% endhint %}

{% hint style="info" %}
#### **PRTCL**<sub>**6**</sub> <kbd>GHOST MODE</kbd>

Radio Broadcast

Leverage radio broadcasts to transmit transactions. A signed, compressed data packet is converted into radio waves and broadcast over the air. Anyone with the right receiver can capture, decode, and inject the transaction into the network, bypassing routers and DNS entirely.
{% endhint %}

{% hint style="info" %}
#### **PRTCL**<sub>**7**</sub> <kbd>SKYCHAIN RELAY</kbd>

Satellite Link&#x20;

Broadcast transactions directly into space using a satellite dish. The satellite then relays the data back down to a receiving station connected to the blockchain network, completely bypassing all terrestrial infrastructure.
{% endhint %}

{% hint style="warning" %}
#### Core Doctrine

The true essence of blockchain is independent of the internet; instead, the internet serves as a useful transport layer. If one route fails, a resilient network seeks another path. As long as data can be transferred, value can be transferred.
{% endhint %}

