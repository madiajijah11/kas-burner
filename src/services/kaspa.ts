// @ts-ignore
import { secp256k1 } from '@noble/curves/secp256k1.js';
// @ts-ignore
import { sha256 } from '@noble/hashes/sha2.js';
import { BurnerWallet, KaspaUTXO, NetworkType } from '../types/wallet';

// Bech32 encoding constants for Kaspa Address
const CHARSET = 'qpzry9x8gf2tvdw0s3jn54khce6mua7l';

function polymod(values: number[]): bigint {
  let c = 1n;
  for (const v of values) {
    const c0 = Number(c >> 35n);
    c = ((c & 0x07ffffffffn) << 5n) ^ BigInt(v);
    if (c0 & 0x01) c ^= 0x98f2bc8e61n;
    if (c0 & 0x02) c ^= 0x79b76d99e2n;
    if (c0 & 0x04) c ^= 0xf33e5fb3c4n;
    if (c0 & 0x08) c ^= 0xae2eabe2a8n;
    if (c0 & 0x10) c ^= 0x1e4f43e470n;
  }
  return c ^ 1n;
}

function prefixChecksum(prefix: string): number[] {
  const result: number[] = [];
  for (let i = 0; i < prefix.length; i++) {
    result.push(prefix.charCodeAt(i) & 31);
  }
  result.push(0);
  return result;
}

function convertBits(data: Uint8Array, fromBits: number, toBits: number, pad: boolean = true): number[] {
  let acc = 0;
  let bits = 0;
  const ret: number[] = [];
  const maxv = (1 << toBits) - 1;
  const max_acc = (1 << (fromBits + toBits - 1)) - 1;

  for (let i = 0; i < data.length; ++i) {
    const value = data[i];
    acc = ((acc << fromBits) | value) & max_acc;
    bits += fromBits;
    while (bits >= toBits) {
      bits -= toBits;
      ret.push((acc >> bits) & maxv);
    }
  }

  if (pad) {
    if (bits > 0) {
      ret.push((acc << (toBits - bits)) & maxv);
    }
  } else if (bits >= fromBits || ((acc << (toBits - bits)) & maxv)) {
    throw new Error('Invalid padding in convertBits');
  }

  return ret;
}

/**
 * Encodes a 32-byte schnorr public key into a valid Kaspa Address
 */
export function encodeKaspaAddress(prefix: string, pubkeyX: Uint8Array, version: number = 0): string {
  const payload = new Uint8Array(1 + pubkeyX.length);
  payload[0] = version;
  payload.set(pubkeyX, 1);

  const payload5Bit = convertBits(payload, 8, 5, true);
  const prefix5Bit = prefixChecksum(prefix);
  const template = [...prefix5Bit, ...payload5Bit, 0, 0, 0, 0, 0, 0, 0, 0];
  const mod = polymod(template);

  const checksum: number[] = [];
  for (let i = 0; i < 8; i++) {
    checksum.push(Number((mod >> BigInt(5 * (7 - i))) & 31n));
  }

  const combined = payload5Bit.concat(checksum);
  let addr = prefix + ':';
  for (const c of combined) {
    addr += CHARSET[c];
  }
  return addr;
}

/**
 * Validates a Kaspa Address format
 */
export function isValidKaspaAddress(address: string, expectedPrefix?: string): boolean {
  if (!address || !address.includes(':')) return false;
  const [prefix, payload] = address.split(':');
  if (expectedPrefix && prefix !== expectedPrefix) return false;
  if (!['kaspa', 'kaspatest', 'kaspadev', 'kaspasim'].includes(prefix)) return false;
  if (payload.length < 30 || payload.length > 80) return false;
  for (let i = 0; i < payload.length; i++) {
    if (!CHARSET.includes(payload[i])) return false;
  }
  return true;
}

/**
 * Converts a Kaspa address (kaspa:...) into its raw hexadecimal scriptPublicKey.
 * Version 0 (Schnorr P2PK) = 0x20 + 32-byte pubkey + 0xac (OP_CHECKSIG)
 * Version 1 (ECDSA P2PK)   = 0x21 + 33-byte pubkey + 0xab (OP_CHECKSIGECDSA)
 */
export function addressToScriptPublicKey(address: string): string {
  if (!address || !address.includes(':')) {
    throw new Error('Invalid address format');
  }
  const [, payload] = address.split(':');
  const data5Bit: number[] = [];
  for (let i = 0; i < payload.length; i++) {
    const idx = CHARSET.indexOf(payload[i]);
    if (idx === -1) throw new Error('Invalid character in Kaspa address');
    data5Bit.push(idx);
  }

  // Remove the 8 checksum 5-bit values at the end
  const values = data5Bit.slice(0, -8);
  let acc = 0;
  let bits = 0;
  const bytes: number[] = [];
  for (const v of values) {
    acc = (acc << 5) | v;
    bits += 5;
    while (bits >= 8) {
      bits -= 8;
      bytes.push((acc >> bits) & 0xff);
    }
  }

  const version = bytes[0];
  const pubkeyHex = bytes.slice(1).map(b => b.toString(16).padStart(2, '0')).join('');

  if (version === 0) {
    return '20' + pubkeyHex + 'ac';
  } else if (version === 1) {
    return '21' + pubkeyHex + 'ab';
  } else {
    // Script hash or other type fallback
    return 'aa' + pubkeyHex + '87';
  }
}


/**
 * Public Kaspa REST / API endpoints for balance query and broadcast
 */
