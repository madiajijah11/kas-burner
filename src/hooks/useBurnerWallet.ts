import { useState, useCallback, useEffect, useRef } from 'react';
import { BurnerState, BurnerWallet, NetworkType, KaspaUTXO, SweepResult } from '../types/wallet';
import { generateBurnerWallet, fetchKaspaBalance, broadcastSweepTransaction } from '../services/kaspa';
import { secureZero } from '../services/security';

export function useBurnerWallet(initialNetwork: NetworkType = 'mainnet') {
  const [network, setNetwork] = useState<NetworkType>(initialNetwork);
  const [state, setState] = useState<BurnerState>('INITIALIZING');
  const [wallet, setWallet] = useState<BurnerWallet | null>(null);
  const [balanceKAS, setBalanceKAS] = useState<number>(0);
  const [utxos, setUtxos] = useState<KaspaUTXO[]>([]);
  const [isPolling, setIsPolling] = useState<boolean>(false);
  const [lastSweep, setLastSweep] = useState<SweepResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const walletRef = useRef<BurnerWallet | null>(null);

  // Generate new burner wallet
  const createNewBurner = useCallback((net: NetworkType = network) => {
    // Zero out old wallet if exists
    if (walletRef.current) {
      secureZero(walletRef.current.privateKeyBytes);
      walletRef.current = null;
    }

    try {
      const newWallet = generateBurnerWallet(net);
      walletRef.current = newWallet;
      setWallet(newWallet);
      setBalanceKAS(0);
      setUtxos([]);
      setError(null);
      setState('READY');
    } catch (err: any) {
      setError('Failed to generate cryptographic keypair: ' + err.message);
      setState('ERROR');
    }
  }, [network]);

  // Initial load
  useEffect(() => {
    createNewBurner(network);
    return () => {
      // Memory cleanup on unmount
      if (walletRef.current) {
        secureZero(walletRef.current.privateKeyBytes);
      }
    };
  }, [network, createNewBurner]);

  // Poll for incoming funds
  useEffect(() => {
    if (!wallet || state === 'SWEEPING' || state === 'WIPED') return;

    let isMounted = true;
    const interval = setInterval(async () => {
      try {
        setIsPolling(true);
        const res = await fetchKaspaBalance(wallet.address, network);
        if (!isMounted) return;

        setBalanceKAS(res.balanceKAS);
        setUtxos(res.utxos);

        if (res.balanceKAS > 0 && state === 'READY') {
          setState('FUNDED');
        } else if (res.balanceKAS === 0 && state === 'FUNDED') {
          setState('READY');
        }
      } catch {
        // silent polling error
      } finally {
        if (isMounted) setIsPolling(false);
      }
    }, 4000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [wallet, network, state]);

  // Sweep all funds to destination
  const sweepFunds = async (destinationAddress: string): Promise<SweepResult> => {
    if (!walletRef.current || !wallet) {
      throw new Error("No active burner wallet.");
    }
    if (balanceKAS <= 0 || utxos.length === 0) {
      throw new Error("No funds detected in burner wallet yet. Please send KAS to this burner address first.");
    }

    setState('SWEEPING');
    setError(null);

    try {
      const result = await broadcastSweepTransaction(
        walletRef.current,
        destinationAddress,
        network,
        utxos
      );

      const sweepRecord: SweepResult = {
        txId: result.txId,
        amountSweptKAS: result.amountSwept,
        feeKAS: result.fee,
        destination: destinationAddress,
        timestamp: Date.now()
      };

      setLastSweep(sweepRecord);
      
      // Execute secure memory wipe
      wipeMemory();

      return sweepRecord;
    } catch (err: any) {
      setError(err.message || "Failed to execute sweep transaction");
      setState('FUNDED');
      throw err;
    }
  };

  // Immediate manual wipe & reset
  const wipeMemory = useCallback(() => {
    if (walletRef.current) {
      secureZero(walletRef.current.privateKeyBytes);
      walletRef.current.privateKeyHex = '';
      walletRef.current = null;
    }
    setWallet(null);
    setBalanceKAS(0);
    setUtxos([]);
    setState('WIPED');

    // Automatically spawn fresh burner after 1.5s
    setTimeout(() => {
      createNewBurner(network);
    }, 1500);
  }, [createNewBurner, network]);

  // Switch network
  const changeNetwork = (newNet: NetworkType) => {
    setNetwork(newNet);
    createNewBurner(newNet);
  };

  return {
    network,
    changeNetwork,
    state,
    wallet,
    balanceKAS,
    utxos,
    isPolling,
    lastSweep,
    error,
    sweepFunds,
    wipeMemory,
    generateNewBurner: () => createNewBurner(network)
  };
}