# KasBurner

> Single-use Kaspa wallets that vanish after the transaction, keeping your real address private.

![KasBurner Dark OPSEC](public/favicon.svg)

KasBurner is a client-side ephemeral burner wallet generator designed for Kaspa operational security (OPSEC). It lets you receive KAS through temporary, throwaway addresses that exist exclusively in browser RAM, auto-sweep funds to your permanent cold wallet, and permanently erase private keys with zero disk or server storage.

---

## Key Features

- **In-Memory Cryptographic Generation:** Creates valid `kaspa:` and `kaspatest:` addresses with Schnorr public keys entirely client-side via CSPRNG without server roundtrips.
- **Strict 0-Storage Policy:** Zero cookies, zero `localStorage`, zero remote logging, and zero server storage. Verified client-side.
- **Auto-Sweep & Wipe Routing:** Sweeps 100% of received KAS (minus minimal network fee) to your target wallet, then wipes the key immediately.
- **RAM Zero-Filling (`0x00`):** Explicitly overwrites private key byte buffers in memory upon sweep completion or manual burn.
- **Beginner's Guide (Built-In):** Interactive 3-step walkthrough directly inside the dashboard explaining the OPSEC workflow in plain English.
- **Developer Donation Channel:** Built-in donation card with 1-click address copy and QR code modal to support open-source maintenance.
- **Safe Clipboard Utility:** Resilient clipboard copying that falls back gracefully even when the browser window loses focus.
- **Mobile-Responsive UI:** High-contrast hacker-clean dark interface designed for smartphones and desktop viewports.

---

## How It Works

```text
1. Share Address       2. Wait For Incoming KAS        3. Sweep & Wipe
┌──────────────────┐   ┌──────────────────────────┐   ┌───────────────────────────────┐
│ Fresh in-memory  │──▶│ Live balance detection   │──▶│ Funds broadcasted to real     │
│ burner address   │   │ via public Kaspa REST/RPC│   │ wallet; burner keys zeroed in │
│ generated in RAM │   │ nodes (no server middle) │   │ RAM (0x00) & fresh key spawns │
└──────────────────┘   └──────────────────────────┘   └───────────────────────────────┘
```

---

## Technical Architecture

- **Frontend:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS (Dark palette: `#0B0F12`, Kaspa Cyan: `#70C7BA`, Glow: `#49EACB`)
- **Cryptography:** `@noble/curves/secp256k1` + `@noble/hashes/sha2` (Schnorr X-only keys & Bech32 encoding)
- **Script Converter:** Built-in `addressToScriptPublicKey()` bytecode converter for Kaspa consensus
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
│   │   └── wallet.ts                 # Type definitions
│   ├── utils/
│   │   └── clipboard.ts              # Safe copy fallback for all browser contexts
│   ├── App.tsx                       # Main dashboard composition
│   ├── main.tsx                      # Vite React entrypoint
│   └── index.css                     # Tailwind base styles
├── AGENTS.md                         # Master build execution plan
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── vite.config.ts
```

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

MIT License • Open Source • Built for the Kaspa OPSEC community.
