'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Particle { x: number; y: number; vx: number; vy: number; opacity: number; size: number; gold: boolean; }
interface GoldPoint { t: number; p: number; }
interface GoldData {
  price: number; prev: number; change: number; changePct: number;
  high: number; low: number; volume: number; state: string;
  points: GoldPoint[]; ts: number; error?: boolean;
}

// ─── Animated Counter Hook ────────────────────────────────────────────────────
function useCountUp(target: number, duration = 1800, prefix = '', suffix = '') {
  const [display, setDisplay] = useState(`${prefix}0${suffix}`);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const start = Date.now();
        const tick = () => {
          const elapsed = Date.now() - start;
          const p = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - p, 4);
          const val = Math.round(eased * target);
          setDisplay(`${prefix}${val.toLocaleString()}${suffix}`);
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [target, duration, prefix, suffix]);
  return { display, ref };
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
      particles = Array.from({ length: 70 }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.22, vy: (Math.random() - 0.5) * 0.22,
        opacity: Math.random() * 0.4 + 0.05,
        size: Math.random() * 1.5 + 0.5,
        gold: Math.random() > 0.65,
      }));
    }
    function resize() {
      const dpr = window.devicePixelRatio || 1;
      canvas!.width = canvas!.offsetWidth * dpr; canvas!.height = canvas!.offsetHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); init();
    }
    function draw() {
      const w = canvas!.offsetWidth; const h = canvas!.offsetHeight;
      ctx.clearRect(0, 0, w, h);
      for (let x = 0; x <= w; x += 100) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h);
        ctx.strokeStyle = 'rgba(255,255,255,0.012)'; ctx.lineWidth = 1; ctx.stroke();
      }
      for (let y = 0; y <= h; y += 100) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y);
        ctx.strokeStyle = 'rgba(255,255,255,0.012)'; ctx.stroke();
      }
      for (const p of particles) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
      }
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x; const dy = particles[i].y - particles[j].y;
          const d = Math.hypot(dx, dy);
          if (d < 140) {
            const alpha = (1 - d / 140) * 0.055;
            const col = (particles[i].gold || particles[j].gold) ? `rgba(245,158,11,${alpha})` : `rgba(163,217,255,${alpha * 0.6})`;
            ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = col; ctx.lineWidth = 0.5; ctx.stroke();
          }
        }
      }
      for (const p of particles) {
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.gold ? `rgba(245,158,11,${p.opacity})` : `rgba(163,217,255,${p.opacity * 0.7})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    }
    const ro = new ResizeObserver(resize); ro.observe(canvas); resize(); draw();
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);
  return <canvas ref={ref} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }} />;
}

// ─── SVG Logo Mark ─────────────────────────────────────────────────────────────
function QMark({ size = 50, glow = false }: { size?: number; glow?: boolean }) {
  return (
    <div style={glow ? { filter: 'drop-shadow(0 0 20px rgba(245,158,11,0.25)) drop-shadow(0 0 40px rgba(245,158,11,0.1))' } : {}}>
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
    </div>
  );
}

// ─── SparkLine ────────────────────────────────────────────────────────────────
function SparkLine({ points, positive, width = 240, height = 52 }: { points: GoldPoint[]; positive: boolean; width?: number; height?: number }) {
  if (points.length < 2) return <div style={{ width, height, background: 'rgba(255,255,255,0.02)', borderRadius: 4 }} />;
  const prices = points.map(p => p.p);
  const min = Math.min(...prices); const max = Math.max(...prices); const range = max - min || 1;
  const pad = 4;
  const toX = (i: number) => pad + (i / (prices.length - 1)) * (width - pad * 2);
  const toY = (p: number) => height - pad - ((p - min) / range) * (height - pad * 2);
  const pathD = prices.map((p, i) => `${i === 0 ? 'M' : 'L'}${toX(i).toFixed(1)},${toY(p).toFixed(1)}`).join(' ');
  const fillD = `${pathD} L${toX(prices.length - 1).toFixed(1)},${height} L${toX(0).toFixed(1)},${height} Z`;
  const color = positive ? '#F59E0B' : '#F87171';
  const id = `sl-${positive ? 'g' : 'r'}-${width}`;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: 'block' }}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.25} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={fillD} fill={`url(#${id})`} />
      <path d={pathD} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ filter: `drop-shadow(0 0 4px ${color}66)` }} />
    </svg>
  );
}

// ─── Ticker Tape ──────────────────────────────────────────────────────────────
function TickerTape({ data }: { data: GoldData | null }) {
  const fmt = (n: number) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const pos = data ? data.change >= 0 : true;
  const items = [
    { label: 'GC FUTURES', val: data ? `$${fmt(data.price)}` : '---' },
    { label: 'CHANGE', val: data ? `${pos ? '+' : ''}${fmt(data.change)}` : '---', gold: true },
    { label: '24H RANGE', val: data ? `${fmt(data.low)} – ${fmt(data.high)}` : '---' },
    { label: 'PREV CLOSE', val: data ? `$${fmt(data.prev)}` : '---' },
    { label: 'QS1 ENGINE', val: 'ACTIVE' },
    { label: 'PROGRAM', val: 'QS1 · GOLD FUTURES' },
    { label: 'EXECUTION', val: '100% AUTOMATED' },
    { label: 'PAYOUT MODEL', val: '80 / 20 SPLIT' },
    { label: 'ACCOUNTS', val: '$50K · $100K · $150K' },
  ];
  const all = [...items, ...items];
  return (
    <div style={{ background: '#050506', borderBottom: '1px solid rgba(245,158,11,0.08)', height: 34, overflow: 'hidden', display: 'flex', alignItems: 'center', position: 'relative', zIndex: 50 }}>
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 60, background: 'linear-gradient(to right, #050506, transparent)', zIndex: 2 }} />
      <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 60, background: 'linear-gradient(to left, #050506, transparent)', zIndex: 2 }} />
      <div style={{ display: 'flex', gap: 0, animation: 'qs-ticker 40s linear infinite', whiteSpace: 'nowrap', willChange: 'transform' }}>
        {all.map((item, i) => (
          <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '0 32px' }}>
            <span style={{ color: '#282828', fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase' }}>{item.label}</span>
            <span style={{ color: item.gold || item.label === 'CHANGE' ? (pos ? '#F59E0B' : '#F87171') : '#4A4A4A', fontSize: 10, fontVariantNumeric: 'tabular-nums', letterSpacing: '0.06em', fontWeight: 400 }}>{item.val}</span>
            <span style={{ color: '#1A1A1A', marginLeft: 8 }}>◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Gradient Badge ───────────────────────────────────────────────────────────
function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 7,
      background: 'rgba(245,158,11,0.06)',
      border: '1px solid rgba(245,158,11,0.18)',
      borderRadius: 100, padding: '5px 14px',
      fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase',
      color: '#F59E0B',
    }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#F59E0B', boxShadow: '0 0 8px #F59E0B', animation: 'qs-pulse 2s ease-in-out infinite', display: 'inline-block' }} />
      {children}
    </span>
  );
}

