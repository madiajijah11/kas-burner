export type NetworkType = 'mainnet' | 'testnet-10' | 'testnet-11';

export type BurnerState = 'INITIALIZING' | 'READY' | 'FUNDED' | 'SWEEPING' | 'WIPED' | 'ERROR';

export interface BurnerWallet {
  address: string;
  privateKeyHex: string; // Stored only in-memory, zeroed upon wipe
  privateKeyBytes: Uint8Array;
  publicKeyHex: string;
  createdAt: number;
}

export interface KaspaUTXO {
  txId: string;
  outputIndex: number;
  amount: bigint; // in sompis (1 KAS = 100,000,000 sompis)
  scriptPublicKey: string;
  blockDaaScore: bigint;
}

export interface SweepResult {
  txId: string;
  amountSweptKAS: number;
  feeKAS: number;
  destination: string;
  timestamp: number;
}
