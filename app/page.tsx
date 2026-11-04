import Link from 'next/link';
import { ENGINE, HERO, OVERVIEW_PDF, PHOTOS, PROBLEM, RISK } from './content';
import BookButton from './components/BookButton';
import CapacityPanel from './components/CapacityPanel';
import CountUp from './components/CountUp';
import FinalCta from './components/FinalCta';
import { Arrow } from './components/Icons';
import MarketStrip from './components/MarketStrip';
import Photo from './components/Photo';
import Platforms from './components/Platforms';
import QMark from './components/QMark';
import { Head } from './components/Section';
import { ARTICLES, formatDate } from './insights/articles';

export default function Home() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="hero on-dark">
        <QMark id="hero-mark" size="100%" className="hero__mark" stroke={14} fan={false} />
        <div className="wrap hero__layout">
          <div className="hero__copy">
            <span className="eyebrow hero-in">{HERO.label}</span>
            <h1 className="display hero-in" style={{ animationDelay: '0.08s' }}>{HERO.title}</h1>
            <p className="lede hero-in" style={{ animationDelay: '0.16s' }}>{HERO.lede}</p>
            <div className="hero__ctas hero-in" style={{ animationDelay: '0.24s' }}>
              <BookButton>{HERO.primary}</BookButton>
              <Link href="/approach" className="btn btn--ghost">{HERO.secondary}</Link>
            </div>
          </div>
          <dl className="facts hero-in" style={{ animationDelay: '0.32s' }}>
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
      <section className="section">
        <div className="wrap">
          <Head idx="01" eyebrow={PROBLEM.eyebrow} a={PROBLEM.titleA} b={PROBLEM.titleB} lede={PROBLEM.lede} />
          <div className="problem__grid">
            {PROBLEM.flaws.map((f, i) => (
              <article key={f.k} className="flaw draw-in reveal" data-delay={String(i + 1)}>
                <span className="flaw__k">{f.k}</span>
                <div className="flaw__big">
                  <CountUp value={f.big} /><small>{f.unit}</small>
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

      <div className="wrap reveal">
        <Photo {...PHOTOS.hero} ratio="21 / 8" caption="QS1 trades one market: COMEX gold futures." />
      </div>

      {/* ── 02 Approach (summary) ────────────────────────────────────────── */}
      <section className="section">
        <div className="wrap">
          <Head idx="02" eyebrow={ENGINE.eyebrow} a={ENGINE.titleA} b={ENGINE.titleB}
            lede="Every order goes through the same six stages, in the same order, on every trade." />
          <ol className="summary-grid">
            {ENGINE.stages.map((s, i) => (
              <li key={s.key} className="summary draw-in reveal" data-delay={String((i % 3) + 1)}>
                <span className="summary__n">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="h3">{s.name}</h3>
                <p className="body">{s.title}</p>
              </li>
            ))}
          </ol>
          <Link href="/approach" className="text-link reveal">Explore the full process<Arrow /></Link>
        </div>
      </section>

      {/* ── 03 Risk (summary) ────────────────────────────────────────────── */}
      <section className="section section--stone">
        <div className="wrap">
          <Head idx="03" eyebrow={RISK.eyebrow} a={RISK.titleA} b={RISK.titleB} lede={RISK.lede} />
          <ol className="summary-grid summary-grid--4">
            {RISK.layers.map((l, i) => (
              <li key={l.k} className="summary draw-in reveal" data-delay={String(i + 1)}>
                <span className="summary__n">{l.k} · {l.name}</span>
                <h3 className="h3">{l.title}</h3>
                <p className="body">{l.body}</p>
              </li>
            ))}
          </ol>
          <Link href="/risk" className="text-link reveal">See the risk architecture<Arrow /></Link>
        </div>
      </section>

      {/* ── Compatibility ────────────────────────────────────────────────── */}
      <section className="section section--tight">
        <div className="wrap">
          <Platforms />
        </div>
      </section>

      {/* ── 04 Insights ──────────────────────────────────────────────────── */}
      <section className="section section--stone">
        <div className="wrap">
          <Head idx="04" eyebrow="Insights" a="Research notes" b="on execution and risk." />
          <div className="cards">
            {ARTICLES.map((a, i) => (
              <Link key={a.slug} href={`/insights/${a.slug}`} className="card draw-in reveal" data-delay={String(i + 1)}>
                <span className="card__meta">{a.topic} · {formatDate(a.date)}</span>
                <h3 className="h3">{a.title}</h3>
                <p className="body">{a.summary}</p>
                <span className="text-link">Read · {a.readMinutes} min<Arrow /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Capacity ─────────────────────────────────────────────────────── */}
      <section className="section">
        <div className="wrap">
          <CapacityPanel />
          <p className="muted reveal" style={{ marginTop: 24, fontSize: 14 }}>
            Prefer to read first? <a href={OVERVIEW_PDF} download className="inline-link">Download the one-page QS1 overview (PDF)</a>.
          </p>
        </div>
      </section>

      <FinalCta />
    </>
  );
}
