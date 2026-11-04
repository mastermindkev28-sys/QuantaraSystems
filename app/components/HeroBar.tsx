'use client';

import { useEffect, useState } from 'react';
import { fmtPrice, useMarkets } from '../lib/useMarkets';
import Sparkline from './Sparkline';

// COMEX gold trades on CME Globex from Sunday 6pm to Friday 5pm New York time,
// with a one-hour break at 5pm each weekday.
function goldSession(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', weekday: 'short', hour: 'numeric', hour12: false }).formatToParts(now);
  const day = parts.find(p => p.type === 'weekday')?.value;
  const hour = Number(parts.find(p => p.type === 'hour')?.value) % 24;
  if (day === 'Sat' || (day === 'Fri' && hour >= 17) || (day === 'Sun' && hour < 18)) return { open: false, label: 'Closed · weekend' };
  if (hour === 17) return { open: false, label: 'Closed · daily break' };
  return { open: true, label: 'Open' };
}

const nyTime = () =>
  new Date().toLocaleTimeString('en-US', {
    timeZone: 'America/New_York',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

export default function HeroBar() {
  const markets = useMarkets();
  const gc = markets?.data.find(q => q.key === 'GC');
  const live = !!gc && !gc.error && typeof gc.price === 'number';
  const up = (gc?.change ?? 0) >= 0;

  // Rendered after mount only, so server and browser markup always match.
  const [clock, setClock] = useState('');
  const [sess, setSess] = useState<{ open: boolean; label: string } | null>(null);
  useEffect(() => {
    const tick = () => {
      setClock(nyTime());
      setSess(goldSession());
    };
    tick();
    const iv = setInterval(tick, 1000);
    return () => clearInterval(iv);
  }, []);

  return (
    <div className="hero__bar" aria-label="Market details">
      <div className="cell" style={{ gridTemplateColumns: '1fr auto' }}>
        <span className="cell__k">Gold futures · COMEX</span>
        <span className="cell__spark" style={{ gridRow: 'span 2' }}>
          <Sparkline id="bar" points={live ? gc!.points : undefined} positive={up} height={34} />
        </span>
        <span className="cell__v mono">
          {live ? `$${fmtPrice(gc!.price!)}` : '—'}
          {live && <small className={up ? 'up' : 'down'}>{up ? '+' : ''}{gc!.changePct!.toFixed(2)}%</small>}
        </span>
      </div>
      <div className="cell">
        <span className="cell__k">Session</span>
        <span className="cell__v">
          {sess?.open && <span className="live-dot" style={{ alignSelf: 'center' }} />}
          {sess ? sess.label : '—'}
        </span>
      </div>
      <div className="cell">
        <span className="cell__k">New York</span>
        <span className="cell__v mono">{clock || '—'}</span>
      </div>
      <div className="cell">
        <span className="cell__k">Execution</span>
        <span className="cell__v">Fully automated</span>
      </div>
    </div>
  );
}
