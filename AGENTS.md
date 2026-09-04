# AGENTS.md - KasBurner Development & Agent Guidelines

## Project Overview
- **App Name:** KasBurner
- **Tagline:** Single-use Kaspa wallets that vanish after the transaction, keeping your real address private.
- **Architecture:** Client-side React 18 + Vite + TypeScript + Tailwind CSS + Official Kaspa Browser WASM (`src/wasm/kaspa/`) + Noble Cryptography (`@noble/curves`, `@noble/hashes`)
- **Security Rule #1:** Zero storage (no localStorage, cookies, or remote logging). Memory wipe after sweep.

---

## 🛑 Git & Deployment Workflow (MANDATORY RULE)

**NEVER automatically commit or push code to remote repositories without explicit user permission.**

### The Required 5-Step Git Protocol:
1. **Develop & Verify Locally:**
   - Write code, make edits, and fix bugs.
   - Run typecheck (`npm run typecheck`) and production build (`npm run build`).
   - Confirm everything passes with 0 errors.
2. **Update Changelog & Docs:**
   - On every feature or fix release, update `src/data/changelog.ts` so users see the What's New notification.
   - Keep `README.md` and `AGENTS.md` synchronized with the latest architectural changes.
3. **Review & Summarize Changes:**
   - Present a clear, concise summary of modified and newly created files to the user.
   - Show `git status` or `git diff --stat` if requested.
4. **Ask for Confirmation:**
   - Stop and ask the user: *"Would you like me to commit and push these changes now?"*
   - Suggest a clear, conventional commit message (e.g. `feat: ...`, `fix: ...`, `docs: ...`).
5. **Execute ONLY After Explicit Approval:**
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
- [x] `Header.tsx`: Title, OPSEC status badge, network toggle (Mainnet / Testnet-10), What's New notification badge
- [x] `BurnerCard.tsx`: Display generated burner address, copy button, QR modal, key reveal toggle
- [x] `BalanceTracker.tsx`: Live balance display with real-time polling indicator and UTXO counter
- [x] `SweepForm.tsx`: Destination Kaspa address input, dynamic fee calculation, "Sweep All" button, and "Burn Now" emergency button
- [x] `WipeNotification.tsx`: Visual burn alert on RAM zeroing and transaction confirmation card
- [x] `GuideAndDonation.tsx`: 3-step beginner guide accordion & developer donation card with QR code
- [x] `SecurityBadge.tsx`: Cryptographic OPSEC guarantee verification checklist
- [x] `ChangelogModal.tsx`: Interactive What's New modal showcasing version history and release improvements

### Phase 4: Transaction Construction & Auto-Sweep
- [x] Construct valid Kaspa transaction model with inputs and serialized scriptPublicKey outputs
- [x] Validate live UTXOs before initiating sweep
- [x] Official in-browser WebAssembly SDK integration (`src/wasm/kaspa/`)
- [x] Full Schnorr signature generation for Kaspa `OP_CHECKSIG` validation
- [x] Dynamic 100 sompi/gram compute mass feerate calculation
- [x] `FeeSource.ReceiverPays` 100% clean sweep without leftover dust
- [x] Broadcast transaction to Kaspa public RPC nodes with timeout and error handling
- [x] Trigger automatic memory wipe routine (`secureZero`) upon transaction broadcast
- [x] Auto-spawn fresh in-memory burner wallet after wipe

### Phase 5: Polish, Security Hardening & Production Build
- [x] Audit mobile responsiveness (320px to 4k)
- [x] Safe clipboard copy fallback (`src/utils/clipboard.ts`) for unfocused documents and non-secure contexts
- [x] Filter dead API endpoints and resolve CORS failovers
- [x] Standardize all UI copy and documentation in consistent English
- [x] Google Search Console verification tag + SEO meta tags, `robots.txt`, and `sitemap.xml`
- [x] Build production bundle (`npm run build`) with 0 errors

---

## 🚀 KasBurner V2 Roadmap & Prioritization

The following features are staged for Phase 6 (V2 Expansion):

1. **Auto-Expiry Inactivity Timer (Priority #1) [COMPLETED]:**
   - [x] Configurable countdown timer (15m, 1h, 24h).
   - [x] Automatically executes memory wipe (`secureZero`) if the tab is left unattended.
   - [x] Zero-dust safety guard halts key erasure when wallet holds active balance.
2. **Encrypted Temporary Session Log / Proof of Sweep (Priority #2):**
   - Ephemeral in-memory receipt log showing previous sweep TXIDs and timestamps before browser tab closure.
3. **Split Routing (Priority #3):**
   - Sweep funds to multiple destination addresses simultaneously with percentage distribution to disrupt on-chain clustering.
4. **Multiple Active Burners (Priority #4):**
   - Manage concurrent disposable addresses in parallel within a single browser session.

---

## Operational Commands
- **Dev Server:** `npm run dev`
- **Typecheck:** `npm run typecheck`
- **Production Build:** `npm run build`
- **Preview:** `npm run preview`
