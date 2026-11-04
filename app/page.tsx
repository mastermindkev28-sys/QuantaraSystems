import Script from 'next/script';
import {
  ACCESS, ANATOMY, COMPARE, DISCLOSURE, ENGINE, FAQ, FINAL, HERO, INFRA, NAV, PROBLEM, PROCESS, RISK,
} from './content';
import BookButton from './components/BookButton';
import EnginePipeline from './components/EnginePipeline';
import HeroConsole from './components/HeroConsole';
import { Check, INFRA_ICONS, Plus } from './components/Icons';
import MarketStrip from './components/MarketStrip';
import Nav from './components/Nav';
import QMark from './components/QMark';
import RevealObserver from './components/RevealObserver';
import RiskRings from './components/RiskRings';
import TradeAnatomy from './components/TradeAnatomy';

function Head({ eyebrow, a, b, lede, split }: { eyebrow: string; a: string; b: string; lede?: string; split?: boolean }) {
  return (
    <div className={`section-head${split ? ' section-head--split' : ''}`}>
      <div style={{ display: 'grid', gap: 24 }}>
        <span className="eyebrow reveal">{eyebrow}</span>
        <h2 className="h2 reveal" data-delay="1">
          {a} <span className="serif silver">{b}</span>
        </h2>
      </div>
      {lede && <p className="lede reveal" data-delay="2">{lede}</p>}
    </div>
  );
}

