import React from 'react';
import { DeliveryStop } from '../../data/mockStops';
import { Check, X } from 'lucide-react';

interface HorizontalProgressRailProps {
  stops: DeliveryStop[];
  activeIndex: number;
  onSelectIndex: (index: number) => void;
  className?: string;
}

export const HorizontalProgressRail: React.FC<HorizontalProgressRailProps> = ({
  stops,
  activeIndex,
  onSelectIndex,
  className = '',
}) => {
  return (
    <div className={`w-full overflow-x-auto py-1 px-1 flex items-center gap-1.5 no-scrollbar select-none ${className}`}>
      {stops.map((stop, idx) => {
        const isCurrent = idx === activeIndex;
        const isCompleted = stop.status === 'completed';
        const isSkipped = stop.status === 'skipped';
        const isHigh = stop.priority === 'high';

        let bgClass = 'bg-[var(--color-surface)] text-[var(--color-ink)] border-[var(--color-border)] hover:bg-[var(--color-bg-sunken)]';
        if (isCompleted) {
          bgClass = 'bg-[#E3EEE6] dark:bg-[#1E2B25] text-[#4F7A66] dark:text-[#A9C4B0] border-[#4F7A66]/30 dark:border-[#A9C4B0]/40 font-semibold';
        } else if (isSkipped) {
          bgClass = 'bg-[#FBE1DB] dark:bg-[#2C1917] text-[#D9604C] dark:text-[#F4A58A] border-[#D9604C]/30 dark:border-[#F4A58A]/40 font-semibold';
        } else if (isCurrent) {
          bgClass = 'bg-[var(--color-marigold)] text-[#1F2A27] border-[#E0A11B] ring-2 ring-[var(--color-marigold)]/30 shadow-sm font-bold scale-105';
        }

        return (
          <button
            key={stop.id}
            type="button"
            onClick={() => onSelectIndex(idx)}
            className={`min-w-[40px] h-8 px-2 flex items-center justify-center gap-1 rounded-full border font-mono font-medium text-xs transition-all cursor-pointer shrink-0 ${bgClass}`}
            title={`#${stop.order} ${stop.recipientName} (${stop.area})`}
          >
            {isCompleted ? (
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
            ) : isSkipped ? (
              <X className="w-3.5 h-3.5 stroke-[2.5]" />
            ) : (
              <span>#{stop.order}</span>
            )}
            {isHigh && !isCompleted && !isSkipped && (
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-priority-high)] shrink-0" />
            )}
          </button>
        );
      })}
    </div>
  );
};