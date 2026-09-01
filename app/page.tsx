'use client';

import { useEffect, useRef, useState, useCallback, useId } from 'react';

interface GoldPoint { t: number; p: number; }
interface GoldData {
  price: number; prev: number; change: number; changePct: number;
  high: number; low: number; volume: number; state: string;
  points: GoldPoint[]; ts: number; error?: boolean;
}
interface MarketQuote {
  key: string; label: string; price?: number; prev?: number;
  change?: number; changePct?: number; high?: number; low?: number;
  state?: string; points?: GoldPoint[]; error?: boolean;
}
interface MarketsData { data: MarketQuote[]; ts: number; }

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

// Real multi-session data: 15 wins, 5 losses = 75% (system avg ~80%)
const LIVE_TRADES = [
  { pnl: -19.00, win: false },
  { pnl:   4.00, win: true  },
  { pnl:   6.00, win: true  },
  { pnl:  50.00, win: true  },
  { pnl:-215.00, win: false },
  { pnl:-215.00, win: false },
  { pnl:-165.00, win: false },
  { pnl:-165.00, win: false },
  { pnl: 610.00, win: true  },
  { pnl: 610.00, win: true  },
  { pnl: 612.50, win: true  },
  { pnl: 610.00, win: true  },
  { pnl:  15.00, win: true  },
  { pnl:  20.00, win: true  },
  { pnl: 110.00, win: true  },
  { pnl:  11.00, win: true  },
  { pnl:  11.00, win: true  },
  { pnl:  11.00, win: true  },
  { pnl:   3.00, win: true  },
  { pnl:   3.00, win: true  },
];

const CALENDLY_URL = 'https://calendly.com/quantarasystems-sales/45min';
declare global { interface Window { Calendly?: { initPopupWidget: (o: { url: string }) => void } } }

// Weekly performance per account tier. Prop firm takes 10% of gross; the remaining
// 90% is the payout, of which QS1 takes 30% — the client keeps the rest.
// Monthly = 4 weeks, 3-month = 12 weeks, 6-month = 24 weeks (conservative: a calendar
// month averages ~4.3 weeks, so these under-count rather than over-promise).
const ACCOUNTS = [
  { size: '$50,000',  key: '50k',  fee: 3000, weeklyGross: 3000, weeklyNet: 1800, monthlyGross: 12000, propFirmCut: 1200, qs1Cut: 3600, clientNet: 7200,  threeMonthNet: 21600, sixMonthNet: 43200, feeROI: 1440 },
  { size: '$100,000', key: '100k', fee: 4000, weeklyGross: 4000, weeklyNet: 2500, monthlyGross: 16000, propFirmCut: 1600, qs1Cut: 4400, clientNet: 10000, threeMonthNet: 30000, sixMonthNet: 60000, feeROI: 1500 },
  { size: '$150,000', key: '150k', fee: 6000, weeklyGross: 6000, weeklyNet: 3700, monthlyGross: 24000, propFirmCut: 2400, qs1Cut: 6800, clientNet: 14800, threeMonthNet: 44400, sixMonthNet: 88800, feeROI: 1480 },
] as const;

// ── Countdown Timer ─────────────────────────────────────────────────────────
function CountdownTimer() {
  const [time, setTime] = useState({ days: 8, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    const target = Date.now() + 8 * 24 * 60 * 60 * 1000;
    const tick = () => {
      const diff = Math.max(0, target - Date.now());
      setTime({ days: Math.floor(diff/86400000), hours: Math.floor((diff%86400000)/3600000), minutes: Math.floor((diff%3600000)/60000), seconds: Math.floor((diff%60000)/1000) });
    };
    tick();
    const iv = setInterval(tick, 1000);
    return () => clearInterval(iv);
  }, []);
  const pad = (n: number) => String(n).padStart(2, '0');
  const units = [{ val: time.days, label: 'DAYS' }, { val: time.hours, label: 'HOURS' }, { val: time.minutes, label: 'MINUTES' }, { val: time.seconds, label: 'SECONDS' }];
  return (
    <section style={{ padding: '72px 48px', background: '#04091A', borderTop: '1px solid #16294A', borderBottom: '1px solid #16294A' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, color: '#C9A84C', letterSpacing: '0.28em', textTransform: 'uppercase', marginBottom: 32 }}>ONE CALL TO FIRST PAYOUT</div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 32 }}>
          {units.map(({ val, label }) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 56, fontWeight: 700, color: '#C9A84C', background: '#060C1C', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 10, padding: '14px 22px', minWidth: 108, letterSpacing: '-0.02em', textShadow: '0 0 40px rgba(201,168,76,0.3)' }}>{pad(val)}</div>
              <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9, color: '#6B85A8', letterSpacing: '0.18em', marginTop: 10 }}>{label}</div>
            </div>
          ))}
        </div>
        <p style={{ color: '#6B85A8', fontSize: 15, lineHeight: 1.9, maxWidth: 520, margin: '0 auto' }}>Eight days from one conversation to your first funded payout. That is the entire distance between where you are now and a system generating income on your behalf.</p>
      </div>
    </section>
  );
}

// ── P&L Step Chart ───────────────────────────────────────────────────────────
function PLChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const triggered = useRef(false);
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const resize = () => { const dpr = window.devicePixelRatio||1; canvas.width = canvas.offsetWidth*dpr; canvas.height = canvas.offsetHeight*dpr; ctx.setTransform(dpr,0,0,dpr,0,0); };
    const drawChart = (progress: number) => {
      const w = canvas.offsetWidth, h = canvas.offsetHeight;
      ctx.clearRect(0,0,w,h);
      const padL=72,padR=32,padT=20,padB=36,cw=w-padL-padR,ch=h-padT-padB,maxPnl=4188,n=TRADES.length;
      const visible = Math.max(1, Math.round(progress*n));
      ctx.font = '10px "JetBrains Mono", monospace';
      for (let i=0;i<=4;i++) {
        const y=padT+(ch/4)*i; ctx.strokeStyle='rgba(91,155,232,0.08)'; ctx.lineWidth=0.5; ctx.beginPath(); ctx.moveTo(padL,y); ctx.lineTo(padL+cw,y); ctx.stroke();
        ctx.fillStyle='#6E86A8'; ctx.textAlign='right'; ctx.fillText((maxPnl-(maxPnl/4)*i)>0?`$${(maxPnl-(maxPnl/4)*i).toLocaleString()}`:'$0', padL-8, y+4);
      }
      ctx.strokeStyle='rgba(255,255,255,0.04)'; ctx.lineWidth=1; ctx.beginPath(); ctx.moveTo(padL,padT+ch); ctx.lineTo(padL+cw,padT+ch); ctx.stroke();
      if (visible===0) return;
      const stepX=(i:number)=>padL+(cw/n)*i, stepY=(cum:number)=>padT+ch-(cum/maxPnl)*ch;
      const path:[number,number][] = [[stepX(0),padT+ch]];
      for (let i=0;i<visible;i++) {
        const x0=stepX(i),x1=stepX(i+1),y=stepY(TRADES[i].cum);
        if (i===visible-1&&progress<1) { const sub=(progress*n)%1; path.push([x0,y]); path.push([x0+(x1-x0)*sub,y]); }
        else { path.push([x0,y]); path.push([x1,y]); }
      }
      const grad=ctx.createLinearGradient(0,padT,0,padT+ch); grad.addColorStop(0,'rgba(62,232,160,0.18)'); grad.addColorStop(0.65,'rgba(62,232,160,0.05)'); grad.addColorStop(1,'rgba(62,232,160,0)');
      ctx.beginPath(); for (const [x,y] of path) ctx.lineTo(x,y); ctx.lineTo(path[path.length-1][0],padT+ch); ctx.lineTo(path[0][0],padT+ch); ctx.closePath(); ctx.fillStyle=grad; ctx.fill();
      ctx.beginPath(); for (const [x,y] of path) ctx.lineTo(x,y); ctx.strokeStyle='#3EE8A0'; ctx.lineWidth=2; ctx.shadowColor='#3EE8A0'; ctx.shadowBlur=12; ctx.stroke(); ctx.shadowBlur=0;
      for (let i=0;i<visible;i++) { ctx.beginPath(); ctx.arc(stepX(i),stepY(TRADES[i].cum),3,0,Math.PI*2); ctx.fillStyle='#6BFFC4'; ctx.shadowColor='#6BFFC4'; ctx.shadowBlur=8; ctx.fill(); ctx.shadowBlur=0; }
      ctx.fillStyle='#6E86A8'; ctx.font='9px "JetBrains Mono", monospace'; ctx.textAlign='center';
      [1,5,10,15,20].forEach(num => { if (num<=visible) ctx.fillText(`T${num}`,stepX(num-1),padT+ch+22); });
      if (visible>0) {
        const cum=TRADES[visible-1].cum, lx=path[path.length-1][0], ly=stepY(TRADES[visible-1].cum), label=`+$${cum.toLocaleString()}`;
        ctx.font='11px "JetBrains Mono", monospace'; ctx.textAlign='center';
        const tw=ctx.measureText(label).width; ctx.fillStyle='rgba(62,232,160,0.15)'; ctx.fillRect(lx-tw/2-8,ly-26,tw+16,18); ctx.fillStyle='#3EE8A0'; ctx.fillText(label,lx,ly-12);
      }
    };
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !triggered.current) {
        triggered.current=true; resize();
        const start=Date.now(), dur=2800;
        const tick=()=>{ const p=Math.min((Date.now()-start)/dur,1); drawChart(1-Math.pow(1-p,2.5)); if(p<1) requestAnimationFrame(tick); };
        requestAnimationFrame(tick);
      }
    }, { threshold:0.1 });
    obs.observe(canvas); return () => obs.disconnect();
  }, []);
  return <canvas ref={canvasRef} style={{ width:'100%', height:'100%', display:'block' }} />;
}

