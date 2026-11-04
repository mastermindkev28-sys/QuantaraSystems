import Script from 'next/script';
import {
  ACCESS, ANATOMY, COMPARE, DISCLOSURE, ENGINE, FAQ, FINAL, HERO, INFRA, NAV, PROBLEM, PROCESS, RISK,
} from './content';
import BookButton from './components/BookButton';
import EnginePipeline from './components/EnginePipeline';
import { Arrow, Check, INFRA_ICONS, Plus } from './components/Icons';
import MarketStrip from './components/MarketStrip';
import Nav from './components/Nav';
import QMark from './components/QMark';
import RevealObserver from './components/RevealObserver';
import RiskRings from './components/RiskRings';
import TradeAnatomy from './components/TradeAnatomy';

// Section header: index and label on the left, a two-tone statement on the right.
function Head({ idx, eyebrow, a, b, lede }: { idx: string; eyebrow: string; a: string; b: string; lede?: string }) {
  return (
    <header className="section-head">
      <span className="eyebrow reveal">
        <span className="idx">{idx}</span>
        {eyebrow}
      </span>
      <div className="section-head__main">
        <h2 className="h2 reveal" data-delay="1">
          {a} <span className="soft">{b}</span>
        </h2>
        {lede && <p className="lede reveal" data-delay="2">{lede}</p>}
      </div>
    </header>
  );
}

