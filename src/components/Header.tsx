import React from 'react';
import { ShieldCheck, Flame } from 'lucide-react';
import { NetworkType } from '../types/wallet';

interface HeaderProps {
  network: NetworkType;
  onNetworkChange: (net: NetworkType) => void;
}

export const Header: React.FC<HeaderProps> = ({ network, onNetworkChange }) => {
  return (
    <header className="border-b border-kaspa-border/60 bg-kaspa-dark/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-5xl mx-auto px-4 py-3.5 flex items-center justify-between">
        {/* Logo and Brand */}
        <div className="flex items-center space-x-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-kaspa-card border border-kaspa-cyan/30 text-kaspa-cyan shadow-lg shadow-kaspa-cyan/10">
            <Flame className="w-5 h-5 text-kaspa-cyan animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold font-mono tracking-tight text-white flex items-center">
                Kas<span className="text-kaspa-cyan">Burner</span>
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-mono uppercase bg-kaspa-cyan/10 text-kaspa-cyan border border-kaspa-cyan/30 rounded">
                v1.0 MVP
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono hidden sm:block">Ephemeral In-Memory Kaspa OPSEC Wallets</p>
          </div>
        </div>

        {/* Status Badge & Network Switcher */}
        <div className="flex items-center space-x-3">
          <div className="hidden md:flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-kaspa-card border border-emerald-500/20 text-emerald-400 text-xs font-mono">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>0-Storage Enforced</span>
          </div>

          <div className="flex items-center bg-kaspa-card border border-kaspa-border rounded-lg p-0.5 text-xs font-mono">
            <button
              onClick={() => onNetworkChange('mainnet')}
              className={`px-3 py-1 rounded-md transition-all ${
                network === 'mainnet'
                  ? 'bg-kaspa-cyan/20 text-kaspa-cyan font-bold border border-kaspa-cyan/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Mainnet
            </button>
            <button
              onClick={() => onNetworkChange('testnet-10')}
              className={`px-3 py-1 rounded-md transition-all ${
                network === 'testnet-10'
                  ? 'bg-amber-500/20 text-amber-400 font-bold border border-amber-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Testnet-10
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