export default function Page() {
  return (
    <>
      <link rel="stylesheet" href="https://assets.calendly.com/assets/external/widget.css" precedence="default" />
      <Script src="https://assets.calendly.com/assets/external/widget.js" strategy="lazyOnload" />
      <RevealObserver />
      <Nav />

      <main id="top">
        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <section className="hero">
          <div className="hero__glow" />
          <div className="hero__grid" />
          <div className="wrap hero__layout">
            <div className="hero__copy">
              <span className="chip hero-in" style={{ animationDelay: '0.05s' }}>
                <span className="live-dot" />
                {HERO.chip}
              </span>
              <h1 className="display hero-in" style={{ animationDelay: '0.15s' }}>
                {HERO.titleA}{' '}
                <span className="serif silver">{HERO.titleB}</span>
              </h1>
              <p className="lede hero-in" style={{ animationDelay: '0.3s' }}>{HERO.lede}</p>
              <div className="hero__ctas hero-in" style={{ animationDelay: '0.45s' }}>
                <BookButton>{HERO.primary}</BookButton>
                <a href="#engine" className="btn btn--ghost">{HERO.secondary}</a>
              </div>
              <div className="hero__trust hero-in" style={{ animationDelay: '0.6s' }}>
                {HERO.trust.map(t => (
                  <span key={t}><Check />{t}</span>
                ))}
              </div>
            </div>
            <div className="hero-in" style={{ animationDelay: '0.35s' }}>
              <HeroConsole />
            </div>
          </div>
        </section>

        <MarketStrip />

        {/* ── The problem ──────────────────────────────────────────────────── */}
        <section className="section" id="why">
          <div className="wrap">
            <Head eyebrow={PROBLEM.eyebrow} a={PROBLEM.titleA} b={PROBLEM.titleB} lede={PROBLEM.lede} split />
            <div className="problem__grid reveal">
              {PROBLEM.flaws.map(f => (
                <article key={f.k} className="flaw">
                  <span className="flaw__k mono">{f.k}</span>
                  <div className="flaw__big silver">
                    {f.big}<small>{f.unit}</small>
                  </div>
                  <h3 className="h3">{f.title}</h3>
                  <p className="body">{f.body}</p>
                </article>
              ))}
            </div>
            <p className="statement reveal">
              {PROBLEM.statementA} <strong>{PROBLEM.statementB}</strong> {PROBLEM.statementC}
            </p>
          </div>
        </section>

        <div className="rule" />

        {/* ── Engine ───────────────────────────────────────────────────────── */}
        <section className="section engine" id="engine">
          <div className="wrap">
            <Head eyebrow={ENGINE.eyebrow} a={ENGINE.titleA} b={ENGINE.titleB} lede={ENGINE.lede} split />
            <div className="reveal">
              <EnginePipeline />
            </div>
          </div>
        </section>

        {/* ── Anatomy of a trade ───────────────────────────────────────────── */}
        <section className="section" id="execution" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <Head eyebrow={ANATOMY.eyebrow} a={ANATOMY.titleA} b={ANATOMY.titleB} lede={ANATOMY.lede} split />
            <div className="reveal">
              <TradeAnatomy />
            </div>
            <p className="footnote">{ANATOMY.footnote}</p>
          </div>
        </section>

        <div className="rule" />

        {/* ── Risk ─────────────────────────────────────────────────────────── */}
        <section className="section" id="risk">
          <div className="wrap">
            <Head eyebrow={RISK.eyebrow} a={RISK.titleA} b={RISK.titleB} lede={RISK.lede} split />
            <div className="reveal">
              <RiskRings />
            </div>
          </div>
        </section>

        {/* ── Comparison ───────────────────────────────────────────────────── */}
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <Head eyebrow={COMPARE.eyebrow} a={COMPARE.titleA} b={COMPARE.titleB} />
            <div className="panel compare reveal">
              <div className="compare__row compare__row--head">
                <div className="compare__cell" />
                <div className="compare__cell compare__cell--you">{COMPARE.you}</div>
                <div className="compare__cell compare__cell--qs">{COMPARE.qs}</div>
              </div>
              {COMPARE.rows.map(r => (
                <div key={r.k} className="compare__row">
                  <div className="compare__cell compare__cell--k">{r.k}</div>
                  <div className="compare__cell compare__cell--you"><span>{COMPARE.you}</span>{r.you}</div>
                  <div className="compare__cell compare__cell--qs"><span>{COMPARE.qs}</span>{r.qs}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="rule" />

        {/* ── Infrastructure ───────────────────────────────────────────────── */}
        <section className="section">
          <div className="wrap">
            <Head eyebrow={INFRA.eyebrow} a={INFRA.titleA} b={INFRA.titleB} lede={INFRA.lede} split />
            <div className="infra">
              {INFRA.cards.map((c, i) => {
                const Icon = INFRA_ICONS[c.icon as keyof typeof INFRA_ICONS];
                return (
                  <article key={c.title} className="panel infra__card reveal" data-delay={String(i + 1)}>
                    <span className="infra__icon"><Icon /></span>
                    <h3 className="h3">{c.title}</h3>
                    <p className="body">{c.body}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Process + access ─────────────────────────────────────────────── */}
        <section className="section" id="access" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <Head eyebrow={PROCESS.eyebrow} a={PROCESS.titleA} b={PROCESS.titleB} />
            <ol className="steps">
              {PROCESS.steps.map((s, i) => (
                <li key={s.k} className="step reveal" data-delay={String(i + 1)}>
                  <span className="step__k mono">{s.k}</span>
                  <h3 className="h3">{s.title}</h3>
                  <p className="body">{s.body}</p>
                </li>
              ))}
            </ol>

            <div className="panel access reveal" style={{ marginTop: 'clamp(56px, 7vw, 96px)' }}>
              <QMark id="access" size="100%" className="access__mark" stroke={20} />
              <div style={{ position: 'relative', display: 'grid', gap: 24, justifyItems: 'start' }}>
                <span className="eyebrow">{ACCESS.eyebrow}</span>
                <h2 className="h2">{ACCESS.title}</h2>
                <p className="lede">{ACCESS.body}</p>
                <div className="guarantee">
                  <Check size={18} />
                  <span><strong>{ACCESS.guaranteeStrong}</strong> {ACCESS.guarantee}</span>
                </div>
                <BookButton>{ACCESS.cta}</BookButton>
              </div>
              <div style={{ position: 'relative' }}>
                <p className="mono muted" style={{ fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>
                  {ACCESS.criteriaTitle}
                </p>
                <ul className="criteria">
                  {ACCESS.criteria.map(c => (
                    <li key={c}><Check size={18} />{c}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <div className="rule" />

        {/* ── FAQ ──────────────────────────────────────────────────────────── */}
        <section className="section" id="faq">
          <div className="wrap" style={{ display: 'grid', gap: 48 }}>
            <Head eyebrow="Questions" a="Asked" b="before every call." />
            <div className="faq reveal">
              {FAQ.map(f => (
                <details key={f.q}>
                  <summary>
                    {f.q}
                    <span className="faq__icon"><Plus /></span>
                  </summary>
                  <p className="faq__a body">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── Final CTA ────────────────────────────────────────────────────── */}
        <section className="section final">
          <QMark id="final" size="100%" className="final__mark" stroke={18} />
          <div className="wrap final__inner">
            <h2 className="display reveal" style={{ fontSize: 'clamp(40px, 6.4vw, 92px)', maxWidth: 1100 }}>
              {FINAL.titleA}{' '}
              <span className="serif silver">{FINAL.titleB}</span>
            </h2>
            <p className="lede reveal" data-delay="1" style={{ marginInline: 'auto' }}>{FINAL.body}</p>
            <div className="reveal" data-delay="2">
              <BookButton>{FINAL.cta}</BookButton>
            </div>
            <p className="mono muted reveal" data-delay="3" style={{ fontSize: 12, letterSpacing: '0.08em' }}>
              {FINAL.fine.join('  ·  ')}
            </p>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="wrap">
          <div className="footer__top">
            <div style={{ display: 'grid', gap: 16 }}>
              <a href="#top" className="brand">
                <QMark id="footer" size={28} />
                <span className="brand__word">Quantara <span>Systems</span></span>
              </a>
              <p className="body muted" style={{ maxWidth: 380, fontSize: 14 }}>
                Autonomous execution for gold futures. Engineered to remove the human bottleneck.
              </p>
            </div>
            <nav className="footer__links" aria-label="Footer">
              {NAV.map(l => <a key={l.href} href={l.href}>{l.label}</a>)}
            </nav>
          </div>
          <p className="disclosure"><strong>Risk disclosure.</strong> {DISCLOSURE}</p>
          <div className="footer__base">
            <span>&copy; {new Date().getFullYear()} Quantara Systems. All rights reserved.</span>
            <span>quantarasystems.io</span>
          </div>
        </div>
      </footer>
    </>
  );
}
