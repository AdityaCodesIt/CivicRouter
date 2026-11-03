import { useState, useEffect, useRef } from 'react';

export function useCountUp(
  target: number,
  duration: number = 1.2,
  startOnView: boolean = true
): { value: number; ref: React.RefObject<HTMLSpanElement | null> } {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement | null>(null);
  const started = useRef(false);

  useEffect(() => {
    if (!startOnView) {
      animateValue(0, target, duration);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          animateValue(0, target, duration);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [target, duration, startOnView]);

  function animateValue(start: number, end: number, dur: number) {
    if (start === end) {
      setValue(end);
      return;
    }

    const startTime = performance.now();
    const durationMs = dur * 1000;

    function step(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (end - start) * ease);
      setValue(current);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setValue(end);
      }
    }

    requestAnimationFrame(step);
  }

  return { value, ref };
}

