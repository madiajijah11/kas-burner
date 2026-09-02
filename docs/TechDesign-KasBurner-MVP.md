# Technical Design Document: KasBurner MVP

**Author:** Genzo & Antigravity  
**Date:** 2026-09-02  
**Status:** Approved  
**Version:** 1.0 (MVP)  

---

## 1. Recommended Architecture & Approach

### Architecture Pattern: Static Jamstack (Client-Only)
- **Frontend Framework:** React (via Vite) + TypeScript
- **Styling:** Tailwind CSS (Dark theme / hacker-clean)
- **Cryptographic Engine:** `kaspa-wasm` (official Kaspa WebAssembly SDK)
- **Networking:** Direct browser WebSocket / gRPC-web / REST connection to public Kaspa RPC nodes (e.g. resolver / public Kaspa nodes)
- **Persistence:** **NONE** (Strict zero-storage policy: no localStorage, no cookies, no database)
- **Hosting / Deployment:** Cloudflare Pages / Vercel / GitHub Pages (Static hosting, $0 cost)

### Why this approach wins for OPSEC:
1. **Zero Server Vulnerability:** No server code exists that could log, intercept, or leak keys.
2. **Client-Side WASM:** Key generation and transaction signing happen strictly within the user's browser sandbox using Rust-compiled WebAssembly.
3. **Auditable & Verifiable:** The entire codebase can be inspected on GitHub and verified reproducible.

---

## 2. Alternatives Considered

| Option | Pros | Cons | Decision |
|---|---|---|---|
| **Vite + React + TS (Recommended)** | Fast, full WASM support, robust state machine, wide ecosystem | Requires bundler setup | **Selected** |
| **Next.js (App Router)** | Full-stack capability, SSR | Overkill; server actions/API routes introduce OPSEC attack surface | Rejected |
| **Vanilla HTML + JS** | Zero build step | Harder state management, complex WASM bindings | Rejected |

---

## 3. Project Structure

```text
kas-burner/
├── docs/
│   ├── PRD-KasBurner-MVP.md
│   └── TechDesign-KasBurner-MVP.md
├── public/
│   ├── favicon.ico
│   └── kaspa-wasm/            # WASM binaries
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── Header.tsx         # Title, status indicator, network switcher
│   │   ├── BurnerCard.tsx     # Display generated address, copy button
│   │   ├── BalanceTracker.tsx # Live balance polling/WebSocket listener
│   │   ├── SweepForm.tsx      # Destination input, fee calculation, Sweep button
│   │   ├── WipeModal.tsx      # Confirmation and visual wipe effect
│   │   └── SecurityBadge.tsx  # OPSEC checklist & zero-storage proof
│   ├── hooks/
│   │   ├── useKaspaWasm.ts    # Initializer and binding for WASM SDK
│   │   ├── useBurnerWallet.ts # In-memory key lifecycle & wipe handlers
│   │   └── useKaspaBalance.ts # Node polling / RPC connection hook
│   ├── services/
│   │   ├── kaspa.ts           # Keygen, address encoding, tx construction, broadcast
│   │   └── security.ts        # Memory overwrite routines (zero-fill buffers)
│   ├── types/
│   │   └── wallet.ts          # State definitions (IDLE, READY, FUNDED, SWEEPING, WIPED)
│   ├── App.tsx                # Main state machine container
│   ├── main.tsx
│   └── index.css              # Tailwind base & dark theme config
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts             # WASM plugin and worker configuration
└── README.md
```

---

## 4. State Machine & Security Flow

```text
[ Page Load ]
      │
      ▼
[ Initialize WASM ] ──▶ [ Generate In-Memory Keypair (Private Key + Public Address) ]
                                      │
                                      ▼
                        [ Display Burner Address ]
                                      │
                        [ Poll Kaspa Node Balance ]
                                      │
                    ┌─────────────────┴─────────────────┐
                    ▼                                   ▼
             [ Balance = 0 ]                    [ Balance > 0 ]
                    │                                   │
                    │                          [ Enter Destination ]
                    │                                   │
                    │                          [ Click "Sweep Funds" ]
                    │                                   │
                    │                    [ Sign TX with In-Memory Key ]
                    │                                   │
                    │                     [ Broadcast to Kaspa RPC ]
                    │                                   │
                    │                             [ TX Confirmed ]
                    │                                   │
                    └─────────────────┬─────────────────┘
                                      │
                                      ▼
                      [ Secure Memory Wipe Routine ]
                        - Overwrite key buffers with 0x00
                        - Dereference variables
                        - Trigger garbage collector hint
                                      │
                                      ▼
                      [ Reset State to Brand New Burner ]
```

---

## 5. Security & OPSEC Implementation Details

1. **In-Memory Isolation:**
   - Private keys are stored strictly in typed arrays (`Uint8Array`) inside an isolated hook closure.
   - Never exposed to `window`, `localStorage`, `sessionStorage`, or `console.log`.

2. **Secure Zeroing (Memory Wipe):**
   ```typescript
   function secureZero(buffer: Uint8Array): void {
     buffer.fill(0);
   }
   ```

3. **Content Security Policy (CSP):**
   - Disallow inline eval (except WebAssembly).
   - Whitelist only official Kaspa RPC endpoints for `connect-src`.
   - Disallow third-party tracking scripts, CDNs, or foreign font sources.

4. **Fee Optimization:**
   - Automatically calculate the exact minimal Kaspa network fee (standard Kaspa mass calculation) to ensure 100% of the remaining balance is swept.

---

## 6. Deployment & Hosting Plan

- **Platform:** Vercel or Cloudflare Pages
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Headers:** Strict security headers (`X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: no-referrer`).

---

## 7. Cost Breakdown

- **Development:** $0 (Open Source tools)
- **Infrastructure:** $0 (Static hosting free tier + public Kaspa RPC nodes)
- **Total:** $0/month

---

## 8. Limitations for MVP

- Requires connection to public Kaspa RPC / gRPC-web nodes. If a public node is down, failover to a backup public node is required.
- Single-destination sweep only (split routing reserved for v2).
- Network fees are deducted from the swept amount.

---

```json
{
  "appName": "KasBurner",
  "stack": {
    "frontend": "React 18 + Vite",
    "backend": "None (Client-side Jamstack)",
    "database": "None (Zero-storage in-memory)",
    "auth": "None",
    "styling": "Tailwind CSS",
    "deployment": "Cloudflare Pages / Vercel"
  },
  "commands": {
    "setup": "npm install",
    "dev": "npm run dev",
    "test": "npm run test",
    "typecheck": "npm run typecheck",
    "build": "npm run build"
  }
}
```
