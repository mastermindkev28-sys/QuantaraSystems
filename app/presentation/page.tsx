"use client";

import { useEffect, useRef, useState } from "react";

const slides = [
  "hero",
  "problem",
  "solution",
  "why-gold",
  "how-it-works",
  "performance",
  "monthly-breakdown",
  "risk-control",
  "pricing",
  "projections",
  "process",
  "cta",
];

function useCountUp(target: number, duration = 2000, start = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return value;
}

function useInView(threshold = 0.3) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return { ref, inView };
}

function StatCard({ value, prefix = "", suffix = "", label, decimals = 0, inView }: {
  value: number; prefix?: string; suffix?: string; label: string; decimals?: number; inView: boolean;
}) {
  const count = useCountUp(Math.floor(value), 2200, inView);
  const display = decimals > 0
    ? (inView ? value.toFixed(decimals) : "0.0")
    : count.toLocaleString();
  return (
    <div style={styles.statCard}>
      <div style={styles.statValue}>{prefix}{display}{suffix}</div>
      <div style={styles.statLabel}>{label}</div>
    </div>
  );
}

export default function Presentation() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = slideRefs.current.indexOf(entry.target as HTMLDivElement);
            if (idx >= 0) setActiveSlide(idx);
          }
        });
      },
      { threshold: 0.5 }
    );
    slideRefs.current.forEach((el) => { if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  const scrollTo = (idx: number) => {
    slideRefs.current[idx]?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const perfInView = useInView(0.4);
  const pricingInView = useInView(0.4);
  const projInView = useInView(0.4);

  const slideLabels = [
    "Home", "The Problem", "Our Solution", "Why Gold", "How It Works",
    "Performance", "Monthly Results", "Risk Control", "Pricing", "Projections",
    "The Process", "Get Started"
  ];

  return (
    <div style={styles.root}>
      {/* NAV */}
      <nav style={styles.nav}>
        <div style={styles.navLogo}>
          <span style={styles.navLogoQ}>Q</span>UANTARA
        </div>
        <div style={styles.navRight}>
          <div style={styles.navDots}>
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollTo(i)}
                style={{
                  ...styles.navDot,
                  background: i === activeSlide ? "#C9A84C" : "rgba(201,168,76,0.25)",
                  transform: i === activeSlide ? "scale(1.4)" : "scale(1)",
                }}
                title={slideLabels[i]}
              />
            ))}
          </div>
          <button style={styles.menuBtn} onClick={() => setMenuOpen(!menuOpen)}>
            ☰
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div style={styles.menu}>
          {slideLabels.map((label, i) => (
            <button key={i} onClick={() => scrollTo(i)} style={styles.menuItem}>
              {label}
            </button>
          ))}
        </div>
      )}

      {/* SLIDE 1: HERO */}
      <div ref={(el) => { slideRefs.current[0] = el; }} style={styles.slide}>
        <div style={styles.heroGlow} />
        <div style={styles.heroGrid} />
        <div style={styles.heroContent}>
          <div style={styles.heroBadge}>PRIVATE · INVITE-ONLY · INSTITUTIONAL GRADE</div>
          <h1 style={styles.heroTitle}>
            <span style={styles.gold}>QUANTARA</span>
            <br />
            <span style={styles.heroSub}>SYSTEMS</span>
          </h1>
          <p style={styles.heroTagline}>
            Institutional Gold Algorithmic Trading.<br />
            Fully Automated. Passive. Proven.
          </p>
          <div style={styles.heroStats}>
            <div style={styles.heroStat}>
              <span style={styles.heroStatNum}>84.7%</span>
              <span style={styles.heroStatLbl}>Live Win Rate</span>
            </div>
            <div style={styles.heroStatDivider} />
            <div style={styles.heroStat}>
              <span style={styles.heroStatNum}>$13,534</span>
              <span style={styles.heroStatLbl}>3-Month Net Gain</span>
            </div>
            <div style={styles.heroStatDivider} />
            <div style={styles.heroStat}>
              <span style={styles.heroStatNum}>58</span>
              <span style={styles.heroStatLbl}>Live Trades Executed</span>
            </div>
          </div>
          <button onClick={() => scrollTo(11)} style={styles.heroBtn}>
            Reserve Your Allocation →
          </button>
        </div>
        <div style={styles.scrollHint}>scroll to explore ↓</div>
      </div>

      {/* SLIDE 2: THE PROBLEM */}
      <div ref={(el) => { slideRefs.current[1] = el; }} style={styles.slide}>
        <div style={styles.slideInner}>
          <div style={styles.sectionBadge}>THE REALITY</div>
          <h2 style={styles.sectionTitle}>Most People Will <span style={styles.gold}>Never</span> Beat the Market</h2>
          <p style={styles.sectionSubtitle}>Not because they lack ambition — because the system isn't designed for them.</p>
          <div style={styles.problemGrid}>
            {[
              { icon: "📉", stat: "90%", label: "of retail traders lose money", desc: "Emotion, inconsistency, and information disadvantage destroy accounts." },
              { icon: "⏰", stat: "10,000+", label: "hours to master trading", desc: "Markets demand years of painful, expensive education most never complete." },
              { icon: "🧠", stat: "$0", label: "emotional decisions are worth", desc: "Fear and greed override logic. Every time. Without exception." },
              { icon: "🏦", stat: "Institutions", label: "own the edge you're chasing", desc: "They have the algorithms, the data, and the speed. You don't." },
            ].map((p, i) => (
              <div key={i} style={styles.problemCard}>
                <div style={styles.problemIcon}>{p.icon}</div>
                <div style={styles.problemStat}>{p.stat}</div>
                <div style={styles.problemCardLabel}>{p.label}</div>
                <div style={styles.problemDesc}>{p.desc}</div>
              </div>
            ))}
          </div>
          <div style={styles.problemConclusion}>
            The question isn't <em>whether</em> you deserve market returns — it's <em>how</em> you access them without becoming a full-time trader.
          </div>
        </div>
      </div>

      {/* SLIDE 3: SOLUTION */}
      <div ref={(el) => { slideRefs.current[2] = el; }} style={styles.slide}>
        <div style={styles.slideInner}>
          <div style={styles.sectionBadge}>THE ANSWER</div>
          <h2 style={styles.sectionTitle}>Institutional Intelligence.<br /><span style={styles.gold}>Your Account.</span></h2>
          <p style={styles.sectionSubtitle}>Quantara QS1 is a fully automated AI trading engine built on 6+ years of Gold futures research — operating so you don't have to.</p>
          <div style={styles.solutionGrid}>
            {[
              { icon: "🤖", title: "Machine Learning Execution", desc: "Probabilistic models evaluate real-time and historical conditions — identifying statistical edge, not predicting markets." },
              { icon: "🛡️", title: "Institutional Risk Management", desc: "Drawdown minimization, position sizing efficiency, and capital longevity built into every trade." },
              { icon: "😶", title: "Zero Emotional Input", desc: "No fear. No greed. No revenge trading. Pure quantitative decision-making, every session." },
              { icon: "🎯", title: "Session Filtering Technology", desc: "Trades only during statistically favorable windows — the London Open Killzone — for maximum edge and execution quality." },
              { icon: "📊", title: "6+ Years of Backtesting", desc: "Validated across inflationary cycles, Fed rate environments, banking instability, war-driven volatility, and liquidity crises." },
              { icon: "🏆", title: "100% Hands-Free", desc: "No charts to monitor. No analysis required. No manual experience necessary. The system does everything." },
            ].map((s, i) => (
              <div key={i} style={styles.solutionCard}>
                <div style={styles.solutionIcon}>{s.icon}</div>
                <div style={styles.solutionTitle}>{s.title}</div>
                <div style={styles.solutionDesc}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SLIDE 4: WHY GOLD */}
      <div ref={(el) => { slideRefs.current[3] = el; }} style={styles.slide}>
        <div style={styles.slideInner}>
          <div style={styles.sectionBadge}>THE ASSET</div>
          <h2 style={styles.sectionTitle}>Why <span style={styles.gold}>Gold Futures</span>?</h2>
          <p style={styles.sectionSubtitle}>Not chosen arbitrarily. Gold is the most algorithmically compatible institutional asset in the world.</p>
          <div style={styles.goldGrid}>
            <div style={styles.goldFeature}>
              <div style={styles.goldFeatureNum}>01</div>
              <div style={styles.goldFeatureTitle}>Deep Institutional Liquidity</div>
              <div style={styles.goldFeatureDesc}>Trillions in daily volume. Efficient spreads. Reliable execution. No slippage surprises that destroy retail accounts.</div>
            </div>
            <div style={styles.goldFeature}>
              <div style={styles.goldFeatureNum}>02</div>
              <div style={styles.goldFeatureTitle}>Predictable Session Behavior</div>
              <div style={styles.goldFeatureDesc}>Strong technical reaction zones and measurable order flow during the London Open — exactly where QS1 operates.</div>
            </div>
            <div style={styles.goldFeature}>
              <div style={styles.goldFeatureNum}>03</div>
              <div style={styles.goldFeatureTitle}>AI-Modeled Volatility</div>
              <div style={styles.goldFeatureDesc}>Structured volatility behavior that machine learning models can decode with repeatable, statistically significant accuracy.</div>
            </div>
            <div style={styles.goldFeature}>
              <div style={styles.goldFeatureNum}>04</div>
              <div style={styles.goldFeatureTitle}>Macro-Driven Momentum</div>
              <div style={styles.goldFeatureDesc}>Geopolitical events, Fed policy, and inflation cycles create sustained directional moves — fuel for algorithmic precision.</div>
            </div>
          </div>
          <div style={styles.goldQuote}>
            "Gold is not just a store of value — it's a precision instrument for algorithmic trading."
          </div>
        </div>
      </div>

      {/* SLIDE 5: HOW IT WORKS */}
      <div ref={(el) => { slideRefs.current[4] = el; }} style={styles.slide}>
        <div style={styles.slideInner}>
          <div style={styles.sectionBadge}>THE ENGINE</div>
          <h2 style={styles.sectionTitle}>How <span style={styles.gold}>QS1</span> Executes</h2>
          <p style={styles.sectionSubtitle}>A layered, institutional-grade technology stack operating in real-time, every session.</p>
          <div style={styles.techFlow}>
            {[
              { step: "1", title: "Market Scanning", desc: "AI evaluates tick velocity, liquidity absorption, delta divergence, and volume profile inefficiencies before any trade is considered." },
              { step: "2", title: "Regime Filtering", desc: "Volatility regime filters eliminate high-risk market conditions. The system waits for statistical alignment — no forced entries." },
              { step: "3", title: "Signal Validation", desc: "Multi-factor AI signal engines cross-reference momentum exhaustion, mean reversion probability, and order flow patterns." },
              { step: "4", title: "Risk Calculation", desc: "Position sizing, drawdown limits, and risk-layer architecture are confirmed before any order is submitted." },
              { step: "5", title: "Automated Execution", desc: "Webhook execution via Tradovate API fires the trade at optimal price — no human delay, no emotional hesitation." },
              { step: "6", title: "Payout Cycle", desc: "Performance is tracked against Lucid Trading's consistency rules. When targets are hit, you request your payout directly." },
            ].map((t, i) => (
              <div key={i} style={styles.techStep}>
                <div style={styles.techStepNum}>{t.step}</div>
                <div style={styles.techStepContent}>
                  <div style={styles.techStepTitle}>{t.title}</div>
                  <div style={styles.techStepDesc}>{t.desc}</div>
                </div>
                {i < 5 && <div style={styles.techArrow}>→</div>}
              </div>
            ))}
          </div>
          <div style={styles.techPlatforms}>
            <span style={styles.techPlatformLabel}>INTEGRATED WITH:</span>
            <span style={styles.techPlatform}>Tradovate</span>
            <span style={styles.techSep}>·</span>
            <span style={styles.techPlatform}>TradingView</span>
            <span style={styles.techSep}>·</span>
            <span style={styles.techPlatform}>Lucid Trading</span>
          </div>
        </div>
      </div>

      {/* SLIDE 6: PERFORMANCE */}
      <div ref={(el) => { slideRefs.current[5] = el; (perfInView.ref as React.MutableRefObject<HTMLDivElement | null>).current = el; }} style={styles.slide}>
        <div style={styles.slideInner}>
          <div style={styles.sectionBadge}>LIVE RESULTS · MAR–MAY 2026</div>
          <h2 style={styles.sectionTitle}><span style={styles.gold}>Real Numbers.</span> Real Trades. Real Account.</h2>
          <p style={styles.sectionSubtitle}>58 live executions. 1 MGC contract per day. $100,000 Tradovate account. London Open Killzone only.</p>
          <div style={styles.perfStats}>
            <StatCard value={13534} prefix="$" label="Net Account Gain" inView={perfInView.inView} />
            <StatCard value={84.7} suffix="%" label="Win Rate" decimals={1} inView={perfInView.inView} />
            <StatCard value={123640} prefix="$" label="Final Balance" inView={perfInView.inView} />
            <StatCard value={9} label="Total Losses in 3 Months" inView={perfInView.inView} />
          </div>
          <div style={styles.equityCurve}>
            <div style={styles.equityLabel}>EQUITY CURVE — $100K → $123,640</div>
            <div style={styles.equityChart}>
              {[100000, 104199, 110039, 113534].map((v, i) => {
                const pct = ((v - 98000) / (125000 - 98000)) * 100;
                return (
                  <div key={i} style={{ ...styles.equityBar, height: `${pct}%` }}>
                    <div style={styles.equityBarLabel}>${(v / 1000).toFixed(0)}K</div>
                  </div>
                );
              })}
            </div>
            <div style={styles.equityMonths}>
              <span>Start</span><span>Mar</span><span>Apr</span><span>May</span>
            </div>
          </div>
          <div style={styles.perfNote}>
            Starting Balance: $100,000 → Final Balance: $123,640 · All figures net-to-account after brokerage costs · No sustained drawdown sequence exceeded 2 consecutive losses
          </div>
        </div>
      </div>

      {/* SLIDE 7: MONTHLY BREAKDOWN */}
      <div ref={(el) => { slideRefs.current[6] = el; }} style={styles.slide}>
        <div style={styles.slideInner}>
          <div style={styles.sectionBadge}>MONTHLY BREAKDOWN</div>
          <h2 style={styles.sectionTitle}>Positive Returns <span style={styles.gold}>Every Single Month</span></h2>
          <p style={styles.sectionSubtitle}>Consistent profitability across three distinct market environments — zero down months.</p>
          <div style={styles.monthlyGrid}>
            {[
              { month: "MARCH 2026", net: "+$4,199", wr: "85%", trades: "20 trades · 17W · 3L", range: "$3,894 → $4,259", note: "Fed policy & tariff environment", color: "#C9A84C" },
              { month: "APRIL 2026", net: "+$5,840", wr: "86.4%", trades: "22 trades · 19W · 3L", range: "$4,301 → $4,701 ATH", note: "Liberation Day & 90-day pause rally", color: "#E8C96A", best: true },
              { month: "MAY 2026", net: "+$3,495", wr: "81.3%", trades: "16 trades · 13W · 3L", range: "$4,648 → $4,784 ATH", note: "Geopolitical bid & new highs", color: "#A8883C" },
            ].map((m, i) => (
              <div key={i} style={{ ...styles.monthCard, borderColor: m.color, boxShadow: m.best ? `0 0 30px ${m.color}40` : undefined }}>
                {m.best && <div style={styles.bestMonth}>BEST MONTH</div>}
                <div style={{ ...styles.monthTitle, color: m.color }}>{m.month}</div>
                <div style={styles.monthNet}>{m.net}</div>
                <div style={styles.monthWr}>{m.wr} Win Rate</div>
                <div style={styles.monthDivider} />
                <div style={styles.monthDetail}>{m.trades}</div>
                <div style={styles.monthDetail}>{m.range}</div>
                <div style={styles.monthNote}>{m.note}</div>
              </div>
            ))}
          </div>
          <div style={styles.monthlyNote}>
            April 2026 — the strongest month — coincided with Liberation Day tariff escalation, the 90-day pause rally, and multiple new all-time highs in gold prices. The algorithm didn't need to predict this. It simply captured it.
          </div>
        </div>
      </div>

      {/* SLIDE 8: RISK CONTROL */}
      <div ref={(el) => { slideRefs.current[7] = el; }} style={styles.slide}>
        <div style={styles.slideInner}>
          <div style={styles.sectionBadge}>RISK MANAGEMENT</div>
          <h2 style={styles.sectionTitle}>Controlled Risk.<br /><span style={styles.gold}>Protected Capital.</span></h2>
          <p style={styles.sectionSubtitle}>The losses tell the real story. When you see how small they are, you understand the edge.</p>
          <div style={styles.riskGrid}>
            <div style={styles.riskLeft}>
              <div style={styles.riskMetric}>
                <span style={styles.riskMetricNum}>($337)</span>
                <span style={styles.riskMetricLbl}>Largest Single Loss — ever</span>
              </div>
              <div style={styles.riskMetric}>
                <span style={styles.riskMetricNum}>($164)</span>
                <span style={styles.riskMetricLbl}>Average Loss Across All 9 Losses</span>
              </div>
              <div style={styles.riskMetric}>
                <span style={styles.riskMetricNum}>0</span>
                <span style={styles.riskMetricLbl}>Consecutive Loss Sequences Over 2</span>
              </div>
              <div style={styles.riskMetric}>
                <span style={styles.riskMetricNum}>9</span>
                <span style={styles.riskMetricLbl}>Total Losses in 58 Sessions</span>
              </div>
            </div>
            <div style={styles.riskRight}>
              <div style={styles.riskTable}>
                <div style={styles.riskTableHeader}>All 9 Losing Trades — Complete Record</div>
                {[
                  ["#3", "Mar 04", "($130)", "False breakout; reversed"],
                  ["#10", "Mar 13", "($121)", "Short stop-out"],
                  ["#19", "Mar 26", "($337)", "Fakeout; loss on long"],
                  ["#25", "Apr 08", "($148)", "Bounce failed; stop-out"],
                  ["#34", "Apr 23", "($130)", "Long failed; reversal"],
                  ["#41", "May 02", "($168)", "NFP beat; reversal"],
                  ["#46", "May 09", "($150)", "Reversal failed; stop"],
                  ["#51", "May 16", "($158)", "Stop ran; loss"],
                  ["#56", "May 27", "($138)", "Resistance miss"],
                ].map(([trade, date, loss, note], i) => (
                  <div key={i} style={styles.riskRow}>
                    <span style={styles.riskCell}>{trade}</span>
                    <span style={styles.riskCell}>{date}</span>
                    <span style={{ ...styles.riskCell, color: "#ff6b6b" }}>{loss}</span>
                    <span style={{ ...styles.riskCell, color: "#888", fontSize: "0.8rem" }}>{note}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div style={styles.riskConclusion}>
            Total losses across 3 months: <span style={styles.gold}>$1,480</span> — against total wins of: <span style={styles.gold}>$15,014</span>. That's a reward-to-risk ratio most professional traders would celebrate.
          </div>
        </div>
      </div>

      {/* SLIDE 9: PRICING */}
      <div ref={(el) => { slideRefs.current[8] = el; (pricingInView.ref as React.MutableRefObject<HTMLDivElement | null>).current = el; }} style={styles.slide}>
        <div style={styles.slideInner}>
          <div style={styles.sectionBadge}>PROGRAM INVESTMENT</div>
          <h2 style={styles.sectionTitle}>One-Time Entry.<br /><span style={styles.gold}>Ongoing Returns.</span></h2>
          <p style={styles.sectionSubtitle}>No subscriptions. No monthly fees. Pay once — access the algorithm indefinitely. Performance fee only on successful payouts.</p>
          <div style={styles.pricingTabs}>
            <div style={styles.pricingSection}>
              <div style={styles.pricingType}>PRO ACCOUNTS</div>
              <div style={styles.pricingTypeDesc}>Challenge Pass + Full Management</div>
              <div style={styles.pricingCards}>
                {[
                  { size: "$50,000", price: "$3,000", popular: false },
                  { size: "$100,000", price: "$5,800", popular: true },
                  { size: "$150,000", price: "$8,200", popular: false },
                ].map((p, i) => (
                  <div key={i} style={{ ...styles.pricingCard, borderColor: p.popular ? "#C9A84C" : "#333", boxShadow: p.popular ? "0 0 30px #C9A84C40" : undefined }}>
                    {p.popular && <div style={styles.popularBadge}>MOST POPULAR</div>}
                    <div style={styles.pricingSize}>{p.size}</div>
                    <div style={styles.pricingLabel}>Account Size</div>
                    <div style={styles.pricingPrice}>{p.price}</div>
                    <div style={styles.pricingLabel}>One-Time Cost</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={styles.pricingSection}>
              <div style={styles.pricingType}>DIRECT ACCOUNTS</div>
              <div style={styles.pricingTypeDesc}>Instant Funding — No Challenge Required</div>
              <div style={styles.pricingCards}>
                {[
                  { size: "$50,000", price: "$3,500" },
                  { size: "$100,000", price: "$6,800" },
                  { size: "$150,000", price: "$9,600" },
                ].map((p, i) => (
                  <div key={i} style={{ ...styles.pricingCard, borderColor: "#333" }}>
                    <div style={styles.pricingSize}>{p.size}</div>
                    <div style={styles.pricingLabel}>Account Size</div>
                    <div style={styles.pricingPrice}>{p.price}</div>
                    <div style={styles.pricingLabel}>One-Time Cost</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div style={styles.pricingNote}>
            <span style={styles.gold}>30% Performance Management Fee</span> — paid only after a successful payout is received. No payout = no fee. Quantara's success is directly aligned with yours.
          </div>
          <div style={styles.payoutSplit}>
            <div style={styles.payoutSplitItem}>
              <div style={styles.payoutSplitNum}>90%</div>
              <div style={styles.payoutSplitLbl}>To You</div>
            </div>
            <div style={styles.payoutSplitDivider} />
            <div style={styles.payoutSplitItem}>
              <div style={styles.payoutSplitNum}>10%</div>
              <div style={styles.payoutSplitLbl}>To Lucid Trading</div>
            </div>
            <div style={styles.payoutSplitDivider} />
            <div style={styles.payoutSplitItem}>
              <div style={styles.payoutSplitNum}>0%</div>
              <div style={styles.payoutSplitLbl}>Upfront to Quantara</div>
            </div>
          </div>
        </div>
      </div>

      {/* SLIDE 10: PROJECTIONS */}
      <div ref={(el) => { slideRefs.current[9] = el; (projInView.ref as React.MutableRefObject<HTMLDivElement | null>).current = el; }} style={styles.slide}>
        <div style={styles.slideInner}>
          <div style={styles.sectionBadge}>EARNING POTENTIAL</div>
          <h2 style={styles.sectionTitle}>What This Looks Like<br /><span style={styles.gold}>In Your Account</span></h2>
          <p style={styles.sectionSubtitle}>Estimated projections based on internal payout averages and historical member performance data. Past performance does not guarantee future results.</p>
          <div style={styles.projTable}>
            <div style={styles.projHeader}>
              <span>Account</span>
              <span>Est. Monthly</span>
              <span>Est. 6-Month Gross</span>
              <span>Client Net (after 30%)</span>
            </div>
            {[
              { account: "$25,000", monthly: "~$820", sixMonth: "~$4,100", net: "~$17,220" },
              { account: "$50,000", monthly: "~$1,640–$2,050", sixMonth: "~$9,225", net: "~$38,745" },
              { account: "$100,000", monthly: "~$2,050–$2,460", sixMonth: "~$11,070", net: "~$46,494", highlight: true },
              { account: "$150,000", monthly: "~$2,460–$2,870", sixMonth: "~$12,915", net: "~$54,243" },
            ].map((r, i) => (
              <div key={i} style={{ ...styles.projRow, background: r.highlight ? "rgba(201,168,76,0.08)" : undefined, borderColor: r.highlight ? "#C9A84C" : "transparent" }}>
                <span style={r.highlight ? { color: "#C9A84C", fontWeight: 700 } : undefined}>{r.account}</span>
                <span>{r.monthly}</span>
                <span>{r.sixMonth}</span>
                <span style={{ color: "#C9A84C", fontWeight: 600 }}>{r.net}</span>
              </div>
            ))}
          </div>
          <div style={styles.projHighlight}>
            <div style={styles.projHighlightTitle}>$150,000 Account — Highlighted Potential</div>
            <div style={styles.projHighlightStats}>
              <div style={styles.projHighlightStat}>
                <div style={styles.projHighlightNum}>$12,915</div>
                <div style={styles.projHighlightLbl}>Est. Monthly Gross</div>
              </div>
              <div style={styles.projHighlightStat}>
                <div style={styles.projHighlightNum}>$77,490</div>
                <div style={styles.projHighlightLbl}>Est. 6-Month Gross</div>
              </div>
              <div style={styles.projHighlightStat}>
                <div style={styles.projHighlightNum}>$54,243</div>
                <div style={styles.projHighlightLbl}>Client Net Profit</div>
              </div>
            </div>
            <div style={styles.projHighlightNote}>Based on ~82% payout efficiency per 4-day cycle</div>
          </div>
        </div>
      </div>

      {/* SLIDE 11: THE PROCESS */}
      <div ref={(el) => { slideRefs.current[10] = el; }} style={styles.slide}>
        <div style={styles.slideInner}>
          <div style={styles.sectionBadge}>GETTING STARTED</div>
          <h2 style={styles.sectionTitle}>Six Steps to<br /><span style={styles.gold}>Passive Income</span></h2>
          <p style={styles.sectionSubtitle}>From enrollment to your first payout. Simple. Secure. Fully guided.</p>
          <div style={styles.processGrid}>
            {[
              { n: "01", title: "Initial Enrollment", desc: "Select your desired account size and submit the one-time program fee. That's your only upfront commitment." },
              { n: "02", title: "Create Lucid Account", desc: "Register directly with Lucid Trading and obtain your Tradovate trading credentials. Takes minutes." },
              { n: "03", title: "Secure Integration", desc: "Provide your Tradovate credentials securely to Quantara's development team for configuration and setup." },
              { n: "04", title: "Algorithm Deployment", desc: "The AI execution engine is deployed. Risk systems activate. The algorithm begins scanning for optimal Gold setups." },
              { n: "05", title: "Automated Trading Begins", desc: "The system trades only when favorable conditions are identified. You receive updates. No manual action required." },
              { n: "06", title: "Request Your Payout", desc: "Log into your Lucid dashboard, complete KYC verification, and request your payout directly from Lucid Trading." },
            ].map((p, i) => (
              <div key={i} style={styles.processCard}>
                <div style={styles.processNum}>{p.n}</div>
                <div style={styles.processTitle}>{p.title}</div>
                <div style={styles.processDesc}>{p.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SLIDE 12: CTA */}
      <div ref={(el) => { slideRefs.current[11] = el; }} style={styles.slide}>
        <div style={styles.ctaGlow} />
        <div style={styles.ctaContent}>
          <div style={styles.sectionBadge}>PRIVATE · CAPACITY-LIMITED</div>
          <h2 style={styles.ctaTitle}>
            This Is a <span style={styles.gold}>Private</span> Opportunity.<br />
            Allocations Are Limited.
          </h2>
          <p style={styles.ctaSubtitle}>
            Quantara Systems is offered selectively to qualified participants only.<br />
            This program is not available to the general public.
          </p>
          <div style={styles.ctaReasons}>
            {[
              "✓  84.7% live win rate — verified 3-month trade log",
              "✓  One-time fee — no subscriptions, no monthly charges",
              "✓  Performance fee only on successful payouts",
              "✓  Fully automated — no trading experience required",
              "✓  Institutional infrastructure — not a retail product",
            ].map((r, i) => (
              <div key={i} style={styles.ctaReason}>{r}</div>
            ))}
          </div>
          <div style={styles.ctaBtns}>
            <a href="mailto:mastermindkev28@gmail.com?subject=Quantara%20Systems%20Enrollment%20Request" style={styles.ctaBtnPrimary}>
              Request Your Allocation →
            </a>
          </div>
          <div style={styles.ctaDisclaimer}>
            This presentation is confidential and proprietary. Intended exclusively for the individual recipient. Past performance does not guarantee future results. This is not investment advice.
          </div>
        </div>
      </div>
    </div>
  );
}

const gold = "#C9A84C";
const goldLight = "#E8C96A";
const dark = "#0A0A0A";
const card = "#111111";
const border = "#1E1E1E";

const styles: Record<string, React.CSSProperties> = {
  root: { background: dark, color: "#F0F0F0", fontFamily: "'Segoe UI', system-ui, sans-serif", overflowX: "hidden" },
  gold: { color: gold },

  nav: { position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 32px", background: "rgba(10,10,10,0.92)", backdropFilter: "blur(12px)", borderBottom: `1px solid ${border}` },
  navLogo: { fontSize: "1.1rem", fontWeight: 800, letterSpacing: "0.2em", color: "#F0F0F0" },
  navLogoQ: { color: gold },
  navRight: { display: "flex", alignItems: "center", gap: 16 },
  navDots: { display: "flex", gap: 6, alignItems: "center" },
  navDot: { width: 8, height: 8, borderRadius: "50%", border: "none", cursor: "pointer", transition: "all 0.3s ease", padding: 0 },
  menuBtn: { background: "none", border: `1px solid ${border}`, color: "#F0F0F0", fontSize: "1.2rem", cursor: "pointer", padding: "6px 12px", borderRadius: 6 },
  menu: { position: "fixed", top: 60, right: 0, zIndex: 99, background: "#111", border: `1px solid ${border}`, borderRadius: "0 0 0 12px", padding: 8, display: "flex", flexDirection: "column", gap: 2 },
  menuItem: { background: "none", border: "none", color: "#F0F0F0", padding: "10px 24px", cursor: "pointer", textAlign: "left", borderRadius: 6, fontSize: "0.9rem", transition: "background 0.2s" },

  slide: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", padding: "100px 24px 60px", boxSizing: "border-box", overflowX: "hidden" },
  slideInner: { maxWidth: 1100, width: "100%", margin: "0 auto" },

  heroGlow: { position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)", width: 600, height: 600, background: `radial-gradient(circle, ${gold}18 0%, transparent 70%)`, pointerEvents: "none" },
  heroGrid: { position: "absolute", inset: 0, backgroundImage: `linear-gradient(${border} 1px, transparent 1px), linear-gradient(90deg, ${border} 1px, transparent 1px)`, backgroundSize: "60px 60px", opacity: 0.3, pointerEvents: "none" },
  heroContent: { position: "relative", textAlign: "center", maxWidth: 900, margin: "0 auto" },
  heroBadge: { display: "inline-block", padding: "6px 20px", border: `1px solid ${gold}60`, borderRadius: 20, fontSize: "0.72rem", letterSpacing: "0.2em", color: gold, marginBottom: 32, background: `${gold}10` },
  heroTitle: { fontSize: "clamp(3rem, 8vw, 7rem)", fontWeight: 900, margin: "0 0 8px", lineHeight: 1, letterSpacing: "0.05em" },
  heroSub: { fontSize: "clamp(1.5rem, 4vw, 3rem)", fontWeight: 300, color: "#888", letterSpacing: "0.4em" },
  heroTagline: { fontSize: "clamp(1rem, 2vw, 1.4rem)", color: "#AAA", lineHeight: 1.6, margin: "32px 0 40px" },
  heroStats: { display: "flex", justifyContent: "center", alignItems: "center", gap: 32, flexWrap: "wrap", marginBottom: 48 },
  heroStat: { display: "flex", flexDirection: "column", alignItems: "center", gap: 4 },
  heroStatNum: { fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 800, color: gold },
  heroStatLbl: { fontSize: "0.78rem", color: "#888", letterSpacing: "0.1em" },
  heroStatDivider: { width: 1, height: 50, background: border },
  heroBtn: { display: "inline-block", padding: "18px 48px", background: `linear-gradient(135deg, ${gold}, ${goldLight})`, color: "#000", fontWeight: 800, fontSize: "1rem", borderRadius: 8, cursor: "pointer", border: "none", letterSpacing: "0.05em", transition: "transform 0.2s, box-shadow 0.2s", boxShadow: `0 0 40px ${gold}40` },
  scrollHint: { position: "absolute", bottom: 30, left: "50%", transform: "translateX(-50%)", color: "#555", fontSize: "0.75rem", letterSpacing: "0.15em" },

  sectionBadge: { display: "inline-block", padding: "5px 16px", border: `1px solid ${gold}40`, borderRadius: 20, fontSize: "0.7rem", letterSpacing: "0.2em", color: gold, marginBottom: 20, background: `${gold}08` },
  sectionTitle: { fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 800, margin: "0 0 16px", lineHeight: 1.2 },
  sectionSubtitle: { fontSize: "clamp(0.95rem, 2vw, 1.15rem)", color: "#888", marginBottom: 48, lineHeight: 1.7, maxWidth: 700 },

  problemGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20, marginBottom: 40 },
  problemCard: { background: card, border: `1px solid ${border}`, borderRadius: 16, padding: "28px 24px", textAlign: "center" },
  problemIcon: { fontSize: "2rem", marginBottom: 12 },
  problemStat: { fontSize: "2rem", fontWeight: 900, color: "#ff6b6b", marginBottom: 4 },
  problemCardLabel: { fontSize: "0.85rem", fontWeight: 600, color: "#F0F0F0", marginBottom: 12 },
  problemDesc: { fontSize: "0.82rem", color: "#666", lineHeight: 1.6 },
  problemConclusion: { background: `${gold}10`, border: `1px solid ${gold}30`, borderRadius: 12, padding: "20px 28px", color: "#CCC", fontSize: "1rem", lineHeight: 1.7, textAlign: "center" },

  solutionGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 },
  solutionCard: { background: card, border: `1px solid ${border}`, borderRadius: 16, padding: "28px 24px", transition: "border-color 0.3s" },
  solutionIcon: { fontSize: "1.8rem", marginBottom: 16 },
  solutionTitle: { fontSize: "1rem", fontWeight: 700, color: gold, marginBottom: 8 },
  solutionDesc: { fontSize: "0.85rem", color: "#888", lineHeight: 1.65 },

  goldGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 24, marginBottom: 40 },
  goldFeature: { background: card, border: `1px solid ${border}`, borderRadius: 16, padding: "32px 24px" },
  goldFeatureNum: { fontSize: "2.5rem", fontWeight: 900, color: `${gold}30`, marginBottom: 12 },
  goldFeatureTitle: { fontSize: "1rem", fontWeight: 700, color: gold, marginBottom: 12 },
  goldFeatureDesc: { fontSize: "0.85rem", color: "#888", lineHeight: 1.65 },
  goldQuote: { background: `${gold}08`, border: `1px solid ${gold}30`, borderRadius: 12, padding: "20px 32px", color: "#CCC", fontStyle: "italic", fontSize: "1rem", textAlign: "center" },

  techFlow: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16, marginBottom: 32, position: "relative" },
  techStep: { display: "flex", alignItems: "flex-start", gap: 16, background: card, border: `1px solid ${border}`, borderRadius: 12, padding: "20px 20px", position: "relative" },
  techStepNum: { width: 36, height: 36, borderRadius: "50%", background: `linear-gradient(135deg, ${gold}, ${goldLight})`, display: "flex", alignItems: "center", justifyContent: "center", color: "#000", fontWeight: 800, fontSize: "0.85rem", flexShrink: 0 },
  techStepContent: { flex: 1 },
  techStepTitle: { fontSize: "0.95rem", fontWeight: 700, color: "#F0F0F0", marginBottom: 6 },
  techStepDesc: { fontSize: "0.82rem", color: "#777", lineHeight: 1.6 },
  techArrow: { display: "none" },
  techPlatforms: { display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" },
  techPlatformLabel: { fontSize: "0.72rem", letterSpacing: "0.15em", color: "#555" },
  techPlatform: { padding: "6px 16px", border: `1px solid ${gold}40`, borderRadius: 20, fontSize: "0.82rem", color: gold },
  techSep: { color: "#444" },

  perfStats: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20, marginBottom: 40 },
  statCard: { background: card, border: `1px solid ${border}`, borderRadius: 16, padding: "28px 24px", textAlign: "center", borderTop: `2px solid ${gold}` },
  statValue: { fontSize: "clamp(1.8rem, 3vw, 2.6rem)", fontWeight: 900, color: gold, marginBottom: 8 },
  statLabel: { fontSize: "0.8rem", color: "#777", letterSpacing: "0.08em" },

  equityCurve: { background: card, border: `1px solid ${border}`, borderRadius: 16, padding: "28px", marginBottom: 24 },
  equityLabel: { fontSize: "0.75rem", letterSpacing: "0.15em", color: "#555", marginBottom: 20 },
  equityChart: { display: "flex", alignItems: "flex-end", gap: 24, height: 160, padding: "0 16px" },
  equityBar: { flex: 1, background: `linear-gradient(to top, ${gold}, ${goldLight}60)`, borderRadius: "6px 6px 0 0", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "8px 0", transition: "height 1s ease" },
  equityBarLabel: { fontSize: "0.75rem", color: "#000", fontWeight: 700 },
  equityMonths: { display: "flex", justifyContent: "space-around", marginTop: 12, color: "#555", fontSize: "0.78rem" },
  perfNote: { fontSize: "0.75rem", color: "#555", textAlign: "center", lineHeight: 1.6 },

  monthlyGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24, marginBottom: 32 },
  monthCard: { background: card, border: "1px solid", borderRadius: 16, padding: "32px 24px", position: "relative" },
  bestMonth: { position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: gold, color: "#000", fontSize: "0.65rem", fontWeight: 800, padding: "4px 14px", borderRadius: 20, letterSpacing: "0.1em" },
  monthTitle: { fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.15em", marginBottom: 16 },
  monthNet: { fontSize: "3rem", fontWeight: 900, color: "#4CAF50", marginBottom: 4 },
  monthWr: { fontSize: "1rem", color: gold, fontWeight: 600, marginBottom: 20 },
  monthDivider: { height: 1, background: border, marginBottom: 16 },
  monthDetail: { fontSize: "0.85rem", color: "#888", marginBottom: 6 },
  monthNote: { fontSize: "0.8rem", color: "#666", fontStyle: "italic", marginTop: 8 },
  monthlyNote: { background: `${gold}08`, border: `1px solid ${gold}20`, borderRadius: 12, padding: "20px 28px", color: "#AAA", fontSize: "0.9rem", lineHeight: 1.7, textAlign: "center" },

  riskGrid: { display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: 32, marginBottom: 32, alignItems: "start" },
  riskLeft: { display: "flex", flexDirection: "column", gap: 20 },
  riskMetric: { background: card, border: `1px solid ${border}`, borderRadius: 12, padding: "20px 24px" },
  riskMetricNum: { display: "block", fontSize: "2.2rem", fontWeight: 900, color: gold, marginBottom: 4 },
  riskMetricLbl: { fontSize: "0.8rem", color: "#777" },
  riskRight: {},
  riskTable: { background: card, border: `1px solid ${border}`, borderRadius: 12, overflow: "hidden" },
  riskTableHeader: { padding: "14px 20px", background: "#161616", fontSize: "0.75rem", letterSpacing: "0.1em", color: "#666", borderBottom: `1px solid ${border}` },
  riskRow: { display: "grid", gridTemplateColumns: "50px 70px 80px 1fr", gap: 8, padding: "10px 20px", borderBottom: `1px solid ${border}`, alignItems: "center" },
  riskCell: { fontSize: "0.82rem", color: "#999" },
  riskConclusion: { background: "#161616", border: `1px solid ${gold}30`, borderRadius: 12, padding: "20px 28px", color: "#CCC", fontSize: "0.95rem", lineHeight: 1.7, textAlign: "center" },

  pricingTabs: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, marginBottom: 32 },
  pricingSection: {},
  pricingType: { fontSize: "0.75rem", fontWeight: 800, letterSpacing: "0.2em", color: gold, marginBottom: 4 },
  pricingTypeDesc: { fontSize: "0.8rem", color: "#666", marginBottom: 20 },
  pricingCards: { display: "flex", gap: 12 },
  pricingCard: { flex: 1, background: card, border: "1px solid", borderRadius: 12, padding: "20px 16px", textAlign: "center", position: "relative" },
  popularBadge: { position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)", background: gold, color: "#000", fontSize: "0.6rem", fontWeight: 800, padding: "3px 10px", borderRadius: 10, letterSpacing: "0.1em", whiteSpace: "nowrap" },
  pricingSize: { fontSize: "1.3rem", fontWeight: 800, color: "#F0F0F0", marginBottom: 2 },
  pricingLabel: { fontSize: "0.7rem", color: "#555", marginBottom: 12 },
  pricingPrice: { fontSize: "1.6rem", fontWeight: 900, color: gold, marginBottom: 2 },
  pricingNote: { background: `${gold}08`, border: `1px solid ${gold}30`, borderRadius: 12, padding: "16px 24px", color: "#CCC", fontSize: "0.88rem", lineHeight: 1.6, textAlign: "center", marginBottom: 24 },
  payoutSplit: { display: "flex", justifyContent: "center", alignItems: "center", gap: 40, background: card, border: `1px solid ${border}`, borderRadius: 12, padding: "24px" },
  payoutSplitItem: { textAlign: "center" },
  payoutSplitNum: { fontSize: "2.5rem", fontWeight: 900, color: gold },
  payoutSplitLbl: { fontSize: "0.78rem", color: "#777", marginTop: 4 },
  payoutSplitDivider: { width: 1, height: 50, background: border },

  projTable: { background: card, border: `1px solid ${border}`, borderRadius: 16, overflow: "hidden", marginBottom: 32 },
  projHeader: { display: "grid", gridTemplateColumns: "1fr 1.5fr 1.5fr 1.5fr", gap: 16, padding: "14px 24px", background: "#161616", fontSize: "0.72rem", letterSpacing: "0.1em", color: "#555", borderBottom: `1px solid ${border}` },
  projRow: { display: "grid", gridTemplateColumns: "1fr 1.5fr 1.5fr 1.5fr", gap: 16, padding: "16px 24px", borderBottom: `1px solid ${border}`, fontSize: "0.9rem", color: "#AAA", border: "1px solid transparent" },
  projHighlight: { background: `${gold}08`, border: `1px solid ${gold}30`, borderRadius: 16, padding: "32px", textAlign: "center" },
  projHighlightTitle: { fontSize: "0.8rem", letterSpacing: "0.15em", color: gold, marginBottom: 24 },
  projHighlightStats: { display: "flex", justifyContent: "center", gap: 48, flexWrap: "wrap", marginBottom: 16 },
  projHighlightStat: {},
  projHighlightNum: { fontSize: "2.5rem", fontWeight: 900, color: gold },
  projHighlightLbl: { fontSize: "0.78rem", color: "#777", marginTop: 4 },
  projHighlightNote: { fontSize: "0.78rem", color: "#555" },

  processGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 },
  processCard: { background: card, border: `1px solid ${border}`, borderRadius: 16, padding: "28px 24px" },
  processNum: { fontSize: "2.5rem", fontWeight: 900, color: `${gold}40`, marginBottom: 12 },
  processTitle: { fontSize: "1rem", fontWeight: 700, color: gold, marginBottom: 10 },
  processDesc: { fontSize: "0.85rem", color: "#888", lineHeight: 1.65 },

  ctaGlow: { position: "absolute", top: "30%", left: "50%", transform: "translateX(-50%)", width: 800, height: 500, background: `radial-gradient(ellipse, ${gold}20 0%, transparent 70%)`, pointerEvents: "none" },
  ctaContent: { position: "relative", textAlign: "center", maxWidth: 800, margin: "0 auto" },
  ctaTitle: { fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 900, margin: "24px 0 20px", lineHeight: 1.2 },
  ctaSubtitle: { fontSize: "1.1rem", color: "#888", lineHeight: 1.7, marginBottom: 40 },
  ctaReasons: { display: "flex", flexDirection: "column", gap: 12, marginBottom: 48, alignItems: "center" },
  ctaReason: { fontSize: "0.95rem", color: "#CCC", padding: "10px 24px", background: card, border: `1px solid ${border}`, borderRadius: 8, width: "100%", maxWidth: 480, textAlign: "left" },
  ctaBtns: { display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap", marginBottom: 40 },
  ctaBtnPrimary: { display: "inline-block", padding: "20px 56px", background: `linear-gradient(135deg, ${gold}, ${goldLight})`, color: "#000", fontWeight: 800, fontSize: "1.05rem", borderRadius: 10, cursor: "pointer", textDecoration: "none", letterSpacing: "0.05em", boxShadow: `0 0 60px ${gold}50` },
  ctaDisclaimer: { fontSize: "0.72rem", color: "#444", lineHeight: 1.7, maxWidth: 600, margin: "0 auto" },
};
