import React from 'react';

interface IllustrationProps {
  className?: string;
  size?: number;
}

/**
 * Empty Delivery Manifest Clipboard Illustration
 * Redesigned in Soft Mumbai Morning Palette:
 * Cream #FAF6EF, Marigold #F2B84B, Sage #A9C4B0, Ink #1F2A27.
 */
export const EmptyClipboardIllustration: React.FC<IllustrationProps> = ({
  className = '',
  size = 140,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 160 160"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`select-none ${className}`}
    aria-hidden="true"
  >
    {/* Soft Shadow */}
    <rect x="36" y="24" width="94" height="118" rx="14" fill="#F2ECE1" />

    {/* Clipboard Base */}
    <rect
      x="33"
      y="21"
      width="94"
      height="118"
      rx="14"
      fill="#FFFDF9"
      stroke="#E6DECF"
      strokeWidth="1.5"
    />

    {/* Top Clip */}
    <rect
      x="60"
      y="13"
      width="40"
      height="16"
      rx="6"
      fill="#F2B84B"
    />
    <circle cx="80" cy="21" r="3" fill="#1F2A27" />

    {/* Dashed Route Line on Sheet */}
    <path
      d="M 50 60 C 65 50, 80 75, 95 60 C 105 50, 110 80, 115 75"
      stroke="#F2B84B"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeDasharray="4 4"
    />

    {/* Soft waypoint dots */}
    <circle cx="50" cy="60" r="4.5" fill="#3F8F66" stroke="#FFFDF9" strokeWidth="1.5" />
    <circle cx="95" cy="60" r="4.5" fill="#F2B84B" stroke="#FFFDF9" strokeWidth="1.5" />
    <circle cx="115" cy="75" r="5" fill="#D9604C" stroke="#FFFDF9" strokeWidth="1.5" />

    {/* Soft note lines */}
    <rect x="50" y="94" width="55" height="5" rx="2.5" fill="#E3EEE6" />
    <rect x="50" y="105" width="45" height="5" rx="2.5" fill="#F2ECE1" />
    <rect x="50" y="116" width="35" height="5" rx="2.5" fill="#F2ECE1" />
  </svg>
);

/**
 * Empty Delivery Scooter Illustration
 */
export const EmptyScooterIllustration: React.FC<IllustrationProps> = ({
  className = '',
  size = 140,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 160 160"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`select-none ${className}`}
    aria-hidden="true"
  >
    {/* Soft Road Ground Line */}
    <path
      d="M 20 125 C 60 123, 100 127, 140 125"
      stroke="#D3C8B4"
      strokeWidth="2"
      strokeDasharray="6 4"
    />

    {/* Rear Cargo Box */}
    <rect x="32" y="65" width="34" height="28" rx="6" fill="#FBEBC6" stroke="#E0A11B" strokeWidth="1.5" />
    <line x1="49" y1="65" x2="49" y2="93" stroke="#E0A11B" strokeWidth="1.5" />

    {/* Scooter Body Frame */}
    <path
      d="M 45 92 L 65 92 L 80 80 L 105 80 L 115 50"
      stroke="#1F2A27"
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    {/* Wheels with Soft Hubs */}
    <circle cx="50" cy="115" r="14" fill="#F2ECE1" stroke="#1F2A27" strokeWidth="3" />
    <circle cx="50" cy="115" r="5" fill="#F2B84B" />

    <circle cx="112" cy="115" r="14" fill="#F2ECE1" stroke="#1F2A27" strokeWidth="3" />
    <circle cx="112" cy="115" r="5" fill="#F2B84B" />

    {/* Handlebars & Headlamp */}
    <path d="M 110 50 L 122 50" stroke="#1F2A27" strokeWidth="3.5" strokeLinecap="round" />
    <circle cx="122" cy="53" r="4" fill="#F2B84B" />
  </svg>
);

/**
 * Offline Mode / Resilient Transit Illustration
 */
export const OfflineModeIllustration: React.FC<IllustrationProps> = ({
  className = '',
  size = 140,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 160 160"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`select-none ${className}`}
    aria-hidden="true"
  >
    {/* Soft Aura */}
    <circle cx="80" cy="80" r="55" fill="#E3EEE6" opacity="0.6" />

    {/* Phone Device Outline */}
    <rect
      x="52"
      y="32"
      width="56"
      height="96"
      rx="12"
      fill="#FFFDF9"
      stroke="#4F7A66"
      strokeWidth="2"
    />

    {/* Inner Screen Offline Route */}
    <rect x="57" y="44" width="46" height="72" rx="6" fill="#F2ECE1" />
    <path
      d="M 64 65 Q 80 80 75 95"
      stroke="#F2B84B"
      strokeWidth="2.5"
      strokeDasharray="4 3"
      strokeLinecap="round"
    />
    <circle cx="64" cy="65" r="3.5" fill="#3F8F66" />
    <circle cx="75" cy="95" r="3.5" fill="#D9604C" />

    {/* Cloud / Wifi Check indicator */}
    <circle cx="114" cy="110" r="16" fill="#3F8F66" stroke="#FFFDF9" strokeWidth="2.5" />
    <path
      d="M 108 110 L 112 114 L 120 106"
      stroke="#FFFDF9"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