const KASPA_API_ENDPOINTS: Record<NetworkType, string[]> = {
  'mainnet': [
    'https://api.kaspa.org'
  ],
  'testnet-10': [
    'https://api-tn10.kaspa.org'
  ],
  'testnet-11': [
    'https://api-tn11.kaspa.org'
  ]
};

export function getNetworkPrefix(network: NetworkType): string {
  switch (network) {
    case 'mainnet': return 'kaspa';
    case 'testnet-10':
    case 'testnet-11': return 'kaspatest';
    default: return 'kaspa';
  }
}

/**
 * Generate fresh in-memory ephemeral burner wallet
 */
export function generateBurnerWallet(network: NetworkType = 'mainnet'): BurnerWallet {
  const privKeyBytes = secp256k1.utils.randomSecretKey();
  const pubKeyBytes = secp256k1.getPublicKey(privKeyBytes, true); // 33-byte compressed
  const pubKeyX = pubKeyBytes.slice(1, 33); // 32-byte Schnorr X-only public key

  const prefix = getNetworkPrefix(network);
  const address = encodeKaspaAddress(prefix, pubKeyX, 0);

  const privateKeyHex = Array.from(privKeyBytes, (b) => Number(b).toString(16).padStart(2, '0')).join('');
  const publicKeyHex = Array.from(pubKeyX, (b) => Number(b).toString(16).padStart(2, '0')).join('');

  return {
    address,
    privateKeyHex,
    privateKeyBytes: privKeyBytes,
    publicKeyHex,
    createdAt: Date.now()
  };
}

/**
 * Query UTXOs and total balance from Kaspa public API
 */
export async function fetchKaspaBalance(address: string, network: NetworkType): Promise<{ balanceKAS: number; sompis: bigint; utxos: KaspaUTXO[] }> {
  const endpoints = KASPA_API_ENDPOINTS[network];

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(`${endpoint}/addresses/${address}/utxos`, {
        headers: { 'Accept': 'application/json' },
        signal: AbortSignal.timeout(5000)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      let totalSompis = 0n;
      const utxos: KaspaUTXO[] = [];

      if (Array.isArray(data)) {
        for (const item of data) {
          const amount = BigInt(item.utxoEntry?.amount || item.amount || 0);
          totalSompis += amount;
          utxos.push({
            txId: item.outpoint?.transactionId || item.transactionId,
            outputIndex: item.outpoint?.index ?? item.index ?? 0,
            amount,
            scriptPublicKey: item.utxoEntry?.scriptPublicKey?.scriptPublicKey || item.scriptPublicKey || '',
            blockDaaScore: BigInt(item.utxoEntry?.blockDaaScore || 0)
          });
        }
      }

      const balanceKAS = Number(totalSompis) / 100_000_000;
      return { balanceKAS, sompis: totalSompis, utxos };
    } catch {
      continue;
    }
  }

  return { balanceKAS: 0, sompis: 0n, utxos: [] };
}

/**
 * Execute sweep transaction: send all UTXOs from burner to destination
 */
export async function broadcastSweepTransaction(
  _burner: BurnerWallet,
  destination: string,
  network: NetworkType,
  utxos: KaspaUTXO[]
): Promise<{ txId: string; amountSwept: number; fee: number }> {
  if (utxos.length === 0) {
    throw new Error("No UTXOs detected yet. Please ensure funds are received before sweeping.");
  }

  let totalInputSompis = 0n;
  for (const u of utxos) {
    totalInputSompis += u.amount;
  }

  // Minimum fee 10,000 sompis (0.0001 KAS) per UTXO input
  const feeSompis = 10_000n * BigInt(Math.max(1, utxos.length));
  if (totalInputSompis <= feeSompis) {
    throw new Error("Balance is too small to cover the minimum Kaspa network fee.");
  }

  const sweepAmountSompis = totalInputSompis - feeSompis;
  const sweepAmountKAS = Number(sweepAmountSompis) / 100_000_000;
  const feeKAS = Number(feeSompis) / 100_000_000;

  // Derive binary scriptPublicKey hex from the destination address
  const targetScriptHex = addressToScriptPublicKey(destination);

  const rawTx = {
    version: 0,
    inputs: utxos.map(u => ({
      previousOutpoint: {
        transactionId: u.txId,
        index: u.outputIndex
      },
      signatureScript: '',
      sequence: 0,
      sigOpCount: 1
    })),
    outputs: [
      {
        amount: Number(sweepAmountSompis),
        scriptPublicKey: {
          version: 0,
          scriptPublicKey: targetScriptHex
        }
      }
    ],
    lockTime: 0,
    subnetworkId: "0000000000000000000000000000000000000000"
  };

  const endpoints = KASPA_API_ENDPOINTS[network];
  let lastErrorMsg = '';

  for (const endpoint of endpoints) {
    try {
      const res = await fetch(`${endpoint}/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transaction: rawTx }),
        signal: AbortSignal.timeout(8000)
      });

      const resData = await res.json().catch(() => null);
      if (res.ok && resData) {
        const txId = resData.transactionId || resData.txId;
        if (txId) {
          return { txId, amountSwept: sweepAmountKAS, fee: feeKAS };
        }
      }

      if (resData && (resData.error || resData.message || resData.detail)) {
        lastErrorMsg = resData.error || resData.message || JSON.stringify(resData.detail);
      } else {
        lastErrorMsg = `Node returned HTTP ${res.status}`;
      }
    } catch (err: any) {
      lastErrorMsg = err.message || 'Connection error';
      continue;
    }
  }

  throw new Error(`Broadcast failed: ${lastErrorMsg || 'Network error'}`);
}
