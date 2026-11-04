'use client';

import { fmtPrice, useMarkets } from '../lib/useMarkets';

const KEYS = [
  { key: 'GC', label: 'Gold Futures' },
  { key: 'MNQ', label: 'Micro Nasdaq-100' },
  { key: 'MES', label: 'Micro S&P 500' },
  { key: 'SPX', label: 'S&P 500' },
  { key: 'DXY', label: 'US Dollar Index' },
  { key: 'BTC', label: 'Bitcoin' },
];

const sessionLabel = (s?: string) =>
  s === 'REGULAR' ? 'Open' : s === 'PRE' ? 'Pre' : s === 'POST' || s === 'POSTPOST' ? 'After hrs' : s ? 'Closed' : '';

export default function MarketStrip() {
  const markets = useMarkets();
  return (
    <section className="strip mono" aria-label="Live markets">
      <div className="strip__row">
        {KEYS.map(({ key, label }) => {
          const q = markets?.data.find(d => d.key === key);
          const ok = q && !q.error && typeof q.price === 'number';
          const up = (q?.change ?? 0) >= 0;
          return (
            <div className="quote" key={key}>
              <div className="quote__top">
                <span style={{ color: key === 'GC' ? 'var(--silver-1)' : undefined }}>{key}</span>
                <span>{ok ? sessionLabel(q!.state) : ''}</span>
              </div>
              <div className="quote__px">{ok ? fmtPrice(q!.price!) : '—'}</div>
              <div className={`quote__chg ${ok ? (up ? 'up' : 'down') : 'muted'}`}>
                {ok ? `${up ? '+' : ''}${q!.changePct!.toFixed(2)}%` : label}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
