# KasBurner

> Single-use Kaspa wallets that vanish after the transaction, keeping your real address private.

![KasBurner Dark OPSEC](public/favicon.svg)

## Features
- **In-Memory Key Generation:** Generates valid `kaspa:` addresses with Schnorr public keys entirely client-side using CSPRNG and WebCrypto.
- **0-Storage Enforced:** Zero cookies, zero `localStorage`, zero remote logging, and zero server storage.
- **Auto-Sweep & Wipe Routing:** Moves all received KAS to your permanent destination address with optimal network fee deduction.
- **RAM Zero-Filling:** Explicitly overwrites private key byte buffers (`0x00`) upon transaction completion or emergency burn.
- **Mobile-Responsive:** Built with a dark, hacker-clean interface optimized for smartphones and desktop browsers.

---

## Technical Architecture
- **Framework:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS (Dark theme / Kaspa Cyan)
- **Cryptography:** `@noble/curves/secp256k1` + `@noble/hashes/sha2` (Schnorr signatures & Bech32 encoding)
- **RPC Communication:** Direct browser REST/WebSocket queries to public Kaspa nodes

---

## Development & Build

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run TypeScript check
npm run typecheck

# Build static production bundle
npm run build
```

---

## License
MIT Open Source - Built for the Kaspa OPSEC community.
