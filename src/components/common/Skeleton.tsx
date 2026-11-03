import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'rect' | 'circle' | 'card';
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '', variant = 'rect' }) => {
  const variantStyles = {
    rect: 'rounded-xl',
    circle: 'rounded-full',
    card: 'rounded-2xl border border-[#E6DECF]/60 dark:border-[#2B3833]/60',
  }[variant];

  return (
    <div
      className={`relative overflow-hidden bg-[#F2ECE1]/80 dark:bg-[#1E2724] ${variantStyles} ${className}`}
      aria-hidden="true"
    >
      {/* Warm soft shimmer gradient sweep */}
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_infinite] bg-gradient-to-r from-transparent via-[#FFFDF9]/60 dark:via-[#FAF6EF]/10 to-transparent" />
    </div>
  );
};