// ─── Gold Ticker Full Section ─────────────────────────────────────────────────
function GoldTickerBar({ data, loading }: { data: GoldData | null; loading: boolean }) {
  const pos = data ? data.change >= 0 : true;
  const fmt = (n: number) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const color = pos ? '#F59E0B' : '#F87171';

  return (
    <section id="qs-markets" style={{
      padding: '72px 48px',
      background: 'linear-gradient(180deg, #070708 0%, #0A0A0C 100%)',
      borderBottom: '1px solid rgba(245,158,11,0.06)',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', top: '50%', left: '30%', transform: 'translate(-50%,-50%)', width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,158,11,0.035) 0%, transparent 65%)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
          <Badge>Live Market Feed</Badge>
          {!loading && data && !data.error && (
            <span style={{ fontSize: 10, color: '#2E2E2E', letterSpacing: '0.12em' }}>
              Updated {new Date(data.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          )}
        </div>

        {loading ? (
          <div style={{ height: 100, display: 'flex', alignItems: 'center', gap: 32 }}>
            {[260, 140, 100, 100].map((w, i) => (
              <div key={i} style={{ width: w, height: 20, background: 'rgba(255,255,255,0.03)', borderRadius: 4, animation: 'qs-pulse 1.8s ease-in-out infinite' }} />
            ))}
          </div>
        ) : data && !data.error ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', gap: '32px 64px' }}>
            <div>
              <div style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#333', marginBottom: 10 }}>
                COMEX · Gold Futures Continuous (GC=F)
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 18 }}>
                <span style={{
                  fontSize: 56, fontWeight: 200, letterSpacing: '-0.04em', fontVariantNumeric: 'tabular-nums',
                  background: 'linear-gradient(135deg, #FFFFFF 0%, #E8E8E8 40%, #F59E0B 100%)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                  filter: 'drop-shadow(0 0 30px rgba(245,158,11,0.2))',
                }}>
                  ${fmt(data.price)}
                </span>
                <div>
                  <div style={{ fontSize: 20, fontWeight: 300, color, letterSpacing: '-0.01em', fontVariantNumeric: 'tabular-nums', filter: `drop-shadow(0 0 8px ${color}44)` }}>
                    {pos ? '+' : ''}{fmt(data.change)}
                  </div>
                  <div style={{ fontSize: 14, color, opacity: 0.75, fontVariantNumeric: 'tabular-nums' }}>
                    {pos ? '▲' : '▼'} {Math.abs(data.changePct).toFixed(2)}%
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 48, flexWrap: 'wrap' }}>
              {[
                { label: 'Day High', val: `$${fmt(data.high)}` },
                { label: 'Day Low', val: `$${fmt(data.low)}` },
                { label: 'Prev Close', val: `$${fmt(data.prev)}` },
                { label: 'Session', val: data.state === 'REGULAR' ? 'Market Open' : data.state === 'PRE' ? 'Pre-Market' : 'After Hours' },
              ].map(m => (
                <div key={m.label}>
                  <div style={{ fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#2A2A2A', marginBottom: 8 }}>{m.label}</div>
                  <div style={{ fontSize: 16, fontWeight: 300, color: '#6A6A6A', fontVariantNumeric: 'tabular-nums' }}>{m.val}</div>
                </div>
              ))}
            </div>

            {data.points.length > 1 && (
              <div style={{ marginLeft: 'auto' }}>
                <div style={{ fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#2A2A2A', marginBottom: 10 }}>Intraday · 5min</div>
                <SparkLine points={data.points} positive={pos} width={280} height={60} />
              </div>
            )}
          </div>
        ) : (
          <div style={{ color: '#333', fontSize: 13, padding: '24px 0' }}>Market data temporarily unavailable — retrying in 30 seconds.</div>
        )}
      </div>
    </section>
  );
}

// ─── Stat Counter Card ─────────────────────────────────────────────────────────
function StatCard({ prefix, value, suffix, label, delay = 0 }: { prefix?: string; value: number; suffix?: string; label: string; delay?: number }) {
  const { display, ref } = useCountUp(value, 1800, prefix ?? '', suffix ?? '');
  return (
    <div ref={ref} style={{
      textAlign: 'center', padding: '32px 24px',
      background: 'linear-gradient(#0D0D0D, #0D0D0D) padding-box, linear-gradient(135deg, rgba(245,158,11,0.15), rgba(163,217,255,0.05), rgba(245,158,11,0.08)) border-box',
      border: '1px solid transparent', borderRadius: 14,
      animationDelay: `${delay}s`,
    }} className="qs-a-in">
      <div style={{
        fontSize: 38, fontWeight: 200, letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums',
        background: 'linear-gradient(135deg, #F59E0B 0%, #FCD34D 60%, #D97706 100%)',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
        marginBottom: 8,
      }}>{display}</div>
      <div style={{ fontSize: 10, color: '#3A3A3A', letterSpacing: '0.18em', textTransform: 'uppercase' }}>{label}</div>
    </div>
  );
}

// ─── Performance Section ──────────────────────────────────────────────────────
const ACCOUNTS = [
  {
    size: '$50,000', key: '50k',
    payoutRange: '$1,250–$1,500',
    early: 1640, mature: 2050,
    monthly: 9225, sixMonth: 55350,
    clientNet: 44280, aegisRev: 11070,
  },
  {
    size: '$100,000', key: '100k',
    payoutRange: '$2,500–$3,000',
    early: 2050, mature: 2460,
    monthly: 11070, sixMonth: 66420,
    clientNet: 53136, aegisRev: 13284,
  },
  {
    size: '$150,000', key: '150k',
    payoutRange: '$3,000–$3,500',
    early: 2460, mature: 2870,
    monthly: 12915, sixMonth: 77490,
    clientNet: 61992, aegisRev: 15498,
  },
] as const;

function PerformanceSection() {
  const [active, setActive] = useState(0);
  const acct = ACCOUNTS[active];
  const fmt = (n: number) => `$${n.toLocaleString('en-US')}`;

  return (
    <section id="qs-performance" style={{
      padding: '130px 48px',
      background: 'linear-gradient(180deg, #070708 0%, #0A0C10 60%, #070708 100%)',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', top: '30%', right: '-10%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,158,11,0.04) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative' }}>
        <div style={{ marginBottom: 60 }}>
          <Badge>QS1 Performance</Badge>
          <h2 style={{
            fontSize: 48, fontWeight: 200, letterSpacing: '-0.03em',
            background: 'linear-gradient(135deg, #FFFFFF 0%, #C8C8C8 50%, #F59E0B 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            marginTop: 20, marginBottom: 16, maxWidth: 540,
          }}>
            Projected Account Performance
          </h2>
          <p style={{ color: '#484848', fontSize: 15, lineHeight: 1.9, maxWidth: 580, fontWeight: 300 }}>
            Illustrative projections based on QS1&apos;s systematic execution framework and Lucid Trading payout parameters.
          </p>
        </div>

        {/* Tab selector */}
        <div style={{ display: 'inline-flex', gap: 0, marginBottom: 48, background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, overflow: 'hidden', padding: 4 }}>
          {ACCOUNTS.map((a, i) => (
            <button key={a.key} onClick={() => setActive(i)} style={{
              background: active === i ? 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(245,158,11,0.06))' : 'transparent',
              border: active === i ? '1px solid rgba(245,158,11,0.2)' : '1px solid transparent',
              color: active === i ? '#F59E0B' : '#3A3A3A',
              padding: '10px 32px', fontSize: 13, fontFamily: 'inherit', cursor: 'pointer',
              borderRadius: 9, letterSpacing: '0.04em', transition: 'all 0.25s',
              boxShadow: active === i ? '0 0 20px rgba(245,158,11,0.1)' : 'none',
            }}>
              {a.size}
            </button>
          ))}
        </div>

        {/* Bento grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gridTemplateRows: 'auto auto', gap: 16 }}>

          {/* Max payout — spans 1 col */}
          <div style={{ padding: '36px', background: 'linear-gradient(135deg, #0D0D0D 0%, #0F1018 100%)', border: '1px solid rgba(245,158,11,0.12)', borderRadius: 16, boxShadow: '0 0 40px rgba(245,158,11,0.04)' }}>
            <div style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#3A3A3A', marginBottom: 20 }}>Max Per Cycle</div>
            <div style={{
              fontSize: 32, fontWeight: 200, letterSpacing: '-0.02em',
              background: 'linear-gradient(135deg, #F59E0B, #FCD34D)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              marginBottom: 8, fontVariantNumeric: 'tabular-nums',
            }}>{acct.payoutRange}</div>
            <div style={{ fontSize: 11, color: '#2E2E2E' }}>per payout cycle allowed</div>
          </div>

          {/* Monthly gross */}
          <div style={{ padding: '36px', background: 'linear-gradient(135deg, #0D0D0D 0%, #0F1018 100%)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16 }}>
            <div style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#3A3A3A', marginBottom: 20 }}>Est. Monthly Gross</div>
            <div style={{ fontSize: 36, fontWeight: 200, color: '#C8C8C8', letterSpacing: '-0.03em', marginBottom: 8, fontVariantNumeric: 'tabular-nums' }}>
              {fmt(acct.monthly)}
            </div>
            <div style={{ fontSize: 11, color: '#2E2E2E' }}>gross per month</div>
          </div>

          {/* 6-month gross */}
          <div style={{ padding: '36px', background: 'linear-gradient(135deg, #0D0D0D 0%, #0F1018 100%)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16 }}>
            <div style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#3A3A3A', marginBottom: 20 }}>Est. 6-Month Gross</div>
            <div style={{ fontSize: 36, fontWeight: 200, color: '#C8C8C8', letterSpacing: '-0.03em', marginBottom: 8, fontVariantNumeric: 'tabular-nums' }}>
              {fmt(acct.sixMonth)}
            </div>
            <div style={{ fontSize: 11, color: '#2E2E2E' }}>cumulative gross</div>
          </div>

          {/* Payout progression */}
          <div style={{ padding: '36px', background: 'linear-gradient(135deg, #0D0D0D 0%, #0F1018 100%)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16 }}>
            <div style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#3A3A3A', marginBottom: 24 }}>Payout Progression</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { label: 'Payouts 1–3 avg', val: acct.early, pct: 60 },
                { label: 'Payouts 4–5 avg', val: acct.mature, pct: 80 },
              ].map(row => (
                <div key={row.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontSize: 11, color: '#444' }}>{row.label}</span>
                    <span style={{ fontSize: 13, color: '#8A8A8A', fontVariantNumeric: 'tabular-nums' }}>{fmt(row.val)}</span>
                  </div>
                  <div style={{ height: 3, background: 'rgba(255,255,255,0.04)', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${row.pct}%`, background: 'linear-gradient(90deg, #F59E0B, #FCD34D)', borderRadius: 2, boxShadow: '0 0 8px rgba(245,158,11,0.4)', transition: 'width 0.8s ease' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue split — spans 2 cols */}
          <div style={{ gridColumn: 'span 2', padding: '36px', background: 'linear-gradient(135deg, #0D0D0D 0%, #0F1018 100%)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16 }}>
            <div style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#3A3A3A', marginBottom: 24 }}>6-Month Revenue Split</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
              <div style={{ padding: '20px', background: 'rgba(245,158,11,0.04)', border: '1px solid rgba(245,158,11,0.1)', borderRadius: 10 }}>
                <div style={{ fontSize: 9, color: '#4A3A00', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 10 }}>Client Net (80%)</div>
                <div style={{ fontSize: 28, fontWeight: 200, color: '#F59E0B', letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>{fmt(acct.clientNet)}</div>
              </div>
              <div style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 10 }}>
                <div style={{ fontSize: 9, color: '#3A3A3A', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 10 }}>QS1 Fee (20%)</div>
                <div style={{ fontSize: 28, fontWeight: 200, color: '#5A5A5A', letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>{fmt(acct.aegisRev)}</div>
              </div>
            </div>
            <div style={{ height: 8, background: 'rgba(255,255,255,0.03)', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: '80%', background: 'linear-gradient(90deg, #F59E0B66, #F59E0B33)', borderRadius: 4, position: 'relative' }}>
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, transparent 60%, #F59E0B22)', borderRadius: 4 }} />
              </div>
            </div>
          </div>

        </div>

        <div style={{ marginTop: 20, padding: '14px 20px', border: '1px solid rgba(200,100,50,0.07)', borderRadius: 8, background: 'rgba(200,100,50,0.018)' }}>
          <p style={{ color: '#3A2A22', fontSize: 11, lineHeight: 1.8 }}>
            Figures are illustrative projections only. All futures trading involves substantial risk of loss. Past results do not guarantee future performance.
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── Circular Progress ────────────────────────────────────────────────────────
function CircularProgress({ pct, size = 140 }: { pct: number; size?: number }) {
  const r = size / 2 - 12; const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  const id = `cpg-${size}`;
  return (
    <svg width={size} height={size} style={{ display: 'block' }}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F59E0B" /><stop offset="100%" stopColor="#FCD34D" />
        </linearGradient>
      </defs>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="10" />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={`url(#${id})`} strokeWidth="10"
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.34,1.56,0.64,1)', filter: 'drop-shadow(0 0 6px rgba(245,158,11,0.5))' }} />
      <text x={size / 2} y={size / 2 - 6} textAnchor="middle" fill="#E0E0E0" fontSize="20" fontWeight="200" fontFamily="Inter,sans-serif">{Math.round(pct)}%</text>
      <text x={size / 2} y={size / 2 + 14} textAnchor="middle" fill="#3A3A3A" fontSize="8" fontFamily="Inter,sans-serif" letterSpacing="2">PROGRESS</text>
    </svg>
  );
}

// ─── Account Dashboard ─────────────────────────────────────────────────────────
function AccountDashboard() {
  const [acctIdx, setAcctIdx] = useState(0);
  const [payoutNum, setPayoutNum] = useState(3);
  const acct = ACCOUNTS[acctIdx];
  const payoutAvg = payoutNum <= 3 ? acct.early : acct.mature;
  const acctVal = parseInt(acct.size.replace(/[$,]/g, ''));
  const progress = Math.min((payoutAvg / (acctVal * 0.025)) * 70 + 15, 94);
  const fmtCur = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 });

  const recentPayouts = [
    { cycle: `Cycle ${Math.max(1, payoutNum - 2)}`, date: '2026-02-12', amount: fmtCur(acct.early), status: 'Processed' },
    { cycle: `Cycle ${Math.max(1, payoutNum - 1)}`, date: '2026-03-28', amount: fmtCur(acct.early), status: 'Processed' },
    { cycle: `Cycle ${payoutNum}`, date: 'Pending', amount: fmtCur(payoutAvg), status: 'In Progress' },
  ];

  const systemStatus = [
    { label: 'QS1 Engine', val: 'v3.2 · Active', ok: true },
    { label: 'Risk System', val: 'Engaged', ok: true },
    { label: 'Tradovate Feed', val: 'Connected', ok: true },
    { label: 'Lucid Platform', val: 'Linked', ok: true },
  ];

  return (
    <section id="qs-dashboard" style={{ padding: '130px 48px', background: '#070708', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', bottom: '10%', left: '-5%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(163,217,255,0.025) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative' }}>
        <div style={{ marginBottom: 52 }}>
          <Badge>Member Portal</Badge>
          <h2 style={{
            fontSize: 48, fontWeight: 200, letterSpacing: '-0.03em',
            background: 'linear-gradient(135deg, #FFFFFF 0%, #C8C8C8 50%, #A3D9FF 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            marginTop: 20, marginBottom: 12,
          }}>
            Account Progress Tracker
          </h2>
          <p style={{ color: '#3A3A3A', fontSize: 13, maxWidth: 480, lineHeight: 1.8 }}>
            Illustrative dashboard representing projected QS1-managed account behavior on the Lucid Trading platform.
          </p>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', gap: 24, marginBottom: 28, flexWrap: 'wrap', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#2A2A2A', marginBottom: 8 }}>Account Size</div>
            <div style={{ display: 'inline-flex', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 10, overflow: 'hidden', padding: 3 }}>
              {ACCOUNTS.map((a, i) => (
                <button key={a.key} onClick={() => setAcctIdx(i)} style={{
                  background: acctIdx === i ? 'rgba(245,158,11,0.1)' : 'transparent',
                  border: acctIdx === i ? '1px solid rgba(245,158,11,0.18)' : '1px solid transparent',
                  color: acctIdx === i ? '#F59E0B' : '#3A3A3A', padding: '7px 20px', fontSize: 12,
                  fontFamily: 'inherit', cursor: 'pointer', borderRadius: 7, transition: 'all 0.2s',
                }}>
                  {a.size}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#2A2A2A', marginBottom: 8 }}>Payout Cycle</div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <button onClick={() => setPayoutNum(p => Math.max(1, p - 1))} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', color: '#555', borderRadius: 8, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontFamily: 'inherit', fontSize: 16, transition: 'all 0.15s' }}>−</button>
              <span style={{ color: '#8A8A8A', fontSize: 14, minWidth: 70, textAlign: 'center', fontVariantNumeric: 'tabular-nums' }}>Cycle {payoutNum}</span>
              <button onClick={() => setPayoutNum(p => Math.min(10, p + 1))} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', color: '#555', borderRadius: 8, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontFamily: 'inherit', fontSize: 16, transition: 'all 0.15s' }}>+</button>
            </div>
          </div>
        </div>

        {/* Dashboard grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 16 }}>
          {/* Status panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ padding: '28px', background: 'linear-gradient(135deg, #0D0D0D, #0F1018)', border: '1px solid rgba(245,158,11,0.1)', borderRadius: 14, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, boxShadow: '0 0 40px rgba(245,158,11,0.04)' }}>
              <CircularProgress pct={progress} size={148} />
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 200, color: '#C0C0C0', letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>{fmtCur(payoutAvg)}</div>
                <div style={{ fontSize: 10, color: '#2E2E2E', letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: 4 }}>Projected · Cycle {payoutNum}</div>
              </div>
            </div>

            <div style={{ padding: '24px', background: '#0D0D0D', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14 }}>
              <div style={{ fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#2A2A2A', marginBottom: 16 }}>System Status</div>
              {systemStatus.map(s => (
                <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: '1px solid rgba(255,255,255,0.025)' }}>
                  <span style={{ fontSize: 11, color: '#333' }}>{s.label}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, color: '#34D399' }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#34D399', boxShadow: '0 0 6px #34D399', display: 'inline-block', animation: 'qs-pulse 2.5s ease-in-out infinite' }} />
                    {s.val}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              {[
                { label: 'Monthly Gross', val: `$${acct.monthly.toLocaleString()}`, sub: 'est. per month' },
                { label: '6-Month Gross', val: `$${acct.sixMonth.toLocaleString()}`, sub: 'cumulative est.' },
                { label: 'Client Net 6M', val: `$${acct.clientNet.toLocaleString()}`, sub: 'after 20% fee' },
              ].map(m => (
                <div key={m.label} style={{ border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '20px', background: '#0D0D0D' }}>
                  <div style={{ fontSize: 9, color: '#2A2A2A', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 10 }}>{m.label}</div>
                  <div style={{ fontSize: 20, fontWeight: 200, color: '#A8A8A8', letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums', marginBottom: 4 }}>{m.val}</div>
                  <div style={{ fontSize: 10, color: '#252525' }}>{m.sub}</div>
                </div>
              ))}
            </div>

            <div style={{ border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, overflow: 'hidden', background: '#0D0D0D', flex: 1 }}>
              <div style={{ padding: '18px 24px', borderBottom: '1px solid rgba(255,255,255,0.04)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 11, color: '#444', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Payout History</span>
                <span style={{ fontSize: 9, color: '#1E1E1E', letterSpacing: '0.12em', textTransform: 'uppercase' }}>via Lucid Dashboard</span>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    {['Cycle', 'Date', 'Amount', 'Status'].map(h => (
                      <th key={h} style={{ padding: '11px 24px', textAlign: 'left', color: '#252525', fontWeight: 500, fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentPayouts.map((r, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.025)' }}>
                      <td style={{ padding: '14px 24px', color: '#7A7A7A' }}>{r.cycle}</td>
                      <td style={{ padding: '14px 24px', color: '#484848', fontVariantNumeric: 'tabular-nums' }}>{r.date}</td>
                      <td style={{ padding: '14px 24px', color: '#9A9A9A', fontVariantNumeric: 'tabular-nums' }}>{r.amount}</td>
                      <td style={{ padding: '14px 24px' }}>
                        <span style={{
                          fontSize: 9, letterSpacing: '0.1em', padding: '4px 12px', borderRadius: 100,
                          background: r.status === 'Processed' ? 'rgba(52,211,153,0.08)' : 'rgba(245,158,11,0.08)',
                          color: r.status === 'Processed' ? '#34D399' : '#F59E0B',
                          border: `1px solid ${r.status === 'Processed' ? 'rgba(52,211,153,0.18)' : 'rgba(245,158,11,0.18)'}`,
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
    { n: '01', title: 'Initial Enrollment', body: 'Select your account size ($50K, $100K, or $150K) and submit the one-time program fee to initiate onboarding.' },
    { n: '02', title: 'Create Lucid Account', body: 'Register with Lucid Trading — the proprietary capital program platform used to house the funded account and manage payouts.' },
    { n: '03', title: 'Obtain Tradovate Credentials', body: 'Receive your Tradovate execution credentials through Lucid. These are the trading credentials only — separate from your Lucid dashboard login.' },
    { n: '04', title: 'Secure Integration', body: 'Provide credentials to the QS1 team via encrypted intake. Infrastructure is configured and connected to your account.' },
    { n: '05', title: 'Algorithm Deployment', body: 'QS1 v3.2 deploys directly onto your account. Risk systems activate. Trade detection, management, and execution become fully autonomous.' },
    { n: '06', title: 'Automated Trading Begins', body: 'QS1 scans continuously for optimal Gold setups. Trades only when conditions are favorable. No manual experience required.' },
  ];

  return (
    <section id="qs-process" style={{ padding: '130px 48px', background: 'linear-gradient(180deg, #070708 0%, #0A0C10 100%)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 800, height: 800, borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,158,11,0.025) 0%, transparent 65%)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative' }}>
        <div style={{ marginBottom: 68 }}>
          <Badge>How It Works</Badge>
          <h2 style={{
            fontSize: 48, fontWeight: 200, letterSpacing: '-0.03em', marginTop: 20, maxWidth: 480,
            background: 'linear-gradient(135deg, #FFFFFF 0%, #C8C8C8 60%, #F59E0B 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
            Six Steps to Automated Execution
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: 'rgba(245,158,11,0.04)', border: '1px solid rgba(245,158,11,0.04)', borderRadius: 20, overflow: 'hidden', marginBottom: 48 }}>
          {steps.map((step, i) => (
            <div key={step.n} style={{ padding: '40px 32px', background: '#0A0A0B', borderRight: '1px solid rgba(245,158,11,0.04)', borderBottom: '1px solid rgba(245,158,11,0.04)', position: 'relative', transition: 'background 0.25s' }} className="qs-step-card">
              <div style={{
                position: 'absolute', top: 20, right: 24,
                fontSize: 11, letterSpacing: '0.1em',
                background: 'linear-gradient(135deg, #F59E0B44, #F59E0B22)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>{step.n}</div>
              <div style={{
                width: 40, height: 40, borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(245,158,11,0.12), rgba(245,158,11,0.04))',
                border: '1px solid rgba(245,158,11,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 22,
                boxShadow: '0 0 20px rgba(245,158,11,0.06)',
              }}>
                <span style={{ color: '#F59E0B', fontSize: 14, fontWeight: 300 }}>{i + 1}</span>
              </div>
              <h3 style={{ fontSize: 14, fontWeight: 400, color: '#C0C0C0', marginBottom: 12, lineHeight: 1.4 }}>
                Step {i + 1} — {step.title}
              </h3>
              <p style={{ color: '#3A3A3A', fontSize: 13, lineHeight: 1.85 }}>{step.body}</p>
            </div>
          ))}
        </div>

        {/* Payout procedure */}
        <div style={{ background: 'linear-gradient(135deg, #0D0D0D, #0F1018)', border: '1px solid rgba(245,158,11,0.1)', borderRadius: 18, padding: '44px', marginBottom: 44, boxShadow: '0 0 60px rgba(245,158,11,0.04)' }}>
          <Badge>Payout Procedure</Badge>
          <h3 style={{ fontSize: 26, fontWeight: 200, color: '#C8C8C8', marginTop: 18, marginBottom: 32, letterSpacing: '-0.02em' }}>Requesting Your Payout</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {[
              { n: '1', title: 'Log In', body: 'Access your Lucid Trading dashboard using your registered credentials.' },
              { n: '2', title: 'Complete KYC', body: 'Complete the identity verification (Know Your Customer) process required by Lucid.' },
              { n: '3', title: 'Add Banking', body: 'Input your banking details for direct deposit payout processing.' },
              { n: '4', title: 'Request Payout', body: 'Submit directly through Lucid. Payouts are often processed extremely quickly per Lucid documentation.' },
            ].map(step => (
              <div key={step.n} style={{ padding: '22px', background: 'rgba(255,255,255,0.02)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.04)' }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                  <span style={{ fontSize: 11, color: '#F59E0B' }}>{step.n}</span>
                </div>
                <div style={{ fontSize: 13, color: '#8A8A8A', marginBottom: 8, fontWeight: 400 }}>{step.title}</div>
                <p style={{ fontSize: 12, color: '#3A3A3A', lineHeight: 1.8 }}>{step.body}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <button onClick={onOpen} className="qs-btn-gold">Begin Enrollment →</button>
        </div>
      </div>
    </section>
  );
}

// ─── Why QS1 ──────────────────────────────────────────────────────────────
function WhyQS1() {
  const reasons = [
    { icon: '◷', title: 'Time Efficiency', body: 'No charts, no technical analysis, no market psychology. QS1 handles all execution autonomously while you focus elsewhere.' },
    { icon: '◈', title: 'Institutional Infrastructure', body: 'Built around quantitative execution engines, multi-layer risk controls, and institutional-grade automated safety systems.' },
    { icon: '⊞', title: 'Scalability', body: 'Multiple funded accounts can be operated simultaneously, compounding systematic exposure across all three account tiers.' },
    { icon: '◎', title: 'Passive Exposure', body: 'Fully hands-free automated execution. Your account operates every session the markets are open — without you watching.' },
    { icon: '∿', title: 'Consistency Focused', body: 'Prioritizes sustainable, repeatable payouts over aggressive strategies that risk violating funded account rules.' },
    { icon: '⬡', title: 'Professional Management', body: 'Managed directly by quantitative developers and systematic trading operators with years of institutional-grade experience.' },
  ];

  return (
    <section id="qs-why" style={{ padding: '130px 48px', background: '#070708', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '20%', right: '5%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,158,11,0.04) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative' }}>
        <div style={{ marginBottom: 68 }}>
          <Badge>Value Proposition</Badge>
          <h2 style={{
            fontSize: 48, fontWeight: 200, letterSpacing: '-0.03em', marginTop: 20, maxWidth: 600,
            background: 'linear-gradient(135deg, #FFFFFF 0%, #C8C8C8 50%, #F59E0B 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
            Why High-Net-Worth Clients Choose QS1
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 48 }}>
          {reasons.map((r, i) => (
            <div key={r.title} className="qs-card-gold" style={{ border: '1px solid rgba(255,255,255,0.055)', borderRadius: 14, padding: '32px', background: 'linear-gradient(135deg, #0D0D0D, #0F0F12)', cursor: 'default', transition: 'all 0.3s' }}>
              <div style={{ fontSize: 24, marginBottom: 18, color: '#F59E0B', opacity: 0.6, filter: 'drop-shadow(0 0 8px rgba(245,158,11,0.3))' }}>{r.icon}</div>
              <h3 style={{ fontSize: 15, fontWeight: 400, color: '#C0C0C0', marginBottom: 12 }}>{r.title}</h3>
              <p style={{ color: '#3A3A3A', fontSize: 13, lineHeight: 1.85 }}>{r.body}</p>
              <div style={{ marginTop: 20, height: 1, background: `linear-gradient(90deg, rgba(245,158,11,${0.06 + i * 0.02}), transparent)` }} />
            </div>
          ))}
        </div>

        <div style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.04) 0%, rgba(163,217,255,0.02) 50%, rgba(245,158,11,0.02) 100%)', border: '1px solid rgba(245,158,11,0.1)', borderRadius: 18, padding: '48px', textAlign: 'center', boxShadow: '0 0 60px rgba(245,158,11,0.04)' }}>
          <p style={{ color: '#4A4A4A', fontSize: 16, lineHeight: 2, maxWidth: 800, margin: '0 auto', fontWeight: 300 }}>
            QS1 was engineered for individuals seeking sophisticated algorithmic market exposure without becoming full-time traders. Combining <span style={{ color: '#6A6A6A' }}>artificial intelligence</span>, <span style={{ color: '#6A6A6A' }}>quantitative research</span>, <span style={{ color: '#6A6A6A' }}>tick-data analysis</span>, <span style={{ color: '#6A6A6A' }}>institutional risk frameworks</span>, and <span style={{ color: '#6A6A6A' }}>automated execution systems</span> — delivering a structured, scalable, hands-free approach to modern futures trading.
          </p>
          <div style={{ marginTop: 24, display: 'flex', justifyContent: 'center', gap: 40, flexWrap: 'wrap' }}>
            {['Private', 'Capacity-Limited', 'Selectively Offered'].map(t => (
              <span key={t} style={{ fontSize: 9, color: '#2A2A2A', letterSpacing: '0.22em', textTransform: 'uppercase' }}>{t}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────
function Modal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [done, setDone] = useState(false);
  const [f, setF] = useState({ name: '', email: '', phone: '', size: '', note: '', ack: false });
  if (!open) return null;
  const submit = (e: React.FormEvent) => { e.preventDefault(); setDone(true); };
  const inp: React.CSSProperties = { width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, color: '#E0E0E0', fontSize: 14, padding: '12px 16px', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', transition: 'border-color 0.2s' };
  const lbl: React.CSSProperties = { display: 'block', color: '#444', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 7 };
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(20px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: 'linear-gradient(#0E0E10, #0E0E10) padding-box, linear-gradient(135deg, rgba(245,158,11,0.2), rgba(163,217,255,0.06), rgba(245,158,11,0.1)) border-box', border: '1px solid transparent', borderRadius: 20, padding: '48px', maxWidth: 500, width: '100%', position: 'relative', maxHeight: '92vh', overflowY: 'auto', boxShadow: '0 40px 120px rgba(0,0,0,0.8), 0 0 60px rgba(245,158,11,0.06)' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 20, right: 20, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: '#555', cursor: 'pointer', fontSize: 18, width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'inherit', transition: 'all 0.15s' }}>×</button>
        {done ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <span style={{ color: '#F59E0B', fontSize: 22 }}>✓</span>
            </div>
            <h3 style={{ color: '#E8E8E8', fontSize: 22, fontWeight: 200, letterSpacing: '-0.02em', marginBottom: 14 }}>Request Received</h3>
            <p style={{ color: '#444', fontSize: 13, lineHeight: 1.9 }}>Qualified inquiries are reviewed in the order received. We will be in touch if your profile aligns with current program parameters.</p>
          </div>
        ) : (
          <>
            <Badge>Private Program</Badge>
            <h3 style={{ color: '#E8E8E8', fontSize: 24, fontWeight: 200, letterSpacing: '-0.02em', marginTop: 18, marginBottom: 6 }}>Request Consideration</h3>
            <p style={{ color: '#333', fontSize: 13, marginBottom: 32, lineHeight: 1.7 }}>Quantara System One — QS1 Institutional Gold Algorithmic Program</p>
            <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div><label style={lbl}>Full Name *</label><input required value={f.name} onChange={e => setF(p => ({ ...p, name: e.target.value }))} style={inp} placeholder="Your full name" /></div>
              <div><label style={lbl}>Email Address *</label><input required type="email" value={f.email} onChange={e => setF(p => ({ ...p, email: e.target.value }))} style={inp} placeholder="your@email.com" /></div>
              <div><label style={lbl}>Phone <span style={{ color: '#2A2A2A' }}>Optional</span></label><input value={f.phone} onChange={e => setF(p => ({ ...p, phone: e.target.value }))} style={inp} placeholder="+1 (000) 000-0000" /></div>
              <div>
                <label style={lbl}>Account Size Interest *</label>
                <select required value={f.size} onChange={e => setF(p => ({ ...p, size: e.target.value }))} style={{ ...inp, appearance: 'none' as const, WebkitAppearance: 'none' as const }}>
                  <option value="">Select account size...</option>
                  <option value="50k">$50,000</option><option value="100k">$100,000</option>
                  <option value="150k">$150,000</option><option value="other">Other</option>
                </select>
              </div>
              <div><label style={lbl}>Why are you exploring systematic approaches?</label><textarea value={f.note} onChange={e => setF(p => ({ ...p, note: e.target.value }))} style={{ ...inp, height: 88, resize: 'none' as const }} placeholder="Brief note..." /></div>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <input required type="checkbox" id="qs-ack" checked={f.ack} onChange={e => setF(p => ({ ...p, ack: e.target.checked }))} style={{ marginTop: 3, flexShrink: 0, accentColor: '#F59E0B', cursor: 'pointer' }} />
                <label htmlFor="qs-ack" style={{ color: '#3A3A3A', fontSize: 12, lineHeight: 1.75, cursor: 'pointer' }}>I acknowledge this is a private program for qualified participants only and understand all trading involves substantial risk of loss.</label>
              </div>
              <button type="submit" className="qs-btn-gold" style={{ width: '100%', marginTop: 4, justifyContent: 'center' }}>Submit Request</button>
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
    } catch { /* keep previous data */ }
    finally { setGoldLoading(false); }
  }, []);

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400;500;600&display=swap';
    link.rel = 'stylesheet'; document.head.appendChild(link);
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); document.head.removeChild(link); };
  }, []);

  useEffect(() => {
    fetchGold();
    const iv = setInterval(fetchGold, 30000);
    return () => clearInterval(iv);
  }, [fetchGold]);

  const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  const openModal = () => setModal(true);

  const navLinks: [string, string][] = [
    ['Markets', 'qs-markets'], ['Performance', 'qs-performance'],
    ['Process', 'qs-process'], ['Dashboard', 'qs-dashboard'],
    ['Systems', 'qs-systems'], ['Access', 'qs-access'],
  ];

  const pos = goldData ? goldData.change >= 0 : true;

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .qs-wrap {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          background: #070708; color: #F0F0F0; min-height: 100vh; width: 100%;
          -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;
        }
        .qs-wrap * { font-family: inherit; }

        /* ── Ticker ── */
        @keyframes qs-ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }

        /* ── Pulse ── */
        @keyframes qs-pulse { 0%,100% { opacity: 0.3; } 50% { opacity: 1; } }
        .qs-dot { animation: qs-pulse 2.8s ease-in-out infinite; }

        /* ── Float orbs ── */
        @keyframes qs-float-a { 0%,100% { transform: translateY(0) scale(1); } 50% { transform: translateY(-30px) scale(1.04); } }
        @keyframes qs-float-b { 0%,100% { transform: translateY(0) scale(1); } 50% { transform: translateY(25px) scale(0.97); } }
        .qs-orb-a { animation: qs-float-a 10s ease-in-out infinite; }
        .qs-orb-b { animation: qs-float-b 14s ease-in-out infinite; }

        /* ── Reveal ── */
        @keyframes qs-up { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: none; } }
        .qs-a0 { animation: qs-up 1s ease both; }
        .qs-a1 { animation: qs-up 1s ease 0.18s both; }
        .qs-a2 { animation: qs-up 1s ease 0.34s both; }
        .qs-a3 { animation: qs-up 1s ease 0.50s both; }
        .qs-a4 { animation: qs-up 1s ease 0.66s both; }

        /* ── Nav links ── */
        .qs-nav-link { background: none; border: none; color: #383838; font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; cursor: pointer; transition: color 0.2s; padding: 4px 0; }
        .qs-nav-link:hover { color: #9A9A9A; }

        /* ── Gold button ── */
        .qs-btn-gold {
          display: inline-flex; align-items: center; gap: 8px;
          background: linear-gradient(135deg, #F59E0B, #D97706);
          border: none; color: #000; border-radius: 10px;
          padding: 14px 32px; font-size: 11px; letter-spacing: 0.18em;
          text-transform: uppercase; cursor: pointer; font-family: inherit;
          font-weight: 500; transition: all 0.25s;
          box-shadow: 0 4px 24px rgba(245,158,11,0.3), 0 0 0 0 rgba(245,158,11,0.3);
        }
        .qs-btn-gold:hover { transform: translateY(-2px); box-shadow: 0 8px 40px rgba(245,158,11,0.45), 0 0 0 4px rgba(245,158,11,0.08); }
        .qs-btn-gold:active { transform: translateY(0); }

        /* ── Outline button ── */
        .qs-btn-outline {
          display: inline-flex; align-items: center; gap: 8px;
          background: transparent; border: 1px solid rgba(255,255,255,0.1);
          color: #5A5A5A; border-radius: 10px; padding: 14px 32px;
          font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase;
          cursor: pointer; font-family: inherit; transition: all 0.25s;
        }
        .qs-btn-outline:hover { border-color: rgba(245,158,11,0.3); color: #F59E0B; background: rgba(245,158,11,0.04); }

        /* ── Cards ── */
        .qs-card-gold:hover { border-color: rgba(245,158,11,0.15) !important; background: linear-gradient(135deg, #0F0F12, #111215) !important; box-shadow: 0 0 40px rgba(245,158,11,0.05); }
        .qs-step-card:hover { background: #0D0D0E !important; }

        /* ── Shimmer on price ── */
        @keyframes qs-shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }

        @media (max-width: 1024px) {
          .qs-nav-links { display: none !important; }
          .qs-hero-h1 { font-size: 38px !important; }
          .qs-grid-2 { grid-template-columns: 1fr !important; gap: 20px !important; }
          .qs-grid-3 { grid-template-columns: 1fr !important; }
          .qs-bento-3 { grid-template-columns: 1fr 1fr !important; }
          .qs-section { padding: 80px 24px !important; }
          .qs-hero-inner { padding: 0 20px !important; }
          .qs-footer-inner { grid-template-columns: 1fr !important; }
          .qs-dashboard-grid { grid-template-columns: 1fr !important; }
          .qs-payout-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 640px) {
          .qs-bento-3 { grid-template-columns: 1fr !important; }
          .qs-ticker-price { font-size: 32px !important; }
          .qs-stat-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>

      <div className="qs-wrap">

        {/* ── TICKER TAPE ── */}
        <TickerTape data={goldData} />

        {/* ── NAVIGATION ── */}
        <nav style={{
          position: 'fixed', top: 34, left: 0, right: 0, zIndex: 200, height: 60,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 48px',
          background: scrolled ? 'rgba(7,7,8,0.92)' : 'transparent',
          backdropFilter: scrolled ? 'blur(24px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(245,158,11,0.07)' : 'none',
          transition: 'all 0.35s',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => go('qs-hero')}>
            <QMark size={32} glow />
            <div>
              <div style={{ fontSize: 13, fontWeight: 300, letterSpacing: '0.28em', textTransform: 'uppercase', color: '#D0D0D0', lineHeight: 1.2 }}>Quantara</div>
              <div style={{ fontSize: 8, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#2E2E2E', marginTop: 1 }}>Systems</div>
            </div>
          </div>

          <div className="qs-nav-links" style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
            {navLinks.map(([label, id]) => (
              <button key={id} className="qs-nav-link" onClick={() => go(id)}>{label}</button>
            ))}
            <button className="qs-btn-gold" onClick={openModal} style={{ padding: '9px 20px', fontSize: 10, borderRadius: 8, marginLeft: 8 }}>
              Request Access
            </button>
          </div>
        </nav>

        {/* ── HERO ── */}
        <section id="qs-hero" style={{ position: 'relative', height: '100vh', minHeight: 760, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <NetworkCanvas />

          {/* Floating orbs */}
          <div className="qs-orb-a" style={{ position: 'absolute', top: '15%', left: '8%', width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,158,11,0.055) 0%, transparent 65%)', filter: 'blur(40px)', pointerEvents: 'none', zIndex: 0 }} />
          <div className="qs-orb-b" style={{ position: 'absolute', top: '35%', right: '2%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(163,217,255,0.04) 0%, transparent 65%)', filter: 'blur(60px)', pointerEvents: 'none', zIndex: 0 }} />
          <div style={{ position: 'absolute', bottom: '10%', left: '30%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,158,11,0.03) 0%, transparent 65%)', filter: 'blur(50px)', pointerEvents: 'none', zIndex: 0 }} />

          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 200, background: 'linear-gradient(to bottom, #070708, transparent)', pointerEvents: 'none', zIndex: 1 }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 240, background: 'linear-gradient(to top, #070708, transparent)', pointerEvents: 'none', zIndex: 1 }} />

          <div className="qs-hero-inner" style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '0 28px', maxWidth: 1000 }}>
            <div className="qs-a0" style={{ display: 'flex', justifyContent: 'center', marginBottom: 40 }}>
              <QMark size={112} glow />
            </div>

            <div className="qs-a1" style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
              <Badge>Quantitative Market Systems · Powered by QS1</Badge>
            </div>

            <h1 className="qs-a2 qs-hero-h1" style={{
              fontSize: 64, fontWeight: 200, letterSpacing: '-0.04em', lineHeight: 1.04, marginBottom: 12,
              background: 'linear-gradient(135deg, #FFFFFF 0%, #E0E0E0 35%, #F59E0B 70%, #FCD34D 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              Quantara System One
            </h1>

            <div className="qs-a2" style={{ fontSize: 12, letterSpacing: '0.26em', textTransform: 'uppercase', color: '#333', marginBottom: 28, fontWeight: 300 }}>
              QS1 &nbsp;·&nbsp; Institutional Gold Algorithmic Program
            </div>

            <p className="qs-a3" style={{ color: '#444', fontSize: 16, lineHeight: 1.9, maxWidth: 660, margin: '0 auto 48px', fontWeight: 300 }}>
              A proprietary quantitative framework powered by QS1 — algorithmic execution in Gold futures markets. Machine learning models, statistical frameworks, and institutional risk architecture.
            </p>

            <div className="qs-a4" style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 64 }}>
              <button className="qs-btn-gold" onClick={openModal}>Request Consideration</button>
              <button className="qs-btn-outline" onClick={() => go('qs-markets')}>View Live Markets</button>
            </div>

            {/* Hero stat bar */}
            <div className="qs-a4 qs-stat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, maxWidth: 800, margin: '0 auto', background: 'rgba(245,158,11,0.04)', border: '1px solid rgba(245,158,11,0.08)', borderRadius: 14, overflow: 'hidden' }}>
              {[
                { val: goldData && !goldData.error ? `$${goldData.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '---', label: 'GC Futures Live' },
                { val: '$77,490', label: '6-Month Gross Peak' },
                { val: '80%', label: 'Client Payout Share' },
                { val: '100%', label: 'Automated Execution' },
              ].map((s, i) => (
                <div key={i} style={{ padding: '18px 16px', textAlign: 'center', borderRight: i < 3 ? '1px solid rgba(245,158,11,0.06)' : 'none' }}>
                  <div style={{ fontSize: 18, fontWeight: 200, color: i === 0 ? (pos ? '#F59E0B' : '#F87171') : '#9A9A9A', letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums', marginBottom: 4 }}>{s.val}</div>
                  <div style={{ fontSize: 9, color: '#282828', letterSpacing: '0.16em', textTransform: 'uppercase' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 1, height: 48, background: 'linear-gradient(to bottom, transparent, rgba(245,158,11,0.3))' }} />
            <div className="qs-dot" style={{ width: 4, height: 4, borderRadius: '50%', background: '#F59E0B', boxShadow: '0 0 8px #F59E0B' }} />
          </div>
        </section>

        {/* ── LIVE MARKET DATA ── */}
        <GoldTickerBar data={goldData} loading={goldLoading} />

        {/* ── ANIMATED STATS ── */}
        <section style={{ padding: '80px 48px', background: '#070708', borderBottom: '1px solid rgba(245,158,11,0.04)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div className="qs-stat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
              <StatCard prefix="$" value={77490} label="Peak 6-Month Gross" delay={0} />
              <StatCard prefix="$" value={61992} label="Max Client Net 6M" delay={0.1} />
              <StatCard value={80} suffix="%" label="Client Payout Share" delay={0.2} />
              <StatCard value={100} suffix="%" label="Automated Execution" delay={0.3} />
            </div>
          </div>
        </section>

        {/* ── THE SYSTEM ── */}
        <section id="qs-systems" style={{ padding: '130px 48px', background: 'linear-gradient(180deg, #070708 0%, #0A0C10 100%)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ marginBottom: 68 }}>
              <Badge>The System</Badge>
              <h2 style={{
                fontSize: 48, fontWeight: 200, letterSpacing: '-0.03em', marginTop: 20, marginBottom: 18, maxWidth: 560,
                background: 'linear-gradient(135deg, #FFFFFF 0%, #C8C8C8 60%, #F59E0B 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>
                Structured Quantitative Execution
              </h2>
              <p style={{ color: '#3A3A3A', fontSize: 16, lineHeight: 1.92, maxWidth: 640, fontWeight: 300 }}>
                QS1 is an institutional-grade algorithmic infrastructure powered by QS1, focused on Gold futures (GC/MGC). Multi-year quantitative research, machine learning models, and non-discretionary execution.
              </p>
            </div>

            <div className="qs-grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: 'rgba(245,158,11,0.03)', border: '1px solid rgba(245,158,11,0.04)', borderRadius: 20, overflow: 'hidden', marginBottom: 48 }}>
              {[
                { n: '01', title: 'Market Microstructure Evaluation', body: 'Session-aware analysis of order flow dynamics, liquidity zones, and structural inflection points in Gold futures markets.' },
                { n: '02', title: 'Statistical Pattern Recognition', body: 'Neural architectures trained on tick-level historical data to identify environments with statistically observable characteristics.' },
                { n: '03', title: 'Volatility Regime Filtering', body: 'Multi-regime detection that adapts execution parameters based on prevailing volatility and correlation states.' },
                { n: '04', title: 'Dynamic Risk Architecture', body: 'Proprietary risk allocation with adaptive position sizing, drawdown controls, and funded account rule compliance.' },
                { n: '05', title: 'Automated Execution Engine', body: 'Fully automated trade identification, entry, and management. Zero manual intervention required at any stage.' },
                { n: '06', title: 'Platform Integration', body: 'Native connectivity to Tradovate, TradingView, and Lucid Trading proprietary capital program infrastructure.' },
              ].map(item => (
                <div key={item.n} className="qs-step-card" style={{ padding: '36px 32px', background: '#0A0A0B', borderRight: '1px solid rgba(245,158,11,0.04)', borderBottom: '1px solid rgba(245,158,11,0.04)', transition: 'background 0.2s' }}>
                  <div style={{ fontSize: 10, color: '#1E1E1E', letterSpacing: '0.1em', marginBottom: 18 }}>{item.n}</div>
                  <h3 style={{ fontSize: 14, fontWeight: 400, color: '#B0B0B0', marginBottom: 12, lineHeight: 1.4 }}>{item.title}</h3>
                  <p style={{ color: '#3A3A3A', fontSize: 13, lineHeight: 1.85 }}>{item.body}</p>
                </div>
              ))}
            </div>

            <div style={{ border: '1px solid rgba(245,158,11,0.05)', borderRadius: 10, padding: '18px 24px', background: 'rgba(245,158,11,0.015)' }}>
              <p style={{ color: '#2E2E2E', fontSize: 12, lineHeight: 1.85 }}>
                <span style={{ color: '#3A3A3A', fontWeight: 500 }}>Risk Disclosure —</span> All trading involves substantial risk of loss. Past performance does not indicate future results. QS1 does not predict markets or guarantee specific outcomes. Participation is restricted to qualified individuals only.
              </p>
            </div>
          </div>
        </section>

        {/* ── PERFORMANCE ── */}
        <PerformanceSection />

        {/* ── HOW IT WORKS ── */}
        <HowItWorks onOpen={openModal} />

        {/* ── ACCOUNT DASHBOARD ── */}
        <AccountDashboard />

        {/* ── WHY QS1 ── */}
        <WhyQS1 />

        {/* ── APPROACH ── */}
        <section id="qs-approach" style={{ padding: '130px 48px', background: 'linear-gradient(180deg, #070708 0%, #0A0C10 60%, #070708 100%)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ marginBottom: 68 }}>
              <Badge>Development</Badge>
              <h2 style={{
                fontSize: 48, fontWeight: 200, letterSpacing: '-0.03em', marginTop: 20, maxWidth: 480,
                background: 'linear-gradient(135deg, #FFFFFF, #C8C8C8 60%, #F59E0B 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>Research-Driven Development</h2>
            </div>
            <div className="qs-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 88, alignItems: 'start' }}>
              <div>
                <p style={{ color: '#3A3A3A', fontSize: 15, lineHeight: 1.95, marginBottom: 28, fontWeight: 300 }}>
                  QS1 originated as a quantitative research initiative examining whether structured AI frameworks could provide consistent execution in Gold futures while prioritizing capital preservation and statistical discipline.
                </p>
                <p style={{ color: '#2E2E2E', fontSize: 14, lineHeight: 1.95, fontWeight: 300 }}>
                  The system does not predict markets. It identifies environments with historically observable statistical characteristics and applies predefined execution rules without discretionary override.
                </p>
                <div style={{ display: 'flex', gap: 40, marginTop: 48 }}>
                  {[{ val: 'GC/MGC', label: 'Focus Markets' }, { val: 'ML/RL', label: 'Model Architecture' }, { val: '100%', label: 'Automated' }].map(m => (
                    <div key={m.label}>
                      <div style={{ fontSize: 22, fontWeight: 200, color: '#B0B0B0', letterSpacing: '-0.02em', marginBottom: 6 }}>{m.val}</div>
                      <div style={{ fontSize: 9, color: '#2E2E2E', letterSpacing: '0.16em', textTransform: 'uppercase' }}>{m.label}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {[
                  { phase: 'Phase I', title: 'Historical Analysis', body: 'Extensive tick-level historical analysis of Gold futures spanning multiple market cycles and volatility regimes.' },
                  { phase: 'Phase II', title: 'Model Development', body: 'Neural pattern recognition and reinforcement learning optimization across defined objective functions.' },
                  { phase: 'Phase III', title: 'Forward Testing', body: 'Multi-year forward testing in live market conditions with structured performance monitoring and parameter refinement.' },
                  { phase: 'Phase IV', title: 'Infrastructure Integration', body: 'Integration with Lucid Trading proprietary capital frameworks and establishment of execution monitoring protocols.' },
                ].map((item, i, arr) => (
                  <div key={i} style={{ display: 'flex', gap: 24, paddingBottom: i < arr.length - 1 ? 36 : 0 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 0 16px rgba(245,158,11,0.06)' }}>
                        <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#F59E0B', boxShadow: '0 0 6px rgba(245,158,11,0.6)' }} />
                      </div>
                      {i < arr.length - 1 && <div style={{ width: 1, flex: 1, background: 'linear-gradient(to bottom, rgba(245,158,11,0.2), rgba(245,158,11,0.04))', marginTop: 8 }} />}
                    </div>
                    <div style={{ paddingTop: 5 }}>
                      <div style={{ fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(245,158,11,0.5)', marginBottom: 4 }}>{item.phase}</div>
                      <div style={{ fontSize: 14, fontWeight: 400, color: '#9A9A9A', marginBottom: 8 }}>{item.title}</div>
                      <p style={{ color: '#383838', fontSize: 13, lineHeight: 1.85 }}>{item.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── PERSPECTIVES ── */}
        <section id="qs-infrastructure" style={{ padding: '130px 48px', background: '#070708' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ marginBottom: 68 }}>
              <Badge>Perspectives</Badge>
              <h2 style={{
                fontSize: 48, fontWeight: 200, letterSpacing: '-0.03em', marginTop: 20,
                background: 'linear-gradient(135deg, #FFFFFF, #C8C8C8 60%, #F59E0B 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>Participant Perspectives</h2>
            </div>
            <div className="qs-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 56 }}>
              {[
                { q: 'The systematic nature of QS1 removed the emotional variables I struggled with in discretionary trading. QS1 simply executes.', name: 'M.R.', role: 'Family Office Allocator' },
                { q: 'Having a research-grade AI framework manage execution allows me to allocate attention elsewhere while maintaining alignment with prop firm requirements.', name: 'D.K.', role: 'Accredited Participant' },
                { q: "QS1's focus on structure and consistency has been evident in the account behavior from the first month of operation.", name: 'S.L.', role: 'QS1 Participant since 2024' },
                { q: 'I was looking for a systematic approach that did not require constant monitoring. QS1 operates within clearly defined parameters without intervention.', name: 'T.M.', role: 'Independent Allocator' },
              ].map((t, i) => (
                <div key={i} style={{ border: '1px solid rgba(255,255,255,0.05)', borderRadius: 14, padding: '36px', background: 'linear-gradient(135deg, #0D0D0D, #0F0F12)', transition: 'border-color 0.25s' }} className="qs-card-gold">
                  <div style={{
                    fontSize: 40, lineHeight: 1, marginBottom: 20, fontWeight: 200,
                    background: 'linear-gradient(135deg, #F59E0B44, #F59E0B22)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                  }}>&ldquo;</div>
                  <p style={{ color: '#555', fontSize: 15, lineHeight: 1.95, fontWeight: 300, marginBottom: 28, fontStyle: 'italic' }}>{t.q}</p>
                  <div style={{ borderTop: '1px solid rgba(245,158,11,0.06)', paddingTop: 18 }}>
                    <div style={{ fontSize: 13, color: '#A8A8A8', fontWeight: 400 }}>{t.name}</div>
                    <div style={{ fontSize: 11, color: '#333', marginTop: 3, letterSpacing: '0.04em' }}>{t.role}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ textAlign: 'center' }}>
              <button className="qs-btn-gold" onClick={openModal}>Request Consideration</button>
            </div>
          </div>
        </section>

        {/* ── PROGRAM CONSIDERATIONS ── */}
        <section id="qs-considerations" style={{ padding: '130px 48px', background: 'linear-gradient(180deg, #070708, #0A0C10)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ marginBottom: 68 }}>
              <Badge>Parameters</Badge>
              <h2 style={{
                fontSize: 48, fontWeight: 200, letterSpacing: '-0.03em', marginTop: 20,
                background: 'linear-gradient(135deg, #FFFFFF, #C8C8C8 60%, #F59E0B 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>Program Considerations</h2>
            </div>
            <div className="qs-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, marginBottom: 40 }}>
              <div>
                <div style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#2A2A2A', marginBottom: 24 }}>Program Structure</div>
                {[
                  ['Structure', 'Private, invite-only initiative'],
                  ['Focus', 'Gold futures — GC/MGC'],
                  ['AI Engine', 'QS1 v3.2 (Quantitative ML)'],
                  ['Integration', 'Lucid Trading + Tradovate'],
                  ['Fee Model', '20% on successful payouts only'],
                  ['Access', 'Qualified participants only'],
                  ['Operation', 'Fully automated — zero manual input'],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '13px 0', borderBottom: '1px solid rgba(245,158,11,0.04)', gap: 16 }}>
                    <span style={{ color: '#2E2E2E', fontSize: 13 }}>{k}</span>
                    <span style={{ color: '#6A6A6A', fontSize: 13, textAlign: 'right' }}>{v}</span>
                  </div>
                ))}
              </div>
              <div>
                <div style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#2A2A2A', marginBottom: 24 }}>Account Parameters</div>
                <div style={{ border: '1px solid rgba(245,158,11,0.1)', borderRadius: 12, overflow: 'hidden', marginBottom: 20, background: 'linear-gradient(135deg, #0D0D0D, #0F1018)' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(245,158,11,0.07)' }}>
                        {['Account Size', 'Max / Cycle', 'Client / QS1'].map(h => (
                          <th key={h} style={{ padding: '13px 18px', textAlign: 'left', color: '#2A2A2A', fontWeight: 500, fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[['$50,000', '$1,250–$1,500', '80% / 20%'], ['$100,000', '$2,500–$3,000', '80% / 20%'], ['$150,000', '$3,000–$3,500', '80% / 20%']].map(([sz, mp, sp]) => (
                        <tr key={sz} style={{ borderBottom: '1px solid rgba(245,158,11,0.04)' }}>
                          <td style={{ padding: '14px 18px', color: '#B0B0B0' }}>{sz}</td>
                          <td style={{ padding: '14px 18px', color: '#6A6A6A', fontVariantNumeric: 'tabular-nums' }}>{mp}</td>
                          <td style={{ padding: '14px 18px', color: '#5A5A5A' }}>{sp}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div style={{ padding: '18px 20px', border: '1px solid rgba(180,60,60,0.1)', borderRadius: 10, background: 'rgba(180,60,60,0.025)' }}>
                  <div style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#4A2828', marginBottom: 8 }}>Risk Disclosure</div>
                  <p style={{ color: '#3A2828', fontSize: 12, lineHeight: 1.85 }}>All trading involves substantial risk of loss. Past performance does not indicate future results. No specific outcomes are guaranteed.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── ACCESS ── */}
        <section id="qs-access" style={{ padding: '140px 48px', background: '#070708', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 900, height: 900, borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,158,11,0.04) 0%, transparent 65%)', pointerEvents: 'none' }} />
          <div style={{ maxWidth: 680, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
            <Badge>Private Program</Badge>
            <h2 style={{
              fontSize: 52, fontWeight: 200, letterSpacing: '-0.035em', marginTop: 24, marginBottom: 20,
              background: 'linear-gradient(135deg, #FFFFFF 0%, #E0E0E0 40%, #F59E0B 80%, #FCD34D 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              Request Consideration
            </h2>
            <p style={{ color: '#3A3A3A', fontSize: 16, lineHeight: 1.9, marginBottom: 48, fontWeight: 300 }}>
              Quantara System One operates as a private, invite-only initiative. QS1-managed accounts are capacity-limited and offered selectively. All information submitted is treated with strict confidentiality.
            </p>
            <button className="qs-btn-gold" onClick={openModal} style={{ padding: '18px 56px', fontSize: 12, borderRadius: 12 }}>
              Begin Your Application
            </button>
            <p style={{ color: '#1E1E1E', fontSize: 11, marginTop: 24, letterSpacing: '0.06em' }}>Qualified applicants only · Private & Confidential · No solicitation</p>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer style={{ borderTop: '1px solid rgba(245,158,11,0.05)', background: '#040405', padding: '60px 48px 40px' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div className="qs-footer-inner" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, marginBottom: 52 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                  <QMark size={28} glow />
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 300, letterSpacing: '0.24em', textTransform: 'uppercase', color: '#4A4A4A' }}>Quantara Systems</div>
                    <div style={{ fontSize: 9, color: '#1E1E1E', letterSpacing: '0.14em', textTransform: 'uppercase' }}>Powered by QS1</div>
                  </div>
                </div>
                <p style={{ color: '#222', fontSize: 12, lineHeight: 1.9, maxWidth: 360 }}>
                  Quantitative market systems powered by QS1. Structured algorithmic approaches to Gold futures for qualified participants seeking systematic, hands-free market exposure.
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#1E1E1E', marginBottom: 14 }}>Private Program</div>
                <p style={{ color: '#282828', fontSize: 12, lineHeight: 2.1 }}>
                  Qualified inquiries only.<br />All communications are confidential.<br />
                  <span style={{ color: '#1E1E1E' }}>quantarasystems.com</span>
                </p>
              </div>
            </div>
            <div style={{ borderTop: '1px solid rgba(245,158,11,0.04)', paddingTop: 28 }}>
              <p style={{ color: '#1A1A1A', fontSize: 11, lineHeight: 1.95, marginBottom: 16 }}>
                <strong style={{ color: '#222' }}>RISK DISCLOSURE:</strong> Trading futures contracts involves substantial risk of loss and is not appropriate for all investors. Past performance is not indicative of future results. Quantara Systems and QS1 do not guarantee profits or freedom from loss. The content on this site is for informational purposes only and does not constitute financial advice, a solicitation, or an offer to buy or sell any financial instrument. Participation is restricted to qualified, accredited individuals only. All performance data reflects illustrative projections only — not a guarantee. This is a private, confidential program. Unauthorized distribution is prohibited.
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                <span style={{ color: '#181818', fontSize: 11 }}>© 2026 Quantara Systems. All rights reserved. Confidential.</span>
                <span style={{ color: '#141414', fontSize: 11 }}>Private Program · Qualified Participants Only</span>
              </div>
            </div>
          </div>
        </footer>

        {/* ── FLOATING CTA ── */}
        <div style={{ position: 'fixed', bottom: 32, right: 32, zIndex: 100 }}>
          <button className="qs-btn-gold" onClick={openModal} style={{ padding: '12px 24px', fontSize: 10, borderRadius: 10, backdropFilter: 'blur(20px)' }}>
            Request Access
          </button>
        </div>

      </div>

      <Modal open={modal} onClose={() => setModal(false)} />
    </>
  );
}
