'use client';

import { useEffect, useState } from 'react';
import { CONSOLE_STAGES } from '../content';
import { fmtPrice, useMarkets } from '../lib/useMarkets';
import QMark from './QMark';
import Sparkline from './Sparkline';

const STEP_MS = 1100;
const HOLD_MS = 2000;

export default function HeroConsole() {
  const markets = useMarkets();
  const gc = markets?.data.find(q => q.key === 'GC');
  const live = gc && !gc.error && typeof gc.price === 'number';
  const up = (gc?.change ?? 0) >= 0;

  // Walk the pipeline one stage at a time, hold on "complete", then start a new cycle.
  const [active, setActive] = useState(0);
  const [cycle, setCycle] = useState(1);
  useEffect(() => {
    const done = active >= CONSOLE_STAGES.length;
    const t = setTimeout(() => {
      if (done) {
        setActive(0);
        setCycle(c => c + 1);
      } else setActive(a => a + 1);
    }, done ? HOLD_MS : STEP_MS);
    return () => clearTimeout(t);
  }, [active]);

  const [clock, setClock] = useState('');
  useEffect(() => {
    const tick = () => setClock(new Date().toISOString().slice(11, 19));
    tick();
    const iv = setInterval(tick, 1000);
    return () => clearInterval(iv);
  }, []);

  const state = (i: number) => (i < active ? 'done' : i === active ? 'running' : 'queued');

  return (
    <div className="console">
      <div className="console__mark">
        <svg viewBox="-300 -300 600 600" width="100%" height="100%" aria-hidden="true">
          <defs>
            <linearGradient id="ring-g" x1="-300" y1="-300" x2="300" y2="300" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#F5F8FC" stopOpacity="0.5" />
              <stop offset="60%" stopColor="#8398B4" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#61789A" stopOpacity="0" />
            </linearGradient>
          </defs>
          <g className="console__ring">
            <circle r="280" fill="none" stroke="url(#ring-g)" strokeWidth="1" />
            <circle r="236" fill="none" stroke="rgba(185,200,220,0.08)" strokeWidth="1" strokeDasharray="2 10" />
          </g>
        </svg>
      </div>

      <div className="console__card mono">
        <div className="console__head">
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
            <QMark id="console" size={18} />
            QS1 / Engine
          </span>
          <span className="console__status">
            <span className="live-dot" />
            Running
          </span>
        </div>

        <div className="console__price">
          <div>
            <div className="console__sym">GC · GOLD FUTURES</div>
            <div className="console__px">{live ? `$${fmtPrice(gc!.price!)}` : '—'}</div>
          </div>
          <div className={`console__chg ${live ? (up ? 'up' : 'down') : 'muted'}`} style={{ textAlign: 'right' }}>
            {live ? (
              <>
                {up ? '+' : ''}{fmtPrice(gc!.change!)}
                <br />
                {up ? '▲' : '▼'} {Math.abs(gc!.changePct!).toFixed(2)}%
              </>
            ) : 'Connecting…'}
          </div>
        </div>
        <div className="console__spark">
          <Sparkline id="hero" points={live ? gc!.points : undefined} positive={up} />
        </div>

        <ol className="console__stages" aria-label="Engine pipeline status">
          {CONSOLE_STAGES.map((s, i) => (
            <li key={s} className={`cstage is-${state(i) === 'running' ? 'active' : state(i)}`}>
              <span className="cstage__n">{String(i + 1).padStart(2, '0')}</span>
              <span>{s}</span>
              <span className="cstage__state">
                {state(i) === 'done' ? '✓ done' : state(i) === 'running' ? 'running' : 'queued'}
              </span>
            </li>
          ))}
        </ol>

        <div className="console__foot">
          <span>Cycle #{String(cycle).padStart(4, '0')}{active >= CONSOLE_STAGES.length ? ' · complete' : ''}</span>
          <span>{clock ? `UTC ${clock}` : ''}</span>
        </div>
      </div>
    </div>
  );
}
