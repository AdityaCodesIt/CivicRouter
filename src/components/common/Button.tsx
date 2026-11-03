import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'asphalt' | 'sage';
  size?: 'sm' | 'md' | 'lg' | 'touch' | 'giant';
  fullWidth?: boolean;
  icon?: React.ReactNode;
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'touch',
  fullWidth = false,
  icon,
  loading = false,
  className = '',
  disabled,
  ...props
}) => {
  // Size classes: 'touch' guarantees minimum 56px height, 'giant' gives 72px for Driver HUD
  const sizeClasses = {
    sm: 'h-9 px-3.5 text-xs font-mono font-medium',
    md: 'h-11 px-5 text-sm font-semibold',
    lg: 'h-13 px-6 text-base font-bold',
    touch: 'min-h-[56px] px-6 text-base font-bold tracking-tight',
    giant: 'min-h-[72px] px-8 text-lg font-extrabold tracking-tight',
  }[size];

  // Soft Mumbai morning aesthetic variants
  const variantClasses = {
    primary:
      'bg-[#F2B84B] text-[#1F2A27] hover:bg-[#E9A92F] active:bg-[#DF9D23] shadow-warm hover:shadow-warm-md border border-[#E0A11B]/40 relative overflow-hidden group',
    secondary:
      'bg-[#FFFDF9] dark:bg-[#1C2421] text-[#1F2A27] dark:text-[#FAF6EF] hover:bg-[#F2ECE1] dark:hover:bg-[#25302C] border border-[#E6DECF] dark:border-[#2B3833] shadow-warm-sm hover:shadow-warm',
    sage:
      'bg-[#E3EEE6] dark:bg-[#1E2B25] text-[#4F7A66] dark:text-[#A9C4B0] hover:bg-[#D5E5D9] border border-[#A9C4B0]/40 shadow-warm-sm',
    danger:
      'bg-[#D9604C] text-[#FFFDF9] hover:bg-[#C94B3B] active:bg-[#B33E30] shadow-warm border border-[#C94B3B]/40',
    asphalt:
      'bg-[#1F2A27] text-[#FAF6EF] hover:bg-[#2C3B37] active:bg-[#141A18] shadow-warm border border-[#1F2A27]',
    ghost:
      'bg-transparent text-[#1F2A27] dark:text-[#FAF6EF] hover:bg-[#F2ECE1]/60 dark:hover:bg-[#1C2421]/60 border border-transparent',
  }[variant];

  const disabledClasses = disabled || loading
    ? 'opacity-45 cursor-not-allowed shadow-none'
    : 'cursor-pointer active:scale-[0.975]';

  return (
    <button
      className={`inline-flex items-center justify-center gap-2.5 rounded-full font-body transition-all duration-200 select-none focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#F2B84B] focus-visible:ring-offset-2 ${sizeClasses} ${variantClasses} ${disabledClasses} ${
        fullWidth ? 'w-full' : ''
      } ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {/* Soft sheen sweep animation on hover */}
      {variant === 'primary' && !disabled && (
        <span className="absolute inset-0 w-1/2 h-full bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-700 pointer-events-none" />
      )}

      {loading ? (
        <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" />
      ) : (
        icon && <span className="shrink-0 flex items-center justify-center transition-transform group-hover:scale-105">{icon}</span>
      )}
      <span className="whitespace-nowrap">{children}</span>
    </button>
  );
};
