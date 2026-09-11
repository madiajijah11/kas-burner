import React, { useState, useEffect } from 'react';
import { Copy, Check, AlertTriangle, Flame, ShieldAlert, X } from 'lucide-react';
import { BurnerWallet } from '../types/wallet';
import { safeCopyToClipboard } from '../utils/clipboard';

export interface KeyBackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  actionType: 'sweep' | 'burn';
  wallet: BurnerWallet | null;
  balanceKAS: number;
  destinationAddress?: string;
}

export const KeyBackupModal: React.FC<KeyBackupModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  actionType,
  wallet,
  balanceKAS,
  destinationAddress,
}) => {
  const [hasCopied, setHasCopied] = useState(false);
  const [isAcknowledged, setIsAcknowledged] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setHasCopied(false);
      setIsAcknowledged(false);

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen || !wallet) return null;

  const handleCopy = async () => {
    const success = await safeCopyToClipboard(wallet.privateKeyHex);
    if (success) {
      setHasCopied(true);
      setIsAcknowledged(true);
    }
  };

  const isUnlockEnabled = hasCopied || isAcknowledged;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
    >
      <div className="bg-kaspa-card border border-kaspa-border rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 relative overflow-hidden">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-slate-400 hover:text-white rounded-lg hover:bg-kaspa-dark transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3">
          {actionType === 'burn' ? (
            <div className="p-2.5 bg-red-950/40 border border-red-500/40 rounded-xl">
              <Flame className="w-6 h-6 text-red-400 animate-pulse" />
            </div>
          ) : (
            <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl">
              <ShieldAlert className="w-6 h-6 text-amber-400" />
            </div>
          )}
          <div>
            <h3 id="modal-title" className="text-base font-mono font-bold text-white">
              {actionType === 'burn' ? 'Emergency Burn Confirmation' : 'Backup Private Key Before Sweep'}
            </h3>
            <p className="text-xs font-mono text-slate-400">
              {actionType === 'burn'
                ? 'RAM will be zeroed (0x00) immediately. Key cannot be recovered.'
                : 'Permanent key wipe occurs immediately upon transaction broadcast.'}
            </p>
          </div>
        </div>

        {/* Active balance warning when balanceKAS > 0 */}
        {balanceKAS > 0 && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-xs font-mono text-amber-300 flex items-start space-x-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <span className="font-bold">Active Balance: {balanceKAS.toFixed(6)} KAS.</span>{' '}
              {actionType === 'burn'
                ? 'Burning this wallet now will permanently vaporize these funds without recovery.'
                : 'If network broadcast encounters issues or the destination address is invalid, you will need this private key to recover your balance.'}
            </div>
          </div>
        )}

        {/* Destination cold wallet address display when actionType === 'sweep' */}
        {actionType === 'sweep' && destinationAddress && (
          <div className="bg-kaspa-dark/80 border border-kaspa-border/70 rounded-xl p-3 text-xs font-mono">
            <span className="text-slate-400 block mb-1">Destination Cold Wallet:</span>
            <code className="text-kaspa-cyan break-all select-all font-mono">{destinationAddress}</code>
          </div>
        )}

        {/* Ephemeral private key display & 1-click copy */}
        <div className="space-y-2">
          <label className="text-xs font-mono text-slate-400">
            Ephemeral Private Key (Hex):
          </label>
          <div className="bg-kaspa-dark border border-kaspa-border rounded-xl p-3 flex flex-col gap-2">
            <code className="font-mono text-xs text-amber-300 break-all select-all">
              {wallet.privateKeyHex}
            </code>
            <button
              type="button"
              onClick={handleCopy}
              className={`flex items-center justify-center space-x-2 py-2 px-3 rounded-lg text-xs font-mono transition-all ${
                hasCopied
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold'
                  : 'bg-kaspa-card hover:bg-kaspa-cyan/20 text-slate-200 hover:text-kaspa-cyan border border-kaspa-border'
              }`}
            >
              {hasCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Private Key Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Private Key (Recommended)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Checkbox acknowledgment */}
        <label className="flex items-start space-x-2.5 cursor-pointer pt-1">
          <input
            type="checkbox"
            checked={isAcknowledged}
            onChange={(e) => setIsAcknowledged(e.target.checked)}
            className="mt-0.5 rounded border-kaspa-border bg-kaspa-dark text-kaspa-cyan focus:ring-0 focus:ring-offset-0"
          />
          <span className="text-xs font-mono text-slate-300 select-none leading-relaxed">
            I understand that this private key will be permanently purged from memory (0x00) and cannot be recovered.
          </span>
        </label>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-4 bg-kaspa-dark hover:bg-kaspa-card text-slate-400 hover:text-white border border-kaspa-border rounded-xl font-mono text-xs transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={!isUnlockEnabled}
            className={`py-2.5 px-4 rounded-xl font-mono text-xs font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed ${
              actionType === 'burn'
                ? 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-950/50'
                : 'bg-gradient-to-r from-kaspa-cyan to-kaspa-glow text-black shadow-lg shadow-kaspa-cyan/20'
            }`}
          >
            {actionType === 'burn' ? 'Confirm Burn (Wipe RAM)' : 'Confirm & Sweep Funds'}
          </button>
        </div>
      </div>
    </div>
  );
};
