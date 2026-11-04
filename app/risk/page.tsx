import type { Metadata } from 'next';
import { INFRA, PHOTOS, RISK } from '../content';
import FinalCta from '../components/FinalCta';
import { INFRA_ICONS } from '../components/Icons';
import Photo from '../components/Photo';
import RiskRings from '../components/RiskRings';
import { Exhibit, Head, PageHero } from '../components/Section';

export const metadata: Metadata = {
  title: 'Risk management',
  description: 'Four independent layers of risk control surround every QS1 order, from the trade to the whole system.',
};

export default function RiskPage() {
  return (
    <>
      <PageHero
        eyebrow="Risk management"
        title="Limits that hold under pressure."
        lede="Risk control in QS1 is structural. It is enforced before an order is sent, monitored while a position is open, and backed by people who can stand the system down."
      />

      <section className="section">
        <div className="wrap">
          <Head idx="01" eyebrow="Architecture" a={RISK.titleA} b={RISK.titleB} lede={RISK.lede} />
          <Exhibit title={RISK.exhibit} note="Hover a layer for detail" />
          <div className="reveal"><RiskRings /></div>
        </div>
      </section>

      <div className="wrap reveal">
        <Photo {...PHOTOS.risk} ratio="21 / 8" />
      </div>

      <section className="section">
        <div className="wrap">
          <Head idx="02" eyebrow={INFRA.eyebrow} a={INFRA.titleA} b={INFRA.titleB} lede={INFRA.lede} />
          <div className="infra">
            {INFRA.cards.map((c, i) => {
              const Icon = INFRA_ICONS[c.icon as keyof typeof INFRA_ICONS];
              return (
                <article key={c.title} className="infra__card draw-in reveal" data-delay={String(i + 1)}>
                  <span className="infra__icon"><Icon size={24} /></span>
                  <h3 className="h3">{c.title}</h3>
                  <p className="body">{c.body}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <FinalCta />
    </>
  );
}
