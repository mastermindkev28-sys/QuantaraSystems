'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ANATOMY } from '../content';
import { Replay } from './Icons';

// An illustrative price path: a deterministic random walk pinned to the points that
// matter (entry, breakeven move, target), drawn with straight segments like a real
// price chart. Up on screen = higher price.
const Y = (y: number) => Math.round(56 + (y - 92) * 2.45);
const ANCHORS: [number, number][] = [
  [20, 214], [70, 206], [120, 202], [165, 194], [215, 184], [260, 178], [300, 172],
  [345, 160], [380, 156], [415, 142], [460, 138], [505, 118], [540, 120], [565, 100], [620, 112],
];
const PINNED = new Set([215, 415, 565]);
const PTS: [number, number][] = (() => {
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647) - 0.5;
  const out: [number, number][] = [];
  for (let x = 20; x <= 620; x += 5) {
    const i = ANCHORS.findIndex(([ax]) => ax >= x);
    const [x1, y1] = ANCHORS[Math.max(0, i)];
    const [x0, y0] = ANCHORS[Math.max(0, i - 1)];
    const base = x1 === x0 ? y1 : y0 + ((x - x0) / (x1 - x0)) * (y1 - y0);
    const noise = PINNED.has(x) || x === 20 || x === 620 ? 0 : rnd() * 9;
    out.push([x, Y(base + noise)]);
  }
  return out;
})();
const ENTRY = { x: 215, y: Y(184) };
const STOP_Y = Y(228);
const TARGET_Y = Y(100);
const BE_X = 415;
const EXIT = { x: 565, y: Y(100) };

// How far along the chart is revealed at each log step.
const REVEAL_X = [116, 190, 215, 215, 215, 240, 415, 565, 620];
const STEP_MS = 1150;

const PATH = PTS.map(([x, y], i) => `${i ? 'L' : 'M'}${x},${y}`).join(' ');

