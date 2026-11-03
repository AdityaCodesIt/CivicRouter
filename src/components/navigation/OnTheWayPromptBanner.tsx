import React from 'react';
import { useRoute } from '../../context/RouteContext';
import {
  ShoppingBag,
  Pill,
  CreditCard,
  Utensils,
  Fuel,
  Droplets,
  Coffee,
  Plus,
  X,
  Compass,
} from 'lucide-react';

export const getCategoryIcon = (category: string = 'shop', className: string = 'w-4 h-4') => {
  switch ((category || 'shop').toLowerCase()) {
    case 'shop':
      return <ShoppingBag className={className} />;
    case 'pharmacy':
      return <Pill className={className} />;
    case 'atm':
      return <CreditCard className={className} />;
    case 'food':
    case 'snack':
      return <Utensils className={className} />;
    case 'fuel':
      return <Fuel className={className} />;
    case 'restroom':
    case 'facility':
      return <Droplets className={className} />;
    case 'chai':
    default:
      return <Coffee className={className} />;
  }
};

interface OnTheWayPromptBannerProps {
  className?: string;
}

export const OnTheWayPromptBanner: React.FC<OnTheWayPromptBannerProps> = ({
  className = '',
}) => {
  const {
    activeOnTheWayPrompt,
    dismissOnTheWayPrompt,
    addPromptAsNextStop,
  } = useRoute();

  if (!activeOnTheWayPrompt) {
    return null;
  }

  const { name, category, distanceMeters, detourMinutes, landmark } =
    activeOnTheWayPrompt;

  return (
    <div
      className={`bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-md p-3.5 animate-in fade-in slide-in-from-top-3 duration-200 select-none ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Left: Icon & Notification Text */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-[var(--color-marigold-tint)] text-[var(--color-ink)] border border-[var(--color-marigold)]/30 flex items-center justify-center shrink-0">
            {getCategoryIcon(category, 'w-5 h-5 text-[#8c5e03] stroke-[2]')}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-semibold text-[#8c5e03] uppercase tracking-wider flex items-center gap-1">
                <Compass className="w-3 h-3" />
                On-The-Way Detected
              </span>
              <span className="font-mono text-[10px] font-semibold bg-[var(--color-bg-sunken)] text-[var(--color-ink)] border border-[var(--color-border)] px-1.5 py-0.5 rounded-full">
                +{detourMinutes} min
              </span>
            </div>

            <div className="font-body font-bold text-sm text-[var(--color-ink)] leading-snug truncate mt-0.5">
              {name}
            </div>

            <div className="font-body text-xs text-[var(--color-ink-secondary)] truncate">
              {distanceMeters}m off route · {landmark}
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
          <button
            type="button"
            onClick={dismissOnTheWayPrompt}
            className="h-9 px-3 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink-secondary)] hover:bg-[var(--color-bg-sunken)] font-body text-xs font-medium flex items-center gap-1 cursor-pointer transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            <span>Not Now</span>
          </button>

          <button
            type="button"
            onClick={() => addPromptAsNextStop(activeOnTheWayPrompt)}
            className="h-9 px-4 rounded-full bg-[var(--color-marigold)] hover:bg-[var(--color-marigold-hover)] text-[#1F2A27] font-body font-semibold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm transition-all active:scale-[0.98]"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Stop</span>
          </button>
        </div>
      </div>
    </div>
  );
};