function Exhibit({ title, note }: { title: string; note: string }) {
  return (
    <div className="exhibit reveal">
      <span>{title}</span>
      <span>{note}</span>
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
        <section className="hero on-dark">
          <QMark id="hero-mark" size="100%" className="hero__mark" stroke={14} fan={false} />
          <div className="wrap hero__layout">
            <div className="hero__copy">
              <span className="eyebrow">{HERO.label}</span>
              <h1 className="display">{HERO.title}</h1>
              <p className="lede">{HERO.lede}</p>
              <div className="hero__ctas">
                <BookButton>{HERO.primary}</BookButton>
                <a href="#engine" className="btn btn--ghost">{HERO.secondary}</a>
              </div>
            </div>
            <dl className="facts">
              {HERO.facts.map(f => (
                <div key={f.k}>
                  <dt>{f.k}</dt>
                  <dd>{f.v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <MarketStrip />

        {/* ── 01 The problem ───────────────────────────────────────────────── */}
        <section className="section" id="why">
          <div className="wrap">
            <Head idx="01" eyebrow={PROBLEM.eyebrow} a={PROBLEM.titleA} b={PROBLEM.titleB} lede={PROBLEM.lede} />
            <div className="problem__grid">
              {PROBLEM.flaws.map((f, i) => (
                <article key={f.k} className="flaw reveal" data-delay={String(i + 1)}>
                  <span className="flaw__k">{f.k}</span>
                  <div className="flaw__big">
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

        {/* ── 02 Approach ──────────────────────────────────────────────────── */}
        <section className="section section--stone" id="engine">
          <div className="wrap">
            <Head idx="02" eyebrow={ENGINE.eyebrow} a={ENGINE.titleA} b={ENGINE.titleB} lede={ENGINE.lede} />
            <Exhibit title={ENGINE.exhibit} note="Select a stage" />
            <div className="reveal">
              <EnginePipeline />
            </div>
          </div>
        </section>

        {/* ── 03 Execution ─────────────────────────────────────────────────── */}
        <section className="section" id="execution">
          <div className="wrap">
            <Head idx="03" eyebrow={ANATOMY.eyebrow} a={ANATOMY.titleA} b={ANATOMY.titleB} lede={ANATOMY.lede} />
            <Exhibit title={ANATOMY.exhibit} note="Illustrative" />
            <div className="reveal">
              <TradeAnatomy />
            </div>
            <p className="footnote">{ANATOMY.footnote}</p>
          </div>
        </section>

        {/* ── 04 Risk ──────────────────────────────────────────────────────── */}
        <section className="section section--stone" id="risk">
          <div className="wrap">
            <Head idx="04" eyebrow={RISK.eyebrow} a={RISK.titleA} b={RISK.titleB} lede={RISK.lede} />
            <Exhibit title={RISK.exhibit} note="Hover a layer for detail" />
            <div className="reveal">
              <RiskRings />
            </div>
          </div>
        </section>

        {/* ── 05 Comparison ────────────────────────────────────────────────── */}
        <section className="section">
          <div className="wrap">
            <Head idx="05" eyebrow={COMPARE.eyebrow} a={COMPARE.titleA} b={COMPARE.titleB} />
            <div className="compare reveal" role="table" aria-label="Discretionary and systematic execution compared">
              <div className="compare__row compare__row--head" role="row">
                <div className="compare__cell" role="columnheader" />
                <div className="compare__cell compare__cell--you" role="columnheader">{COMPARE.you}</div>
                <div className="compare__cell compare__cell--qs" role="columnheader">{COMPARE.qs}</div>
              </div>
              {COMPARE.rows.map(r => (
                <div key={r.k} className="compare__row" role="row">
                  <div className="compare__cell compare__cell--k" role="rowheader">{r.k}</div>
                  <div className="compare__cell compare__cell--you" role="cell"><span>{COMPARE.you}</span>{r.you}</div>
                  <div className="compare__cell compare__cell--qs" role="cell"><span>{COMPARE.qs}</span>{r.qs}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 06 Infrastructure ────────────────────────────────────────────── */}
        <section className="section section--stone">
          <div className="wrap">
            <Head idx="06" eyebrow={INFRA.eyebrow} a={INFRA.titleA} b={INFRA.titleB} lede={INFRA.lede} />
            <div className="infra">
              {INFRA.cards.map((c, i) => {
                const Icon = INFRA_ICONS[c.icon as keyof typeof INFRA_ICONS];
                return (
                  <article key={c.title} className="infra__card reveal" data-delay={String(i + 1)}>
                    <span className="infra__icon"><Icon size={24} /></span>
                    <h3 className="h3">{c.title}</h3>
                    <p className="body">{c.body}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── 07 Engagement ────────────────────────────────────────────────── */}
        <section className="section" id="access">
          <div className="wrap">
            <Head idx="07" eyebrow={PROCESS.eyebrow} a={PROCESS.titleA} b={PROCESS.titleB} />
            <ol className="steps">
              {PROCESS.steps.map((s, i) => (
                <li key={s.k} className="step reveal" data-delay={String(i + 1)}>
                  <span className="step__k">{s.k}</span>
                  <h3 className="h3">{s.title}</h3>
                  <p className="body">{s.body}</p>
                </li>
              ))}
            </ol>

            <div className="access on-dark reveal" style={{ marginTop: 'clamp(64px, 8vw, 112px)' }}>
              <div style={{ display: 'grid', gap: 24, justifyItems: 'start', alignContent: 'start' }}>
                <span className="eyebrow">{ACCESS.eyebrow}</span>
                <h2 className="h2">{ACCESS.title}</h2>
                <p className="lede">{ACCESS.body}</p>
                <div className="guarantee">
                  <Check size={18} />
                  <span><strong>{ACCESS.guaranteeStrong}</strong> {ACCESS.guarantee}</span>
                </div>
                <BookButton>{ACCESS.cta}</BookButton>
              </div>
              <div>
                <p className="eyebrow" style={{ marginBottom: 16 }}>{ACCESS.criteriaTitle}</p>
                <ul className="criteria">
                  {ACCESS.criteria.map(c => (
                    <li key={c}><Check size={18} />{c}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ── 08 FAQ ───────────────────────────────────────────────────────── */}
        <section className="section section--stone" id="faq">
          <div className="wrap">
            <Head idx="08" eyebrow="Questions" a="Frequently" b="asked questions." />
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

        {/* ── Final call to action ─────────────────────────────────────────── */}
        <section className="section final on-dark">
          <QMark id="final-mark" size="100%" className="final__mark" stroke={14} fan={false} />
          <div className="wrap final__inner">
            <span className="eyebrow reveal">Consultation</span>
            <h2 className="display reveal" style={{ fontSize: 'clamp(40px, 5.6vw, 84px)', maxWidth: 1000 }}>
              {FINAL.titleA} <span style={{ color: 'var(--text-3)' }}>{FINAL.titleB}</span>
            </h2>
            <p className="lede reveal">{FINAL.body}</p>
            <div className="reveal" style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              <BookButton>{FINAL.cta}</BookButton>
              <a href="#faq" className="btn btn--ghost">Read the FAQ<Arrow /></a>
            </div>
            <p className="muted reveal" style={{ fontSize: 14 }}>{FINAL.fine.join('  ·  ')}</p>
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
              <p className="body muted" style={{ maxWidth: 400, fontSize: 15 }}>
                Systematic execution for COMEX gold futures.
              </p>
            </div>
            <nav className="footer__links" aria-label="Footer">
              {NAV.map(l => <a key={l.href} href={l.href}>{l.label}</a>)}
            </nav>
          </div>
          <p className="disclosure"><strong>Important information.</strong> {DISCLOSURE}</p>
          <div className="footer__base">
            <span>&copy; {new Date().getFullYear()} Quantara Systems. All rights reserved.</span>
            <span>quantarasystems.io</span>
          </div>
        </div>
      </footer>
    </>
  );
}
