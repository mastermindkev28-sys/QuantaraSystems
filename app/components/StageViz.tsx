'use client';

import { useEffect, useRef, useState } from 'react';
import type { StageKey } from '../content';

// Small illustrative animation for each pipeline stage. These show what a stage
// does, not live engine output.

function Ingest({ base }: { base?: number }) {
  const [rows, setRows] = useState<{ id: number; t: string; p: number; d: number; s: number }[]>([]);
  // Only restart the stream when a price first becomes available, not on every poll.
  const baseRef = useRef(base);
  baseRef.current = base;
  const hasBase = !!base;
  useEffect(() => {
    let id = 0;
    let p = baseRef.current ?? 0;
    const make = () => {
      const d = (Math.round((Math.random() - 0.48) * 6) / 10);
      p = +(p + d).toFixed(1);
      const now = new Date();
      const t = `${now.toISOString().slice(11, 19)}.${String(now.getMilliseconds()).padStart(3, '0')}`;
      return { id: id++, t, p, d, s: 1 + Math.floor(Math.random() * 9) };
    };
    setRows(Array.from({ length: 7 }, make).reverse());
    const iv = setInterval(() => setRows(r => [make(), ...r].slice(0, 7)), 650);
    return () => clearInterval(iv);
  }, [hasBase]);
  return (
    <div className="viz viz--ingest mono">
      <div className="viz__row viz__row--head"><span>Time (UTC)</span><span>{base ? 'Price' : 'Δ'}</span><span>Size</span><span>Status</span></div>
      {rows.map((r, i) => (
        <div key={r.id} className={`viz__row${i === 0 ? ' is-new' : ''}`}>
          <span>{r.t}</span>
          <span className={r.d >= 0 ? 'up' : 'down'}>{base ? r.p.toFixed(1) : `${r.d >= 0 ? '+' : ''}${r.d.toFixed(1)}`}</span>
          <span>{r.s}</span>
          <span className="muted">clean</span>
        </div>
      ))}
    </div>
  );
}

function Classify() {
  const [on, setOn] = useState(false);
  useEffect(() => { const t = setTimeout(() => setOn(true), 60); return () => clearTimeout(t); }, []);
  const rows = [
    { k: 'Trending', v: 0.74, pick: true },
    { k: 'Ranging', v: 0.14 },
    { k: 'Volatile', v: 0.08 },
    { k: 'Thin liquidity', v: 0.04 },
  ];
  return (
    <div className="viz viz--bars mono">
      {rows.map((r, i) => (
        <div key={r.k} className={`bar${r.pick ? ' is-pick' : ''}`}>
          <div className="bar__top"><span>{r.k}</span><span>{Math.round(r.v * 100)}%</span></div>
          <div className="bar__track"><i style={{ transform: `scaleX(${on ? r.v : 0})`, transitionDelay: `${i * 90}ms` }} /></div>
        </div>
      ))}
      <div className="viz__verdict"><span className="live-dot" /> Regime: trending · cleared to evaluate setups</div>
    </div>
  );
}

const PATH_A = 'M0,170 C30,160 50,182 80,172 S130,150 160,158 S205,176 230,150 S275,110 300,118 S350,90 400,70';

function Signal() {
  return (
    <svg className="viz viz--svg" viewBox="0 0 400 240" preserveAspectRatio="none" aria-hidden="true">
      <rect x="196" y="20" width="70" height="200" strokeDasharray="3 4" style={{ fill: 'rgba(var(--signal-rgb),0.06)', stroke: 'rgba(var(--signal-rgb),0.25)' }} />
      <text x="202" y="36" className="viz__label" style={{ fill: 'var(--signal)' }}>QUALIFYING WINDOW</text>
      <path d={PATH_A} pathLength={1} className="draw" fill="none" strokeWidth="1.6" vectorEffect="non-scaling-stroke" style={{ stroke: 'var(--silver-2)' }} />
      <g className="pop" style={{ animationDelay: '1.1s' }}>
        <circle cx="232" cy="149" r="5" style={{ fill: 'var(--text)' }} />
        <circle cx="232" cy="149" r="12" fill="none" style={{ stroke: 'rgba(var(--text-rgb),0.35)' }} />
        <text x="246" y="172" className="viz__label" style={{ fill: 'var(--text)' }}>SETUP QUALIFIED · 6 / 6 CONDITIONS</text>
      </g>
    </svg>
  );
}

