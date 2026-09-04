# KasBurner

> Single-use Kaspa wallets that vanish after the transaction, keeping your real address private.

![KasBurner Dark OPSEC](public/favicon.svg)

KasBurner is a client-side ephemeral burner wallet generator designed for Kaspa operational security (OPSEC). It lets you receive KAS through temporary, throwaway addresses that exist exclusively in browser RAM, auto-sweep funds to your permanent cold wallet with dynamically calculated consensus fees, and permanently erase private keys with zero disk or server storage.

---

## Key Features

- **In-Memory Cryptographic Generation:** Creates valid `kaspa:` and `kaspatest:` addresses with Schnorr public keys entirely client-side via CSPRNG without server roundtrips.
- **Official Browser WASM Engine:** Integrates official Kaspa WebAssembly bindings compiled for browser runtimes to construct, sign, and broadcast consensus-compliant transactions.
- **Dynamic Compute Mass Fee (100 sompi/gram):** Automatically calculates exact transaction compute mass and applies the post-Crescendo 100 sompi/gram mempool fee policy dynamically.
- **Receiver-Pays Auto-Sweep:** Uses `FeeSource.ReceiverPays` so that 100% of the input balance is swept directly to the destination with exact fee deduction and zero leftover dust.
- **Auto-Expiry Inactivity Timer:** Configurable countdown timer (15m, 1h, 24h) with crisp JetBrains Mono display that automatically zeroes RAM keys on unattended sessions, guarded by zero-dust active fund preservation.
- **Strict 0-Storage Policy:** Zero cookies, zero `localStorage`, zero remote logging, and zero server storage. Verified client-side.
- **RAM Zero-Filling (`0x00`):** Explicitly overwrites private key byte buffers in memory upon sweep completion or manual burn.
- **Interactive "What's New" Changelog:** Built-in notification bell and release modal keeping users informed of updates while maintaining 0-storage privacy.
- **Beginner's Guide (Built-In):** Interactive 3-step walkthrough directly inside the dashboard explaining the OPSEC workflow in plain English.
- **Developer Donation Channel:** Built-in donation card with 1-click address copy and QR code modal to support open-source maintenance.
- **Safe Clipboard Utility:** Resilient clipboard copying that falls back gracefully even when the browser window loses focus.
- **Mobile-Responsive UI:** High-contrast hacker-clean dark interface designed for smartphones and desktop viewports.

---

## How It Works

```text
1. Share Address       2. Wait For Incoming KAS        3. Sweep & Wipe
┌──────────────────┐   ┌──────────────────────────┐   ┌───────────────────────────────┐
│ Fresh in-memory  │──▶│ Live balance detection   │──▶│ Dynamic compute mass fee calc │
│ burner address   │   │ via public Kaspa REST/RPC│   │ + Schnorr tx signed in WASM;  │
│ generated in RAM │   │ nodes (no server middle) │   │ RAM wiped (0x00) & auto-renew │
└──────────────────┘   └──────────────────────────┘   └───────────────────────────────┘
```

---

## Dynamic Fee & Transaction Architecture

KasBurner enforces modern Kaspa network consensus and mempool policies:

1. **Compute Mass Feerate:** The Kaspa network requires transactions to pay at least **100 sompi per 1 gram of compute mass** (`feeRate: 100`). A standard 1-input 1-output transaction has ~1,635 to 2,058 grams of mass, requiring a fee of ~163,500 to ~205,800 sompi (~0.0016 to ~0.0021 KAS).
2. **Dynamic Generator:** KasBurner delegates fee calculation directly to the Kaspa WASM generator via `feeRate: 100`. The exact mass is calculated at runtime based on UTXO counts and transaction size.
3. **`FeeSource.ReceiverPays` Sweep:** The calculated fee is subtracted cleanly from the outbound amount to the target wallet. This guarantees:
   - No leftover dust in the burner wallet.
   - No "Insufficient funds" errors when sweeping the entire balance.
   - Exact compliance with Kaspa node standardness filters.
4. **Schnorr Signature Script:** Each UTXO input is signed using BIP340 Schnorr signatures with `SIGHASH_ALL` (66 bytes: `0x41` opcode + 64-byte signature + `0x01` sighash byte), verifying seamlessly against Kaspa's `OP_CHECKSIG` script engine.