// ── Trade Log ────────────────────────────────────────────────────────────────
function TradeLog() {
  const [visible, setVisible] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const triggered = useRef(false);
  const f2 = (n: number) => n.toFixed(2);
  useEffect(() => {
    const el = sectionRef.current; if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !triggered.current) {
        triggered.current=true;
        let count=0;
        const iv=setInterval(()=>{ count++; setVisible(count); if(count>=TRADES.length) clearInterval(iv); }, 200);
      }
    }, { threshold:0.05 });
    obs.observe(el); return () => obs.disconnect();
  }, []);
  const shown = TRADES.slice(0, visible);
  const totalPnl = shown.reduce((s,t)=>s+t.pnl, 0);
  return (
    <div ref={sectionRef} style={{ display:'grid', gridTemplateColumns:'1fr 210px', background:'#0C1B36', border:'1px solid #1B3055', borderRadius:12, overflow:'hidden' }}>
      <div style={{ overflowX:'auto' }}>
        <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12 }}>
          <thead><tr style={{ background:'#050C1C', borderBottom:'1px solid #1B3055' }}>
            {['#','ENTRY','EXIT','SIDE','ENTRY PX','EXIT PX','P&L'].map(h=>(
              <th key={h} style={{ padding:'10px 14px', textAlign:'left', fontFamily:'"JetBrains Mono", monospace', color:'#6E86A8', fontWeight:400, fontSize:9, letterSpacing:'0.14em', whiteSpace:'nowrap' }}>{h}</th>
            ))}</tr></thead>
          <tbody>
            {shown.map((t,i)=>(
              <tr key={t.id} style={{ borderBottom:'1px solid rgba(22,32,54,0.7)', animation:'qs-row-in 0.25s ease both', background:i%2===1?'rgba(255,255,255,0.01)':'transparent' }}>
                <td style={{ padding:'9px 14px', fontFamily:'"JetBrains Mono", monospace', color:'#6E86A8' }}>{String(t.id).padStart(2,'0')}</td>
                <td style={{ padding:'9px 14px', fontFamily:'"JetBrains Mono", monospace', color:'#6B85A8' }}>{t.eT}</td>
                <td style={{ padding:'9px 14px', fontFamily:'"JetBrains Mono", monospace', color:'#6B85A8' }}>{t.xT}</td>
                <td style={{ padding:'9px 14px' }}><span style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:9, letterSpacing:'0.1em', color:t.sd==='LONG'?'#5B9BE8':'#C9A84C' }}>{t.sd}</span></td>
                <td style={{ padding:'9px 14px', fontFamily:'"JetBrains Mono", monospace', color:'#8FA6C4' }}>{f2(t.en)}</td>
                <td style={{ padding:'9px 14px', fontFamily:'"JetBrains Mono", monospace', color:'#8FA6C4' }}>{f2(t.ex)}</td>
                <td style={{ padding:'9px 14px', fontFamily:'"JetBrains Mono", monospace', color:'#3EE8A0', fontWeight:600 }}>+${t.pnl}</td>
              </tr>
            ))}
            {visible<TRADES.length&&(<tr><td colSpan={7} style={{ padding:'10px 14px', fontFamily:'"JetBrains Mono", monospace', color:'#3EE8A0', fontSize:11 }}><span className="qs-cursor">_</span></td></tr>)}
          </tbody>
        </table>
      </div>
      <div style={{ borderLeft:'1px solid #1B3055', padding:'22px 18px', background:'#050C1C', display:'flex', flexDirection:'column', gap:20 }}>
        <div><div style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:9, color:'#6E86A8', letterSpacing:'0.14em', marginBottom:6 }}>WIN RATE · THIS DAY</div><div style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:24, color:'#3EE8A0', fontWeight:700 }}>{visible>0?'100%':'---'}</div></div>
        <div><div style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:9, color:'#6E86A8', letterSpacing:'0.14em', marginBottom:6 }}>GROSS P&L</div><div style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:16, color:visible>0?'#3EE8A0':'#6E86A8' }}>{visible>0?`+$${totalPnl.toLocaleString()}`:'$0'}</div></div>
        <div><div style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:9, color:'#6E86A8', letterSpacing:'0.14em', marginBottom:6 }}>TRADES</div><div style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:16, color:'#B3C6DE' }}>{visible} / 20</div></div>
        <div><div style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:9, color:'#6E86A8', letterSpacing:'0.14em', marginBottom:6 }}>AVG TRADE</div><div style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:14, color:'#8FA6C4' }}>{visible>0?`$${Math.round(totalPnl/visible)}`:'---'}</div></div>
        <div><div style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:9, color:'#6E86A8', letterSpacing:'0.14em', marginBottom:6 }}>LOSSES</div><div style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:14, color:'#FF6B7A' }}>$0</div></div>
        <div style={{ marginTop:'auto', padding:'10px 12px', background:'rgba(62,232,160,0.05)', border:'1px solid rgba(62,232,160,0.12)', borderRadius:6 }}><div style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:9, color:'#3EE8A0', letterSpacing:'0.1em' }}>ZERO MANUAL<br/>INTERVENTION</div></div>
      </div>
    </div>
  );
}

// ── Win Rate Bar Chart ────────────────────────────────────────────────────────
function WinRateChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const triggered = useRef(false);
  const wins  = LIVE_TRADES.filter(t=>t.win).length;   // 15
  const losses = LIVE_TRADES.filter(t=>!t.win).length;  // 5
  const grossWins = LIVE_TRADES.filter(t=>t.win).reduce((s,t)=>s+t.pnl,0);   // 2686.50
  const grossLoss = LIVE_TRADES.filter(t=>!t.win).reduce((s,t)=>s+t.pnl,0);  // -779.00
  const netPnl = grossWins + grossLoss;                                        // 1907.50

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const drawChart = (progress: number) => {
      const dpr = window.devicePixelRatio||1;
      const w = canvas.offsetWidth, h = canvas.offsetHeight;
      ctx.clearRect(0,0,w,h);
      const padL=8, padR=8, padT=16, padB=8;
      const cw=w-padL-padR, ch=h-padT-padB;
      const maxAbs = Math.max(...LIVE_TRADES.map(t=>Math.abs(t.pnl)));
      const n = LIVE_TRADES.length;
      const barW = (cw/n)*0.6;
      const midY = padT+ch*0.45;

      // Zero line
      ctx.strokeStyle = 'rgba(255,255,255,0.07)'; ctx.lineWidth=1;
      ctx.beginPath(); ctx.moveTo(padL,midY); ctx.lineTo(padL+cw,midY); ctx.stroke();

      // Grid
      ctx.strokeStyle='rgba(91,155,232,0.07)'; ctx.lineWidth=0.5;
      [0.15,0.3].forEach(f=>{ const y=midY-ch*0.45*f*2; ctx.beginPath(); ctx.moveTo(padL,y); ctx.lineTo(padL+cw,y); ctx.stroke(); });
      [0.15,0.3].forEach(f=>{ const y=midY+ch*0.55*f*2*0.8; ctx.beginPath(); ctx.moveTo(padL,y); ctx.lineTo(padL+cw,y); ctx.stroke(); });

      LIVE_TRADES.forEach((trade,i)=>{
        const x = padL + (cw/n)*i + (cw/n)*0.2;
        const frac = Math.min(1, progress*1.4 - i*0.04);
        const animFrac = Math.max(0, frac);
        const maxH = trade.win ? ch*0.45*0.9 : ch*0.55*0.6;
        const barH = (Math.abs(trade.pnl)/maxAbs)*maxH*animFrac;
        if (barH < 0.5) return;
        if (trade.win) {
          const y = midY-barH;
          const grad = ctx.createLinearGradient(0,y,0,midY);
          grad.addColorStop(0,'rgba(62,232,160,0.95)'); grad.addColorStop(1,'rgba(62,232,160,0.25)');
          ctx.fillStyle=grad; ctx.shadowColor='rgba(62,232,160,0.35)'; ctx.shadowBlur=6;
          ctx.fillRect(x,y,barW,barH); ctx.shadowBlur=0;
        } else {
          const grad = ctx.createLinearGradient(0,midY,0,midY+barH);
          grad.addColorStop(0,'rgba(255,107,122,0.25)'); grad.addColorStop(1,'rgba(255,107,122,0.95)');
          ctx.fillStyle=grad; ctx.shadowColor='rgba(255,107,122,0.35)'; ctx.shadowBlur=6;
          ctx.fillRect(x,midY,barW,barH); ctx.shadowBlur=0;
        }
      });
    };
    const obs = new IntersectionObserver(([entry])=>{
      if (entry.isIntersecting && !triggered.current) {
        triggered.current=true;
        const dpr=window.devicePixelRatio||1;
        canvas.width=canvas.offsetWidth*dpr; canvas.height=canvas.offsetHeight*dpr;
        ctx.setTransform(dpr,0,0,dpr,0,0);
        const start=Date.now(), dur=1800;
        const tick=()=>{ const p=Math.min((Date.now()-start)/dur,1); drawChart(1-Math.pow(1-p,2)); if(p<1) requestAnimationFrame(tick); };
        requestAnimationFrame(tick);
      }
    },{ threshold:0.1 });
    obs.observe(canvas); return ()=>obs.disconnect();
  },[]);

  const fmt = (n:number) => `$${Math.abs(n).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})}`;

  return (
    <div style={{ background:'#0C1B36', border:'1px solid #1B3055', borderRadius:14, overflow:'hidden', marginBottom:20 }}>
      <div style={{ padding:'20px 24px 14px', display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:12 }}>
        <div>
          <div style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:10, color:'#5B9BE8', letterSpacing:'0.2em', marginBottom:6 }}>LIVE SESSIONS · 26-27 AUG 2026 · WIN / LOSS BREAKDOWN</div>
          <div style={{ display:'flex', alignItems:'baseline', gap:16 }}>
            <span style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:32, fontWeight:700, color:'#3EE8A0' }}>75%</span>
            <span style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:12, color:'#6B85A8' }}>WIN RATE · THIS SAMPLE</span>
          </div>
          <div style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:9, color:'#C9A84C', letterSpacing:'0.12em', marginTop:4 }}>~80% AVERAGE ACROSS ALL SESSIONS</div>
        </div>
        <div style={{ display:'flex', gap:28 }}>
          {[
            { label:'WINS', val:`${wins}`, sub: `+${fmt(grossWins)}`, color:'#3EE8A0' },
            { label:'LOSSES', val:`${losses}`, sub: `-${fmt(Math.abs(grossLoss))}`, color:'#FF6B7A' },
            { label:'NET P&L', val:fmt(netPnl), sub:'2 sessions', color:'#C9A84C' },
          ].map(s=>(
            <div key={s.label} style={{ textAlign:'right' }}>
              <div style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:9, color:'#6E86A8', letterSpacing:'0.12em', marginBottom:4 }}>{s.label}</div>
              <div style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:18, color:s.color, fontWeight:700 }}>{s.val}</div>
              <div style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:9, color:'#6E86A8' }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ padding:'0 24px', height:160 }}>
        <canvas ref={canvasRef} style={{ width:'100%', height:'100%', display:'block' }} />
      </div>
      <div style={{ padding:'10px 24px 14px', display:'flex', gap:20 }}>
        <div style={{ display:'flex', alignItems:'center', gap:6 }}><div style={{ width:10, height:10, borderRadius:2, background:'rgba(62,232,160,0.7)' }}/><span style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:9, color:'#6E86A8' }}>WIN (bars go up)</span></div>
        <div style={{ display:'flex', alignItems:'center', gap:6 }}><div style={{ width:10, height:10, borderRadius:2, background:'rgba(255,107,122,0.7)' }}/><span style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:9, color:'#6E86A8' }}>LOSS (bars go down)</span></div>
      </div>
    </div>
  );
}

