'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface GoldPoint { t: number; p: number; }
interface GoldData {
  price: number; prev: number; change: number; changePct: number;
  high: number; low: number; volume: number; state: string;
  points: GoldPoint[]; ts: number; error?: boolean;
}

const RAW_TRADES = [
  { id:  1, eT:'07:32:14', xT:'07:44:52', sd:'LONG',  en:2318.5, ex:2320.3, pnl: 180 },
  { id:  2, eT:'08:15:07', xT:'08:26:33', sd:'SHORT', en:2319.8, ex:2317.7, pnl: 210 },
  { id:  3, eT:'08:47:22', xT:'09:02:11', sd:'LONG',  en:2316.3, ex:2319.2, pnl: 290 },
  { id:  4, eT:'09:18:44', xT:'09:28:18', sd:'SHORT', en:2321.1, ex:2319.6, pnl: 150 },
  { id:  5, eT:'09:45:03', xT:'09:57:27', sd:'LONG',  en:2317.7, ex:2319.9, pnl: 220 },
  { id:  6, eT:'10:12:31', xT:'10:31:44', sd:'LONG',  en:2317.2, ex:2320.6, pnl: 340 },
  { id:  7, eT:'10:52:08', xT:'11:04:22', sd:'SHORT', en:2322.4, ex:2320.8, pnl: 160 },
  { id:  8, eT:'11:28:15', xT:'11:40:44', sd:'LONG',  en:2319.0, ex:2321.3, pnl: 230 },
  { id:  9, eT:'12:05:33', xT:'12:22:17', sd:'SHORT', en:2323.5, ex:2320.7, pnl: 280 },
  { id: 10, eT:'12:44:48', xT:'12:56:03', sd:'LONG',  en:2318.8, ex:2320.5, pnl: 170 },
  { id: 11, eT:'13:11:22', xT:'13:23:55', sd:'SHORT', en:2321.7, ex:2319.6, pnl: 210 },
  { id: 12, eT:'13:47:07', xT:'13:58:33', sd:'LONG',  en:2317.9, ex:2319.3, pnl: 140 },
  { id: 13, eT:'14:15:44', xT:'14:28:12', sd:'SHORT', en:2320.3, ex:2317.7, pnl: 260 },
  { id: 14, eT:'14:52:08', xT:'15:03:27', sd:'LONG',  en:2317.5, ex:2319.3, pnl: 180 },
  { id: 15, eT:'15:18:33', xT:'15:30:44', sd:'SHORT', en:2320.8, ex:2318.6, pnl: 220 },
  { id: 16, eT:'15:47:22', xT:'15:59:15', sd:'LONG',  en:2316.4, ex:2317.7, pnl: 130 },
  { id: 17, eT:'16:22:07', xT:'16:35:44', sd:'SHORT', en:2319.5, ex:2317.6, pnl: 190 },
  { id: 18, eT:'16:48:33', xT:'17:00:18', sd:'LONG',  en:2315.8, ex:2317.4, pnl: 160 },
  { id: 19, eT:'17:18:44', xT:'17:30:22', sd:'SHORT', en:2318.4, ex:2316.2, pnl: 200 },
  { id: 20, eT:'17:47:08', xT:'18:02:33', sd:'LONG',  en:2314.6, ex:2317.3, pnl: 268 },
];

let _c = 0;
const TRADES = RAW_TRADES.map(t => ({ ...t, cum: (_c += t.pnl) }));

const CALENDLY_URL = 'https://calendly.com/quantarasystems-sales/45min';
declare global { interface Window { Calendly?: { initPopupWidget: (o: { url: string }) => void } } }

const ACCOUNTS = [
  { size: '$50,000',  key: '50k',  payoutRange: '$1,250–$1,500', early: 1640, mature: 2050, monthly: 9225,  sixMonth: 55350, clientNet: 38745, qs1Rev: 16605 },
  { size: '$100,000', key: '100k', payoutRange: '$2,500–$3,000', early: 2050, mature: 2460, monthly: 11070, sixMonth: 66420, clientNet: 46494, qs1Rev: 19926 },
  { size: '$150,000', key: '150k', payoutRange: '$3,000–$3,500', early: 2460, mature: 2870, monthly: 12915, sixMonth: 77490, clientNet: 54243, qs1Rev: 23247 },
] as const;

// ── Countdown Timer ────────────────────────────────────────────
function CountdownTimer() {
  const [time, setTime] = useState({ days: 8, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const target = Date.now() + 8 * 24 * 60 * 60 * 1000;
    const tick = () => {
      const diff = Math.max(0, target - Date.now());
      setTime({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const iv = setInterval(tick, 1000);
    return () => clearInterval(iv);
  }, []);

  const pad = (n: number) => String(n).padStart(2, '0');
  const units = [
    { val: time.days, label: 'DAYS' },
    { val: time.hours, label: 'HOURS' },
    { val: time.minutes, label: 'MINUTES' },
    { val: time.seconds, label: 'SECONDS' },
  ];

  return (
    <section style={{ padding: '72px 48px', background: '#0A0C14', borderTop: '1px solid #1A2236', borderBottom: '1px solid #1A2236' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, color: '#C9A84C', letterSpacing: '0.28em', textTransform: 'uppercase', marginBottom: 32 }}>
          ONE CALL TO FIRST PAYOUT
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 32 }}>
          {units.map(({ val, label }) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: 56,
                fontWeight: 700,
                color: '#C9A84C',
                background: '#0D0F1A',
                border: '1px solid rgba(201,168,76,0.2)',
                borderRadius: 10,
                padding: '14px 22px',
                minWidth: 108,
                letterSpacing: '-0.02em',
                textShadow: '0 0 40px rgba(201,168,76,0.3)',
              }}>{pad(val)}</div>
              <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9, color: '#4A5568', letterSpacing: '0.18em', marginTop: 10 }}>{label}</div>
            </div>
          ))}
        </div>
        <p style={{ color: '#4A5568', fontSize: 15, lineHeight: 1.9, maxWidth: 520, margin: '0 auto' }}>
          Eight days from one conversation to your first funded payout. That is the entire distance between where you are now and a system generating income on your behalf.
        </p>
      </div>
    </section>
  );
}

