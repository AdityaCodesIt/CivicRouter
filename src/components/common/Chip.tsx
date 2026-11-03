import React from 'react';

interface ChipProps {
  label: string;
  active?: boolean;
  count?: number | string;
  icon?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  active = false,
  count,
  icon,
  onClick,
  className = '',
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-body font-medium transition-all duration-200 cursor-pointer select-none ${
        active
          ? 'bg-[#F2B84B] text-[#1F2A27] border-[#E0A11B]/40 shadow-warm-sm font-semibold'
          : 'bg-[#FFFDF9] dark:bg-[#1C2421] text-[#55625D] dark:text-[#95A39D] hover:text-[#1F2A27] dark:hover:text-[#FAF6EF] border-[#E6DECF] dark:border-[#2B3833] hover:bg-[#F2ECE1] dark:hover:bg-[#25302C]'
      } ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span className="whitespace-nowrap">{label}</span>
      {count !== undefined && (
        <span
          className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono tabular-nums leading-none ${
            active
              ? 'bg-[#1F2A27] text-[#FAF6EF]'
              : 'bg-[#F2ECE1] dark:bg-[#2B3833] text-[#55625D] dark:text-[#95A39D]'
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
};