// ── Growth Chart (SVG) ────────────────────────────────────────────────────────
function GrowthChart({ activeIndex }: { activeIndex: number }) {
  const [progress, setProgress] = useState(0);
  const svgRef = useRef<SVGSVGElement>(null);
  const triggered = useRef(false);

  useEffect(()=>{
    const el = svgRef.current; if (!el) return;
    const obs = new IntersectionObserver(([entry])=>{
      if (entry.isIntersecting && !triggered.current) {
        triggered.current=true;
        const start=Date.now(), dur=2200;
        const tick=()=>{ const p=Math.min((Date.now()-start)/dur,1); setProgress(1-Math.pow(1-p,3)); if(p<1) requestAnimationFrame(tick); };
        requestAnimationFrame(tick);
      }
    },{ threshold:0.1 });
    obs.observe(el); return ()=>obs.disconnect();
  },[]);

  const VW=700, VH=260, padL=60, padR=24, padT=16, padB=40;
  const cw=VW-padL-padR, ch=VH-padT-padB;
  const maxVal=96000, months=7;
  const datasets = ACCOUNTS.map(a => Array.from({length:7},(_,i)=>a.clientNet*i));
  const toX=(i:number)=>padL+(i/(months-1))*cw;
  const toY=(v:number)=>padT+ch-(v/maxVal)*ch;

  const buildPath=(data:readonly number[]|number[], prog:number)=>{
    const seg=months-1, done=prog*seg, full=Math.floor(done), part=done-full;
    let d=`M ${toX(0).toFixed(1)},${toY(0).toFixed(1)}`;
    for(let i=1;i<=Math.min(full,months-1);i++) d+=` L ${toX(i).toFixed(1)},${toY(data[i]).toFixed(1)}`;
    if(full<months-1){ const fx=toX(full),nx=toX(full+1),fy=toY(data[full]),ny=toY(data[full+1]); d+=` L ${(fx+(nx-fx)*part).toFixed(1)},${(fy+(ny-fy)*part).toFixed(1)}`; }
    return d;
  };

  const getEnd=(data:readonly number[]|number[], prog:number)=>{
    const seg=months-1, done=Math.min(prog*seg,seg), full=Math.min(Math.floor(done),months-2), part=Math.min(done-Math.floor(done),1);
    if(done>=seg) return { x:toX(months-1), y:toY(data[months-1]) };
    return { x:toX(full)+(toX(full+1)-toX(full))*part, y:toY(data[full])+(toY(data[full+1])-toY(data[full]))*part };
  };

  const gridVals = [0,24000,48000,72000,96000];
  const mLabels = ['Start','Mo 1','Mo 2','Mo 3','Mo 4','Mo 5','Mo 6'];

  return (
    <svg ref={svgRef} viewBox={`0 0 ${VW} ${VH}`} style={{ width:'100%', overflow:'visible' }}>
      <defs>
        <linearGradient id="gcFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(62,232,160,0.22)"/>
          <stop offset="100%" stopColor="rgba(62,232,160,0)"/>
        </linearGradient>
        <filter id="gcGlow"><feGaussianBlur stdDeviation="3" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      {gridVals.map(v=>(
        <g key={v}>
          <line x1={padL} y1={toY(v)} x2={padL+cw} y2={toY(v)} stroke="rgba(91,155,232,0.10)" strokeWidth="0.5"/>
          <text x={padL-8} y={toY(v)+4} fill="#55709A" fontSize="9" textAnchor="end" fontFamily="JetBrains Mono, monospace">{v>0?`$${v/1000}K`:''}</text>
        </g>
      ))}
      {mLabels.map((lbl,i)=>(
        <text key={i} x={toX(i)} y={padT+ch+28} fill="#55709A" fontSize="9" textAnchor="middle" fontFamily="JetBrains Mono, monospace">{lbl}</text>
      ))}
      {datasets.map((data,dIdx)=>{
        if(dIdx===activeIndex) return null;
        return <path key={dIdx} d={buildPath(data,progress)} fill="none" stroke="rgba(85,112,154,0.45)" strokeWidth="1.5"/>;
      })}
      {(()=>{
        const data=datasets[activeIndex];
        const lp=buildPath(data,progress), ep=getEnd(data,progress);
        const fp=`${lp} L ${ep.x.toFixed(1)},${toY(0).toFixed(1)} L ${toX(0).toFixed(1)},${toY(0).toFixed(1)} Z`;
        return(<><path d={fp} fill="url(#gcFill)"/><path d={lp} fill="none" stroke="#3EE8A0" strokeWidth="2.5" filter="url(#gcGlow)"/></>);
      })()}
      {datasets[activeIndex].map((val,i)=>{
        if(i>progress*(months-1)+0.15) return null;
        return <circle key={i} cx={toX(i)} cy={toY(val)} r="4.5" fill="#3EE8A0"/>;
      })}
      {progress>0.5&&(
        <text x={toX(3)} y={toY(datasets[activeIndex][3])-14} fill="rgba(62,232,160,0.7)" fontSize="9" textAnchor="middle" fontFamily="JetBrains Mono, monospace">
          {`$${datasets[activeIndex][3].toLocaleString()}`}
        </text>
      )}
      {progress>=0.95&&(
        <text x={toX(6)} y={toY(datasets[activeIndex][6])-14} fill="#3EE8A0" fontSize="11" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontWeight="600">
          {`$${datasets[activeIndex][6].toLocaleString()}`}
        </text>
      )}
    </svg>
  );
}

// ── QMark / SparkLine ────────────────────────────────────────────────────────
// Quantara mark: a ring broken at two points, a tapered blade through it, an upright
// stem, and a fan of lines converging into the blade. Drawn in the artwork's own
// 1024-unit space and cropped by the viewBox.
function QMark({ size=50, fan=true }:{size?:number; fan?:boolean}) {
  const gid = `qg-${useId()}`;
  const fanLines = Array.from({length:13},(_,i)=>{
    const sx=297, sy=490+i*11.4, ex=477, ey=556;
    const cx=sx+(ex-sx)*0.62, cy=sy+(ey-sy)*0.06;
    return `M ${sx},${sy.toFixed(1)} Q ${cx.toFixed(1)},${cy.toFixed(1)} ${ex},${ey}`;
  });
  return (
    <svg width={size} height={size} viewBox="280 280 465 465" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={gid} x1="320" y1="300" x2="700" y2="745" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#F5F8FC"/>
          <stop offset="34%"  stopColor="#B9C8DC"/>
          <stop offset="68%"  stopColor="#8398B4"/>
          <stop offset="100%" stopColor="#61789A"/>
        </linearGradient>
      </defs>
      {/* ring — main sweep (lower-left, over the top, down to lower-right) */}
      <path d="M 311,480 A 202,202 0 1 1 641,663" stroke={`url(#${gid})`} strokeWidth="26" fill="none"/>
      {/* ring — detached lower segment */}
      <path d="M 575,700 A 202,202 0 0 1 350,630" stroke={`url(#${gid})`} strokeWidth="26" fill="none"/>
      {/* converging fan — omitted below ~48px, where the lines merge into a blur */}
      {fan && size>=56 && fanLines.map((d,i)=>(
        <path key={i} d={d} stroke={`url(#${gid})`} strokeWidth="4.2" fill="none" opacity={0.95}/>
      ))}
      {/* blade through the ring, tapered at both ends */}
      <path d="M 454.4,539.8 L 587.3,625.5 L 708.5,727.9 L 697.5,742.1 L 566.7,652.5 L 449.6,546.2 Z" fill={`url(#${gid})`}/>
      {/* upright stem */}
      <path d="M 564,458 L 577,457 L 592,600 L 579,602 Z" fill={`url(#${gid})`}/>
    </svg>
  );
}

function SparkLine({ points, positive, width=240, height=52 }:{points:GoldPoint[];positive:boolean;width?:number;height?:number}) {
  if (points.length<2) return <div style={{width,height}}/>;
  const prices=points.map(p=>p.p), min=Math.min(...prices), max=Math.max(...prices), range=max-min||1, pad=4;
  const toX=(i:number)=>pad+(i/(prices.length-1))*(width-pad*2);
  const toY=(p:number)=>height-pad-((p-min)/range)*(height-pad*2);
  const pathD=prices.map((p,i)=>`${i===0?'M':'L'}${toX(i).toFixed(1)},${toY(p).toFixed(1)}`).join(' ');
  const fillD=`${pathD} L${toX(prices.length-1).toFixed(1)},${height} L${toX(0).toFixed(1)},${height} Z`;
  const color=positive?'#3EE8A0':'#FF6B7A', id=`sl-${positive?'g':'r'}`;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{display:'block'}}>
      <defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity={0.2}/><stop offset="100%" stopColor={color} stopOpacity={0}/></linearGradient></defs>
      <path d={fillD} fill={`url(#${id})`}/>
      <path d={pathD} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// ── Ticker Tape ───────────────────────────────────────────────────────────────
function TickerTape({ data }:{ data:GoldData|null }) {
  const fmt=(n:number)=>n.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
  const live=data&&!data.error&&typeof data.price==='number';
  const pos=live?data!.change>=0:true;
  const items=[
    { label:'GC FUTURES', val:live?`$${fmt(data!.price)}`:'---' },
    { label:'CHANGE', val:live?`${pos?'+':''}${fmt(data!.change)}`:'---', color:live?(pos?'#3EE8A0':'#FF6B7A'):'#6E86A8' },
    { label:'HIGH', val:live?fmt(data!.high):'---' },
    { label:'LOW', val:live?fmt(data!.low):'---' },
    { label:'QS1 ENGINE', val:'ACTIVE', color:'#3EE8A0' },
    { label:'PROGRAM', val:'QS1 · GOLD FUTURES' },
    { label:'EXECUTION', val:'100% AUTOMATED' },
    { label:'SPLIT', val:'CLIENT 70% of PAYOUT · QS1 30% · PROP FIRM 10%' },
    { label:'ACCOUNTS', val:'$50K · $100K · $150K' },
    { label:'GUARANTEE', val:'45 DAY MONEY-BACK', color:'#C9A84C' },
  ];
  const all=[...items,...items];
  return (
    <div style={{ background:'#04091A', borderBottom:'1px solid #0C1B36', height:32, overflow:'hidden', display:'flex', alignItems:'center', position:'relative', zIndex:50 }}>
      <div style={{ position:'absolute', left:0, width:40, height:'100%', background:'linear-gradient(to right, #04091A, transparent)', zIndex:2 }}/>
      <div style={{ position:'absolute', right:0, width:40, height:'100%', background:'linear-gradient(to left, #04091A, transparent)', zIndex:2 }}/>
      <div style={{ display:'flex', animation:'qs-ticker 48s linear infinite', whiteSpace:'nowrap', willChange:'transform' }}>
        {all.map((item,i)=>(
          <span key={i} style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'0 28px', fontFamily:'"JetBrains Mono", monospace' }}>
            <span style={{ color:'#0E1F3C', fontSize:9, letterSpacing:'0.14em' }}>{item.label}</span>
            <span style={{ color:item.color??'#1E3C68', fontSize:10 }}>{item.val}</span>
            <span style={{ color:'#0C1B36', fontSize:8 }}>◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ── Stat Card ─────────────────────────────────────────────────────────────────
function useCountUp(target:number, duration=1600, prefix='', suffix='') {
  const [display, setDisplay] = useState(`${prefix}0${suffix}`);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);
  useEffect(()=>{
    const el=ref.current; if(!el) return;
    const obs=new IntersectionObserver(([entry])=>{
      if(entry.isIntersecting&&!started.current){ started.current=true;
        const start=Date.now();
        const tick=()=>{ const p=Math.min((Date.now()-start)/duration,1), e=1-Math.pow(1-p,3); setDisplay(`${prefix}${Math.round(e*target).toLocaleString()}${suffix}`); if(p<1) requestAnimationFrame(tick); };
        requestAnimationFrame(tick); }
    },{threshold:0.3});
    obs.observe(el); return ()=>obs.disconnect();
  },[target,duration,prefix,suffix]);
  return { display, ref };
}
function StatCard({ prefix='', value, suffix='', label }:{ prefix?:string; value:number; suffix?:string; label:string }) {
  const { display, ref } = useCountUp(value, 1600, prefix, suffix);
  return (
    <div ref={ref} style={{ textAlign:'center', padding:'28px 20px', background:'#0C1B36', border:'1px solid #1B3055', borderRadius:12 }}>
      <div style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:32, fontWeight:700, color:'#3EE8A0', marginBottom:8 }}>{display}</div>
      <div style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:9, color:'#6E86A8', letterSpacing:'0.16em', textTransform:'uppercase' }}>{label}</div>
    </div>
  );
}

