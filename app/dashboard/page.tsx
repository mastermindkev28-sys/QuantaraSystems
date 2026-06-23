'use client';

import { useEffect, useMemo, useRef, useState, useCallback } from 'react';

// ─── Types ──────────────────────────────────────────────────────────────────
interface GoldPoint { t: number; p: number; }
interface GoldData {
  price: number; prev: number; change: number; changePct: number;
  high: number; low: number; volume: number; state: string;
  points: GoldPoint[]; ts: number; error?: boolean;
}

// ─── Shared atoms ─────────────────────────────────────────────────────────────
function QMark({ size = 50, glow = false }: { size?: number; glow?: boolean }) {
  return (
    <div style={glow ? { filter: 'drop-shadow(0 0 20px rgba(245,158,11,0.25)) drop-shadow(0 0 40px rgba(245,158,11,0.1))' } : {}}>
      <svg width={size} height={size} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="dqg-a" x1="20" y1="10" x2="180" y2="190" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ECECEC" /><stop offset="22%" stopColor="#F8F8F8" />
            <stop offset="45%" stopColor="#B8B8B8" /><stop offset="68%" stopColor="#E4E4E4" />
            <stop offset="100%" stopColor="#8C8C8C" />
          </linearGradient>
          <linearGradient id="dqg-b" x1="180" y1="20" x2="30" y2="180" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#D8D8D8" /><stop offset="40%" stopColor="#F2F2F2" />
            <stop offset="100%" stopColor="#9A9A9A" />
          </linearGradient>
          <clipPath id="dqg-clip"><circle cx="100" cy="97" r="71" /></clipPath>
        </defs>
        <circle cx="100" cy="97" r="69" stroke="url(#dqg-a)" strokeWidth="13" />
        <line x1="55" y1="156" x2="148" y2="68" stroke="url(#dqg-a)" strokeWidth="13" strokeLinecap="round" />
        <line x1="140" y1="64" x2="194" y2="148" stroke="url(#dqg-a)" strokeWidth="13" strokeLinecap="round" />
        <line x1="100" y1="30" x2="100" y2="118" stroke="url(#dqg-b)" strokeWidth="5.5" strokeLinecap="round" />
        {Array.from({ length: 13 }, (_, i) => (
          <line key={i} x1={40 + i * 4.5} y1={172 - i * 1.5} x2={78 + i * 3.8} y2={113 - i * 7.5}
            stroke="#B8B8B8" strokeWidth="1.1" strokeLinecap="round"
            opacity={0.12 + i * 0.038} clipPath="url(#dqg-clip)" />
        ))}
      </svg>
    </div>
  );
}

function Badge({ children, tone = 'gold' }: { children: React.ReactNode; tone?: 'gold' | 'green' | 'blue' }) {
  const c = tone === 'green' ? '#34D399' : tone === 'blue' ? '#A3D9FF' : '#F59E0B';
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 7,
      background: tone === 'green' ? 'rgba(52,211,153,0.06)' : tone === 'blue' ? 'rgba(163,217,255,0.06)' : 'rgba(245,158,11,0.06)',
      border: `1px solid ${c}2E`,
      borderRadius: 100, padding: '5px 14px',
      fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: c,
    }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: c, boxShadow: `0 0 8px ${c}`, animation: 'qs-pulse 2s ease-in-out infinite', display: 'inline-block' }} />
      {children}
    </span>
  );
}

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
  const id = `dsl-${positive ? 'g' : 'r'}-${width}`;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: 'block' }}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.28} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={fillD} fill={`url(#${id})`} />
      <path d={pathD} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ filter: `drop-shadow(0 0 4px ${color}66)` }} />
    </svg>
  );
}

function Ring({ pct, size = 132, label, value, color = '#F59E0B' }: { pct: number; size?: number; label: string; value: string; color?: string }) {
  const r = size / 2 - 11; const circ = 2 * Math.PI * r;
  const offset = circ - (Math.min(pct, 100) / 100) * circ;
  const id = `dring-${label.replace(/\s/g, '')}-${size}`;
  return (
    <svg width={size} height={size} style={{ display: 'block' }}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={color} /><stop offset="100%" stopColor="#FCD34D" />
        </linearGradient>
      </defs>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.045)" strokeWidth="9" />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={`url(#${id})`} strokeWidth="9"
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: 'stroke-dashoffset 1.1s cubic-bezier(0.34,1.56,0.64,1)', filter: `drop-shadow(0 0 6px ${color}88)` }} />
      <text x={size / 2} y={size / 2 - 4} textAnchor="middle" fill="#E6E6E6" fontSize="22" fontWeight="200" fontFamily="Inter,sans-serif">{value}</text>
      <text x={size / 2} y={size / 2 + 15} textAnchor="middle" fill="#3A3A3A" fontSize="8" fontFamily="Inter,sans-serif" letterSpacing="2">{label}</text>
    </svg>
  );
}

// ─── Data model ───────────────────────────────────────────────────────────────
const fmtUSD = (n: number, dp = 0) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: dp, maximumFractionDigits: dp });
const fmtNum = (n: number, dp = 2) => n.toLocaleString('en-US', { minimumFractionDigits: dp, maximumFractionDigits: dp });

