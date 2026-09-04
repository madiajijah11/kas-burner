# Agent Instructions & Guidelines

All AI coding assistants (Claude, Gemini, Cursor, DeepSeek Harness, Copilot, etc.) working on this repository **MUST strictly follow `AGENTS.md`**.

## Core Invariants:
1. **Zero-Storage Rule:** Never introduce cookies, localStorage, sessionStorage, or remote analytics/telemetry.
2. **RAM Key Scrubbing:** Private keys must be zeroed with `0x00` (`secureZero`) upon sweep, manual burn, or inactivity auto-expiry.
3. **Mempool Feerate Standard:** Always use dynamic compute mass feerate (`100 sompi/gram`) and `FeeSource.ReceiverPays`.
4. **Mandatory Local Verification:** Run `npm run typecheck` and `npm run build` before considering any task complete.
5. **Git Protocol (MANDATORY RULE):** NEVER commit or push code automatically without explicit confirmation from the human user.
