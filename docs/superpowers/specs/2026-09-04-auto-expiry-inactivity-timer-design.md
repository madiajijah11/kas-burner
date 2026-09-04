# Design Specification: Auto-Expiry Inactivity Timer (KasBurner V2 Phase 1)

**Date:** 2026-09-04  
**Feature:** Auto-Expiry Inactivity Timer  
**Priority:** V2 Roadmap Priority #1  
**Status:** Approved by User  

---

## 1. Overview

KasBurner generates disposable, single-use Kaspa keypairs in temporary browser RAM. To strengthen OPSEC when a browser tab is left unattended, the Auto-Expiry Inactivity Timer counts down from a user-selected duration (15m, 1h, 24h). 

When the countdown reaches zero:
1. If the wallet balance is zero, the system executes memory wipe (`secureZero` 0x00 fill) and provisions a fresh keypair.
2. If the wallet holds an active balance (> 0 KAS), the system halts the wipe and displays an amber warning banner instructing the user to sweep funds to cold storage.

---

## 2. Architectural Design

### 2.1 Hook: `useInactivityTimer` (`src/hooks/useInactivityTimer.ts`)

A standalone React hook responsible for user activity detection, countdown timing, and expiry triggers.

- **Parameters:**
  - `durationMinutes`: number (preset duration in minutes, default: 60)
  - `balanceKAS`: number (active burner wallet balance)
  - `isEnabled`: boolean (paused when state is `SWEEPING` or `INITIALIZING`)
  - `onExpire`: () => void (callback invoked on timeout when balance is 0)

- **State:**
  - `remainingSeconds`: number (time remaining until timeout)
  - `isBlockedByBalance`: boolean (true when timer hit zero but balance > 0)
  - `lastActivityTimestamp`: number (Unix epoch ms of last user action)

- **Activity Tracking:**
  - Listens to window events: `mousemove`, `keydown`, `click`, `scroll`, `touchstart`.
  - Throttled to at most once per second to preserve client performance.
  - On user activity: resets `lastActivityTimestamp` to `Date.now()`, resets `remainingSeconds` to full duration, and resets `isBlockedByBalance` to `false`.

- **Background Throttling Tolerance:**
  - Uses timestamp delta (`Date.now() - lastActivityTimestamp`) inside a 1-second interval loop.
  - Ensures accurate countdown even if the browser throttles `setInterval` during background tab execution.

- **Zero-Storage Compliance:**
  - All state stays purely in browser RAM. No `localStorage`, `sessionStorage`, or cookies.

---

## 3. UI Component Design

### 3.1 Component: `AutoExpiryTimer` (`src/components/AutoExpiryTimer.tsx`)

A compact widget rendered inside `BurnerCard.tsx` above the active address block.

- **Typography & Layout:**
  - Countdown display rendered using `JetBrains Mono` (`font-mono`) with format `HH:MM:SS` or `MM:SS`.
  - Icon: `Clock` from `lucide-react` with status colors:
    - `text-kaspa-cyan`: Normal active countdown.
    - `text-amber-400`: Blocked by active balance.
- **Duration Preset Selector:**
  - Three duration buttons: `15m`, `1h`, `24h`.
  - Active button highlighted with cyan glow border (`bg-kaspa-cyan/20 border-kaspa-cyan text-kaspa-cyan`).
- **Manual Reset Button:**
  - Reset icon button to restore the countdown to full duration immediately.
- **Safety Warning Banner:**
  - If `isBlockedByBalance` is true, shows an amber card:
    *"Inactivity timeout reached. Private key preserved because wallet contains active KAS. Sweep funds to cold storage to clear memory."*

### 3.2 Integration in `BurnerCard.tsx` & `App.tsx`

- `BurnerCard` receives timer props or coordinates with `useInactivityTimer`.
- `App.tsx` connects `balanceKAS`, `state`, and the wipe trigger (`wipeMemory` / `generateNewBurner`).
- Timer pauses automatically while a sweep transaction is being constructed, signed, and broadcast.

---

## 4. Edge Cases & Safety Protocols

1. **Active Balance at Expiry:**
   - Strict safety check: `balanceKAS > 0` prevents key deletion.
   - Prevents unrecoverable loss of user funds if the tab was abandoned.
2. **In-Flight Sweep Protection:**
   - `isEnabled = false` whenever `state === 'SWEEPING'`.
   - Protects against race conditions during Schnorr signing and RPC broadcast.
3. **Tab Inactivity in Background:**
   - Real-time timestamp comparison prevents timer freezes during background tab hibernation.
4. **Manual Burn or Refresh:**
   - If the user clicks "Burn Now" or "Generate Fresh Keypair", the timer resets automatically for the new keypair.

---

## 5. Verification Plan

1. **Automated Checks:**
   - Run `npm run typecheck` to verify TypeScript types with zero errors.
   - Run `npm run build` to verify production asset compilation.
2. **Behavioral Testing:**
   - Verify countdown decrements every second in crisp JetBrains Mono.
   - Verify switching presets (15m, 1h, 24h) updates the timer.
   - Verify typing, clicking, or scrolling resets the countdown.
   - Verify balance = 0 triggers `secureZero` and spawns a fresh wallet upon reaching 0.
   - Verify balance > 0 stops countdown at 00:00:00 and displays amber warning without wiping keys.