// Lucid funded accounts under QS1 management.
// Generated deterministically (seeded) so server and client render identically.
type AcctStatus = 'Trading' | 'Payout Ready' | 'Evaluation';
interface LucidAccount {
  id: string; size: number; balance: number; todayPnL: number; target: number;
  progress: number; drawdownUsed: number; payoutsTaken: number; status: AcctStatus; strat: string;
}
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const ACCOUNT_COUNT = 120;
const LUCID_ACCOUNTS: LucidAccount[] = (() => {
  const rand = mulberry32(0x51A17E5);
  const perTier: Record<string, number> = {};
  const out: LucidAccount[] = [];
  for (let i = 0; i < ACCOUNT_COUNT; i++) {
    const r = rand();
    const size = r < 0.45 ? 50000 : r < 0.78 ? 100000 : 150000;
    const k = `${size / 1000}`;
    perTier[k] = (perTier[k] || 0) + 1;
    const num = String(perTier[k]).padStart(2, '0');
    const target = Math.round(size * 0.06);
    const progress = Math.round(5 + rand() * 91);
    const status: AcctStatus = progress >= 88 ? 'Payout Ready' : progress < 12 ? 'Evaluation' : 'Trading';
    const balance = size + Math.round(target * (progress / 100));
    const strat = size === 150000 ? 'GC' : size === 100000 ? (rand() < 0.5 ? 'GC' : 'MGC') : 'MGC';
    const ddBase = 2 + rand() * 30;
    const drawdownUsed = Math.round(status === 'Payout Ready' ? Math.max(ddBase, 20) : ddBase);
    const todayPnL = status === 'Evaluation'
      ? Math.round((rand() * 2 - 0.6) * 120)
      : Math.round((rand() * 2.2 - 0.8) * (size / 100));
    const payoutsTaken = status === 'Evaluation' ? 0 : Math.min(6, Math.floor(progress / 16) + (rand() < 0.4 ? 1 : 0));
    out.push({ id: `LCD-${k}K-${num}`, size, balance, todayPnL, target, progress, drawdownUsed, payoutsTaken, status, strat });
  }
  return out;
})();

// The 6 strategies QS1 aligns before authorizing a trade
const STRATEGIES = [
  { key: 'liq', name: 'Liquidity Sweep Reversal', weight: 22, bias: 'Long', agree: true, note: 'Sell-side liquidity swept, reclaim confirmed' },
  { key: 'ob', name: 'Order Block Continuation', weight: 18, bias: 'Long', agree: true, note: 'Bullish OB respected on retest' },
  { key: 'smc', name: 'Smart-Money Structure (SMC)', weight: 20, bias: 'Long', agree: true, note: 'BOS + CHoCH alignment on M5' },
  { key: 'vwap', name: 'VWAP Mean Reversion', weight: 14, bias: 'Neutral', agree: false, note: 'Price extended +1.2σ from VWAP' },
  { key: 'mom', name: 'Momentum Breakout', weight: 14, bias: 'Long', agree: true, note: 'Delta + volume thrust confirmed' },
  { key: 'trend', name: 'Trend / EMA Confluence', weight: 12, bias: 'Long', agree: true, note: 'Price > 20/50/200 EMA stack' },
];

// The 6-step pre-trade verification gates the bot clears before execution
const GATES = [
  { n: 1, title: 'Liquidity & Microstructure Scan', detail: 'Order-flow, liquidity pools and structural inflection mapped on GC/MGC.' },
  { n: 2, title: 'Statistical Pattern Confirmation', detail: 'Neural model scores the setup against tick-level historical archetypes.' },
  { n: 3, title: 'Volatility Regime Filter', detail: 'Current regime validated against permitted execution envelope.' },
  { n: 4, title: 'Multi-Strategy Confluence', detail: 'Independent strategies must agree above the confluence threshold.' },
  { n: 5, title: 'Risk & Funded-Rule Compliance', detail: 'Position size, daily loss and trailing drawdown checked vs. Lucid rules.' },
  { n: 6, title: 'Execution Authorization', detail: 'Signed order routed to Tradovate. Brackets + stop attached atomically.' },
];

