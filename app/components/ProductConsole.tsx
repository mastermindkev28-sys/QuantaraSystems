'use client';

import { useEffect, useMemo, useState } from 'react';
import { goldSession } from '../lib/goldSession';
import { fmtPrice, useMarkets } from '../lib/useMarkets';

// Illustrative QS1 interface for the hero. Chart, conditions, checks and orders
// are illustrative and labelled as such; only the GC quote in the header is real
// (delayed market data).

const CONDITIONS = 6;
const CHECKS = 5;
const ENTRY = 4018.4, STOP = 4012.4, TARGET = 4030.4;

// Sequence: conditions align one by one, risk checks pass, order goes out, fills.
const PHASES = [
  ...Array.from({ length: CONDITIONS + 1 }, (_, i) => ({ c: i, r: 0, o: 0 })),
  ...Array.from({ length: CHECKS }, (_, i) => ({ c: CONDITIONS, r: i + 1, o: 0 })),
  { c: CONDITIONS, r: CHECKS, o: 1 },
  { c: CONDITIONS, r: CHECKS, o: 2 },
  { c: CONDITIONS, r: CHECKS, o: 3 },
];
const HOLD_STEPS = 6;

const EVENTS = (p: { c: number; r: number; o: number }) => {
  const e: [string, string][] = [['DATA', 'Feed healthy · 1m bars synchronized'], ['REGIME', 'Trending · volatility within range']];
  if (p.c > 0) e.push(['SIGNAL', `Confluence ${p.c} / ${CONDITIONS} conditions aligned`]);
  if (p.c === CONDITIONS) e.push(['SIGNAL', 'Long setup qualified']);
  if (p.r > 0) e.push(['RISK', `Pre-trade checks ${p.r} / ${CHECKS} passed`]);
  if (p.o >= 1) e.push(['ORDER', `Bracket sent · buy 5 MGC @ ${fmtPrice(ENTRY).slice(0, -1)}`]);
  if (p.o >= 2) e.push(['FILL', `Filled 5 @ ${fmtPrice(ENTRY).slice(0, -1)} · stop and target working`]);
  if (p.o >= 3) e.push(['MANAGE', 'Position open · managing by rule']);
  return e.slice(-4);
};

// Deterministic illustrative price path ending at the entry level.
function useCandles() {
  return useMemo(() => {
    let seed = 11;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647) - 0.5;
    const n = 64, out: { o: number; h: number; l: number; c: number }[] = [];
    let p = 4000;
    for (let i = 0; i < n; i++) {
      const drift = i < 18 ? -0.12 : i < 46 ? 0.62 : 0.28;
      const o = p;
      const c = +(o + drift + rnd() * 2.2).toFixed(1);
      const h = Math.max(o, c) + Math.abs(rnd()) * 0.9;
      const l = Math.min(o, c) - Math.abs(rnd()) * 0.9;
      out.push({ o, h, l, c });
      p = c;
    }
    const shift = ENTRY - out[n - 1].c;
    return out.map(k => ({ o: k.o + shift, h: k.h + shift, l: k.l + shift, c: k.c + shift }));
  }, []);
}

