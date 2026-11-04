import { PageHero } from './Section';

// Shared layout for legal pages. The wording on these pages is a starting draft
// and must be reviewed by qualified counsel before the site is relied upon.
export default function LegalPage({
  title,
  updated,
  intro,
  sections,
}: {
  title: string;
  updated: string;
  intro: string;
  sections: { h: string; p: string[] }[];
}) {
  return (
    <>
      <PageHero eyebrow="Legal" title={title} lede={intro} />
      <section className="section">
        <div className="wrap article">
          <p className="muted" style={{ fontSize: 14, marginBottom: 40 }}>Last updated {updated}</p>
          {sections.map(s => (
            <section key={s.h}>
              <h2 className="h3 article__h">{s.h}</h2>
              {s.p.map((p, i) => <p key={i} className="article__p">{p}</p>)}
            </section>
          ))}
        </div>
      </section>
    </>
  );
}
