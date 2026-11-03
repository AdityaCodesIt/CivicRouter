import React from 'react';

export const EmptyStopsIllustration: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <svg
      viewBox="0 0 240 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-48 h-36 mx-auto ${className}`}
      aria-hidden="true"
    >
      <rect x="40" y="25" width="160" height="130" rx="14" fill="#F2ECE1" />
      <rect x="45" y="20" width="150" height="130" rx="12" fill="#FFFDF9" stroke="#E6DECF" strokeWidth="1.5" />

      {/* Clipboard clip */}
      <rect x="90" y="12" width="60" height="16" rx="6" fill="#F2B84B" />
      <circle cx="120" cy="20" r="3" fill="#1F2A27" />

      {/* Gentle dashed route map inside clipboard */}
      <path
        d="M 65 60 C 85 45, 110 75, 130 55 C 150 35, 160 85, 175 70"
        stroke="#F2B84B"
        strokeWidth="2.5"
        strokeDasharray="5 4"
        strokeLinecap="round"
      />

      {/* Waypoint pins */}
      <circle cx="65" cy="60" r="5" fill="#3F8F66" stroke="#FFFDF9" strokeWidth="2" />
      <circle cx="130" cy="55" r="5" fill="#F2B84B" stroke="#FFFDF9" strokeWidth="2" />
      <circle cx="175" cy="70" r="6" fill="#D9604C" stroke="#FFFDF9" strokeWidth="2" />

      {/* Soft delivery parcel */}
      <g transform="translate(140, 100)">
        <rect x="0" y="0" width="40" height="36" rx="4" fill="#FBEBC6" stroke="#D3C8B4" strokeWidth="1.5" />
        <line x1="20" y1="0" x2="20" y2="36" stroke="#E0A11B" strokeWidth="1.5" strokeDasharray="3 2" />
        <line x1="0" y1="18" x2="40" y2="18" stroke="#E0A11B" strokeWidth="1.5" strokeDasharray="3 2" />
      </g>

      {/* Soft checklist lines */}
      <rect x="65" y="95" width="60" height="6" rx="3" fill="#E3EEE6" />
      <rect x="65" y="110" width="50" height="6" rx="3" fill="#F2ECE1" />
      <rect x="65" y="125" width="40" height="6" rx="3" fill="#F2ECE1" />
    </svg>
  );
};

