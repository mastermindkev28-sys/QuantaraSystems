'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { NAV, NAV_CTA } from '../content';
import BookButton from './BookButton';
import QMark from './QMark';

export default function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [showCta, setShowCta] = useState(false);
  const [open, setOpen] = useState(false);
  const onConsultation = pathname === '/consultation';

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      const nearEnd = window.innerHeight + window.scrollY > document.body.scrollHeight - 900;
      setShowCta(window.scrollY > 640 && !nearEnd);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [pathname]);

  const active = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <header className={`nav${scrolled ? ' is-scrolled' : ''}${open ? ' is-open' : ''}`}>
        <div className="wrap nav__inner">
          <Link href="/" className="brand" aria-label="Quantara Systems home">
            <QMark id="nav" size={30} />
            <span className="brand__word">
              Quantara <span>Systems</span>
            </span>
          </Link>
          <nav className="nav__links" aria-label="Main">
            {NAV.map(l => (
              <Link key={l.href} href={l.href} aria-current={active(l.href) ? 'page' : undefined}>{l.label}</Link>
            ))}
          </nav>
          <div className="nav__actions">
            {!onConsultation && <BookButton size="sm" arrow={false} className="nav__cta">{NAV_CTA}</BookButton>}
            <button
              className="nav__toggle"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
              onClick={() => setOpen(o => !o)}
            >
              <span /><span />
            </button>
          </div>
        </div>
        <nav id="mobile-menu" className="nav__menu" aria-label="Main" hidden={!open}>
          <div className="wrap">
            {NAV.map(l => (
              <Link key={l.href} href={l.href} aria-current={active(l.href) ? 'page' : undefined}>{l.label}</Link>
            ))}
            <BookButton>{NAV_CTA}</BookButton>
          </div>
        </nav>
      </header>
      {!onConsultation && (
        <div className={`mobile-cta${showCta && !open ? ' is-shown' : ''}`} aria-hidden={!showCta}>
          <BookButton>{NAV_CTA}</BookButton>
        </div>
      )}
    </>
  );
}
