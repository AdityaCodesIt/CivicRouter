import React from 'react';
import { PriorityLevel } from '../../data/mockStops';
import { Flame } from 'lucide-react';

interface PriorityBadgeProps {
  priority: PriorityLevel;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({
  priority,
  showLabel = true,
  size = 'md',
  className = '',
}) => {
  const sizeStyles = {
    sm: 'text-[11px] py-0.5 px-2.5 font-mono font-medium',
    md: 'text-xs py-1 px-3 font-mono font-medium',
    lg: 'text-sm py-1.5 px-3.5 font-mono font-medium',
  }[size];

  if (priority === 'high') {
    // High Priority: Filled Flame + Terracotta
    return (
      <span
        title="High Priority — Time Critical Delivery"
        className={`inline-flex items-center gap-1.5 bg-[#FBE1DB] text-[#D9604C] border border-[#D9604C]/30 rounded-full shadow-warm-sm ${sizeStyles} ${className}`}
      >
        <Flame className="w-3.5 h-3.5 fill-[#D9604C] shrink-0" />
        {showLabel && <span className="tracking-tight">High Priority</span>}
      </span>
    );
  }

  if (priority === 'medium') {
    // Medium Priority: Half Circle icon + Marigold
    return (
      <span
        title="Medium Priority — Scheduled Window"
        className={`inline-flex items-center gap-1.5 bg-[#FBEBC6] text-[#E0A11B] border border-[#E0A11B]/30 rounded-full shadow-warm-sm ${sizeStyles} ${className}`}
      >
        <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 16 16" fill="currentColor">
          <path d="M 8 1 A 7 7 0 0 0 8 15 L 8 1 Z" />
          <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
        {showLabel && <span className="tracking-tight">Medium</span>}
      </span>
    );
  }

  // Low Priority: Outline Circle icon + Sage
  return (
    <span
      title="Low Priority — Flexible Window"
      className={`inline-flex items-center gap-1.5 bg-[#E3EEE6] text-[#4F7A66] border border-[#4F7A66]/30 rounded-full shadow-warm-sm ${sizeStyles} ${className}`}
    >
      <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75">
        <circle cx="8" cy="8" r="6" />
      </svg>
      {showLabel && <span className="tracking-tight">Low</span>}
    </span>
  );
};
