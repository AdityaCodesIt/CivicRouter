import React from 'react';
import { motion } from 'framer-motion';
import { motionTokens } from './tokens';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ children, className = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: motionTokens.distances.sm }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -motionTokens.distances.sm }}
      transition={{
        duration: motionTokens.durations.base,
        ease: motionTokens.ease,
      }}
      className={`w-full ${className}`}
    >
      {children}
    </motion.div>
  );
};