function Risk() {
  const checks = ['Position size within limit', 'Daily loss limit not reached', 'Drawdown buffer intact', 'Outside news blackout', 'No conflicting exposure'];
  const [n, setN] = useState(0);
  useEffect(() => {
    if (n > checks.length) return;
    const t = setTimeout(() => setN(x => x + 1), 420);
    return () => clearTimeout(t);
  }, [n, checks.length]);
  return (
    <div className="viz viz--checks mono">
      {checks.map((c, i) => (
        <div key={c} className={`check${i < n ? ' is-ok' : ''}`}>
          <span className="check__box">{i < n ? '✓' : ''}</span>
          <span>{c}</span>
          <span className="check__s">{i < n ? 'pass' : 'pending'}</span>
        </div>
      ))}
      <div className={`viz__verdict${n > checks.length ? ' is-on' : ''}`}><span className="live-dot" /> Order approved for routing</div>
    </div>
  );
}

function Execute() {
  return (
    <svg className="viz viz--svg" viewBox="0 0 400 240" preserveAspectRatio="none" aria-hidden="true">
      <g className="pop" style={{ animationDelay: '0.2s' }}>
        <line x1="150" x2="380" y1="60" y2="60" strokeDasharray="4 4" vectorEffect="non-scaling-stroke" style={{ stroke: 'var(--silver-2)' }} />
        <text x="380" y="50" textAnchor="end" className="viz__label" style={{ fill: 'var(--silver-2)' }}>TARGET · LIMIT</text>
      </g>
      <g className="pop" style={{ animationDelay: '0.05s' }}>
        <line x1="150" x2="380" y1="140" y2="140" vectorEffect="non-scaling-stroke" style={{ stroke: 'var(--text)' }} />
        <text x="380" y="130" textAnchor="end" className="viz__label" style={{ fill: 'var(--text)' }}>ENTRY · FILLED</text>
      </g>
      <g className="pop" style={{ animationDelay: '0.35s' }}>
        <line x1="150" x2="380" y1="196" y2="196" strokeDasharray="4 4" vectorEffect="non-scaling-stroke" style={{ stroke: 'var(--down)' }} />
        <text x="380" y="214" textAnchor="end" className="viz__label" style={{ fill: 'var(--down)' }}>STOP · ATTACHED</text>
      </g>
      <path d="M0,176 C40,170 70,186 100,166 S135,146 150,140" pathLength={1} className="draw" fill="none" strokeWidth="1.6" vectorEffect="non-scaling-stroke" style={{ stroke: 'var(--silver-2)' }} />
      <circle cx="150" cy="140" r="5" className="pop" style={{ fill: 'var(--text)', animationDelay: '0.9s' }} />
      <text x="20" y="36" className="viz__label" style={{ fill: 'var(--text-3)' }}>ONE BRACKET · THREE ORDERS · SENT TOGETHER</text>
    </svg>
  );
}

function Manage() {
  return (
    <svg className="viz viz--svg" viewBox="0 0 400 240" preserveAspectRatio="none" aria-hidden="true">
      <path d="M0,190 C40,182 60,170 90,176 S140,150 170,140 S220,120 250,112 S300,96 330,80 S370,60 400,56" pathLength={1} className="draw" fill="none" strokeWidth="1.6" vectorEffect="non-scaling-stroke" style={{ stroke: 'var(--silver-2)' }} />
      <path d="M0,214 H120 V196 H200 V168 H280 V140 H360 V116 H400" pathLength={1} className="draw draw--slow" fill="none" strokeWidth="1.2" strokeDasharray="0" vectorEffect="non-scaling-stroke" style={{ stroke: 'var(--down)' }} />
      <text x="20" y="36" className="viz__label" style={{ fill: 'var(--text-3)' }}>STOP RAISED BY RULE AS PRICE ADVANCES</text>
      <text x="396" y="106" textAnchor="end" className="viz__label" style={{ fill: 'var(--down)' }}>PROTECTIVE STOP</text>
    </svg>
  );
}

export default function StageViz({ stage, base }: { stage: StageKey; base?: number }) {
  switch (stage) {
    case 'ingest': return <Ingest base={base} />;
    case 'classify': return <Classify />;
    case 'signal': return <Signal />;
    case 'risk': return <Risk />;
    case 'execute': return <Execute />;
    case 'manage': return <Manage />;
  }
}
