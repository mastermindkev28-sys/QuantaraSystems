'use client';

import { CALENDLY_URL } from '../content';
import { Arrow } from './Icons';

declare global {
  interface Window {
    Calendly?: { initPopupWidget: (o: { url: string }) => void };
  }
}

// A real link to the booking page, upgraded to Calendly's in-page popup once its
// script has loaded. If the script is blocked, the link still works.
export default function BookButton({
  children,
  variant = 'primary',
  size,
  arrow = true,
  className = '',
}: {
  children: React.ReactNode;
  variant?: 'primary' | 'ghost';
  size?: 'sm';
  arrow?: boolean;
  className?: string;
}) {
  return (
    <a
      href={CALENDLY_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`btn btn--${variant}${size ? ` btn--${size}` : ''} ${className}`}
      onClick={e => {
        if (window.Calendly) {
          e.preventDefault();
          window.Calendly.initPopupWidget({ url: CALENDLY_URL });
        }
      }}
    >
      {children}
      {arrow && <Arrow />}
    </a>
  );
}
