# Product Requirements Document: KasBurner MVP

**Author:** Genzo & Antigravity  
**Date:** 2026-09-02  
**Status:** Approved  
**Version:** 1.0 (MVP)  

---

## 1. Product Overview

- **Product Name:** KasBurner
- **Tagline:** Single-use Kaspa wallets that vanish after the transaction, keeping your real address private.
- **Goal:** Build a working, privacy-focused crypto utility to share with the Kaspa community and learn crypto tool development.
- **Timeline:** 1-2 weeks to MVP launch.
- **Budget:** $0 (free-tier hosting, no backend server).

---

## 2. Target Users

- **Primary Persona:** Kaspa holders who care about operational security (OPSEC) and transaction privacy.
- **Pain Points:**
  - Kaspa's transparent ledger links all past and future transactions to a single reused address.
  - Sharing a main wallet address exposes total balance and full transaction history.
  - Setting up fresh wallets manually in standard apps is tedious and slow.
- **User Needs:**
  - Instant throwaway addresses without setup or configuration.
  - A clean, trusted, client-side-only execution environment.
  - One-tap fund transfer from the temporary address to a permanent wallet.

---

## 3. Problem Statement

Kaspa transactions are publicly visible on the blockDAG. When users share their main wallet address to receive funds, they expose their holdings and transaction patterns. KasBurner solves this by generating disposable, in-memory burner wallets that act as an intermediary buffer. Once funds arrive, they are swept directly to the destination address, and the burner private keys are wiped from memory.

---

## 4. User Journey

1. **Discovery / Open:** User opens KasBurner in their desktop or mobile browser.
2. **Instant Generation:** The app immediately creates a fresh Kaspa keypair entirely in-memory.
3. **Share Address:** User copies the burner address and shares it with the sender.
4. **Fund Arrival:** User enters their real destination wallet address and monitors incoming KAS.
5. **One-Tap Sweep:** User clicks "Sweep Funds". KasBurner signs and broadcasts a transaction moving all KAS from the burner to the destination.
6. **Secure Wipe:** The app zeros the burner private key from browser memory. The screen resets. No trace is stored.

---

## 5. MVP Features (Must-Have)

### Feature 1: Instant Burner Wallet Generation
- **What it does:** Generates a valid Kaspa keypair (public address + private key) inside the browser using `kaspa-wasm`.
- **Why essential:** Core functionality of the product.
- **Success Criteria:** Address appears in under 500ms on page load without server calls.

### Feature 2: Auto-Sweep to Destination Wallet
- **What it does:** Builds, signs, and broadcasts a transaction sending all received KAS (minus minimal network fee) to the user's destination address.
- **Why essential:** Moves funds safely to the permanent wallet.
- **Success Criteria:** Transaction successfully broadcasted and confirmed on the Kaspa network.

### Feature 3: Secure Memory Wipe
- **What it does:** Overwrites and clears private keys from JavaScript memory immediately after the sweep confirms or on user-triggered reset.
- **Why essential:** Core privacy promise; prevents key recovery from browser memory inspection.
- **Success Criteria:** Memory state verified clean; address regenerated fresh on refresh.

### Feature 4: Zero-Storage Guarantee (No Backend, No LocalStorage)
- **What it does:** Ensures zero cookies, zero LocalStorage, zero telemetry of keys or addresses, and zero server logging.
- **Why essential:** Trust is critical in crypto security tools.
- **Success Criteria:** Zero network requests containing sensitive data; fully static client-side bundle.

### Feature 5: Mobile-Friendly Responsive Web Interface
- **What it does:** Delivers a fast, clean UI optimized for both desktop and mobile screens.
- **Why essential:** Users often handle crypto transfers and copy-paste addresses on phones.
- **Success Criteria:** Fully functional and readable on viewports down to 320px width.

---

## 6. Features Intentionally Deferred to v2

1. **Split Routing:** Splitting swept funds across multiple output addresses.
2. **QR Code Sharing:** Visual QR generation for instant scanning.
3. **Transaction History Log:** Optional, encrypted local session log.
4. **Auto-Expiry Timer:** Automatic memory wipe after an inactivity countdown.
5. **Multiple Active Burners:** Managing several burner addresses concurrently in tabs.

---

## 7. Success Metrics

- **Primary Metric:** Number of successful sweep transactions completed.
- **Secondary Metric:** Unique website visits (measured via privacy-friendly, cookieless analytics).
- **Learning Metric:** Successful deployment and positive feedback from the Kaspa community.

---

## 8. Design Direction

- **Vibe:** Dark, fast, hacker-clean.
- **Color Palette:** Deep black/dark gray backgrounds, clean monospace text, subtle high-contrast accents (e.g. Kaspa teal/cyan).
- **Key Screens:**
  1. Main Burner Dashboard: Live burner address display, balance indicator, destination input field, prominent "Sweep" action button, and "Wipe / Burn Now" emergency button.
  2. Sweep Confirmation / Success State: Brief transaction confirmation with a clear visual wipe effect before returning to a fresh state.

---

## 9. Technical Considerations

- **Platform:** Web application (Static HTML/JS/CSS or lightweight frontend framework).
- **Crypto Engine:** `kaspa-wasm` for client-side key generation and transaction signing.
- **Network Interface:** Direct connection to public Kaspa RPC / REST nodes for balance checks and transaction broadcast.
- **Security:**
  - Content Security Policy (CSP) blocking unauthorized external scripts.
  - Zero persistent storage (no `localStorage`, `sessionStorage`, or `cookies` for keys).
  - Explicit zeroing of sensitive buffers/variables post-transaction.

---

## 10. AI / Automation Scope

- **Scope:** None.
- **Rationale:** KasBurner is a focused, deterministic cryptographic utility. No machine learning models, external AI APIs, or automated agents are required in the product runtime.

---

## 11. Constraints

- **Budget:** $0.
- **Hosting:** Free static hosting (Vercel, Netlify, or GitHub Pages).
- **Timeline:** 1 to 2 weeks.
- **Compliance / Privacy:** No KYC, no account creation, zero user data retention.

---

## 12. Definition of Done (MVP Launch Checklist)

- [ ] Burner address generates instantly on page load.
- [ ] Incoming KAS balance reflects accurately in real-time or upon polling.
- [ ] Sweep transaction constructs, signs, and broadcasts successfully to Kaspa mainnet/testnet.
- [ ] In-memory keys are wiped upon sweep completion.
- [ ] Responsive design verified on both desktop and mobile viewports.
- [ ] Zero sensitive data logged to console or persisted to local storage.
- [ ] Deployed to a public static URL and tested live with a small real transaction.

---

```json
{
  "appName": "KasBurner",
  "oneLiner": "Single-use Kaspa wallets that vanish after the transaction, keeping your real address private.",
  "targetUsers": "Kaspa holders seeking transaction privacy and OPSEC.",
  "phase": "Foundation",
  "mustHave": [
    "Instant Burner Wallet Generation",
    "Auto-Sweep to Destination Wallet",
    "Secure Memory Wipe",
    "Zero-Storage Guarantee",
    "Mobile-Friendly Responsive Web Interface"
  ],
  "niceToHave": [
    "Split Routing",
    "QR Code Sharing",
    "Auto-Expiry Timer"
  ],
  "notInMvp": [
    "Transaction History Log",
    "Multiple Active Burners",
    "AI Features"
  ],
  "successMetrics": [
    "Successful sweep transactions completed",
    "Unique website visitors"
  ]
}
```
