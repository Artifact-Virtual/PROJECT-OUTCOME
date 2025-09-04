# Security Notes

This document highlights security considerations for core on-chain and off-chain features, with special focus on the BribeEscrow mechanic.

## Smart Contracts

- Compiler/runtime: Solidity ^0.8.x with built-in overflow checks
- Libraries: OpenZeppelin (ERCs, ReentrancyGuard, SafeERC20)
- Non-upgradeable vs upgradeable: Follow least-privilege, minimize admin surface.

### BribeEscrow Threat Model

- Asset types: ETH, ERC20, ERC721 in escrow until accepted/declined/canceled.
- Reentrancy: Functions guarded by ReentrancyGuard; no external calls before state changes.
- Refund paths: Decline/cancel refund to original sender only.
- Access control: Only recipient may accept/decline; only sender may cancel.
- DoS via dust: A malicious user could create many tiny offers to a target. Mitigations:
	- UI filtering and rate limits
	- Optional min-value threshold client-side
	- Off-chain indexing to allow pagination and ignore low-value offers
- ERC20 safety: Uses SafeERC20; tokens with nonstandard behavior may still misbehave. Prefer audited tokens.
- ERC721 safety: Transfers use standard safe/transfer flows; ensure approvals are set before creating offers.

### User Safety Guidelines

- Verify recipient addresses, amounts, and token contracts before signing.
- Treat bribe offers as public on-chain; the app avoids global broadcast, but L2 explorers still show activity.
- Never share private keys. Use hardware wallets for high-value actions.
- Prefer small test offers with new counterparties.

## Backend and API

- Input validation with Zod; sanitize/validate all params.
- Session security: Secure cookies in production; rotate secrets.
- Rate limiting: Apply per-IP and per-account limits to messaging and heavy endpoints.
- WebSocket: Authenticate sessions; avoid broadcasting sensitive PII.

## Offline/Courier

- Signed transactions can be transported over mesh/SMS/radio/ham/satellite; integrity comes from signatures.
- Keep mnemonic/keys offline; never embed in QR frames or logs.
- Validate chainId and nonce when relaying to avoid replay across networks.

## Reporting

Responsible disclosure: Please open a security issue or contact maintainers privately with reproduction steps.
