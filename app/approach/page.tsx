import type { Metadata } from 'next';
import { ENGINE, PLATFORM, PROBLEM } from '../content';
import CountUp from '../components/CountUp';
import EnginePipeline from '../components/EnginePipeline';
import FinalCta from '../components/FinalCta';
import { Exhibit, Head, PageHero } from '../components/Section';

export const metadata: Metadata = {
  title: 'Approach',
  description: 'The QS1 framework: integrated market analysis, strategy confluence and a six-stage execution lifecycle applied by rule to every trade.',
};

export default function ApproachPage() {
  return (
    <>
      <PageHero
        eyebrow="Approach"
        title="A process, not a prediction."
        lede="QS1 brings structure to futures execution. A confluence framework decides which setups qualify, and a six-stage lifecycle governs how every qualified trade is handled from the first data point to the final record."
      />

      <section className="section">
        <div className="wrap">
          <Head idx="01" eyebrow={PROBLEM.eyebrow} a={PROBLEM.titleA} b={PROBLEM.titleB} lede={PROBLEM.lede} />
          <div className="problem__grid">
            {PROBLEM.flaws.map((f, i) => (
              <article key={f.k} className="flaw draw-in reveal" data-delay={String(i + 1)}>
                <span className="flaw__k">{f.k}</span>
                <div className="flaw__big"><CountUp value={f.big} /><small>{f.unit}</small></div>
                <h3 className="h3">{f.title}</h3>
                <p className="body">{f.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--stone">
        <div className="wrap">
          <Head idx="02" eyebrow={PLATFORM.eyebrow} a={PLATFORM.titleA} b={PLATFORM.titleB} lede={PLATFORM.lede} />
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

      <section className="section">
        <div className="wrap">
          <Head idx="03" eyebrow={ENGINE.eyebrow} a={ENGINE.titleA} b={ENGINE.titleB} lede={ENGINE.lede} />
          <Exhibit title={ENGINE.exhibit} note="Select a stage" />
          <div className="reveal"><EnginePipeline /></div>
        </div>
      </section>

      <FinalCta />
    </>
  );
}
