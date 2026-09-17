# Ephemeral Session Receipt Log Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement an in-memory ephemeral session receipt log displaying proof-of-sweep transaction records (TXID, amount, fee, timestamp, destination, and network-aware Explorer links) without violating zero-storage OPSEC rules.

**Architecture:** Extend `useBurnerWallet` state with volatile `sessionLogs: SweepResult[]`. Render a dedicated presentation component (`SessionReceiptLog`) in `App.tsx` featuring `JetBrains Mono` numeric formatting, 1-click TXID copying, direct Kaspa Explorer routing for Mainnet/Testnet, and manual RAM purge capability.

**Tech Stack:** React 18, TypeScript, Tailwind CSS, Lucide React, Kaspa blockDAG explorer integrations.

---

### File Structure & Responsibilities

- **Modify:** `src/types/wallet.ts` - Extend `SweepResult` interface with `id` and `network`.
- **Modify:** `src/hooks/useBurnerWallet.ts` - Maintain `sessionLogs` state in RAM, append on successful sweep, and expose `clearSessionLogs`.
- **Create:** `src/components/SessionReceiptLog.tsx` - Renders the receipt list card, copy TXID button, Kaspa Explorer link, empty state, and clear button.
- **Modify:** `src/App.tsx` - Mounts `SessionReceiptLog` in the main dashboard grid.
- **Modify:** `src/data/changelog.ts` & `AGENTS.md` & `README.md` - Document the feature and check off Priority #2 in the roadmap.

---

### Task 1: Update `src/types/wallet.ts` & `src/hooks/useBurnerWallet.ts`

**Files:**
- Modify: `src/types/wallet.ts`
- Modify: `src/hooks/useBurnerWallet.ts`

- [ ] **Step 1: Extend `SweepResult` in `src/types/wallet.ts`**

```typescript
export interface SweepResult {
  id: string;
  txId: string;
  amountSweptKAS: number;
  feeKAS: number;
  destination: string;
  network: NetworkType;
  timestamp: number;
}
```

- [ ] **Step 2: Add `sessionLogs` state & `clearSessionLogs` to `src/hooks/useBurnerWallet.ts`**

In `src/hooks/useBurnerWallet.ts`:
1. Add state:
```typescript
const [sessionLogs, setSessionLogs] = useState<SweepResult[]>([]);
```
2. In `sweepFunds`, construct the updated `sweepRecord` and append to `sessionLogs`:
```typescript
const sweepRecord: SweepResult = {
  id: result.txId,
  txId: result.txId,
  amountSweptKAS: result.amountSwept,
  feeKAS: result.fee,
  destination: destinationAddress,
  network,
  timestamp: Date.now()
};

setSessionLogs(prev => [sweepRecord, ...prev]);
setLastSweep(sweepRecord);
```
3. Add `clearSessionLogs` callback:
```typescript
const clearSessionLogs = useCallback(() => {
  setSessionLogs([]);
}, []);
```
4. Return `sessionLogs` and `clearSessionLogs` from `useBurnerWallet`.

- [ ] **Step 3: Run typecheck to verify compilation**

Run: `npm run typecheck`  
Expected: PASS (0 errors)

---

### Task 2: Create `src/components/SessionReceiptLog.tsx`

**Files:**
- Create: `src/components/SessionReceiptLog.tsx`

- [ ] **Step 1: Write `SessionReceiptLog` component**

