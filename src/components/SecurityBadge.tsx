import React from 'react';
import { Lock, EyeOff, Cpu, RefreshCcw } from 'lucide-react';

export const SecurityBadge: React.FC = () => {
  return (
    <div className="bg-kaspa-card/60 border border-kaspa-border rounded-2xl p-5 backdrop-blur-sm">
      <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold mb-3 flex items-center gap-2">
        <Lock className="w-4 h-4 text-kaspa-cyan" />
        Guaranteed Cryptographic OPSEC
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono text-slate-300">
        <div className="flex items-start space-x-2.5 p-3 rounded-xl bg-kaspa-dark/60 border border-kaspa-border/50">
          <Cpu className="w-4 h-4 text-kaspa-cyan flex-shrink-0 mt-0.5" />
          <div>
            <strong className="block text-white font-semibold">100% In-Browser</strong>
            <span className="text-slate-400 text-[11px]">Private keys are generated with CSPRNG and never leave RAM.</span>
          </div>
        </div>

        <div className="flex items-start space-x-2.5 p-3 rounded-xl bg-kaspa-dark/60 border border-kaspa-border/50">
          <EyeOff className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
          <div>
            <strong className="block text-white font-semibold">Zero Disk / Storage</strong>
            <span className="text-slate-400 text-[11px]">No cookies, no localStorage, no database, no server logs.</span>
          </div>
        </div>

        <div className="flex items-start space-x-2.5 p-3 rounded-xl bg-kaspa-dark/60 border border-kaspa-border/50">
          <RefreshCcw className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <strong className="block text-white font-semibold">Automatic Memory Wipe</strong>
            <span className="text-slate-400 text-[11px]">Buffer zero-filling (0x00) clears the key after every sweep.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
