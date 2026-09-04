import React from 'react';
import { Clock, RotateCcw, AlertTriangle } from 'lucide-react';

interface AutoExpiryTimerProps {
  remainingSeconds: number;
  duration: number;
  isBlockedByBalance: boolean;
  onDurationChange: (minutes: number) => void;
  onReset: () => void;
}

const PRESETS = [
  { label: '15m', minutes: 15 },
  { label: '1h', minutes: 60 },
  { label: '24h', minutes: 1440 },
];

export const AutoExpiryTimer: React.FC<AutoExpiryTimerProps> = ({
  remainingSeconds,
  duration,
  isBlockedByBalance,
  onDurationChange,
  onReset,
}) => {
  // Format seconds into HH:MM:SS or MM:SS
  const formatTime = (totalSeconds: number): string => {
    const safeSeconds = Math.max(0, Math.floor(totalSeconds || 0));
    const hours = Math.floor(safeSeconds / 3600);
    const minutes = Math.floor((safeSeconds % 3600) / 60);
    const seconds = safeSeconds % 60;

    const pad = (num: number) => num.toString().padStart(2, '0');

    if (hours > 0) {
      return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    }
    return `${pad(minutes)}:${pad(seconds)}`;
  };

  return (
    <div className="mb-4 bg-kaspa-dark/70 border border-kaspa-border/60 rounded-xl p-3.5 space-y-2.5">
      {/* Top row: Label, Crisp Timer, Presets, and Reset */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <Clock className={`w-4 h-4 ${isBlockedByBalance ? 'text-amber-400 animate-pulse' : 'text-kaspa-cyan'}`} />
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Auto-Expiry</span>
          <span
            className={`text-sm font-mono font-bold tracking-tight tabular-nums ${
              isBlockedByBalance ? 'text-amber-400' : 'text-white'
            }`}
          >
            {formatTime(remainingSeconds)}
          </span>
        </div>

        <div className="flex items-center space-x-1.5">
          {PRESETS.map(preset => (
            <button
              key={preset.minutes}
              type="button"
              onClick={() => onDurationChange(preset.minutes)}
              aria-label={`Set auto-expiry to ${preset.label}`}
              className={`px-2 py-0.5 rounded text-[11px] font-mono transition-all ${
                duration === preset.minutes
                  ? 'bg-kaspa-cyan/20 border border-kaspa-cyan text-kaspa-cyan font-semibold'
                  : 'bg-kaspa-card border border-kaspa-border text-slate-400 hover:text-slate-200'
              }`}
            >
              {preset.label}
            </button>
          ))}
          <button
            type="button"
            onClick={onReset}
            className="p-1 text-slate-400 hover:text-kaspa-cyan rounded hover:bg-kaspa-card transition-colors"
            title="Reset Inactivity Timer"
            aria-label="Reset inactivity timer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Safety Warning Banner if wipe is halted due to active balance */}
      {isBlockedByBalance && (
        <div role="alert" className="flex items-start space-x-2 bg-amber-500/10 border border-amber-500/30 rounded-lg p-2.5 text-xs font-mono text-amber-300 animate-fade-in">
          <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-400" />
          <p className="leading-relaxed">
            Inactivity limit reached. Private key preserved because wallet holds active funds. Sweep funds to cold storage to clear memory.
          </p>
        </div>
      )}
    </div>
  );
};
