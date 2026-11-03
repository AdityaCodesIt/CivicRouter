import React from 'react';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  sublabel?: string;
  id?: string;
  className?: string;
}

export const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  label,
  sublabel,
  id = 'transit-toggle',
  className = '',
}) => {
  return (
    <label
      htmlFor={id}
      className={`inline-flex items-center justify-between gap-4 cursor-pointer select-none py-2 w-full ${className}`}
    >
      {(label || sublabel) && (
        <div className="flex flex-col pr-2">
          {label && (
            <span className="font-display font-bold text-sm text-[#1F2A27] dark:text-[#FAF6EF]">
              {label}
            </span>
          )}
          {sublabel && (
            <span className="font-body text-xs text-[#55625D] dark:text-[#95A39D] mt-0.5 leading-relaxed">
              {sublabel}
            </span>
          )}
        </div>
      )}

      <div className="relative shrink-0">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
        />
        <div
          className={`w-12 h-7 rounded-full border transition-colors duration-250 ease-out p-0.5 ${
            checked
              ? 'bg-[#F2B84B] border-[#E0A11B]/50'
              : 'bg-[#F2ECE1] dark:bg-[#25302C] border-[#E6DECF] dark:border-[#384A43]'
          }`}
        >
          <div
            className={`w-6 h-6 rounded-full bg-white dark:bg-[#FAF6EF] shadow-warm-sm transition-transform duration-250 cubic-bezier(0.22, 1, 0.36, 1) flex items-center justify-center ${
              checked ? 'translate-x-5' : 'translate-x-0'
            }`}
          >
            {checked && <div className="w-2 h-2 rounded-full bg-[#1F2A27]" />}
          </div>
        </div>
      </div>
    </label>
  );
};
