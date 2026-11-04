'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

// Fades content in and draws section rules as they scroll into view. Content is
// fully visible without JavaScript: nothing is hidden until this has mounted.
// Re-runs on every page change so client-side navigation is covered too.
export default function RevealObserver() {
  const pathname = usePathname();
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('.reveal:not(.is-in), .draw-in:not(.is-in)'));
    const io = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('is-in');
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
    );
    els.forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.92) el.classList.add('is-in');
      else io.observe(el);
    });
    document.documentElement.classList.add('js-reveal');
    return () => io.disconnect();
  }, [pathname]);
  return null;
}