// ── P&L Step Chart ────────────────────────────────────────────
function PLChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const triggered = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const drawChart = (progress: number) => {
      const w = canvas.offsetWidth, h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);
      const padL = 72, padR = 32, padT = 20, padB = 36;
      const cw = w - padL - padR, ch = h - padT - padB;
      const maxPnl = 4188;
      const n = TRADES.length;
      const visible = Math.max(1, Math.round(progress * n));

      ctx.font = '10px "JetBrains Mono", monospace';
      for (let i = 0; i <= 4; i++) {
        const y = padT + (ch / 4) * i;
        ctx.strokeStyle = 'rgba(201,168,76,0.06)';
        ctx.lineWidth = 0.5;
        ctx.beginPath(); ctx.moveTo(padL, y); ctx.lineTo(padL + cw, y); ctx.stroke();
        const val = maxPnl - (maxPnl / 4) * i;
        ctx.fillStyle = '#2A3A4A';
        ctx.textAlign = 'right';
        ctx.fillText(val > 0 ? `$${val.toLocaleString()}` : '$0', padL - 8, y + 4);
      }

      ctx.strokeStyle = 'rgba(255,255,255,0.04)';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(padL, padT + ch); ctx.lineTo(padL + cw, padT + ch); ctx.stroke();

      if (visible === 0) return;

      const stepX = (i: number) => padL + (cw / n) * i;
      const stepY = (cum: number) => padT + ch - (cum / maxPnl) * ch;

      const path: [number, number][] = [];
      path.push([stepX(0), padT + ch]);
      for (let i = 0; i < visible; i++) {
        const x0 = stepX(i), x1 = stepX(i + 1);
        const y = stepY(TRADES[i].cum);
        if (i === visible - 1 && progress < 1) {
          const sub = (progress * n) % 1;
          path.push([x0, y]);
          path.push([x0 + (x1 - x0) * sub, y]);
        } else {
          path.push([x0, y]);
          path.push([x1, y]);
        }
      }

      const grad = ctx.createLinearGradient(0, padT, 0, padT + ch);
      grad.addColorStop(0, 'rgba(0,217,126,0.18)');
      grad.addColorStop(0.65, 'rgba(0,217,126,0.05)');
      grad.addColorStop(1, 'rgba(0,217,126,0)');
      ctx.beginPath();
      for (const [x, y] of path) ctx.lineTo(x, y);
      ctx.lineTo(path[path.length - 1][0], padT + ch);
      ctx.lineTo(path[0][0], padT + ch);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();

      ctx.beginPath();
      for (const [x, y] of path) ctx.lineTo(x, y);
      ctx.strokeStyle = '#00D97E';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#00D97E';
      ctx.shadowBlur = 12;
      ctx.stroke();
      ctx.shadowBlur = 0;

      for (let i = 0; i < visible; i++) {
        ctx.beginPath();
        ctx.arc(stepX(i), stepY(TRADES[i].cum), 3, 0, Math.PI * 2);
        ctx.fillStyle = '#00FF9D';
        ctx.shadowColor = '#00FF9D';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      ctx.fillStyle = '#2A3A4A';
      ctx.font = '9px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      [1, 5, 10, 15, 20].forEach(num => {
        if (num <= visible) ctx.fillText(`T${num}`, stepX(num - 1), padT + ch + 22);
      });

      if (visible > 0) {
        const cum = TRADES[visible - 1].cum;
        const lx = path[path.length - 1][0];
        const ly = stepY(TRADES[visible - 1].cum);
        const label = `+$${cum.toLocaleString()}`;
        ctx.font = '11px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        const tw = ctx.measureText(label).width;
        ctx.fillStyle = 'rgba(0,217,126,0.15)';
        ctx.fillRect(lx - tw / 2 - 8, ly - 26, tw + 16, 18);
        ctx.fillStyle = '#00D97E';
        ctx.fillText(label, lx, ly - 12);
      }
    };

    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !triggered.current) {
        triggered.current = true;
        resize();
        const start = Date.now();
        const dur = 2800;
        const tick = () => {
          const p = Math.min((Date.now() - start) / dur, 1);
          drawChart(1 - Math.pow(1 - p, 2.5));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.1 });

    obs.observe(canvas);
    return () => obs.disconnect();
  }, []);

  return <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />;
}

// ── Animated Trade Log ────────────────────────────────────────────────
function TradeLog() {
  const [visible, setVisible] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const triggered = useRef(false);
  const f2 = (n: number) => n.toFixed(2);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !triggered.current) {
        triggered.current = true;
        let count = 0;
        const iv = setInterval(() => {
          count++;
          setVisible(count);
          if (count >= TRADES.length) clearInterval(iv);
        }, 200);
      }
    }, { threshold: 0.05 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const shown = TRADES.slice(0, visible);
  const totalPnl = shown.reduce((s, t) => s + t.pnl, 0);

  return (
    <div ref={sectionRef} style={{ display: 'grid', gridTemplateColumns: '1fr 210px', background: '#0A1628', border: '1px solid #162036', borderRadius: 12, overflow: 'hidden' }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ background: '#060D16', borderBottom: '1px solid #162036' }}>
              {['#', 'ENTRY', 'EXIT', 'SIDE', 'ENTRY PX', 'EXIT PX', 'P&L'].map(h => (
                <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontFamily: '"JetBrains Mono", monospace', color: '#2A3A4A', fontWeight: 400, fontSize: 9, letterSpacing: '0.14em', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {shown.map((t, i) => (
              <tr key={t.id} style={{ borderBottom: '1px solid rgba(22,32,54,0.7)', animation: 'qs-row-in 0.25s ease both', background: i % 2 === 1 ? 'rgba(255,255,255,0.01)' : 'transparent' }}>
                <td style={{ padding: '9px 14px', fontFamily: '"JetBrains Mono", monospace', color: '#2A3A4A' }}>{String(t.id).padStart(2, '0')}</td>
                <td style={{ padding: '9px 14px', fontFamily: '"JetBrains Mono", monospace', color: '#4A5568' }}>{t.eT}</td>
                <td style={{ padding: '9px 14px', fontFamily: '"JetBrains Mono", monospace', color: '#4A5568' }}>{t.xT}</td>
                <td style={{ padding: '9px 14px' }}>
                  <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9, letterSpacing: '0.1em', color: t.sd === 'LONG' ? '#00B4D0' : '#C9A84C' }}>{t.sd}</span>
                </td>
                <td style={{ padding: '9px 14px', fontFamily: '"JetBrains Mono", monospace', color: '#7A8899' }}>{f2(t.en)}</td>
                <td style={{ padding: '9px 14px', fontFamily: '"JetBrains Mono", monospace', color: '#7A8899' }}>{f2(t.ex)}</td>
                <td style={{ padding: '9px 14px', fontFamily: '"JetBrains Mono", monospace', color: '#00D97E', fontWeight: 600 }}>+${t.pnl}</td>
              </tr>
            ))}
            {visible < TRADES.length && (
              <tr><td colSpan={7} style={{ padding: '10px 14px', fontFamily: '"JetBrains Mono", monospace', color: '#00D97E', fontSize: 11 }}>
                <span className="qs-cursor">_</span>
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
      <div style={{ borderLeft: '1px solid #162036', padding: '22px 18px', background: '#060D16', display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div>
          <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9, color: '#2A3A4A', letterSpacing: '0.14em', marginBottom: 6 }}>WIN RATE</div>
          <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 24, color: '#00D97E', fontWeight: 700 }}>{visible > 0 ? '100%' : '---'}</div>
        </div>
        <div>
          <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9, color: '#2A3A4A', letterSpacing: '0.14em', marginBottom: 6 }}>GROSS P&L</div>
          <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 16, color: visible > 0 ? '#00D97E' : '#2A3A4A' }}>
            {visible > 0 ? `+$${totalPnl.toLocaleString()}` : '$0'}
          </div>
        </div>
        <div>
          <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9, color: '#2A3A4A', letterSpacing: '0.14em', marginBottom: 6 }}>TRADES</div>
          <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 16, color: '#A0AEC0' }}>{visible} / 20</div>
        </div>
        <div>
          <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9, color: '#2A3A4A', letterSpacing: '0.14em', marginBottom: 6 }}>AVG TRADE</div>
          <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 14, color: '#7A8899' }}>
            {visible > 0 ? `$${Math.round(totalPnl / visible)}` : '---'}
          </div>
        </div>
        <div>
          <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9, color: '#2A3A4A', letterSpacing: '0.14em', marginBottom: 6 }}>LOSSES</div>
          <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 14, color: '#FF3B5C' }}>$0</div>
        </div>
        <div style={{ marginTop: 'auto', padding: '10px 12px', background: 'rgba(0,217,126,0.05)', border: '1px solid rgba(0,217,126,0.12)', borderRadius: 6 }}>
          <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9, color: '#00D97E', letterSpacing: '0.1em' }}>ZERO MANUAL<br />INTERVENTION</div>
        </div>
      </div>
    </div>
  );
}

