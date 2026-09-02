import React from 'react';
import { Activity, Coins, ArrowDownLeft } from 'lucide-react';

interface BalanceTrackerProps {
  balanceKAS: number;
  isPolling: boolean;
  utxoCount: number;
}

export const BalanceTracker: React.FC<BalanceTrackerProps> = ({ balanceKAS, isPolling, utxoCount }) => {
  return (
    <div className="bg-kaspa-card border border-kaspa-border rounded-2xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Coins className="w-4 h-4 text-kaspa-cyan" />
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
            Detected Burner Balance
          </span>
        </div>
        <div className="flex items-center space-x-1.5 text-[11px] font-mono text-slate-400">
          <Activity className={`w-3.5 h-3.5 ${isPolling ? 'text-kaspa-glow animate-pulse' : 'text-slate-600'}`} />
          <span>{isPolling ? 'Syncing node...' : 'Live polling'}</span>
        </div>
      </div>

      <div className="flex items-baseline space-x-3 my-2">
        <span className="text-4xl font-extrabold font-mono text-white tracking-tight">
          {balanceKAS.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 8 })}
        </span>
        <span className="text-lg font-bold font-mono text-kaspa-cyan">KAS</span>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-kaspa-border/60 text-xs font-mono text-slate-400">
        <div className="flex items-center space-x-1">
          <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-400" />
          <span>UTXOs: <strong className="text-slate-200">{utxoCount}</strong></span>
        </div>
        <span>Network confirmations: <strong className="text-emerald-400">Instant (DAG)</strong></span>
      </div>
    </div>
  );
};
