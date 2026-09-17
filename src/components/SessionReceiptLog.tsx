import React, { useState } from 'react';
import { Receipt, ExternalLink, Copy, Check, Trash2, ShieldCheck } from 'lucide-react';
import { SweepResult, NetworkType } from '../types/wallet';
import { safeCopyToClipboard } from '../utils/clipboard';

export interface SessionReceiptLogProps {
  sessionLogs: SweepResult[];
  onClearLogs: () => void;
}

export const SessionReceiptLog: React.FC<SessionReceiptLogProps> = ({
  sessionLogs,
  onClearLogs,
}) => {
  const [copiedTxId, setCopiedTxId] = useState<string | null>(null);

  const copyTxId = async (txId: string) => {
    const success = await safeCopyToClipboard(txId);
    if (success) {
      setCopiedTxId(txId);
      setTimeout(() => setCopiedTxId(null), 2000);
    }
  };

  const getExplorerUrl = (txId: string, network: NetworkType): string => {
    switch (network) {
      case 'mainnet':
        return `https://explorer.kaspa.org/txs/${txId}`;
      case 'testnet-10':
        return `https://explorer-tn10.kaspa.org/txs/${txId}`;
      case 'testnet-11':
        return `https://explorer-tn11.kaspa.org/txs/${txId}`;
      default:
        return `https://explorer.kaspa.org/txs/${txId}`;
    }
  };

  return (
    <div className="bg-kaspa-card border border-kaspa-border rounded-2xl p-6 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-kaspa-border/60">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 bg-kaspa-cyan/10 border border-kaspa-cyan/30 rounded-xl text-kaspa-cyan">
            <Receipt className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-mono uppercase tracking-wider text-white font-semibold">
                Proof of Sweep & Receipts
              </h3>
              <span className="px-2 py-0.5 text-[10px] font-mono rounded-full bg-kaspa-dark border border-kaspa-border text-slate-400">
                {sessionLogs.length} {sessionLogs.length === 1 ? 'Record' : 'Records'}
              </span>
            </div>
            <p className="text-[11px] font-mono text-slate-400">
              Ephemeral in-memory activity • Discarded on tab close
            </p>
          </div>
        </div>

        {sessionLogs.length > 0 && (
          <button
            type="button"
            onClick={onClearLogs}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-kaspa-dark hover:bg-red-950/40 text-slate-400 hover:text-red-300 border border-kaspa-border hover:border-red-500/40 rounded-lg text-xs font-mono transition-all"
            title="Clear all session receipts from RAM"
            aria-label="Clear all session receipts from RAM"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Log</span>
          </button>
        )}
      </div>

      {/* Receipts List or Empty State */}
      {sessionLogs.length === 0 ? (
        <div className="text-center py-6 px-4 bg-kaspa-dark/50 border border-kaspa-border/50 rounded-xl space-y-1.5">
          <p className="text-xs font-mono text-slate-400">
            No sweep transactions recorded in this session yet.
          </p>
          <p className="text-[11px] font-mono text-slate-500">
            Receipts will automatically appear here in volatile RAM after each successful sweep.
          </p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
          {sessionLogs.map((log, index) => (
            <div
              key={log.id || log.txId || index}
              className="bg-kaspa-dark/80 border border-kaspa-border/70 rounded-xl p-4 space-y-2.5 group hover:border-kaspa-cyan/40 transition-colors"
            >
              {/* Top Row: Amount, Fee, Status Badges & Time */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-mono font-bold text-emerald-400">
                    +{log.amountSweptKAS.toFixed(6)} KAS
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    (Fee: ~{log.feeKAS.toFixed(6)} KAS)
                  </span>
                </div>

                <div className="flex items-center space-x-1.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Wiped (0x00)</span>
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-kaspa-card border border-kaspa-border text-slate-300">
                    {log.network}
                  </span>
                  <span className="text-[11px] font-mono text-slate-500">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>

              {/* Destination Address */}
              <div className="text-xs font-mono">
                <span className="text-slate-500 mr-1.5">To:</span>
                <code className="text-slate-300 break-all select-all">{log.destination}</code>
              </div>

              {/* TXID & Actions */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1.5 border-t border-kaspa-border/40 text-xs font-mono">
                <div className="flex items-center space-x-1 text-slate-400 min-w-0 flex-1">
                  <span className="text-slate-500">TX:</span>
                  <code className="text-kaspa-cyan truncate select-all">{log.txId}</code>
                </div>

                <div className="flex items-center space-x-2 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => copyTxId(log.txId)}
                    aria-label={`Copy TXID ${log.txId}`}
                    title="Copy Transaction ID"
                    className="flex items-center space-x-1 px-2.5 py-1 bg-kaspa-card hover:bg-kaspa-cyan/20 text-slate-300 hover:text-kaspa-cyan border border-kaspa-border hover:border-kaspa-cyan/50 rounded-lg text-[11px] font-mono transition-all"
                  >
                    {copiedTxId === log.txId ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy TXID</span>
                      </>
                    )}
                  </button>

                  <a
                    href={getExplorerUrl(log.txId, log.network)}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`View transaction ${log.txId} in Kaspa Explorer`}
                    title="View in Kaspa Explorer"
                    className="flex items-center space-x-1 px-2.5 py-1 bg-kaspa-card hover:bg-kaspa-cyan/20 text-slate-300 hover:text-kaspa-cyan border border-kaspa-border hover:border-kaspa-cyan/50 rounded-lg text-[11px] font-mono transition-all"
                  >
                    <span>Explorer</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
