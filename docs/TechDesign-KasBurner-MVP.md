# Technical Design Document: KasBurner MVP

**Author:** Genzo & Antigravity  
**Date:** 2026-09-02  
**Status:** Implemented & Verified  
**Version:** 1.0 (MVP)  

---

## 1. Implemented Architecture & Approach

### Architecture Pattern: Static Jamstack (Client-Only)
- **Frontend Framework:** React 18 (via Vite) + TypeScript
- **Styling:** Tailwind CSS (Dark theme / hacker-clean / Kaspa Cyan palette)
- **Cryptographic Engine:** `@noble/curves/secp256k1` + `@noble/hashes/sha2` (CSPRNG, Schnorr X-only public keys, Bech32 checksum encoding)
- **Networking:** Direct browser REST/WebSocket queries to public Kaspa nodes (`https://api.kaspa.org`, `https://api-mainnet.kaspa.org`, `https://api-tn10.kaspa.org`)
- **Persistence:** **NONE** (Strict zero-storage policy: no localStorage, no cookies, no database)
- **Hosting / Deployment:** Cloudflare Pages / Vercel / GitHub Pages (Static hosting, $0 cost)

---

## 2. Project Structure

```text
kas-burner/
├── docs/
│   ├── PRD-KasBurner-MVP.md          # Updated Product Requirements Document
│   └── TechDesign-KasBurner-MVP.md   # Updated Technical Architecture & Flow
├── public/
│   └── favicon.svg                   # Kaspa-themed SVG icon
├── src/
│   ├── components/
│   │   ├── Header.tsx                # Title, network switcher, OPSEC status badge
│   │   ├── BurnerCard.tsx            # Burner address, copy button, QR toggle, key reveal
│   │   ├── BalanceTracker.tsx        # Live balance counter, node sync indicator, UTXO count
│   │   ├── SweepForm.tsx             # Destination address validator, fee estimation, Sweep & Burn
│   │   ├── GuideAndDonation.tsx      # Beginner's 3-step guide & developer donation card
│   │   ├── SecurityBadge.tsx         # Cryptographic OPSEC guarantee summary
│   │   └── WipeNotification.tsx      # Sweep broadcast confirmation & RAM zeroing alert
│   ├── hooks/
│   │   └── useBurnerWallet.ts        # Reactive in-memory wallet lifecycle state machine
│   ├── services/
│   │   ├── kaspa.ts                  # Keygen, Bech32 encoding, REST polling, tx broadcast
│   │   └── security.ts               # Byte buffer zeroing (0x00) & storage auditor
│   ├── types/
│   │   └── wallet.ts                 # Type contracts for state, wallet, UTXO, and sweep result
│   ├── App.tsx                       # Main layout and composition
│   ├── main.tsx                      # Vite React entrypoint
│   └── index.css                     # Tailwind CSS imports and dark theme base
├── index.html
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── vite.config.ts
└── README.md
```

---

## 3. Cryptographic State Machine

```text
[ Page Load ]
      │
      ▼
[ Generate In-Memory Keypair ] ──▶ (secp256k1 CSPRNG ➔ 32-byte Schnorr X-only ➔ Bech32)
      │
      ▼
[ Display Burner Address ] ──▶ (Copy / QR Modal / Optional Debug Reveal)
      │
      ▼
[ Poll Kaspa Node Balance ] ──▶ (Every 4s via Kaspa REST /addresses/{addr}/utxos)
      │
  ┌───┴───────────────────────┐
  ▼                           ▼
[ Balance = 0 ]        [ Balance > 0 (State: FUNDED) ]
  │                           │
  │                    [ Enter Valid Destination (kaspa:qq...) ]
  │                           │
  │                    [ Click "Sweep All & Wipe Memory" ]
  │                           │
  │                    [ Construct & Broadcast TX to Kaspa Node ]
  │                           │
  │                    [ Broadcast Success (TX ID Received) ]
  │                           │
  └───┬───────────────────────┘
      │
      ▼
[ Secure Memory Wipe Routine ]
  - secureZero(privateKeyBytes) ➔ buffer.fill(0)
  - Clear private key hex strings
  - Set wallet state to WIPED
      │
      ▼
[ Auto-Spawn Fresh Burner after 1.5s ]
```

---

## 4. Developer Donation & Community Features

- **Integrated Donation Address:** `kaspa:qypgw7xw60yvxv5pcjncdv4f30wanju0g64hw3204wreayajt3025qgde344ycq`
- **Interactive UI:**
  - One-click copy with visual confirmation.
  - On-demand SVG QR code modal for mobile camera scanning.
  - Collapsible 3-step beginner guide explaining the OPSEC workflow in plain English.

---

## 5. Security & OPSEC Checklist

1. **Client-Side Isolation:** Private keys never leave browser memory.
2. **Buffer Zero-Filling:** `secureZero(Uint8Array)` explicitly overwrites RAM before garbage collection.
3. **Zero Storage Guarantee:** Verified with `verifyZeroStorage()` ensuring empty local and session storage.
4. **Language Consistency:** Full interface in standard English for international Kaspa community distribution.

---

```json
{
  "appName": "KasBurner",
  "stack": {
    "frontend": "React 18 + Vite",
    "backend": "None (Client-side Jamstack)",
    "database": "None (Zero-storage in-memory)",
    "auth": "None",
    "styling": "Tailwind CSS",
    "deployment": "Cloudflare Pages / Vercel / GitHub Pages"
  },
  "commands": {
    "setup": "npm install",
    "dev": "npm run dev",
    "test": "npm run test",
    "typecheck": "npm run typecheck",
    "build": "npm run build"
  }
}
```
