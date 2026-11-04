import type { Metadata } from 'next';
import { ANATOMY, COMPARE, MARKETS, RECORDS } from '../content';
import CompareTable from '../components/CompareTable';
import FinalCta from '../components/FinalCta';
import GoldMarket from '../components/GoldMarket';
import RecordSample from '../components/RecordSample';
import { Exhibit, Head, PageHero } from '../components/Section';
import TradeAnatomy from '../components/TradeAnatomy';

export const metadata: Metadata = {
  title: 'Execution',
  description: 'How a QS1 trade is executed and recorded: qualification, bracket orders, position management and a time-stamped record of every event.',
};

export default function ExecutionPage() {
  return (
    <>
      <PageHero
        eyebrow="Execution"
        title="Every decision, recorded in sequence."
        lede="From the first data point to the final fill, each QS1 trade follows a fixed order of operations, and each step is written to the record as it happens."
      />

      <section className="section">
        <div className="wrap">
          <Head idx="01" eyebrow={ANATOMY.eyebrow} a={ANATOMY.titleA} b={ANATOMY.titleB} lede={ANATOMY.lede} />
          <Exhibit title={ANATOMY.exhibit} note="Illustrative" />
          <div className="reveal"><TradeAnatomy /></div>
          <p className="footnote">{ANATOMY.footnote}</p>
        </div>
      </section>

      <section className="section section--stone">
        <div className="wrap">
          <Head idx="02" eyebrow={RECORDS.eyebrow} a={RECORDS.titleA} b={RECORDS.titleB} lede={RECORDS.lede} />
          <Exhibit title={RECORDS.exhibit} note="Illustrative" />
          <RecordSample />
          <p className="footnote">{RECORDS.footnote}</p>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <Head idx="03" eyebrow={COMPARE.eyebrow} a={COMPARE.titleA} b={COMPARE.titleB} />
          <CompareTable />
        </div>
      </section>

      <section className="section section--stone">
        <div className="wrap">
          <Head idx="04" eyebrow={MARKETS.eyebrow} a={MARKETS.titleA} b={MARKETS.titleB} lede={MARKETS.lede} />
          <div className="reveal"><GoldMarket /></div>
        </div>
      </section>

      <FinalCta />
    </>
  );
}
