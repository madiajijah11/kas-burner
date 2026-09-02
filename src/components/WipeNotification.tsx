import React from 'react';
import { Flame, CheckCircle } from 'lucide-react';
import { SweepResult } from '../types/wallet';

interface WipeNotificationProps {
  sweepResult: SweepResult | null;
  state: string;
}

export const WipeNotification: React.FC<WipeNotificationProps> = ({ sweepResult, state }) => {
  if (state === 'WIPED') {
    return (
      <div className="bg-gradient-to-r from-red-950/70 to-orange-950/70 border border-red-500/50 rounded-2xl p-6 text-center animate-burn-wipe shadow-2xl">
        <Flame className="w-10 h-10 text-orange-400 mx-auto mb-2 animate-bounce" />
        <h3 className="text-lg font-bold font-mono text-white mb-1">RAM ZEROED & WIPED</h3>
        <p className="text-xs font-mono text-slate-300">All private keys and session buffers were erased. Spawning a fresh burner...</p>
      </div>
    );
  }

  if (sweepResult) {
    return (
      <div className="bg-emerald-950/40 border border-emerald-500/50 rounded-2xl p-5 shadow-xl font-mono text-xs">
        <div className="flex items-center space-x-2 text-emerald-400 font-bold mb-2">
          <CheckCircle className="w-5 h-5" />
          <span>Sweep Broadcasted Successfully!</span>
        </div>
        <div className="space-y-1 text-slate-300">
          <p>Swept Amount: <strong className="text-kaspa-cyan">{sweepResult.amountSweptKAS} KAS</strong></p>
          <p className="break-all">Target Destination: <span className="text-slate-400">{sweepResult.destination}</span></p>
          <p className="break-all flex items-center gap-1">
            TX ID: <code className="text-emerald-300">{sweepResult.txId}</code>
          </p>
        </div>
      </div>
    );
  }

  return null;
};