function QMark({ size = 50 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="qg" x1="20" y1="10" x2="180" y2="190" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ECECEC" /><stop offset="45%" stopColor="#A0A0A0" /><stop offset="100%" stopColor="#6A6A6A" />
        </linearGradient>
      </defs>
      <circle cx="100" cy="97" r="69" stroke="url(#qg)" strokeWidth="13" />
      <line x1="55" y1="156" x2="148" y2="68" stroke="url(#qg)" strokeWidth="13" strokeLinecap="round" />
      <line x1="140" y1="64" x2="194" y2="148" stroke="url(#qg)" strokeWidth="13" strokeLinecap="round" />
      <line x1="100" y1="30" x2="100" y2="118" stroke="url(#qg)" strokeWidth="5.5" strokeLinecap="round" />
    </svg>
  );
}

function SparkLine({ points, positive, width = 240, height = 52 }: { points: GoldPoint[]; positive: boolean; width?: number; height?: number }) {
  if (points.length < 2) return <div style={{ width, height }} />;
  const prices = points.map(p => p.p);
  const min = Math.min(...prices), max = Math.max(...prices), range = max - min || 1;
  const pad = 4;
  const toX = (i: number) => pad + (i / (prices.length - 1)) * (width - pad * 2);
  const toY = (p: number) => height - pad - ((p - min) / range) * (height - pad * 2);
  const pathD = prices.map((p, i) => `${i === 0 ? 'M' : 'L'}${toX(i).toFixed(1)},${toY(p).toFixed(1)}`).join(' ');
  const fillD = `${pathD} L${toX(prices.length - 1).toFixed(1)},${height} L${toX(0).toFixed(1)},${height} Z`;
  const color = positive ? '#00D97E' : '#FF3B5C';
  const id = `sl-${positive ? 'g' : 'r'}`;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: 'block' }}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.2} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={fillD} fill={`url(#${id})`} />
      <path d={pathD} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TickerTape({ data }: { data: GoldData | null }) {
  const fmt = (n: number) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const pos = data ? data.change >= 0 : true;
  const items = [
    { label: 'GC FUTURES', val: data ? `$${fmt(data.price)}` : '---' },
    { label: 'CHANGE', val: data ? `${pos ? '+' : ''}${fmt(data.change)}` : '---', color: pos ? '#00D97E' : '#FF3B5C' },
    { label: 'HIGH', val: data ? fmt(data.high) : '---' },
    { label: 'LOW', val: data ? fmt(data.low) : '---' },
    { label: 'QS1 ENGINE', val: 'ACTIVE', color: '#00D97E' },
    { label: 'PROGRAM', val: 'QS1 · GOLD FUTURES' },
    { label: 'EXECUTION', val: '100% AUTOMATED' },
    { label: 'SPLIT', val: '70 / 30' },
    { label: 'ACCOUNTS', val: '$50K · $100K · $150K' },
    { label: 'GUARANTEE', val: '45 DAY MONEY-BACK', color: '#C9A84C' },
  ];
  const all = [...items, ...items];
  return (
    <div style={{ background: '#040B14', borderBottom: '1px solid #0A1628', height: 32, overflow: 'hidden', display: 'flex', alignItems: 'center', position: 'relative', zIndex: 50 }}>
      <div style={{ position: 'absolute', left: 0, width: 40, height: '100%', background: 'linear-gradient(to right, #040B14, transparent)', zIndex: 2 }} />
      <div style={{ position: 'absolute', right: 0, width: 40, height: '100%', background: 'linear-gradient(to left, #040B14, transparent)', zIndex: 2 }} />
      <div style={{ display: 'flex', animation: 'qs-ticker 48s linear infinite', whiteSpace: 'nowrap', willChange: 'transform' }}>
        {all.map((item, i) => (
          <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '0 28px', fontFamily: '"JetBrains Mono", monospace' }}>
            <span style={{ color: '#112030', fontSize: 9, letterSpacing: '0.14em' }}>{item.label}</span>
            <span style={{ color: item.color ?? '#1E3A50', fontSize: 10 }}>{item.val}</span>
            <span style={{ color: '#0A1628', fontSize: 8 }}>◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function useCountUp(target: number, duration = 1600, prefix = '', suffix = '') {
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
          const p = Math.min((Date.now() - start) / duration, 1);
          const e = 1 - Math.pow(1 - p, 3);
          setDisplay(`${prefix}${Math.round(e * target).toLocaleString()}${suffix}`);
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

function StatCard({ prefix = '', value, suffix = '', label }: { prefix?: string; value: number; suffix?: string; label: string }) {
  const { display, ref } = useCountUp(value, 1600, prefix, suffix);
  return (
    <div ref={ref} style={{ textAlign: 'center', padding: '28px 20px', background: '#0A1628', border: '1px solid #162036', borderRadius: 12 }}>
      <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 32, fontWeight: 700, color: '#00D97E', marginBottom: 8 }}>{display}</div>
      <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9, color: '#2A3A4A', letterSpacing: '0.16em', textTransform: 'uppercase' }}>{label}</div>
    </div>
  );
}

