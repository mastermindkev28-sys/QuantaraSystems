'use client';

import { useEffect } from 'react';

// Fades sections in as they scroll into view. Content is fully visible without
// JavaScript: elements are only hidden once this has mounted and marked the page.
export default function RevealObserver() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('.reveal'));
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
      // Anything already on screen is shown straight away, so nothing flickers.
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.92) el.classList.add('is-in');
      else io.observe(el);
    });
    document.documentElement.classList.add('js-reveal');
    return () => io.disconnect();
  }, []);
  return null;
}
