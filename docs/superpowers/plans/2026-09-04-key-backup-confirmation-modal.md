# Key Backup & Wipe Confirmation Modal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement an explicit confirmation dialog before Sweep All and Burn Now that requires users to acknowledge key deletion or copy their private key to prevent accidental loss of funds.

**Architecture:** A standalone modal component (`KeyBackupModal`) renders with a dark backdrop, displays raw private keys using `JetBrains Mono`, provides 1-click clipboard copying, and disables the confirmation action until the user copies the key or checks an explicit acknowledgment checkbox. `SweepForm` intercepts form submission and emergency burn triggers to show this modal before proceeding.

**Tech Stack:** React 18, TypeScript, Tailwind CSS, Lucide React, Kaspa zero-storage architecture.

---

### File Structure & Responsibilities

- **Create:** `src/components/KeyBackupModal.tsx` - Modal dialog rendering asset loss warning, private key display in monospace, copy button, confirmation checkbox, and locked confirmation button.
- **Modify:** `src/components/SweepForm.tsx` - Intercepts Sweep and Burn clicks to trigger `KeyBackupModal`, passing wallet, balance, and destination.
- **Modify:** `src/App.tsx` - Passes `wallet` to `SweepForm`.
- **Modify:** `src/data/changelog.ts` - Documents the Key Backup Guard feature.

---

### Task 1: Create `src/components/KeyBackupModal.tsx`

**Files:**
- Create: `src/components/KeyBackupModal.tsx`

- [ ] **Step 1: Write `KeyBackupModal` component**

```tsx
import React, { useState } from 'react';
import { Copy, Check, AlertTriangle, Flame, ShieldAlert, X } from 'lucide-react';
import { BurnerWallet } from '../types/wallet';
import { safeCopyToClipboard } from '../utils/clipboard';

export interface KeyBackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  actionType: 'sweep' | 'burn';
  wallet: BurnerWallet | null;
  balanceKAS: number;
  destinationAddress?: string;
}

export const KeyBackupModal: React.FC<KeyBackupModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  actionType,
  wallet,
  balanceKAS,
  destinationAddress,
}) => {
  const [hasCopied, setHasCopied] = useState(false);
  const [isAcknowledged, setIsAcknowledged] = useState(false);

  if (!isOpen || !wallet) return null;

  const handleCopy = async () => {
    const success = await safeCopyToClipboard(wallet.privateKeyHex);
    if (success) {
      setHasCopied(true);
      setIsAcknowledged(true);
    }
  };

  const isUnlockEnabled = hasCopied || isAcknowledged;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-kaspa-card border border-kaspa-border rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 relative overflow-hidden">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-slate-400 hover:text-white rounded-lg hover:bg-kaspa-dark transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3">
          {actionType === 'burn' ? (
            <div className="p-2.5 bg-red-950/40 border border-red-500/40 rounded-xl">
              <Flame className="w-6 h-6 text-red-400 animate-pulse" />
            </div>
          ) : (
            <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl">
              <ShieldAlert className="w-6 h-6 text-amber-400" />
            </div>
          )}
          <div>
            <h3 className="text-base font-mono font-bold text-white">
              {actionType === 'burn' ? 'Emergency Burn Confirmation' : 'Backup Private Key Before Sweep'}
            </h3>
            <p className="text-xs font-mono text-slate-400">
              {actionType === 'burn'
                ? 'RAM will be zeroed (0x00) immediately. Key cannot be recovered.'
                : 'Permanent key wipe occurs immediately upon transaction broadcast.'}
            </p>
          </div>
        </div>

        {/* Balance Warning if funds exist */}
        {balanceKAS > 0 && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-xs font-mono text-amber-300 flex items-start space-x-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <span className="font-bold">Active Balance: {balanceKAS.toFixed(6)} KAS.</span>{' '}
              {actionType === 'burn'
                ? 'Burning this wallet now will permanently vaporize these funds without recovery.'
                : 'If network broadcast encounters issues or the destination address is invalid, you will need this private key to recover your balance.'}
            </div>
          </div>
        )}

        {/* Destination Recap for Sweep */}
        {actionType === 'sweep' && destinationAddress && (
          <div className="bg-kaspa-dark/80 border border-kaspa-border/70 rounded-xl p-3 text-xs font-mono">
            <span className="text-slate-400 block mb-1">Destination Cold Wallet:</span>
            <code className="text-kaspa-cyan break-all select-all">{destinationAddress}</code>
          </div>
        )}

        {/* Private Key Display & 1-Click Copy */}
        <div className="space-y-2">
          <label className="text-xs font-mono text-slate-400">
            Ephemeral Private Key (Hex):
          </label>
          <div className="bg-kaspa-dark border border-kaspa-border rounded-xl p-3 flex flex-col gap-2">
            <code className="text-xs font-mono text-amber-300 break-all select-all">
              {wallet.privateKeyHex}
            </code>
            <button
              type="button"
              onClick={handleCopy}
              className={`flex items-center justify-center space-x-2 py-2 px-3 rounded-lg text-xs font-mono transition-all ${
                hasCopied
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold'
                  : 'bg-kaspa-card hover:bg-kaspa-cyan/20 text-slate-200 hover:text-kaspa-cyan border border-kaspa-border'
              }`}
            >
              {hasCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Private Key Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Private Key (Recommended)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Checkbox Acknowledgment */}
        <label className="flex items-start space-x-2.5 cursor-pointer pt-1">
          <input
            type="checkbox"
            checked={isAcknowledged}
            onChange={(e) => setIsAcknowledged(e.target.checked)}
            className="mt-0.5 rounded border-kaspa-border bg-kaspa-dark text-kaspa-cyan focus:ring-0 focus:ring-offset-0"
          />
          <span className="text-xs font-mono text-slate-300 select-none leading-relaxed">
            I understand that this private key will be permanently purged from memory (0x00) and cannot be recovered.
          </span>
        </label>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-4 bg-kaspa-dark hover:bg-kaspa-card text-slate-400 hover:text-white border border-kaspa-border rounded-xl font-mono text-xs transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={!isUnlockEnabled}
            className={`py-2.5 px-4 rounded-xl font-mono text-xs font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed ${
              actionType === 'burn'
                ? 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-950/50'
                : 'bg-gradient-to-r from-kaspa-cyan to-kaspa-glow text-black shadow-lg shadow-kaspa-cyan/20'
            }`}
          >
            {actionType === 'burn' ? 'Confirm Burn (Wipe RAM)' : 'Confirm & Sweep Funds'}
          </button>
        </div>
      </div>
    </div>
  );
};
```