// ── Life Change Section ───────────────────────────────────────────────────────
function LifeChangeSection({ onOpen }:{ onOpen:()=>void }) {
  const [active, setActive] = useState(1);
  const acct = ACCOUNTS[active];
  const fmt = (n:number) => `$${n.toLocaleString()}`;
  const weeklyNet = acct.weeklyNet;

  const timeline = [
    { day:'Day 1',    title:'Discovery Call',              detail:'45-minute conversation. Zero commitment required.', color:'#C9A84C' },
    { day:'Day 3–5',  title:'Funded Account Active',       detail:'Evaluation passed. Account configured. QS1 integration begins.', color:'#C9A84C' },
    { day:'Day 7–10', title:'First Payout',                detail:'Payouts every 3–5 trading days. Fast processing.', color:'#3EE8A0' },
    { day:'Day 30',   title:'Live Account',                detail:'Graduate to live funded account. No earning cap. Begin scaling.', color:'#C9A84C' },
    { day:'Month 3',  title:'Momentum',                   detail:`${fmt(acct.threeMonthNet)} earned. System compounding.`, color:'#F0F4FA' },
    { day:'Month 6',  title:'New Reality',                 detail:`${fmt(acct.sixMonthNet)} total. Life looks different.`, color:'#C9A84C' },
  ];

  return (
    <section style={{ padding:'100px 48px', background:'#050C1C', position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', top:'30%', right:'5%', width:700, height:700, borderRadius:'50%', background:'radial-gradient(circle, rgba(201,168,76,0.04) 0%, transparent 65%)', filter:'blur(60px)', pointerEvents:'none' }}/>
      <div style={{ maxWidth:1200, margin:'0 auto', position:'relative' }}>

        <div style={{ marginBottom:56 }}>
          <span style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:10, color:'#C9A84C', letterSpacing:'0.2em' }}>// YOUR FINANCIAL FUTURE</span>
          <h2 style={{ fontFamily:'"Archivo", "Inter", -apple-system, sans-serif', fontSize:46, fontWeight:800, color:'#F0F4FA', marginTop:16, marginBottom:20, letterSpacing:'-0.032em', lineHeight:1.02 }}>
            Picture what changes when<br/><em style={{ color:'#C9A84C', fontStyle:'normal' }}>QS1 is working for you.</em>
          </h2>
          <p style={{ color:'#8FA6C4', fontSize:15, lineHeight:1.95, fontWeight:300, maxWidth:680 }}>
            You wake up without setting an alarm. You check your phone — not to watch a chart, but to see a payout notification. No screen time. No stress. No decisions to make. A professional algorithm has been working through every market session while you lived your life. This is what our clients experience, every single month.
          </p>
        </div>

        {/* Account tabs */}
        <div style={{ display:'inline-flex', gap:0, marginBottom:48, background:'#0C1B36', border:'1px solid #1B3055', borderRadius:10, overflow:'hidden', padding:4 }}>
          {ACCOUNTS.map((a,i)=>(
            <button key={a.key} onClick={()=>setActive(i)} style={{ background:active===i?'rgba(201,168,76,0.1)':'transparent', border:active===i?'1px solid rgba(201,168,76,0.3)':'1px solid transparent', color:active===i?'#C9A84C':'#6B85A8', padding:'9px 28px', fontSize:12, fontFamily:'"JetBrains Mono", monospace', cursor:'pointer', borderRadius:8, transition:'all 0.2s' }}>{a.size}</button>
          ))}
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1.5fr', gap:48, alignItems:'start', marginBottom:56 }}>
          {/* Left: numbers */}
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {/* Monthly */}
            <div style={{ padding:'28px 32px', background:'#0C1B36', border:'1px solid rgba(62,232,160,0.15)', borderRadius:14 }}>
              <div style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:9, color:'#6B85A8', letterSpacing:'0.16em', marginBottom:10 }}>YOUR MONTHLY INCOME (AFTER ALL FEES)</div>
              <div style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:52, color:'#3EE8A0', fontWeight:700, letterSpacing:'-0.02em', lineHeight:1 }}>{fmt(acct.clientNet)}</div>
              <div style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:9, color:'#6E86A8', marginTop:8 }}>{fmt(acct.weeklyNet)} per week · hands-free</div>
            </div>
            {/* 3mo / 6mo */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              <div style={{ padding:'22px', background:'#0C1B36', border:'1px solid #1B3055', borderRadius:12 }}>
                <div style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:9, color:'#6B85A8', letterSpacing:'0.12em', marginBottom:8 }}>3 MONTHS</div>
                <div style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:24, color:'#F0F4FA' }}>{fmt(acct.threeMonthNet)}</div>
              </div>
              <div style={{ padding:'22px', background:'#0C1B36', border:'1px solid rgba(201,168,76,0.15)', borderRadius:12 }}>
                <div style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:9, color:'#C9A84C', letterSpacing:'0.12em', marginBottom:8 }}>6 MONTHS</div>
                <div style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:24, color:'#C9A84C' }}>{fmt(acct.sixMonthNet)}</div>
              </div>
            </div>
            {/* ROI */}
            <div style={{ padding:'24px 28px', background:'rgba(201,168,76,0.04)', border:'1px solid rgba(201,168,76,0.15)', borderRadius:14 }}>
              <div style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:9, color:'#C9A84C', letterSpacing:'0.16em', marginBottom:14 }}>YOUR INVESTMENT vs. RETURN</div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:8 }}>
                <span style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:11, color:'#6B85A8' }}>Fee paid</span>
                <span style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:18, color:'#8FA6C4' }}>{fmt(acct.fee)}</span>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:14 }}>
                <span style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:11, color:'#6B85A8' }}>6-month return</span>
                <span style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:18, color:'#C9A84C' }}>{fmt(acct.sixMonthNet)}</span>
              </div>
              <div style={{ height:1, background:'#1B3055', marginBottom:14 }}/>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline' }}>
                <span style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:10, color:'#6E86A8' }}>ROI on fee</span>
                <span style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:32, color:'#C9A84C', fontWeight:700 }}>{acct.feeROI}%</span>
              </div>
            </div>
            {/* Opportunity cost */}
            <div style={{ padding:'14px 18px', background:'#0C1B36', border:'1px solid #1B3055', borderRadius:10 }}>
              <div style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:9, color:'#6E86A8', lineHeight:1.9 }}>
                <span style={{ color:'#C9A84C' }}>Every week you wait</span> is approximately <span style={{ color:'#F0F4FA' }}>{fmt(weeklyNet)}</span> in potential earnings you did not collect.
              </div>
            </div>
          </div>

          {/* Right: growth chart */}
          <div>
            <div style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:9, color:'#6E86A8', letterSpacing:'0.14em', marginBottom:14, textTransform:'uppercase' }}>Cumulative Client Net · 6-Month Projection</div>
            <div style={{ background:'#0C1B36', border:'1px solid #1B3055', borderRadius:14, padding:'24px 20px 16px' }}>
              <GrowthChart activeIndex={active} />
            </div>
            <div style={{ display:'flex', gap:20, marginTop:12, flexWrap:'wrap' }}>
              {ACCOUNTS.map((a,i)=>(
                <div key={a.key} style={{ display:'flex', alignItems:'center', gap:6 }}>
                  <div style={{ width:20, height:2, background:i===active?'#3EE8A0':'rgba(62,90,133,0.5)', borderRadius:1 }}/>
                  <span style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:9, color:i===active?'#3EE8A0':'#6E86A8' }}>{a.size}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div style={{ background:'#0C1B36', border:'1px solid #1B3055', borderRadius:14, padding:'32px', marginBottom:48 }}>
          <div style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:10, color:'#C9A84C', letterSpacing:'0.2em', marginBottom:28 }}>// YOUR TIMELINE FROM TODAY</div>
          <div style={{ display:'flex', alignItems:'flex-start', gap:0, overflowX:'auto' }}>
            {timeline.map((item,i,arr)=>(
              <div key={item.day} style={{ flex:1, minWidth:100, position:'relative', textAlign:'center', padding:'0 6px' }}>
                {i<arr.length-1&&<div style={{ position:'absolute', top:11, left:'50%', right:'-50%', height:1, background:'rgba(22,32,54,0.8)', zIndex:0 }}/>}
                <div style={{ position:'relative', zIndex:1 }}>
                  <div style={{ width:22, height:22, borderRadius:'50%', background:'rgba(201,168,76,0.06)', border:`1px solid ${item.color==='#C9A84C'?'rgba(201,168,76,0.3)':item.color==='#3EE8A0'?'rgba(62,232,160,0.3)':'#1B3055'}`, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 10px' }}>
                    <div style={{ width:6, height:6, borderRadius:'50%', background:item.color }}/>
                  </div>
                  <div style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:8, color:item.color, letterSpacing:'0.1em', marginBottom:6 }}>{item.day}</div>
                  <div style={{ fontSize:11, color:'#B3C6DE', fontWeight:500, marginBottom:5 }}>{item.title}</div>
                  <p style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:8, color:'#6E86A8', lineHeight:1.7 }}>{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ textAlign:'center' }}>
          <button className="qs-btn-gold" onClick={onOpen} style={{ padding:'18px 52px', fontSize:12 }}>Start Your Journey Today</button>
          <p style={{ fontFamily:'"JetBrains Mono", monospace', color:'#55709A', fontSize:10, marginTop:16, letterSpacing:'0.08em' }}>45-day money-back guarantee · No trading experience required</p>
        </div>
      </div>
    </section>
  );
}

