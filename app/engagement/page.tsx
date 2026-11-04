import type { Metadata } from 'next';
import { FAQ, PROCESS } from '../content';
import CapacityPanel from '../components/CapacityPanel';
import FinalCta from '../components/FinalCta';
import { Plus } from '../components/Icons';
import { Head, PageHero } from '../components/Section';

export const metadata: Metadata = {
  title: 'Engagement',
  description: 'How an engagement with Quantara Systems works, from a private consultation to live execution, and answers to common questions.',
};

export default function EngagementPage() {
  return (
    <>
      <PageHero
        eyebrow="Engagement"
        title="From private walkthrough to live execution."
        lede="Every engagement starts with a private walkthrough of the QS1 framework. From there, we configure and connect your account and monitor it every session."
      />

      <section className="section">
        <div className="wrap">
          <Head idx="01" eyebrow={PROCESS.eyebrow} a={PROCESS.titleA} b={PROCESS.titleB} />
          <ol className="steps">
            {PROCESS.steps.map((s, i) => (
              <li key={s.k} className="step draw-in reveal" data-delay={String(i + 1)}>
                <span className="step__k">{s.k}</span>
                <h3 className="h3">{s.title}</h3>
                <p className="body">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>


      <section className="section">
        <div className="wrap">
          <CapacityPanel />
        </div>
      </section>

      <section className="section section--stone" id="faq">
        <div className="wrap">
          <Head idx="02" eyebrow="Questions" a="Frequently" b="asked questions." />
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

      <FinalCta />
    </>
  );
}
