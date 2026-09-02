# Task 2: Kaspa WASM & In-Memory Key Management

## Goal
Implement client-side key generation, balance polling, and memory zeroing routines.

## Acceptance Criteria
- `kaspa-wasm` initializes cleanly in browser.
- Keypair generation produces valid `kaspa:` address and in-memory private key in a `Uint8Array`.
- Balance polling queries public Kaspa RPC/REST node.
- Memory wipe zero-fills the private key buffer and resets state.