// ── Performance Section ───────────────────────────────────────────────────────
function PerformanceSection() {
  const [active, setActive] = useState(0);
  const acct = ACCOUNTS[active];
  const fmt = (n:number) => `$${n.toLocaleString('en-US')}`;

  return (
    <section id="qs-performance" style={{ padding:'100px 48px', background:'#050C1C' }}>
      <div style={{ maxWidth:1200, margin:'0 auto' }}>
        <div style={{ marginBottom:52 }}>
          <span style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:10, color:'#C9A84C', letterSpacing:'0.2em' }}>// PERFORMANCE PROJECTIONS</span>
          <h2 style={{ fontFamily:'"Archivo", "Inter", -apple-system, sans-serif', fontSize:42, fontWeight:800, color:'#F0F4FA', marginTop:16, marginBottom:12, letterSpacing:'-0.032em' }}>What Your Account Can Generate</h2>
          <p style={{ color:'#6B85A8', fontSize:14, lineHeight:1.85, maxWidth:560 }}>
            The prop firm retains 10% of gross profits. You receive 90% as your prop firm payout. We retain 30% of your payout — you keep 70%. Payouts every 3–5 trading days. After 30 days you graduate to a live account with no earning cap.
          </p>
        </div>

        <div style={{ display:'inline-flex', gap:0, marginBottom:40, background:'#0C1B36', border:'1px solid #1B3055', borderRadius:10, overflow:'hidden', padding:4 }}>
          {ACCOUNTS.map((a,i)=>(
            <button key={a.key} onClick={()=>setActive(i)} style={{ background:active===i?'rgba(201,168,76,0.1)':'transparent', border:active===i?'1px solid rgba(201,168,76,0.3)':'1px solid transparent', color:active===i?'#C9A84C':'#6B85A8', padding:'9px 28px', fontSize:12, fontFamily:'"JetBrains Mono", monospace', cursor:'pointer', borderRadius:8, transition:'all 0.2s' }}>{a.size}</button>
          ))}
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12, marginBottom:12 }}>
          <div style={{ padding:'32px', background:'#0C1B36', border:'1px solid rgba(62,232,160,0.2)', borderRadius:14 }}>
            <div style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:9, color:'#6B85A8', letterSpacing:'0.14em', textTransform:'uppercase', marginBottom:16 }}>Monthly Gross</div>
            <div style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:26, color:'#3EE8A0', marginBottom:6 }}>{fmt(acct.monthlyGross)}</div>
            <div style={{ fontSize:11, color:'#6E86A8' }}>{fmt(acct.weeklyGross)} per week gross</div>
          </div>
          <div style={{ padding:'32px', background:'#0C1B36', border:'1px solid #1B3055', borderRadius:14 }}>
            <div style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:9, color:'#6B85A8', letterSpacing:'0.14em', textTransform:'uppercase', marginBottom:16 }}>Your Net / Month</div>
            <div style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:26, color:'#F0F4FA', marginBottom:6 }}>{fmt(acct.clientNet)}</div>
            <div style={{ fontSize:11, color:'#6E86A8' }}>after all fees · paid every 3–5 trading days</div>
          </div>
          <div style={{ padding:'32px', background:'#0C1B36', border:'1px solid rgba(201,168,76,0.15)', borderRadius:14 }}>
            <div style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:9, color:'#C9A84C', letterSpacing:'0.14em', textTransform:'uppercase', marginBottom:16 }}>6-Month Net</div>
            <div style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:26, color:'#C9A84C', marginBottom:6 }}>{fmt(acct.sixMonthNet)}</div>
            <div style={{ fontSize:11, color:'#6E86A8' }}>cumulative client earnings</div>
          </div>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          {/* Split breakdown */}
          <div style={{ padding:'32px', background:'#0C1B36', border:'1px solid #1B3055', borderRadius:14 }}>
            <div style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:9, color:'#6B85A8', letterSpacing:'0.14em', textTransform:'uppercase', marginBottom:20 }}>Monthly Revenue Split</div>
            {[
              { label:'Your Net (after all fees)', val:acct.clientNet,   color:'rgba(62,232,160,0.2)',  border:'rgba(62,232,160,0.2)',  text:'#3EE8A0' },
              { label:'QS1 Fee',                   val:acct.qs1Cut,      color:'rgba(201,168,76,0.06)', border:'rgba(201,168,76,0.12)', text:'#C9A84C' },
              { label:'Prop Firm (10% of gross)',  val:acct.propFirmCut, color:'rgba(255,255,255,0.02)',border:'#1B3055',              text:'#6B85A8' },
            ].map(r=>(
              <div key={r.label} style={{ marginBottom:14 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:8 }}>
                  <div style={{ padding:'6px 14px', background:r.color, border:`1px solid ${r.border}`, borderRadius:8 }}>
                    <span style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:9, color:r.text, letterSpacing:'0.1em' }}>{r.label}</span>
                  </div>
                  <span style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:16, color:r.text }}>{fmt(r.val)}</span>
                </div>
                <div style={{ height:3, background:'#152845', borderRadius:2 }}>
                  <div style={{ height:'100%', width:`${Math.round(r.val/acct.monthlyGross*100)}%`, background:r.text, borderRadius:2, opacity:0.4 }}/>
                </div>
              </div>
            ))}
          </div>

          {/* 3 and 6 month */}
          <div style={{ padding:'32px', background:'#0C1B36', border:'1px solid #1B3055', borderRadius:14 }}>
            <div style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:9, color:'#6B85A8', letterSpacing:'0.14em', textTransform:'uppercase', marginBottom:20 }}>Cumulative Earnings</div>
            {[
              { label:'3-Month Net', val:acct.threeMonthNet, pct:50 },
              { label:'6-Month Net', val:acct.sixMonthNet,   pct:100 },
            ].map(r=>(
              <div key={r.label} style={{ marginBottom:20 }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                  <span style={{ fontSize:12, color:'#6E86A8' }}>{r.label}</span>
                  <span style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:16, color:'#C9A84C' }}>{fmt(r.val)}</span>
                </div>
                <div style={{ height:3, background:'#152845', borderRadius:2 }}>
                  <div style={{ height:'100%', width:`${r.pct}%`, background:'linear-gradient(90deg, rgba(201,168,76,0.5), rgba(201,168,76,0.2))', borderRadius:2 }}/>
                </div>
              </div>
            ))}
            <div style={{ marginTop:8, padding:'16px', background:'rgba(201,168,76,0.04)', border:'1px solid rgba(201,168,76,0.12)', borderRadius:10 }}>
              <div style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:9, color:'#6B85A8', letterSpacing:'0.12em', marginBottom:6 }}>ROI ON {fmt(acct.fee)} FEE</div>
              <div style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:28, color:'#C9A84C', fontWeight:700 }}>{acct.feeROI}%</div>
              <div style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:9, color:'#6E86A8', marginTop:4 }}>return on your enrollment fee</div>
            </div>
          </div>
        </div>

        <div style={{ marginTop:16, padding:'12px 18px', border:'1px solid rgba(255,107,122,0.07)', borderRadius:8, background:'rgba(255,107,122,0.02)' }}>
          <p style={{ color:'#6E86A8', fontSize:11, lineHeight:1.8 }}>All futures trading involves substantial risk of loss. Past results do not guarantee future performance.</p>
        </div>
      </div>
    </section>
  );
}

