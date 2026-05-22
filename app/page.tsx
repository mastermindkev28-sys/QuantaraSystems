'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Particle { x: number; y: number; vx: number; vy: number; opacity: number; }
interface GoldPoint { t: number; p: number; }
interface GoldData {
  price: number; prev: number; change: number; changePct: number;
  high: number; low: number; volume: number; state: string;
  points: GoldPoint[]; ts: number; error?: boolean;
}

// ─── Canvas Background ────────────────────────────────────────────────────────
function NetworkCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let raf: number; let particles: Particle[] = [];
    function init() {
      const w = canvas!.offsetWidth; const h = canvas!.offsetHeight;
      particles = Array.from({ length: 55 }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.28, vy: (Math.random() - 0.5) * 0.28,
        opacity: Math.random() * 0.32 + 0.08,
      }));
    }
    function resize() {
      const dpr = window.devicePixelRatio || 1;
      const w = canvas!.offsetWidth; const h = canvas!.offsetHeight;
      canvas!.width = w * dpr; canvas!.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); init();
    }
    function draw() {
      const w = canvas!.offsetWidth; const h = canvas!.offsetHeight;
      ctx.clearRect(0, 0, w, h);
      ctx.lineWidth = 1; ctx.strokeStyle = 'rgba(255,255,255,0.022)';
      for (let x = 0; x <= w; x += 80) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
      for (let y = 0; y <= h; y += 80) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
      for (const p of particles) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
      }
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x; const dy = particles[i].y - particles[j].y;
          const d = Math.hypot(dx, dy);
          if (d < 125) {
            ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y); ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(163,217,255,${(1 - d / 125) * 0.065})`; ctx.lineWidth = 0.5; ctx.stroke();
          }
        }
      }
      for (const p of particles) {
        ctx.beginPath(); ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(163,217,255,${p.opacity})`; ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    }
    const ro = new ResizeObserver(resize); ro.observe(canvas); resize(); draw();
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);
  return <canvas ref={ref} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }} />;
}

// ─── SVG Logo Mark ─────────────────────────────────────────────────────────────
function QMark({ size = 50 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="qg-a" x1="20" y1="10" x2="180" y2="190" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ECECEC" /><stop offset="22%" stopColor="#F8F8F8" />
          <stop offset="45%" stopColor="#B8B8B8" /><stop offset="68%" stopColor="#E4E4E4" />
          <stop offset="100%" stopColor="#8C8C8C" />
        </linearGradient>
        <linearGradient id="qg-b" x1="180" y1="20" x2="30" y2="180" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#D8D8D8" /><stop offset="40%" stopColor="#F2F2F2" />
          <stop offset="100%" stopColor="#9A9A9A" />
        </linearGradient>
        <clipPath id="qg-clip"><circle cx="100" cy="97" r="71" /></clipPath>
      </defs>
      <circle cx="100" cy="97" r="69" stroke="url(#qg-a)" strokeWidth="13" />
      <line x1="55" y1="156" x2="148" y2="68" stroke="url(#qg-a)" strokeWidth="13" strokeLinecap="round" />
      <line x1="140" y1="64" x2="194" y2="148" stroke="url(#qg-a)" strokeWidth="13" strokeLinecap="round" />
      <line x1="100" y1="30" x2="100" y2="118" stroke="url(#qg-b)" strokeWidth="5.5" strokeLinecap="round" />
      {Array.from({ length: 13 }, (_, i) => (
        <line key={i} x1={40 + i * 4.5} y1={172 - i * 1.5} x2={78 + i * 3.8} y2={113 - i * 7.5}
          stroke="#B8B8B8" strokeWidth="1.1" strokeLinecap="round"
          opacity={0.12 + i * 0.038} clipPath="url(#qg-clip)" />
      ))}
    </svg>
  );
}

// ─── SparkLine ────────────────────────────────────────────────────────────────
function SparkLine({ points, positive, width = 280, height = 56 }: { points: GoldPoint[]; positive: boolean; width?: number; height?: number }) {
  if (points.length < 2) return <div style={{ width, height, background: 'rgba(255,255,255,0.03)', borderRadius: 4 }} />;
  const prices = points.map(p => p.p);
  const min = Math.min(...prices); const max = Math.max(...prices);
  const range = max - min || 1;
  const pad = 4;
  const toX = (i: number) => pad + (i / (points.length - 1)) * (width - pad * 2);
  const toY = (p: number) => height - pad - ((p - min) / range) * (height - pad * 2);
  const pathD = prices.map((p, i) => `${i === 0 ? 'M' : 'L'}${toX(i).toFixed(1)},${toY(p).toFixed(1)}`).join(' ');
  const fillD = `${pathD} L${toX(prices.length - 1).toFixed(1)},${height} L${toX(0).toFixed(1)},${height} Z`;
  const color = positive ? '#34D399' : '#F87171';
  const id = `sl-${positive ? 'g' : 'r'}`;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: 'block' }}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.18} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={fillD} fill={`url(#${id})`} />
      <path d={pathD} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Circular Progress ────────────────────────────────────────────────────────
function CircularProgress({ pct, size = 120, color = '#A3D9FF', label }: { pct: number; size?: number; color?: string; label?: string }) {
  const r = size / 2 - 10; const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <svg width={size} height={size} style={{ display: 'block' }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="8"
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: 'stroke-dashoffset 1s ease' }} />
      <text x={size / 2} y={size / 2 - 4} textAnchor="middle" fill="#E0E0E0" fontSize="18" fontWeight="200" fontFamily="Inter,sans-serif">
        {Math.round(pct)}%
      </text>
      {label && (
        <text x={size / 2} y={size / 2 + 16} textAnchor="middle" fill="#444" fontSize="9" fontFamily="Inter,sans-serif" letterSpacing="1.5">
          {label}
        </text>
      )}
    </svg>
  );
}