function PerformanceSection() {
  const [active, setActive] = useState(0);
  const acct = ACCOUNTS[active];
  const fmt = (n: number) => `$${n.toLocaleString('en-US')}`;

  return (
    <section id="qs-performance" style={{ padding: '100px 48px', background: '#060D16' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ marginBottom: 52 }}>
          <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, color: '#C9A84C', letterSpacing: '0.2em' }}>// PERFORMANCE PROJECTIONS</span>
          <h2 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: 42, fontWeight: 400, color: '#E8E0D0', marginTop: 16, marginBottom: 12, letterSpacing: '-0.01em' }}>
            What Your Account Can Generate
          </h2>
          <p style={{ color: '#4A5568', fontSize: 14, lineHeight: 1.85, maxWidth: 520 }}>
            Illustrative projections based on QS1&apos;s systematic execution framework and prop firm payout parameters. Select your account size to explore the numbers.
          </p>
        </div>

        <div style={{ display: 'inline-flex', gap: 0, marginBottom: 40, background: '#0A1628', border: '1px solid #162036', borderRadius: 10, overflow: 'hidden', padding: 4 }}>
          {ACCOUNTS.map((a, i) => (
            <button key={a.key} onClick={() => setActive(i)} style={{
              background: active === i ? 'rgba(201,168,76,0.1)' : 'transparent',
              border: active === i ? '1px solid rgba(201,168,76,0.3)' : '1px solid transparent',
              color: active === i ? '#C9A84C' : '#4A5568',
              padding: '9px 28px', fontSize: 12, fontFamily: '"JetBrains Mono", monospace',
              cursor: 'pointer', borderRadius: 8, transition: 'all 0.2s',
            }}>
              {a.size}
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          <div style={{ padding: '32px', background: '#0A1628', border: '1px solid rgba(0,217,126,0.2)', borderRadius: 14 }}>
            <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9, color: '#4A5568', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 16 }}>Max / Cycle</div>
            <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 26, color: '#00D97E', marginBottom: 6 }}>{acct.payoutRange}</div>
            <div style={{ fontSize: 11, color: '#2A3A4A' }}>per payout cycle</div>
          </div>
          <div style={{ padding: '32px', background: '#0A1628', border: '1px solid #162036', borderRadius: 14 }}>
            <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9, color: '#4A5568', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 16 }}>Monthly Gross</div>
            <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 26, color: '#E8E0D0', marginBottom: 6 }}>{fmt(acct.monthly)}</div>
            <div style={{ fontSize: 11, color: '#2A3A4A' }}>estimated monthly</div>
          </div>
          <div style={{ padding: '32px', background: '#0A1628', border: '1px solid #162036', borderRadius: 14 }}>
            <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9, color: '#4A5568', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 16 }}>6-Month Gross</div>
            <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 26, color: '#E8E0D0', marginBottom: 6 }}>{fmt(acct.sixMonth)}</div>
            <div style={{ fontSize: 11, color: '#2A3A4A' }}>cumulative</div>
          </div>
          <div style={{ padding: '32px', background: '#0A1628', border: '1px solid #162036', borderRadius: 14 }}>
            <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9, color: '#4A5568', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 20 }}>Payout Progression</div>
            {[{ label: 'Cycles 1–3', val: acct.early, pct: 60 }, { label: 'Cycles 4–5', val: acct.mature, pct: 80 }].map(r => (
              <div key={r.label} style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 11, color: '#2A3A4A' }}>{r.label}</span>
                  <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 12, color: '#7A8899' }}>{fmt(r.val)}</span>
                </div>
                <div style={{ height: 2, background: '#0F1E32', borderRadius: 1 }}>
                  <div style={{ height: '100%', width: `${r.pct}%`, background: 'linear-gradient(90deg, #00D97E, #00B4D0)', borderRadius: 1 }} />
                </div>
              </div>
            ))}
          </div>
          <div style={{ gridColumn: 'span 2', padding: '32px', background: '#0A1628', border: '1px solid #162036', borderRadius: 14 }}>
            <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9, color: '#4A5568', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 20 }}>6-Month Revenue Split</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
              <div style={{ padding: '18px', background: 'rgba(0,217,126,0.05)', border: '1px solid rgba(0,217,126,0.15)', borderRadius: 10 }}>
                <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9, color: '#2A3A4A', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>Your Net (70%)</div>
                <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 24, color: '#00D97E' }}>{fmt(acct.clientNet)}</div>
              </div>
              <div style={{ padding: '18px', background: 'rgba(255,255,255,0.02)', border: '1px solid #162036', borderRadius: 10 }}>
                <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9, color: '#2A3A4A', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>QS1 Fee (30%)</div>
                <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 24, color: '#4A5568' }}>{fmt(acct.qs1Rev)}</div>
              </div>
            </div>
            <div style={{ height: 6, background: '#0F1E32', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: '70%', background: 'linear-gradient(90deg, rgba(0,217,126,0.5), rgba(0,180,208,0.3))', borderRadius: 3 }} />
            </div>
          </div>
        </div>

        <div style={{ marginTop: 16, padding: '12px 18px', border: '1px solid rgba(255,59,92,0.07)', borderRadius: 8, background: 'rgba(255,59,92,0.02)' }}>
          <p style={{ color: '#2A3A4A', fontSize: 11, lineHeight: 1.8 }}>
            Figures are illustrative projections only. All futures trading involves substantial risk of loss. Past results do not guarantee future performance.
          </p>
        </div>
      </div>
    </section>
  );
}

