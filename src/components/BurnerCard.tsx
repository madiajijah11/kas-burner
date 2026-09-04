import React, { useState, useEffect } from 'react';
import { Copy, Check, QrCode, RefreshCw, Key, ShieldAlert } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { BurnerWallet } from '../types/wallet';
import { safeCopyToClipboard } from '../utils/clipboard';
import { AutoExpiryTimer } from './AutoExpiryTimer';
import { useInactivityTimer } from '../hooks/useInactivityTimer';

interface BurnerCardProps {
  wallet: BurnerWallet | null;
  onRefresh: () => void;
  balanceKAS?: number;
  isTimerEnabled?: boolean;
  onExpire?: () => void;
}

export const BurnerCard: React.FC<BurnerCardProps> = ({
  wallet,
  onRefresh,
  balanceKAS = 0,
  isTimerEnabled = false,
  onExpire = () => {},
}) => {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [showPrivKey, setShowPrivKey] = useState(false);

  const timer = useInactivityTimer({
    durationMinutes: 60,
    balanceKAS,
    isEnabled: isTimerEnabled,
    onExpire,
  });

  // Automatically reset timer when new wallet is provisioned
  useEffect(() => {
    if (wallet?.address) {
      timer.resetTimer();
    }
  }, [wallet?.address]);

  const copyToClipboard = async (text: string) => {
    const success = await safeCopyToClipboard(text);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleManualRefresh = () => {
    timer.resetTimer();
    onRefresh();
  };

  if (!wallet) {
    return (
      <div className="bg-kaspa-card border border-kaspa-border rounded-2xl p-8 text-center animate-pulse">
        <RefreshCw className="w-8 h-8 text-kaspa-cyan animate-spin mx-auto mb-3" />
        <p className="text-sm font-mono text-slate-400">Generating fresh cryptographic keypair...</p>
      </div>
    );
  }

  return (
    <div className="bg-kaspa-card border border-kaspa-border/80 rounded-2xl p-6 shadow-xl relative overflow-hidden backdrop-blur-sm">
      <div className="absolute top-0 right-0 w-32 h-32 bg-kaspa-cyan/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-kaspa-glow animate-pulse" />
          <h2 className="text-sm font-mono uppercase tracking-wider text-slate-300 font-semibold">
            Active Burner Address
          </h2>
        </div>
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setShowQR(!showQR)}
            className="p-1.5 text-slate-400 hover:text-kaspa-cyan rounded-lg hover:bg-kaspa-dark transition-colors"
            title="Toggle QR Code"
            aria-label="Toggle QR Code"
          >
            <QrCode className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleManualRefresh}
            className="p-1.5 text-slate-400 hover:text-kaspa-cyan rounded-lg hover:bg-kaspa-dark transition-colors"
            title="Generate Fresh Keypair"
            aria-label="Generate Fresh Keypair"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Auto-Expiry Inactivity Countdown */}
      <AutoExpiryTimer
        remainingSeconds={timer.remainingSeconds}
        duration={timer.duration}
        isBlockedByBalance={timer.isBlockedByBalance}
        onDurationChange={timer.changeDuration}
        onReset={timer.resetTimer}
      />

      {/* QR Code Popover */}
      {showQR && (
        <div className="mb-5 flex flex-col items-center justify-center p-4 bg-white rounded-xl shadow-inner max-w-fit mx-auto animate-fade-in">
          <QRCodeSVG value={wallet.address} size={160} level="M" />
          <span className="text-[10px] font-mono text-slate-800 mt-2">Scan to Send KAS</span>
        </div>
      )}

      {/* Address Box */}
      <div className="bg-kaspa-dark/90 border border-kaspa-border/70 rounded-xl p-4 mb-4 group hover:border-kaspa-cyan/40 transition-colors">
        <div className="flex items-center justify-between gap-2">
          <code className="text-xs sm:text-sm font-mono text-kaspa-cyan break-all select-all font-medium leading-relaxed">
            {wallet.address}
          </code>
          <button
            type="button"
            onClick={() => copyToClipboard(wallet.address)}
            aria-label="Copy address to clipboard"
            className="flex-shrink-0 flex items-center space-x-1.5 px-3 py-2 bg-kaspa-card hover:bg-kaspa-cyan/20 text-slate-300 hover:text-kaspa-cyan border border-kaspa-border hover:border-kaspa-cyan/50 rounded-lg text-xs font-mono transition-all"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* In-Memory Key Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs font-mono text-slate-500 gap-2">
        <div className="flex items-center space-x-1.5">
          <Key className="w-3.5 h-3.5 text-amber-400/70" />
          <span>RAM-Only Private Key:</span>
          <button
            type="button"
            onClick={() => setShowPrivKey(!showPrivKey)}
            aria-label={showPrivKey ? 'Hide private key' : 'Reveal private key'}
            className="text-slate-400 hover:text-amber-300 underline text-[11px]"
          >
            {showPrivKey ? 'Hide' : 'Reveal (Debug)'}
          </button>
        </div>
        <span className="text-[11px] text-slate-600">Generated: {new Date(wallet.createdAt).toLocaleTimeString()}</span>
      </div>

      {showPrivKey && (
        <div className="mt-3 p-3 bg-red-950/20 border border-red-500/30 rounded-lg text-[11px] font-mono text-red-300 break-all">
          <div className="flex items-center space-x-1 mb-1 text-red-400 font-bold">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>WARNING: This will be wiped upon sweep/burn</span>
          </div>
          {wallet.privateKeyHex}
        </div>
      )}
    </div>
  );
};