export default function TradeAnatomy() {
  const steps = ANATOMY.steps;
  const [step, setStep] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  const play = useCallback(() => {
    setStep(-1);
    setPlaying(true);
  }, []);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setStep(steps.length - 1);
      return;
    }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        play();
      }
    }, { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, [play, steps.length]);

  useEffect(() => {
    if (!playing) return;
    if (step >= steps.length - 1) {
      setPlaying(false);
      return;
    }
    const t = setTimeout(() => setStep(s => s + 1), step < 0 ? 300 : STEP_MS);
    return () => clearTimeout(t);
  }, [playing, step, steps.length]);

  const revealX = step < 0 ? 20 : REVEAL_X[Math.min(step, REVEAL_X.length - 1)];
  const at = (n: number) => step >= n;

  return (
    <div className="anatomy" ref={root}>
      <div className="panel chart">
        <div className="chart__head mono">
          <span>GC · Illustrative trade · 1m</span>
          <span>{step >= steps.length - 1 ? 'Complete' : step >= 0 ? steps[step].tag : 'Waiting'}</span>
        </div>
        <svg viewBox="0 0 640 420" role="img" aria-label="Illustrative chart of a single long trade from entry to target">
          <defs>
            <clipPath id="ta-clip">
              <rect x="0" y="0" width="640" height="420" style={{ transform: `scaleX(${revealX / 640})`, transformOrigin: '0 0', transition: 'transform 1s cubic-bezier(.22,1,.36,1)' }} />
            </clipPath>
            <linearGradient id="ta-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopOpacity="0.16" style={{ stopColor: 'var(--silver-2)' }} />
              <stop offset="100%" stopOpacity="0" style={{ stopColor: 'var(--silver-2)' }} />
            </linearGradient>
          </defs>

          {[60, 140, 220, 300, 380].map(y => (
            <line key={y} x1="0" x2="640" y1={y} y2={y} style={{ stroke: 'rgba(var(--tint),0.06)' }} />
          ))}

          {/* Regime band */}
          <rect x="116" y="0" width="524" height="420" style={{ fill: 'rgba(var(--signal-rgb),0.035)', opacity: at(1) ? 1 : 0, transition: 'opacity .6s' }} />
          <text x="124" y="20" className="viz__label" style={{ fill: 'var(--signal)', opacity: at(1) ? 0.8 : 0, transition: 'opacity .6s' }}>REGIME · TRENDING</text>

          {/* Bracket lines */}
          <g style={{ opacity: at(4) ? 1 : 0, transition: 'opacity .6s' }}>
            <line x1={ENTRY.x} x2="640" y1={TARGET_Y} y2={TARGET_Y} strokeDasharray="4 5" style={{ stroke: 'var(--silver-2)' }} />
            <text x="632" y={TARGET_Y - 8} textAnchor="end" className="viz__label" style={{ fill: 'var(--silver-2)' }}>TARGET</text>
            <line x1={ENTRY.x} x2="640" y1={ENTRY.y} y2={ENTRY.y} style={{ stroke: 'rgba(var(--text-rgb),0.45)' }} />
            <text x="632" y={ENTRY.y - 8} textAnchor="end" className="viz__label" style={{ fill: 'var(--text)' }}>ENTRY</text>
            <line x1={ENTRY.x} x2={at(6) ? BE_X : 640} y1={STOP_Y} y2={STOP_Y} strokeDasharray="4 5" style={{ stroke: 'var(--down)', transition: 'all .6s' }} />
            <text x={at(6) ? BE_X - 8 : 632} y={STOP_Y + 18} textAnchor="end" className="viz__label" style={{ fill: 'var(--down)' }}>STOP</text>
          </g>
          {/* Stop moved to entry */}
          <g style={{ opacity: at(6) ? 1 : 0, transition: 'opacity .6s' }}>
            <line x1={BE_X} x2={BE_X} y1={STOP_Y} y2={ENTRY.y} strokeDasharray="2 4" style={{ stroke: 'var(--down)' }} />
            <line x1={BE_X} x2="640" y1={ENTRY.y + 1} y2={ENTRY.y + 1} strokeDasharray="4 5" style={{ stroke: 'var(--down)' }} />
            <text x={BE_X + 8} y={ENTRY.y + 18} className="viz__label" style={{ fill: 'var(--down)' }}>STOP → ENTRY</text>
          </g>

          {/* Price */}
          <g clipPath="url(#ta-clip)">
            <path d={`${PATH} L620,420 L20,420 Z`} fill="url(#ta-fill)" />
            <path d={PATH} fill="none" strokeWidth="1.4" strokeLinejoin="round" style={{ stroke: 'var(--price)' }} />
          </g>

          {/* Entry marker */}
          <g style={{ opacity: at(2) ? 1 : 0, transition: 'opacity .5s' }}>
            <circle cx={ENTRY.x} cy={ENTRY.y} r={at(5) ? 5 : 4} strokeWidth="1.5" style={{ fill: at(5) ? 'var(--text)' : 'none', stroke: 'var(--text)' }} />
            <circle cx={ENTRY.x} cy={ENTRY.y} r="13" fill="none" style={{ stroke: 'rgba(var(--text-rgb),0.25)' }} />
            <text x={ENTRY.x - 10} y={ENTRY.y + 30} textAnchor="middle" className="viz__label" style={{ fill: 'var(--text-2)' }}>{at(5) ? 'FILLED' : 'SIGNAL'}</text>
          </g>
          {/* Exit marker */}
          <g style={{ opacity: at(7) ? 1 : 0, transition: 'opacity .5s' }}>
            <circle cx={EXIT.x} cy={EXIT.y} r="5" style={{ fill: 'var(--up)' }} />
            <circle cx={EXIT.x} cy={EXIT.y} r="13" fill="none" style={{ stroke: 'rgba(var(--up-rgb),0.35)' }} />
            <text x={EXIT.x} y={EXIT.y - 20} textAnchor="middle" className="viz__label" style={{ fill: 'var(--up)' }}>EXIT</text>
          </g>
        </svg>
        <div className="legend">
          <span><i style={{ background: 'var(--price)' }} />Price</span>
          <span><i style={{ background: 'var(--silver-2)' }} />Target</span>
          <span><i style={{ background: 'var(--down)' }} />Protective stop</span>
          <span><i style={{ background: 'var(--signal)' }} />Tradeable regime</span>
        </div>
      </div>

      <div className="panel log">
        <div className="log__head mono">
          <span>Engine log</span>
          <span className="console__status"><span className="live-dot" />{step >= 0 ? `${step + 1} / ${steps.length}` : 'Ready'}</span>
        </div>
        <ol className="log__lines mono" aria-live="polite">
          {steps.map((l, i) => (
            <li key={l.t + l.tag} className={`logline${i <= step ? ' is-shown' : ''}${i === step ? ' is-current' : ''}`}>
              <span className="logline__t">{l.t}</span>
              <span className="logline__tag">{l.tag}</span>
              <span>{l.text}</span>
            </li>
          ))}
        </ol>
        <div className="log__foot">
          <span>{steps.length} decisions · all made by rule</span>
          <button className="replay" onClick={play} disabled={playing} style={{ opacity: playing ? 0.5 : 1 }}>
            <Replay /> Replay
          </button>
        </div>
      </div>
    </div>
  );
}
