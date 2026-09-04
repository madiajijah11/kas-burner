# Auto-Expiry Inactivity Timer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement an ephemeral in-memory Auto-Expiry Inactivity Timer with preset durations (15m, 1h, 24h) that wipes private keys from RAM on timeout if balance is zero, or halts with an alert if active funds exist.

**Architecture:** A dedicated hook (`useInactivityTimer`) tracks user interaction events with throttling, compares real-time timestamp deltas to withstand background tab hibernation, and triggers memory wiping via `useBurnerWallet`. A compact visual component (`AutoExpiryTimer`) renders crisp `JetBrains Mono` countdown numbers and duration controls inside `BurnerCard`.

**Tech Stack:** React 18, TypeScript, Tailwind CSS, Lucide React, Kaspa WASM / CSPRNG in-memory engine.

---

### File Structure & Responsibilities

- **Create:** `src/hooks/useInactivityTimer.ts` - Manages activity listener events, timestamp-delta countdown loop, zero-balance check, and expiry callback invocation.
- **Create:** `src/components/AutoExpiryTimer.tsx` - Renders the timer UI with `JetBrains Mono` numerals, duration preset pills (15m, 1h, 24h), manual reset button, and amber safety warning banner.
- **Modify:** `src/components/BurnerCard.tsx` - Mounts `AutoExpiryTimer` above the active address block with necessary props.
- **Modify:** `src/App.tsx` - Provides active balance, state checks (pausing during sweep), and wipe handler callback to `BurnerCard`.
- **Modify:** `src/data/changelog.ts` - Adds V2.0.0 release notes for the Auto-Expiry Inactivity Timer.

---

### Task 1: Create `src/hooks/useInactivityTimer.ts`

**Files:**
- Create: `src/hooks/useInactivityTimer.ts`

- [ ] **Step 1: Write the hook implementation**

Create `src/hooks/useInactivityTimer.ts`:

```typescript
import { useState, useEffect, useCallback, useRef } from 'react';

export interface UseInactivityTimerOptions {
  durationMinutes: number;
  balanceKAS: number;
  isEnabled: boolean;
  onExpire: () => void;
}

export function useInactivityTimer({
  durationMinutes,
  balanceKAS,
  isEnabled,
  onExpire,
}: UseInactivityTimerOptions) {
  const [duration, setDuration] = useState<number>(durationMinutes);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(durationMinutes * 60);
  const [isBlockedByBalance, setIsBlockedByBalance] = useState<boolean>(false);

  const lastActivityRef = useRef<number>(Date.now());
  const onExpireRef = useRef(onExpire);
  const balanceRef = useRef(balanceKAS);
  const isEnabledRef = useRef(isEnabled);

  onExpireRef.current = onExpire;
  balanceRef.current = balanceKAS;
  isEnabledRef.current = isEnabled;

  // Reset timer to full duration
  const resetTimer = useCallback(() => {
    lastActivityRef.current = Date.now();
    setRemainingSeconds(duration * 60);
    setIsBlockedByBalance(false);
  }, [duration]);

  // Update duration preset
  const changeDuration = useCallback((minutes: number) => {
    setDuration(minutes);
    lastActivityRef.current = Date.now();
    setRemainingSeconds(minutes * 60);
    setIsBlockedByBalance(false);
  }, []);

  // Track user activity (throttled to 1s)
  useEffect(() => {
    if (!isEnabled) return;

    let lastThrottle = 0;
    const handleActivity = () => {
      const now = Date.now();
      if (now - lastThrottle < 1000) return;
      lastThrottle = now;
      lastActivityRef.current = now;
      setIsBlockedByBalance(false);
    };

    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    events.forEach(event => window.addEventListener(event, handleActivity, { passive: true }));

    return () => {
      events.forEach(event => window.removeEventListener(event, handleActivity));
    };
  }, [isEnabled]);

  // Real-time countdown interval (timestamp delta comparison)
  useEffect(() => {
    if (!isEnabled) return;

    const interval = setInterval(() => {
      const elapsedSeconds = Math.floor((Date.now() - lastActivityRef.current) / 1000);
      const targetTotalSeconds = duration * 60;
      const left = Math.max(0, targetTotalSeconds - elapsedSeconds);

      setRemainingSeconds(left);

      if (left === 0) {
        if (balanceRef.current > 0) {
          setIsBlockedByBalance(true);
        } else {
          onExpireRef.current();
          lastActivityRef.current = Date.now();
          setRemainingSeconds(duration * 60);
          setIsBlockedByBalance(false);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [duration, isEnabled]);

  return {
    duration,
    remainingSeconds,
    isBlockedByBalance,
    changeDuration,
    resetTimer,
  };
}
```

- [ ] **Step 2: Run typecheck to verify hook compilation**

Run: `npm run typecheck`  
Expected: PASS (0 errors)

---

### Task 2: Create `src/components/AutoExpiryTimer.tsx`

**Files:**
- Create: `src/components/AutoExpiryTimer.tsx`

- [ ] **Step 1: Write the component implementation**

Create `src/components/AutoExpiryTimer.tsx`:

