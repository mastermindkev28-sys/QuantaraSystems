import type { Metadata } from 'next';
import { COMPANY, ENGINE, HERO, PLATFORMS, PROCESS, PROBLEM, RISK } from '../content';
import Logo from '../components/Logo';

// The printable one-page overview. Rendered to public/quantara-qs1-overview.pdf by
// `npm run overview:pdf`; viewable here for proofing.
export const metadata: Metadata = {
  title: 'QS1 overview',
  robots: { index: false, follow: false },
};

export default function OverviewPage() {
  return (
    <div className="doc-wrap">
      <article className="doc">
        <header className="doc__head on-dark">
          <div className="doc__brand">
            <Logo size={40} priority />
            <span className="brand__word">Quantara <span>Systems</span></span>
          </div>
          <div>
            <p className="doc__kicker">QS1 · Systematic execution for COMEX gold futures</p>
            <h1 className="doc__title">{HERO.title}</h1>
          </div>
        </header>

        <section className="doc__intro">
          <p>{HERO.lede}</p>
          <dl className="doc__facts">
            {HERO.facts.map(f => (
              <div key={f.k}><dt>{f.k}</dt><dd>{f.v}</dd></div>
            ))}
          </dl>
        </section>

        <section className="doc__grid">
          <div>
            <h2 className="doc__h">01 · The problem</h2>
            <p className="doc__p"><strong>{PROBLEM.titleA} {PROBLEM.titleB}</strong> {PROBLEM.lede}</p>
            <h2 className="doc__h">02 · The process</h2>
            <ol className="doc__list">
              {ENGINE.stages.map((s, i) => (
                <li key={s.key}><span>{String(i + 1).padStart(2, '0')}</span><div><b>{s.name}.</b> {s.title}</div></li>
              ))}
            </ol>
          </div>
          <div>
            <h2 className="doc__h">03 · Risk architecture</h2>
            <ol className="doc__list">
              {RISK.layers.map(l => (
                <li key={l.k}><span>{l.k}</span><div><b>{l.name}.</b> {l.title}.</div></li>
              ))}
            </ol>
            <h2 className="doc__h">04 · Engagement</h2>
            <ol className="doc__list">
              {PROCESS.steps.map(s => (
                <li key={s.k}><span>{s.k}</span><div><b>{s.title}.</b> {s.body}</div></li>
              ))}
            </ol>
          </div>
        </section>

        <section className="doc__platforms">
          <h2 className="doc__h">Compatibility</h2>
          <p className="doc__p">
            {PLATFORMS.groups.map(g => `${g.label}: ${g.items.map(i => i.name).join(', ')}`).join('.  ')}.
          </p>
        </section>

        <footer className="doc__foot">
          <div className="doc__cta">
            <p><b>Request a private walkthrough</b></p>
            <p>quantarasystems.io/consultation</p>
          </div>
          <p className="doc__legal">
            Trading futures involves substantial risk of loss and is not suitable for every investor. Past performance is
            not indicative of future results. Quantara Systems does not guarantee profits or freedom from loss. This
            document is for information only and is not investment advice or an offer to buy or sell any financial
            instrument. {PLATFORMS.note} {COMPANY.line}
          </p>
        </footer>
      </article>
    </div>
  );
}
