'use client';

import { useEffect, useState } from 'react';
import { RISK } from '../content';

// Each layer of protection drawn as a ring around the order, echoing the Q mark.
const RADII = [92, 150, 208, 266];
const CYCLE_MS = 3800;

export default function RiskRings() {
  const layers = RISK.layers;
  const [active, setActive] = useState(0);
  const [hold, setHold] = useState(false);

  useEffect(() => {
    if (hold || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = setTimeout(() => setActive(a => (a + 1) % layers.length), CYCLE_MS);
    return () => clearTimeout(t);
  }, [active, hold, layers.length]);

  return (
    <div className="risk">
      <div className="rings">
        <svg viewBox="-300 -300 600 600" role="img" aria-label="Four concentric layers of risk protection around each order">
          <defs>
            <linearGradient id="rr-g" x1="-300" y1="-300" x2="300" y2="300" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#F5F8FC" />
              <stop offset="45%" stopColor="#B9C8DC" />
              <stop offset="100%" stopColor="#61789A" />
            </linearGradient>
            <radialGradient id="rr-core">
              <stop offset="0%" stopColor="rgba(185,200,220,0.18)" />
              <stop offset="100%" stopColor="rgba(185,200,220,0)" />
            </radialGradient>
            {RADII.map((r, i) => (
              <path key={r} id={`rr-arc-${i}`} d={`M ${-r},0 A ${r},${r} 0 0 1 ${r},0`} />
            ))}
          </defs>

          <circle r="300" fill="url(#rr-core)" opacity="0.35" />
          {RADII.map((r, i) => {
            const on = i === active;
            const inside = i < active;
            return (
              <g key={r}>
                {on && <circle r={r} fill="rgba(185,200,220,0.025)" />}
                <circle
                  r={r}
                  fill="none"
                  stroke={on ? 'url(#rr-g)' : inside ? 'rgba(185,200,220,0.32)' : 'rgba(185,200,220,0.14)'}
                  strokeWidth={on ? 2 : 1}
                  strokeDasharray={on ? undefined : '2 7'}
                />
                <text className="mono" fontSize="14" letterSpacing="2.4" dy="-8" fill={on ? '#eef2f8' : '#6f7f98'} style={{ transition: 'fill .4s' }}>
                  <textPath href={`#rr-arc-${i}`} startOffset="50%" textAnchor="middle">
                    {layers[i].k} · {layers[i].name.toUpperCase()}
                  </textPath>
                </text>
              </g>
            );
          })}
          <circle r="40" fill="#0a111f" stroke="rgba(185,200,220,0.28)" />
          <text y="5" textAnchor="middle" className="mono" fontSize="12" letterSpacing="2" fill="#eef2f8">ORDER</text>
        </svg>
      </div>

      <div className="layers" onMouseLeave={() => setHold(false)}>
        {layers.map((l, i) => (
          <div
            key={l.k}
            className={`layer${i === active ? ' is-active' : ''}`}
            onMouseEnter={() => { setHold(true); setActive(i); }}
            onFocus={() => { setHold(true); setActive(i); }}
            tabIndex={0}
          >
            <div className="layer__k mono">{l.k} · {l.name}</div>
            <div>
              <div className="layer__t">{l.title}</div>
              <p className="body">{l.body}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
