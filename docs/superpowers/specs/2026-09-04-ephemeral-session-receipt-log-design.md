# Design Specification: Ephemeral Session Receipt Log / Proof of Sweep (KasBurner V2 Phase 2)

**Date:** 2026-09-04  
**Feature:** Ephemeral Temporary Session Log / Proof of Sweep  
**Priority:** V2 Roadmap Priority #2  
**Status:** Approved by User  

---

## 1. Overview

KasBurner operates under a strict Zero-Storage OPSEC model. To give users verifiable proof of transactions (TXID, swept KAS amount, network fees, timestamp, destination address, and 1-click Kaspa Explorer link) without compromising privacy, this feature provides an in-memory ephemeral session receipt log.

Key characteristics:
1. **Volatile RAM Only:** Receipts exist strictly in React memory state during the active browser session and self-destruct upon tab closure or page refresh.
2. **Comprehensive Receipts:** Each sweep transaction creates a structured receipt entry with 1-click TXID copy and network-aware Kaspa Explorer links.
3. **Manual Purge Control:** A "Clear Log" button allows users to wipe the session receipts array from RAM at any moment.

---

## 2. Architectural Design

### 2.1 Extended Data Model (`src/types/wallet.ts`)

Extend the `SweepResult` interface:
```typescript
export interface SweepResult {
  id: string; // Unique ID (txId)
  txId: string;
  amountSweptKAS: number;
  feeKAS: number;
  destination: string;
  network: NetworkType;
  timestamp: number;
}
```

### 2.2 State Management (`src/hooks/useBurnerWallet.ts`)

- **State:**
  `const [sessionLogs, setSessionLogs] = useState<SweepResult[]>([]);`
- **Appending Logs:**
  Upon successful broadcast in `sweepFunds`:
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
- **Manual Clear Action:**
  ```typescript
  const clearSessionLogs = useCallback(() => {
    setSessionLogs([]);
    setLastSweep(null);
  }, []);
  ```
- **Export Hook Values:** Expose `sessionLogs` and `clearSessionLogs` in the return object of `useBurnerWallet`.

---

## 3. UI Component Design

### 3.1 Component: `SessionReceiptLog.tsx` (`src/components/SessionReceiptLog.tsx`)

A standalone dashboard card rendered below the Sweep & Balance grid in `App.tsx`.

- **Props Interface:**
  ```typescript
  interface SessionReceiptLogProps {
    sessionLogs: SweepResult[];
    onClearLogs: () => void;
  }
  ```

- **Visual Elements:**
  - **Header:** `Receipt` icon with title *"Session Proof of Sweep & Receipts"*, badge counter of total sweeps, and *"Clear Log"* (`Trash2` icon) button.
  - **Receipt Item Card:**
    - Top row: Swept amount in `JetBrains Mono` (`font-mono text-emerald-400 font-bold`), network fee, `Wiped (0x00)` status pill, `Mainnet` / `Testnet-10` badge, and localized timestamp.
    - Destination row: Cold wallet address formatted with `font-mono text-xs text-slate-300 break-all`.
    - Action row: TXID display with **Copy TXID** button and **View in Explorer** button pointing to the correct network URL:
      - Mainnet: `https://explorer.kaspa.org/txs/{txId}`
      - Testnet-10: `https://explorer-tn10.kaspa.org/txs/{txId}`
      - Testnet-11: `https://explorer-tn11.kaspa.org/txs/{txId}`
  - **Empty State:**
    - Informative empty placeholder when `sessionLogs.length === 0`:
      *"No sweep transactions recorded in this session yet. Volatile receipts will appear here in RAM after each successful sweep."*

---

## 4. OPSEC & Zero-Storage Guarantees

- **No Disk Persistence:** No `localStorage`, `sessionStorage`, cookies, or remote logging.
- **Key Isolation:** Private keys are never stored in `sessionLogs`. Key byte buffers are zeroed (`secureZero` 0x00) immediately on broadcast.

---

## 5. Verification Plan

1. **Static Typecheck:** Run `npm run typecheck` with 0 errors.
2. **Production Build:** Run `npm run build` with 0 errors.
3. **Behavioral Testing:**
   - Execute sweep: verify receipt appears at the top of the session list with exact amounts and TXID.
   - Verify 1-click Copy TXID works and provides visual feedback.
   - Verify 1-click Explorer link opens the correct network Explorer tab.
   - Verify clicking "Clear Log" empties the session list in RAM.