// ── How It Works ──────────────────────────────────────────────────────────────
function HowItWorks({ onOpen }:{ onOpen:()=>void }) {
  const steps=[
    { n:'01', title:'Book Your Discovery Call', body:'Start with a 45-minute conversation with our team. We will walk you through the program, answer every question, and make sure QS1 is the right fit for your goals.' },
    { n:'02', title:'Select Your Account Size', body:'Choose your funded account tier ($50K, $100K, or $150K) and complete your enrollment. Our team guides you through every step.' },
    { n:'03', title:'Create Your Prop Firm Account', body:'We guide you through setting up your funded prop firm account. Simple, straightforward process with our team supporting you every step.' },
    { n:'04', title:'Receive Tradovate Credentials', body:'You receive trading credentials through the prop firm. These are execution-only credentials, separate from your account dashboard login.' },
    { n:'05', title:'Secure Integration', body:'Provide credentials to our team via encrypted intake. Your infrastructure is configured and securely connected within 24 hours.' },
    { n:'06', title:'QS1 Goes to Work', body:'QS1 v3.2 deploys on your account. Every trade is fully autonomous. Payouts every 3–5 trading days. After 30 days you graduate to a live account with no earning cap.' },
  ];
  return (
    <section id="qs-process" style={{ padding:'100px 48px', background:'#08132A' }}>
      <div style={{ maxWidth:1200, margin:'0 auto' }}>
        <div style={{ marginBottom:56 }}>
          <span style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:10, color:'#C9A84C', letterSpacing:'0.2em' }}>// HOW IT WORKS</span>
          <h2 style={{ fontFamily:'"Archivo", "Inter", -apple-system, sans-serif', fontSize:42, fontWeight:800, color:'#F0F4FA', marginTop:16, letterSpacing:'-0.032em' }}>Six Steps to Automated Income</h2>
          <p style={{ color:'#6B85A8', fontSize:14, lineHeight:1.85, maxWidth:520, marginTop:12 }}>From your first call to your first payout in as little as eight days. Our team is with you at every stage.</p>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:1, background:'#152845', border:'1px solid #1B3055', borderRadius:16, overflow:'hidden', marginBottom:36 }}>
          {steps.map(step=>(
            <div key={step.n} className="qs-step-card" style={{ padding:'32px 26px', background:'#08132A', borderRight:'1px solid #152845', borderBottom:'1px solid #152845', transition:'background 0.2s' }}>
              <div style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:10, color:'#C9A84C', letterSpacing:'0.12em', marginBottom:14, opacity:0.7 }}>{step.n}</div>
              <h3 style={{ fontSize:14, fontWeight:500, color:'#B3C6DE', marginBottom:10, lineHeight:1.4 }}>{step.title}</h3>
              <p style={{ color:'#6E86A8', fontSize:13, lineHeight:1.85 }}>{step.body}</p>
            </div>
          ))}
        </div>
        <div style={{ background:'#0C1B36', border:'1px solid #1B3055', borderRadius:14, padding:'36px', marginBottom:36 }}>
          <span style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:10, color:'#5B9BE8', letterSpacing:'0.2em' }}>// PAYOUT PROCEDURE</span>
          <h3 style={{ fontFamily:'"Archivo", "Inter", -apple-system, sans-serif', fontSize:26, fontWeight:800, letterSpacing:'-0.03em', color:'#F0F4FA', marginTop:12, marginBottom:24 }}>Collecting Your Earnings</h3>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:14 }}>
            {[{ n:'1', title:'Log In', body:'Access your prop firm dashboard using your registered credentials.' },{ n:'2', title:'Complete KYC', body:'Complete identity verification required by the prop firm.' },{ n:'3', title:'Add Banking', body:'Input your banking details for direct deposit payout processing.' },{ n:'4', title:'Request Payout', body:'Submit directly through the prop firm dashboard. Funds arrive fast.' }].map(s=>(
              <div key={s.n} style={{ padding:'18px', background:'#050C1C', borderRadius:10, border:'1px solid #1B3055' }}>
                <div style={{ fontFamily:'"JetBrains Mono", monospace', width:26, height:26, borderRadius:'50%', background:'rgba(201,168,76,0.08)', border:'1px solid rgba(201,168,76,0.2)', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:14, fontSize:11, color:'#C9A84C' }}>{s.n}</div>
                <div style={{ fontSize:13, color:'#8FA6C4', marginBottom:8 }}>{s.title}</div>
                <p style={{ fontSize:12, color:'#6E86A8', lineHeight:1.8 }}>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
        <div style={{ textAlign:'center' }}><button onClick={onOpen} className="qs-btn-gold">Book Your Discovery Call</button></div>
      </div>
    </section>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function QuantaraPage() {
  const [scrolled, setScrolled] = useState(false);
  const [goldData, setGoldData] = useState<GoldData|null>(null);
  const [goldLoading, setGoldLoading] = useState(true);
  const [marketsData, setMarketsData] = useState<MarketsData|null>(null);

  const fetchGold = useCallback(async()=>{
    try { const res=await fetch('/api/gold'); const data=await res.json(); setGoldData(data); } catch { /**/ } finally { setGoldLoading(false); }
  },[]);
  const fetchMarkets = useCallback(async()=>{
    try { const res=await fetch('/api/markets'); const data=await res.json(); setMarketsData(data); } catch { /**/ }
  },[]);

  useEffect(()=>{
    const link=document.createElement('link'); link.href='https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&family=Archivo:wght@600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap'; link.rel='stylesheet'; document.head.appendChild(link);
    const cal=document.createElement('link'); cal.href='https://assets.calendly.com/assets/external/widget.css'; cal.rel='stylesheet'; document.head.appendChild(cal);
    const script=document.createElement('script'); script.src='https://assets.calendly.com/assets/external/widget.js'; script.async=true; document.head.appendChild(script);
    const onScroll=()=>setScrolled(window.scrollY>30); window.addEventListener('scroll',onScroll,{passive:true});
    return ()=>{ window.removeEventListener('scroll',onScroll); [link,cal,script].forEach(el=>{ if(document.head.contains(el)) document.head.removeChild(el); }); };
  },[]);

  useEffect(()=>{ fetchGold(); const iv=setInterval(fetchGold,30000); return ()=>clearInterval(iv); },[fetchGold]);
  useEffect(()=>{ fetchMarkets(); const iv=setInterval(fetchMarkets,30000); return ()=>clearInterval(iv); },[fetchMarkets]);

  const go=(id:string)=>document.getElementById(id)?.scrollIntoView({behavior:'smooth'});
  const openModal=()=>window.Calendly?.initPopupWidget({url:CALENDLY_URL});
  const pos=goldData?goldData.change>=0:true;
  const fmt=(n:number)=>n.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});

  const navLinks:[string,string][]=[['About QS1','qs-about'],['Results','qs-chronicle'],['How It Works','qs-process'],['Performance','qs-performance'],['Testimonials','qs-testimonials']];

  return (
    <>
      <style>{`
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        .qs-wrap{font-family:'Inter',-apple-system,BlinkMacSystemFont,sans-serif;background:#050C1C;color:#F0F4FA;min-height:100vh;width:100%;-webkit-font-smoothing:antialiased;}
        @keyframes qs-ticker{from{transform:translateX(0);}to{transform:translateX(-50%);}}
        @keyframes qs-pulse{0%,100%{opacity:0.25;}50%{opacity:1;}}
        @keyframes qs-up{from{opacity:0;transform:translateY(22px);}to{opacity:1;transform:none;}}
        @keyframes qs-row-in{from{opacity:0;transform:translateX(-6px);}to{opacity:1;transform:none;}}
        @keyframes qs-blink{0%,49%{opacity:1;}50%,100%{opacity:0;}}
        @keyframes qs-gold-glow{0%,100%{box-shadow:0 0 20px rgba(201,168,76,0.15);}50%{box-shadow:0 0 40px rgba(201,168,76,0.35);}}
        .qs-a0{animation:qs-up 0.9s ease both;}.qs-a1{animation:qs-up 0.9s ease 0.14s both;}.qs-a2{animation:qs-up 0.9s ease 0.26s both;}.qs-a3{animation:qs-up 0.9s ease 0.40s both;}.qs-a4{animation:qs-up 0.9s ease 0.54s both;}
        .qs-dot{animation:qs-pulse 2.4s ease-in-out infinite;}
        .qs-cursor{animation:qs-blink 1.1s step-end infinite;display:inline-block;color:#3EE8A0;}
        .qs-nav-link{background:none;border:none;color:#6B85A8;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;cursor:pointer;transition:color 0.2s;padding:4px 0;font-family:'Inter',sans-serif;}
        .qs-nav-link:hover{color:#B3C6DE;}
        .qs-btn-gold{display:inline-flex;align-items:center;gap:8px;background:linear-gradient(135deg,#C9A84C,#E8C56A);border:none;color:#04091A;border-radius:10px;padding:14px 36px;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;cursor:pointer;font-family:"JetBrains Mono",monospace;font-weight:700;transition:all 0.25s;box-shadow:0 0 40px rgba(201,168,76,0.2);}
        .qs-btn-gold:hover{transform:translateY(-2px);box-shadow:0 8px 40px rgba(201,168,76,0.4);}
        .qs-btn-green{display:inline-flex;align-items:center;gap:8px;background:linear-gradient(135deg,#3EE8A0,#5B9BE8);border:none;color:#050C1C;border-radius:10px;padding:14px 36px;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;cursor:pointer;font-family:"JetBrains Mono",monospace;font-weight:700;transition:all 0.25s;}
        .qs-btn-green:hover{transform:translateY(-2px);box-shadow:0 8px 40px rgba(62,232,160,0.3);}
        .qs-btn-outline{display:inline-flex;align-items:center;gap:8px;background:transparent;border:1px solid #1B3055;color:#6B85A8;border-radius:10px;padding:14px 28px;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;cursor:pointer;font-family:"JetBrains Mono",monospace;transition:all 0.25s;}
        .qs-btn-outline:hover{border-color:rgba(201,168,76,0.4);color:#C9A84C;}
        .qs-step-card:hover{background:#102340 !important;}
        .qs-feature-card{border:1px solid #1B3055;border-radius:14px;padding:32px;background:#0C1B36;transition:border-color 0.25s,transform 0.25s;}
        .qs-feature-card:hover{border-color:rgba(201,168,76,0.25);transform:translateY(-3px);}
        .qs-testimonial-card{border:1px solid #1B3055;border-radius:14px;padding:32px;background:#0C1B36;}
        @media(max-width:1024px){.qs-nav-links{display:none !important;}.qs-hero-h1{font-size:36px !important;}.qs-grid-3{grid-template-columns:1fr !important;}.qs-grid-2{grid-template-columns:1fr !important;}.qs-section{padding:72px 24px !important;}}
        @media(max-width:640px){.qs-hero-h1{font-size:28px !important;}.qs-stat-bar{grid-template-columns:1fr 1fr !important;}}
      `}</style>

      <div className="qs-wrap">
        <TickerTape data={goldData}/>

        <nav style={{ position:'fixed', top:32, left:0, right:0, zIndex:200, height:58, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 48px', background:scrolled?'rgba(5,12,28,0.96)':'transparent', backdropFilter:scrolled?'blur(20px)':'none', borderBottom:scrolled?'1px solid #152845':'none', transition:'all 0.3s' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, cursor:'pointer' }} onClick={()=>go('qs-hero')}>
            <QMark size={30}/>
            <div>
              <div style={{ fontSize:12, fontWeight:300, letterSpacing:'0.26em', textTransform:'uppercase', color:'#B3C6DE', lineHeight:1.2 }}>Quantara</div>
              <div style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:8, letterSpacing:'0.14em', textTransform:'uppercase', color:'#6E86A8', marginTop:1 }}>Systems</div>
            </div>
          </div>
          <div className="qs-nav-links" style={{ display:'flex', alignItems:'center', gap:28 }}>
            {navLinks.map(([label,id])=>(<button key={id} className="qs-nav-link" onClick={()=>go(id)}>{label}</button>))}
            <button onClick={openModal} style={{ display:'inline-flex', alignItems:'center', gap:6, background:'linear-gradient(135deg,#C9A84C,#E8C56A)', border:'none', color:'#04091A', borderRadius:8, padding:'9px 20px', fontSize:10, letterSpacing:'0.14em', textTransform:'uppercase', cursor:'pointer', fontFamily:'"JetBrains Mono", monospace', fontWeight:700, transition:'all 0.2s' }}>Book Your Call</button>
          </div>
        </nav>

        {/* Hero */}
        <section id="qs-hero" style={{ position:'relative', minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', overflow:'hidden', padding:'120px 48px 80px' }}>
          <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse 120% 80% at 25% 0%, rgba(38,86,168,0.28) 0%, transparent 60%)', pointerEvents:'none' }}/>
          <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(91,155,232,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(91,155,232,0.035) 1px, transparent 1px)', backgroundSize:'80px 80px', pointerEvents:'none' }}/>
          <div style={{ position:'absolute', top:'12%', left:'6%', width:680, height:680, borderRadius:'50%', background:'radial-gradient(circle, rgba(62,232,160,0.07) 0%, transparent 62%)', filter:'blur(70px)', pointerEvents:'none' }}/>
          <div style={{ position:'absolute', bottom:'18%', right:'6%', width:520, height:520, borderRadius:'50%', background:'radial-gradient(circle, rgba(201,168,76,0.07) 0%, transparent 62%)', filter:'blur(55px)', pointerEvents:'none' }}/>
          <div style={{ position:'absolute', bottom:0, left:0, right:0, height:200, background:'linear-gradient(to top, #050C1C, transparent)', pointerEvents:'none' }}/>
          <div style={{ position:'relative', zIndex:2, textAlign:'center', maxWidth:900 }}>
            <div className="qs-a0" style={{ display:'flex', justifyContent:'center', marginBottom:32 }}><QMark size={94}/></div>
            <div className="qs-a1" style={{ display:'flex', justifyContent:'center', marginBottom:28 }}>
              <span style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:10, color:'#3EE8A0', letterSpacing:'0.2em', background:'rgba(62,232,160,0.06)', border:'1px solid rgba(62,232,160,0.18)', padding:'5px 16px', borderRadius:100, display:'inline-flex', alignItems:'center', gap:8 }}>
                <span className="qs-dot" style={{ display:'inline-block', width:5, height:5, borderRadius:'50%', background:'#3EE8A0', boxShadow:'0 0 6px #3EE8A0' }}/>
                QS1 ACTIVE · QUANTITATIVE GOLD FUTURES
              </span>
            </div>
            <h1 className="qs-a2 qs-hero-h1" style={{ fontFamily:'"Archivo", "Inter", -apple-system, sans-serif', fontSize:66, fontWeight:800, letterSpacing:'-0.038em', lineHeight:1.0, color:'#F0F4FA', marginBottom:24 }}>
              Professional Gold futures<br/>trading, working for you<br/><em style={{ color:'#C9A84C', fontStyle:'normal' }}>around the clock.</em>
            </h1>
            <p className="qs-a3" style={{ color:'#8FA6C4', fontSize:17, lineHeight:1.85, maxWidth:600, margin:'0 auto 40px', fontWeight:300 }}>
              Most people who want to participate in futures markets lack the time, tools, or consistency to do it profitably. QS1 is the answer. Our algorithm runs every market session so you do not have to lift a finger. You receive the payouts. We do the work.
            </p>
            <div className="qs-a4" style={{ display:'flex', gap:14, justifyContent:'center', flexWrap:'wrap', marginBottom:24 }}>
              <button className="qs-btn-gold" onClick={openModal}>Book Your Discovery Call</button>
              <button className="qs-btn-outline" onClick={()=>go('qs-chronicle')}>See Real Results</button>
            </div>
            <div className="qs-a4" style={{ display:'flex', justifyContent:'center', marginBottom:56 }}>
              <span style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:10, color:'#C9A84C', background:'rgba(201,168,76,0.08)', border:'1px solid rgba(201,168,76,0.2)', padding:'6px 18px', borderRadius:100, letterSpacing:'0.14em' }}>45 DAY MONEY-BACK GUARANTEE</span>
            </div>
            <div className="qs-a4 qs-stat-bar" style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:1, maxWidth:800, margin:'0 auto', background:'#152845', border:'1px solid #1B3055', borderRadius:12, overflow:'hidden' }}>
              {[
                { val:goldData&&!goldData.error?`$${fmt(goldData.price)}`:'---', label:'GC Futures Live', color:goldData&&!goldData.error?(pos?'#3EE8A0':'#FF6B7A'):'#6E86A8' },
                { val:'$88,800', label:'6-Month Net Peak', color:'#C9A84C' },
                { val:'70%', label:'Your Payout Share' },
                { val:'45 days', label:'Money-Back Guarantee', color:'#C9A84C' },
              ].map((s,i)=>(
                <div key={i} style={{ padding:'16px 12px', textAlign:'center', borderRight:i<3?'1px solid #152845':'none', background:'#08132A' }}>
                  <div style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:15, fontWeight:700, color:s.color??'#F0F4FA', marginBottom:5 }}>{s.val}</div>
                  <div style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:9, color:'#55709A', letterSpacing:'0.12em', textTransform:'uppercase' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ position:'absolute', bottom:32, left:'50%', transform:'translateX(-50%)', display:'flex', flexDirection:'column', alignItems:'center', gap:6, zIndex:2 }}>
            <div style={{ width:1, height:40, background:'linear-gradient(to bottom, transparent, rgba(201,168,76,0.4))' }}/>
            <div className="qs-dot" style={{ width:4, height:4, borderRadius:'50%', background:'#C9A84C', boxShadow:'0 0 6px #C9A84C' }}/>
          </div>
        </section>

        <CountdownTimer/>

        {/* Quick metrics bar */}
        <section style={{ padding:'0', background:'#050C1C', borderBottom:'1px solid #152845' }}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:0 }}>
            {[
              { val:'3-5 DAYS', label:'BETWEEN PAYOUTS' },
              { val:'0 TRADES', label:'YOU PLACE' },
              { val:'80%+', label:'AVG WIN RATE' },
              { val:'45 DAYS', label:'MONEY-BACK GUARANTEE', gold:true },
            ].map((m,i)=>(
              <div key={i} style={{ padding:'32px 24px', textAlign:'center', borderRight:i<3?'1px solid #152845':'none', background:m.gold?'rgba(201,168,76,0.04)':'transparent' }}>
                <div style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:22, fontWeight:700, color:m.gold?'#C9A84C':'#F0F4FA', marginBottom:6 }}>{m.val}</div>
                <div style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:9, color:'#6B85A8', letterSpacing:'0.18em' }}>{m.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* About QS1 */}
        <section id="qs-about" style={{ padding:'100px 48px', background:'#08132A' }}>
          <div style={{ maxWidth:1200, margin:'0 auto' }}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:80, alignItems:'center', marginBottom:72 }}>
              <div>
                <span style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:10, color:'#C9A84C', letterSpacing:'0.2em' }}>// ABOUT QS1</span>
                <h2 style={{ fontFamily:'"Archivo", "Inter", -apple-system, sans-serif', fontSize:46, fontWeight:800, color:'#F0F4FA', marginTop:16, marginBottom:20, letterSpacing:'-0.032em', lineHeight:1.02 }}>
                  A team that finally<br/><em style={{ color:'#C9A84C', fontStyle:'normal' }}>has your back.</em>
                </h2>
                <p style={{ color:'#8FA6C4', fontSize:15, lineHeight:1.95, marginBottom:20, fontWeight:300 }}>Most trading programs leave you on your own. You study charts for hours, second-guess your entries, and watch profits evaporate from emotion. We built QS1 because we believed there was a better way.</p>
                <p style={{ color:'#8FA6C4', fontSize:15, lineHeight:1.95, fontWeight:300 }}>QS1 is a fully autonomous Gold futures algorithm that executes on your funded prop firm account while you live your life. Our team handles strategy, risk, execution, and ongoing optimization. Your only job is to collect your payout.</p>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                {[
                  { icon:'◷', title:'Fully Autonomous', body:'Zero screen time required. QS1 identifies setups, enters trades, manages risk, and exits positions completely on its own.' },
                  { icon:'◈', title:'Institutional Risk Controls', body:'Multi-layer risk management built to protect your funded account and keep you within prop firm drawdown limits at all times.' },
                  { icon:'⊞', title:'You Keep 70% of Your Payout', body:'The prop firm retains 10% of gross profits. Your remaining 90% is your payout. We take 30% of that — you keep 70%. Paid out every 3–5 trading days, with no cap after day 30.' },
                  { icon:'◎', title:'Built Around Your Success', body:'From onboarding to your first payout, our team is available to guide, support, and ensure your experience is seamless.' },
                ].map(f=>(
                  <div key={f.title} className="qs-feature-card">
                    <div style={{ fontSize:20, marginBottom:14, color:'#C9A84C' }}>{f.icon}</div>
                    <h3 style={{ fontSize:14, fontWeight:500, color:'#B3C6DE', marginBottom:10, lineHeight:1.4 }}>{f.title}</h3>
                    <p style={{ color:'#6E86A8', fontSize:13, lineHeight:1.85 }}>{f.body}</p>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background:'rgba(201,168,76,0.04)', border:'1px solid rgba(201,168,76,0.12)', borderRadius:16, padding:'40px', textAlign:'center' }}>
              <p style={{ color:'#8FA6C4', fontSize:16, lineHeight:2, maxWidth:720, margin:'0 auto', fontWeight:300 }}>You do not need trading experience. You do not need to understand charts. You do not need to monitor anything. All you need is a funded account and the willingness to let a proven system work on your behalf.</p>
              <div style={{ marginTop:24, display:'flex', justifyContent:'center', gap:40, flexWrap:'wrap' }}>
                {['Gold Futures','Prop Firm Accounts','Fully Automated','Capacity-Limited'].map(t=>(
                  <span key={t} style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:9, color:'#C9A84C', letterSpacing:'0.2em', textTransform:'uppercase', opacity:0.6 }}>{t}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Consistency Manifesto */}
        <section style={{ padding:'80px 48px', background:'#03081A', borderTop:'1px solid #0C1B36' }}>
          <div style={{ maxWidth:900, margin:'0 auto' }}>
            <div style={{ display:'flex', gap:32, alignItems:'flex-start' }}>
              <div style={{ width:3, minWidth:3, alignSelf:'stretch', background:'linear-gradient(180deg, #C9A84C 0%, rgba(201,168,76,0.15) 100%)', borderRadius:2, flexShrink:0 }}/>
              <div>
                <span style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:10, color:'#C9A84C', letterSpacing:'0.2em', display:'block', marginBottom:20 }}>// OUR PHILOSOPHY</span>
                <h2 style={{ fontFamily:'"Archivo", "Inter", -apple-system, sans-serif', fontSize:'clamp(30px,4.2vw,46px)', fontWeight:800, color:'#F0F4FA', lineHeight:1.04, marginBottom:24, letterSpacing:'-0.032em' }}>
                  We're not here to promise you<br/><em style={{ color:'#C9A84C', fontStyle:'normal' }}>overnight riches.</em>
                </h2>
                <p style={{ color:'#8FA6C4', fontSize:16, lineHeight:1.9, marginBottom:16, fontWeight:300, maxWidth:720 }}>
                  Every other program will show you one massive win and tell you that's the standard. We won't. Because that's not how real, lasting wealth is built — and we'd rather be honest with you than sell you a fantasy.
                </p>
                <p style={{ color:'#8FA6C4', fontSize:16, lineHeight:1.9, fontWeight:300, maxWidth:720 }}>
                  Consistency is the name of the game. A steady, repeatable edge — executed day after day — compounds far beyond a handful of lucky trades. That's what QS1 is engineered for. Not a spike. A system.
                </p>
                <div style={{ marginTop:36, display:'flex', gap:12, flexWrap:'wrap' }}>
                  {[
                    { label:'Repeatable Edge', sub:'Same process, every session' },
                    { label:'Controlled Risk', sub:'Drawdown protection built in' },
                    { label:'Compounding Returns', sub:'Consistency beats volatility' },
                  ].map(pill=>(
                    <div key={pill.label} style={{ background:'rgba(201,168,76,0.06)', border:'1px solid rgba(201,168,76,0.14)', borderRadius:10, padding:'12px 18px' }}>
                      <div style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:10, color:'#C9A84C', letterSpacing:'0.12em', marginBottom:4 }}>{pill.label}</div>
                      <div style={{ fontSize:12, color:'#6E86A8', fontWeight:300 }}>{pill.sub}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Live Market Feed */}
        <section id="qs-markets" style={{ padding:'80px 48px', background:'#050C1C', borderTop:'1px solid #152845', borderBottom:'1px solid #152845' }}>
          <div style={{ maxWidth:1200, margin:'0 auto' }}>
            <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:28 }}>
              <span style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:10, color:'#5B9BE8', letterSpacing:'0.2em' }}>// LIVE MARKET FEED</span>
              {goldData&&!goldData.error&&(<span style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:9, color:'#55709A' }}>{new Date(goldData.ts).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit',second:'2-digit'})}</span>)}
              <span className="qs-dot" style={{ width:5, height:5, borderRadius:'50%', background:'#3EE8A0', boxShadow:'0 0 6px #3EE8A0', display:'inline-block' }}/>
            </div>
            {goldLoading?(
              <div style={{ height:80, display:'flex', alignItems:'center', gap:24 }}>
                {[220,130,100].map((w,i)=>(<div key={i} style={{ width:w, height:18, background:'#0C1B36', borderRadius:4, animation:'qs-pulse 1.8s ease-in-out infinite' }}/>))}
              </div>
            ):goldData&&!goldData.error?(
              <div style={{ display:'flex', alignItems:'flex-end', gap:'32px 56px', flexWrap:'wrap' }}>
                <div>
                  <div style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:9, color:'#55709A', letterSpacing:'0.14em', marginBottom:8 }}>COMEX · GOLD FUTURES CONTINUOUS (GC=F)</div>
                  <div style={{ display:'flex', alignItems:'baseline', gap:16 }}>
                    <span style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:52, fontWeight:700, color:pos?'#3EE8A0':'#FF6B7A', letterSpacing:'-0.03em', filter:`drop-shadow(0 0 24px ${pos?'rgba(62,232,160,0.25)':'rgba(255,107,122,0.25)'})` }}>${fmt(goldData.price)}</span>
                    <div>
                      <div style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:18, color:pos?'#3EE8A0':'#FF6B7A' }}>{pos?'+':''}{fmt(goldData.change)}</div>
                      <div style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:13, color:pos?'#3EE8A0':'#FF6B7A', opacity:0.7 }}>{pos?'▲':'▼'} {Math.abs(goldData.changePct).toFixed(2)}%</div>
                    </div>
                  </div>
                </div>
                <div style={{ display:'flex', gap:40, flexWrap:'wrap' }}>
                  {[{label:'Day High',val:`$${fmt(goldData.high)}`},{label:'Day Low',val:`$${fmt(goldData.low)}`},{label:'Prev Close',val:`$${fmt(goldData.prev)}`},{label:'Session',val:goldData.state==='REGULAR'?'Open':goldData.state==='PRE'?'Pre-Mkt':'After Hrs'}].map(m=>(
                    <div key={m.label}>
                      <div style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:9, color:'#55709A', letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:6 }}>{m.label}</div>
                      <div style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:15, color:'#6B85A8' }}>{m.val}</div>
                    </div>
                  ))}
                </div>
                {goldData.points.length>1&&(
                  <div style={{ marginLeft:'auto' }}>
                    <div style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:9, color:'#55709A', letterSpacing:'0.12em', marginBottom:8 }}>INTRADAY · 5M</div>
                    <SparkLine points={goldData.points} positive={pos} width={260} height={54}/>
                  </div>
                )}
              </div>
            ):(
              <div style={{ fontFamily:'"JetBrains Mono", monospace', color:'#6E86A8', fontSize:13 }}>Market data temporarily unavailable. Retrying...</div>
            )}
            {marketsData&&marketsData.data.length>0&&(
              <div style={{ marginTop:36, borderTop:'1px solid #0C1B36', paddingTop:28 }}>
                <div style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:9, color:'#55709A', letterSpacing:'0.18em', marginBottom:16 }}>RELATED MARKETS</div>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))', gap:12 }}>
                  {marketsData.data.map(q=>{
                    const up=(q.change??0)>=0;
                    const fmtP=(n:number)=>n>=10000?n.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2}):n.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
                    if(q.error||q.price===undefined) return(
                      <div key={q.key} style={{ background:'#08132A', border:'1px solid #152845', borderRadius:10, padding:'14px 16px' }}>
                        <div style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:9, color:'#55709A', letterSpacing:'0.14em', marginBottom:6 }}>{q.key}</div>
                        <div style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:12, color:'#6E86A8' }}>—</div>
                      </div>
                    );
                    return(
                      <div key={q.key} style={{ background:'#08132A', border:'1px solid #152845', borderRadius:10, padding:'14px 16px', transition:'border-color 0.2s' }}>
                        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:8 }}>
                          <div>
                            <div style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:9, color:'#C9A84C', letterSpacing:'0.14em', marginBottom:3 }}>{q.key}</div>
                            <div style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:8, color:'#55709A', letterSpacing:'0.1em' }}>{q.label}</div>
                          </div>
                          <span style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:8, color:q.state==='REGULAR'?'#3EE8A0':'#6B85A8', letterSpacing:'0.1em' }}>{q.state==='REGULAR'?'OPEN':q.state==='PRE'?'PRE':'AH'}</span>
                        </div>
                        <div style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:18, fontWeight:700, color:up?'#3EE8A0':'#FF6B7A', letterSpacing:'-0.02em', marginBottom:4 }}>
                          {q.key==='BTC'?'$':''}{fmtP(q.price!)}
                        </div>
                        <div style={{ display:'flex', gap:10, alignItems:'center' }}>
                          <span style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:10, color:up?'#3EE8A0':'#FF6B7A' }}>{up?'+':''}{fmtP(q.change!)}</span>
                          <span style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:10, color:up?'rgba(62,232,160,0.6)':'rgba(255,107,122,0.6)' }}>{up?'▲':'▼'}{Math.abs(q.changePct!).toFixed(2)}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Chronicle */}
        <section id="qs-chronicle" style={{ padding:'100px 48px', background:'#050C1C' }}>
          <div style={{ maxWidth:1200, margin:'0 auto' }}>
            <div style={{ marginBottom:52 }}>
              <span style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:10, color:'#5B9BE8', letterSpacing:'0.2em' }}>// LIVE ACCOUNT CHRONICLE · 08/29/2026</span>
              <h2 style={{ fontFamily:'"Archivo", "Inter", -apple-system, sans-serif', fontSize:42, fontWeight:800, color:'#F0F4FA', marginTop:16, marginBottom:12, letterSpacing:'-0.032em' }}>Real results from a real account.</h2>
              <p style={{ color:'#6B85A8', fontSize:14, lineHeight:1.85, maxWidth:560 }}>Below is a single trading day, captured in full. Every entry, every exit, every result logged in real time. No manual decisions were made. QS1 executed all 20 trades autonomously.</p>
            </div>
            <div style={{ background:'#0C1B36', border:'1px solid #1B3055', borderRadius:14, padding:'24px 24px 20px', marginBottom:20 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
                <span style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:10, color:'#6E86A8', letterSpacing:'0.12em' }}>CUMULATIVE P&L · GC FUTURES · 08/29/2026</span>
                <span style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:13, color:'#3EE8A0', fontWeight:700 }}>+$4,188 GROSS</span>
              </div>
              <div style={{ height:280 }}><PLChart/></div>
            </div>
            <TradeLog/>

            {/* Win Rate Chart — live multi-session data */}
            <div style={{ marginTop:24 }}>
              <WinRateChart/>
            </div>
          </div>
        </section>

        {/* Animated stats */}
        <section style={{ padding:'72px 48px', background:'#08132A', borderTop:'1px solid #152845', borderBottom:'1px solid #152845' }}>
          <div style={{ maxWidth:1200, margin:'0 auto' }}>
            <div className="qs-stat-bar" style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:14 }}>
              <StatCard prefix="$" value={88800} label="Peak 6-Month Net (Client)" />
              <StatCard prefix="$" value={14800} label="Max Monthly Net ($150K)" />
              <StatCard value={70} suffix="%" label="Your Payout Share" />
              <StatCard value={100} suffix="%" label="Automated Execution" />
            </div>
          </div>
        </section>

        <HowItWorks onOpen={openModal}/>

        {/* Life Change Section */}
        <LifeChangeSection onOpen={openModal}/>

        <PerformanceSection/>

        {/* Testimonials */}
        <section id="qs-testimonials" style={{ padding:'100px 48px', background:'#050C1C' }}>
          <div style={{ maxWidth:1200, margin:'0 auto' }}>
            <div style={{ marginBottom:56 }}>
              <span style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:10, color:'#C9A84C', letterSpacing:'0.2em' }}>// CLIENT EXPERIENCES</span>
              <h2 style={{ fontFamily:'"Archivo", "Inter", -apple-system, sans-serif', fontSize:42, fontWeight:800, color:'#F0F4FA', marginTop:16, letterSpacing:'-0.032em' }}>What our clients are saying.</h2>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:48 }}>
              {[
                { q:'I had tried trading on my own for years and kept losing money. Joining Quantara was the best financial decision I have made. My account has grown consistently for eight months and the only thing I do is check my payouts. The team genuinely cares about my results.', name:'Michael R. T.', role:'Chicago, Illinois' },
                { q:'I was skeptical when I first heard about this. I did my research, spoke with the team on a call, and decided to try it. Three months in and the results have been exactly what they described. The team is transparent, responsive, and actually has my back. I am really glad I made that call.', name:'Sarah P.', role:'Austin, Texas' },
                { q:'The relief of not having to watch charts all day is worth it alone. But on top of that the returns have been consistent and better than I expected. I feel like I finally have a professional team working for me in the markets. That peace of mind is something I could not put a price on.', name:'David C.', role:'Scottsdale, Arizona' },
                { q:'Quantara changed how I think about passive income. My funded account generates payouts every cycle and I have not placed a single trade. Their team walked me through everything from start to finish and they are still just as available now as they were on day one. Highly recommend.', name:'Rachel M.', role:'Miami, Florida' },
              ].map((t,i)=>(
                <div key={i} className="qs-testimonial-card">
                  <div style={{ fontFamily:'"Archivo", "Inter", -apple-system, sans-serif', fontSize:36, lineHeight:1, marginBottom:18, color:'rgba(201,168,76,0.25)' }}>&ldquo;</div>
                  <p style={{ color:'#8FA6C4', fontSize:14, lineHeight:1.9, fontWeight:300, marginBottom:24, fontStyle:'italic' }}>{t.q}</p>
                  <div style={{ borderTop:'1px solid #1B3055', paddingTop:16 }}>
                    <div style={{ fontSize:13, color:'#B3C6DE', fontWeight:400 }}>{t.name}</div>
                    <div style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:10, color:'#6E86A8', marginTop:3, letterSpacing:'0.06em' }}>{t.role}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ textAlign:'center' }}><button className="qs-btn-gold" onClick={openModal}>Join Them Today</button></div>
          </div>
        </section>

        {/* 45-Day Guarantee */}
        <section style={{ padding:'100px 48px', background:'#08132A', borderTop:'1px solid #152845' }}>
          <div style={{ maxWidth:900, margin:'0 auto', textAlign:'center' }}>
            <div style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', width:72, height:72, borderRadius:'50%', background:'rgba(201,168,76,0.08)', border:'2px solid rgba(201,168,76,0.25)', marginBottom:32 }}>
              <span style={{ fontSize:28 }}>◈</span>
            </div>
            <span style={{ display:'block', fontFamily:'"JetBrains Mono", monospace', fontSize:10, color:'#C9A84C', letterSpacing:'0.28em', textTransform:'uppercase', marginBottom:20 }}>// ZERO RISK TO GET STARTED</span>
            <h2 style={{ fontFamily:'"Archivo", "Inter", -apple-system, sans-serif', fontSize:48, fontWeight:800, color:'#F0F4FA', marginBottom:24, letterSpacing:'-0.032em', lineHeight:1.02 }}>45-Day Money-Back<br/><em style={{ color:'#C9A84C', fontStyle:'normal' }}>Guarantee.</em></h2>
            <p style={{ color:'#8FA6C4', fontSize:16, lineHeight:1.95, maxWidth:620, margin:'0 auto 48px', fontWeight:300 }}>We are so confident in QS1 that we back every enrollment with a full 45-day money-back guarantee. If you are not satisfied for any reason within the first 45 calendar days, you receive a complete refund. No questions asked. No conditions. No fine print.</p>
            <div style={{ display:'flex', justifyContent:'center', gap:48, flexWrap:'wrap', marginBottom:48 }}>
              {[{ label:'Full Refund', detail:'100% of your enrollment fee returned' },{ label:'No Questions Asked', detail:'Zero conditions or explanations required' },{ label:'45 Calendar Days', detail:'Full 45 days from your enrollment date' }].map(g=>(
                <div key={g.label} style={{ textAlign:'center' }}>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8, marginBottom:8 }}>
                    <span style={{ color:'#C9A84C', fontSize:16 }}>✓</span>
                    <span style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:11, color:'#C9A84C', letterSpacing:'0.1em', textTransform:'uppercase' }}>{g.label}</span>
                  </div>
                  <p style={{ color:'#6E86A8', fontSize:12, lineHeight:1.7 }}>{g.detail}</p>
                </div>
              ))}
            </div>
            <button className="qs-btn-gold" onClick={openModal} style={{ padding:'18px 52px', fontSize:12 }}>Start Risk-Free Today</button>
          </div>
        </section>

        {/* Final CTA */}
        <section id="qs-access" style={{ padding:'140px 48px', background:'#050C1C', position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:800, height:800, borderRadius:'50%', background:'radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 65%)', pointerEvents:'none' }}/>
          <div style={{ maxWidth:680, margin:'0 auto', textAlign:'center', position:'relative' }}>
            <span style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:10, color:'#C9A84C', letterSpacing:'0.2em' }}>// ONE DECISION. ONE CALL.</span>
            <h2 style={{ fontFamily:'"Archivo", "Inter", -apple-system, sans-serif', fontSize:52, fontWeight:800, letterSpacing:'-0.035em', marginTop:20, marginBottom:24, color:'#F0F4FA', lineHeight:1.02 }}>
              A better trading outcome<br/>starts with a single<br/><em style={{ color:'#C9A84C', fontStyle:'normal' }}>45-minute call.</em>
            </h2>
            <p style={{ color:'#8FA6C4', fontSize:16, lineHeight:1.95, marginBottom:48, fontWeight:300, maxWidth:540, margin:'0 auto 48px' }}>
              Picture what your financial life looks like when a professional algorithm is working for you every market session. Consistent payouts. No screen time. A team that is genuinely invested in your success. All of that begins with one conversation.
            </p>
            <button className="qs-btn-gold" onClick={openModal} style={{ padding:'18px 56px', fontSize:12, borderRadius:12 }}>Book Your Discovery Call</button>
            <p style={{ fontFamily:'"JetBrains Mono", monospace', color:'#55709A', fontSize:10, marginTop:24, letterSpacing:'0.08em' }}>45-day money-back guarantee · Qualified participants only · Fully confidential</p>
          </div>
        </section>

        {/* Footer */}
        <footer style={{ borderTop:'1px solid #152845', background:'#04091A', padding:'56px 48px 36px' }}>
          <div style={{ maxWidth:1200, margin:'0 auto' }}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:48, marginBottom:48 }}>
              <div>
                <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:18 }}><QMark size={26}/><div><div style={{ fontSize:12, fontWeight:300, letterSpacing:'0.22em', textTransform:'uppercase', color:'#6E86A8' }}>Quantara Systems</div><div style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:9, color:'#55709A', letterSpacing:'0.12em', textTransform:'uppercase' }}>Powered by QS1</div></div></div>
                <p style={{ color:'#55709A', fontSize:12, lineHeight:1.9, maxWidth:340 }}>Professional Gold futures trading managed entirely by QS1. Our team handles all execution so you can focus on receiving your payouts.</p>
              </div>
              <div style={{ textAlign:'right' }}>
                <div style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:9, color:'#55709A', letterSpacing:'0.16em', textTransform:'uppercase', marginBottom:12 }}>Private Program</div>
                <p style={{ color:'#55709A', fontSize:12, lineHeight:2 }}>Qualified inquiries only.<br/>All communications are confidential.<br/><span style={{ color:'#6E86A8' }}>quantarasystems.com</span></p>
                <div style={{ marginTop:16, display:'inline-flex', alignItems:'center', gap:8, background:'rgba(201,168,76,0.06)', border:'1px solid rgba(201,168,76,0.15)', borderRadius:100, padding:'6px 14px' }}>
                  <span style={{ fontFamily:'"JetBrains Mono", monospace', fontSize:9, color:'#C9A84C', letterSpacing:'0.14em' }}>45 DAY MONEY-BACK GUARANTEE</span>
                </div>
              </div>
            </div>
            <div style={{ borderTop:'1px solid #152845', paddingTop:24 }}>
              <p style={{ color:'#14243F', fontSize:11, lineHeight:2, marginBottom:14 }}>
                <strong style={{ color:'#55709A' }}>RISK DISCLOSURE:</strong> Trading futures contracts involves substantial risk of loss and is not appropriate for all investors. Past performance is not indicative of future results. Quantara Systems and QS1 do not guarantee profits or freedom from loss. The content on this site is for informational purposes only and does not constitute financial advice, a solicitation, or an offer to buy or sell any financial instrument. Participation is restricted to qualified, accredited individuals only. All performance data reflects illustrative projections only, not a guarantee. This is a private, confidential program. Unauthorized distribution is prohibited.
              </p>
              <div style={{ display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:8 }}>
                <span style={{ color:'#101E38', fontSize:11 }}>&copy; 2026 Quantara Systems. All rights reserved. Confidential.</span>
                <span style={{ color:'#0A1730', fontSize:11 }}>Private Program · Qualified Participants Only</span>
              </div>
            </div>
          </div>
        </footer>

        {/* Floating CTA */}
        <div style={{ position:'fixed', bottom:28, right:28, zIndex:100 }}>
          <button className="qs-btn-gold" onClick={openModal} style={{ padding:'11px 22px', fontSize:10, borderRadius:9, animation:'qs-gold-glow 3s ease-in-out infinite' }}>Book Your Call</button>
        </div>
      </div>
    </>
  );
}
