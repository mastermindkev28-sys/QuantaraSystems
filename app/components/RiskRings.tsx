'use client';

import { useEffect, useState } from 'react';
import { RISK } from '../content';

// Risk controls, one illustrative panel per layer. Values are illustrative and
// show how each control works; they are not account data.

const CYCLE_MS = 4200;

function TradeLayer() {
  const rows = [
    { k: 'Target', v: '4,030.4', d: '+12.0 pts', c: 'var(--steel)', pos: 8 },
    { k: 'Entry', v: '4,018.4', d: '', c: 'var(--text)', pos: 58 },
    { k: 'Stop', v: '4,012.4', d: '−6.0 pts', c: 'var(--down)', pos: 84 },
  ];
  return (
    <div className="rv rv--trade">
      <div className="rv__ladder" aria-hidden="true">
        <span className="rv__zone rv__zone--reward" />
        <span className="rv__zone rv__zone--risk" />
        {rows.map(r => (
          <span key={r.k} className="rv__level" style={{ top: `${r.pos}%`, ['--c' as string]: r.c }}>
            <b>{r.k}</b><span>{r.v}</span><em>{r.d}</em>
          </span>
        ))}
      </div>
      <dl className="rv__facts mono">
        <div><dt>Orders sent</dt><dd>Entry · stop · target together</dd></div>
        <div><dt>Risk to reward</dt><dd>1 : 2.0</dd></div>
        <div><dt>Maximum loss</dt><dd>Fixed before entry</dd></div>
      </dl>
    </div>
  );
}

function Meter({ label, used, of, unit }: { label: string; used: number; of: number; unit: string }) {
  const pct = Math.round((used / of) * 100);
  return (
    <div className="rv__meter">
      <div className="rv__meter-top mono"><span>{label}</span><span>{used} / {of} {unit}</span></div>
      <div className="rv__track"><i style={{ width: `${pct}%` }} /></div>
    </div>
  );
}

function SessionLayer() {
  return (
    <div className="rv">
      <Meter label="Daily loss limit used" used={32} of={100} unit="%" />
      <Meter label="Trades this session" used={3} of={6} unit="cap" />
      <p className="rv__note">When either limit is reached, new entries stop until the next session.</p>
    </div>
  );
}

function AccountLayer() {
  return (
    <div className="rv">
      <div className="rv__dd" aria-hidden="true">
        <span className="rv__dd-limit">Drawdown limit</span>
        <span className="rv__dd-buffer">Buffer kept by sizing</span>
        <span className="rv__dd-equity">Account equity</span>
      </div>
      <p className="rv__note">Position size is set so that a full stop-out keeps the account inside its buffer.</p>
    </div>
  );
}

function SystemLayer() {
  const rows = [
    ['Market data feed', 'Connected'],
    ['Platform API', 'Connected'],
    ['Scheduled-event window', 'Clear'],
    ['Manual override', 'Available'],
  ];
  return (
    <div className="rv">
      <ul className="rv__status mono">
        {rows.map(([k, v]) => (
          <li key={k}><span>{k}</span><span className="rv__ok"><i />{v}</span></li>
        ))}
      </ul>
    </div>
  );
}

const VIZ = [TradeLayer, SessionLayer, AccountLayer, SystemLayer];

export default function RiskRings() {
  const layers = RISK.layers;
  const [active, setActive] = useState(0);
  const [hold, setHold] = useState(false);

  useEffect(() => {
    if (hold || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = setTimeout(() => setActive(a => (a + 1) % layers.length), CYCLE_MS);
    return () => clearTimeout(t);
  }, [active, hold, layers.length]);

  const Viz = VIZ[active];
  return (
    <div className="risk" onMouseLeave={() => setHold(false)}>
      <div className="panel rv-panel">
        <div className="detail__head mono">
          <span>{layers[active].k} · {layers[active].name} controls</span>
          <span className="console__status">Illustrative</span>
        </div>
        <div className="rv-panel__body fade-swap" key={active}>
          <Viz />
        </div>
      </div>

      <div className="layers" role="tablist" aria-label="Risk layers">
        {layers.map((l, i) => (
          <button
            key={l.k}
            role="tab"
            aria-selected={i === active}
            className={`layer${i === active ? ' is-active' : ''}`}
            onClick={() => { setHold(true); setActive(i); }}
            onMouseEnter={() => { setHold(true); setActive(i); }}
            onFocus={() => { setHold(true); setActive(i); }}
          >
            <span className="layer__k mono">{l.k} · {l.name}</span>
            <span>
              <span className="layer__t">{l.title}</span>
              <span className="body layer__b">{l.body}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