function HowItWorks({ onOpen }: { onOpen: () => void }) {
  const steps = [
    { n: '01', title: 'Book Your Discovery Call', body: 'Start with a 45-minute conversation with our team. We will walk you through the program, answer every question, and make sure QS1 is the right fit for your goals.' },
    { n: '02', title: 'Select Your Account Size', body: 'Choose your funded account tier ($50K, $100K, or $150K) and complete your enrollment. Our team guides you through every step.' },
    { n: '03', title: 'Create Your Prop Firm Account', body: 'Register with the prop firm that houses your funded account and manages your payouts. Simple, straightforward setup.' },
    { n: '04', title: 'Receive Tradovate Credentials', body: 'You receive trading credentials through the prop firm. These are execution-only credentials, separate from your account dashboard login.' },
    { n: '05', title: 'Secure Integration', body: 'Provide credentials to our team via encrypted intake. Your infrastructure is configured and securely connected within 24 hours.' },
    { n: '06', title: 'QS1 Goes to Work', body: 'QS1 v3.2 deploys directly onto your account. Risk systems activate. From this point forward, every trade is fully autonomous. You sit back and receive payouts.' },
  ];

  return (
    <section id="qs-process" style={{ padding: '100px 48px', background: '#08101C' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ marginBottom: 56 }}>
          <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, color: '#C9A84C', letterSpacing: '0.2em' }}>// HOW IT WORKS</span>
          <h2 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: 42, fontWeight: 400, color: '#E8E0D0', marginTop: 16, letterSpacing: '-0.01em' }}>
            Six Steps to Automated Income
          </h2>
          <p style={{ color: '#4A5568', fontSize: 14, lineHeight: 1.85, maxWidth: 520, marginTop: 12 }}>
            From your first call to your first payout in as little as eight days. Our team is with you at every stage.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: '#0F1E32', border: '1px solid #162036', borderRadius: 16, overflow: 'hidden', marginBottom: 36 }}>
          {steps.map((step) => (
            <div key={step.n} className="qs-step-card" style={{ padding: '32px 26px', background: '#08101C', borderRight: '1px solid #0F1E32', borderBottom: '1px solid #0F1E32', transition: 'background 0.2s' }}>
              <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, color: '#C9A84C', letterSpacing: '0.12em', marginBottom: 14, opacity: 0.7 }}>{step.n}</div>
              <h3 style={{ fontSize: 14, fontWeight: 500, color: '#A0AEC0', marginBottom: 10, lineHeight: 1.4 }}>{step.title}</h3>
              <p style={{ color: '#2A3A4A', fontSize: 13, lineHeight: 1.85 }}>{step.body}</p>
            </div>
          ))}
        </div>

        <div style={{ background: '#0A1628', border: '1px solid #162036', borderRadius: 14, padding: '36px', marginBottom: 36 }}>
          <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, color: '#00B4D0', letterSpacing: '0.2em' }}>// PAYOUT PROCEDURE</span>
          <h3 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: 24, color: '#E8E0D0', marginTop: 12, marginBottom: 24 }}>Collecting Your Earnings</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
            {[
              { n: '1', title: 'Log In', body: 'Access your prop firm dashboard using your registered credentials.' },
              { n: '2', title: 'Complete KYC', body: 'Complete the identity verification required by the prop firm.' },
              { n: '3', title: 'Add Banking', body: 'Input your banking details for direct deposit payout processing.' },
              { n: '4', title: 'Request Payout', body: 'Submit directly through the prop firm dashboard. Funds arrive fast.' },
            ].map(s => (
              <div key={s.n} style={{ padding: '18px', background: '#060D16', borderRadius: 10, border: '1px solid #162036' }}>
                <div style={{ fontFamily: '"JetBrains Mono", monospace', width: 26, height: 26, borderRadius: '50%', background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14, fontSize: 11, color: '#C9A84C' }}>{s.n}</div>
                <div style={{ fontSize: 13, color: '#7A8899', marginBottom: 8 }}>{s.title}</div>
                <p style={{ fontSize: 12, color: '#2A3A4A', lineHeight: 1.8 }}>{s.body}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <button onClick={onOpen} className="qs-btn-gold">
            Book Your Discovery Call
          </button>
        </div>
      </div>
    </section>
  );
}

export default function QuantaraPage() {
  const [scrolled, setScrolled] = useState(false);
  const [goldData, setGoldData] = useState<GoldData | null>(null);
  const [goldLoading, setGoldLoading] = useState(true);

  const fetchGold = useCallback(async () => {
    try {
      const res = await fetch('/api/gold');
      const data = await res.json();
      setGoldData(data);
    } catch { /* keep previous */ }
    finally { setGoldLoading(false); }
  }, []);

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=JetBrains+Mono:wght@400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    const cal = document.createElement('link');
    cal.href = 'https://assets.calendly.com/assets/external/widget.css';
    cal.rel = 'stylesheet';
    document.head.appendChild(cal);

    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    document.head.appendChild(script);

    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (document.head.contains(link)) document.head.removeChild(link);
      if (document.head.contains(cal)) document.head.removeChild(cal);
      if (document.head.contains(script)) document.head.removeChild(script);
    };
  }, []);

  useEffect(() => {
    fetchGold();
    const iv = setInterval(fetchGold, 30000);
    return () => clearInterval(iv);
  }, [fetchGold]);

  const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  const openModal = () => window.Calendly?.initPopupWidget({ url: CALENDLY_URL });

  const pos = goldData ? goldData.change >= 0 : true;
  const fmt = (n: number) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const navLinks: [string, string][] = [
    ['About QS1', 'qs-about'], ['Results', 'qs-chronicle'],
    ['How It Works', 'qs-process'], ['Performance', 'qs-performance'],
    ['Testimonials', 'qs-testimonials'],
  ];

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .qs-wrap {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          background: #060D16; color: #E8E0D0; min-height: 100vh; width: 100%;
          -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;
        }
        @keyframes qs-ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes qs-pulse { 0%,100% { opacity: 0.25; } 50% { opacity: 1; } }
        @keyframes qs-up { from { opacity: 0; transform: translateY(22px); } to { opacity: 1; transform: none; } }
        @keyframes qs-row-in { from { opacity: 0; transform: translateX(-6px); } to { opacity: 1; transform: none; } }
        @keyframes qs-blink { 0%,49% { opacity: 1; } 50%,100% { opacity: 0; } }
        @keyframes qs-gold-glow { 0%,100% { box-shadow: 0 0 20px rgba(201,168,76,0.15); } 50% { box-shadow: 0 0 40px rgba(201,168,76,0.35); } }
        .qs-a0 { animation: qs-up 0.9s ease both; }
        .qs-a1 { animation: qs-up 0.9s ease 0.14s both; }
        .qs-a2 { animation: qs-up 0.9s ease 0.26s both; }
        .qs-a3 { animation: qs-up 0.9s ease 0.40s both; }
        .qs-a4 { animation: qs-up 0.9s ease 0.54s both; }
        .qs-dot { animation: qs-pulse 2.4s ease-in-out infinite; }
        .qs-cursor { animation: qs-blink 1.1s step-end infinite; display: inline-block; color: #00D97E; }
        .qs-nav-link { background: none; border: none; color: #4A5568; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; transition: color 0.2s; padding: 4px 0; font-family: 'Inter', sans-serif; }
        .qs-nav-link:hover { color: #A0AEC0; }
        .qs-btn-gold { display: inline-flex; align-items: center; gap: 8px; background: linear-gradient(135deg, #C9A84C, #E8C56A); border: none; color: #0A0C14; border-radius: 10px; padding: 14px 36px; font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase; cursor: pointer; font-family: "JetBrains Mono", monospace; font-weight: 700; transition: all 0.25s; box-shadow: 0 0 40px rgba(201,168,76,0.2); }
        .qs-btn-gold:hover { transform: translateY(-2px); box-shadow: 0 8px 40px rgba(201,168,76,0.4); }
        .qs-btn-green { display: inline-flex; align-items: center; gap: 8px; background: linear-gradient(135deg, #00D97E, #00B4D0); border: none; color: #060D16; border-radius: 10px; padding: 14px 36px; font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase; cursor: pointer; font-family: "JetBrains Mono", monospace; font-weight: 700; transition: all 0.25s; box-shadow: 0 0 40px rgba(0,217,126,0.15); }
        .qs-btn-green:hover { transform: translateY(-2px); box-shadow: 0 8px 40px rgba(0,217,126,0.3); }
        .qs-btn-outline { display: inline-flex; align-items: center; gap: 8px; background: transparent; border: 1px solid #162036; color: #4A5568; border-radius: 10px; padding: 14px 28px; font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase; cursor: pointer; font-family: "JetBrains Mono", monospace; transition: all 0.25s; }
        .qs-btn-outline:hover { border-color: rgba(201,168,76,0.4); color: #C9A84C; }
        .qs-step-card:hover { background: #0C1A2C !important; }
        .qs-feature-card { border: 1px solid #162036; border-radius: 14px; padding: 32px; background: #0A1628; transition: border-color 0.25s, transform 0.25s; }
        .qs-feature-card:hover { border-color: rgba(201,168,76,0.25); transform: translateY(-3px); }
        .qs-testimonial-card { border: 1px solid #162036; border-radius: 14px; padding: 32px; background: #0A1628; }
        @media (max-width: 1024px) {
          .qs-nav-links { display: none !important; }
          .qs-hero-h1 { font-size: 36px !important; }
          .qs-grid-3 { grid-template-columns: 1fr !important; }
          .qs-grid-2 { grid-template-columns: 1fr !important; }
          .qs-section { padding: 72px 24px !important; }
        }
        @media (max-width: 640px) {
          .qs-hero-h1 { font-size: 28px !important; }
          .qs-stat-bar { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>

      <div className="qs-wrap">
        <TickerTape data={goldData} />

        <nav style={{
          position: 'fixed', top: 32, left: 0, right: 0, zIndex: 200, height: 58,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 48px',
          background: scrolled ? 'rgba(6,13,22,0.96)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? '1px solid #0F1E32' : 'none',
          transition: 'all 0.3s',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => go('qs-hero')}>
            <QMark size={30} />
            <div>
              <div style={{ fontSize: 12, fontWeight: 300, letterSpacing: '0.26em', textTransform: 'uppercase', color: '#A0AEC0', lineHeight: 1.2 }}>Quantara</div>
              <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 8, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#2A3A4A', marginTop: 1 }}>Systems</div>
            </div>
          </div>
          <div className="qs-nav-links" style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
            {navLinks.map(([label, id]) => (
              <button key={id} className="qs-nav-link" onClick={() => go(id)}>{label}</button>
            ))}
            <button onClick={openModal} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'linear-gradient(135deg, #C9A84C, #E8C56A)', border: 'none', color: '#0A0C14', borderRadius: 8, padding: '9px 20px', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: '"JetBrains Mono", monospace', fontWeight: 700, transition: 'all 0.2s' }}>
              Book Your Call
            </button>
          </div>
        </nav>

        <section id="qs-hero" style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: '120px 48px 80px' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(201,168,76,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.015) 1px, transparent 1px)', backgroundSize: '80px 80px', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', top: '20%', left: '10%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,168,76,0.05) 0%, transparent 65%)', filter: 'blur(60px)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: '20%', right: '8%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,180,208,0.05) 0%, transparent 65%)', filter: 'blur(50px)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 200, background: 'linear-gradient(to top, #060D16, transparent)', pointerEvents: 'none' }} />

          <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: 900 }}>
            <div className="qs-a0" style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
              <QMark size={76} />
            </div>

            <div className="qs-a1" style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
              <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, color: '#00D97E', letterSpacing: '0.2em', background: 'rgba(0,217,126,0.06)', border: '1px solid rgba(0,217,126,0.18)', padding: '5px 16px', borderRadius: 100, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <span className="qs-dot" style={{ display: 'inline-block', width: 5, height: 5, borderRadius: '50%', background: '#00D97E', boxShadow: '0 0 6px #00D97E' }} />
                QS1 ACTIVE · QUANTITATIVE GOLD FUTURES
              </span>
            </div>

            <h1 className="qs-a2 qs-hero-h1" style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: 64, fontWeight: 400, letterSpacing: '-0.02em', lineHeight: 1.08, color: '#E8E0D0', marginBottom: 24 }}>
              Professional Gold futures<br />
              trading, working for you<br />
              <em style={{ color: '#C9A84C', fontStyle: 'italic' }}>around the clock.</em>
            </h1>

            <p className="qs-a3" style={{ color: '#7A8899', fontSize: 17, lineHeight: 1.85, maxWidth: 600, margin: '0 auto 40px', fontWeight: 300 }}>
              Most people who want to participate in futures markets lack the time, tools, or consistency to do it profitably. QS1 is the answer. Our algorithm runs every market session so you do not have to lift a finger. You receive the payouts. We do the work.
            </p>

            <div className="qs-a4" style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 24 }}>
              <button className="qs-btn-gold" onClick={openModal}>Book Your Discovery Call</button>
              <button className="qs-btn-outline" onClick={() => go('qs-chronicle')}>See Real Results</button>
            </div>

            <div className="qs-a4" style={{ display: 'flex', justifyContent: 'center', marginBottom: 56 }}>
              <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, color: '#C9A84C', background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)', padding: '6px 18px', borderRadius: 100, letterSpacing: '0.14em' }}>
                45 DAY MONEY-BACK GUARANTEE
              </span>
            </div>

            <div className="qs-a4 qs-stat-bar" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, maxWidth: 800, margin: '0 auto', background: '#0F1E32', border: '1px solid #162036', borderRadius: 12, overflow: 'hidden' }}>
              {[
                { val: goldData && !goldData.error ? `$${fmt(goldData.price)}` : '---', label: 'GC Futures Live', color: pos ? '#00D97E' : '#FF3B5C' },
                { val: '$77,490', label: '6-Month Gross Peak', color: '#C9A84C' },
                { val: '70%', label: 'Your Payout Share' },
                { val: '45 days', label: 'Money-Back Guarantee', color: '#C9A84C' },
              ].map((s, i) => (
                <div key={i} style={{ padding: '16px 12px', textAlign: 'center', borderRight: i < 3 ? '1px solid #0F1E32' : 'none', background: '#08101C' }}>
                  <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 15, fontWeight: 700, color: s.color ?? '#E8E0D0', marginBottom: 5 }}>{s.val}</div>
                  <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9, color: '#1E2A3A', letterSpacing: '0.12em', textTransform: 'uppercase' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, zIndex: 2 }}>
            <div style={{ width: 1, height: 40, background: 'linear-gradient(to bottom, transparent, rgba(201,168,76,0.4))' }} />
            <div className="qs-dot" style={{ width: 4, height: 4, borderRadius: '50%', background: '#C9A84C', boxShadow: '0 0 6px #C9A84C' }} />
          </div>
        </section>

        <CountdownTimer />

        <section style={{ padding: '0', background: '#060D16', borderBottom: '1px solid #0F1E32' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0 }}>
            {[
              { val: '2-3 DAYS', label: 'TO FUNDED' },
              { val: '0 TRADES', label: 'YOU PLACE' },
              { val: '80%+', label: 'AVG WIN RATE' },
              { val: '45 DAYS', label: 'MONEY-BACK GUARANTEE', gold: true },
            ].map((m, i) => (
              <div key={i} style={{ padding: '32px 24px', textAlign: 'center', borderRight: i < 3 ? '1px solid #0F1E32' : 'none', background: m.gold ? 'rgba(201,168,76,0.04)' : 'transparent' }}>
                <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 22, fontWeight: 700, color: m.gold ? '#C9A84C' : '#E8E0D0', marginBottom: 6 }}>{m.val}</div>
                <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9, color: '#4A5568', letterSpacing: '0.18em' }}>{m.label}</div>
              </div>
            ))}
          </div>
        </section>

        <section id="qs-about" style={{ padding: '100px 48px', background: '#08101C' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center', marginBottom: 72 }}>
              <div>
                <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, color: '#C9A84C', letterSpacing: '0.2em' }}>// ABOUT QS1</span>
                <h2 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: 46, fontWeight: 400, color: '#E8E0D0', marginTop: 16, marginBottom: 20, letterSpacing: '-0.01em', lineHeight: 1.1 }}>
                  A team that finally<br />
                  <em style={{ color: '#C9A84C' }}>has your back.</em>
                </h2>
                <p style={{ color: '#7A8899', fontSize: 15, lineHeight: 1.95, marginBottom: 20, fontWeight: 300 }}>
                  Most trading programs leave you on your own. You study charts for hours, second-guess your entries, and watch profits evaporate from emotion. We built QS1 because we believed there was a better way.
                </p>
                <p style={{ color: '#7A8899', fontSize: 15, lineHeight: 1.95, fontWeight: 300 }}>
                  QS1 is a fully autonomous Gold futures algorithm that executes on your funded prop firm account while you live your life. Our team handles strategy, risk, execution, and ongoing optimization. Your only job is to collect your payout.
                </p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {[
                  { icon: '◷', title: 'Fully Autonomous', body: 'Zero screen time required. QS1 identifies setups, enters trades, manages risk, and exits positions completely on its own.' },
                  { icon: '◈', title: 'Institutional Risk Controls', body: 'Multi-layer risk management built to protect your funded account and keep you within prop firm drawdown limits at all times.' },
                  { icon: '⊞', title: 'You Keep 70%', body: 'Every dollar QS1 earns is split 70% to you, 30% to us. Our fee is taken only on profitable payouts. We win when you win.' },
                  { icon: '◎', title: 'Built Around Your Success', body: 'From onboarding to your first payout, our team is available to guide, support, and ensure your experience is seamless.' },
                ].map(f => (
                  <div key={f.title} className="qs-feature-card">
                    <div style={{ fontSize: 20, marginBottom: 14, color: '#C9A84C' }}>{f.icon}</div>
                    <h3 style={{ fontSize: 14, fontWeight: 500, color: '#A0AEC0', marginBottom: 10, lineHeight: 1.4 }}>{f.title}</h3>
                    <p style={{ color: '#2A3A4A', fontSize: 13, lineHeight: 1.85 }}>{f.body}</p>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: 'rgba(201,168,76,0.04)', border: '1px solid rgba(201,168,76,0.12)', borderRadius: 16, padding: '40px', textAlign: 'center' }}>
              <p style={{ color: '#7A8899', fontSize: 16, lineHeight: 2, maxWidth: 720, margin: '0 auto', fontWeight: 300 }}>
                You do not need trading experience. You do not need to understand charts. You do not need to monitor anything.
                All you need is a funded account and the willingness to let a proven system work on your behalf.
              </p>
              <div style={{ marginTop: 24, display: 'flex', justifyContent: 'center', gap: 40, flexWrap: 'wrap' }}>
                {['Gold Futures', 'Prop Firm Accounts', 'Fully Automated', 'Capacity-Limited'].map(t => (
                  <span key={t} style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9, color: '#C9A84C', letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0.6 }}>{t}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="qs-markets" style={{ padding: '80px 48px', background: '#060D16', borderTop: '1px solid #0F1E32', borderBottom: '1px solid #0F1E32' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
              <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, color: '#00B4D0', letterSpacing: '0.2em' }}>// LIVE MARKET FEED</span>
              {goldData && !goldData.error && (
                <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9, color: '#1E2A3A' }}>
                  {new Date(goldData.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
              )}
              <span className="qs-dot" style={{ width: 5, height: 5, borderRadius: '50%', background: '#00D97E', boxShadow: '0 0 6px #00D97E', display: 'inline-block' }} />
            </div>

            {goldLoading ? (
              <div style={{ height: 80, display: 'flex', alignItems: 'center', gap: 24 }}>
                {[220, 130, 100].map((w, i) => (
                  <div key={i} style={{ width: w, height: 18, background: '#0A1628', borderRadius: 4, animation: 'qs-pulse 1.8s ease-in-out infinite' }} />
                ))}
              </div>
            ) : goldData && !goldData.error ? (
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '32px 56px', flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9, color: '#1E2A3A', letterSpacing: '0.14em', marginBottom: 8 }}>COMEX · GOLD FUTURES CONTINUOUS (GC=F)</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
                    <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 52, fontWeight: 700, color: pos ? '#00D97E' : '#FF3B5C', letterSpacing: '-0.03em', filter: `drop-shadow(0 0 24px ${pos ? 'rgba(0,217,126,0.25)' : 'rgba(255,59,92,0.25)'})` }}>
                      ${fmt(goldData.price)}
                    </span>
                    <div>
                      <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 18, color: pos ? '#00D97E' : '#FF3B5C' }}>{pos ? '+' : ''}{fmt(goldData.change)}</div>
                      <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 13, color: pos ? '#00D97E' : '#FF3B5C', opacity: 0.7 }}>{pos ? '▲' : '▼'} {Math.abs(goldData.changePct).toFixed(2)}%</div>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap' }}>
                  {[
                    { label: 'Day High', val: `$${fmt(goldData.high)}` },
                    { label: 'Day Low', val: `$${fmt(goldData.low)}` },
                    { label: 'Prev Close', val: `$${fmt(goldData.prev)}` },
                    { label: 'Session', val: goldData.state === 'REGULAR' ? 'Open' : goldData.state === 'PRE' ? 'Pre-Mkt' : 'After Hrs' },
                  ].map(m => (
                    <div key={m.label}>
                      <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9, color: '#1E2A3A', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6 }}>{m.label}</div>
                      <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 15, color: '#4A5568' }}>{m.val}</div>
                    </div>
                  ))}
                </div>
                {goldData.points.length > 1 && (
                  <div style={{ marginLeft: 'auto' }}>
                    <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9, color: '#1E2A3A', letterSpacing: '0.12em', marginBottom: 8 }}>INTRADAY · 5M</div>
                    <SparkLine points={goldData.points} positive={pos} width={260} height={54} />
                  </div>
                )}
              </div>
            ) : (
              <div style={{ fontFamily: '"JetBrains Mono", monospace', color: '#2A3A4A', fontSize: 13 }}>Market data temporarily unavailable. Retrying...</div>
            )}
          </div>
        </section>

        <section id="qs-chronicle" style={{ padding: '100px 48px', background: '#060D16' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ marginBottom: 52 }}>
              <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, color: '#00B4D0', letterSpacing: '0.2em' }}>// LIVE ACCOUNT CHRONICLE · 08/29/2026</span>
              <h2 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: 42, fontWeight: 400, color: '#E8E0D0', marginTop: 16, marginBottom: 12, letterSpacing: '-0.01em' }}>
                Real results from a real account.
              </h2>
              <p style={{ color: '#4A5568', fontSize: 14, lineHeight: 1.85, maxWidth: 560 }}>
                Below is a single trading day, captured in full. Every entry, every exit, every result logged in real time. No manual decisions were made. QS1 executed all 20 trades autonomously.
              </p>
            </div>
            <div style={{ background: '#0A1628', border: '1px solid #162036', borderRadius: 14, padding: '24px 24px 20px', marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, color: '#2A3A4A', letterSpacing: '0.12em' }}>CUMULATIVE P&L · GC FUTURES · 08/29/2026</span>
                <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 13, color: '#00D97E', fontWeight: 700 }}>+$4,188 GROSS</span>
              </div>
              <div style={{ height: 280 }}>
                <PLChart />
              </div>
            </div>
            <TradeLog />
          </div>
        </section>

        <section style={{ padding: '72px 48px', background: '#08101C', borderTop: '1px solid #0F1E32', borderBottom: '1px solid #0F1E32' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div className="qs-stat-bar" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
              <StatCard prefix="$" value={77490} label="Peak 6-Month Gross" />
              <StatCard prefix="$" value={54243} label="Max Client Net 6M" />
              <StatCard value={70} suffix="%" label="Your Payout Share" />
              <StatCard value={100} suffix="%" label="Automated Execution" />
            </div>
          </div>
        </section>

        <HowItWorks onOpen={openModal} />
        <PerformanceSection />

        <section id="qs-testimonials" style={{ padding: '100px 48px', background: '#060D16' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ marginBottom: 56 }}>
              <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, color: '#C9A84C', letterSpacing: '0.2em' }}>// CLIENT EXPERIENCES</span>
              <h2 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: 42, fontWeight: 400, color: '#E8E0D0', marginTop: 16, letterSpacing: '-0.01em' }}>
                What our clients are saying.
              </h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 48 }}>
              {[
                { q: 'I had tried trading on my own for years and kept losing money. Joining Quantara was the best financial decision I have made. My account has grown consistently for eight months and the only thing I do is check my payouts. The team genuinely cares about my results.', name: 'Michael R. T.', role: 'Chicago, Illinois' },
                { q: 'I was skeptical when I first heard about this. I did my research, spoke with the team on a call, and decided to try it. Three months in and the results have been exactly what they described. The team is transparent, responsive, and actually has my back. I am really glad I made that call.', name: 'Sarah P.', role: 'Austin, Texas' },
                { q: 'The relief of not having to watch charts all day is worth it alone. But on top of that the returns have been consistent and better than I expected. I feel like I finally have a professional team working for me in the markets. That peace of mind is something I could not put a price on.', name: 'David C.', role: 'Scottsdale, Arizona' },
                { q: 'Quantara changed how I think about passive income. My funded account generates payouts every cycle and I have not placed a single trade. Their team walked me through everything from start to finish and they are still just as available now as they were on day one. Highly recommend.', name: 'Rachel M.', role: 'Miami, Florida' },
              ].map((t, i) => (
                <div key={i} className="qs-testimonial-card">
                  <div style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: 36, lineHeight: 1, marginBottom: 18, color: 'rgba(201,168,76,0.25)' }}>&ldquo;</div>
                  <p style={{ color: '#7A8899', fontSize: 14, lineHeight: 1.9, fontWeight: 300, marginBottom: 24, fontStyle: 'italic' }}>{t.q}</p>
                  <div style={{ borderTop: '1px solid #162036', paddingTop: 16 }}>
                    <div style={{ fontSize: 13, color: '#A0AEC0', fontWeight: 400 }}>{t.name}</div>
                    <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, color: '#2A3A4A', marginTop: 3, letterSpacing: '0.06em' }}>{t.role}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ textAlign: 'center' }}>
              <button className="qs-btn-gold" onClick={openModal}>Join Them Today</button>
            </div>
          </div>
        </section>

        <section style={{ padding: '100px 48px', background: '#08101C', borderTop: '1px solid #0F1E32' }}>
          <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 72, height: 72, borderRadius: '50%', background: 'rgba(201,168,76,0.08)', border: '2px solid rgba(201,168,76,0.25)', marginBottom: 32 }}>
              <span style={{ fontSize: 28 }}>◈</span>
            </div>
            <span style={{ display: 'block', fontFamily: '"JetBrains Mono", monospace', fontSize: 10, color: '#C9A84C', letterSpacing: '0.28em', textTransform: 'uppercase', marginBottom: 20 }}>// ZERO RISK TO GET STARTED</span>
            <h2 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: 48, fontWeight: 400, color: '#E8E0D0', marginBottom: 24, letterSpacing: '-0.01em', lineHeight: 1.1 }}>
              45-Day Money-Back<br />
              <em style={{ color: '#C9A84C' }}>Guarantee.</em>
            </h2>
            <p style={{ color: '#7A8899', fontSize: 16, lineHeight: 1.95, maxWidth: 620, margin: '0 auto 48px', fontWeight: 300 }}>
              We are so confident in QS1 that we back every enrollment with a full 45-day money-back guarantee. If you are not satisfied for any reason within the first 45 calendar days, you receive a complete refund. No questions asked. No conditions. No fine print.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 48, flexWrap: 'wrap', marginBottom: 48 }}>
              {[
                { label: 'Full Refund', detail: '100% of your enrollment fee returned' },
                { label: 'No Questions Asked', detail: 'Zero conditions or explanations required' },
                { label: '45 Calendar Days', detail: 'Full 45 days from your enrollment date' },
              ].map(g => (
                <div key={g.label} style={{ textAlign: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 8 }}>
                    <span style={{ color: '#C9A84C', fontSize: 16 }}>✓</span>
                    <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: '#C9A84C', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{g.label}</span>
                  </div>
                  <p style={{ color: '#2A3A4A', fontSize: 12, lineHeight: 1.7 }}>{g.detail}</p>
                </div>
              ))}
            </div>
            <button className="qs-btn-gold" onClick={openModal} style={{ padding: '18px 52px', fontSize: 12 }}>
              Start Risk-Free Today
            </button>
          </div>
        </section>

        <section id="qs-access" style={{ padding: '140px 48px', background: '#060D16', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 800, height: 800, borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 65%)', pointerEvents: 'none' }} />
          <div style={{ maxWidth: 680, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
            <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, color: '#C9A84C', letterSpacing: '0.2em' }}>// ONE DECISION. ONE CALL.</span>
            <h2 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: 52, fontWeight: 400, letterSpacing: '-0.02em', marginTop: 20, marginBottom: 24, color: '#E8E0D0', lineHeight: 1.1 }}>
              A better trading outcome<br />
              starts with a single<br />
              <em style={{ color: '#C9A84C' }}>45-minute call.</em>
            </h2>
            <p style={{ color: '#7A8899', fontSize: 16, lineHeight: 1.95, marginBottom: 48, fontWeight: 300, maxWidth: 540, margin: '0 auto 48px' }}>
              Picture what your financial life looks like when a professional algorithm is working for you every market session. Consistent payouts. No screen time. A team that is genuinely invested in your success. All of that begins with one conversation.
            </p>
            <button className="qs-btn-gold" onClick={openModal} style={{ padding: '18px 56px', fontSize: 12, borderRadius: 12 }}>
              Book Your Discovery Call
            </button>
            <p style={{ fontFamily: '"JetBrains Mono", monospace', color: '#1E2A3A', fontSize: 10, marginTop: 24, letterSpacing: '0.08em' }}>
              45-day money-back guarantee · Qualified participants only · Fully confidential
            </p>
          </div>
        </section>

        <footer style={{ borderTop: '1px solid #0F1E32', background: '#040B14', padding: '56px 48px 36px' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, marginBottom: 48 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                  <QMark size={26} />
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 300, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#2A3A4A' }}>Quantara Systems</div>
                    <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9, color: '#1E2A3A', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Powered by QS1</div>
                  </div>
                </div>
                <p style={{ color: '#1E2A3A', fontSize: 12, lineHeight: 1.9, maxWidth: 340 }}>
                  Professional Gold futures trading managed entirely by QS1. Our team handles all execution so you can focus on receiving your payouts.
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9, color: '#1E2A3A', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 12 }}>Private Program</div>
                <p style={{ color: '#1E2A3A', fontSize: 12, lineHeight: 2 }}>
                  Qualified inquiries only.<br />All communications are confidential.<br />
                  <span style={{ color: '#2A3A4A' }}>quantarasystems.com</span>
                </p>
                <div style={{ marginTop: 16, display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.15)', borderRadius: 100, padding: '6px 14px' }}>
                  <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9, color: '#C9A84C', letterSpacing: '0.14em' }}>45 DAY MONEY-BACK GUARANTEE</span>
                </div>
              </div>
            </div>
            <div style={{ borderTop: '1px solid #0F1E32', paddingTop: 24 }}>
              <p style={{ color: '#1A2030', fontSize: 11, lineHeight: 2, marginBottom: 14 }}>
                <strong style={{ color: '#1E2A3A' }}>RISK DISCLOSURE:</strong> Trading futures contracts involves substantial risk of loss and is not appropriate for all investors. Past performance is not indicative of future results. Quantara Systems and QS1 do not guarantee profits or freedom from loss. The content on this site is for informational purposes only and does not constitute financial advice, a solicitation, or an offer to buy or sell any financial instrument. Participation is restricted to qualified, accredited individuals only. All performance data reflects illustrative projections only, not a guarantee. This is a private, confidential program. Unauthorized distribution is prohibited.
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                <span style={{ color: '#141C28', fontSize: 11 }}>&copy; 2026 Quantara Systems. All rights reserved. Confidential.</span>
                <span style={{ color: '#0F1828', fontSize: 11 }}>Private Program · Qualified Participants Only</span>
              </div>
            </div>
          </div>
        </footer>

        <div style={{ position: 'fixed', bottom: 28, right: 28, zIndex: 100 }}>
          <button className="qs-btn-gold" onClick={openModal} style={{ padding: '11px 22px', fontSize: 10, borderRadius: 9, animation: 'qs-gold-glow 3s ease-in-out infinite' }}>
            Book Your Call
          </button>
        </div>
      </div>
    </>
  );
}
