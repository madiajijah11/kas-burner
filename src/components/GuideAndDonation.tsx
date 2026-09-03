import React, { useState } from 'react';
import { HelpCircle, Heart, Copy, Check, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { safeCopyToClipboard } from '../utils/clipboard';

interface GuideAndDonationProps {
  donationAddress: string;
}

export const GuideAndDonation: React.FC<GuideAndDonationProps> = ({ donationAddress }) => {
  const [isGuideOpen, setIsGuideOpen] = useState(true);
  const [copiedDonation, setCopiedDonation] = useState(false);
  const [showDonationQR, setShowDonationQR] = useState(false);

  const copyDonation = async () => {
    const success = await safeCopyToClipboard(donationAddress);
    if (success) {
      setCopiedDonation(true);
      setTimeout(() => setCopiedDonation(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Beginner Guide Section */}
      <div className="bg-kaspa-card border border-kaspa-border rounded-2xl overflow-hidden shadow-xl">
        <button
          onClick={() => setIsGuideOpen(!isGuideOpen)}
          className="w-full p-5 flex items-center justify-between text-left hover:bg-kaspa-dark/50 transition-colors"
        >
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-kaspa-cyan/10 text-kaspa-cyan rounded-lg border border-kaspa-cyan/30">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
                How It Works (Beginner's Guide)
              </h3>
              <p className="text-xs font-mono text-slate-400">
                Simple 3-step privacy workflow without exposing your primary wallet
              </p>
            </div>
          </div>
          <div className="text-slate-400 hover:text-white">
            {isGuideOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
        </button>

        {isGuideOpen && (
          <div className="p-5 pt-0 border-t border-kaspa-border/50 bg-kaspa-dark/40 font-mono text-xs text-slate-300 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              {/* Step 1 */}
              <div className="p-4 bg-kaspa-card/80 border border-kaspa-border/60 rounded-xl space-y-2">
                <div className="flex items-center space-x-2 text-kaspa-cyan font-bold">
                  <span className="w-5 h-5 rounded-full bg-kaspa-cyan/20 border border-kaspa-cyan/40 flex items-center justify-center text-[11px]">
                    1
                  </span>
                  <span>Share Burner Address</span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  The address above is generated client-side in RAM. Copy and send it to the sender (exchange, peer, or service).
                </p>
              </div>

              {/* Step 2 */}
              <div className="p-4 bg-kaspa-card/80 border border-kaspa-border/60 rounded-xl space-y-2">
                <div className="flex items-center space-x-2 text-kaspa-glow font-bold">
                  <span className="w-5 h-5 rounded-full bg-kaspa-glow/20 border border-kaspa-glow/40 flex items-center justify-center text-[11px]">
                    2
                  </span>
                  <span>Wait For Incoming KAS</span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Incoming balance is detected automatically in real-time as soon as the transaction reaches the Kaspa BlockDAG.
                </p>
              </div>

              {/* Step 3 */}
              <div className="p-4 bg-kaspa-card/80 border border-kaspa-border/60 rounded-xl space-y-2">
                <div className="flex items-center space-x-2 text-emerald-400 font-bold">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-[11px]">
                    3
                  </span>
                  <span>Sweep & Erase</span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Enter your real destination wallet, click <strong>Sweep</strong>, and all funds transfer while the burner key is permanently zeroed.
                </p>
              </div>
            </div>

            <div className="p-3 bg-amber-950/20 border border-amber-500/30 rounded-xl text-[11px] text-amber-200/90 leading-relaxed">
              <strong>Important OPSEC Rule:</strong> Do not refresh or close the tab before sweeping funds. Burner private keys are ephemeral and only exist in active browser RAM.
            </div>
          </div>
        )}
      </div>

      {/* Developer Donation Section */}
      <div className="bg-gradient-to-r from-kaspa-card to-[#161F26] border border-kaspa-cyan/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start space-x-3">
            <div className="p-2.5 bg-kaspa-cyan/15 text-kaspa-cyan border border-kaspa-cyan/30 rounded-xl flex-shrink-0 mt-0.5">
              <Heart className="w-5 h-5 text-kaspa-cyan fill-kaspa-cyan/20 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-mono font-bold text-white flex items-center gap-1.5">
                  Support the Developer <Sparkles className="w-3.5 h-3.5 text-kaspa-glow" />
                </h3>
              </div>
              <p className="text-xs font-mono text-slate-400 mt-1">
                If this tool helps your Kaspa OPSEC, small donations help cover development, hosting, and future updates.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 flex-shrink-0">
            <button
              onClick={() => setShowDonationQR(!showDonationQR)}
              className="px-3 py-2 bg-kaspa-dark hover:bg-kaspa-card text-slate-300 border border-kaspa-border hover:border-kaspa-cyan/50 rounded-xl text-xs font-mono transition-all"
            >
              {showDonationQR ? 'Hide QR' : 'Donation QR'}
            </button>
          </div>
        </div>

        {/* Donation QR */}
        {showDonationQR && (
          <div className="mt-4 p-4 bg-white rounded-xl shadow-inner max-w-fit mx-auto flex flex-col items-center">
            <QRCodeSVG value={donationAddress} size={150} level="M" />
            <span className="text-[10px] font-mono text-slate-800 mt-2">Scan to Donate KAS</span>
          </div>
        )}

        {/* Donation Address Box */}
        <div className="mt-4 bg-kaspa-dark/90 border border-kaspa-border rounded-xl p-3.5 flex items-center justify-between gap-2">
          <code className="text-xs font-mono text-slate-300 break-all select-all">
            {donationAddress}
          </code>
          <button
            onClick={copyDonation}
            className="flex-shrink-0 flex items-center space-x-1.5 px-3 py-1.5 bg-kaspa-card hover:bg-kaspa-cyan/20 text-slate-300 hover:text-kaspa-cyan border border-kaspa-border hover:border-kaspa-cyan/50 rounded-lg text-xs font-mono transition-all"
          >
            {copiedDonation ? (
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
    </div>
  );
};