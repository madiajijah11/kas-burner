# AGENTS.md - KasBurner Development & Agent Guidelines

## Project Overview
- **App Name:** KasBurner
- **Tagline:** Single-use Kaspa wallets that vanish after the transaction, keeping your real address private.
- **Architecture:** Client-side React 18 + Vite + TypeScript + Tailwind CSS + Noble Cryptography (`@noble/curves`, `@noble/hashes`)
- **Security Rule #1:** Zero storage (no localStorage, cookies, or remote logging). Memory wipe after sweep.

---

## 🛑 Git & Deployment Workflow (MANDATORY RULE)

**NEVER automatically commit or push code to remote repositories without explicit user permission.**

### The Required 4-Step Git Protocol:
1. **Develop & Verify Locally:**
   - Write code, make edits, and fix bugs.
   - Run typecheck (`npm run typecheck`) and production build (`npm run build`).
   - Confirm everything passes with 0 errors.
2. **Review & Summarize Changes:**
   - Present a clear, concise summary of modified and newly created files to the user.
   - Show `git status` or `git diff --stat` if requested.
3. **Ask for Confirmation:**
   - Stop and ask the user: *"Would you like me to commit and push these changes now?"*
   - Suggest a clear, conventional commit message (e.g. `feat: ...`, `fix: ...`, `docs: ...`).
4. **Execute ONLY After Explicit Approval:**
   - Perform `git add`, `git commit`, and `git push` **only** after the user responds with "yes", "commit", "push", or equivalent explicit confirmation.

---

## Build Phases & Execution Status

### Phase 1: Foundation Setup
- [x] Initialize Vite + React + TypeScript template
- [x] Configure Tailwind CSS with dark theme / hacker-clean aesthetic
- [x] Set up cryptographic libraries (`@noble/curves/secp256k1` and `@noble/hashes/sha2`)
- [x] Set up project structure (`src/components`, `src/hooks`, `src/services`, `src/types`, `src/utils`)

### Phase 2: Core Cryptographic Engine & State Management
- [x] Implement `src/services/kaspa.ts` (CSPRNG keygen, Schnorr public key derivation, Bech32 address encoding)
- [x] Implement `addressToScriptPublicKey()` bytecode converter for Kaspa consensus
- [x] Implement `src/services/security.ts` (buffer zeroing `0x00`, zero-storage auditor)
- [x] Implement `src/hooks/useBurnerWallet.ts` (in-memory wallet lifecycle: INITIALIZING -> READY -> FUNDED -> SWEEPING -> WIPED)
- [x] Implement node balance polling against Kaspa public REST APIs

### Phase 3: UI Components & User Flow
- [x] `Header.tsx`: Title, OPSEC status badge, network toggle (Mainnet / Testnet-10)
- [x] `BurnerCard.tsx`: Display generated burner address, copy button, QR modal, key reveal toggle
- [x] `BalanceTracker.tsx`: Live balance display with real-time polling indicator and UTXO counter
- [x] `SweepForm.tsx`: Destination Kaspa address input, fee calculation, "Sweep All" button, and "Burn Now" emergency button
- [x] `WipeNotification.tsx`: Visual burn alert on RAM zeroing and transaction confirmation card
- [x] `GuideAndDonation.tsx`: 3-step beginner guide accordion & developer donation card with QR code
- [x] `SecurityBadge.tsx`: Cryptographic OPSEC guarantee verification checklist

### Phase 4: Transaction Construction & Auto-Sweep
- [x] Construct valid Kaspa transaction model with inputs and serialized scriptPublicKey outputs
- [x] Validate live UTXOs before initiating sweep
- [x] Broadcast transaction to Kaspa public RPC nodes with timeout and error handling
- [x] Trigger automatic memory wipe routine (`secureZero`) upon transaction broadcast
- [x] Auto-spawn fresh in-memory burner wallet after wipe

### Phase 5: Polish, Security Hardening & Production Build
- [x] Audit mobile responsiveness (320px to 4k)
- [x] Safe clipboard copy fallback (`src/utils/clipboard.ts`) for unfocused documents and non-secure contexts
- [x] Filter dead API endpoints and resolve CORS failovers
- [x] Standardize all UI copy and documentation in consistent English
- [x] Build production bundle (`npm run build`) with 0 errors

---

## Operational Commands
- **Dev Server:** `npm run dev`
- **Typecheck:** `npm run typecheck`
- **Production Build:** `npm run build`
- **Preview:** `npm run preview`