// ─── Gold Ticker Strip ────────────────────────────────────────────────────────
function GoldTickerBar({ data, loading }: { data: GoldData | null; loading: boolean }) {
  const pos = data ? data.change >= 0 : true;
  const color = pos ? '#34D399' : '#F87171';
  const fmt = (n: number) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div style={{
      background: 'linear-gradient(135deg, #0D0D0D 0%, #0F1118 50%, #0A0A0A 100%)',
      borderTop: '1px solid rgba(255,255,255,0.04)',
      borderBottom: '1px solid rgba(255,255,255,0.04)',
      padding: '32px 48px',
    }}>
      <div style={{ maxWidth: 1160, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: loading ? '#555' : '#34D399', animation: 'qs-pulse 2s ease-in-out infinite' }} />
          <span style={{ fontSize: 9, letterSpacing: '0.28em', textTransform: 'uppercase', color: '#333' }}>
            {loading ? 'Connecting to market data…' : 'Live · Gold Futures · GC/MGC · COMEX'}
          </span>
        </div>

        {loading ? (
          <div style={{ height: 80, display: 'flex', alignItems: 'center', gap: 24 }}>
            {[200, 120, 80, 80].map((w, i) => (
              <div key={i} style={{ width: w, height: 16, background: 'rgba(255,255,255,0.04)', borderRadius: 4, animation: 'qs-pulse 1.8s ease-in-out infinite' }} />
            ))}
          </div>
        ) : data && !data.error ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', gap: '28px 56px' }}>
            <div>
              <div style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#333', marginBottom: 6 }}>GC Futures (Continuous)</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
                <span style={{ fontSize: 44, fontWeight: 200, color: '#E8E8E8', letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums' }}>
                  ${fmt(data.price)}
                </span>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 300, color, letterSpacing: '-0.01em' }}>
                    {pos ? '+' : ''}{fmt(data.change)}
                  </div>
                  <div style={{ fontSize: 12, color, opacity: 0.8 }}>
                    {pos ? '+' : ''}{data.changePct.toFixed(2)}%
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap' }}>
              {[
                { label: 'Day High', val: `$${fmt(data.high)}` },
                { label: 'Day Low', val: `$${fmt(data.low)}` },
                { label: 'Prev Close', val: `$${fmt(data.prev)}` },
                { label: 'Market', val: data.state === 'REGULAR' ? 'Open' : data.state === 'PRE' ? 'Pre-Market' : 'After Hours' },
              ].map(m => (
                <div key={m.label}>
                  <div style={{ fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#2E2E2E', marginBottom: 5 }}>{m.label}</div>
                  <div style={{ fontSize: 15, fontWeight: 300, color: '#8A8A8A', fontVariantNumeric: 'tabular-nums' }}>{m.val}</div>
                </div>
              ))}
            </div>

            {data.points.length > 1 && (
              <div style={{ marginLeft: 'auto' }}>
                <div style={{ fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#2A2A2A', marginBottom: 8 }}>Intraday — 5m</div>
                <SparkLine points={data.points} positive={pos} width={240} height={52} />
              </div>
            )}
          </div>
        ) : (
          <div style={{ color: '#333', fontSize: 13 }}>Market data temporarily unavailable. Retrying…</div>
        )}

        {data && !data.error && (
          <div style={{ marginTop: 16, fontSize: 10, color: '#222', letterSpacing: '0.06em' }}>
            Updated {new Date(data.ts).toLocaleTimeString()} · Data via Yahoo Finance · 15-min delay may apply
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Performance Section ──────────────────────────────────────────────────────
const ACCOUNTS = [
  {
    size: '$50,000', key: '50k',
    payoutRange: '$1,250–$1,500',
    early: '$1,640', mature: '$2,050',
    monthly: '$9,225', sixMonth: '$55,350',
    clientNet: '$44,280', aegisRev: '$11,070',
    color: '#A3D9FF',
  },
  {
    size: '$100,000', key: '100k',
    payoutRange: '$2,500–$3,000',
    early: '$2,050', mature: '$2,460',
    monthly: '$11,070', sixMonth: '$66,420',
    clientNet: '$53,136', aegisRev: '$13,284',
    color: '#C4A9FF',
  },
  {
    size: '$150,000', key: '150k',
    payoutRange: '$3,000–$3,500',
    early: '$2,460', mature: '$2,870',
    monthly: '$12,915', sixMonth: '$77,490',
    clientNet: '$61,992', aegisRev: '$15,498',
    color: '#34D399',
  },
] as const;

function PerformanceSection() {
  const [active, setActive] = useState(0);
  const acct = ACCOUNTS[active];

  return (
    <section id="qs-performance" style={{ padding: '130px 48px', background: 'linear-gradient(180deg, #0A0A0A 0%, #0C1118 60%, #0A0A0A 100%)' }}>
      <div style={{ maxWidth: 1160, margin: '0 auto' }}>
        <div style={{ marginBottom: 60 }}>
          <div style={{ fontSize: 9, letterSpacing: '0.28em', textTransform: 'uppercase', color: '#A3D9FF', marginBottom: 18, opacity: 0.8 }}>
            AegisAI Performance
          </div>
          <h2 style={{ fontSize: 42, fontWeight: 200, letterSpacing: '-0.025em', color: '#EDEDED', marginBottom: 18, maxWidth: 560 }}>
            Projected Account Performance
          </h2>
          <p style={{ color: '#484848', fontSize: 15, lineHeight: 1.9, maxWidth: 620, fontWeight: 300 }}>
            Performance projections are illustrative estimates based on AegisAI&apos;s systematic execution framework. All trading involves risk and actual results may vary.
          </p>
        </div>

        {/* Tab selector */}
        <div style={{ display: 'flex', gap: 1, marginBottom: 40, border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, overflow: 'hidden', width: 'fit-content' }}>
          {ACCOUNTS.map((a, i) => (
            <button
              key={a.key}
              onClick={() => setActive(i)}
              style={{
                background: active === i ? 'rgba(255,255,255,0.06)' : 'transparent',
                border: 'none',
                color: active === i ? '#E0E0E0' : '#3A3A3A',
                padding: '10px 28px',
                fontSize: 13,
                fontFamily: 'inherit',
                cursor: 'pointer',
                letterSpacing: '0.04em',
                transition: 'all 0.2s',
                borderRight: i < ACCOUNTS.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
              }}
            >
              {a.size}
            </button>
          ))}
        </div>

        {/* Main card grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
          {/* Left: payout breakdown */}
          <div style={{ border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '36px', background: '#0D0D0D' }}>
            <div style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#333', marginBottom: 24 }}>Payout Structure</div>
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 11, color: '#3A3A3A', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Max Payout Per Cycle</div>
              <div style={{ fontSize: 28, fontWeight: 200, color: '#C8C8C8', letterSpacing: '-0.02em' }}>{acct.payoutRange}</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              {[
                { label: 'Payouts 1–3 (avg)', val: acct.early },
                { label: 'Payouts 4–5 (avg)', val: acct.mature },
              ].map(m => (
                <div key={m.label} style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.04)' }}>
                  <div style={{ fontSize: 9, color: '#333', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>{m.label}</div>
                  <div style={{ fontSize: 20, fontWeight: 200, color: '#A0A0A0', letterSpacing: '-0.01em' }}>{m.val}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: projections */}
          <div style={{ border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '36px', background: '#0D0D0D' }}>
            <div style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#333', marginBottom: 24 }}>Gross Projections</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
              {[
                { label: 'Est. Monthly Gross', val: acct.monthly, sub: 'per month' },
                { label: 'Est. 6-Month Gross', val: acct.sixMonth, sub: '6-month period' },
              ].map(m => (
                <div key={m.label} style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.04)' }}>
                  <div style={{ fontSize: 9, color: '#333', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10 }}>{m.label}</div>
                  <div style={{ fontSize: 22, fontWeight: 200, color: '#C8C8C8', letterSpacing: '-0.02em', marginBottom: 4 }}>{m.val}</div>
                  <div style={{ fontSize: 10, color: '#2A2A2A', letterSpacing: '0.04em' }}>{m.sub}</div>
                </div>
              ))}
            </div>
            {/* Split bar */}
            <div style={{ padding: '16px', background: 'rgba(255,255,255,0.015)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.04)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <div style={{ fontSize: 9, color: '#3A3A3A', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Client Net (80%)</div>
                <div style={{ fontSize: 9, color: '#2A2A2A', letterSpacing: '0.1em', textTransform: 'uppercase' }}>AegisAI Fee (20%)</div>
              </div>
              <div style={{ height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.04)', overflow: 'hidden', marginBottom: 10 }}>
                <div style={{ height: '100%', width: '80%', background: `linear-gradient(90deg, ${acct.color}80, ${acct.color}40)`, borderRadius: 3 }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 14, fontWeight: 300, color: '#7A7A7A' }}>{acct.clientNet}</span>
                <span style={{ fontSize: 14, fontWeight: 300, color: '#484848' }}>{acct.aegisRev}</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ padding: '14px 20px', border: '1px solid rgba(200,100,50,0.08)', borderRadius: 8, background: 'rgba(200,100,50,0.02)' }}>
          <p style={{ color: '#4A3A32', fontSize: 12, lineHeight: 1.8 }}>
            <span style={{ color: '#5A4A40' }}>Projection Disclaimer —</span> Figures are estimates based on AegisAI&apos;s historical system behavior. They do not constitute a guarantee of future performance. All futures trading involves substantial risk of loss. Past results are not indicative of future outcomes.
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── Account Dashboard ─────────────────────────────────────────────────────────
function AccountDashboard() {
  const [acctIdx, setAcctIdx] = useState(0);
  const [payoutNum, setPayoutNum] = useState(1);
  const acct = ACCOUNTS[acctIdx];

  const payoutAvg = payoutNum <= 3
    ? parseFloat(acct.early.replace(/[$,]/g, ''))
    : parseFloat(acct.mature.replace(/[$,]/g, ''));

  const acctVal = parseFloat(acct.size.replace(/[$,]/g, ''));
  const targetPayout = acctVal * 0.025;
  const progress = Math.min((payoutAvg / targetPayout) * 75 + 10, 96);

  const statusItems = [
    { label: 'Account Status', val: 'Active', good: true },
    { label: 'Algorithm', val: 'AegisAI v3.2', good: true },
    { label: 'Risk System', val: 'Engaged', good: true },
    { label: 'Market Connection', val: 'Tradovate', good: true },
  ];

  const recentPayouts = [
    { cycle: `Payout ${Math.max(1, payoutNum - 2)}`, date: '2026-03-15', amount: acct.early, status: 'Processed' },
    { cycle: `Payout ${Math.max(1, payoutNum - 1)}`, date: '2026-04-08', amount: acct.early, status: 'Processed' },
    { cycle: `Payout ${payoutNum}`, date: 'Pending', amount: payoutAvg.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }), status: 'In Progress' },
  ];

  return (
    <section id="qs-dashboard" style={{ padding: '130px 48px', background: '#0A0A0A' }}>
      <div style={{ maxWidth: 1160, margin: '0 auto' }}>
        <div style={{ marginBottom: 60 }}>
          <div style={{ fontSize: 9, letterSpacing: '0.28em', textTransform: 'uppercase', color: '#A3D9FF', marginBottom: 18, opacity: 0.8 }}>
            Member Portal
          </div>
          <h2 style={{ fontSize: 42, fontWeight: 200, letterSpacing: '-0.025em', color: '#EDEDED', marginBottom: 16 }}>
            Account Progress Tracker
          </h2>
          <p style={{ color: '#484848', fontSize: 14, lineHeight: 1.85, maxWidth: 540, fontWeight: 300 }}>
            Illustrative dashboard — representing projected account behavior for AegisAI-managed funded accounts on the Lucid Trading platform.
          </p>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', gap: 24, marginBottom: 32, flexWrap: 'wrap', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#2E2E2E', marginBottom: 8 }}>Account Size</div>
            <div style={{ display: 'flex', gap: 1, border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, overflow: 'hidden' }}>
              {ACCOUNTS.map((a, i) => (
                <button key={a.key} onClick={() => setAcctIdx(i)} style={{
                  background: acctIdx === i ? 'rgba(255,255,255,0.06)' : 'transparent',
                  border: 'none', color: acctIdx === i ? '#C8C8C8' : '#3A3A3A',
                  padding: '8px 20px', fontSize: 12, fontFamily: 'inherit', cursor: 'pointer',
                  borderRight: i < ACCOUNTS.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                  transition: 'all 0.2s',
                }}>
                  {a.size}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#2E2E2E', marginBottom: 8 }}>Current Payout Cycle</div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <button onClick={() => setPayoutNum(p => Math.max(1, p - 1))} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', color: '#555', borderRadius: 6, width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontFamily: 'inherit', fontSize: 14 }}>-</button>
              <span style={{ color: '#A0A0A0', fontSize: 14, fontWeight: 300, minWidth: 60, textAlign: 'center' }}>Cycle {payoutNum}</span>
              <button onClick={() => setPayoutNum(p => Math.min(10, p + 1))} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', color: '#555', borderRadius: 6, width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontFamily: 'inherit', fontSize: 14 }}>+</button>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 20 }}>
          {/* Left: progress ring */}
          <div style={{ border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '32px', background: '#0D0D0D', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
            <div style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#2E2E2E' }}>Payout Progress</div>
            <CircularProgress pct={progress} size={140} color={acct.color} label="TOWARD TARGET" />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 200, color: '#C0C0C0', letterSpacing: '-0.01em', marginBottom: 4 }}>
                {payoutAvg.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 })}
              </div>
              <div style={{ fontSize: 10, color: '#333', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Projected Cycle {payoutNum}</div>
            </div>
            <div style={{ width: '100%', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: 20 }}>
              {statusItems.map(s => (
                <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', borderBottom: '1px solid rgba(255,255,255,0.025)' }}>
                  <span style={{ fontSize: 11, color: '#333' }}>{s.label}</span>
                  <span style={{ fontSize: 11, color: s.good ? '#34D399' : '#F87171', display: 'flex', alignItems: 'center', gap: 5 }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: s.good ? '#34D399' : '#F87171', display: 'inline-block' }} />
                    {s.val}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: metrics + table */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              {[
                { label: 'Projected Monthly', val: acct.monthly, sub: 'gross revenue' },
                { label: '6-Month Gross', val: acct.sixMonth, sub: 'cumulative gross' },
                { label: 'Client Net (80%)', val: acct.clientNet, sub: 'after performance fee' },
              ].map(m => (
                <div key={m.label} style={{ border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '22px 20px', background: '#0D0D0D' }}>
                  <div style={{ fontSize: 9, color: '#2E2E2E', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 10 }}>{m.label}</div>
                  <div style={{ fontSize: 22, fontWeight: 200, color: '#B8B8B8', letterSpacing: '-0.02em', marginBottom: 4 }}>{m.val}</div>
                  <div style={{ fontSize: 10, color: '#282828', letterSpacing: '0.04em' }}>{m.sub}</div>
                </div>
              ))}
            </div>

            {/* Payout history table */}
            <div style={{ border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, overflow: 'hidden', background: '#0D0D0D', flex: 1 }}>
              <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.04)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, color: '#555', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Payout History</span>
                <span style={{ fontSize: 10, color: '#2A2A2A', letterSpacing: '0.08em' }}>LUCID DASHBOARD</span>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    {['Cycle', 'Date', 'Amount', 'Status'].map(h => (
                      <th key={h} style={{ padding: '12px 24px', textAlign: 'left', color: '#2E2E2E', fontWeight: 500, fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentPayouts.map((r, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.025)' }}>
                      <td style={{ padding: '13px 24px', color: '#8A8A8A' }}>{r.cycle}</td>
                      <td style={{ padding: '13px 24px', color: '#555', fontVariantNumeric: 'tabular-nums' }}>{r.date}</td>
                      <td style={{ padding: '13px 24px', color: '#A0A0A0', fontVariantNumeric: 'tabular-nums' }}>{r.amount}</td>
                      <td style={{ padding: '13px 24px' }}>
                        <span style={{
                          fontSize: 10, letterSpacing: '0.08em', padding: '3px 10px', borderRadius: 100,
                          background: r.status === 'Processed' ? 'rgba(52,211,153,0.1)' : 'rgba(163,217,255,0.08)',
                          color: r.status === 'Processed' ? '#34D399' : '#A3D9FF',
                          border: `1px solid ${r.status === 'Processed' ? 'rgba(52,211,153,0.2)' : 'rgba(163,217,255,0.15)'}`,
                        }}>
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── How It Works ─────────────────────────────────────────────────────────────
function HowItWorks({ onOpen }: { onOpen: () => void }) {
  const steps = [
    { n: '01', title: 'Initial Enrollment', body: 'Select your desired account size ($50K, $100K, or $150K) and submit the one-time program fee to initiate the onboarding process.' },
    { n: '02', title: 'Create Lucid Account', body: 'Register with Lucid Trading — the proprietary capital program platform used to house the funded account and manage payout requests.' },
    { n: '03', title: 'Obtain Tradovate Credentials', body: 'Receive your Tradovate trading credentials through Lucid. Note: these are the Tradovate execution credentials only — separate from your Lucid dashboard login.' },
    { n: '04', title: 'Secure Integration', body: 'Provide your Tradovate credentials to the AegisAI development team via our encrypted intake. Infrastructure is then configured and connected.' },
    { n: '05', title: 'Algorithm Deployment', body: 'The AI execution engine is deployed directly onto your account. Risk systems activate. Trade detection, management, and execution become fully autonomous.' },
    { n: '06', title: 'Automated Trading Begins', body: 'AegisAI scans continuously for optimal Gold setups. The algorithm trades only when favorable conditions are identified. No manual experience required.' },
  ];

  return (
    <section id="qs-process" style={{ padding: '130px 48px', background: 'linear-gradient(180deg, #0A0A0A 0%, #0C1118 100%)' }}>
      <div style={{ maxWidth: 1160, margin: '0 auto' }}>
        <div style={{ marginBottom: 68 }}>
          <div style={{ fontSize: 9, letterSpacing: '0.28em', textTransform: 'uppercase', color: '#A3D9FF', marginBottom: 18, opacity: 0.8 }}>How It Works</div>
          <h2 style={{ fontSize: 42, fontWeight: 200, letterSpacing: '-0.025em', color: '#EDEDED', maxWidth: 480 }}>
            Six Steps to Automated Execution
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: 16, overflow: 'hidden', marginBottom: 56 }}>
          {steps.map((step, i) => (
            <div key={step.n} style={{ padding: '36px 32px', background: '#0D0D0D', borderRight: '1px solid rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)', position: 'relative' }}>
              <div style={{ position: 'absolute', top: 20, right: 20, fontSize: 9, color: '#1E1E1E', letterSpacing: '0.1em' }}>{step.n}</div>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                border: '1px solid rgba(163,217,255,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 20,
              }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'rgba(163,217,255,0.5)' }} />
              </div>
              <h3 style={{ fontSize: 14, fontWeight: 400, color: '#C0C0C0', marginBottom: 12, letterSpacing: '-0.01em', lineHeight: 1.4 }}>
                Step {i + 1} — {step.title}
              </h3>
              <p style={{ color: '#484848', fontSize: 13, lineHeight: 1.85 }}>{step.body}</p>
            </div>
          ))}
        </div>

        {/* Payout Procedure */}
        <div style={{ border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '40px', background: '#0D0D0D', marginBottom: 20 }}>
          <div style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#A3D9FF', marginBottom: 16, opacity: 0.8 }}>
            Payout Procedure
          </div>
          <h3 style={{ fontSize: 24, fontWeight: 200, color: '#C8C8C8', marginBottom: 28, letterSpacing: '-0.02em' }}>
            Requesting Your Payout
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
            {[
              { n: '1', title: 'Log In', body: 'Log into your Lucid Trading dashboard using your registered credentials.' },
              { n: '2', title: 'Verify Identity', body: 'Complete the KYC (Know Your Customer) identity verification process.' },
              { n: '3', title: 'Add Banking', body: 'Input your banking information for direct deposit processing.' },
              { n: '4', title: 'Request Payout', body: 'Submit your payout request directly through the Lucid dashboard. Payouts are often processed extremely quickly.' },
            ].map(step => (
              <div key={step.n} style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.04)' }}>
                <div style={{ width: 24, height: 24, borderRadius: '50%', border: '1px solid rgba(163,217,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                  <span style={{ fontSize: 10, color: 'rgba(163,217,255,0.6)', fontVariantNumeric: 'tabular-nums' }}>{step.n}</span>
                </div>
                <div style={{ fontSize: 13, fontWeight: 400, color: '#9A9A9A', marginBottom: 8 }}>{step.title}</div>
                <p style={{ fontSize: 12, color: '#484848', lineHeight: 1.8 }}>{step.body}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <button
            onClick={onOpen}
            style={{ background: 'transparent', border: '1px solid rgba(163,217,255,0.35)', color: '#A3D9FF', borderRadius: '8px', padding: '15px 40px', fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' }}
          >
            Begin Enrollment
          </button>
        </div>
      </div>
    </section>
  );
}

// ─── Why AegisAI ──────────────────────────────────────────────────────────────
function WhyAegisAI() {
  const reasons = [
    { icon: '◷', title: 'Time Efficiency', body: 'No need to learn charts, technical analysis, or market psychology. AegisAI handles all execution autonomously.' },
    { icon: '◈', title: 'Institutional Infrastructure', body: 'Built around quantitative execution, institutional risk control, and multi-layer automated safety systems.' },
    { icon: '⊞', title: 'Scalability', body: 'Multiple funded accounts can be operated simultaneously, compounding systematic exposure across account tiers.' },
    { icon: '◎', title: 'Passive Exposure', body: 'Hands-free, fully automated execution. Your account operates 24 hours while the markets are open — without you.' },
    { icon: '∿', title: 'Consistency Focused', body: 'The system prioritizes sustainable, repeatable payouts over high-risk, high-reward approaches that jeopardize the account.' },
    { icon: '⬡', title: 'Professional Management', body: 'Managed directly by quantitative developers and systematic trading operators with institutional-grade infrastructure.' },
  ];

  return (
    <section id="qs-why" style={{ padding: '130px 48px', background: '#0A0A0A' }}>
      <div style={{ maxWidth: 1160, margin: '0 auto' }}>
        <div style={{ marginBottom: 68 }}>
          <div style={{ fontSize: 9, letterSpacing: '0.28em', textTransform: 'uppercase', color: '#A3D9FF', marginBottom: 18, opacity: 0.8 }}>
            Value Proposition
          </div>
          <h2 style={{ fontSize: 42, fontWeight: 200, letterSpacing: '-0.025em', color: '#EDEDED', maxWidth: 560 }}>
            Why High-Net-Worth Clients Choose AegisAI
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 56 }}>
          {reasons.map(r => (
            <div key={r.title} style={{ border: '1px solid rgba(255,255,255,0.055)', borderRadius: 12, padding: '32px', background: '#0D0D0D', transition: 'border-color 0.2s, background 0.2s' }} className="qs-card">
              <div style={{ fontSize: 22, color: '#2A2A2A', marginBottom: 18, lineHeight: 1 }}>{r.icon}</div>
              <h3 style={{ fontSize: 15, fontWeight: 400, color: '#C0C0C0', marginBottom: 12, letterSpacing: '-0.01em' }}>{r.title}</h3>
              <p style={{ color: '#484848', fontSize: 13, lineHeight: 1.85 }}>{r.body}</p>
            </div>
          ))}
        </div>

        <div style={{ border: '1px solid rgba(163,217,255,0.07)', borderRadius: 14, padding: '40px', background: 'rgba(163,217,255,0.015)', textAlign: 'center' }}>
          <p style={{ color: '#4A4A4A', fontSize: 16, lineHeight: 1.95, maxWidth: 760, margin: '0 auto 8px', fontWeight: 300 }}>
            AegisAI was engineered for individuals seeking sophisticated algorithmic market exposure without becoming full-time traders. By combining artificial intelligence, quantitative research, tick-data analysis, institutional risk frameworks, and automated execution systems — AegisAI delivers a structured, scalable, and hands-free approach to modern futures trading.
          </p>
          <p style={{ color: '#333', fontSize: 12, marginTop: 16, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Private · Capacity-Limited · Offered Selectively to Qualified Participants
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── Form Styles ───────────────────────────────────────────────────────────────
const S = {
  label: { display: 'block' as const, color: '#666', fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase' as const, marginBottom: '6px' },
  input: { width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#E0E0E0', fontSize: '14px', padding: '11px 14px', outline: 'none', boxSizing: 'border-box' as const, fontFamily: 'inherit', transition: 'border-color 0.2s' },
  cta: { background: 'transparent', border: '1px solid rgba(163,217,255,0.35)', color: '#A3D9FF', borderRadius: '8px', padding: '14px 32px', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase' as const, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' },
};

// ─── Modal ────────────────────────────────────────────────────────────────────
function Modal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [done, setDone] = useState(false);
  const [f, setF] = useState({ name: '', email: '', phone: '', size: '', note: '', ack: false });
  if (!open) return null;
  const submit = (e: React.FormEvent) => { e.preventDefault(); setDone(true); };
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={{ background: '#0F0F0F', border: '1px solid rgba(255,255,255,0.09)', borderRadius: '16px', padding: '44px', maxWidth: '500px', width: '100%', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 18, right: 18, background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: '22px', lineHeight: 1, fontFamily: 'inherit' }}>×</button>
        {done ? (
          <div style={{ textAlign: 'center', padding: '32px 0' }}>
            <div style={{ color: '#A3D9FF', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '20px' }}>Received</div>
            <h3 style={{ color: '#E8E8E8', fontSize: '24px', fontWeight: 200, letterSpacing: '-0.02em', marginBottom: '16px' }}>Your request has been received.</h3>
            <p style={{ color: '#555', fontSize: '14px', lineHeight: 1.9 }}>Qualified inquiries are reviewed in the order received. We will be in touch if your profile aligns with current program parameters.</p>
          </div>
        ) : (
          <>
            <div style={{ color: '#A3D9FF', fontSize: '10px', letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: '10px' }}>Private Program</div>
            <h3 style={{ color: '#E8E8E8', fontSize: '22px', fontWeight: 200, letterSpacing: '-0.02em', marginBottom: '6px' }}>Request Consideration</h3>
            <p style={{ color: '#444', fontSize: '13px', marginBottom: '32px', lineHeight: 1.7 }}>Quantara System One — AegisAI Institutional Gold Algorithmic Program</p>
            <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div><label style={S.label}>Full Name *</label><input required value={f.name} onChange={e => setF(p => ({ ...p, name: e.target.value }))} style={S.input} placeholder="Your full name" /></div>
              <div><label style={S.label}>Email Address *</label><input required type="email" value={f.email} onChange={e => setF(p => ({ ...p, email: e.target.value }))} style={S.input} placeholder="your@email.com" /></div>
              <div><label style={S.label}>Phone <span style={{ color: '#3A3A3A' }}>Optional</span></label><input value={f.phone} onChange={e => setF(p => ({ ...p, phone: e.target.value }))} style={S.input} placeholder="+1 (000) 000-0000" /></div>
              <div>
                <label style={S.label}>Account Size Interest *</label>
                <select required value={f.size} onChange={e => setF(p => ({ ...p, size: e.target.value }))} style={{ ...S.input, appearance: 'none' as const, WebkitAppearance: 'none' as const }}>
                  <option value="">Select size...</option>
                  <option value="50k">$50,000</option>
                  <option value="100k">$100,000</option>
                  <option value="150k">$150,000</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div><label style={S.label}>Why are you exploring systematic approaches?</label><textarea value={f.note} onChange={e => setF(p => ({ ...p, note: e.target.value }))} style={{ ...S.input, height: '88px', resize: 'none' as const }} placeholder="Brief note..." /></div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <input required type="checkbox" id="qs-ack" checked={f.ack} onChange={e => setF(p => ({ ...p, ack: e.target.checked }))} style={{ marginTop: '3px', flexShrink: 0, accentColor: '#A3D9FF', cursor: 'pointer' }} />
                <label htmlFor="qs-ack" style={{ color: '#555', fontSize: '12px', lineHeight: 1.7, cursor: 'pointer' }}>I acknowledge this is a private program for qualified participants only and understand all trading involves substantial risk of loss.</label>
              </div>
              <button type="submit" style={{ ...S.cta, padding: '15px', width: '100%', marginTop: '4px', fontSize: '11px' }}>Request Consideration</button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function QuantaraPage() {
  const [modal, setModal] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [goldData, setGoldData] = useState<GoldData | null>(null);
  const [goldLoading, setGoldLoading] = useState(true);

  const fetchGold = useCallback(async () => {
    try {
      const res = await fetch('/api/gold');
      const data = await res.json();
      setGoldData(data);
    } catch {
      setGoldData(prev => prev ?? { error: true } as GoldData);
    } finally {
      setGoldLoading(false);
    }
  }, []);

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400;500;600&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); document.head.removeChild(link); };
  }, []);

  useEffect(() => {
    fetchGold();
    const interval = setInterval(fetchGold, 30000);
    return () => clearInterval(interval);
  }, [fetchGold]);

  const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  const openModal = () => setModal(true);

  const navLinks: [string, string][] = [
    ['Markets', 'qs-markets'],
    ['Performance', 'qs-performance'],
    ['Process', 'qs-process'],
    ['Dashboard', 'qs-dashboard'],
    ['Systems', 'qs-systems'],
    ['Access', 'qs-access'],
  ];

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .qs-wrap { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #0A0A0A; color: #F0F0F0; min-height: 100vh; width: 100%; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
        .qs-wrap * { font-family: inherit; }
        .qs-nav-link { background: none; border: none; color: #4A4A4A; font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; cursor: pointer; transition: color 0.2s; padding: 4px 0; }
        .qs-nav-link:hover { color: #B0B0B0; }
        .qs-cta:hover { background: rgba(163,217,255,0.1) !important; border-color: rgba(163,217,255,0.65) !important; }
        .qs-card { transition: background 0.2s, border-color 0.2s; }
        .qs-card:hover { background: rgba(255,255,255,0.035) !important; border-color: rgba(255,255,255,0.1) !important; }
        .qs-quote-card { transition: border-color 0.25s; }
        .qs-quote-card:hover { border-color: rgba(255,255,255,0.1) !important; }
        @keyframes qs-up { from { opacity: 0; transform: translateY(22px); } to { opacity: 1; transform: none; } }
        .qs-a0 { animation: qs-up 0.9s ease both; }
        .qs-a1 { animation: qs-up 0.9s ease 0.18s both; }
        .qs-a2 { animation: qs-up 0.9s ease 0.34s both; }
        .qs-a3 { animation: qs-up 0.9s ease 0.5s both; }
        @keyframes qs-pulse { 0%,100% { opacity: 0.3; } 50% { opacity: 0.7; } }
        .qs-dot { animation: qs-pulse 2.8s ease-in-out infinite; }
        @media (max-width: 960px) {
          .qs-nav-links { display: none !important; }
          .qs-hero-h1 { font-size: 34px !important; }
          .qs-grid-2 { grid-template-columns: 1fr !important; gap: 20px !important; }
          .qs-grid-3 { grid-template-columns: 1fr !important; }
          .qs-section { padding: 80px 24px !important; }
          .qs-hero-inner { padding: 0 20px !important; }
          .qs-footer-inner { grid-template-columns: 1fr !important; text-align: left !important; }
          .qs-footer-right { text-align: left !important; }
          .qs-dashboard-grid { grid-template-columns: 1fr !important; }
          .qs-payout-grid { grid-template-columns: 1fr 1fr !important; }
          .qs-ticker-price { font-size: 32px !important; }
        }
      `}</style>

      <div className="qs-wrap">

        {/* ── NAVIGATION ── */}
        <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200, height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 48px', background: scrolled ? 'rgba(10,10,10,0.94)' : 'transparent', backdropFilter: scrolled ? 'blur(20px)' : 'none', borderBottom: scrolled ? '1px solid rgba(255,255,255,0.05)' : 'none', transition: 'background 0.35s, backdrop-filter 0.35s, border-color 0.35s' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => go('qs-hero')}>
            <QMark size={34} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 300, letterSpacing: '0.28em', textTransform: 'uppercase', color: '#D8D8D8', lineHeight: 1.2 }}>Quantara</div>
              <div style={{ fontSize: 8, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#3A3A3A', marginTop: 1 }}>Systems</div>
            </div>
          </div>
          <div className="qs-nav-links" style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
            {navLinks.map(([label, id]) => (
              <button key={id} className="qs-nav-link" onClick={() => go(id)}>{label}</button>
            ))}
            <button className="qs-cta" onClick={openModal} style={{ ...S.cta, padding: '8px 18px', marginLeft: 8 }}>Request Access</button>
          </div>
        </nav>

        {/* ── HERO ── */}
        <section id="qs-hero" style={{ position: 'relative', height: '100vh', minHeight: 720, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <NetworkCanvas />
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, background: 'radial-gradient(ellipse 70% 55% at 50% 52%, rgba(163,217,255,0.042) 0%, transparent 70%)' }} />
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 180, background: 'linear-gradient(to bottom, #0A0A0A, transparent)', pointerEvents: 'none', zIndex: 1 }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 220, background: 'linear-gradient(to top, #0A0A0A, transparent)', pointerEvents: 'none', zIndex: 1 }} />

          <div className="qs-hero-inner" style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '0 28px', maxWidth: 960 }}>
            <div className="qs-a0" style={{ display: 'flex', justifyContent: 'center', marginBottom: 44 }}>
              <QMark size={104} />
            </div>
            <div className="qs-a1" style={{ fontSize: 9, letterSpacing: '0.32em', textTransform: 'uppercase', color: '#3C3C3C', marginBottom: 28 }}>
              Quantitative Market Systems · Powered by AegisAI
            </div>
            <h1 className="qs-a2 qs-hero-h1" style={{ fontSize: 54, fontWeight: 200, letterSpacing: '-0.035em', lineHeight: 1.08, color: '#EDEDED', marginBottom: 10 }}>
              Quantara System One
            </h1>
            <div className="qs-a2" style={{ fontSize: 13, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#3E3E3E', marginBottom: 28, fontWeight: 300 }}>
              QS1 &nbsp;·&nbsp; Institutional Gold Algorithmic Program
            </div>
            <p className="qs-a3" style={{ color: '#505050', fontSize: 16, lineHeight: 1.85, maxWidth: 660, margin: '0 auto 44px', fontWeight: 300 }}>
              A proprietary quantitative framework powered by AegisAI — algorithmic execution in Gold futures markets. Structured systems that interpret market behavior through machine learning, statistical frameworks, and institutional risk architecture.
            </p>
            <div className="qs-a3" style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button className="qs-cta" onClick={openModal} style={{ ...S.cta, padding: '15px 36px', fontSize: 11 }}>Request Consideration</button>
              <button onClick={() => go('qs-markets')} style={{ ...S.cta, padding: '15px 36px', fontSize: 11, borderColor: 'rgba(255,255,255,0.08)', color: '#4A4A4A' }}>
                View Live Markets
              </button>
            </div>
          </div>

          <div style={{ position: 'absolute', bottom: 36, left: '50%', transform: 'translateX(-50%)', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 1, height: 52, background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.16))' }} />
            <div className="qs-dot" style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(163,217,255,0.5)' }} />
          </div>
        </section>

        {/* ── LIVE MARKET DATA ── */}
        <div id="qs-markets">
          <GoldTickerBar data={goldData} loading={goldLoading} />
        </div>

        {/* ── THE SYSTEM ── */}
        <section id="qs-systems" className="qs-section" style={{ padding: '130px 48px' }}>
          <div style={{ maxWidth: 1160, margin: '0 auto' }}>
            <div style={{ marginBottom: 68 }}>
              <div style={{ fontSize: 9, letterSpacing: '0.28em', textTransform: 'uppercase', color: '#A3D9FF', marginBottom: 18, opacity: 0.8 }}>The System</div>
              <h2 style={{ fontSize: 42, fontWeight: 200, letterSpacing: '-0.025em', color: '#EDEDED', marginBottom: 22, maxWidth: 560 }}>
                Structured Quantitative Execution
              </h2>
              <p style={{ color: '#484848', fontSize: 16, lineHeight: 1.92, maxWidth: 660, fontWeight: 300 }}>
                Quantara System One (QS1) is an institutional-grade algorithmic trading infrastructure powered by AegisAI, focused on Gold futures (GC/MGC). The system integrates multi-year quantitative research with machine learning models for consistent, non-discretionary execution.
              </p>
            </div>

            <div className="qs-grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: 16, overflow: 'hidden', marginBottom: 56 }}>
              {[
                { n: '01', title: 'Market Microstructure Evaluation', body: 'Session-aware analysis of order flow dynamics, liquidity zones, and structural inflection points in Gold futures markets.' },
                { n: '02', title: 'Statistical Pattern Recognition', body: 'Neural architectures trained on tick-level historical data to identify environments with statistically observable characteristics.' },
                { n: '03', title: 'Volatility Regime Filtering', body: 'Multi-regime detection framework that adapts execution parameters based on prevailing volatility and correlation states.' },
                { n: '04', title: 'Dynamic Risk Architecture', body: 'Proprietary risk allocation with adaptive position sizing, drawdown controls, and consistency rule compliance.' },
                { n: '05', title: 'Automated Execution Engine', body: 'Fully automated trade identification, entry, and management. Zero manual intervention required during operation.' },
                { n: '06', title: 'Platform Integration', body: 'Native connectivity to Tradovate, TradingView, and Lucid Trading proprietary capital program infrastructure.' },
              ].map(item => (
                <div key={item.n} className="qs-card" style={{ padding: 32, background: '#0D0D0D', borderRight: '1px solid rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <div style={{ fontSize: 10, color: '#2A2A2A', letterSpacing: '0.1em', marginBottom: 18 }}>{item.n}</div>
                  <h3 style={{ fontSize: 14, fontWeight: 400, color: '#C8C8C8', marginBottom: 12, letterSpacing: '-0.01em', lineHeight: 1.4 }}>{item.title}</h3>
                  <p style={{ color: '#484848', fontSize: 13, lineHeight: 1.85 }}>{item.body}</p>
                </div>
              ))}
            </div>

            <div style={{ border: '1px solid rgba(255,255,255,0.05)', borderRadius: 8, padding: '18px 24px', background: 'rgba(255,255,255,0.015)' }}>
              <p style={{ color: '#383838', fontSize: 12, lineHeight: 1.85 }}>
                <span style={{ color: '#484848', fontWeight: 500 }}>Risk Disclosure —</span> All trading involves substantial risk of loss. Past performance does not indicate future results. QS1 does not predict markets or guarantee specific outcomes. Participation is restricted to qualified individuals only.
              </p>
            </div>
          </div>
        </section>

        {/* ── PERFORMANCE PROJECTIONS ── */}
        <PerformanceSection />

        {/* ── HOW IT WORKS ── */}
        <HowItWorks onOpen={openModal} />

        {/* ── ACCOUNT DASHBOARD ── */}
        <AccountDashboard />

        {/* ── WHY AEGISAI ── */}
        <WhyAegisAI />

        {/* ── APPROACH ── */}
        <section id="qs-approach" className="qs-section" style={{ padding: '130px 48px', background: 'linear-gradient(180deg, #0A0A0A 0%, #0C1018 60%, #0A0A0A 100%)' }}>
          <div style={{ maxWidth: 1160, margin: '0 auto' }}>
            <div style={{ marginBottom: 68 }}>
              <div style={{ fontSize: 9, letterSpacing: '0.28em', textTransform: 'uppercase', color: '#A3D9FF', marginBottom: 18, opacity: 0.8 }}>Development</div>
              <h2 style={{ fontSize: 42, fontWeight: 200, letterSpacing: '-0.025em', color: '#EDEDED', maxWidth: 480 }}>Research-Driven Development</h2>
            </div>
            <div className="qs-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 88, alignItems: 'start' }}>
              <div>
                <p style={{ color: '#4A4A4A', fontSize: 15, lineHeight: 1.95, marginBottom: 28, fontWeight: 300 }}>
                  QS1 originated as a quantitative research initiative examining whether structured AI frameworks could provide consistent execution in Gold futures while prioritizing capital preservation and statistical discipline.
                </p>
                <p style={{ color: '#3A3A3A', fontSize: 14, lineHeight: 1.95, fontWeight: 300 }}>
                  The system does not predict markets. It identifies environments with historically observable statistical characteristics and applies predefined execution rules without discretionary override.
                </p>
                <div style={{ display: 'flex', gap: 40, marginTop: 48 }}>
                  {[{ val: 'GC/MGC', label: 'Focus Markets' }, { val: 'ML/RL', label: 'Model Architecture' }, { val: '100%', label: 'Automated' }].map(m => (
                    <div key={m.label}>
                      <div style={{ fontSize: 20, fontWeight: 200, color: '#C0C0C0', letterSpacing: '-0.02em', marginBottom: 4 }}>{m.val}</div>
                      <div style={{ fontSize: 10, color: '#383838', letterSpacing: '0.12em', textTransform: 'uppercase' }}>{m.label}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {[
                  { phase: 'Phase I', title: 'Historical Analysis', body: 'Extensive tick-level historical analysis of Gold futures spanning multiple market cycles and volatility regimes.' },
                  { phase: 'Phase II', title: 'Model Development', body: 'Neural pattern recognition and reinforcement learning optimization across defined objective functions.' },
                  { phase: 'Phase III', title: 'Forward Testing', body: 'Multi-year forward testing in live market conditions with structured performance monitoring and parameter refinement.' },
                  { phase: 'Phase IV', title: 'Infrastructure Integration', body: 'Integration with proprietary capital frameworks and establishment of execution monitoring protocols.' },
                ].map((item, i, arr) => (
                  <div key={i} style={{ display: 'flex', gap: 24, paddingBottom: i < arr.length - 1 ? 36 : 0 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{ width: 30, height: 30, borderRadius: '50%', border: '1px solid rgba(163,217,255,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(163,217,255,0.55)' }} />
                      </div>
                      {i < arr.length - 1 && <div style={{ width: 1, flex: 1, background: 'rgba(163,217,255,0.07)', marginTop: 8 }} />}
                    </div>
                    <div style={{ paddingTop: 5 }}>
                      <div style={{ fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(163,217,255,0.45)', marginBottom: 4 }}>{item.phase}</div>
                      <div style={{ fontSize: 14, fontWeight: 400, color: '#B0B0B0', marginBottom: 8 }}>{item.title}</div>
                      <p style={{ color: '#484848', fontSize: 13, lineHeight: 1.85 }}>{item.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── PARTICIPANT PERSPECTIVES ── */}
        <section id="qs-infrastructure" className="qs-section" style={{ padding: '130px 48px' }}>
          <div style={{ maxWidth: 1160, margin: '0 auto' }}>
            <div style={{ marginBottom: 68 }}>
              <div style={{ fontSize: 9, letterSpacing: '0.28em', textTransform: 'uppercase', color: '#A3D9FF', marginBottom: 18, opacity: 0.8 }}>Perspectives</div>
              <h2 style={{ fontSize: 42, fontWeight: 200, letterSpacing: '-0.025em', color: '#EDEDED' }}>Participant Perspectives</h2>
            </div>
            <div className="qs-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 60 }}>
              {[
                { q: 'The systematic nature of QS1 removed the emotional variables I struggled with in discretionary trading. AegisAI simply executes.', name: 'M.R.', role: 'Family Office Allocator' },
                { q: 'Having a research-grade AI framework manage execution allows me to allocate attention elsewhere while maintaining alignment with prop firm requirements.', name: 'D.K.', role: 'Accredited Participant' },
                { q: "AegisAI's focus on structure and consistency has been evident in the account behavior from the first month of operation.", name: 'S.L.', role: 'QS1 Participant since 2024' },
                { q: 'I was looking for a systematic approach that did not require constant monitoring. AegisAI operates within clearly defined parameters without intervention.', name: 'T.M.', role: 'Independent Allocator' },
              ].map((t, i) => (
                <div key={i} className="qs-quote-card" style={{ border: '1px solid rgba(255,255,255,0.055)', borderRadius: 12, padding: 32, background: '#0D0D0D' }}>
                  <div style={{ color: '#3A3A3A', fontSize: 28, lineHeight: 1, marginBottom: 20, fontWeight: 200 }}>&ldquo;</div>
                  <p style={{ color: '#6A6A6A', fontSize: 15, lineHeight: 1.92, fontWeight: 300, marginBottom: 28, fontStyle: 'italic' }}>{t.q}</p>
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: 18 }}>
                    <div style={{ fontSize: 13, color: '#B8B8B8', fontWeight: 400 }}>{t.name}</div>
                    <div style={{ fontSize: 11, color: '#3A3A3A', letterSpacing: '0.06em', marginTop: 3 }}>{t.role}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ textAlign: 'center' }}>
              <button className="qs-cta" onClick={openModal} style={S.cta}>Request Consideration</button>
            </div>
          </div>
        </section>

        {/* ── PROGRAM CONSIDERATIONS ── */}
        <section id="qs-considerations" className="qs-section" style={{ padding: '130px 48px', background: 'linear-gradient(180deg, #0A0A0A 0%, #0C1018 100%)' }}>
          <div style={{ maxWidth: 1160, margin: '0 auto' }}>
            <div style={{ marginBottom: 68 }}>
              <div style={{ fontSize: 9, letterSpacing: '0.28em', textTransform: 'uppercase', color: '#A3D9FF', marginBottom: 18, opacity: 0.8 }}>Parameters</div>
              <h2 style={{ fontSize: 42, fontWeight: 200, letterSpacing: '-0.025em', color: '#EDEDED' }}>Program Considerations</h2>
            </div>
            <div className="qs-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 72, marginBottom: 60 }}>
              <div>
                <div style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#333', marginBottom: 28 }}>Program Structure</div>
                {[
                  ['Structure', 'Private, invite-only initiative'],
                  ['Focus', 'Gold futures — GC/MGC'],
                  ['AI Engine', 'AegisAI v3.2 (Quantitative ML)'],
                  ['Integration', 'Lucid Trading + Tradovate'],
                  ['Fee Model', '20% on successful payouts only'],
                  ['Access', 'Qualified participants only'],
                  ['Operation', 'Fully automated — no manual input'],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '13px 0', borderBottom: '1px solid rgba(255,255,255,0.035)', gap: 16 }}>
                    <span style={{ color: '#383838', fontSize: 13 }}>{k}</span>
                    <span style={{ color: '#7A7A7A', fontSize: 13, textAlign: 'right' }}>{v}</span>
                  </div>
                ))}
              </div>
              <div>
                <div style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#333', marginBottom: 28 }}>Account Parameters</div>
                <div style={{ border: '1px solid rgba(255,255,255,0.055)', borderRadius: 10, overflow: 'hidden', marginBottom: 20 }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        {['Account Size', 'Max Payout/Cycle', 'Client / AegisAI'].map(h => (
                          <th key={h} style={{ padding: '12px 16px', textAlign: 'left', color: '#333', fontWeight: 500, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ['$50,000', '$1,250–$1,500', '80% / 20%'],
                        ['$100,000', '$2,500–$3,000', '80% / 20%'],
                        ['$150,000', '$3,000–$3,500', '80% / 20%'],
                      ].map(([sz, mp, sp]) => (
                        <tr key={sz} style={{ borderBottom: '1px solid rgba(255,255,255,0.028)' }}>
                          <td style={{ padding: '13px 16px', color: '#B8B8B8' }}>{sz}</td>
                          <td style={{ padding: '13px 16px', color: '#7A7A7A', fontVariantNumeric: 'tabular-nums' }}>{mp}</td>
                          <td style={{ padding: '13px 16px', color: '#6A6A6A' }}>{sp}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div style={{ padding: '18px 20px', border: '1px solid rgba(220,80,80,0.1)', borderRadius: 8, background: 'rgba(200,60,60,0.03)' }}>
                  <div style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#5A3030', marginBottom: 8 }}>Important Disclaimer</div>
                  <p style={{ color: '#4A3232', fontSize: 12, lineHeight: 1.85 }}>All trading involves substantial risk of loss. Past performance does not indicate future results. Participation is restricted to qualified individuals. Quantara Systems does not guarantee any specific outcomes.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── ACCESS ── */}
        <section id="qs-access" className="qs-section" style={{ padding: '130px 48px' }}>
          <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
            <div style={{ fontSize: 9, letterSpacing: '0.28em', textTransform: 'uppercase', color: '#A3D9FF', marginBottom: 18, opacity: 0.8 }}>Private Program</div>
            <h2 style={{ fontSize: 42, fontWeight: 200, letterSpacing: '-0.025em', color: '#EDEDED', marginBottom: 22 }}>Request Consideration</h2>
            <p style={{ color: '#484848', fontSize: 16, lineHeight: 1.9, marginBottom: 44, fontWeight: 300 }}>
              Quantara System One operates as a private, invite-only initiative. AegisAI-managed accounts are capacity-limited and offered selectively to qualified participants. All information submitted is confidential.
            </p>
            <button className="qs-cta" onClick={openModal} style={{ ...S.cta, padding: '18px 52px', fontSize: 12 }}>Request Consideration</button>
            <p style={{ color: '#2A2A2A', fontSize: 11, marginTop: 28, letterSpacing: '0.04em' }}>Qualified applicants only · Private & Confidential · No solicitation</p>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer style={{ borderTop: '1px solid rgba(255,255,255,0.04)', background: '#060606', padding: '56px 48px 40px' }}>
          <div style={{ maxWidth: 1160, margin: '0 auto' }}>
            <div className="qs-footer-inner" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, marginBottom: 48 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                  <QMark size={26} />
                  <span style={{ fontSize: 12, fontWeight: 300, letterSpacing: '0.24em', textTransform: 'uppercase', color: '#5A5A5A' }}>Quantara Systems</span>
                </div>
                <p style={{ color: '#2E2E2E', fontSize: 12, lineHeight: 1.9, maxWidth: 380 }}>
                  Quantitative market systems powered by AegisAI. Structured algorithmic approaches to Gold futures for qualified participants seeking systematic, hands-free market exposure.
                </p>
              </div>
              <div className="qs-footer-right" style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#2A2A2A', marginBottom: 14 }}>Private Program</div>
                <p style={{ color: '#333', fontSize: 12, lineHeight: 2 }}>
                  Qualified inquiries only.<br />All communications are confidential.<br />
                  <span style={{ color: '#282828' }}>quantarasystems.com</span>
                </p>
              </div>
            </div>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.025)', paddingTop: 28 }}>
              <p style={{ color: '#242424', fontSize: 11, lineHeight: 1.95, marginBottom: 18 }}>
                <strong style={{ color: '#2E2E2E' }}>RISK DISCLOSURE:</strong> Trading futures contracts involves substantial risk of loss and is not appropriate for all investors. Past performance is not indicative of future results. Quantara Systems and AegisAI do not guarantee profits or freedom from loss. The content on this site is for informational purposes only and does not constitute financial advice, a solicitation, or an offer to buy or sell any financial instrument. Participation in Quantara System One is restricted to qualified, accredited individuals only. All performance data, if presented, reflects historical system behavior and projected estimates — not a guarantee of future performance. Payout projections are illustrative only. This is a private, confidential program. Unauthorized distribution of any materials is prohibited.
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                <span style={{ color: '#222', fontSize: 11 }}>© 2026 Quantara Systems. All rights reserved. Confidential.</span>
                <span style={{ color: '#1E1E1E', fontSize: 11 }}>Private Program · Qualified Participants Only</span>
              </div>
            </div>
          </div>
        </footer>

        {/* ── FLOATING CTA ── */}
        <div style={{ position: 'fixed', bottom: 32, right: 32, zIndex: 100 }}>
          <button className="qs-cta" onClick={openModal} style={{ ...S.cta, padding: '12px 22px', background: 'rgba(10,10,10,0.95)', backdropFilter: 'blur(16px)', boxShadow: '0 8px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(163,217,255,0.08)' }}>
            Request Consideration
          </button>
        </div>
      </div>

      <Modal open={modal} onClose={() => setModal(false)} />
    </>
  );
}
