'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface GoldPoint { t: number; p: number; }
interface GoldData {
  price: number; prev: number; change: number; changePct: number;
  high: number; low: number; volume: number; state: string;
  points: GoldPoint[]; ts: number; error?: boolean;
}

// 20 consecutive winning trades — total $4,188
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
        ctx.strokeStyle = 'rgba(0,180,208,0.07)';
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
                  <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9, letterSpacing: '0.1em', color: t.sd === 'LONG' ? '#00B4D0' : '#F59E0B' }}>{t.sd}</span>
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
  ];
  const all = [...items, ...items];
  return (
    <div style={{ background: '#040B14', borderBottom: '1px solid #0A1628', height: 32, overflow: 'hidden', display: 'flex', alignItems: 'center', position: 'relative', zIndex: 50 }}>
      <div style={{ position: 'absolute', left: 0, width: 40, height: '100%', background: 'linear-gradient(to right, #040B14, transparent)', zIndex: 2 }} />
      <div style={{ position: 'absolute', right: 0, width: 40, height: '100%', background: 'linear-gradient(to left, #040B14, transparent)', zIndex: 2 }} />
      <div style={{ display: 'flex', animation: 'qs-ticker 44s linear infinite', whiteSpace: 'nowrap', willChange: 'transform' }}>
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
          <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, color: '#00B4D0', letterSpacing: '0.2em' }}>// PERFORMANCE PROJECTIONS</span>
          <h2 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: 42, fontWeight: 400, color: '#E8E0D0', marginTop: 16, marginBottom: 12, letterSpacing: '-0.01em' }}>
            Account Performance
          </h2>
          <p style={{ color: '#4A5568', fontSize: 14, lineHeight: 1.85, maxWidth: 520 }}>
            Illustrative projections based on QS1&apos;s systematic execution framework and prop firm payout parameters.
          </p>
        </div>

        <div style={{ display: 'inline-flex', gap: 0, marginBottom: 40, background: '#0A1628', border: '1px solid #162036', borderRadius: 10, overflow: 'hidden', padding: 4 }}>
          {ACCOUNTS.map((a, i) => (
            <button key={a.key} onClick={() => setActive(i)} style={{
              background: active === i ? 'rgba(0,180,208,0.1)' : 'transparent',
              border: active === i ? '1px solid rgba(0,180,208,0.25)' : '1px solid transparent',
              color: active === i ? '#00B4D0' : '#4A5568',
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
                <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9, color: '#2A3A4A', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>Client Net (70%)</div>
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
    { n: '01', title: 'Initial Enrollment', body: 'Select your account size ($50K, $100K, or $150K) and submit the one-time program fee to initiate onboarding.' },
    { n: '02', title: 'Create Prop Firm Account', body: 'Register with the prop firm — the platform used to house your funded account and manage payouts.' },
    { n: '03', title: 'Obtain Tradovate Credentials', body: 'Receive your Tradovate execution credentials through the prop firm. Trading credentials only, separate from your dashboard login.' },
    { n: '04', title: 'Secure Integration', body: 'Provide credentials to the QS1 team via encrypted intake. Infrastructure is configured and connected to your account.' },
    { n: '05', title: 'Algorithm Deployment', body: 'QS1 v3.2 deploys directly onto your account. Risk systems activate. Trade detection, management, and execution become fully autonomous.' },
    { n: '06', title: 'Automated Trading Begins', body: 'QS1 scans continuously for optimal Gold setups. Trades only when conditions are favorable. No manual experience required.' },
  ];

  return (
    <section id="qs-process" style={{ padding: '100px 48px', background: '#08101C' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ marginBottom: 56 }}>
          <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, color: '#00B4D0', letterSpacing: '0.2em' }}>// ENROLLMENT PROCESS</span>
          <h2 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: 42, fontWeight: 400, color: '#E8E0D0', marginTop: 16, letterSpacing: '-0.01em' }}>
            Six Steps to Automated Execution
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: '#0F1E32', border: '1px solid #162036', borderRadius: 16, overflow: 'hidden', marginBottom: 36 }}>
          {steps.map((step) => (
            <div key={step.n} className="qs-step-card" style={{ padding: '32px 26px', background: '#08101C', borderRight: '1px solid #0F1E32', borderBottom: '1px solid #0F1E32', transition: 'background 0.2s' }}>
              <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, color: '#00B4D0', letterSpacing: '0.12em', marginBottom: 14, opacity: 0.5 }}>{step.n}</div>
              <h3 style={{ fontSize: 14, fontWeight: 500, color: '#A0AEC0', marginBottom: 10, lineHeight: 1.4 }}>{step.title}</h3>
              <p style={{ color: '#2A3A4A', fontSize: 13, lineHeight: 1.85 }}>{step.body}</p>
            </div>
          ))}
        </div>

        <div style={{ background: '#0A1628', border: '1px solid #162036', borderRadius: 14, padding: '36px', marginBottom: 36 }}>
          <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, color: '#00B4D0', letterSpacing: '0.2em' }}>// PAYOUT PROCEDURE</span>
          <h3 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: 24, color: '#E8E0D0', marginTop: 12, marginBottom: 24 }}>Requesting Your Payout</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
            {[
              { n: '1', title: 'Log In', body: 'Access your prop firm dashboard using your registered credentials.' },
              { n: '2', title: 'Complete KYC', body: 'Complete the identity verification required by the prop firm.' },
              { n: '3', title: 'Add Banking', body: 'Input your banking details for direct deposit payout processing.' },
              { n: '4', title: 'Request Payout', body: 'Submit directly through the prop firm dashboard.' },
            ].map(s => (
              <div key={s.n} style={{ padding: '18px', background: '#060D16', borderRadius: 10, border: '1px solid #162036' }}>
                <div style={{ fontFamily: '"JetBrains Mono", monospace', width: 26, height: 26, borderRadius: '50%', background: 'rgba(0,180,208,0.08)', border: '1px solid rgba(0,180,208,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14, fontSize: 11, color: '#00B4D0' }}>{s.n}</div>
                <div style={{ fontSize: 13, color: '#7A8899', marginBottom: 8 }}>{s.title}</div>
                <p style={{ fontSize: 12, color: '#2A3A4A', lineHeight: 1.8 }}>{s.body}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <button onClick={onOpen} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'linear-gradient(135deg, #00D97E, #00B4D0)', border: 'none', color: '#060D16', borderRadius: 10, padding: '14px 36px', fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: '"JetBrains Mono", monospace', fontWeight: 700, boxShadow: '0 0 40px rgba(0,217,126,0.15)' }}>
            Begin Enrollment →
          </button>
        </div>
      </div>
    </section>
  );
}

function AccountDashboard() {
  const [acctIdx, setAcctIdx] = useState(0);
  const [payoutNum, setPayoutNum] = useState(3);
  const acct = ACCOUNTS[acctIdx];
  const payoutAvg = payoutNum <= 3 ? acct.early : acct.mature;
  const fmtCur = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 });

  const recentPayouts = [
    { cycle: `Cycle ${Math.max(1, payoutNum - 2)}`, date: '2026-02-12', amount: fmtCur(acct.early), status: 'Processed' },
    { cycle: `Cycle ${Math.max(1, payoutNum - 1)}`, date: '2026-03-28', amount: fmtCur(acct.early), status: 'Processed' },
    { cycle: `Cycle ${payoutNum}`, date: 'Pending', amount: fmtCur(payoutAvg), status: 'In Progress' },
  ];

  const systemStatus = [
    { label: 'QS1 Engine', val: 'v3.2 · Active' },
    { label: 'Risk System', val: 'Engaged' },
    { label: 'Tradovate Feed', val: 'Connected' },
    { label: 'Prop Firm Platform', val: 'Linked' },
  ];

  return (
    <section id="qs-dashboard" style={{ padding: '100px 48px', background: '#060D16' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ marginBottom: 48 }}>
          <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, color: '#00B4D0', letterSpacing: '0.2em' }}>// MEMBER PORTAL</span>
          <h2 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: 42, fontWeight: 400, color: '#E8E0D0', marginTop: 16, marginBottom: 12, letterSpacing: '-0.01em' }}>
            Account Progress Tracker
          </h2>
          <p style={{ color: '#4A5568', fontSize: 13, maxWidth: 480, lineHeight: 1.8 }}>
            Illustrative dashboard representing projected QS1-managed account behavior on the prop firm platform.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 24, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
          <div>
            <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9, color: '#2A3A4A', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 8 }}>Account Size</div>
            <div style={{ display: 'inline-flex', background: '#0A1628', border: '1px solid #162036', borderRadius: 10, overflow: 'hidden', padding: 3 }}>
              {ACCOUNTS.map((a, i) => (
                <button key={a.key} onClick={() => setAcctIdx(i)} style={{
                  background: acctIdx === i ? 'rgba(0,180,208,0.1)' : 'transparent',
                  border: acctIdx === i ? '1px solid rgba(0,180,208,0.2)' : '1px solid transparent',
                  color: acctIdx === i ? '#00B4D0' : '#2A3A4A', padding: '7px 20px', fontSize: 12,
                  fontFamily: '"JetBrains Mono", monospace', cursor: 'pointer', borderRadius: 7, transition: 'all 0.2s',
                }}>{a.size}</button>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9, color: '#2A3A4A', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 8 }}>Payout Cycle</div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <button onClick={() => setPayoutNum(p => Math.max(1, p - 1))} style={{ background: '#0A1628', border: '1px solid #162036', color: '#4A5568', borderRadius: 8, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontFamily: 'inherit', fontSize: 16 }}>−</button>
              <span style={{ fontFamily: '"JetBrains Mono", monospace', color: '#7A8899', fontSize: 14, minWidth: 70, textAlign: 'center' }}>Cycle {payoutNum}</span>
              <button onClick={() => setPayoutNum(p => Math.min(10, p + 1))} style={{ background: '#0A1628', border: '1px solid #162036', color: '#4A5568', borderRadius: 8, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontFamily: 'inherit', fontSize: 16 }}>+</button>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 14 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ padding: '24px', background: '#0A1628', border: '1px solid rgba(0,217,126,0.15)', borderRadius: 14, textAlign: 'center' }}>
              <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9, color: '#2A3A4A', letterSpacing: '0.14em', marginBottom: 16 }}>PROJECTED PAYOUT</div>
              <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 28, color: '#00D97E', fontWeight: 700, marginBottom: 6 }}>{fmtCur(payoutAvg)}</div>
              <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9, color: '#2A3A4A' }}>CYCLE {payoutNum} ESTIMATE</div>
            </div>
            <div style={{ padding: '20px', background: '#0A1628', border: '1px solid #162036', borderRadius: 14 }}>
              <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9, color: '#2A3A4A', letterSpacing: '0.14em', marginBottom: 16 }}>SYSTEM STATUS</div>
              {systemStatus.map(s => (
                <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid rgba(22,32,54,0.8)' }}>
                  <span style={{ fontSize: 11, color: '#2A3A4A' }}>{s.label}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontFamily: '"JetBrains Mono", monospace', fontSize: 10, color: '#00D97E' }}>
                    <span className="qs-dot" style={{ width: 5, height: 5, borderRadius: '50%', background: '#00D97E', boxShadow: '0 0 5px #00D97E', display: 'inline-block' }} />
                    {s.val}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
              {[
                { label: 'Monthly Gross', val: `$${acct.monthly.toLocaleString()}`, sub: 'est. per month' },
                { label: '6-Month Gross', val: `$${acct.sixMonth.toLocaleString()}`, sub: 'cumulative est.' },
                { label: 'Client Net 6M', val: `$${acct.clientNet.toLocaleString()}`, sub: 'after 30% fee' },
              ].map(m => (
                <div key={m.label} style={{ border: '1px solid #162036', borderRadius: 12, padding: '18px', background: '#0A1628' }}>
                  <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9, color: '#2A3A4A', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10 }}>{m.label}</div>
                  <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 18, color: '#A0AEC0', marginBottom: 4 }}>{m.val}</div>
                  <div style={{ fontSize: 10, color: '#1E2A3A' }}>{m.sub}</div>
                </div>
              ))}
            </div>

            <div style={{ border: '1px solid #162036', borderRadius: 14, overflow: 'hidden', background: '#0A1628', flex: 1 }}>
              <div style={{ padding: '16px 22px', borderBottom: '1px solid #162036', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9, color: '#2A3A4A', letterSpacing: '0.14em', textTransform: 'uppercase' }}>Payout History</span>
                <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9, color: '#1E2A3A', letterSpacing: '0.1em' }}>via Prop Firm Dashboard</span>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #0F1E32' }}>
                    {['Cycle', 'Date', 'Amount', 'Status'].map(h => (
                      <th key={h} style={{ padding: '10px 22px', textAlign: 'left', fontFamily: '"JetBrains Mono", monospace', color: '#1E2A3A', fontWeight: 400, fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentPayouts.map((r, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid rgba(15,30,50,0.8)' }}>
                      <td style={{ padding: '12px 22px', color: '#4A5568', fontFamily: '"JetBrains Mono", monospace' }}>{r.cycle}</td>
                      <td style={{ padding: '12px 22px', color: '#2A3A4A', fontFamily: '"JetBrains Mono", monospace' }}>{r.date}</td>
                      <td style={{ padding: '12px 22px', color: '#7A8899', fontFamily: '"JetBrains Mono", monospace' }}>{r.amount}</td>
                      <td style={{ padding: '12px 22px' }}>
                        <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9, letterSpacing: '0.1em', padding: '4px 10px', borderRadius: 100, background: r.status === 'Processed' ? 'rgba(0,217,126,0.08)' : 'rgba(0,180,208,0.08)', color: r.status === 'Processed' ? '#00D97E' : '#00B4D0', border: `1px solid ${r.status === 'Processed' ? 'rgba(0,217,126,0.2)' : 'rgba(0,180,208,0.2)'}` }}>
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

function WhyQS1() {
  const reasons = [
    { icon: '◷', title: 'Time Efficiency', body: 'No charts, no technical analysis, no market psychology. QS1 handles all execution autonomously.' },
    { icon: '◈', title: 'Institutional Infrastructure', body: 'Built around quantitative execution engines, multi-layer risk controls, and automated safety systems.' },
    { icon: '⊞', title: 'Scalability', body: 'Multiple funded accounts can be operated simultaneously across all three account tiers.' },
    { icon: '◎', title: 'Passive Exposure', body: 'Fully hands-free automated execution. Your account operates every session markets are open.' },
    { icon: '∿', title: 'Consistency Focused', body: 'Prioritizes sustainable, repeatable payouts over aggressive strategies that risk violating rules.' },
    { icon: '⬡', title: 'Professional Management', body: 'Managed by quantitative developers and systematic trading operators with institutional experience.' },
  ];

  return (
    <section id="qs-why" style={{ padding: '100px 48px', background: '#08101C' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ marginBottom: 56 }}>
          <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, color: '#00B4D0', letterSpacing: '0.2em' }}>// VALUE PROPOSITION</span>
          <h2 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: 42, fontWeight: 400, color: '#E8E0D0', marginTop: 16, maxWidth: 560, letterSpacing: '-0.01em' }}>
            Why Qualified Clients Choose QS1
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 40 }}>
          {reasons.map(r => (
            <div key={r.title} style={{ border: '1px solid #162036', borderRadius: 12, padding: '28px', background: '#0A1628', transition: 'border-color 0.25s' }}>
              <div style={{ fontSize: 20, marginBottom: 16, color: '#00B4D0', opacity: 0.7 }}>{r.icon}</div>
              <h3 style={{ fontSize: 14, fontWeight: 500, color: '#A0AEC0', marginBottom: 10 }}>{r.title}</h3>
              <p style={{ color: '#2A3A4A', fontSize: 13, lineHeight: 1.85 }}>{r.body}</p>
            </div>
          ))}
        </div>
        <div style={{ background: 'rgba(0,180,208,0.03)', border: '1px solid rgba(0,180,208,0.08)', borderRadius: 16, padding: '40px', textAlign: 'center' }}>
          <p style={{ color: '#2A3A4A', fontSize: 15, lineHeight: 2, maxWidth: 780, margin: '0 auto', fontWeight: 300 }}>
            QS1 was engineered for individuals seeking sophisticated algorithmic market exposure without becoming full-time traders — combining <span style={{ color: '#4A5568' }}>artificial intelligence</span>, <span style={{ color: '#4A5568' }}>quantitative research</span>, <span style={{ color: '#4A5568' }}>tick-data analysis</span>, and <span style={{ color: '#4A5568' }}>institutional risk frameworks</span>.
          </p>
          <div style={{ marginTop: 20, display: 'flex', justifyContent: 'center', gap: 40, flexWrap: 'wrap' }}>
            {['Private', 'Capacity-Limited', 'Selectively Offered'].map(t => (
              <span key={t} style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9, color: '#1E2A3A', letterSpacing: '0.2em', textTransform: 'uppercase' }}>{t}</span>
            ))}
          </div>
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
    ['Markets', 'qs-markets'], ['Chronicle', 'qs-chronicle'],
    ['Performance', 'qs-performance'], ['Process', 'qs-process'],
    ['Systems', 'qs-systems'], ['Access', 'qs-access'],
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
        .qs-a0 { animation: qs-up 0.9s ease both; }
        .qs-a1 { animation: qs-up 0.9s ease 0.14s both; }
        .qs-a2 { animation: qs-up 0.9s ease 0.26s both; }
        .qs-a3 { animation: qs-up 0.9s ease 0.40s both; }
        .qs-a4 { animation: qs-up 0.9s ease 0.54s both; }
        .qs-dot { animation: qs-pulse 2.4s ease-in-out infinite; }
        .qs-cursor { animation: qs-blink 1.1s step-end infinite; display: inline-block; color: #00D97E; }
        .qs-nav-link { background: none; border: none; color: #2A3A4A; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; cursor: pointer; transition: color 0.2s; padding: 4px 0; font-family: 'Inter', sans-serif; }
        .qs-nav-link:hover { color: #7A8899; }
        .qs-btn-green { display: inline-flex; align-items: center; gap: 8px; background: linear-gradient(135deg, #00D97E, #00B4D0); border: none; color: #060D16; border-radius: 10px; padding: 14px 36px; font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase; cursor: pointer; font-family: "JetBrains Mono", monospace; font-weight: 700; transition: all 0.25s; box-shadow: 0 0 40px rgba(0,217,126,0.15); }
        .qs-btn-green:hover { transform: translateY(-2px); box-shadow: 0 8px 40px rgba(0,217,126,0.3); }
        .qs-btn-outline { display: inline-flex; align-items: center; gap: 8px; background: transparent; border: 1px solid #162036; color: #4A5568; border-radius: 10px; padding: 14px 28px; font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase; cursor: pointer; font-family: "JetBrains Mono", monospace; transition: all 0.25s; }
        .qs-btn-outline:hover { border-color: rgba(0,217,126,0.3); color: #00D97E; }
        .qs-step-card:hover { background: #0C1A2C !important; }
        @media (max-width: 1024px) {
          .qs-nav-links { display: none !important; }
          .qs-hero-h1 { font-size: 36px !important; }
          .qs-grid-3 { grid-template-columns: 1fr !important; }
          .qs-section { padding: 72px 24px !important; }
          .qs-chronicle-inner { grid-template-columns: 1fr !important; }
          .qs-dashboard-grid { grid-template-columns: 1fr !important; }
          .qs-perf-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 640px) {
          .qs-hero-h1 { font-size: 28px !important; }
          .qs-stat-bar { grid-template-columns: 1fr 1fr !important; }
          .qs-perf-grid { grid-template-columns: 1fr !important; }
          .qs-payout-grid { grid-template-columns: 1fr 1fr !important; }
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
            <button onClick={openModal} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'transparent', border: '1px solid rgba(0,217,126,0.25)', color: '#00D97E', borderRadius: 8, padding: '8px 18px', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: '"JetBrains Mono", monospace', transition: 'all 0.2s' }}>
              Request Access
            </button>
          </div>
        </nav>

        <section id="qs-hero" style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: '120px 48px 80px' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(0,180,208,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0,180,208,0.025) 1px, transparent 1px)', backgroundSize: '80px 80px', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', top: '20%', left: '10%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,217,126,0.04) 0%, transparent 65%)', filter: 'blur(60px)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: '20%', right: '8%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,180,208,0.06) 0%, transparent 65%)', filter: 'blur(50px)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 200, background: 'linear-gradient(to top, #060D16, transparent)', pointerEvents: 'none' }} />

          <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: 880 }}>
            <div className="qs-a0" style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
              <QMark size={76} />
            </div>

            <div className="qs-a1" style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
              <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, color: '#00D97E', letterSpacing: '0.2em', background: 'rgba(0,217,126,0.06)', border: '1px solid rgba(0,217,126,0.18)', padding: '5px 16px', borderRadius: 100, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <span className="qs-dot" style={{ display: 'inline-block', width: 5, height: 5, borderRadius: '50%', background: '#00D97E', boxShadow: '0 0 6px #00D97E' }} />
                QS1 ACTIVE · QUANTITATIVE MARKET SYSTEMS
              </span>
            </div>

            <h1 className="qs-a2 qs-hero-h1" style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: 60, fontWeight: 400, letterSpacing: '-0.02em', lineHeight: 1.1, color: '#E8E0D0', marginBottom: 16 }}>
              Twenty trades.<br />
              Twenty winners.<br />
              <em style={{ color: '#4A5568', fontStyle: 'italic' }}>He placed none of them.</em>
            </h1>

            <p className="qs-a3" style={{ color: '#4A5568', fontSize: 16, lineHeight: 1.85, maxWidth: 560, margin: '0 auto 40px', fontWeight: 300 }}>
              QS1 is a fully autonomous algorithmic program executing Gold futures on your behalf. No decisions. No monitoring. No manual input. Just systematic results.
            </p>

            <div className="qs-a4" style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 56 }}>
              <button className="qs-btn-green" onClick={openModal}>Request Consideration</button>
              <button className="qs-btn-outline" onClick={() => go('qs-markets')}>View Live Markets</button>
            </div>

            <div className="qs-a4 qs-stat-bar" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, maxWidth: 780, margin: '0 auto', background: '#0F1E32', border: '1px solid #162036', borderRadius: 12, overflow: 'hidden' }}>
              {[
                { val: goldData && !goldData.error ? `$${fmt(goldData.price)}` : '---', label: 'GC Futures Live', color: pos ? '#00D97E' : '#FF3B5C' },
                { val: '$77,490', label: '6-Month Gross Peak' },
                { val: '70%', label: 'Client Payout Share' },
                { val: '100%', label: 'Automated Execution' },
              ].map((s, i) => (
                <div key={i} style={{ padding: '16px 12px', textAlign: 'center', borderRight: i < 3 ? '1px solid #0F1E32' : 'none', background: '#08101C' }}>
                  <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 15, fontWeight: 700, color: s.color ?? '#E8E0D0', marginBottom: 5 }}>{s.val}</div>
                  <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9, color: '#1E2A3A', letterSpacing: '0.12em', textTransform: 'uppercase' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, zIndex: 2 }}>
            <div style={{ width: 1, height: 40, background: 'linear-gradient(to bottom, transparent, rgba(0,217,126,0.4))' }} />
            <div className="qs-dot" style={{ width: 4, height: 4, borderRadius: '50%', background: '#00D97E', boxShadow: '0 0 6px #00D97E' }} />
          </div>
        </section>

        <section id="qs-markets" style={{ padding: '80px 48px', background: '#08101C', borderTop: '1px solid #0F1E32', borderBottom: '1px solid #0F1E32' }}>
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
                Twenty trades. Twenty winners.
              </h2>
              <p style={{ color: '#4A5568', fontSize: 14, lineHeight: 1.85, maxWidth: 540 }}>
                A single trading day. Every entry, every exit, every result — logged in real time. Zero human intervention at any stage.
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
              <StatCard value={70} suffix="%" label="Client Payout Share" />
              <StatCard value={100} suffix="%" label="Automated Execution" />
            </div>
          </div>
        </section>

        <section id="qs-systems" style={{ padding: '100px 48px', background: '#060D16' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ marginBottom: 56 }}>
              <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, color: '#00B4D0', letterSpacing: '0.2em' }}>// THE SYSTEM</span>
              <h2 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: 42, fontWeight: 400, color: '#E8E0D0', marginTop: 16, marginBottom: 16, maxWidth: 540, letterSpacing: '-0.01em' }}>
                Structured Quantitative Execution
              </h2>
              <p style={{ color: '#4A5568', fontSize: 15, lineHeight: 1.9, maxWidth: 580, fontWeight: 300 }}>
                QS1 is institutional-grade algorithmic infrastructure focused on Gold futures (GC/MGC). Multi-year quantitative research, machine learning models, non-discretionary execution.
              </p>
            </div>
            <div className="qs-grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: '#0F1E32', border: '1px solid #162036', borderRadius: 16, overflow: 'hidden', marginBottom: 40 }}>
              {[
                { n: '01', title: 'Market Microstructure Evaluation', body: 'Session-aware analysis of order flow dynamics, liquidity zones, and structural inflection points in Gold futures markets.' },
                { n: '02', title: 'Statistical Pattern Recognition', body: 'Neural architectures trained on tick-level historical data to identify environments with statistically observable characteristics.' },
                { n: '03', title: 'Volatility Regime Filtering', body: 'Multi-regime detection that adapts execution parameters based on prevailing volatility and correlation states.' },
                { n: '04', title: 'Dynamic Risk Architecture', body: 'Proprietary risk allocation with adaptive position sizing, drawdown controls, and funded account rule compliance.' },
                { n: '05', title: 'Automated Execution Engine', body: 'Fully automated trade identification, entry, and management. Zero manual intervention required at any stage.' },
                { n: '06', title: 'Platform Integration', body: 'Native connectivity to Tradovate, TradingView, and prop firm capital program infrastructure.' },
              ].map(item => (
                <div key={item.n} className="qs-step-card" style={{ padding: '32px 28px', background: '#060D16', borderRight: '1px solid #0F1E32', borderBottom: '1px solid #0F1E32', transition: 'background 0.2s' }}>
                  <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, color: '#1E2A3A', letterSpacing: '0.1em', marginBottom: 14 }}>{item.n}</div>
                  <h3 style={{ fontSize: 14, fontWeight: 500, color: '#A0AEC0', marginBottom: 10, lineHeight: 1.4 }}>{item.title}</h3>
                  <p style={{ color: '#2A3A4A', fontSize: 13, lineHeight: 1.85 }}>{item.body}</p>
                </div>
              ))}
            </div>
            <div style={{ border: '1px solid rgba(255,59,92,0.07)', borderRadius: 10, padding: '16px 22px', background: 'rgba(255,59,92,0.02)' }}>
              <p style={{ color: '#2A3A4A', fontSize: 12, lineHeight: 1.85 }}>
                <span style={{ color: '#3A3A4A', fontWeight: 500 }}>Risk Disclosure:</span> All trading involves substantial risk of loss. Past performance does not indicate future results. QS1 does not predict markets or guarantee specific outcomes. Participation is restricted to qualified individuals only.
              </p>
            </div>
          </div>
        </section>

        <PerformanceSection />
        <HowItWorks onOpen={openModal} />
        <AccountDashboard />
        <WhyQS1 />

        <section id="qs-infrastructure" style={{ padding: '100px 48px', background: '#060D16' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ marginBottom: 56 }}>
              <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, color: '#00B4D0', letterSpacing: '0.2em' }}>// PARTICIPANT PERSPECTIVES</span>
              <h2 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: 42, fontWeight: 400, color: '#E8E0D0', marginTop: 16, letterSpacing: '-0.01em' }}>
                Participant Perspectives
              </h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 48 }}>
              {[
                { q: 'After years of losing money trading on my own, Quantara has been a real game changer. My account is up nicely over the last 8 months and I barely have to do anything. The consistent profitable months are exactly what they said.', name: 'Michael R. T.', role: 'Chicago, Illinois' },
                { q: "I was pretty skeptical at first, but it's been solid. My account has been growing steadily and the team is very transparent. I check in every couple weeks and everything looks good. Definitely glad I gave them a shot.", name: 'Sarah P.', role: 'Austin, Texas' },
                { q: "Finally a system that works without me staring at screens all day. The returns have been better than I expected and it's all handled professionally. No complaints so far. Nice to have something that actually delivers.", name: 'David C.', role: 'Scottsdale, Arizona' },
                { q: "Quantara has made trading way less stressful for me. I just let them do their thing and the results have been consistent. The numbers they show are real. I'm really pleased with how it's going.", name: 'Rachel M.', role: 'Miami, Florida' },
              ].map((t, i) => (
                <div key={i} style={{ border: '1px solid #162036', borderRadius: 14, padding: '32px', background: '#0A1628' }}>
                  <div style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: 36, lineHeight: 1, marginBottom: 18, color: 'rgba(0,180,208,0.2)' }}>&ldquo;</div>
                  <p style={{ color: '#4A5568', fontSize: 14, lineHeight: 1.9, fontWeight: 300, marginBottom: 24, fontStyle: 'italic' }}>{t.q}</p>
                  <div style={{ borderTop: '1px solid #162036', paddingTop: 16 }}>
                    <div style={{ fontSize: 13, color: '#7A8899', fontWeight: 400 }}>{t.name}</div>
                    <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, color: '#2A3A4A', marginTop: 3, letterSpacing: '0.06em' }}>{t.role}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ textAlign: 'center' }}>
              <button className="qs-btn-green" onClick={openModal}>Request Consideration</button>
            </div>
          </div>
        </section>

        <section id="qs-considerations" style={{ padding: '100px 48px', background: '#08101C' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ marginBottom: 56 }}>
              <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, color: '#00B4D0', letterSpacing: '0.2em' }}>// PARAMETERS</span>
              <h2 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: 42, fontWeight: 400, color: '#E8E0D0', marginTop: 16, letterSpacing: '-0.01em' }}>Program Considerations</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, marginBottom: 40 }}>
              <div>
                <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9, color: '#2A3A4A', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 20 }}>Program Structure</div>
                {[
                  ['Structure', 'Private, invite-only initiative'],
                  ['Focus', 'Gold futures (GC/MGC)'],
                  ['AI Engine', 'QS1 v3.2 (Quantitative ML)'],
                  ['Integration', 'Prop Firm + Tradovate'],
                  ['Fee Model', '30% on successful payouts only'],
                  ['Access', 'Qualified participants only'],
                  ['Operation', 'Fully automated, zero manual input'],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid rgba(15,30,50,0.8)', gap: 16 }}>
                    <span style={{ color: '#2A3A4A', fontSize: 13 }}>{k}</span>
                    <span style={{ color: '#4A5568', fontSize: 13, textAlign: 'right', fontFamily: k === 'Fee Model' ? '"JetBrains Mono", monospace' : 'inherit' }}>{v}</span>
                  </div>
                ))}
              </div>
              <div>
                <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9, color: '#2A3A4A', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 20 }}>Account Parameters</div>
                <div style={{ border: '1px solid rgba(0,180,208,0.1)', borderRadius: 12, overflow: 'hidden', marginBottom: 18, background: '#0A1628' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #162036' }}>
                        {['Account Size', 'Max / Cycle', 'Client / QS1'].map(h => (
                          <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontFamily: '"JetBrains Mono", monospace', color: '#2A3A4A', fontWeight: 400, fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[['$50,000','$1,250–$1,500','70% / 30%'],['$100,000','$2,500–$3,000','70% / 30%'],['$150,000','$3,000–$3,500','70% / 30%']].map(([sz,mp,sp]) => (
                        <tr key={sz} style={{ borderBottom: '1px solid rgba(15,30,50,0.8)' }}>
                          <td style={{ padding: '12px 16px', fontFamily: '"JetBrains Mono", monospace', color: '#A0AEC0' }}>{sz}</td>
                          <td style={{ padding: '12px 16px', fontFamily: '"JetBrains Mono", monospace', color: '#4A5568' }}>{mp}</td>
                          <td style={{ padding: '12px 16px', fontFamily: '"JetBrains Mono", monospace', color: '#2A3A4A' }}>{sp}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div style={{ padding: '16px 18px', border: '1px solid rgba(255,59,92,0.1)', borderRadius: 10, background: 'rgba(255,59,92,0.025)' }}>
                  <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9, color: '#3A2028', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 6 }}>Risk Disclosure</div>
                  <p style={{ color: '#2A2028', fontSize: 12, lineHeight: 1.8 }}>All trading involves substantial risk of loss. Past performance does not indicate future results. No specific outcomes are guaranteed.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="qs-access" style={{ padding: '140px 48px', background: '#060D16', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 800, height: 800, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,217,126,0.04) 0%, transparent 65%)', pointerEvents: 'none' }} />
          <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
            <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, color: '#00B4D0', letterSpacing: '0.2em' }}>// PRIVATE PROGRAM</span>
            <h2 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: 48, fontWeight: 400, letterSpacing: '-0.02em', marginTop: 20, marginBottom: 20, color: '#E8E0D0', lineHeight: 1.1 }}>
              Request Consideration
            </h2>
            <p style={{ color: '#4A5568', fontSize: 15, lineHeight: 1.9, marginBottom: 48, fontWeight: 300 }}>
              Quantara System One operates as a private, invite-only initiative. QS1-managed accounts are capacity-limited and offered selectively. All information submitted is treated with strict confidentiality.
            </p>
            <button className="qs-btn-green" onClick={openModal} style={{ padding: '18px 56px', fontSize: 12, borderRadius: 12 }}>
              Begin Your Application
            </button>
            <p style={{ fontFamily: '"JetBrains Mono", monospace', color: '#1E2A3A', fontSize: 10, marginTop: 24, letterSpacing: '0.08em' }}>
              Qualified applicants only · Private &amp; Confidential · No solicitation
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
                  Quantitative market systems powered by QS1. Structured algorithmic approaches to Gold futures for qualified participants seeking systematic, hands-free market exposure.
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9, color: '#1E2A3A', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 12 }}>Private Program</div>
                <p style={{ color: '#1E2A3A', fontSize: 12, lineHeight: 2 }}>
                  Qualified inquiries only.<br />All communications are confidential.<br />
                  <span style={{ color: '#2A3A4A' }}>quantarasystems.com</span>
                </p>
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
          <button className="qs-btn-green" onClick={openModal} style={{ padding: '11px 22px', fontSize: 10, borderRadius: 9 }}>
            Request Access
          </button>
        </div>
      </div>
    </>
  );
}