---

## Technical Architecture

- **Frontend:** React 18 + TypeScript + Vite (`target: esnext`)
- **Styling:** Tailwind CSS (Dark palette: `#0B0F12`, Kaspa Cyan: `#70C7BA`, Glow: `#49EACB`)
- **Cryptography & WASM:**
  - Official Kaspa WebAssembly SDK (`src/wasm/kaspa/`) for transaction generation and Schnorr signing
  - `@noble/curves/secp256k1` + `@noble/hashes/sha2` for CSPRNG key generation and Bech32 address encoding
- **Network Interface:** Direct browser connection to public Kaspa REST/RPC endpoints (`https://api.kaspa.org`, `https://api-tn10.kaspa.org`)
- **Deployment:** 100% static Jamstack bundle (Cloudflare Pages / Vercel / GitHub Pages)

---

## Project Structure

```text
kas-burner/
├── docs/
│   ├── PRD-KasBurner-MVP.md          # Product Requirements Document
│   └── TechDesign-KasBurner-MVP.md   # Technical Architecture Document
├── public/
│   └── favicon.svg                   # Kaspa-themed SVG icon
├── src/
│   ├── components/
│   │   ├── Header.tsx                # Title, network switcher, OPSEC status badge
│   │   ├── BurnerCard.tsx            # Burner address, copy button, QR modal, key reveal
│   │   ├── BalanceTracker.tsx        # Live balance counter, node sync indicator, UTXO count
│   │   ├── SweepForm.tsx             # Destination address validator, dynamic fee estimation, Sweep & Burn
│   │   ├── GuideAndDonation.tsx      # Beginner's 3-step guide & developer donation card
│   │   ├── SecurityBadge.tsx         # Cryptographic OPSEC guarantee summary
│   │   ├── WipeNotification.tsx      # Sweep broadcast confirmation & RAM zeroing alert
│   │   └── ChangelogModal.tsx        # Interactive What's New modal and version history
│   ├── data/
│   │   └── changelog.ts              # Structured release history and feature logs
│   ├── hooks/
│   │   └── useBurnerWallet.ts        # In-memory wallet lifecycle state machine
│   ├── services/
│   │   ├── kaspa.ts                  # Keygen, Bech32 encoding, dynamic fee calculation, tx signing & broadcast
│   │   └── security.ts               # Byte buffer zeroing (0x00) & storage auditor
│   ├── wasm/
│   │   └── kaspa/                    # Official Kaspa WebAssembly browser SDK (kaspa.js + kaspa_bg.wasm)
│   ├── types/
│   │   └── wallet.ts                 # Type definitions
│   ├── utils/
│   │   └── clipboard.ts              # Safe copy fallback for all browser contexts
│   ├── App.tsx                       # Main dashboard composition
│   ├── main.tsx                      # Vite React entrypoint
│   └── index.css                     # Tailwind base styles
├── AGENTS.md                         # Master build execution plan & Git workflow rules
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── vite.config.ts
```

---

## 🚀 V2 Roadmap & Upcoming Features

The following features are scheduled for KasBurner V2 development:

1. **Auto-Expiry Inactivity Timer (Priority #1) [COMPLETED in v2.0.0]:** Configurable countdown timer (15m, 1h, 24h) that zeroes RAM keys if left inactive, guarded by zero-dust balance protection.
2. **Encrypted Session Log / Proof of Sweep (Priority #2):** Temporary in-memory log of sweep TXIDs for users who need a transaction receipt before closing the tab.
3. **Split Routing (Priority #3):** Multi-output sweep distributing funds across multiple addresses by percentage to disrupt on-chain clustering.
4. **Multiple Active Burners (Priority #4):** Manage concurrent disposable addresses in parallel within a single browser tab.

---

## Development & Build

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Run TypeScript typecheck
npm run typecheck

# Build static production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## Donations

If you find this tool helpful for your Kaspa OPSEC, consider sending a small tip to support development:

```text
kaspa:qypgw7xw60yvxv5pcjncdv4f30wanju0g64hw3204wreayajt3025qgde344ycq
```

---

## License

MIT License. Open-source software built for the Kaspa community.