```tsx
import React, { useState } from 'react';
import { Receipt, ExternalLink, Copy, Check, Trash2, ShieldCheck } from 'lucide-react';
import { SweepResult, NetworkType } from '../types/wallet';
import { safeCopyToClipboard } from '../utils/clipboard';

interface SessionReceiptLogProps {
  sessionLogs: SweepResult[];
  onClearLogs: () => void;
}

export const SessionReceiptLog: React.FC<SessionReceiptLogProps> = ({
  sessionLogs,
  onClearLogs,
}) => {
  const [copiedTxId, setCopiedTxId] = useState<string | null>(null);

  const copyTxId = async (txId: string) => {
    const success = await safeCopyToClipboard(txId);
    if (success) {
      setCopiedTxId(txId);
      setTimeout(() => setCopiedTxId(null), 2000);
    }
  };

  const getExplorerUrl = (txId: string, network: NetworkType): string => {
    switch (network) {
      case 'mainnet':
        return `https://explorer.kaspa.org/txs/${txId}`;
      case 'testnet-10':
        return `https://explorer-tn10.kaspa.org/txs/${txId}`;
      case 'testnet-11':
        return `https://explorer-tn11.kaspa.org/txs/${txId}`;
      default:
        return `https://explorer.kaspa.org/txs/${txId}`;
    }
  };

  return (
    <div className="bg-kaspa-card border border-kaspa-border rounded-2xl p-6 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-kaspa-border/60">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 bg-kaspa-cyan/10 border border-kaspa-cyan/30 rounded-xl text-kaspa-cyan">
            <Receipt className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-mono uppercase tracking-wider text-white font-semibold">
                Proof of Sweep & Receipts
              </h3>
              <span className="px-2 py-0.5 text-[10px] font-mono rounded-full bg-kaspa-dark border border-kaspa-border text-slate-400">
                {sessionLogs.length} {sessionLogs.length === 1 ? 'Record' : 'Records'}
              </span>
            </div>
            <p className="text-[11px] font-mono text-slate-400">
              Ephemeral in-memory activity • Discarded on tab close
            </p>
          </div>
        </div>

        {sessionLogs.length > 0 && (
          <button
            type="button"
            onClick={onClearLogs}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-kaspa-dark hover:bg-red-950/40 text-slate-400 hover:text-red-300 border border-kaspa-border hover:border-red-500/40 rounded-lg text-xs font-mono transition-all"
            title="Clear all session receipts from RAM"
            aria-label="Clear all session receipts from RAM"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Log</span>
          </button>
        )}
      </div>

      {/* Receipts List or Empty State */}
      {sessionLogs.length === 0 ? (
        <div className="text-center py-6 px-4 bg-kaspa-dark/50 border border-kaspa-border/50 rounded-xl space-y-1.5">
          <p className="text-xs font-mono text-slate-400">
            No sweep transactions recorded in this session yet.
          </p>
          <p className="text-[11px] font-mono text-slate-500">
            Receipts will automatically appear here in volatile RAM after each successful sweep.
          </p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
          {sessionLogs.map((log, index) => (
            <div
              key={log.id || log.txId || index}
              className="bg-kaspa-dark/80 border border-kaspa-border/70 rounded-xl p-4 space-y-2.5 group hover:border-kaspa-cyan/40 transition-colors"
            >
              {/* Top Row: Amount, Fee, Status Badges & Time */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-mono font-bold text-emerald-400">
                    +{log.amountSweptKAS.toFixed(6)} KAS
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    (Fee: ~{log.feeKAS.toFixed(6)} KAS)
                  </span>
                </div>

                <div className="flex items-center space-x-1.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Wiped (0x00)</span>
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-kaspa-card border border-kaspa-border text-slate-300">
                    {log.network}
                  </span>
                  <span className="text-[11px] font-mono text-slate-500">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>

              {/* Destination Address */}
              <div className="text-xs font-mono">
                <span className="text-slate-500 mr-1.5">To:</span>
                <code className="text-slate-300 break-all select-all">{log.destination}</code>
              </div>

              {/* TXID & Actions */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1.5 border-t border-kaspa-border/40 text-xs font-mono">
                <div className="flex items-center space-x-1 text-slate-400 min-w-0 flex-1">
                  <span className="text-slate-500">TX:</span>
                  <code className="text-kaspa-cyan truncate select-all">{log.txId}</code>
                </div>

                <div className="flex items-center space-x-2 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => copyTxId(log.txId)}
                    className="flex items-center space-x-1 px-2.5 py-1 bg-kaspa-card hover:bg-kaspa-cyan/20 text-slate-300 hover:text-kaspa-cyan border border-kaspa-border hover:border-kaspa-cyan/50 rounded-lg text-[11px] font-mono transition-all"
                  >
                    {copiedTxId === log.txId ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy TXID</span>
                      </>
                    )}
                  </button>

                  <a
                    href={getExplorerUrl(log.txId, log.network)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 px-2.5 py-1 bg-kaspa-card hover:bg-kaspa-cyan/20 text-slate-300 hover:text-kaspa-cyan border border-kaspa-border hover:border-kaspa-cyan/50 rounded-lg text-[11px] font-mono transition-all"
                  >
                    <span>Explorer</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
```

- [ ] **Step 2: Run typecheck to verify component compilation**

Run: `npm run typecheck`  
Expected: PASS (0 errors)

---

### Task 3: Integrate `SessionReceiptLog` in `src/App.tsx`

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1: Wire `SessionReceiptLog` into `App.tsx`**

In `src/App.tsx`:
1. Import `SessionReceiptLog` from `./components/SessionReceiptLog`.
2. Destructure `sessionLogs` and `clearSessionLogs` from `useBurnerWallet`.
3. Render `<SessionReceiptLog sessionLogs={sessionLogs} onClearLogs={clearSessionLogs} />` below the Balance & Sweep grid.

- [ ] **Step 2: Run typecheck to verify prop passing**

Run: `npm run typecheck`  
Expected: PASS (0 errors)

---

### Task 4: Update Documentation, Changelog & Roadmap

**Files:**
- Modify: `src/data/changelog.ts`
- Modify: `AGENTS.md`
- Modify: `README.md`

- [ ] **Step 1: Add v2.0.0 changelog entry item for Ephemeral Proof of Sweep**
- [ ] **Step 2: Mark Priority #2 as [COMPLETED] in `AGENTS.md` and `README.md`**

---

### Task 5: Full Verification & Build Gate

- [ ] **Step 1: Run `npm run typecheck`**
- [ ] **Step 2: Run `npm run build`**
