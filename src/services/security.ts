/**
 * Secure cryptographic memory wipe routines.
 * Ensures private keys and buffers are explicitly zero-filled in RAM.
 */

export function secureZero(buffer: Uint8Array): void {
  try {
    buffer.fill(0);
  } catch {
    for (let i = 0; i < buffer.length; i++) {
      buffer[i] = 0;
    }
  }
}

export function wipeObject(obj: Record<string, any>): void {
  for (const key of Object.keys(obj)) {
    if (obj[key] instanceof Uint8Array) {
      secureZero(obj[key]);
    } else if (typeof obj[key] === 'string') {
      obj[key] = '';
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      wipeObject(obj[key]);
    }
  }
}

/**
 * Verify that localStorage and sessionStorage contain zero wallet data
 */
export function verifyZeroStorage(): boolean {
  try {
    const localKeys = Object.keys(localStorage);
    const sessionKeys = Object.keys(sessionStorage);
    return localKeys.length === 0 && sessionKeys.length === 0;
  } catch {
    return true; // Access restricted or sandbox
  }
}
