# AGENTS.md - KasBurner MVP Build Plan

## Project Overview
- **App Name:** KasBurner
- **Tagline:** Single-use Kaspa wallets that vanish after the transaction, keeping your real address private.
- **Architecture:** Client-side React + Vite + TypeScript + Tailwind CSS + `kaspa-wasm`
- **Security Rule #1:** Zero storage (no localStorage, cookies, or remote logging). Memory wipe after sweep.

---

## Build Phases

### Phase 1: Foundation Setup
- [ ] Initialize Vite + React + TypeScript template
- [ ] Configure Tailwind CSS with dark theme / hacker-clean aesthetic
- [ ] Install and configure `kaspa-wasm` (including Vite WASM loading plugin)
- [ ] Set up project structure (`src/components`, `src/hooks`, `src/services`, `src/types`)

### Phase 2: Core Cryptographic Engine & State Management
- [ ] Implement `src/services/kaspa.ts` (WASM initialization, keypair generation, address formatting)
- [ ] Implement `src/services/security.ts` (buffer zeroing, secure memory wipe)
- [ ] Implement `src/hooks/useBurnerWallet.ts` (in-memory wallet lifecycle state machine: IDLE -> READY -> FUNDED -> SWEEPING -> WIPED)
- [ ] Implement `src/hooks/useKaspaBalance.ts` (RPC connection & real-time balance polling)

### Phase 3: UI Components & User Flow
- [ ] `Header.tsx`: Title, OPSEC status badge, network indicator (Mainnet/Testnet toggle)
- [ ] `BurnerCard.tsx`: Display generated burner address with copy button & QR (optional/simple)
- [ ] `BalanceTracker.tsx`: Live balance display with auto-refresh animation
- [ ] `SweepForm.tsx`: Destination Kaspa address input, fee calculation, and "Sweep All Funds" button
- [ ] `WipeModal.tsx` / Burn button: Immediate emergency wipe & reset button
- [ ] `SecurityBadge.tsx`: Verification list showing zero storage & client-side guarantee

### Phase 4: Transaction Construction & Auto-Sweep
- [ ] Build Kaspa transaction with UTXO selection using `kaspa-wasm`
- [ ] Sign transaction with in-memory private key
- [ ] Broadcast transaction to Kaspa RPC node
- [ ] On broadcast confirmation, trigger automatic memory wipe routine and transition to clean state

### Phase 5: Polish, Responsive Design & Production Build
- [ ] Audit mobile responsiveness (320px to 4k)
- [ ] Verify zero traces in `localStorage`, `sessionStorage`, `cookies`, or console logs
- [ ] Configure strict Content Security Policy headers
- [ ] Build production bundle (`npm run build`) and verify static output

---

## Operational Commands
- **Dev Server:** `npm run dev`
- **Typecheck:** `npm run typecheck` (or `npx tsc --noEmit`)
- **Build:** `npm run build`
