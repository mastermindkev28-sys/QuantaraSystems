import Link from 'next/link';
import { ANATOMY, COMPARE, CTA, ENGINE, HERO, MARKETS, PLATFORM, RECORDS, RISK } from './content';
import BookButton from './components/BookButton';
import CompareTable from './components/CompareTable';
import EnginePipeline from './components/EnginePipeline';
import FinalCta from './components/FinalCta';
import GoldMarket from './components/GoldMarket';
import { Arrow, Check } from './components/Icons';
import MarketStrip from './components/MarketStrip';
import Platforms from './components/Platforms';
import ProductConsole from './components/ProductConsole';
import RecordSample from './components/RecordSample';
import RiskRings from './components/RiskRings';
import { Exhibit, Head } from './components/Section';
import TradeAnatomy from './components/TradeAnatomy';

export default function Home() {
  return (
    <>
      {/* ── Positioning ──────────────────────────────────────────────────── */}
      <section className="hero on-dark">
        <div className="wrap">
          <div className="hero__layout">
            <div className="hero__copy">
              <span className="eyebrow hero-in">{HERO.label}</span>
              <h1 className="display hero-in" style={{ animationDelay: '0.08s' }}>{HERO.title}</h1>
            </div>
            <div className="hero__aside">
              <p className="lede hero-in" style={{ animationDelay: '0.16s' }}>{HERO.lede}</p>
              <div className="hero__ctas hero-in" style={{ animationDelay: '0.24s' }}>
                <BookButton>{HERO.primary}</BookButton>
                <a href="#platform" className="btn btn--ghost">{HERO.secondary}</a>
              </div>
            </div>
          </div>
          <div className="hero__visual hero-in" style={{ animationDelay: '0.32s' }}>
            <ProductConsole />
          </div>
          <ul className="hero__points mono hero-in" style={{ animationDelay: '0.4s' }}>
            {HERO.points.map(p => <li key={p}><Check size={14} />{p}</li>)}
          </ul>
        </div>
      </section>

      {/* ── 01 Product ───────────────────────────────────────────────────── */}
      <section className="section" id="platform">
        <div className="wrap">
          <Head idx="01" eyebrow={PLATFORM.eyebrow} a={PLATFORM.titleA} b={PLATFORM.titleB} lede={PLATFORM.lede} />
          <ol className="caps">
            {PLATFORM.capabilities.map((c, i) => (
              <li key={c.k} className="cap draw-in reveal" data-delay={String((i % 4) + 1)}>
                <span className="cap__n mono">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="h3">{c.k}</h3>
                <p className="body">{c.body}</p>
              </li>
            ))}
            <li className="cap cap--layers draw-in reveal" data-delay="4">
              <span className="cap__n mono">{PLATFORM.layersTitle}</span>
              {PLATFORM.layers.map(l => (
                <div key={l.k}>
                  <h3 className="h3">{l.k}</h3>
                  <p className="body">{l.body}</p>
                </div>
              ))}
            </li>
          </ol>
        </div>
      </section>

      {/* ── 02 Methodology ───────────────────────────────────────────────── */}
      <section className="section section--stone" id="process">
        <div className="wrap">
          <Head idx="02" eyebrow={ENGINE.eyebrow} a={ENGINE.titleA} b={ENGINE.titleB} lede={ENGINE.lede} />
          <Exhibit title={ENGINE.exhibit} note="Select a stage" />
          <div className="reveal"><EnginePipeline /></div>
        </div>
      </section>

      {/* ── 03 Execution ─────────────────────────────────────────────────── */}
      <section className="section">
        <div className="wrap">
          <Head idx="03" eyebrow={ANATOMY.eyebrow} a={ANATOMY.titleA} b={ANATOMY.titleB} lede={ANATOMY.lede} />
          <Exhibit title={ANATOMY.exhibit} note="Illustrative" />
          <div className="reveal"><TradeAnatomy /></div>
          <p className="footnote">{ANATOMY.footnote}</p>
          <Link href="/execution" className="text-link reveal">{CTA.execution}<Arrow /></Link>
        </div>
      </section>

      {/* ── 04 Risk management ───────────────────────────────────────────── */}
      <section className="section section--stone">
        <div className="wrap">
          <Head idx="04" eyebrow={RISK.eyebrow} a={RISK.titleA} b={RISK.titleB} lede={RISK.lede} />
          <Exhibit title={RISK.exhibit} note="Illustrative values" />
          <div className="reveal"><RiskRings /></div>
          <Link href="/risk" className="text-link reveal">Review the risk framework<Arrow /></Link>
        </div>
      </section>

      {/* ── 05 Comparison ────────────────────────────────────────────────── */}
      <section className="section">
        <div className="wrap">
          <Head idx="05" eyebrow={COMPARE.eyebrow} a={COMPARE.titleA} b={COMPARE.titleB} />
          <CompareTable />
        </div>
      </section>

      {/* ── 06 Markets ───────────────────────────────────────────────────── */}
      <section className="section section--stone" id="markets">
        <div className="wrap">
          <Head idx="06" eyebrow={MARKETS.eyebrow} a={MARKETS.titleA} b={MARKETS.titleB} lede={MARKETS.lede} />
          <div className="reveal"><GoldMarket /></div>
          <div className="reference reveal">
            <p className="reference__note">{MARKETS.referenceNote}</p>
            <MarketStrip exclude={['GC']} />
          </div>
        </div>
      </section>

      {/* ── 07 Records ───────────────────────────────────────────────────── */}
      <section className="section">
        <div className="wrap">
          <Head idx="07" eyebrow={RECORDS.eyebrow} a={RECORDS.titleA} b={RECORDS.titleB} lede={RECORDS.lede} />
          <Exhibit title={RECORDS.exhibit} note="Illustrative" />
          <RecordSample />
          <p className="footnote">{RECORDS.footnote}</p>
        </div>
      </section>

      {/* ── Compatibility ────────────────────────────────────────────────── */}
      <section className="section section--tight section--stone">
        <div className="wrap"><Platforms /></div>
      </section>

      <FinalCta />
    </>
  );
}
