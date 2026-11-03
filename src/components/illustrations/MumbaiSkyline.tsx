import React from 'react';

interface IllustrationProps {
  className?: string;
  width?: number | string;
  height?: number | string;
}

export const MumbaiSkyline: React.FC<IllustrationProps> = ({
  className = '',
  width = '100%',
  height = '140',
}) => {
  return (
    <svg
      viewBox="0 0 1000 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-full overflow-visible ${className}`}
      style={{ width, height, maxHeight: '200px' }}
      aria-label="Stylised Mumbai Skyline with Sea Link and Local Train"
    >
      <defs>
        {/* Morning haze gradient */}
        <linearGradient id="mumbaiHaze" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#A8C5DA" stopOpacity="0.25" />
          <stop offset="60%" stopColor="#FBEBC6" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#FAF6EF" stopOpacity="0" />
        </linearGradient>

        {/* Sea horizon gradient */}
        <linearGradient id="seaGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#A8C5DA" stopOpacity="0.3" />
          <stop offset="50%" stopColor="#A9C4B0" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#A8C5DA" stopOpacity="0.3" />
        </linearGradient>
      </defs>

      {/* Soft Morning Sky Backdrop */}
      <rect x="0" y="20" width="1000" height="150" fill="url(#mumbaiHaze)" rx="12" />

      {/* Arabian Sea Waves / Shimmer line */}
      <path
        d="M 0 160 Q 250 155 500 160 T 1000 160 L 1000 190 L 0 190 Z"
        fill="url(#seaGradient)"
      />

      {/* Bandra-Worli Sea Link Towers */}
      {/* Tower 1 */}
      <polygon points="180,30 190,150 170,150" fill="#55625D" opacity="0.35" />
      <polygon points="179,30 183,30 187,150 173,150" fill="#4F7A66" opacity="0.5" />
      {/* Stay Cables */}
      <line x1="180" y1="50" x2="100" y2="150" stroke="#8A948F" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
      <line x1="180" y1="65" x2="120" y2="150" stroke="#8A948F" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
      <line x1="180" y1="80" x2="140" y2="150" stroke="#8A948F" strokeWidth="1" opacity="0.6" />
      <line x1="180" y1="50" x2="260" y2="150" stroke="#8A948F" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
      <line x1="180" y1="65" x2="240" y2="150" stroke="#8A948F" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
      <line x1="180" y1="80" x2="220" y2="150" stroke="#8A948F" strokeWidth="1" opacity="0.6" />

      {/* Tower 2 */}
      <polygon points="320,30 330,150 310,150" fill="#55625D" opacity="0.35" />
      <polygon points="319,30 323,30 327,150 313,150" fill="#4F7A66" opacity="0.5" />
      {/* Tower 2 Cables */}
      <line x1="320" y1="50" x2="260" y2="150" stroke="#8A948F" strokeWidth="1" opacity="0.6" />
      <line x1="320" y1="65" x2="280" y2="150" stroke="#8A948F" strokeWidth="1" opacity="0.6" />
      <line x1="320" y1="50" x2="380" y2="150" stroke="#8A948F" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
      <line x1="320" y1="65" x2="360" y2="150" stroke="#8A948F" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />

      {/* Sea Link Road Deck */}
      <path
        d="M 50 150 Q 250 148 450 150"
        stroke="#1F2A27"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <path
        d="M 50 153 Q 250 151 450 153"
        stroke="#F2B84B"
        strokeWidth="1.5"
        strokeDasharray="6 4"
      />

      {/* Mumbai Highrise Silhouettes (Lower Parel / Dadar) */}
      <rect x="470" y="70" width="28" height="80" rx="3" fill="#A9C4B0" opacity="0.4" />
      <rect x="505" y="55" width="34" height="95" rx="3" fill="#A8C5DA" opacity="0.45" />
      <rect x="545" y="85" width="24" height="65" rx="2" fill="#F4A58A" opacity="0.4" />
      <rect x="575" y="60" width="38" height="90" rx="4" fill="#4F7A66" opacity="0.3" />

      {/* Chawl Slanted Rooftops with Mangalore tiles */}
      <polygon points="630,120 645,108 670,120" fill="#D9604C" opacity="0.75" />
      <rect x="633" y="120" width="34" height="30" fill="#FAF6EF" stroke="#55625D" strokeWidth="1" />
      <polygon points="675,116 690,104 715,116" fill="#D9604C" opacity="0.75" />
      <rect x="678" y="116" width="34" height="34" fill="#F2ECE1" stroke="#55625D" strokeWidth="1" />

      {/* Suburban Local Train on Railway Trestle */}
      <line x1="730" y1="145" x2="940" y2="145" stroke="#8A948F" strokeWidth="2" strokeDasharray="2 2" />
      <rect x="740" y="126" width="55" height="18" rx="3" fill="#F4A58A" opacity="0.8" />
      <rect x="740" y="135" width="55" height="4" fill="#4F7A66" />
      <circle cx="750" cy="144" r="3" fill="#1F2A27" />
      <circle cx="785" cy="144" r="3" fill="#1F2A27" />

      <rect x="800" y="126" width="55" height="18" rx="3" fill="#F4A58A" opacity="0.8" />
      <rect x="800" y="135" width="55" height="4" fill="#4F7A66" />
      <circle cx="810" cy="144" r="3" fill="#1F2A27" />
      <circle cx="845" cy="144" r="3" fill="#1F2A27" />

      {/* Mumbai Auto-Rickshaw & Delivery Bike Silhouette */}
      <g transform="translate(880, 134) scale(0.75)">
        {/* Yellow & Black auto hood */}
        <path d="M 0 12 L 8 4 L 24 4 L 28 14 L 28 22 L 0 22 Z" fill="#F2B84B" />
        <rect x="0" y="16" width="28" height="6" fill="#1F2A27" />
        <circle cx="6" cy="22" r="4" fill="#1F2A27" />
        <circle cx="22" cy="22" r="4" fill="#1F2A27" />
      </g>

      {/* Winding Marigold Delivery Transit Trail */}
      <path
        d="M 120 168 C 250 160, 380 178, 520 166 C 660 154, 780 174, 950 165"
        stroke="#F2B84B"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="8 6"
      />
      {/* Route Stops / Waypoints */}
      <circle cx="280" cy="164" r="5" fill="#F2B84B" stroke="#FFFDF9" strokeWidth="2" />
      <circle cx="520" cy="166" r="6" fill="#3F8F66" stroke="#FFFDF9" strokeWidth="2" />
      <circle cx="750" cy="168" r="5" fill="#D9604C" stroke="#FFFDF9" strokeWidth="2" />
    </svg>
  );
};

