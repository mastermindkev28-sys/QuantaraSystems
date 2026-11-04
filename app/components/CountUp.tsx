'use client';

import { useEffect, useRef, useState } from 'react';

// Counts up to a whole number once, when it first scrolls into view.
// Non-numeric values (like ∞) are shown as-is.
export default function CountUp({ value, duration = 1400 }: { value: string; duration?: number }) {
  const target = /^\d+$/.test(value) ? Number(value) : null;
  const [shown, setShown] = useState(value);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (target === null || !el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setShown('0');
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const tick = (t: number) => {
        const p = Math.min((t - start) / duration, 1);
        setShown(String(Math.round((1 - Math.pow(1 - p, 3)) * target)));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.6 });
    io.observe(el);
    return () => io.disconnect();
  }, [target, duration]);
  return <span ref={ref}>{shown}</span>;
}
