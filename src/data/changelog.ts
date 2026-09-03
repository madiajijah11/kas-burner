export interface ChangelogItem {
  version: string;
  date: string;
  title: string;
  badge?: string;
  changes: {
    type: 'feature' | 'fix' | 'security' | 'infra';
    text: string;
  }[];
}

export const CHANGELOG_DATA: ChangelogItem[] = [
  {
    version: 'v1.1.0',
    date: 'September 2026',
    title: 'Dynamic Mass Fee Engine & In-Browser WASM',
    badge: 'Latest',
    changes: [
      {
        type: 'feature',
        text: 'Dynamic Compute Mass Feerate: Automatic 100 sompi/gram feerate compliance with Kaspa mempool standards.'
      },
      {
        type: 'feature',
        text: 'Receiver-Pays Sweep: 100% clean sweep to destination wallet with zero dust and no insufficient funds errors.'
      },
      {
        type: 'security',
        text: 'Official In-Browser WASM SDK: Integrated official Kaspa WebAssembly build with native async loader.'
      },
      {
        type: 'fix',
        text: 'Full Schnorr Transaction Signing: Corrected IScriptPublicKey structure to ensure valid OP_CHECKSIG validation.'
      },
      {
        type: 'infra',
        text: 'Search Engine Optimization: Added Google site verification, rich JSON-LD structured data, sitemap, and robots.txt.'
      }
    ]
  },
  {
    version: 'v1.0.0',
    date: 'August 2026',
    title: 'KasBurner Initial MVP Launch',
    changes: [
      {
        type: 'feature',
        text: 'Ephemeral In-Memory Burner: CSPRNG key generation with valid Kaspa Bech32 address encoding.'
      },
      {
        type: 'security',
        text: 'Zero-Storage OPSEC Guarantee: Zero cookies, zero localStorage, zero disk persistence, and RAM zero-fill (0x00) on burn.'
      },
      {
        type: 'feature',
        text: 'One-Tap Auto Sweep: Transfer balance to your permanent cold wallet with automatic key erasure.'
      },
      {
        type: 'feature',
        text: 'Beginner Guide & Developer Donation Card: Built-in 3-step walkthrough and Kaspa community donation modal.'
      }
    ]
  }
];
