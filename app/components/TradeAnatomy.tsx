'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ANATOMY } from '../content';
import { Replay } from './Icons';

// A hand-drawn illustrative price path. Up on screen = higher price. Drawn on a
// compact grid, then stretched vertically by Y() to fill the chart area.
const Y = (y: number) => Math.round(56 + (y - 92) * 2.45);
const RAW: [number, number][] = [
  [20, 214], [44, 222], [68, 206], [92, 216], [116, 200], [140, 208], [164, 192], [190, 198],
  [215, 184], [240, 192], [265, 176], [290, 170], [315, 178], [340, 160], [365, 152], [390, 160],
  [415, 142], [440, 134], [465, 142], [490, 124], [515, 116], [540, 122], [565, 100], [590, 108], [620, 112],
];
const PTS = RAW.map(([x, y]) => [x, Y(y)] as [number, number]);
const ENTRY = { x: 215, y: Y(184) };
const STOP_Y = Y(228);
const TARGET_Y = Y(100);
const BE_X = 415;
const EXIT = { x: 565, y: Y(100) };

// How far along the chart is revealed at each log step.
const REVEAL_X = [116, 190, 215, 215, 215, 240, 415, 565, 620];
const STEP_MS = 1150;

const smooth = (pts: [number, number][]) =>
  pts.reduce((d, [x, y], i, a) => {
    if (i === 0) return `M${x},${y}`;
    const [px, py] = a[i - 1];
    const cx = (px + x) / 2;
    return `${d} C${cx},${py} ${cx},${y} ${x},${y}`;
  }, '');

const PATH = smooth(PTS);

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
              <stop offset="0%" stopColor="#b9c8dc" stopOpacity="0.16" />
              <stop offset="100%" stopColor="#b9c8dc" stopOpacity="0" />
            </linearGradient>
          </defs>

          {[60, 140, 220, 300, 380].map(y => (
            <line key={y} x1="0" x2="640" y1={y} y2={y} stroke="rgba(185,200,220,0.06)" />
          ))}

          {/* Regime band */}
          <rect x="116" y="0" width="524" height="420" fill="rgba(143,184,255,0.035)" style={{ opacity: at(1) ? 1 : 0, transition: 'opacity .6s' }} />
          <text x="124" y="20" className="viz__label" fill="#8fb8ff" style={{ opacity: at(1) ? 0.8 : 0, transition: 'opacity .6s' }}>REGIME · TRENDING</text>

          {/* Bracket lines */}
          <g style={{ opacity: at(4) ? 1 : 0, transition: 'opacity .6s' }}>
            <line x1={ENTRY.x} x2="640" y1={TARGET_Y} y2={TARGET_Y} stroke="#b9c8dc" strokeDasharray="4 5" />
            <text x="632" y={TARGET_Y - 8} textAnchor="end" className="viz__label" fill="#b9c8dc">TARGET</text>
            <line x1={ENTRY.x} x2="640" y1={ENTRY.y} y2={ENTRY.y} stroke="rgba(238,242,248,0.45)" />
            <text x="632" y={ENTRY.y - 8} textAnchor="end" className="viz__label" fill="#eef2f8">ENTRY</text>
            <line x1={ENTRY.x} x2={at(6) ? BE_X : 640} y1={STOP_Y} y2={STOP_Y} stroke="#f08a94" strokeDasharray="4 5" style={{ transition: 'all .6s' }} />
            <text x={at(6) ? BE_X - 8 : 632} y={STOP_Y + 18} textAnchor="end" className="viz__label" fill="#f08a94">STOP</text>
          </g>
          {/* Stop moved to entry */}
          <g style={{ opacity: at(6) ? 1 : 0, transition: 'opacity .6s' }}>
            <line x1={BE_X} x2={BE_X} y1={STOP_Y} y2={ENTRY.y} stroke="#f08a94" strokeDasharray="2 4" />
            <line x1={BE_X} x2="640" y1={ENTRY.y + 1} y2={ENTRY.y + 1} stroke="#f08a94" strokeDasharray="4 5" />
            <text x={BE_X + 8} y={ENTRY.y + 18} className="viz__label" fill="#f08a94">STOP → ENTRY</text>
          </g>

          {/* Price */}
          <g clipPath="url(#ta-clip)">
            <path d={`${PATH} L620,420 L20,420 Z`} fill="url(#ta-fill)" />
            <path d={PATH} fill="none" stroke="#dbe4ef" strokeWidth="1.8" />
          </g>

          {/* Entry marker */}
          <g style={{ opacity: at(2) ? 1 : 0, transition: 'opacity .5s' }}>
            <circle cx={ENTRY.x} cy={ENTRY.y} r={at(5) ? 5 : 4} fill={at(5) ? '#eef2f8' : 'none'} stroke="#eef2f8" strokeWidth="1.5" />
            <circle cx={ENTRY.x} cy={ENTRY.y} r="13" fill="none" stroke="rgba(238,242,248,0.25)" />
            <text x={ENTRY.x - 10} y={ENTRY.y + 30} textAnchor="middle" className="viz__label" fill="#a9b6ca">{at(5) ? 'FILLED' : 'SIGNAL'}</text>
          </g>
          {/* Exit marker */}
          <g style={{ opacity: at(7) ? 1 : 0, transition: 'opacity .5s' }}>
            <circle cx={EXIT.x} cy={EXIT.y} r="5" fill="#6fd6ad" />
            <circle cx={EXIT.x} cy={EXIT.y} r="13" fill="none" stroke="rgba(111,214,173,0.35)" />
            <text x={EXIT.x} y={EXIT.y - 20} textAnchor="middle" className="viz__label" fill="#6fd6ad">EXIT</text>
          </g>
        </svg>
        <div className="legend">
          <span><i style={{ background: '#dbe4ef' }} />Price</span>
          <span><i style={{ background: '#b9c8dc' }} />Target</span>
          <span><i style={{ background: '#f08a94' }} />Protective stop</span>
          <span><i style={{ background: '#8fb8ff' }} />Tradeable regime</span>
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
          <span>{steps.length} decisions · 0 made by emotion</span>
          <button className="replay" onClick={play} disabled={playing} style={{ opacity: playing ? 0.5 : 1 }}>
            <Replay /> Replay
          </button>
        </div>
      </div>
    </div>
  );
}
