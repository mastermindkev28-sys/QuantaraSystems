import type { ReactNode } from 'react';

// Section header: index and label on the left, a two-tone statement on the right.
export function Head({ idx, eyebrow, a, b, lede }: { idx?: string; eyebrow: string; a: string; b?: string; lede?: string }) {
  return (
    <header className="section-head draw-in">
      <span className="eyebrow reveal">
        {idx && <span className="idx">{idx}</span>}
        {eyebrow}
      </span>
      <div className="section-head__main">
        <h2 className="h2 reveal" data-delay="1">
          {a}{b && <> <span className="soft">{b}</span></>}
        </h2>
        {lede && <p className="lede reveal" data-delay="2">{lede}</p>}
      </div>
    </header>
  );
}

export function Exhibit({ title, note }: { title: string; note: string }) {
  return (
    <div className="exhibit draw-in">
      <span>{title}</span>
      <span>{note}</span>
    </div>
  );
}

// Navy title band at the top of every inner page.
export function PageHero({ eyebrow, title, lede, children }: { eyebrow: string; title: string; lede?: string; children?: ReactNode }) {
  return (
    <section className="page-hero on-dark">
      <div className="wrap page-hero__inner">
        <span className="eyebrow hero-in">{eyebrow}</span>
        <h1 className="display page-hero__title hero-in" style={{ animationDelay: '0.08s' }}>{title}</h1>
        {lede && <p className="lede hero-in" style={{ animationDelay: '0.16s' }}>{lede}</p>}
        {children}
      </div>
    </section>
  );
}
