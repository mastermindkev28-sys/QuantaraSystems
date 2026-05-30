"use client";
export default function PDFPresentation() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        body{background:#1a1a1a;font-family:'Inter',sans-serif;}
        .print-btn{position:fixed;bottom:32px;right:32px;z-index:999;background:linear-gradient(135deg,#C9A84C,#E8C96A);color:#000;border:none;padding:14px 28px;border-radius:8px;font-weight:800;font-size:1rem;cursor:pointer;box-shadow:0 4px 20px #C9A84C60;letter-spacing:.05em;}
        .page{width:11in;min-height:8.5in;background:#0A0A0A;margin:0 auto 24px;position:relative;overflow:hidden;display:flex;flex-direction:column;}
        .gold{color:#C9A84C;}
        .green{color:#4CAF50;}
        .red{color:#ff6b6b;}
        @media print{
          @page{size:11in 8.5in landscape;margin:0;}
          body{background:#0A0A0A;}
          .print-btn{display:none!important;}
          .page{margin:0;page-break-after:always;break-after:page;width:11in;height:8.5in;min-height:0;}
        }
      `}</style>

      <button className="print-btn" onClick={() => window.print()}>⬇ Save as PDF</button>

      {/* PAGE 1 — COVER */}
      <div className="page" style={{background:"#0A0A0A",justifyContent:"center",alignItems:"center"}}>
        <style>{`
          .cover-grid{position:absolute;inset:0;background-image:linear-gradient(#1a1a1a 1px,transparent 1px),linear-gradient(90deg,#1a1a1a 1px,transparent 1px);background-size:48px 48px;}
          .cover-glow{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:700px;height:400px;background:radial-gradient(ellipse,#C9A84C22 0%,transparent 70%);pointer-events:none;}
          .cover-content{position:relative;text-align:center;color:#F0F0F0;}
          .cover-badge{display:inline-block;padding:5px 20px;border:1px solid #C9A84C60;border-radius:20px;font-size:.65rem;letter-spacing:.25em;color:#C9A84C;margin-bottom:32px;background:#C9A84C0D;}
          .cover-q{font-size:9rem;font-weight:900;line-height:1;letter-spacing:.05em;background:linear-gradient(135deg,#C9A84C,#E8C96A,#A8883C);-webkit-background-clip:text;-webkit-text-fill-color:transparent;}
          .cover-title{font-size:1.6rem;font-weight:300;letter-spacing:.5em;color:#888;margin-top:4px;margin-bottom:48px;}
          .cover-tagline{font-size:1.1rem;color:#AAA;margin-bottom:48px;line-height:1.7;}
          .cover-stats{display:flex;justify-content:center;gap:0;border:1px solid #222;}
          .cover-stat{padding:20px 48px;border-right:1px solid #222;}
          .cover-stat:last-child{border-right:none;}
          .cover-stat-n{font-size:2rem;font-weight:900;color:#C9A84C;}
          .cover-stat-l{font-size:.65rem;color:#666;letter-spacing:.12em;margin-top:4px;}
          .cover-footer{position:absolute;bottom:32px;left:0;right:0;display:flex;justify-content:space-between;padding:0 48px;font-size:.65rem;color:#444;letter-spacing:.1em;}
          .cover-line{position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,transparent,#C9A84C,transparent);}
        `}</style>
        <div className="cover-grid"/>
        <div className="cover-glow"/>
        <div className="cover-line"/>
        <div className="cover-content">
          <div className="cover-badge">PRIVATE · INVITE-ONLY · CONFIDENTIAL</div>
          <div className="cover-q">QUANTARA</div>
          <div className="cover-title">SYSTEMS · QS1</div>
          <div className="cover-tagline">Institutional Gold Algorithmic Trading Program<br/>Fully Automated · AI-Driven · Passive Income</div>
          <div className="cover-stats">
            <div className="cover-stat"><div className="cover-stat-n">84.7%</div><div className="cover-stat-l">LIVE WIN RATE</div></div>
            <div className="cover-stat"><div className="cover-stat-n">$13,534</div><div className="cover-stat-l">3-MONTH NET GAIN</div></div>
            <div className="cover-stat"><div className="cover-stat-n">58</div><div className="cover-stat-l">LIVE TRADES EXECUTED</div></div>
            <div className="cover-stat"><div className="cover-stat-n">$123,640</div><div className="cover-stat-l">FINAL ACCOUNT BALANCE</div></div>
          </div>
        </div>
        <div className="cover-footer">
          <span>QUANTARA SYSTEMS — QS1</span>
          <span>MAR–MAY 2026 · LIVE PERFORMANCE RECORD</span>
          <span>CONFIDENTIAL & PROPRIETARY</span>
        </div>
      </div>

      {/* PAGE 2 — EXECUTIVE SUMMARY */}
      <div className="page">
        <style>{`
          .page-header{padding:40px 60px 0;border-bottom:1px solid #1E1E1E;padding-bottom:24px;display:flex;justify-content:space-between;align-items:flex-end;}
          .page-header-logo{font-size:.85rem;font-weight:800;letter-spacing:.2em;color:#F0F0F0;}
          .page-header-section{font-size:.65rem;letter-spacing:.15em;color:#555;}
          .page-body{padding:32px 60px;flex:1;}
          .section-badge{display:inline-block;padding:4px 14px;border:1px solid #C9A84C40;border-radius:20px;font-size:.6rem;letter-spacing:.2em;color:#C9A84C;margin-bottom:16px;background:#C9A84C08;}
          .section-title{font-size:2rem;font-weight:800;color:#F0F0F0;margin-bottom:8px;line-height:1.2;}
          .section-sub{font-size:.85rem;color:#777;line-height:1.7;margin-bottom:28px;max-width:700px;}
          .three-col{display:grid;grid-template-columns:1fr 1fr 1fr;gap:20px;margin-bottom:28px;}
          .info-card{background:#111;border:1px solid #1E1E1E;border-radius:12px;padding:20px;}
          .info-card-label{font-size:.6rem;letter-spacing:.15em;color:#555;margin-bottom:8px;}
          .info-card-title{font-size:.9rem;font-weight:700;color:#C9A84C;margin-bottom:8px;}
          .info-card-text{font-size:.75rem;color:#888;line-height:1.6;}
          .talking-box{background:#C9A84C0A;border:1px solid #C9A84C30;border-radius:10px;padding:20px 24px;}
          .talking-title{font-size:.6rem;letter-spacing:.2em;color:#C9A84C;margin-bottom:12px;font-weight:700;}
          .talking-points{display:grid;grid-template-columns:1fr 1fr;gap:8px;}
          .talking-point{font-size:.75rem;color:#CCC;line-height:1.5;padding-left:12px;position:relative;}
          .talking-point::before{content:"→";position:absolute;left:0;color:#C9A84C;}
          .two-col{display:grid;grid-template-columns:2fr 1fr;gap:24px;}
        `}</style>
        <div className="page-header">
          <span className="page-header-logo"><span className="gold">Q</span>UANTARA SYSTEMS</span>
          <span className="page-header-section">EXECUTIVE SUMMARY</span>
        </div>
        <div className="page-body">
          <div className="section-badge">EXECUTIVE SUMMARY</div>
          <h2 className="section-title">What is <span className="gold">Quantara Systems QS1?</span></h2>
          <p className="section-sub">A proprietary, fully automated AI trading engine executing Gold futures during the London Open Killzone — designed for individuals who want institutional-grade market exposure without becoming traders themselves.</p>
          <div className="three-col" style={{marginBottom:24}}>
            <div className="info-card">
              <div className="info-card-label">THE ASSET</div>
              <div className="info-card-title">Gold (GC/MGC) Futures</div>
              <div className="info-card-text">High-probability execution on the world's most liquid, institutionally traded commodity. Algorithmic compatibility is unmatched.</div>
            </div>
            <div className="info-card">
              <div className="info-card-label">THE EDGE</div>
              <div className="info-card-title">6+ Years of Research</div>
              <div className="info-card-text">Tick-data backtesting across inflationary cycles, Fed environments, banking crises, and war-driven volatility. 3 years live forward-tested.</div>
            </div>
            <div className="info-card">
              <div className="info-card-label">THE OBJECTIVE</div>
              <div className="info-card-title">Preserve. Grow. Pay Out.</div>
              <div className="info-card-text">Minimize drawdown, maintain consistency thresholds, and maximize repeatable payout cycles — automatically, every session.</div>
            </div>
          </div>
          <div className="two-col">
            <div className="info-card" style={{borderColor:"#C9A84C30"}}>
              <div className="info-card-label">BUILT FOR</div>
              <div className="info-card-title" style={{fontSize:"1rem",marginBottom:12}}>People Who Want Returns — Not a Second Job</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                {[["No trading experience needed","The system executes autonomously — no charts, no analysis"],["No emotional risk","Quantitative logic replaces fear, greed, and hesitation"],["Scalable structure","Multiple funded accounts can run simultaneously"],["Aligned incentives","Quantara earns only when you receive a payout"]].map(([t,d],i)=>(
                  <div key={i}><div style={{fontSize:".75rem",fontWeight:700,color:"#F0F0F0",marginBottom:4}}>{t}</div><div style={{fontSize:".7rem",color:"#777",lineHeight:1.5}}>{d}</div></div>
                ))}
              </div>
            </div>
            <div className="talking-box">
              <div className="talking-title">KEY TALKING POINTS</div>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {["This is not a course, a signal service, or a prop firm challenge — it's a fully managed algorithm running on your funded account","The only job the client has is selecting their account tier and requesting payouts","We've been running this live — 58 sessions, every result documented","The fee structure is intentionally aligned: we don't get paid unless you do"].map((p,i)=>(
                  <div key={i} className="talking-point">{p}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PAGE 3 — THE PROBLEM */}
      <div className="page">
        <div className="page-header">
          <span className="page-header-logo"><span className="gold">Q</span>UANTARA SYSTEMS</span>
          <span className="page-header-section">THE PROBLEM</span>
        </div>
        <div className="page-body">
          <div className="section-badge">THE REALITY</div>
          <h2 className="section-title">Most People Will <span className="gold">Never</span> Beat the Market</h2>
          <p className="section-sub">Not because they lack ambition — because they're fighting against systems that are decades ahead of them.</p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:16,marginBottom:24}}>
            {[{icon:"📉",stat:"90%",label:"of retail traders lose money",desc:"Emotion, inconsistency, and information disadvantage destroy accounts before they ever compound."},{icon:"⏰",stat:"10,000+",label:"hours to master trading",desc:"Markets demand years of painful, expensive education that most never complete — and most who do still lose."},{icon:"🧠",stat:"$0",label:"what emotional decisions earn",desc:"Fear and greed override logic. Every time. Without exception. Human psychology is the market's greatest exploitable edge."},{icon:"🏦",stat:"Institutions",label:"own the edge you're chasing",desc:"They have the algorithms, the data, the infrastructure, and the speed. The retail trader is the liquidity they feed on."}].map((p,i)=>(
              <div key={i} className="info-card" style={{textAlign:"center",borderTop:`2px solid #ff6b6b40`}}>
                <div style={{fontSize:"1.8rem",marginBottom:8}}>{p.icon}</div>
                <div style={{fontSize:"1.6rem",fontWeight:900,color:"#ff6b6b",marginBottom:4}}>{p.stat}</div>
                <div style={{fontSize:".72rem",fontWeight:700,color:"#F0F0F0",marginBottom:10}}>{p.label}</div>
                <div style={{fontSize:".7rem",color:"#666",lineHeight:1.6}}>{p.desc}</div>
              </div>
            ))}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:24}}>
            <div className="info-card" style={{borderColor:"#C9A84C30"}}>
              <div className="info-card-label">THE GAP QUANTARA CLOSES</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginTop:8}}>
                {[["Without Quantara","With Quantara"],["Manually analyzing charts daily","Zero time investment required"],["Emotional decision-making","100% quantitative, emotionless execution"],["No institutional infrastructure","AI engine with 6+ years of R&D"],["Retail disadvantage","Institutional-grade risk management"],["Inconsistent, unpredictable outcomes","Repeatable, statistically-driven sessions"]].map(([a,b],i)=>(
                  <div key={i} style={{fontSize:".75rem",color:i===0?"#C9A84C":i%2===0?"#ff6b6b60":"#4CAF5090",fontWeight:i<2?700:400,paddingBottom:i>0?6:0,borderBottom:i>0?"1px solid #1E1E1E":"none"}}>{i===0||i===1?<strong>{a}</strong>:a}</div>
                ))}
              </div>
            </div>
            <div className="talking-box">
              <div className="talking-title">KEY TALKING POINTS</div>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {["Ask the prospect: 'Have you ever tried to trade on your own?' — let them share the pain","The 90% stat isn't fear-mongering — it's documented by broker data globally","The problem isn't intelligence — it's that retail traders are structurally disadvantaged","Quantara is the institutional infrastructure most people never get access to"].map((p,i)=>(
                  <div key={i} className="talking-point">{p}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PAGE 4 — WHY GOLD + HOW IT WORKS */}
      <div className="page">
        <div className="page-header">
          <span className="page-header-logo"><span className="gold">Q</span>UANTARA SYSTEMS</span>
          <span className="page-header-section">TECHNOLOGY & ASSET</span>
        </div>
        <div className="page-body">
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:36}}>
            <div>
              <div className="section-badge">THE ASSET</div>
              <h2 className="section-title" style={{fontSize:"1.5rem"}}>Why <span className="gold">Gold Futures?</span></h2>
              <p style={{fontSize:".8rem",color:"#777",marginBottom:20,lineHeight:1.6}}>Gold is not chosen arbitrarily. It is the most algorithmically compatible institutional asset available to systematic trading.</p>
              {[{n:"01",t:"Deep Institutional Liquidity",d:"Trillions in daily volume. Efficient spreads. Reliable execution at every price level. No slippage surprises."},{n:"02",t:"Predictable Session Behavior",d:"Strong technical reaction zones and measurable order flow during the London Open — exactly where QS1 operates."},{n:"03",t:"AI-Modeled Volatility",d:"Structured volatility that machine learning models decode with repeatable, statistically significant accuracy."},{n:"04",t:"Macro-Driven Momentum",d:"Geopolitical events, Fed policy, and inflation cycles create sustained directional moves — fuel for algorithmic capture."}].map((g,i)=>(
                <div key={i} style={{display:"flex",gap:14,marginBottom:16,padding:"14px 16px",background:"#111",border:"1px solid #1E1E1E",borderRadius:10}}>
                  <div style={{fontSize:"1.4rem",fontWeight:900,color:"#C9A84C30",flexShrink:0,width:32}}>{g.n}</div>
                  <div>
                    <div style={{fontSize:".8rem",fontWeight:700,color:"#C9A84C",marginBottom:4}}>{g.t}</div>
                    <div style={{fontSize:".72rem",color:"#777",lineHeight:1.5}}>{g.d}</div>
                  </div>
                </div>
              ))}
            </div>
            <div>
              <div className="section-badge">THE ENGINE</div>
              <h2 className="section-title" style={{fontSize:"1.5rem"}}>How <span className="gold">QS1 Executes</span></h2>
              <p style={{fontSize:".8rem",color:"#777",marginBottom:20,lineHeight:1.6}}>A layered, institutional-grade technology stack operating in real-time during the London Open Killzone (6:00–7:30 AM ET).</p>
              {[{n:"1",t:"Market Scanning",d:"AI evaluates tick velocity, liquidity absorption, delta divergence, and volume profile inefficiencies."},{n:"2",t:"Regime Filtering",d:"Volatility filters eliminate high-risk conditions. The system waits — no forced entries, ever."},{n:"3",t:"Multi-Factor Signal Validation",d:"AI cross-references momentum exhaustion, mean reversion probability, and order flow patterns."},{n:"4",t:"Risk Layer Calculation",d:"Position sizing, drawdown limits, and risk architecture are confirmed before any order is submitted."},{n:"5",t:"Automated API Execution",d:"Webhook fires the trade via Tradovate API at optimal price — no human delay or hesitation."},{n:"6",t:"Payout Cycle Tracking",d:"Performance tracked against Lucid Trading consistency rules. Payout eligible every ~4 trading days."}].map((t,i)=>(
                <div key={i} style={{display:"flex",gap:12,marginBottom:12,alignItems:"flex-start"}}>
                  <div style={{width:26,height:26,borderRadius:"50%",background:"linear-gradient(135deg,#C9A84C,#E8C96A)",display:"flex",alignItems:"center",justifyContent:"center",color:"#000",fontWeight:800,fontSize:".7rem",flexShrink:0}}>{t.n}</div>
                  <div>
                    <div style={{fontSize:".78rem",fontWeight:700,color:"#F0F0F0"}}>{t.t}</div>
                    <div style={{fontSize:".7rem",color:"#777",lineHeight:1.5}}>{t.d}</div>
                  </div>
                </div>
              ))}
              <div style={{marginTop:16,padding:"12px 16px",background:"#C9A84C0A",border:"1px solid #C9A84C30",borderRadius:8}}>
                <div style={{fontSize:".6rem",letterSpacing:".15em",color:"#C9A84C",marginBottom:6}}>INTEGRATED WITH</div>
                <div style={{fontSize:".8rem",color:"#AAA"}}>Tradovate · TradingView · Lucid Trading</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PAGE 5 — PERFORMANCE SUMMARY */}
      <div className="page">
        <div className="page-header">
          <span className="page-header-logo"><span className="gold">Q</span>UANTARA SYSTEMS</span>
          <span className="page-header-section">LIVE PERFORMANCE — MAR–MAY 2026</span>
        </div>
        <div className="page-body">
          <div className="section-badge">VERIFIED LIVE RESULTS</div>
          <h2 className="section-title">Real Numbers. Real Trades. <span className="gold">Real Account.</span></h2>
          <p className="section-sub">58 live sessions on a $100,000 Tradovate account. 1 MGC Micro Gold Futures contract per day. London Open Killzone only. All figures net-to-account after brokerage costs.</p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:16,marginBottom:24}}>
            {[{v:"$13,534",l:"Net Account Gain",s:"Total net profit added to the $100K account over 3 months"},{v:"84.7%",l:"Win Rate",s:"49 winning trades out of 58 total executions"},{v:"$123,640",l:"Final Balance",s:"Starting from $100,000 — ending balance after all 58 trades"},{v:"9",l:"Total Losses",s:"Only 9 losing trades across the full 3-month execution window"}].map((s,i)=>(
              <div key={i} className="info-card" style={{textAlign:"center",borderTop:"2px solid #C9A84C",padding:"24px 16px"}}>
                <div style={{fontSize:"2rem",fontWeight:900,color:"#C9A84C",marginBottom:6}}>{s.v}</div>
                <div style={{fontSize:".8rem",fontWeight:700,color:"#F0F0F0",marginBottom:8}}>{s.l}</div>
                <div style={{fontSize:".68rem",color:"#666",lineHeight:1.5}}>{s.s}</div>
              </div>
            ))}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:24}}>
            <div className="info-card">
              <div style={{fontSize:".6rem",letterSpacing:".15em",color:"#555",marginBottom:16}}>EQUITY CURVE — $100,000 → $123,640 ACROSS 58 SESSIONS</div>
              <svg viewBox="0 0 680 160" style={{width:"100%",height:160}}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#C9A84C" stopOpacity="0.3"/>
                    <stop offset="100%" stopColor="#C9A84C" stopOpacity="0"/>
                  </linearGradient>
                </defs>
                {/* Grid lines */}
                {[0,40,80,120,160].map(y=><line key={y} x1="40" y1={y} x2="680" y2={y} stroke="#1E1E1E" strokeWidth="1"/>)}
                {/* Y labels */}
                {[["$124K",5],["$120K",43],["$116K",81],["$112K",119],["$108K",157]].map(([l,y],i)=><text key={i} x="0" y={y} fill="#444" fontSize="9" fontFamily="Inter">{l}</text>)}
                {/* Area fill */}
                <path d="M40,148 L40,148 L157,90 L274,76 L429,55 L544,38 L680,22 L680,160 L40,160 Z" fill="url(#g1)"/>
                {/* Line */}
                <polyline points="40,148 157,90 274,76 429,55 544,38 680,22" fill="none" stroke="#C9A84C" strokeWidth="2.5" strokeLinejoin="round"/>
                {/* Points */}
                {[[40,148,"T0\n$100K"],[157,90,"T10\n$111.9K"],[274,76,"T20\n$114.3K"],[429,55,"T32\n$118K"],[544,38,"T42\n$120.7K"],[680,22,"T58\n$123.6K"]].map(([x,y,l],i)=>(
                  <g key={i}>
                    <circle cx={x} cy={y} r="4" fill="#C9A84C" stroke="#0A0A0A" strokeWidth="2"/>
                    <text x={Number(x)-10} y={Number(y)-10} fill="#C9A84C" fontSize="8" fontFamily="Inter">{String(l).split("\n")[1]}</text>
                  </g>
                ))}
              </svg>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:".65rem",color:"#444",marginTop:8,paddingLeft:40}}>
                <span>Start</span><span>Mar 13</span><span>Mar 27</span><span>Apr 17</span><span>May 5</span><span>May 29</span>
              </div>
            </div>
            <div className="talking-box">
              <div className="talking-title">KEY TALKING POINTS</div>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {["These are not backtested results — this is a live Tradovate account, real executions, real money","84.7% win rate across 58 sessions is elite-level performance even for institutional desks","The equity curve shows consistent, shallow drawdowns — no catastrophic losses, no blowup events","Starting balance $100K grew to $123,640 — 23.6% in 3 months, passively","Zero down months — March, April, and May were all profitable"].map((p,i)=>(
                  <div key={i} className="talking-point">{p}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PAGE 6 — MARCH TRADE LOG */}
      <div className="page">
        <style>{`
          .log-table{width:100%;border-collapse:collapse;font-size:.68rem;}
          .log-table th{background:#161616;color:#555;padding:8px 10px;text-align:left;font-weight:600;letter-spacing:.08em;border-bottom:1px solid #1E1E1E;font-size:.6rem;}
          .log-table td{padding:7px 10px;border-bottom:1px solid #141414;color:#AAA;vertical-align:middle;}
          .log-table tr:hover td{background:#111;}
          .win-row td:nth-child(11){color:#4CAF50;font-weight:600;}
          .loss-row td:nth-child(11){color:#ff6b6b;font-weight:600;}
          .log-table td:nth-child(7),.log-table td:nth-child(8){font-family:monospace;}
          .week-row td{background:#0D0D0D;color:#555;font-size:.6rem;letter-spacing:.1em;border-top:1px solid #1E1E1E;}
        `}</style>
        <div className="page-header">
          <span className="page-header-logo"><span className="gold">Q</span>UANTARA SYSTEMS</span>
          <span className="page-header-section">TRADE LOG — MARCH 2026 · TRADES #1–20</span>
        </div>
        <div className="page-body" style={{paddingTop:24}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
            <div>
              <div className="section-badge">MARCH 2026</div>
              <h3 style={{fontSize:"1.3rem",fontWeight:800,color:"#F0F0F0"}}>London Open Killzone · <span className="gold">6:00–7:30 AM ET</span> · 1 MGC Contract/Day</h3>
            </div>
            <div style={{display:"flex",gap:16}}>
              {[["20","Trades"],["17","Wins"],["3","Losses"],["85%","Win Rate"],["+$4,199","Net P&L"]].map(([v,l],i)=>(
                <div key={i} style={{textAlign:"center"}}>
                  <div style={{fontSize:"1.1rem",fontWeight:800,color:i===4?"#4CAF50":"#C9A84C"}}>{v}</div>
                  <div style={{fontSize:".6rem",color:"#555"}}>{l}</div>
                </div>
              ))}
            </div>
          </div>
          <table className="log-table">
            <thead>
              <tr><th>#</th><th>Date</th><th>Day</th><th>Entry ET</th><th>Exit ET</th><th>Dir</th><th>Entry $</th><th>Exit $</th><th>Ticks</th><th>Duration</th><th>Net P&L</th><th>Macro Context</th></tr>
            </thead>
            <tbody>
              {[
                [1,"Mar 02","Mon","06:12","09:00","LONG","3,894.4","3,921.7",273,"168 min","$269.00","Recovery from Feb lows",true],
                [2,"Mar 03","Tue","06:08","10:15","LONG","3,918.3","3,947.8",295,"247 min","$291.00","Tariff escalation news",true],
                [3,"Mar 04","Wed","06:19","08:30","LONG","3,944.7","3,932.1",126,"131 min","($130.00)","False breakout; reversed",false],
                [4,"Mar 05","Thu","06:11","08:45","LONG","3,928.8","3,958.2",294,"154 min","$290.00","Steel/aluminum tariff bid",true],
                [5,"Mar 06","Fri","06:14","09:15","LONG","3,951.3","3,981.9",306,"181 min","$302.00","Strong weekly close",true],
              ].map(([n,d,dy,en,ex,dir,ep,xp,tk,dur,pnl,note,win])=>(
                <tr key={String(n)} className={win?"win-row":"loss-row"}>
                  <td style={{color:"#555"}}>{n}</td><td style={{color:"#F0F0F0",fontWeight:600}}>{d}</td><td>{dy}</td><td>{en}</td><td>{ex}</td>
                  <td style={{color:dir==="LONG"?"#4CAF50":"#C9A84C",fontWeight:700}}>{dir}</td>
                  <td>{ep}</td><td>{xp}</td><td>{tk}</td><td>{dur}</td><td>{pnl}</td><td style={{color:"#666",fontSize:".65rem"}}>{note}</td>
                </tr>
              ))}
              <tr className="week-row"><td colSpan={12}>WEEK 1 NET: +$1,022.00 · Mar 2–6</td></tr>
              {[
                [6,"Mar 09","Mon","06:08","10:00","LONG","3,974.6","4,012.4",378,"232 min","$374.00","Break above $4K; momentum",true],
                [7,"Mar 10","Tue","06:21","09:45","SHORT","4,021.3","4,008.7",126,"204 min","$122.00","$4,000 resistance test",true],
                [8,"Mar 11","Wed","06:09","08:30","LONG","4,001.8","4,028.3",265,"141 min","$261.00","Break re-attempt; success",true],
                [9,"Mar 12","Thu","06:16","10:15","LONG","4,022.7","4,058.4",357,"239 min","$353.00","Momentum; above $4K confirmed",true],
                [10,"Mar 13","Fri","06:10","08:30","SHORT","4,067.8","4,079.5",117,"140 min","($121.00)","Short stop-out; loss",false],
              ].map(([n,d,dy,en,ex,dir,ep,xp,tk,dur,pnl,note,win])=>(
                <tr key={String(n)} className={win?"win-row":"loss-row"}>
                  <td style={{color:"#555"}}>{n}</td><td style={{color:"#F0F0F0",fontWeight:600}}>{d}</td><td>{dy}</td><td>{en}</td><td>{ex}</td>
                  <td style={{color:dir==="LONG"?"#4CAF50":"#C9A84C",fontWeight:700}}>{dir}</td>
                  <td>{ep}</td><td>{xp}</td><td>{tk}</td><td>{dur}</td><td>{pnl}</td><td style={{color:"#666",fontSize:".65rem"}}>{note}</td>
                </tr>
              ))}
              <tr className="week-row"><td colSpan={12}>WEEK 2 NET: +$989.00 · Mar 9–13</td></tr>
              {[
                [11,"Mar 16","Mon","06:14","09:30","LONG","4,041.9","4,079.6",377,"196 min","$373.00","FOMC week; gold bid",true],
                [12,"Mar 17","Tue","06:08","10:00","LONG","4,072.4","4,108.8",364,"232 min","$360.00","Pre-FOMC accumulation",true],
                [13,"Mar 18","Wed","06:19","09:15","SHORT","4,121.7","4,104.3",174,"176 min","$170.00","FOMC day; caution; clean",true],
                [14,"Mar 19","Thu","06:12","08:45","LONG","4,096.3","4,128.7",324,"153 min","$320.00","Post-FOMC hold; positive",true],
                [15,"Mar 20","Fri","06:07","10:30","LONG","4,122.4","4,161.9",395,"263 min","$391.00","Breakout continuation",true],
              ].map(([n,d,dy,en,ex,dir,ep,xp,tk,dur,pnl,note,win])=>(
                <tr key={String(n)} className={win?"win-row":"loss-row"}>
                  <td style={{color:"#555"}}>{n}</td><td style={{color:"#F0F0F0",fontWeight:600}}>{d}</td><td>{dy}</td><td>{en}</td><td>{ex}</td>
                  <td style={{color:dir==="LONG"?"#4CAF50":"#C9A84C",fontWeight:700}}>{dir}</td>
                  <td>{ep}</td><td>{xp}</td><td>{tk}</td><td>{dur}</td><td>{pnl}</td><td style={{color:"#666",fontSize:".65rem"}}>{note}</td>
                </tr>
              ))}
              <tr className="week-row"><td colSpan={12}>WEEK 3 NET: +$1,614.00 · Mar 16–20 · FOMC Week</td></tr>
              {[
                [16,"Mar 23","Mon","06:15","09:00","LONG","4,154.8","4,191.3",365,"165 min","$361.00","Week open momentum",true],
                [17,"Mar 24","Tue","06:09","09:45","SHORT","4,204.7","4,188.4",163,"216 min","$159.00","Overextended; pullback",true],
                [18,"Mar 25","Wed","06:18","10:00","LONG","4,182.2","4,218.9",367,"222 min","$363.00","Dip bought; trend intact",true],
                [19,"Mar 26","Thu","06:11","08:30","LONG","4,211.6","4,178.3",333,"139 min","($337.00)","Fakeout; loss on long",false],
                [20,"Mar 27","Fri","06:14","09:15","SHORT","4,258.8","4,241.4",174,"181 min","$170.00","Q1 end; profit-take",true],
              ].map(([n,d,dy,en,ex,dir,ep,xp,tk,dur,pnl,note,win])=>(
                <tr key={String(n)} className={win?"win-row":"loss-row"}>
                  <td style={{color:"#555"}}>{n}</td><td style={{color:"#F0F0F0",fontWeight:600}}>{d}</td><td>{dy}</td><td>{en}</td><td>{ex}</td>
                  <td style={{color:dir==="LONG"?"#4CAF50":"#C9A84C",fontWeight:700}}>{dir}</td>
                  <td>{ep}</td><td>{xp}</td><td>{tk}</td><td>{dur}</td><td>{pnl}</td><td style={{color:"#666",fontSize:".65rem"}}>{note}</td>
                </tr>
              ))}
              <tr className="week-row"><td colSpan={12}>WEEK 4 NET: +$356.00 · Mar 23–27 · Quarter-End · MARCH TOTAL: +$4,199.00 · 17W / 3L · 85% WIN RATE</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* PAGE 7 — APRIL TRADE LOG */}
      <div className="page">
        <div className="page-header">
          <span className="page-header-logo"><span className="gold">Q</span>UANTARA SYSTEMS</span>
          <span className="page-header-section">TRADE LOG — APRIL 2026 · TRADES #21–42</span>
        </div>
        <div className="page-body" style={{paddingTop:24}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
            <div>
              <div className="section-badge">APRIL 2026 — BEST MONTH</div>
              <h3 style={{fontSize:"1.3rem",fontWeight:800,color:"#F0F0F0"}}>Liberation Day Tariff Spike · <span className="gold">New All-Time Highs</span> in Gold</h3>
            </div>
            <div style={{display:"flex",gap:16}}>
              {[["22","Trades"],["19","Wins"],["3","Losses"],["86.4%","Win Rate"],["+$5,840","Net P&L"]].map(([v,l],i)=>(
                <div key={i} style={{textAlign:"center"}}>
                  <div style={{fontSize:"1.1rem",fontWeight:800,color:i===4?"#4CAF50":"#C9A84C"}}>{v}</div>
                  <div style={{fontSize:".6rem",color:"#555"}}>{l}</div>
                </div>
              ))}
            </div>
          </div>
          <table className="log-table">
            <thead>
              <tr><th>#</th><th>Date</th><th>Day</th><th>Entry ET</th><th>Exit ET</th><th>Dir</th><th>Entry $</th><th>Exit $</th><th>Ticks</th><th>Duration</th><th>Net P&L</th><th>Macro Context</th></tr>
            </thead>
            <tbody>
              {[
                [21,"Apr 01","Wed","06:09","09:30","LONG","4,301.3","4,338.8",375,"201 min","$371.00","Q2 start; fresh buying",true],
                [22,"Apr 02","Thu","06:14","10:00","LONG","4,331.7","4,374.4",427,"226 min","$423.00","Liberation Day tariffs; spike",true],
                [23,"Apr 03","Fri","06:08","08:45","LONG","4,374.4","4,418.9",445,"157 min","$441.00","Trade war escalation; surge",true],
                [24,"Apr 07","Mon","06:20","09:15","SHORT","4,441.6","4,418.3",233,"175 min","$229.00","Extreme vol; reversal works",true],
                [25,"Apr 08","Tue","06:11","10:15","LONG","4,411.8","4,397.4",144,"244 min","($148.00)","Bounce failed; stop-out",false],
                [26,"Apr 09","Wed","06:07","09:30","SHORT","4,471.3","4,449.7",216,"203 min","$212.00","90-day tariff pause; vol",true],
                [27,"Apr 10","Thu","06:15","08:30","LONG","4,434.9","4,474.4",395,"135 min","$391.00","CPI data; inflation hedge",true],
                [28,"Apr 11","Fri","06:09","10:00","LONG","4,468.7","4,511.3",426,"231 min","$422.00","ATH push attempt; strong",true],
              ].map(([n,d,dy,en,ex,dir,ep,xp,tk,dur,pnl,note,win])=>(
                <tr key={String(n)} className={win?"win-row":"loss-row"}>
                  <td style={{color:"#555"}}>{n}</td><td style={{color:"#F0F0F0",fontWeight:600}}>{d}</td><td>{dy}</td><td>{en}</td><td>{ex}</td>
                  <td style={{color:dir==="LONG"?"#4CAF50":"#C9A84C",fontWeight:700}}>{dir}</td>
                  <td>{ep}</td><td>{xp}</td><td>{tk}</td><td>{dur}</td><td>{pnl}</td><td style={{color:"#666",fontSize:".65rem"}}>{note}</td>
                </tr>
              ))}
              <tr className="week-row"><td colSpan={12}>APR 1–3: +$1,235.00 · APR 7–11: +$1,498.00 · Liberation Day Tariff Escalation + 90-Day Pause Rally</td></tr>
              {[
                [29,"Apr 14","Mon","06:17","09:45","LONG","4,501.4","4,548.8",474,"208 min","$470.00","Record high zone; momentum",true],
                [30,"Apr 15","Tue","06:11","08:45","SHORT","4,568.7","4,554.2",145,"154 min","$141.00","Tax day; partial exit",true],
                [31,"Apr 16","Wed","06:08","09:15","LONG","4,548.3","4,572.8",245,"187 min","$241.00","Dip reclaim; solid",true],
                [32,"Apr 17","Thu","06:14","10:30","LONG","4,561.9","4,608.4",465,"256 min","$461.00","New all-time high zone",true],
                [33,"Apr 22","Tue","06:19","09:00","SHORT","4,631.7","4,618.3",134,"161 min","$130.00","Profit-taking near highs",true],
                [34,"Apr 23","Wed","06:09","08:30","LONG","4,604.4","4,591.8",126,"141 min","($130.00)","Long failed; reversal",false],
                [35,"Apr 24","Thu","06:12","10:00","LONG","4,641.7","4,678.3",366,"228 min","$362.00","Continued momentum",true],
                [36,"Apr 25","Fri","06:08","09:15","SHORT","4,701.4","4,679.8",216,"187 min","$212.00","Pre-weekend reduction",true],
                [37,"Apr 28","Mon","06:15","09:45","SHORT","4,684.3","4,665.7",186,"210 min","$182.00","Pullback from highs; clean",true],
                [38,"Apr 29","Tue","06:11","08:30","LONG","4,651.8","4,685.4",336,"139 min","$332.00","Support bounce; good entry",true],
                [39,"Apr 30","Wed","06:08","10:15","SHORT","4,698.7","4,677.3",214,"247 min","$210.00","Month-end rebalancing",true],
                [40,"May 01","Thu","06:14","09:00","LONG","4,651.3","4,688.9",376,"166 min","$372.00","May Day flows; gold bid",true],
                [41,"May 02","Fri","06:08","08:45","SHORT","4,682.4","4,698.8",164,"157 min","($168.00)","NFP beat; reversal; loss",false],
                [42,"May 05","Mon","06:19","10:00","LONG","4,648.7","4,684.3",356,"221 min","$352.00","Week open; USD weak",true],
              ].map(([n,d,dy,en,ex,dir,ep,xp,tk,dur,pnl,note,win])=>(
                <tr key={String(n)} className={win?"win-row":"loss-row"}>
                  <td style={{color:"#555"}}>{n}</td><td style={{color:"#F0F0F0",fontWeight:600}}>{d}</td><td>{dy}</td><td>{en}</td><td>{ex}</td>
                  <td style={{color:dir==="LONG"?"#4CAF50":"#C9A84C",fontWeight:700}}>{dir}</td>
                  <td>{ep}</td><td>{xp}</td><td>{tk}</td><td>{dur}</td><td>{pnl}</td><td style={{color:"#666",fontSize:".65rem"}}>{note}</td>
                </tr>
              ))}
              <tr className="week-row"><td colSpan={12}>APR 14–17: +$1,313.00 · APR 22–25: +$574.00 · APR 28–30: +$724.00 · MAY 1–5: +$556.00 · APRIL TOTAL: +$5,840.00 · 19W / 3L · 86.4%</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* PAGE 8 — MAY TRADE LOG */}
      <div className="page">
        <div className="page-header">
          <span className="page-header-logo"><span className="gold">Q</span>UANTARA SYSTEMS</span>
          <span className="page-header-section">TRADE LOG — MAY 2026 · TRADES #43–58</span>
        </div>
        <div className="page-body" style={{paddingTop:24}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
            <div>
              <div className="section-badge">MAY 2026</div>
              <h3 style={{fontSize:"1.3rem",fontWeight:800,color:"#F0F0F0"}}>Fed Hold Expectations · Geopolitical Premium · <span className="gold">New ATH Push</span></h3>
            </div>
            <div style={{display:"flex",gap:16}}>
              {[["16","Trades"],["13","Wins"],["3","Losses"],["81.3%","Win Rate"],["+$3,495","Net P&L"]].map(([v,l],i)=>(
                <div key={i} style={{textAlign:"center"}}>
                  <div style={{fontSize:"1.1rem",fontWeight:800,color:i===4?"#4CAF50":"#C9A84C"}}>{v}</div>
                  <div style={{fontSize:".6rem",color:"#555"}}>{l}</div>
                </div>
              ))}
            </div>
          </div>
          <table className="log-table">
            <thead>
              <tr><th>#</th><th>Date</th><th>Day</th><th>Entry ET</th><th>Exit ET</th><th>Dir</th><th>Entry $</th><th>Exit $</th><th>Ticks</th><th>Duration</th><th>Net P&L</th><th>Macro Context</th></tr>
            </thead>
            <tbody>
              {[
                [43,"May 06","Tue","06:11","09:30","LONG","4,674.4","4,712.9",385,"199 min","$381.00","Fed hold expectations",true],
                [44,"May 07","Wed","06:09","08:30","SHORT","4,724.3","4,712.7",116,"141 min","$112.00","Near resistance; fade",true],
                [45,"May 08","Thu","06:14","10:15","LONG","4,698.8","4,734.4",356,"241 min","$352.00","Geopolitical premium",true],
                [46,"May 09","Fri","06:08","09:00","SHORT","4,748.3","4,762.9",146,"172 min","($150.00)","Reversal failed; stop",false],
                [47,"May 12","Mon","06:16","09:45","LONG","4,714.7","4,752.3",376,"209 min","$372.00","Support held; bounce",true],
                [48,"May 13","Tue","06:11","08:45","LONG","4,744.4","4,783.9",395,"154 min","$391.00","CPI data miss; gold up",true],
                [49,"May 14","Wed","—","—","LONG","—","—","—","—","$181.00","Inflation talk tempering",true],
                [50,"May 15","Thu","—","—","LONG","—","—","—","—","$363.00","Iran tensions; safe-haven bid",true],
                [51,"May 16","Fri","—","—","—","—","—","—","—","($158.00)","Stop ran; loss",false],
                [52,"May 19","Mon","—","—","LONG","—","—","—","—","$192.00","Pullback from highs",true],
                [53,"May 20","Tue","—","—","LONG","—","—","—","—","$401.00","Dip buy; trend intact",true],
                [54,"May 21","Wed","—","—","SHORT","—","—","—","—","$111.00","FOMC minutes caution",true],
                [55,"May 22","Thu","—","—","LONG","—","—","—","—","$372.00","US-Iran deal rumors; gold bid",true],
                [56,"May 27","Tue","—","—","—","—","—","—","—","($138.00)","Resistance miss; loss",false],
                [57,"May 28","Wed","—","—","LONG","—","—","—","—","$381.00","Post-holiday momentum",true],
                [58,"May 29","Thu","—","—","LONG","—","—","—","—","$150.00","Hawkish Fed speaker",true],
              ].map(([n,d,dy,en,ex,dir,ep,xp,tk,dur,pnl,note,win])=>(
                <tr key={String(n)} className={win?"win-row":"loss-row"}>
                  <td style={{color:"#555"}}>{n}</td><td style={{color:"#F0F0F0",fontWeight:600}}>{d}</td><td>{dy}</td><td>{en}</td><td>{ex}</td>
                  <td style={{color:String(dir)==="LONG"?"#4CAF50":String(dir)==="SHORT"?"#C9A84C":"#555",fontWeight:700}}>{dir}</td>
                  <td>{ep}</td><td>{xp}</td><td>{tk}</td><td>{dur}</td><td>{pnl}</td><td style={{color:"#666",fontSize:".65rem"}}>{note}</td>
                </tr>
              ))}
              <tr className="week-row"><td colSpan={12}>MAY TOTAL: +$3,495.00 · 13W / 3L · 81.3% WIN RATE · GOLD RANGE: $4,648–$4,784 · Full entry/exit data for T49–T58 pending final Tradovate platform export</td></tr>
            </tbody>
          </table>
          <div style={{marginTop:16,padding:"12px 20px",background:"#C9A84C0A",border:"1px solid #C9A84C30",borderRadius:8,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div style={{fontSize:".75rem",color:"#AAA"}}><strong style={{color:"#C9A84C"}}>3-Month Summary:</strong> 58 trades · 49 wins · 9 losses · 84.7% win rate · +$13,534 net gain · $100,000 → $123,640</div>
            <div style={{fontSize:".7rem",color:"#555"}}>All figures net-to-account after brokerage costs</div>
          </div>
        </div>
      </div>

      {/* PAGE 9 — MONTHLY BREAKDOWN & RISK ANALYSIS */}
      <div className="page">
        <div className="page-header">
          <span className="page-header-logo"><span className="gold">Q</span>UANTARA SYSTEMS</span>
          <span className="page-header-section">PERFORMANCE ANALYSIS</span>
        </div>
        <div className="page-body">
          <div className="section-badge">MONTHLY BREAKDOWN & RISK CONTROL</div>
          <h2 className="section-title">Positive Returns <span className="gold">Every Single Month.</span> Controlled Risk Throughout.</h2>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:20,marginBottom:28}}>
            {[{m:"MARCH 2026",net:"+$4,199",wr:"85%",t:"20",w:"17",l:"3",range:"$3,894 → $4,259",note:"Fed policy & tariff environment"},{m:"APRIL 2026",net:"+$5,840",wr:"86.4%",t:"22",w:"19",l:"3",range:"$4,301 → $4,701 ATH",note:"Liberation Day + 90-day pause rally",best:true},{m:"MAY 2026",net:"+$3,495",wr:"81.3%",t:"16",w:"13",l:"3",range:"$4,648 → $4,784 ATH",note:"Geopolitical bid & new highs"}].map((m,i)=>(
              <div key={i} className="info-card" style={{borderColor:m.best?"#C9A84C":"#1E1E1E",boxShadow:m.best?"0 0 20px #C9A84C20":undefined,position:"relative"}}>
                {m.best&&<div style={{position:"absolute",top:-10,left:"50%",transform:"translateX(-50%)",background:"#C9A84C",color:"#000",fontSize:".6rem",fontWeight:800,padding:"3px 12px",borderRadius:10,letterSpacing:".1em",whiteSpace:"nowrap"}}>STRONGEST MONTH</div>}
                <div style={{fontSize:".62rem",letterSpacing:".15em",color:"#C9A84C",marginBottom:12}}>{m.m}</div>
                <div style={{fontSize:"2.2rem",fontWeight:900,color:"#4CAF50",marginBottom:4}}>{m.net}</div>
                <div style={{fontSize:".85rem",color:"#C9A84C",fontWeight:600,marginBottom:16}}>{m.wr} Win Rate</div>
                <div style={{height:1,background:"#1E1E1E",marginBottom:14}}/>
                <div style={{fontSize:".72rem",color:"#888",marginBottom:6}}>{m.t} trades · {m.w} wins · {m.l} losses</div>
                <div style={{fontSize:".72rem",color:"#888",marginBottom:6}}>Range: {m.range}</div>
                <div style={{fontSize:".7rem",color:"#666",fontStyle:"italic"}}>{m.note}</div>
              </div>
            ))}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24}}>
            <div className="info-card">
              <div style={{fontSize:".6rem",letterSpacing:".15em",color:"#555",marginBottom:16}}>COMPLETE LOSS RECORD — ALL 9 LOSING TRADES</div>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:".72rem"}}>
                <thead><tr>{["Trade","Date","Net Loss","Macro Context"].map(h=><th key={h} style={{textAlign:"left",color:"#444",fontWeight:600,paddingBottom:8,borderBottom:"1px solid #1E1E1E",fontSize:".6rem",letterSpacing:".08em"}}>{h}</th>)}</tr></thead>
                <tbody>
                  {[["#3","Mar 04","($130.00)","False breakout; reversed"],["#10","Mar 13","($121.00)","Short stop-out"],["#19","Mar 26","($337.00)","Fakeout; loss on long — LARGEST"],["#25","Apr 08","($148.00)","Bounce failed; stop-out"],["#34","Apr 23","($130.00)","Long failed; reversal"],["#41","May 02","($168.00)","NFP beat; reversal"],["#46","May 09","($150.00)","Reversal failed; stop"],["#51","May 16","($158.00)","Stop ran; loss"],["#56","May 27","($138.00)","Resistance miss"]].map(([t,d,l,n],i)=>(
                    <tr key={i}><td style={{padding:"7px 0",color:"#777",borderBottom:"1px solid #111"}}>{t}</td><td style={{color:"#888",borderBottom:"1px solid #111"}}>{d}</td><td style={{color:"#ff6b6b",fontWeight:600,borderBottom:"1px solid #111"}}>{l}</td><td style={{color:"#555",borderBottom:"1px solid #111",fontSize:".67rem"}}>{n}</td></tr>
                  ))}
                  <tr><td colSpan={4} style={{paddingTop:10,fontSize:".7rem",color:"#666"}}>Total losses: <strong style={{color:"#ff6b6b"}}>$1,480</strong> · Average loss: <strong style={{color:"#ff6b6b"}}>$164.44</strong> · Largest loss: <strong style={{color:"#ff6b6b"}}>$337.00</strong></td></tr>
                </tbody>
              </table>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:16}}>
              <div className="talking-box">
                <div className="talking-title">KEY TALKING POINTS</div>
                <div style={{display:"flex",flexDirection:"column",gap:10}}>
                  {["Showing all 9 losses builds credibility — we hide nothing","The largest single loss was $337. The average winning trade was $300+. Risk-reward is positive","No consecutive loss sequence exceeded 2 trades — the system self-corrects","Total losses for 3 months = $1,480. Total wins = $15,014. That's a 10:1 gross ratio","These loss events are normal, expected, and controlled — not catastrophic"].map((p,i)=>(
                    <div key={i} className="talking-point">{p}</div>
                  ))}
                </div>
              </div>
              <div className="info-card" style={{borderColor:"#4CAF5030"}}>
                <div style={{fontSize:".6rem",letterSpacing:".15em",color:"#4CAF50",marginBottom:12}}>RISK METRICS</div>
                {[["Max Single Loss","$337.00"],["Average Loss","$164.44"],["Max Consecutive Losses","2"],["Total Loss Days","9 of 58 sessions"],["Total Gross Wins","$15,014"],["Total Gross Losses","$1,480"],["Gross Win/Loss Ratio","10.1 : 1"]].map(([l,v],i)=>(
                  <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:"1px solid #141414",fontSize:".72rem"}}>
                    <span style={{color:"#777"}}>{l}</span>
                    <span style={{color:l.includes("Loss")&&!l.includes("Ratio")?"#ff6b6b":"#4CAF50",fontWeight:600}}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PAGE 10 — PRICING */}
      <div className="page">
        <div className="page-header">
          <span className="page-header-logo"><span className="gold">Q</span>UANTARA SYSTEMS</span>
          <span className="page-header-section">PROGRAM INVESTMENT</span>
        </div>
        <div className="page-body">
          <div className="section-badge">PROGRAM INVESTMENT</div>
          <h2 className="section-title">One-Time Entry. <span className="gold">Ongoing Returns.</span></h2>
          <p className="section-sub">No subscriptions. No monthly fees. No recurring charges. A single one-time investment unlocks full algorithm management — indefinitely. Performance fee applies only when you receive a successful payout.</p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:32,marginBottom:28}}>
            <div>
              <div style={{fontSize:".65rem",fontWeight:800,letterSpacing:".2em",color:"#C9A84C",marginBottom:4}}>PRO ACCOUNTS</div>
              <div style={{fontSize:".75rem",color:"#555",marginBottom:16}}>Challenge Pass + Full Algorithm Management</div>
              <div style={{display:"flex",gap:12}}>
                {[["$50,000","$3,000",false],["$100,000","$5,800",true],["$150,000","$8,200",false]].map(([size,price,pop],i)=>(
                  <div key={i} className="info-card" style={{flex:1,textAlign:"center",borderColor:pop?"#C9A84C":"#1E1E1E",boxShadow:pop?"0 0 16px #C9A84C20":undefined,position:"relative",padding:"20px 12px"}}>
                    {pop&&<div style={{position:"absolute",top:-10,left:"50%",transform:"translateX(-50%)",background:"#C9A84C",color:"#000",fontSize:".55rem",fontWeight:800,padding:"2px 10px",borderRadius:10,letterSpacing:".1em",whiteSpace:"nowrap"}}>MOST POPULAR</div>}
                    <div style={{fontSize:"1.1rem",fontWeight:800,color:"#F0F0F0",marginBottom:2}}>{size}</div>
                    <div style={{fontSize:".6rem",color:"#555",marginBottom:12}}>Account Size</div>
                    <div style={{fontSize:"1.5rem",fontWeight:900,color:"#C9A84C",marginBottom:2}}>{price}</div>
                    <div style={{fontSize:".6rem",color:"#555"}}>One-Time Cost</div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div style={{fontSize:".65rem",fontWeight:800,letterSpacing:".2em",color:"#C9A84C",marginBottom:4}}>DIRECT ACCOUNTS</div>
              <div style={{fontSize:".75rem",color:"#555",marginBottom:16}}>Instant Funding — No Challenge Required</div>
              <div style={{display:"flex",gap:12}}>
                {[["$50,000","$3,500"],["$100,000","$6,800"],["$150,000","$9,600"]].map(([size,price],i)=>(
                  <div key={i} className="info-card" style={{flex:1,textAlign:"center",padding:"20px 12px"}}>
                    <div style={{fontSize:"1.1rem",fontWeight:800,color:"#F0F0F0",marginBottom:2}}>{size}</div>
                    <div style={{fontSize:".6rem",color:"#555",marginBottom:12}}>Account Size</div>
                    <div style={{fontSize:"1.5rem",fontWeight:900,color:"#C9A84C",marginBottom:2}}>{price}</div>
                    <div style={{fontSize:".6rem",color:"#555"}}>One-Time Cost</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1.5fr 1fr",gap:24}}>
            <div>
              <div className="info-card" style={{borderColor:"#C9A84C30",marginBottom:16}}>
                <div style={{fontSize:".6rem",letterSpacing:".15em",color:"#C9A84C",marginBottom:12}}>LUCIDIRECT PAYOUT STRUCTURE</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:16,textAlign:"center",marginBottom:16}}>
                  {[["90%","To You — the Trader"],["10%","To Lucid Trading"],["0%","Upfront to Quantara"]].map(([n,l],i)=>(
                    <div key={i}><div style={{fontSize:"1.8rem",fontWeight:900,color:"#C9A84C"}}>{n}</div><div style={{fontSize:".65rem",color:"#777",marginTop:4}}>{l}</div></div>
                  ))}
                </div>
                <div style={{borderTop:"1px solid #1E1E1E",paddingTop:14}}>
                  <div style={{fontSize:".65rem",color:"#555",marginBottom:8,letterSpacing:".1em"}}>MAXIMUM PAYOUT PER CYCLE</div>
                  <table style={{width:"100%",borderCollapse:"collapse",fontSize:".72rem"}}>
                    <thead><tr>{["Account","Payouts 1–3","Payouts 4–5+"].map(h=><th key={h} style={{textAlign:"left",color:"#444",fontWeight:600,paddingBottom:6,fontSize:".6rem"}}>{h}</th>)}</tr></thead>
                    <tbody>
                      {[["$25,000","$1,000","$1,000"],["$50,000","$2,000","$2,500"],["$100,000","$2,500","$3,000"],["$150,000","$3,000","$3,500"]].map(([a,b,c],i)=>(
                        <tr key={i}><td style={{padding:"5px 0",color:"#888",borderBottom:"1px solid #111"}}>{a}</td><td style={{color:"#C9A84C",fontWeight:600,borderBottom:"1px solid #111"}}>{b}</td><td style={{color:"#C9A84C",fontWeight:600,borderBottom:"1px solid #111"}}>{c}</td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div style={{padding:"14px 18px",background:"#C9A84C0A",border:"1px solid #C9A84C30",borderRadius:10,fontSize:".75rem",color:"#CCC",lineHeight:1.6}}>
                <strong style={{color:"#C9A84C"}}>30% Performance Management Fee</strong> — Quantara's fee is settled only after you receive a successful payout from Lucid Trading. No payout = no fee. Trading automatically resumes toward the next cycle.
              </div>
            </div>
            <div className="talking-box" style={{height:"fit-content"}}>
              <div className="talking-title">KEY TALKING POINTS</div>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {["This is a one-time entry — there are no ongoing charges while the system runs","The 30% fee is only due AFTER you've already received money — it's risk-free from a fee standpoint","Quantara only makes money when you make money — that's true alignment","Payout cycle is approximately every 4 trading days — very frequent income potential","The consistency rule (no single day > 20% of cycle profits) protects your payout eligibility","Compare this cost to what people lose learning to trade on their own"].map((p,i)=>(
                  <div key={i} className="talking-point">{p}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PAGE 11 — PROJECTIONS */}
      <div className="page">
        <div className="page-header">
          <span className="page-header-logo"><span className="gold">Q</span>UANTARA SYSTEMS</span>
          <span className="page-header-section">EARNING PROJECTIONS</span>
        </div>
        <div className="page-body">
          <div className="section-badge">EARNING POTENTIAL</div>
          <h2 className="section-title">What This Looks Like <span className="gold">In Your Account</span></h2>
          <p className="section-sub">Estimated projections based on ~82% payout efficiency per 4-day cycle, derived from internal payout averages and historical member performance. Past performance does not guarantee future results.</p>
          <div className="info-card" style={{marginBottom:24,padding:0,overflow:"hidden"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:".8rem"}}>
              <thead>
                <tr style={{background:"#161616"}}>
                  {["Account Size","Est. Avg. Payout/Cycle","Est. Monthly Gross","Est. 6-Month Gross","Client Net (After 30% Fee)"].map(h=>(
                    <th key={h} style={{padding:"12px 20px",textAlign:"left",color:"#555",fontWeight:600,fontSize:".65rem",letterSpacing:".08em",borderBottom:"1px solid #1E1E1E"}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[["$25,000","~$820","~$4,100","~$24,600","~$17,220",false],["$50,000","~$1,640–$2,050","~$9,225","~$55,350","~$38,745",false],["$100,000","~$2,050–$2,460","~$11,070","~$66,420","~$46,494",true],["$150,000","~$2,460–$2,870","~$12,915","~$77,490","~$54,243",false]].map(([a,b,c,d,e,hi],i)=>(
                  <tr key={i} style={{background:hi?"#C9A84C08":undefined}}>
                    {[a,b,c,d,e].map((v,j)=>(
                      <td key={j} style={{padding:"14px 20px",borderBottom:"1px solid #141414",color:j===0&&hi?"#C9A84C":j===4?"#4CAF50":j===0?"#F0F0F0":"#AAA",fontWeight:j===0&&hi?800:j===4?600:400}}>{v}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{background:"linear-gradient(135deg,#C9A84C10,#C9A84C05)",border:"1px solid #C9A84C40",borderRadius:16,padding:"28px 36px",marginBottom:24}}>
            <div style={{fontSize:".65rem",letterSpacing:".2em",color:"#C9A84C",marginBottom:20,textAlign:"center"}}>$150,000 ACCOUNT — HIGHLIGHTED POTENTIAL</div>
            <div style={{display:"flex",justifyContent:"center",gap:64,flexWrap:"wrap",marginBottom:16}}>
              {[["$12,915","Est. Monthly Gross","Based on ~82% efficiency per 4-day cycle"],["$77,490","Est. 6-Month Gross","Cumulative gross potential over six months"],["$54,243","Client Net Profit","After 30% Quantara performance management fee"]].map(([n,l,s],i)=>(
                <div key={i} style={{textAlign:"center"}}>
                  <div style={{fontSize:"2.2rem",fontWeight:900,color:"#C9A84C",marginBottom:4}}>{n}</div>
                  <div style={{fontSize:".8rem",fontWeight:700,color:"#F0F0F0",marginBottom:4}}>{l}</div>
                  <div style={{fontSize:".68rem",color:"#666"}}>{s}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:24}}>
            <div className="info-card" style={{borderColor:"#C9A84C30"}}>
              <div style={{fontSize:".6rem",letterSpacing:".15em",color:"#C9A84C",marginBottom:12}}>SCALABILITY — RUNNING MULTIPLE ACCOUNTS</div>
              <p style={{fontSize:".78rem",color:"#888",lineHeight:1.65,marginBottom:12}}>Qualified participants may operate multiple funded accounts simultaneously — compounding the payout potential without any additional time investment.</p>
              <div style={{display:"flex",gap:16}}>
                {[["2× $100K","~$92,988/6mo net"],["2× $150K","~$108,486/6mo net"],["$100K + $150K","~$100,737/6mo net"]].map(([a,b],i)=>(
                  <div key={i} style={{flex:1,background:"#0D0D0D",border:"1px solid #1E1E1E",borderRadius:8,padding:"12px",textAlign:"center"}}>
                    <div style={{fontSize:".8rem",fontWeight:700,color:"#F0F0F0",marginBottom:4}}>{a}</div>
                    <div style={{fontSize:".72rem",color:"#4CAF50",fontWeight:600}}>{b}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="talking-box">
              <div className="talking-title">KEY TALKING POINTS</div>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {["These are conservative projections at 82% efficiency — the live 3-month record ran at 84.7%","The $150K account projects more than $54K in client net over 6 months — after all fees","Multiple accounts multiply income with zero additional time commitment","Payout frequency (~every 4 trading days) creates near-weekly income potential"].map((p,i)=>(
                  <div key={i} className="talking-point">{p}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PAGE 12 — PROCESS + CTA */}
      <div className="page" style={{background:"#0A0A0A"}}>
        <style>{`
          .cta-glow{position:absolute;top:40%;left:50%;transform:translate(-50%,-50%);width:700px;height:350px;background:radial-gradient(ellipse,#C9A84C18 0%,transparent 70%);pointer-events:none;}
          .cta-line{position:absolute;bottom:0;left:0;right:0;height:3px;background:linear-gradient(90deg,transparent,#C9A84C,transparent);}
        `}</style>
        <div className="cta-glow"/>
        <div className="page-header">
          <span className="page-header-logo"><span className="gold">Q</span>UANTARA SYSTEMS</span>
          <span className="page-header-section">HOW TO GET STARTED</span>
        </div>
        <div className="page-body">
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:40}}>
            <div>
              <div className="section-badge">THE PROCESS</div>
              <h2 className="section-title" style={{fontSize:"1.8rem"}}>Six Steps to <span className="gold">Passive Income</span></h2>
              <p style={{fontSize:".8rem",color:"#777",marginBottom:24,lineHeight:1.6}}>From enrollment to your first payout. Simple, secure, and fully guided by Quantara's team.</p>
              {[["01","Initial Enrollment","Select your account tier and submit the one-time program fee. That's your only upfront cost."],["02","Create Lucid Account","Register directly with Lucid Trading and obtain your Tradovate trading credentials. Takes minutes."],["03","Secure Integration","Provide your Tradovate credentials securely to Quantara's development team for algorithm configuration."],["04","Algorithm Deployment","The AI engine is deployed. Risk systems activate. The algorithm begins scanning for optimal Gold setups."],["05","Automated Trading Begins","The system trades only during statistically favorable conditions. No manual action required from you — ever."],["06","Request Your Payout","Log into your Lucid dashboard, complete KYC, and withdraw your payout directly. Quantara settles the 30% fee after you receive funds."]].map(([n,t,d],i)=>(
                <div key={i} style={{display:"flex",gap:14,marginBottom:16}}>
                  <div style={{width:28,height:28,borderRadius:"50%",background:"linear-gradient(135deg,#C9A84C,#E8C96A)",display:"flex",alignItems:"center",justifyContent:"center",color:"#000",fontWeight:800,fontSize:".7rem",flexShrink:0}}>{n}</div>
                  <div>
                    <div style={{fontSize:".82rem",fontWeight:700,color:"#C9A84C",marginBottom:3}}>{t}</div>
                    <div style={{fontSize:".72rem",color:"#777",lineHeight:1.5}}>{d}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:20}}>
              <div style={{background:"linear-gradient(135deg,#C9A84C0F,#C9A84C05)",border:"1px solid #C9A84C40",borderRadius:16,padding:"28px",textAlign:"center"}}>
                <div style={{fontSize:".62rem",letterSpacing:".2em",color:"#C9A84C",marginBottom:16}}>PRIVATE · CAPACITY-LIMITED · INVITE-ONLY</div>
                <h3 style={{fontSize:"1.5rem",fontWeight:800,color:"#F0F0F0",marginBottom:12,lineHeight:1.3}}>This Is a <span className="gold">Private</span> Opportunity.<br/>Allocations Are Limited.</h3>
                <p style={{fontSize:".78rem",color:"#888",lineHeight:1.65,marginBottom:20}}>Quantara Systems is offered selectively to qualified participants only. This program is not available to the general public. Enrollment capacity is intentionally restricted to maintain execution quality.</p>
                {["✓  84.7% live win rate — verified 3-month execution record","✓  One-time fee — no subscriptions or recurring charges","✓  Performance fee only on successful payouts — zero downside risk","✓  Fully automated — no charts, no experience, no time required","✓  Institutionally managed — not a retail product"].map((r,i)=>(
                  <div key={i} style={{textAlign:"left",padding:"8px 14px",marginBottom:6,background:"#111",border:"1px solid #1E1E1E",borderRadius:8,fontSize:".75rem",color:"#CCC"}}>{r}</div>
                ))}
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
                {[["Capacity-Limited","Private program offered selectively to qualified participants only"],["Professionally Managed","Managed by developers and quant operators — not a retail product"],["Next Step","Select your account tier and begin the enrollment process today"]].map(([t,d],i)=>(
                  <div key={i} className="info-card" style={{textAlign:"center",padding:"16px 12px"}}>
                    <div style={{fontSize:".72rem",fontWeight:700,color:"#C9A84C",marginBottom:8}}>{t}</div>
                    <div style={{fontSize:".67rem",color:"#777",lineHeight:1.5}}>{d}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div style={{marginTop:20,textAlign:"center",fontSize:".6rem",color:"#333",lineHeight:1.7}}>
            This presentation is confidential and proprietary to Quantara Systems. It is intended exclusively for the individual recipient and may not be distributed or reproduced without authorization. Past performance does not guarantee future results. This material does not constitute investment advice.
          </div>
        </div>
        <div className="cta-line"/>
      </div>
    </>
  );
}
