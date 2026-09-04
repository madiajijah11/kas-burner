# Contributing to KasBurner

Thank you for contributing to KasBurner! This project is an open-source, client-side OPSEC utility for the Kaspa BlockDAG. Because KasBurner handles temporary cryptographic keys, contributors (both human developers and AI agents) must adhere strictly to our architectural and operational standards.

---

## 🔒 The 5 Non-Negotiable Invariants

Any pull request or code modification that violates these rules will be rejected:

1. **Zero-Storage Rule:**
   - Never use `localStorage`, `sessionStorage`, cookies, or remote logging.
   - All state must reside in volatile RAM and be cleared upon transaction sweep, inactivity expiry, or manual burn.
2. **Explicit Memory Zeroing:**
   - Private keys and buffer objects must be overwritten with `0x00` via `secureZero()` before garbage collection.
3. **Mempool Standardness & Dynamic Mass:**
   - Always calculate fees dynamically using the standard 100 sompi/gram compute mass feerate (`feeRate: 100`).
   - Use `FeeSource.ReceiverPays` so that sweep transactions leave zero dust.
4. **Mandatory Local Verification:**
   - Every change must pass `npm run typecheck` and `npm run build` with 0 errors before submission.
5. **Git Protocol (For AI Agents):**
   - AI agents must NEVER automatically commit or push code without explicit human user confirmation.

---

## 🛠️ Development Setup

```bash
# 1. Install dependencies
npm ci

# 2. Run local development server
npm run dev

# 3. Verify TypeScript types
npm run typecheck

# 4. Verify production bundle build
npm run build
```

---

## 📜 Commit Conventions

We follow Conventional Commits:
- `feat: ...` (new feature or enhancement)
- `fix: ...` (bug fix)
- `security: ...` (security or OPSEC enhancement)
- `docs: ...` (documentation update)
- `chore: ...` (dependencies or build config)

Always update `src/data/changelog.ts` on significant updates so users see the What's New banner.
