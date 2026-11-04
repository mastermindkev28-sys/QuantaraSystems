import type { Metadata } from 'next';
import { FAQ, PHOTOS, PROCESS } from '../content';
import CapacityPanel from '../components/CapacityPanel';
import FinalCta from '../components/FinalCta';
import { Plus } from '../components/Icons';
import Photo from '../components/Photo';
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
        title="Considered, from the first conversation."
        lede="Every engagement begins with a private consultation. Accounts are configured individually and onboarded in limited numbers, so each receives proper oversight."
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

      <div className="wrap reveal">
        <Photo {...PHOTOS.engagement} ratio="21 / 8" />
      </div>

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