// Recent trade log across Lucid accounts
const TRADES = [
  { time: '14:32:08', acct: 'LCD-150K-04', sym: 'GC', dir: 'Long', entry: 3384.6, exit: 3391.2, ticks: 66, pnl: 1320, r: 2.1, strat: ['Liq Sweep', 'SMC', 'Momentum'], result: 'Win' },
  { time: '13:47:51', acct: 'LCD-100K-11', sym: 'GC', dir: 'Long', entry: 3381.1, exit: 3385.4, ticks: 43, pnl: 430, r: 1.4, strat: ['Order Block', 'Trend'], result: 'Win' },
  { time: '12:58:19', acct: 'LCD-150K-02', sym: 'GC', dir: 'Short', entry: 3389.8, exit: 3386.2, ticks: 36, pnl: 720, r: 1.2, strat: ['VWAP', 'SMC'], result: 'Win' },
  { time: '11:40:33', acct: 'LCD-100K-07', sym: 'MGC', dir: 'Long', entry: 3376.4, exit: 3374.9, ticks: -15, pnl: -150, r: -0.6, strat: ['Momentum'], result: 'Loss' },
  { time: '10:22:47', acct: 'LCD-50K-19', sym: 'MGC', dir: 'Long', entry: 3372.0, exit: 3377.5, ticks: 55, pnl: 275, r: 1.8, strat: ['Liq Sweep', 'Trend', 'SMC'], result: 'Win' },
  { time: '09:51:12', acct: 'LCD-150K-04', sym: 'GC', dir: 'Short', entry: 3380.2, exit: 3378.9, ticks: 13, pnl: 260, r: 0.5, strat: ['VWAP'], result: 'Win' },
  { time: '09:18:05', acct: 'LCD-100K-11', sym: 'GC', dir: 'Long', entry: 3369.7, exit: 3375.1, ticks: 54, pnl: 540, r: 1.7, strat: ['Order Block', 'Momentum', 'SMC'], result: 'Win' },
  { time: '08:46:29', acct: 'LCD-50K-19', sym: 'MGC', dir: 'Short', entry: 3371.5, exit: 3372.8, ticks: -13, pnl: -65, r: -0.4, strat: ['Trend'], result: 'Loss' },
];

// Payout history & schedule
const PAYOUTS = [
  { cycle: 'Cycle 12', date: '2026-06-09', acct: 'LCD-150K-02', gross: 3500, net: 2450, status: 'Paid' as const },
  { cycle: 'Cycle 11', date: '2026-05-22', acct: 'LCD-150K-04', gross: 3200, net: 2240, status: 'Paid' as const },
  { cycle: 'Cycle 10', date: '2026-05-08', acct: 'LCD-100K-11', gross: 2800, net: 1960, status: 'Paid' as const },
  { cycle: 'Cycle 13', date: '2026-06-23', acct: 'LCD-150K-02', gross: 3500, net: 2450, status: 'Processing' as const },
  { cycle: 'Cycle 09', date: '2026-04-24', acct: 'LCD-100K-07', gross: 2500, net: 1750, status: 'Paid' as const },
  { cycle: 'Cycle 14', date: 'Est. 2026-07-04', acct: 'LCD-100K-11', gross: 3000, net: 2100, status: 'Scheduled' as const },
];

