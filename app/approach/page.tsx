import type { Metadata } from 'next';
import { ANATOMY, COMPARE, ENGINE, PHOTOS } from '../content';
import CompareTable from '../components/CompareTable';
import EnginePipeline from '../components/EnginePipeline';
import FinalCta from '../components/FinalCta';
import Photo from '../components/Photo';
import { Exhibit, Head, PageHero } from '../components/Section';
import TradeAnatomy from '../components/TradeAnatomy';

export const metadata: Metadata = {
  title: 'Approach',
  description: 'How QS1 executes: a six-stage process from market data to position management, applied to every order without discretion.',
};

export default function ApproachPage() {
  return (
    <>
      <PageHero
        eyebrow="Approach"
        title="A process, not a prediction."
        lede="QS1 does not rely on forecasting skill. It relies on carrying out a defined process the same way every time, from the first data point to the final record."
      />

      <section className="section">
        <div className="wrap">
          <Head idx="01" eyebrow="The process" a={ENGINE.titleA} b={ENGINE.titleB} lede={ENGINE.lede} />
          <Exhibit title={ENGINE.exhibit} note="Select a stage" />
          <div className="reveal"><EnginePipeline /></div>
        </div>
      </section>

      <div className="wrap reveal">
        <Photo {...PHOTOS.approach} ratio="21 / 8" />
      </div>

      <section className="section">
        <div className="wrap">
          <Head idx="02" eyebrow={ANATOMY.eyebrow} a={ANATOMY.titleA} b={ANATOMY.titleB} lede={ANATOMY.lede} />
          <Exhibit title={ANATOMY.exhibit} note="Illustrative" />
          <div className="reveal"><TradeAnatomy /></div>
          <p className="footnote">{ANATOMY.footnote}</p>
        </div>
      </section>

      <section className="section section--stone">
        <div className="wrap">
          <Head idx="03" eyebrow={COMPARE.eyebrow} a={COMPARE.titleA} b={COMPARE.titleB} />
          <CompareTable />
        </div>
      </section>

      <FinalCta />
    </>
  );
}
