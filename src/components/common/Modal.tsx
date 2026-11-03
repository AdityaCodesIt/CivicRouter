import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  size = 'md',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const sizeClasses = {
    sm: 'sm:max-w-md',
    md: 'sm:max-w-lg',
    lg: 'sm:max-w-2xl',
  }[size];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          {/* Backdrop with soft blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-[#1F2A27]/40 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Dialog Container */}
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className={`relative w-full ${sizeClasses} bg-[#FFFDF9] dark:bg-[#1C2421] border border-[#E6DECF] dark:border-[#2B3833] rounded-t-[24px] sm:rounded-2xl shadow-warm-lg max-h-[90vh] flex flex-col z-10 overflow-hidden`}
          >
            {/* Mobile Drag Affordance Pill */}
            <div className="sm:hidden w-10 h-1 bg-[#8A948F]/40 rounded-full mx-auto mt-2.5 mb-1" />

            {/* Modal Header */}
            <div className="flex items-start justify-between px-6 py-4.5 border-b border-[#E6DECF] dark:border-[#2B3833] bg-[#FAF6EF]/70 dark:bg-[#141A18]/70">
              <div>
                <h2 className="font-display font-bold text-lg text-[#1F2A27] dark:text-[#FAF6EF]">
                  {title}
                </h2>
                {subtitle && (
                  <p className="font-body text-xs text-[#55625D] dark:text-[#95A39D] mt-0.5">
                    {subtitle}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#8A948F] hover:text-[#1F2A27] dark:hover:text-[#FAF6EF] hover:bg-[#F2ECE1] dark:hover:bg-[#25302C] transition-colors cursor-pointer"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4 stroke-[2]" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto flex-1">{children}</div>

            {/* Modal Footer */}
            {footer && (
              <div className="flex items-center justify-end gap-3 px-5 sm:px-6 py-3.5 sm:py-4 pb-[max(1rem,env(safe-area-inset-bottom,0px))] border-t border-[#E6DECF] dark:border-[#2B3833] bg-[#FAF6EF]/40 dark:bg-[#141A18]/40">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
