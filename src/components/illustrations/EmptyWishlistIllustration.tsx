import React from 'react';

export const EmptyWishlistIllustration: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <svg
      viewBox="0 0 240 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-48 h-36 mx-auto ${className}`}
      aria-hidden="true"
    >
      {/* Soft circular aura */}
      <circle cx="120" cy="90" r="70" fill="#FCE3D9" opacity="0.4" />
      <circle cx="120" cy="90" r="50" fill="#FBEBC6" opacity="0.5" />

      {/* Steaming cutting chai glass & saucer */}
      <g transform="translate(70, 75)">
        <ellipse cx="25" cy="45" rx="30" ry="6" fill="#D3C8B4" />
        <path d="M 12 10 L 16 42 L 34 42 L 38 10 Z" fill="#FBEBC6" stroke="#55625D" strokeWidth="1.5" />
        {/* Chai liquid */}
        <path d="M 14 18 L 17 40 L 33 40 L 36 18 Z" fill="#F4A58A" opacity="0.85" />
        {/* Steam whispers */}
        <path d="M 20 5 C 18 0, 24 -4, 20 -8" stroke="#8A948F" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M 28 4 C 30 -1, 26 -5, 29 -9" stroke="#8A948F" strokeWidth="1.5" strokeLinecap="round" />
      </g>

      {/* Tiffin Dabba container */}
      <g transform="translate(135, 60)">
        <rect x="0" y="24" width="36" height="18" rx="4" fill="#E3EEE6" stroke="#4F7A66" strokeWidth="1.5" />
        <rect x="0" y="44" width="36" height="18" rx="4" fill="#E3EEE6" stroke="#4F7A66" strokeWidth="1.5" />
        {/* Brass lock handle */}
        <path d="M 18 10 L 18 24" stroke="#F2B84B" strokeWidth="2.5" />
        <path d="M 10 10 L 26 10" stroke="#F2B84B" strokeWidth="2.5" strokeLinecap="round" />
      </g>

      {/* Detour map radar ping */}
      <circle cx="185" cy="45" r="14" fill="#FAF6EF" stroke="#F2B84B" strokeWidth="1.5" />
      <path d="M 185 39 L 185 45 L 189 48" stroke="#1F2A27" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
};

export const CompletionIllustration: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <svg
      viewBox="0 0 240 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-48 h-36 mx-auto ${className}`}
      aria-hidden="true"
    >
      {/* Golden celebratory aura */}
      <circle cx="120" cy="90" r="65" fill="#FBEBC6" opacity="0.6" />

      {/* Success Badge */}
      <circle cx="120" cy="80" r="32" fill="#3F8F66" />
      <path
        d="M 108 80 L 116 88 L 132 72"
        stroke="#FFFDF9"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Stacked Delivered Parcels */}
      <g transform="translate(50, 115)">
        <rect x="0" y="10" width="46" height="26" rx="4" fill="#F2ECE1" stroke="#D3C8B4" strokeWidth="1.5" />
        <line x1="23" y1="10" x2="23" y2="36" stroke="#A9C4B0" strokeWidth="1.5" />
      </g>
      <g transform="translate(145, 110)">
        <rect x="0" y="15" width="44" height="26" rx="4" fill="#FBEBC6" stroke="#E0A11B" strokeWidth="1.5" />
        <line x1="22" y1="15" x2="22" y2="41" stroke="#F4A58A" strokeWidth="1.5" />
      </g>

      {/* Soft confetti dots in palette */}
      <circle cx="65" cy="45" r="4" fill="#F2B84B" />
      <circle cx="85" cy="30" r="3" fill="#A9C4B0" />
      <circle cx="155" cy="35" r="4" fill="#F4A58A" />
      <circle cx="175" cy="55" r="3.5" fill="#A8C5DA" />
      <circle cx="110" cy="22" r="3" fill="#D9604C" />
      <circle cx="130" cy="28" r="4" fill="#4F7A66" />
    </svg>
  );
};

