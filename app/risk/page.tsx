import type { Metadata } from 'next';
import { INFRA, RISK } from '../content';
import FinalCta from '../components/FinalCta';
import { Check, INFRA_ICONS } from '../components/Icons';
import RiskRings from '../components/RiskRings';
import { Exhibit, Head, PageHero } from '../components/Section';

export const metadata: Metadata = {
  title: 'Risk Management',
  description: 'How QS1 defines risk before every trade and enforces it through to the close: trade, session, account and system controls.',
};

export default function RiskPage() {
  return (
    <>
      <PageHero
        eyebrow="Risk management"
        title="Risk is set before the trade is placed."
        lede="Every QS1 order carries its risk parameters from the moment it is created. Controls operate at four levels, from the individual trade to the whole system."
      >
        <ul className="page-hero__points mono">
          {RISK.principles.map(p => <li key={p}><Check size={14} />{p}</li>)}
        </ul>
      </PageHero>

      <section className="section">
        <div className="wrap">
          <Head idx="01" eyebrow="Architecture" a={RISK.titleA} b={RISK.titleB} lede={RISK.lede} />
          <Exhibit title={RISK.exhibit} note="Illustrative values" />
          <div className="reveal"><RiskRings /></div>
        </div>
      </section>

      <section className="section section--stone">
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
