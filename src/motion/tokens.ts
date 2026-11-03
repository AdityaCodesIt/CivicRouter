export const motionTokens = {
  durations: {
    fast: 0.15,
    base: 0.25,
    slow: 0.45,
    hero: 0.7,
  },
  ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
  spring: {
    type: 'spring' as const,
    damping: 25,
    stiffness: 300,
  },
  distances: {
    sm: 8,
    md: 16,
    lg: 24,
  },
};