```tsx
import React from 'react';
import { Clock, RotateCcw, AlertTriangle } from 'lucide-react';

interface AutoExpiryTimerProps {
  remainingSeconds: number;
  duration: number;
  isBlockedByBalance: boolean;
  onDurationChange: (minutes: number) => void;
  onReset: () => void;
}

const PRESETS = [
  { label: '15m', minutes: 15 },
  { label: '1h', minutes: 60 },
  { label: '24h', minutes: 1440 },
];

export const AutoExpiryTimer: React.FC<AutoExpiryTimerProps> = ({
  remainingSeconds,
  duration,
  isBlockedByBalance,
  onDurationChange,
  onReset,
}) => {
  // Format seconds into HH:MM:SS or MM:SS
  const formatTime = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const pad = (num: number) => num.toString().padStart(2, '0');

    if (hours > 0) {
      return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    }
    return `${pad(minutes)}:${pad(seconds)}`;
  };

  return (
    <div className="mb-4 bg-kaspa-dark/70 border border-kaspa-border/60 rounded-xl p-3.5 space-y-2.5">
      {/* Top row: Label, Crisp Timer, Presets, and Reset */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <Clock className={`w-4 h-4 ${isBlockedByBalance ? 'text-amber-400 animate-pulse' : 'text-kaspa-cyan'}`} />
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Auto-Expiry</span>
          <span
            className={`text-sm font-mono font-bold tracking-tight ${
              isBlockedByBalance ? 'text-amber-400' : 'text-white'
            }`}
          >
            {formatTime(remainingSeconds)}
          </span>
        </div>

        <div className="flex items-center space-x-1.5">
          {PRESETS.map(preset => (
            <button
              key={preset.minutes}
              onClick={() => onDurationChange(preset.minutes)}
              className={`px-2 py-0.5 rounded text-[11px] font-mono transition-all ${
                duration === preset.minutes
                  ? 'bg-kaspa-cyan/20 border border-kaspa-cyan text-kaspa-cyan font-semibold'
                  : 'bg-kaspa-card border border-kaspa-border text-slate-400 hover:text-slate-200'
              }`}
            >
              {preset.label}
            </button>
          ))}
          <button
            onClick={onReset}
            className="p-1 text-slate-400 hover:text-kaspa-cyan rounded hover:bg-kaspa-card transition-colors"
            title="Reset Inactivity Timer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Safety Warning Banner if wipe is halted due to active balance */}
      {isBlockedByBalance && (
        <div className="flex items-start space-x-2 bg-amber-500/10 border border-amber-500/30 rounded-lg p-2.5 text-xs font-mono text-amber-300 animate-fade-in">
          <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-400" />
          <p className="leading-relaxed">
            Inactivity limit reached. Private key preserved because wallet holds active funds. Sweep funds to cold storage to clear memory.
          </p>
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

### Task 3: Integrate `AutoExpiryTimer` into `src/components/BurnerCard.tsx`

**Files:**
- Modify: `src/components/BurnerCard.tsx`

- [ ] **Step 1: Update `BurnerCardProps` and mount `AutoExpiryTimer`**

Update `src/components/BurnerCard.tsx` to accept timer props:
```tsx
interface BurnerCardProps {
  wallet: BurnerWallet | null;
  onRefresh: () => void;
  timerProps?: {
    remainingSeconds: number;
    duration: number;
    isBlockedByBalance: boolean;
    onDurationChange: (minutes: number) => void;
    onReset: () => void;
  };
}
```

Render `{timerProps && <AutoExpiryTimer {...timerProps} />}` directly below the Header section and before the QR/Address sections.

- [ ] **Step 2: Run typecheck to verify integration**

Run: `npm run typecheck`  
Expected: PASS (0 errors)

---

### Task 4: Connect Timer in `src/App.tsx`

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1: Wire `useInactivityTimer` to `App.tsx`**

In `src/App.tsx`:
1. Import `useInactivityTimer`.
2. Connect it with `balanceKAS`, `state`, and `wipeMemory`:
```tsx
const timer = useInactivityTimer({
  durationMinutes: 60,
  balanceKAS,
  isEnabled: state !== 'SWEEPING' && state !== 'INITIALIZING',
  onExpire: wipeMemory,
});
```
3. Pass `timerProps={timer}` to `<BurnerCard ... />`.

- [ ] **Step 2: Run typecheck to verify prop passing**

Run: `npm run typecheck`  
Expected: PASS (0 errors)

---

### Task 5: Update Changelog & Documentation

**Files:**
- Modify: `src/data/changelog.ts`
- Modify: `AGENTS.md`

- [ ] **Step 1: Add v2.0.0 entry to `src/data/changelog.ts`**

Add entry:
```typescript
{
  version: 'v2.0.0',
  date: 'September 2026',
  title: 'Auto-Expiry Inactivity Timer (V2 Launch)',
  badge: 'Latest',
  changes: [
    {
      type: 'security',
      text: 'Auto-Expiry Inactivity Timer: Automated memory wipe (secureZero 0x00) with selectable 15m, 1h, and 24h presets.'
    },
    {
      type: 'feature',
      text: 'Zero-Dust Safety Guard: Automatically blocks key erasure if active funds remain in the temporary burner wallet.'
    },
    {
      type: 'infra',
      text: 'Background Delta Tracking: Resilient real-time countdown calculation withstanding browser tab background hibernation.'
    }
  ]
}
```

- [ ] **Step 2: Update `AGENTS.md` execution status**

Check off Auto-Expiry Inactivity Timer (Priority #1) under Phase 6 in `AGENTS.md`.

---

### Task 6: Full Verification & Build Gate

- [ ] **Step 1: Execute typecheck**

Run: `npm run typecheck`  
Expected: Exit code 0, no errors.

- [ ] **Step 2: Execute production build**

Run: `npm run build`  
Expected: Vite build completes successfully, bundle generated in `dist/`.
