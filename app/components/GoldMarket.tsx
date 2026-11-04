'use client';

import { useEffect, useState } from 'react';
import { MARKETS } from '../content';
import { goldSession } from '../lib/goldSession';
import { fmtPrice, useMarkets } from '../lib/useMarkets';
import Sparkline from './Sparkline';

// Gold market panel: delayed GC quote, intraday path and COMEX contract details.
export default function GoldMarket() {
  const markets = useMarkets();
  const gc = markets?.data.find(q => q.key === 'GC');
  const ok = !!gc && !gc.error && typeof gc.price === 'number';
  const up = (gc?.change ?? 0) >= 0;
  const [session, setSession] = useState<{ open: boolean; label: string } | null>(null);
  useEffect(() => {
    const t = () => setSession(goldSession());
    t();
    const iv = setInterval(t, 30_000);
    return () => clearInterval(iv);
  }, []);

  return (
    <div className="gold">
      <div className="gold__quote">
        <div className="gold__head mono">
          <span className="gold__code">GC</span>
          <span>COMEX Gold · front month</span>
          <span className="gold__session">
            {session?.open && <span className="live-dot" />}
            {session ? session.label : '—'}
          </span>
        </div>
        <div className="gold__px mono">
          {ok ? fmtPrice(gc!.price!) : '—'}
          {ok && <span className={up ? 'up' : 'down'}>{up ? '+' : ''}{fmtPrice(gc!.change!)} ({up ? '+' : ''}{gc!.changePct!.toFixed(2)}%)</span>}
        </div>
        <div className="gold__spark">
          <Sparkline id="gold" points={ok ? gc!.points : undefined} positive={up} height={92} color="var(--gold)" />
        </div>
        <dl className="gold__range mono">
          <div><dt>Day high</dt><dd>{ok && gc!.high ? fmtPrice(gc!.high) : '—'}</dd></div>
          <div><dt>Day low</dt><dd>{ok && gc!.low ? fmtPrice(gc!.low) : '—'}</dd></div>
          <div><dt>Prior settle</dt><dd>{ok && gc!.prev ? fmtPrice(gc!.prev) : '—'}</dd></div>
        </dl>
        <p className="gold__note">Delayed data, for reference only.</p>
      </div>

      <div className="gold__specs">
        <table className="specs">
          <caption className="mono">Contracts traded by QS1</caption>
          <thead>
            <tr><th scope="col">Contract</th><th scope="col">Size</th><th scope="col">Tick value</th></tr>
          </thead>
          <tbody>
            {MARKETS.contracts.map(c => (
              <tr key={c.code}>
                <th scope="row"><span className="mono gold__code">{c.code}</span> {c.name}</th>
                <td className="mono">{c.size}</td>
                <td className="mono">{c.tick}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <dl className="specs__meta">
          <div><dt>Exchange</dt><dd>{MARKETS.exchange}</dd></div>
          <div><dt>Trading hours</dt><dd>{MARKETS.hours}</dd></div>
        </dl>
      </div>
    </div>
  );
}