export default function ProductConsole() {
  const markets = useMarkets();
  const gc = markets?.data.find(q => q.key === 'GC');
  const live = !!gc && !gc.error && typeof gc.price === 'number';
  const candles = useCandles();

  const [step, setStep] = useState(PHASES.length - 1);
  const [clock, setClock] = useState('');
  const [session, setSession] = useState<{ open: boolean; label: string } | null>(null);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const tick = () => {
      setClock(new Date().toLocaleTimeString('en-US', { timeZone: 'America/New_York', hour12: false }));
      setSession(goldSession());
    };
    tick();
    const clockIv = setInterval(tick, 1000);
    if (reduce) return () => clearInterval(clockIv);
    setStep(0);
    let i = 0;
    const iv = setInterval(() => {
      i = (i + 1) % (PHASES.length + HOLD_STEPS);
      setStep(Math.min(i, PHASES.length - 1));
    }, 650);
    return () => { clearInterval(iv); clearInterval(clockIv); };
  }, []);

  const phase = PHASES[step];
  const qualified = phase.c === CONDITIONS;
  const verified = phase.r === CHECKS;

  // Chart geometry
  const W = 760, H = 330, padR = 70, padT = 16, padB = 22;
  const lo = Math.min(STOP - 2, ...candles.map(k => k.l)) - 1, hi = Math.max(TARGET + 2, ...candles.map(k => k.h));
  const y = (v: number) => padT + (1 - (v - lo) / (hi - lo)) * (H - padT - padB);
  const cw = (W - padR) / (candles.length + 10);
  const grid = [3996, 4002, 4008, 4014, 4020, 4026, 4032].filter(v => v > lo + 1 && v < hi - 1);
  const lastX = cw * (candles.length - 0.5);

  return (
    <div className="pc" role="img" aria-label="Illustrative QS1 interface showing a gold futures chart, confluence conditions, pre-trade risk checks and an order ticket">
      <div className="pc__bar mono">
        <span className="pc__brand">QS1</span>
        <span className="pc__tabs">
          <span className="is-on">MGC</span>
          <span>GC</span>
        </span>
        <span className="pc__quote">
          <span className="pc__k">GC delayed</span>
          {live ? <>{fmtPrice(gc!.price!)} <span className={(gc!.change ?? 0) >= 0 ? 'up' : 'down'}>{(gc!.changePct ?? 0) >= 0 ? '+' : ''}{gc!.changePct!.toFixed(2)}%</span></> : '—'}
        </span>
        <span className="pc__spacer" />
        <span className="pc__k hide-sm">{session ? `Session · ${session.label}` : ''}</span>
        <span className="pc__k hide-sm">{clock && `NY ${clock}`}</span>
        <span className="pc__badge">Illustrative</span>
      </div>

      <div className="pc__body">
        <div className="pc__chart">
          <div className="pc__chart-head mono">
            <span>MGC · Micro Gold · 1m</span>
            <span className="pc__k">Illustrative data</span>
          </div>
          <svg viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
            {grid.map(v => (
              <g key={v}>
                <line x1="0" x2={W - padR} y1={y(v)} y2={y(v)} style={{ stroke: 'rgba(var(--tint),0.07)' }} />
                <text x={W - padR + 8} y={y(v) + 4} className="pc__axis">{v.toFixed(1)}</text>
              </g>
            ))}
            {candles.map((k, i) => {
              const x = cw * (i + 0.5), up = k.c >= k.o;
              const col = up ? 'var(--up)' : 'var(--down)';
              return (
                <g key={i} style={{ opacity: 0.85 }}>
                  <line x1={x} x2={x} y1={y(k.h)} y2={y(k.l)} style={{ stroke: col }} strokeWidth="1" />
                  <rect x={x - cw * 0.32} width={cw * 0.64} y={y(Math.max(k.o, k.c))} height={Math.max(1, Math.abs(y(k.o) - y(k.c)))} style={{ fill: col }} />
                </g>
              );
            })}
            {/* Bracket levels appear once the order is sent */}
            <g style={{ opacity: phase.o >= 1 ? 1 : 0, transition: 'opacity .5s' }}>
              {[
                { v: TARGET, label: 'TARGET', c: 'var(--steel)' },
                { v: ENTRY, label: 'ENTRY', c: 'var(--text)' },
                { v: STOP, label: 'STOP', c: 'var(--down)' },
              ].map(l => (
                <g key={l.label}>
                  <line x1={lastX} x2={W - padR} y1={y(l.v)} y2={y(l.v)} strokeDasharray={l.label === 'ENTRY' ? undefined : '4 4'} style={{ stroke: l.c }} />
                  <rect x={W - padR + 2} y={y(l.v) - 9} width={padR - 4} height="18" style={{ fill: l.c }} />
                  <text x={W - padR + 8} y={y(l.v) + 4} className="pc__axis pc__axis--inv">{l.v.toFixed(1)}</text>
                  <text x={W - padR - 6} y={y(l.v) - 5} textAnchor="end" className="pc__axis" style={{ fill: l.c }}>{l.label}</text>
                </g>
              ))}
            </g>
            {/* Qualification marker */}
            <g style={{ opacity: qualified ? 1 : 0, transition: 'opacity .4s' }}>
              <circle cx={lastX} cy={y(ENTRY)} r="5" style={{ fill: 'var(--cyan)' }} />
              <circle cx={lastX} cy={y(ENTRY)} r="11" fill="none" style={{ stroke: 'rgba(var(--cyan-rgb),0.4)' }} />
            </g>
          </svg>
        </div>

        <div className="pc__side">
          <section className="pc__panel">
            <h3 className="pc__h mono">Market state</h3>
            <dl className="pc__rows mono">
              <div><dt>Regime</dt><dd>Trending</dd></div>
              <div><dt>Volatility</dt><dd>Within range</dd></div>
              <div><dt>Event window</dt><dd>Clear</dd></div>
            </dl>
          </section>
          <section className="pc__panel">
            <h3 className="pc__h mono">
              Confluence <span className={qualified ? 'pc__ok' : ''}>{phase.c} / {CONDITIONS}</span>
            </h3>
            <div className="pc__meter" aria-hidden="true">
              {Array.from({ length: CONDITIONS }, (_, i) => <i key={i} className={i < phase.c ? 'is-on' : ''} />)}
            </div>
            <p className="pc__state mono">{qualified ? 'Setup qualified' : 'Evaluating conditions'}</p>
          </section>
          <section className="pc__panel">
            <h3 className="pc__h mono">
              Pre-trade risk <span className={verified ? 'pc__ok' : ''}>{phase.r} / {CHECKS}</span>
            </h3>
            <div className="pc__meter pc__meter--risk" aria-hidden="true">
              {Array.from({ length: CHECKS }, (_, i) => <i key={i} className={i < phase.r ? 'is-on' : ''} />)}
            </div>
          </section>
          <section className="pc__panel">
            <h3 className="pc__h mono">Order <span className="pc__k">{['Pending', 'Working', 'Filled', 'Managing'][phase.o]}</span></h3>
            <dl className="pc__rows pc__rows--2 mono">
              <div><dt>Side</dt><dd>Long 5</dd></div>
              <div><dt>Entry</dt><dd>{ENTRY.toFixed(1)}</dd></div>
              <div><dt>Stop</dt><dd className="down">{STOP.toFixed(1)}</dd></div>
              <div><dt>Target</dt><dd>{TARGET.toFixed(1)}</dd></div>
            </dl>
          </section>
        </div>
      </div>

      <ol className="pc__log mono" aria-hidden="true">
        {EVENTS(phase).map(([tag, text], i, a) => (
          <li key={tag + text} className={i === a.length - 1 ? 'is-new' : ''}>
            <span className="pc__tag">{tag}</span>
            <span>{text}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
