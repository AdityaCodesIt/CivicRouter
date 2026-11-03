import React from 'react';

export const DottedDivider: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`w-full py-6 flex items-center justify-center overflow-hidden opacity-60 ${className}`}>
      <svg width="280" height="20" viewBox="0 0 280 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M 10 10 Q 70 2 140 10 T 270 10"
          stroke="#D3C8B4"
          strokeWidth="2"
          strokeDasharray="4 4"
          strokeLinecap="round"
        />
        <circle cx="10" cy="10" r="3" fill="#A9C4B0" />
        <circle cx="140" cy="10" r="4" fill="#F2B84B" />
        <circle cx="270" cy="10" r="3" fill="#F4A58A" />
      </svg>
    </div>
  );
};

