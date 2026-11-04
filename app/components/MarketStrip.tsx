'use client';

import { useEffect, useState } from 'react';
import { goldSession } from '../lib/goldSession';
import { fmtPrice, useMarkets } from '../lib/useMarkets';
import Sparkline from './Sparkline';

const KEYS = [
  { key: 'GC', label: 'Gold' },
  { key: 'MNQ', label: 'Micro Nasdaq-100' },
  { key: 'MES', label: 'Micro S&P 500' },
  { key: 'SPX', label: 'S&P 500' },
  { key: 'DXY', label: 'US Dollar Index' },
  { key: 'BTC', label: 'Bitcoin' },
];

export default function MarketStrip() {
  const markets = useMarkets();
  // Computed after mount so server and browser markup match.
  const [gold, setGold] = useState<{ open: boolean; label: string } | null>(null);
  useEffect(() => {
    const tick = () => setGold(goldSession());
    tick();
    const iv = setInterval(tick, 30_000);
    return () => clearInterval(iv);
  }, []);

  return (
    <section className="strip" aria-label="Markets">
      <div className="wrap">
        <div className="strip__row">
          {KEYS.map(({ key, label }) => {
            const q = markets?.data.find(d => d.key === key);
            const ok = q && !q.error && typeof q.price === 'number';
            const up = (q?.change ?? 0) >= 0;
            return (
              <div className="quote" key={key}>
                <div className="quote__top">
                  <span>{key}</span>
                  <span>
                    {key === 'GC' && gold ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                        {gold.open && <span className="live-dot" />}
                        {gold.label}
                      </span>
                    ) : label}
                  </span>
                </div>
                <div className="quote__px">{ok ? fmtPrice(q!.price!) : '—'}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span className={`quote__chg ${ok ? (up ? 'up' : 'down') : 'muted'}`}>
                    {ok ? `${up ? '+' : ''}${q!.changePct!.toFixed(2)}%` : '—'}
                  </span>
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <Sparkline id={`q-${key}`} points={ok ? q!.points : undefined} positive={up} height={18} />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
