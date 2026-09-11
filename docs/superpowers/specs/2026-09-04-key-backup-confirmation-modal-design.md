# Design Specification: Key Backup & Wipe Confirmation Guard

**Date:** 2026-09-04  
**Feature:** Key Backup & Wipe Confirmation Modal Guard  
**Status:** Approved by User  

---

## 1. Overview

KasBurner enforces strict zero-storage operational security by holding private keys exclusively in browser RAM and overwriting them with `0x00` (`secureZero`) upon transaction sweep or manual burn.

To prevent irreversible asset loss caused by premature memory zeroing, misdirected destination addresses, or unintended button clicks, this feature introduces an explicit confirmation guard:
Before executing **Sweep All & Wipe Memory** or **Burn Now (Wipe)**, a confirmation modal interrupts the action, presents the raw private key with a 1-click copy button, and holds the final execution button in a disabled state until the user copies the key or checks an explicit acknowledgment checkbox.

---

## 2. Architectural Design

### 2.1 Component: `src/components/KeyBackupModal.tsx`

A standalone modal component rendered with a backdrop that traps focus and requires deliberate user interaction.

- **Props Interface:**
  ```typescript
  interface KeyBackupModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    actionType: 'sweep' | 'burn';
    wallet: BurnerWallet | null;
    balanceKAS: number;
    destinationAddress?: string;
  }
  ```

- **State:**
  - `hasCopied`: boolean (true once the user clicks "Copy Private Key")
  - `isAcknowledged`: boolean (checkbox confirmation or auto-checked upon copying)

- **Unlocking Rule:**
  - The confirm button is disabled if `!hasCopied && !isAcknowledged`.
  - Once either `hasCopied` or `isAcknowledged` is true, the confirm button unlocks.

### 2.2 Integration in `src/components/SweepForm.tsx`

- `SweepForm` receives `wallet: BurnerWallet | null` as an additional prop.
- Form submission intercepts the direct `onSweep` call:
  - Validates destination address and balance.
  - If valid, sets modal state (`modalAction = 'sweep'`, `isModalOpen = true`).
- Clicking "Burn Now (Wipe)" intercepts the direct `onEmergencyBurn` call:
  - Sets modal state (`modalAction = 'burn'`, `isModalOpen = true`).
- When the modal's `onConfirm` is triggered:
  - Closes the modal.
  - Calls `onSweep(destination)` or `onEmergencyBurn()` respectively.

---

## 3. UI/UX Specifications

- **Backdrop:** `fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4`
- **Dialog Box:** `bg-kaspa-card border border-kaspa-border rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4`
- **Typography:**
  - Header: `font-mono uppercase tracking-wider text-slate-200 font-bold`
  - Private key: `font-mono text-xs text-amber-300 break-all select-all` using `JetBrains Mono`
- **Tone & Theming:**
  - For `actionType === 'burn'`: Red accent header with `Flame` icon, warning that active balance will be permanently vaporized.
  - For `actionType === 'sweep'`: Amber/cyan header with `ShieldAlert` icon, advising key backup before consensus broadcast.
- **Copy Button:** Uses `safeCopyToClipboard` with clear visual transition (Check icon + Emerald text).

---

## 4. OPSEC & Zero-Storage Compliance

- Modal state is 100% ephemeral in React memory.
- No interaction status is written to disk, cookies, or storage.
- Private key displayed in the modal is read directly from `wallet.privateKeyHex` and destroyed along with the wallet upon wipe.

---

## 5. Verification Plan

1. **Static Typecheck:** Run `npm run typecheck` with 0 errors.
2. **Production Build:** Run `npm run build` with 0 errors.
3. **Behavioral Testing:**
   - Verify modal opens on "Sweep All" button click with valid address and balance.
   - Verify confirm button is initially disabled.
   - Verify clicking "Copy Private Key" unlocks the confirm button.
   - Verify checking the acknowledgment box unlocks the confirm button.
   - Verify confirming "Sweep" executes the sweep transaction.
   - Verify confirming "Burn" executes immediate zeroing and generates a fresh wallet.
   - Verify clicking "Cancel" closes the modal and preserves the key without wiping.