// ─── KPI Card ────────────────────────────────────────────────────────────────
function Kpi({ label, value, sub, tone = 'silver' }: { label: string; value: string; sub?: string; tone?: 'gold' | 'green' | 'silver' }) {
  const color = tone === 'gold' ? '#F59E0B' : tone === 'green' ? '#34D399' : '#C8C8C8';
  return (
    <div style={{ padding: '22px 24px', background: 'linear-gradient(135deg,#0D0D0D,#0F1018)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14 }}>
      <div style={{ fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#2E2E2E', marginBottom: 12 }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 200, letterSpacing: '-0.02em', color, fontVariantNumeric: 'tabular-nums' }}>{value}</div>
      {sub && <div style={{ fontSize: 10, color: '#3A3A3A', marginTop: 6 }}>{sub}</div>}
    </div>
  );
}

// ─── Account Progress ─────────────────────────────────────────────────────────
function AccountProgress() {
  const statusTone: Record<string, { c: string; bg: string }> = {
    'Trading': { c: '#34D399', bg: 'rgba(52,211,153,0.08)' },
    'Payout Ready': { c: '#F59E0B', bg: 'rgba(245,158,11,0.08)' },
    'Evaluation': { c: '#A3D9FF', bg: 'rgba(163,217,255,0.08)' },
  };
  const visible = LUCID_ACCOUNTS.slice(0, 12);
  return (
    <>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }} className="d-acct-grid">
      {visible.map(a => {
        const pos = a.todayPnL >= 0;
        const t = statusTone[a.status];
        return (
          <div key={a.id} className="d-card" style={{ padding: '22px', background: 'linear-gradient(135deg,#0D0D0D,#0F1018)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, transition: 'all 0.25s' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}>
              <div>
                <div style={{ fontSize: 13, color: '#C8C8C8', fontWeight: 400, letterSpacing: '0.02em' }}>{a.id}</div>
                <div style={{ fontSize: 9, color: '#2E2E2E', letterSpacing: '0.14em', textTransform: 'uppercase', marginTop: 4 }}>Lucid · {a.strat} · {fmtUSD(a.size)}</div>
              </div>
              <span style={{ fontSize: 8.5, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '4px 9px', borderRadius: 100, background: t.bg, color: t.c, border: `1px solid ${t.c}30` }}>{a.status}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
              <div style={{ fontSize: 24, fontWeight: 200, color: '#E6E6E6', letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>{fmtUSD(a.balance)}</div>
              <div style={{ fontSize: 12, color: pos ? '#34D399' : '#F87171', fontVariantNumeric: 'tabular-nums' }}>{pos ? '+' : ''}{fmtUSD(a.todayPnL)} today</div>
            </div>
            <div style={{ marginBottom: 6, display: 'flex', justifyContent: 'space-between', fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#2E2E2E' }}>
              <span>Profit target</span><span style={{ color: '#6A6A6A' }}>{a.progress}%</span>
            </div>
            <div style={{ height: 5, background: 'rgba(255,255,255,0.04)', borderRadius: 3, overflow: 'hidden', marginBottom: 14 }}>
              <div style={{ height: '100%', width: `${a.progress}%`, background: 'linear-gradient(90deg,#F59E0B,#FCD34D)', borderRadius: 3, boxShadow: '0 0 8px rgba(245,158,11,0.4)', transition: 'width 0.9s ease' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#3A3A3A' }}>
              <span>Drawdown used <span style={{ color: a.drawdownUsed > 28 ? '#F59E0B' : '#5A5A5A' }}>{a.drawdownUsed}%</span></span>
              <span>{a.payoutsTaken} payouts</span>
            </div>
          </div>
        );
      })}
    </div>
    <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, padding: '12px 18px', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 10, background: 'rgba(255,255,255,0.012)' }}>
      <span style={{ fontSize: 11, color: '#3A3A3A' }}>Showing <span style={{ color: '#8A8A8A' }}>{visible.length}</span> of <span style={{ color: '#F59E0B' }}>{LUCID_ACCOUNTS.length}</span> accounts under management — full book available in the member portal.</span>
      <span style={{ fontSize: 10, color: '#2E2E2E', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{LUCID_ACCOUNTS.filter(a => a.size === 150000).length} × 150K · {LUCID_ACCOUNTS.filter(a => a.size === 100000).length} × 100K · {LUCID_ACCOUNTS.filter(a => a.size === 50000).length} × 50K</span>
    </div>
    </>
  );
}

// ─── Pre-Trade Verification Pipeline (animated) ───────────────────────────────
function VerificationPipeline({ confluence }: { confluence: number }) {
  // active = index currently scanning; passed = how many cleared
  const [stage, setStage] = useState(0); // 0..7  (6 = authorized flash, 7 = reset)
  useEffect(() => {
    const iv = setInterval(() => setStage(s => (s >= 8 ? 0 : s + 1)), 900);
    return () => clearInterval(iv);
  }, []);
  const authorized = stage >= 7;
  return (
    <div style={{ padding: '26px', background: 'linear-gradient(135deg,#0D0D0D,#0F1018)', border: '1px solid rgba(245,158,11,0.1)', borderRadius: 16, boxShadow: '0 0 50px rgba(245,158,11,0.03)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
        <Badge>Pre-Trade Verification</Badge>
        <span style={{ fontSize: 9, color: '#2E2E2E', letterSpacing: '0.12em', textTransform: 'uppercase' }}>6 gates · live</span>
      </div>
      <h3 style={{ fontSize: 19, fontWeight: 200, color: '#D0D0D0', letterSpacing: '-0.02em', marginBottom: 4 }}>Every trade clears six gates</h3>
      <p style={{ fontSize: 11.5, color: '#3A3A3A', lineHeight: 1.7, marginBottom: 22 }}>QS1 never sends an order until all six checks pass in sequence. A single failed gate aborts the setup.</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {GATES.map((g, i) => {
          const done = stage > i || authorized;
          const active = stage === i && !authorized;
          const c = done ? '#34D399' : active ? '#F59E0B' : '#222';
          return (
            <div key={g.n} style={{
              display: 'flex', gap: 14, alignItems: 'flex-start', padding: '12px 14px', borderRadius: 10,
              background: active ? 'rgba(245,158,11,0.05)' : done ? 'rgba(52,211,153,0.03)' : 'rgba(255,255,255,0.015)',
              border: `1px solid ${active ? 'rgba(245,158,11,0.22)' : done ? 'rgba(52,211,153,0.12)' : 'rgba(255,255,255,0.04)'}`,
              transition: 'all 0.3s',
            }}>
              <div style={{
                width: 26, height: 26, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: done ? 'rgba(52,211,153,0.12)' : active ? 'rgba(245,158,11,0.12)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${c}${done || active ? '55' : '00'}`, color: c, fontSize: 12,
                boxShadow: active ? '0 0 14px rgba(245,158,11,0.3)' : 'none', transition: 'all 0.3s',
              }}>
                {done ? '✓' : active ? <span className="d-spin" style={{ display: 'inline-block' }}>◜</span> : g.n}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                  <span style={{ fontSize: 12.5, color: done ? '#9A9A9A' : active ? '#E0C080' : '#4A4A4A', fontWeight: 400 }}>{g.title}</span>
                  <span style={{ fontSize: 8.5, letterSpacing: '0.1em', textTransform: 'uppercase', color: c, alignSelf: 'center', whiteSpace: 'nowrap' }}>
                    {done ? 'Passed' : active ? 'Checking' : 'Queued'}
                  </span>
                </div>
                <div style={{ fontSize: 10.5, color: '#2E2E2E', lineHeight: 1.6, marginTop: 3 }}>
                  {g.n === 4 ? `${g.detail} (${confluence}% now)` : g.detail}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{
        marginTop: 16, padding: '14px 18px', borderRadius: 10, textAlign: 'center',
        background: authorized ? 'rgba(52,211,153,0.08)' : 'rgba(255,255,255,0.015)',
        border: `1px solid ${authorized ? 'rgba(52,211,153,0.3)' : 'rgba(255,255,255,0.04)'}`,
        transition: 'all 0.3s',
      }}>
        <span style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: authorized ? '#34D399' : '#333' }}>
          {authorized ? '✓ Trade Authorized — Order Routed' : 'Awaiting full confluence…'}
        </span>
      </div>
    </div>
  );
}

// ─── Multi-Strategy Alignment ─────────────────────────────────────────────────
function StrategyAlignment({ confluence }: { confluence: number }) {
  return (
    <div style={{ padding: '26px', background: 'linear-gradient(135deg,#0D0D0D,#0F1018)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
        <Badge tone="blue">Strategy Confluence</Badge>
        <span style={{ fontSize: 9, color: '#2E2E2E', letterSpacing: '0.12em', textTransform: 'uppercase' }}>6 engines · 1 verdict</span>
      </div>
      <div style={{ display: 'flex', gap: 28, alignItems: 'center', flexWrap: 'wrap' }}>
        <Ring pct={confluence} value={`${confluence}%`} label="CONFLUENCE" color="#F59E0B" />
        <div style={{ flex: 1, minWidth: 260 }}>
          <p style={{ fontSize: 12, color: '#3A3A3A', lineHeight: 1.75, marginBottom: 16 }}>
            QS1 runs six independent strategies in parallel. A trade only fires when their weighted agreement exceeds the confluence threshold — aligning multiple edges into one decision.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {STRATEGIES.map(s => {
              const bc = s.bias === 'Long' ? '#34D399' : s.bias === 'Short' ? '#F87171' : '#888';
              return (
                <div key={s.key}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.agree ? '#34D399' : '#333', boxShadow: s.agree ? '0 0 6px #34D399' : 'none' }} />
                      <span style={{ fontSize: 12, color: s.agree ? '#9A9A9A' : '#4A4A4A' }}>{s.name}</span>
                    </span>
                    <span style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <span style={{ fontSize: 9, color: bc, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{s.bias}</span>
                      <span style={{ fontSize: 10, color: '#3A3A3A', fontVariantNumeric: 'tabular-nums', minWidth: 28, textAlign: 'right' }}>{s.weight}%</span>
                    </span>
                  </div>
                  <div style={{ height: 3, background: 'rgba(255,255,255,0.04)', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${s.agree ? s.weight * 4 : s.weight * 1.4}%`, maxWidth: '100%', background: s.agree ? 'linear-gradient(90deg,#F59E0B,#FCD34D)' : 'rgba(255,255,255,0.08)', borderRadius: 2, transition: 'width 0.9s ease' }} />
                  </div>
                  <div style={{ fontSize: 9.5, color: '#262626', marginTop: 4 }}>{s.note}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Trade Log ────────────────────────────────────────────────────────────────
function TradeLog() {
  return (
    <div style={{ border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, overflow: 'hidden', background: '#0C0C0D' }}>
      <div style={{ padding: '18px 24px', borderBottom: '1px solid rgba(255,255,255,0.04)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
        <Badge tone="green">Live Trade Log · Lucid Accounts</Badge>
        <span style={{ fontSize: 9, color: '#2E2E2E', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Session 2026-06-23 · via Tradovate</span>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5, minWidth: 820 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              {['Time', 'Account', 'Sym', 'Dir', 'Entry', 'Exit', 'Ticks', 'Strategies Aligned', 'P&L', 'R', ''].map(h => (
                <th key={h} style={{ padding: '11px 18px', textAlign: 'left', color: '#252525', fontWeight: 500, fontSize: 8.5, letterSpacing: '0.14em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TRADES.map((t, i) => {
              const win = t.result === 'Win';
              return (
                <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.025)' }} className="d-row">
                  <td style={{ padding: '13px 18px', color: '#484848', fontVariantNumeric: 'tabular-nums' }}>{t.time}</td>
                  <td style={{ padding: '13px 18px', color: '#8A8A8A' }}>{t.acct}</td>
                  <td style={{ padding: '13px 18px', color: '#6A6A6A' }}>{t.sym}</td>
                  <td style={{ padding: '13px 18px' }}>
                    <span style={{ fontSize: 10, color: t.dir === 'Long' ? '#34D399' : '#F87171', letterSpacing: '0.06em' }}>{t.dir === 'Long' ? '▲' : '▼'} {t.dir}</span>
                  </td>
                  <td style={{ padding: '13px 18px', color: '#5A5A5A', fontVariantNumeric: 'tabular-nums' }}>{fmtNum(t.entry, 1)}</td>
                  <td style={{ padding: '13px 18px', color: '#5A5A5A', fontVariantNumeric: 'tabular-nums' }}>{fmtNum(t.exit, 1)}</td>
                  <td style={{ padding: '13px 18px', color: t.ticks >= 0 ? '#6A8A6A' : '#8A5A5A', fontVariantNumeric: 'tabular-nums' }}>{t.ticks >= 0 ? '+' : ''}{t.ticks}</td>
                  <td style={{ padding: '13px 18px' }}>
                    <span style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                      {t.strat.map(s => (
                        <span key={s} style={{ fontSize: 8.5, color: '#6A6A50', background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.1)', borderRadius: 5, padding: '2px 7px', whiteSpace: 'nowrap' }}>{s}</span>
                      ))}
                    </span>
                  </td>
                  <td style={{ padding: '13px 18px', color: win ? '#34D399' : '#F87171', fontVariantNumeric: 'tabular-nums', fontWeight: 400 }}>{t.pnl >= 0 ? '+' : ''}{fmtUSD(t.pnl)}</td>
                  <td style={{ padding: '13px 18px', color: t.r >= 0 ? '#6A8A6A' : '#8A5A5A', fontVariantNumeric: 'tabular-nums' }}>{t.r >= 0 ? '+' : ''}{t.r}R</td>
                  <td style={{ padding: '13px 18px' }}>
                    <span style={{ fontSize: 8.5, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '3px 9px', borderRadius: 100, background: win ? 'rgba(52,211,153,0.08)' : 'rgba(248,113,113,0.08)', color: win ? '#34D399' : '#F87171', border: `1px solid ${win ? 'rgba(52,211,153,0.2)' : 'rgba(248,113,113,0.2)'}` }}>{t.result}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Payout Tracker ───────────────────────────────────────────────────────────
function PayoutTracker() {
  const paidNet = PAYOUTS.filter(p => p.status === 'Paid').reduce((s, p) => s + p.net, 0);
  const pendingNet = PAYOUTS.filter(p => p.status !== 'Paid').reduce((s, p) => s + p.net, 0);
  const tone: Record<string, { c: string; bg: string }> = {
    'Paid': { c: '#34D399', bg: 'rgba(52,211,153,0.08)' },
    'Processing': { c: '#F59E0B', bg: 'rgba(245,158,11,0.08)' },
    'Scheduled': { c: '#A3D9FF', bg: 'rgba(163,217,255,0.08)' },
  };
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 16 }} className="d-payout-grid">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ padding: '26px', background: 'linear-gradient(135deg,#0D0D0D,#0F1018)', border: '1px solid rgba(245,158,11,0.1)', borderRadius: 16, boxShadow: '0 0 40px rgba(245,158,11,0.03)' }}>
          <div style={{ fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#2E2E2E', marginBottom: 14 }}>Client Net Paid (YTD)</div>
          <div style={{ fontSize: 32, fontWeight: 200, letterSpacing: '-0.02em', color: '#F59E0B', fontVariantNumeric: 'tabular-nums', marginBottom: 8 }}>{fmtUSD(paidNet)}</div>
          <div style={{ fontSize: 11, color: '#3A3A3A' }}>across all Lucid accounts · after 30% fee</div>
        </div>
        <div style={{ padding: '26px', background: '#0D0D0D', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16 }}>
          <div style={{ fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#2E2E2E', marginBottom: 14 }}>In Pipeline</div>
          <div style={{ fontSize: 26, fontWeight: 200, color: '#C8C8C8', fontVariantNumeric: 'tabular-nums', marginBottom: 8 }}>{fmtUSD(pendingNet)}</div>
          <div style={{ fontSize: 11, color: '#3A3A3A' }}>processing + scheduled</div>
          <div style={{ marginTop: 18, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 8 }}>
              <span style={{ color: '#3A3A3A' }}>Client share</span><span style={{ color: '#F59E0B' }}>70%</span>
            </div>
            <div style={{ height: 6, background: 'rgba(255,255,255,0.03)', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: '70%', background: 'linear-gradient(90deg,#F59E0B66,#F59E0B33)', borderRadius: 3 }} />
            </div>
          </div>
        </div>
      </div>
      <div style={{ border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, overflow: 'hidden', background: '#0C0C0D' }}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
          <span style={{ fontSize: 11, color: '#444', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Payout Ledger</span>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              {['Cycle', 'Date', 'Account', 'Gross', 'Client Net', 'Status'].map(h => (
                <th key={h} style={{ padding: '11px 22px', textAlign: 'left', color: '#252525', fontWeight: 500, fontSize: 8.5, letterSpacing: '0.14em', textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PAYOUTS.map((p, i) => {
              const t = tone[p.status];
              return (
                <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.025)' }} className="d-row">
                  <td style={{ padding: '13px 22px', color: '#8A8A8A' }}>{p.cycle}</td>
                  <td style={{ padding: '13px 22px', color: '#484848', fontVariantNumeric: 'tabular-nums' }}>{p.date}</td>
                  <td style={{ padding: '13px 22px', color: '#6A6A6A' }}>{p.acct}</td>
                  <td style={{ padding: '13px 22px', color: '#6A6A6A', fontVariantNumeric: 'tabular-nums' }}>{fmtUSD(p.gross)}</td>
                  <td style={{ padding: '13px 22px', color: '#F59E0B', fontVariantNumeric: 'tabular-nums' }}>{fmtUSD(p.net)}</td>
                  <td style={{ padding: '13px 22px' }}>
                    <span style={{ fontSize: 8.5, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '3px 10px', borderRadius: 100, background: t.bg, color: t.c, border: `1px solid ${t.c}30` }}>{p.status}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Section heading helper ──────────────────────────────────────────────────
function SectionHead({ kicker, title, sub }: { kicker: string; title: string; sub?: string }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(245,158,11,0.55)', marginBottom: 10 }}>{kicker}</div>
      <h2 style={{
        fontSize: 28, fontWeight: 200, letterSpacing: '-0.025em',
        background: 'linear-gradient(135deg,#FFFFFF 0%,#C8C8C8 55%,#F59E0B 100%)',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
      }}>{title}</h2>
      {sub && <p style={{ color: '#3A3A3A', fontSize: 13, lineHeight: 1.7, marginTop: 8, maxWidth: 640 }}>{sub}</p>}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const [gold, setGold] = useState<GoldData | null>(null);
  const [now, setNow] = useState('');
  const confluence = useMemo(() => {
    const total = STRATEGIES.reduce((s, x) => s + (x.agree ? x.weight : 0), 0);
    return Math.round(total);
  }, []);

  const fetchGold = useCallback(async () => {
    try { const r = await fetch('/api/gold'); setGold(await r.json()); } catch { /* keep */ }
  }, []);

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400;500;600&display=swap';
    link.rel = 'stylesheet'; document.head.appendChild(link);
    return () => { if (document.head.contains(link)) document.head.removeChild(link); };
  }, []);

  useEffect(() => {
    fetchGold();
    const iv = setInterval(fetchGold, 30000);
    const clock = () => setNow(new Date().toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }));
    clock();
    const ci = setInterval(clock, 30000);
    return () => { clearInterval(iv); clearInterval(ci); };
  }, [fetchGold]);

  const pos = gold ? gold.change >= 0 : true;
  const totalAUM = LUCID_ACCOUNTS.reduce((s, a) => s + a.balance, 0);
  const openCount = LUCID_ACCOUNTS.filter(a => a.status !== 'Evaluation').length;
  const evalCount = LUCID_ACCOUNTS.filter(a => a.status === 'Evaluation').length;
  const payoutReadyCount = LUCID_ACCOUNTS.filter(a => a.status === 'Payout Ready').length;
  const wins = TRADES.filter(t => t.result === 'Win').length;
  const winRate = Math.round((wins / TRADES.length) * 100);
  const sessionPnL = LUCID_ACCOUNTS.reduce((s, a) => s + a.todayPnL, 0);
  const paidNet = PAYOUTS.filter(p => p.status === 'Paid').reduce((s, p) => s + p.net, 0);

  return (
    <>
      <style>{`
        *,*::before,*::after { box-sizing: border-box; margin: 0; padding: 0; }
        .d-wrap { font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif; background:#070708; color:#F0F0F0; min-height:100vh; -webkit-font-smoothing:antialiased; }
        .d-wrap * { font-family:inherit; }
        @keyframes qs-pulse { 0%,100%{opacity:.3} 50%{opacity:1} }
        @keyframes d-spin { from{transform:rotate(0)} to{transform:rotate(360deg)} }
        .d-spin { animation:d-spin 0.9s linear infinite; }
        .d-card:hover { border-color:rgba(245,158,11,0.16) !important; box-shadow:0 0 36px rgba(245,158,11,0.05); }
        .d-row:hover { background:rgba(245,158,11,0.018); }
        .d-link { color:#383838; font-size:11px; letter-spacing:0.14em; text-transform:uppercase; text-decoration:none; transition:color .2s; }
        .d-link:hover { color:#9A9A9A; }
        @media (max-width:1080px){
          .d-two { grid-template-columns:1fr !important; }
          .d-acct-grid { grid-template-columns:1fr 1fr !important; }
          .d-kpi-grid { grid-template-columns:1fr 1fr 1fr !important; }
          .d-payout-grid { grid-template-columns:1fr !important; }
        }
        @media (max-width:640px){
          .d-acct-grid { grid-template-columns:1fr !important; }
          .d-kpi-grid { grid-template-columns:1fr 1fr !important; }
          .d-pad { padding:80px 18px 60px !important; }
        }
      `}</style>

      <div className="d-wrap">
        {/* Top bar */}
        <header style={{ position: 'sticky', top: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px', height: 64, background: 'rgba(7,7,8,0.9)', backdropFilter: 'blur(22px)', borderBottom: '1px solid rgba(245,158,11,0.07)' }}>
          <a href="/" className="d-link" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <QMark size={30} glow />
            <span>
              <span style={{ display: 'block', fontSize: 12, fontWeight: 300, letterSpacing: '0.26em', textTransform: 'uppercase', color: '#D0D0D0' }}>Quantara</span>
              <span style={{ display: 'block', fontSize: 8, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#2E2E2E', marginTop: 1 }}>Investor Dashboard</span>
            </span>
          </a>
          <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
            {gold && !gold.error && (
              <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11 }}>
                <span style={{ fontSize: 9, color: '#2E2E2E', letterSpacing: '0.14em', textTransform: 'uppercase' }}>GC</span>
                <span style={{ color: '#C8C8C8', fontVariantNumeric: 'tabular-nums' }}>${fmtNum(gold.price)}</span>
                <span style={{ color: pos ? '#34D399' : '#F87171', fontVariantNumeric: 'tabular-nums' }}>{pos ? '▲' : '▼'} {Math.abs(gold.changePct).toFixed(2)}%</span>
              </span>
            )}
            <span style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#34D399' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#34D399', boxShadow: '0 0 8px #34D399', animation: 'qs-pulse 2s ease-in-out infinite' }} />
              QS1 Active
            </span>
            <a href="/" className="d-link" style={{ display: 'none' }}>Site</a>
          </div>
        </header>

        <main className="d-pad" style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 32px 80px' }}>
          {/* Intro */}
          <div style={{ marginBottom: 32 }}>
            <Badge>Quantara System One · Live Operations</Badge>
            <h1 style={{
              fontSize: 40, fontWeight: 200, letterSpacing: '-0.035em', marginTop: 18, marginBottom: 12, maxWidth: 760,
              background: 'linear-gradient(135deg,#FFFFFF 0%,#E0E0E0 40%,#F59E0B 80%,#FCD34D 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              QS1 Performance &amp; Operations Overview
            </h1>
            <p style={{ color: '#444', fontSize: 14, lineHeight: 1.8, maxWidth: 680, fontWeight: 300 }}>
              A live view of QS1-managed Lucid accounts — progress, the six-gate pre-trade verification system, multi-strategy confluence, executed trades and client payouts. {now && <span style={{ color: '#2E2E2E' }}>· Updated {now}</span>}
            </p>
          </div>

          {/* KPIs */}
          <div className="d-kpi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 14, marginBottom: 44 }}>
            <Kpi label="Capital Under Mgmt" value={fmtUSD(totalAUM)} sub={`${LUCID_ACCOUNTS.length} Lucid accounts`} tone="gold" />
            <Kpi label="Active Accounts" value={`${openCount}`} sub={`${evalCount} in evaluation · ${payoutReadyCount} payout-ready`} />
            <Kpi label="Session P&L" value={`${sessionPnL >= 0 ? '+' : ''}${fmtUSD(sessionPnL)}`} sub="across book" tone={sessionPnL >= 0 ? 'green' : 'silver'} />
            <Kpi label="Win Rate" value={`${winRate}%`} sub={`${wins}/${TRADES.length} today`} tone="green" />
            <Kpi label="Confluence Threshold" value="70%" sub="min. to fire" />
            <Kpi label="Client Net Paid YTD" value={fmtUSD(paidNet)} sub="after fee" tone="gold" />
          </div>

          {/* Account progress */}
          <section style={{ marginBottom: 52 }}>
            <SectionHead kicker="Account Progress" title="Lucid Funded Accounts" sub="Each account tracked toward its profit target and payout eligibility, with live drawdown headroom against Lucid funded-account rules." />
            <AccountProgress />
          </section>

          {/* Verification + strategy */}
          <section style={{ marginBottom: 52 }}>
            <SectionHead kicker="Decision Engine" title="Six-Gate Verification & Strategy Confluence" sub="Before any order is sent, QS1 aligns six independent strategies and clears six sequential verification gates. No single edge trades alone." />
            <div className="d-two" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, alignItems: 'start' }}>
              <VerificationPipeline confluence={confluence} />
              <StrategyAlignment confluence={confluence} />
            </div>
          </section>

          {/* Trade log */}
          <section style={{ marginBottom: 52 }}>
            <SectionHead kicker="Execution" title="Trade Log — Lucid Accounts" sub="Every fill is tagged with the strategies that aligned to authorize it, executed automatically through Tradovate." />
            <TradeLog />
          </section>

          {/* Payouts */}
          <section style={{ marginBottom: 24 }}>
            <SectionHead kicker="Payouts" title="Payout Tracking" sub="Client receives 70% of every successful payout; QS1's 30% fee applies only on realized payouts." />
            <PayoutTracker />
          </section>

          {/* Disclaimer */}
          <div style={{ marginTop: 32, padding: '16px 22px', border: '1px solid rgba(200,100,50,0.07)', borderRadius: 10, background: 'rgba(200,100,50,0.018)' }}>
            <p style={{ color: '#3A2A22', fontSize: 11, lineHeight: 1.8 }}>
              Illustrative operational dashboard for qualified-investor review. Figures reflect representative QS1-managed account activity, not a guarantee. All futures trading involves substantial risk of loss; past performance does not indicate future results. Private &amp; confidential — quantarasystems.io.
            </p>
          </div>

          <div style={{ marginTop: 40, textAlign: 'center', fontSize: 10, color: '#1E1E1E', letterSpacing: '0.06em' }}>
            © 2026 Quantara Systems · Powered by QS1 · quantarasystems.io
          </div>
        </main>
      </div>
    </>
  );
}
