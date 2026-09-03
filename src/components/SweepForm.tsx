import React, { useState } from 'react';
import { Send, Flame, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { isValidKaspaAddress, getNetworkPrefix } from '../services/kaspa';
import { NetworkType } from '../types/wallet';

interface SweepFormProps {
  balanceKAS: number;
  network: NetworkType;
  onSweep: (destination: string) => Promise<void>;
  onEmergencyBurn: () => void;
  isSweeping: boolean;
}

export const SweepForm: React.FC<SweepFormProps> = ({
  balanceKAS,
  network,
  onSweep,
  onEmergencyBurn,
  isSweeping
}) => {
  const [destination, setDestination] = useState('');
  const [customError, setCustomError] = useState<string | null>(null);

  const expectedPrefix = getNetworkPrefix(network);
  const isValidAddress = isValidKaspaAddress(destination.trim(), expectedPrefix);

  const estimatedFeeKAS = 0.0025;
  const estimatedNetSweepKAS = Math.max(0, balanceKAS - estimatedFeeKAS);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCustomError(null);

    const cleanDest = destination.trim();
    if (!cleanDest) {
      setCustomError('Please enter a destination Kaspa address');
      return;
    }

    if (!isValidKaspaAddress(cleanDest, expectedPrefix)) {
      setCustomError(`Invalid ${network} address. Must start with '${expectedPrefix}:'`);
      return;
    }

    if (balanceKAS <= 0) {
      setCustomError('Burner wallet has 0 KAS. Send funds to burner address first.');
      return;
    }

    try {
      await onSweep(cleanDest);
      setDestination('');
    } catch (err: any) {
      setCustomError(err.message || 'Sweep failed.');
    }
  };

  return (
    <div className="bg-kaspa-card border border-kaspa-border rounded-2xl p-6 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-mono uppercase tracking-wider text-slate-300 font-semibold flex items-center gap-2">
          <Send className="w-4 h-4 text-kaspa-cyan" />
          Auto-Sweep & Wipe Routing
        </h3>
        <span className="text-[11px] font-mono text-slate-400">Target OPSEC Route</span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-mono text-slate-400 mb-2">
            Destination Permanent Wallet Address ({expectedPrefix}:...)
          </label>
          <div className="relative">
            <input
              type="text"
              value={destination}
              onChange={(e) => {
                setDestination(e.target.value);
                setCustomError(null);
              }}
              placeholder={`${expectedPrefix}:qq...`}
              disabled={isSweeping}
              className="w-full bg-kaspa-dark border border-kaspa-border rounded-xl px-4 py-3 text-xs sm:text-sm font-mono text-white placeholder-slate-600 focus:outline-none focus:border-kaspa-cyan focus:ring-1 focus:ring-kaspa-cyan transition-all disabled:opacity-50"
            />
            {destination && isValidAddress && (
              <span className="absolute right-3 top-3 text-emerald-400 text-xs font-mono flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" /> Valid
              </span>
            )}
          </div>
        </div>

        {/* Fee and breakdown */}
        <div className="bg-kaspa-dark/50 rounded-xl p-3.5 border border-kaspa-border/50 text-xs font-mono space-y-1.5">
          <div className="flex justify-between text-slate-400">
            <span>Estimated Network Fee:</span>
            <span>~{estimatedFeeKAS} KAS</span>
          </div>
          <div className="flex justify-between text-white font-bold pt-1 border-t border-kaspa-border/40">
            <span>Net Amount to Receive:</span>
            <span className="text-kaspa-cyan">{estimatedNetSweepKAS.toFixed(6)} KAS</span>
          </div>
        </div>

        {customError && (
          <div className="p-3 bg-red-950/40 border border-red-500/40 rounded-xl text-xs font-mono text-red-300 flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <span>{customError}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <button
            type="submit"
            disabled={isSweeping || balanceKAS <= 0}
            className="sm:col-span-2 flex items-center justify-center space-x-2 py-3.5 px-4 bg-gradient-to-r from-kaspa-cyan to-kaspa-glow text-black font-bold font-mono text-sm rounded-xl hover:opacity-95 active:scale-[0.99] transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-kaspa-cyan/20"
          >
            {isSweeping ? (
              <span>Signing & Sweeping...</span>
            ) : (
              <>
                <span>Sweep All & Wipe Memory</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onEmergencyBurn}
            disabled={isSweeping}
            className="flex items-center justify-center space-x-1.5 py-3.5 px-4 bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-500/40 font-mono text-xs rounded-xl transition-all"
            title="Discard this burner key and zero RAM immediately"
          >
            <Flame className="w-4 h-4 text-red-400" />
            <span>Burn Now (Wipe)</span>
          </button>
        </div>
      </form>
    </div>
  );
};