import React from 'react';
import { motion, Variants } from 'framer-motion';
import { motionTokens } from './tokens';

export type RevealVariant =
  | 'fadeUp'
  | 'fadeIn'
  | 'slideLeft'
  | 'slideRight'
  | 'scaleIn'
  | 'blurIn';

interface RevealProps {
  children: React.ReactNode;
  variant?: RevealVariant;
  delay?: number;
  duration?: number;
  className?: string;
  distance?: number;
}

export const Reveal: React.FC<RevealProps> = ({
  children,
  variant = 'fadeUp',
  delay = 0,
  duration = motionTokens.durations.slow,
  className = '',
  distance = motionTokens.distances.md,
}) => {
  const getVariants = (): Variants => {
    switch (variant) {
      case 'fadeUp':
        return {
          hidden: { opacity: 0, y: distance },
          visible: { opacity: 1, y: 0 },
        };
      case 'fadeIn':
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1 },
        };
      case 'slideLeft':
        return {
          hidden: { opacity: 0, x: distance },
          visible: { opacity: 1, x: 0 },
        };
      case 'slideRight':
        return {
          hidden: { opacity: 0, x: -distance },
          visible: { opacity: 1, x: 0 },
        };
      case 'scaleIn':
        return {
          hidden: { opacity: 0, scale: 0.95 },
          visible: { opacity: 1, scale: 1 },
        };
      case 'blurIn':
        return {
          hidden: { opacity: 0, filter: 'blur(4px)' },
          visible: { opacity: 1, filter: 'blur(0px)' },
        };
      default:
        return {
          hidden: { opacity: 0, y: distance },
          visible: { opacity: 1, y: 0 },
        };
    }
  };

  return (
    <motion.div
      variants={getVariants()}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-30px' }}
      transition={{
        duration,
        delay,
        ease: motionTokens.ease,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

