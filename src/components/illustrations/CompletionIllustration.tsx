import React from 'react';

interface CompletionIllustrationProps {
  className?: string;
}

export const CompletionIllustration: React.FC<CompletionIllustrationProps> = ({
  className = 'w-24 h-24',
}) => {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background Soft Glow */}
      <circle cx="60" cy="60" r="48" fill="var(--color-marigold-tint)" opacity="0.6" />

      {/* Confetti & Morning Sparkles */}
      <circle cx="28" cy="24" r="3" fill="var(--color-apricot)" />
      <circle cx="88" cy="20" r="2.5" fill="var(--color-sage-deep)" />
      <circle cx="98" cy="46" r="3" fill="var(--color-marigold)" />
      <circle cx="18" cy="56" r="2" fill="var(--color-sky-accent)" />
      <circle cx="24" cy="88" r="2.5" fill="var(--color-sage)" />
      <circle cx="94" cy="84" r="3" fill="var(--color-apricot)" />

      {/* Small sparkle stars */}
      <path
        d="M60 12 L61.5 17 L66.5 18.5 L61.5 20 L60 25 L58.5 20 L53.5 18.5 L58.5 17 Z"
        fill="var(--color-marigold)"
      />
      <path
        d="M82 34 L83 37 L86 38 L83 39 L82 42 L81 39 L78 38 L81 37 Z"
        fill="var(--color-sage-deep)"
      />

      {/* Stacked Parcels (Soft Mumbai style) */}
      {/* Bottom Large Box */}
      <rect
        x="32"
        y="62"
        width="56"
        height="36"
        rx="6"
        fill="var(--color-surface)"
        stroke="var(--color-ink)"
        strokeWidth="2"
      />
      {/* Box Tape / Ribbon */}
      <path
        d="M60 62 V98"
        stroke="var(--color-marigold)"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M32 80 H88"
        stroke="var(--color-border)"
        strokeWidth="2"
        strokeDasharray="3 3"
      />

      {/* Top Smaller Parcel */}
      <rect
        x="42"
        y="42"
        width="36"
        height="22"
        rx="4"
        fill="var(--color-bg-sunken)"
        stroke="var(--color-ink)"
        strokeWidth="2"
      />
      <path
        d="M60 42 V64"
        stroke="var(--color-sage-deep)"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Celebratory Rosette / Check Badge in Front */}
      <circle
        cx="78"
        cy="40"
        r="16"
        fill="var(--color-marigold)"
        stroke="var(--color-ink)"
        strokeWidth="2"
      />
      {/* Checkmark in Rosette */}
      <path
        d="M72 40 L76 44 L84 35"
        stroke="var(--color-ink)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
