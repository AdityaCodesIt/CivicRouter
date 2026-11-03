import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../common/Button';
import { DeliveryStop } from '../../data/mockStops';
import { CompletionIllustration } from '../illustrations/CompletionIllustration';
import { RotateCcw, ArrowRight, IndianRupee } from 'lucide-react';

interface EndOfDayCelebrationProps {
  stops: DeliveryStop[];
  completedCount: number;
  totalKm: number;
  timeSavedMinutes: number;
  totalCodAmount: number;
  onReset: () => void;
}

export const EndOfDayCelebration: React.FC<EndOfDayCelebrationProps> = ({
  stops,
  completedCount,
  totalKm,
  timeSavedMinutes,
  totalCodAmount,
  onReset,
}) => {
  const navigate = useNavigate();
  const rate = Math.round((completedCount / Math.max(stops.length, 1)) * 100);

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <div className="soft-card p-6 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-md text-center">
        {/* Soft Completion Illustration */}
        <div className="w-24 h-24 mx-auto mb-2">
          <CompletionIllustration className="w-full h-full" />
        </div>

        <div className="font-mono text-[11px] font-semibold text-[var(--color-ink-muted)] uppercase tracking-widest">
          Shift Run Complete · Transit Logged
        </div>

        <h1 className="font-display font-bold text-2xl text-[var(--color-ink)] mt-1 mb-1">
          Manifest Cleared!
        </h1>

        <p className="font-body text-xs text-[var(--color-ink-secondary)] mb-6 max-w-xs mx-auto">
          All parcels accounted for across the Mumbai corridor. Your on-time delivery record has been preserved.
        </p>

        {/* Shift Key Metrics Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6 text-left">
          <div className="p-3 bg-[var(--color-bg-sunken)] border border-[var(--color-border)] rounded-xl">
            <div className="font-mono text-[10px] font-medium text-[var(--color-ink-muted)] uppercase tracking-wide">
              Delivery Success
            </div>
            <div className="font-mono font-bold text-xl text-[var(--color-ink)] mt-0.5 tabular-nums">
              {completedCount} / {stops.length}
            </div>
            <div className="font-mono text-[10px] text-[var(--color-status-success)] font-semibold">
              {rate}% on time
            </div>
          </div>

          <div className="p-3 bg-[var(--color-bg-sunken)] border border-[var(--color-border)] rounded-xl">
            <div className="font-mono text-[10px] font-medium text-[var(--color-ink-muted)] uppercase tracking-wide">
              Time Saved
            </div>
            <div className="font-mono font-bold text-xl text-[var(--color-status-success)] mt-0.5 tabular-nums">
              ~{timeSavedMinutes}m
            </div>
            <div className="font-mono text-[10px] text-[var(--color-ink-muted)]">
              vs Google Maps
            </div>
          </div>

          <div className="p-3 bg-[var(--color-bg-sunken)] border border-[var(--color-border)] rounded-xl">
            <div className="font-mono text-[10px] font-medium text-[var(--color-ink-muted)] uppercase tracking-wide">
              Distance Run
            </div>
            <div className="font-mono font-bold text-xl text-[var(--color-ink)] mt-0.5 tabular-nums">
              {totalKm} km
            </div>
            <div className="font-mono text-[10px] text-[var(--color-ink-muted)]">
              Optimal corridor
            </div>
          </div>

          <div className="p-3 bg-[var(--color-bg-sunken)] border border-[var(--color-border)] rounded-xl">
            <div className="font-mono text-[10px] font-medium text-[var(--color-ink-muted)] uppercase tracking-wide">
              COD Collected
            </div>
            <div className="font-mono font-bold text-xl text-[var(--color-ink)] mt-0.5 flex items-center tabular-nums">
              <IndianRupee className="w-4 h-4 text-[#8c5e03]" />
              <span>{totalCodAmount}</span>
            </div>
            <div className="font-mono text-[10px] text-[var(--color-ink-muted)]">
              Ready to remit
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-2.5">
          <Button
            variant="primary"
            size="touch"
            fullWidth
            onClick={() => navigate('/summary')}
            icon={<ArrowRight className="w-5 h-5 stroke-[2.5]" />}
          >
            View Full Shift Receipt
          </Button>

          <Button
            variant="secondary"
            size="md"
            fullWidth
            onClick={() => {
              onReset();
              navigate('/plan');
            }}
            icon={<RotateCcw className="w-4 h-4" />}
          >
            Start New Run Tomorrow
          </Button>
        </div>
      </div>
    </div>
  );
};