- [ ] **Step 2: Verify typecheck**

Run: `npm run typecheck`  
Expected: PASS (0 errors)

---

### Task 2: Integrate `KeyBackupModal` into `src/components/SweepForm.tsx`

**Files:**
- Modify: `src/components/SweepForm.tsx`

- [ ] **Step 1: Add `wallet` to `SweepFormProps` and wire modal**

1. Update `SweepFormProps` in `src/components/SweepForm.tsx`:
```tsx
interface SweepFormProps {
  wallet: BurnerWallet | null;
  balanceKAS: number;
  network: NetworkType;
  onSweep: (destination: string) => Promise<void>;
  onEmergencyBurn: () => void;
  isSweeping: boolean;
}
```
2. Add state for modal:
```tsx
const [isModalOpen, setIsModalOpen] = useState(false);
const [modalAction, setModalAction] = useState<'sweep' | 'burn'>('sweep');
```
3. In `handleSubmit`, instead of directly calling `await onSweep(cleanDest)`, open the modal:
```tsx
setModalAction('sweep');
setIsModalOpen(true);
```
4. In `onEmergencyBurn` button click, instead of calling `onEmergencyBurn` directly:
```tsx
onClick={() => {
  setModalAction('burn');
  setIsModalOpen(true);
}}
```
5. In modal `onConfirm`:
```tsx
const handleModalConfirm = async () => {
  setIsModalOpen(false);
  if (modalAction === 'sweep') {
    try {
      await onSweep(destination.trim());
      setDestination('');
    } catch (err: any) {
      setCustomError(err.message || 'Sweep failed.');
    }
  } else {
    onEmergencyBurn();
  }
};
```
6. Render `<KeyBackupModal ... />` inside the component return tree.

- [ ] **Step 2: Verify typecheck**

Run: `npm run typecheck`  
Expected: Will report missing `wallet` prop in `App.tsx` (resolved in Task 3).

---

### Task 3: Update `src/App.tsx`

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1: Pass `wallet={wallet}` to `<SweepForm ... />`**

In `src/App.tsx`:
```tsx
<SweepForm
  wallet={wallet}
  balanceKAS={balanceKAS}
  network={network}
  onSweep={handleSweep}
  onEmergencyBurn={wipeMemory}
  isSweeping={state === 'SWEEPING'}
/>
```

- [ ] **Step 2: Verify typecheck**

Run: `npm run typecheck`  
Expected: PASS (0 errors)

---

### Task 4: Update Changelog & Verification

**Files:**
- Modify: `src/data/changelog.ts`

- [ ] **Step 1: Add changelog entry for Key Backup & Wipe Confirmation Guard**
- [ ] **Step 2: Run `npm run typecheck` and `npm run build`**
