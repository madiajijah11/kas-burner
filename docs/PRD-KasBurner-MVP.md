# Product Requirements Document: KasBurner MVP

**Author:** Genzo & Antigravity  
**Date:** 2026-09-02  
**Status:** Approved & Shipped  
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
  - Clear, accessible onboarding guide for beginners.
  - Optional support/donation channel for the open-source developer.

---

## 3. Problem Statement

Kaspa transactions are publicly visible on the blockDAG. When users share their main wallet address to receive funds, they expose their holdings and transaction patterns. KasBurner solves this by generating disposable, in-memory burner wallets that act as an intermediary buffer. Once funds arrive, they are swept directly to the destination address, and the burner private keys are wiped from memory.

---

## 4. User Journey

1. **Discovery / Open:** User opens KasBurner in their desktop or mobile browser.
2. **Instant Generation:** The app immediately creates a fresh Kaspa keypair entirely in-memory.
3. **Share Address:** User copies the burner address (or uses the QR code) and shares it with the sender.
4. **Fund Arrival:** User enters their real destination wallet address and monitors incoming KAS in real-time.
5. **One-Tap Sweep:** User clicks "Sweep All & Wipe Memory". KasBurner signs and broadcasts a transaction moving all KAS from the burner to the destination.
6. **Secure Wipe:** The app zeros the burner private key buffer (`0x00`) from browser memory. The screen resets and a fresh burner is spawned.
7. **Developer Donation (Optional):** Users can copy the developer Kaspa address or scan the donation QR to support development.

---

## 5. MVP Features (Must-Have)

### Feature 1: Instant Burner Wallet Generation
- **What it does:** Generates a valid Kaspa keypair (public address + private key) inside the browser using noble curves and Bech32 encoding.
- **Why essential:** Core functionality of the product.
- **Success Criteria:** Address appears in under 500ms on page load without server calls.

### Feature 2: Auto-Sweep to Destination Wallet
- **What it does:** Builds, signs, and broadcasts a transaction sending all received KAS (minus minimal network fee) to the user's destination address.
- **Why essential:** Moves funds safely to the permanent wallet.
- **Success Criteria:** Transaction successfully broadcasted and confirmed on the Kaspa network.

### Feature 3: Secure Memory Wipe
- **What it does:** Overwrites and clears private keys (`0x00` fill) from JavaScript memory immediately after the sweep confirms or on user-triggered reset.
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

### Feature 6: Beginner's Onboarding Guide & Developer Donation Card
- **What it does:** Provides an interactive 3-step walkthrough of the burner workflow and a dedicated donation card with 1-click copy & QR code for the developer Kaspa address (`kaspa:qypgw7xw60yvxv5pcjncdv4f30wanju0g64hw3204wreayajt3025qgde344ycq`).
- **Why essential:** Lowers barrier to entry for non-technical users and allows the community to fund open-source maintenance.
- **Success Criteria:** Toggleable guide accordion and functional donation QR.

---

## 6. Features Intentionally Deferred to v2

1. **Split Routing:** Splitting swept funds across multiple output addresses.
2. **Transaction History Log:** Optional, encrypted local session log.
3. **Auto-Expiry Timer:** Automatic memory wipe after an inactivity countdown.
4. **Multiple Active Burners:** Managing several burner addresses concurrently in tabs.

---

## 7. Success Metrics

- **Primary Metric:** Number of successful sweep transactions completed.
- **Secondary Metric:** Unique website visits (measured via privacy-friendly, cookieless analytics).
- **Community Metric:** Developer donations received and community adoption in Kaspa forums.

---

## 8. Design Direction

- **Vibe:** Dark, fast, hacker-clean.
- **Language:** Consistent English throughout all components and documentation.
- **Color Palette:** Deep black (`#0B0F12`), Kaspa Cyan (`#70C7BA`), Kaspa Glow (`#49EACB`), and high-contrast status accents.
- **Key Screens:**
  1. Main Burner Dashboard: Live burner address display, QR toggle, balance indicator, destination input field, prominent "Sweep" action button, and "Burn Now" emergency wipe button.
  2. Beginner Guide & Donation Section: Collapsible 3-step guide and developer Kaspa address box.
  3. Sweep Confirmation / Success State: Transaction ID display and animated RAM zeroing banner.

---

## 9. Technical Considerations

- **Platform:** Web application (Vite + React + TypeScript).
- **Crypto Engine:** `@noble/curves/secp256k1` + `@noble/hashes/sha2` for client-side key generation, Schnorr public key extraction, and Bech32 address encoding.
- **Network Interface:** Direct connection to public Kaspa REST / RPC endpoints for balance polling and transaction broadcast.
- **Security:** Zero persistent storage, buffer zeroing, and static Jamstack architecture.

---

## 10. AI / Automation Scope

- **Scope:** None.
- **Rationale:** KasBurner is a focused, deterministic cryptographic utility. No machine learning models, external AI APIs, or automated agents are required in the product runtime.

---

## 11. Constraints

- **Budget:** $0.
- **Hosting:** Free static hosting (Cloudflare Pages, Vercel, or GitHub Pages).
- **Timeline:** 1 to 2 weeks.
- **Compliance / Privacy:** No KYC, no account creation, zero user data retention.

---

## 12. Definition of Done (MVP Launch Checklist)

- [x] Burner address generates instantly on page load.
- [x] Incoming KAS balance reflects accurately in real-time or upon polling.
- [x] Sweep transaction constructs, signs, and broadcasts successfully to Kaspa network.
- [x] In-memory keys are wiped upon sweep completion.
- [x] Beginner guide and developer donation card implemented with QR support.
- [x] Responsive design verified on both desktop and mobile viewports.
- [x] Zero sensitive data logged to console or persisted to local storage.
- [x] Consistent English UI language across all views.
- [x] Production bundle verified and build passing with 0 errors.

---

```json
{
  "appName": "KasBurner",
  "oneLiner": "Single-use Kaspa wallets that vanish after the transaction, keeping your real address private.",
  "targetUsers": "Kaspa holders seeking transaction privacy and OPSEC.",
  "phase": "Completed",
  "mustHave": [
    "Instant Burner Wallet Generation",
    "Auto-Sweep to Destination Wallet",
    "Secure Memory Wipe",
    "Zero-Storage Guarantee",
    "Mobile-Friendly Responsive Web Interface",
    "Beginner's Onboarding Guide & Donation Card"
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
