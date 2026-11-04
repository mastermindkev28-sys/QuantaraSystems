'use client';

import { useEffect, useState } from 'react';
import { NAV, NAV_CTA } from '../content';
import BookButton from './BookButton';
import QMark from './QMark';

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [showCta, setShowCta] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      // The sticky mobile button appears once the hero's own buttons are off screen,
      // and steps aside at the bottom so it doesn't cover the final call to action.
      const nearEnd = window.innerHeight + window.scrollY > document.body.scrollHeight - 900;
      setShowCta(window.scrollY > 720 && !nearEnd);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <header className={`nav${scrolled ? ' is-scrolled' : ''}`}>
        <div className="wrap nav__inner">
          <a href="#top" className="brand" aria-label="Quantara Systems, back to top">
            <QMark id="nav" size={30} />
            <span className="brand__word">
              Quantara <span>Systems</span>
            </span>
          </a>
          <nav className="nav__links" aria-label="Sections">
            {NAV.map(l => (
              <a key={l.href} href={l.href}>{l.label}</a>
            ))}
          </nav>
          <BookButton size="sm" arrow={false}>{NAV_CTA}</BookButton>
        </div>
      </header>
      <div className={`mobile-cta${showCta ? ' is-shown' : ''}`} aria-hidden={!showCta}>
        <BookButton>Request a consultation</BookButton>
      </div>
    </>
  );
}
