# CastFlow

Sell sponsored cast slots on Farcaster. Get paid on Base.

CastFlow is a sponsored-cast marketplace: creators list a slot for a fixed ETH price, advertisers browse and book it, the creator posts, and payment is settled on Base. No platform fees during beta.

**Live app:** https://castflow-frontend.vercel.app
**Farcaster Mini App:** verified manifest at `/.well-known/farcaster.json`, launches directly inside Warpcast
**Built by:** [@afifarioss](https://farcaster.xyz/afifarioss) — `afifarioss.base.eth`

---

## What it does

**For creators**
1. Connect a wallet
2. List a slot — set a price (ETH), duration, and description
3. Get booked by an advertiser
4. Post the cast, get paid

**For advertisers**
1. Connect a wallet
2. Browse open slots
3. Submit a campaign brief and book at the listed price
4. Cast goes live

---

## Status: Base Sepolia (testnet), building in public

This project is currently deployed and tested on **Base Sepolia**, not mainnet. Everything described below is real and working — wallet connect, on-chain listing, booking, database persistence — but has not yet been deployed to Base mainnet with real funds. That migration is a near-term goal once the flow has been validated further.

Payment settlement during this beta is **manual**, not automated escrow — there is currently no on-chain escrow contract. This is stated explicitly so no one mistakes CastFlow's current state for more than it is.

---

## Architecture

**Frontend** — Next.js 15 (App Router), Tailwind, deployed on Vercel
- Wallet connection via raw `window.ethereum` (no wagmi dependency)
- Direct on-chain calls to `AdRegistry.listSlot()` via `viem`
- Transaction confirmation via receipt polling before reporting success to the user

**Backend** — Express + Prisma + PostgreSQL (Neon), deployed on Render
- Tracks slots and bookings off-chain for browsing/searching
- Simplified schema: `AdSlot` and `AdBooking`, ETH-denominated throughout

**Smart contract** — Solidity, deployed via Foundry
- `AdRegistry.sol` — `listSlot(uint256 price, uint256 duration, string metadata)`
- Address (Base Sepolia): `0xcD9A23aAf3880CacfB4ff340CBffa513F1Ab6F7C`

**Farcaster integration**
- Verified Mini App manifest with signed `accountAssociation`
- Dynamic OG image generation for link previews and app icon/splash (via `@vercel/og`, no static image assets needed)

---

## Why Base

Low transaction fees and fast settlement make per-cast micropayments viable in a way they aren't on most other chains. Farcaster's user base is Base-native by convention, making it a natural fit for a creator-monetization primitive built directly for that audience.

---

## Roadmap

- [ ] Deploy to Base mainnet once the flow is proven stable
- [ ] On-chain escrow contract (`AdEscrow`) to replace manual payout
- [ ] Farcaster-native identity (Sign In With Neynar) alongside wallet-only auth
- [ ] Public discovery/browse page improvements
- [ ] Reputation system for repeat creators and advertisers

---

## Tech stack

Next.js · TypeScript · Tailwind CSS · viem · Express · Prisma · PostgreSQL (Neon) · Solidity · Foundry · Vercel · Render
