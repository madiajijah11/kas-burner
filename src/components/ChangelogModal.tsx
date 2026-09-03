import React from 'react';
import { X, Sparkles, Shield, Wrench, Globe, CheckCircle2, History } from 'lucide-react';
import { CHANGELOG_DATA } from '../data/changelog';

interface ChangelogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChangelogModal: React.FC<ChangelogModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const getTypeIcon = (type: 'feature' | 'fix' | 'security' | 'infra') => {
    switch (type) {
      case 'feature':
        return <Sparkles className="w-3.5 h-3.5 text-kaspa-cyan shrink-0" />;
      case 'security':
        return <Shield className="w-3.5 h-3.5 text-emerald-400 shrink-0" />;
      case 'fix':
        return <Wrench className="w-3.5 h-3.5 text-amber-400 shrink-0" />;
      case 'infra':
        return <Globe className="w-3.5 h-3.5 text-sky-400 shrink-0" />;
    }
  };

  const getTypeBadge = (type: 'feature' | 'fix' | 'security' | 'infra') => {
    switch (type) {
      case 'feature':
        return 'bg-kaspa-cyan/10 text-kaspa-cyan border-kaspa-cyan/30';
      case 'security':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'fix':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'infra':
        return 'bg-sky-500/10 text-sky-400 border-sky-500/30';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-xl max-h-[85vh] bg-kaspa-card border border-kaspa-border rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-kaspa-border/60 flex items-center justify-between bg-kaspa-dark/50">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-kaspa-cyan/10 border border-kaspa-cyan/20 text-kaspa-cyan">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-mono flex items-center gap-2">
                What's New <span className="text-xs px-2 py-0.5 rounded-full bg-kaspa-cyan/20 text-kaspa-cyan border border-kaspa-cyan/30 font-normal">Changelog</span>
              </h2>
              <p className="text-xs text-slate-400">Release notes & system improvements</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Changelog Timeline */}
        <div className="p-6 overflow-y-auto space-y-6 divide-y divide-kaspa-border/40">
          {CHANGELOG_DATA.map((item, idx) => (
            <div key={item.version} className={idx > 0 ? 'pt-6' : ''}>
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-sm font-bold text-white">{item.version}</span>
                  {item.badge && (
                    <span className="px-2 py-0.5 text-[10px] font-mono uppercase bg-kaspa-cyan/20 text-kaspa-cyan border border-kaspa-cyan/40 rounded-full font-bold">
                      {item.badge}
                    </span>
                  )}
                  <span className="text-xs text-slate-400 font-mono">({item.date})</span>
                </div>
              </div>

              <h3 className="text-xs font-semibold text-slate-200 mb-3">{item.title}</h3>

              <ul className="space-y-2">
                {item.changes.map((c, cIdx) => (
                  <li key={cIdx} className="flex items-start space-x-2.5 text-xs text-slate-300">
                    <div className="mt-0.5">{getTypeIcon(c.type)}</div>
                    <div className="flex-1">
                      <span className={`inline-block px-1.5 py-0.2 mr-1.5 text-[10px] font-mono uppercase border rounded ${getTypeBadge(c.type)}`}>
                        {c.type}
                      </span>
                      <span>{c.text}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-kaspa-border/60 bg-kaspa-dark/50 flex items-center justify-between">
          <div className="flex items-center space-x-1.5 text-[11px] text-emerald-400/90 font-mono">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>0-Storage & in-memory execution active</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-kaspa-cyan text-black font-semibold text-xs font-mono hover:bg-kaspa-glow transition-all shadow-md shadow-kaspa-cyan/10"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
