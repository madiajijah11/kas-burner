# Security & OPSEC Policy

KasBurner is a high-security, client-side ephemeral burner wallet tool for the Kaspa BlockDAG network. Security and operational privacy (OPSEC) are our core priorities.

---

## 🛡️ Core Security Architecture & Invariants

All contributors and AI agents working on KasBurner must uphold the following non-negotiable security invariants:

1. **Zero-Storage Policy:**
   - No `localStorage`, `sessionStorage`, cookies, or IndexedDB storage of private keys or sensitive state.
   - All cryptographic keypairs exist strictly in ephemeral browser memory (RAM) and vanish upon tab closure, manual burn, or auto-expiry timeout.
   - Zero telemetry, zero third-party analytics trackers, and zero server logging.

2. **Client-Side Cryptographic Execution:**
   - CSPRNG key generation via audited cryptographic primitives (`@noble/curves` and `@noble/hashes`).
   - Transaction construction and Schnorr signing are executed client-side via the official Kaspa WebAssembly SDK (`src/wasm/kaspa/`).
   - Private keys are never transmitted over the network.

3. **Memory Zeroing (`0x00` Fill):**
   - Prior to discarding private keys, byte buffers in memory must be overwritten with `0x00` (`secureZero`).

4. **Consensus & Feerate Standardness:**
   - Adheres strictly to the post-Crescendo Kaspa mempool standard feerate of **100 sompi/gram of compute mass**.
   - Enforces `FeeSource.ReceiverPays` to eliminate unspendable dust.

---

## 🔍 Reporting a Vulnerability

If you discover a security vulnerability or OPSEC flaw in KasBurner, we appreciate your responsible disclosure:

1. **Private Reporting (Preferred):**
   - Please report vulnerabilities privately using GitHub's **Security Advisories** feature:
     [Report a Vulnerability](https://github.com/madiajijah11/kas-burner/security/advisories/new)
2. **What to Include:**
   - Detailed description of the issue.
   - Proof of concept (PoC) or reproducible steps.
   - Affected files and components.
   - Potential impact on user funds or privacy.

We commit to reviewing reports promptly, providing transparent assessments, and releasing patches in public releases.
