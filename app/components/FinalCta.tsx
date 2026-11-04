import Link from 'next/link';
import { FINAL } from '../content';
import BookButton from './BookButton';
import { Arrow } from './Icons';

export default function FinalCta() {
  return (
    <section className="section final on-dark">
      <div className="wrap final__inner">
        <span className="eyebrow reveal">{FINAL.eyebrow}</span>
        <h2 className="display reveal final__title">{FINAL.title}</h2>
        <p className="lede reveal">{FINAL.body}</p>
        <div className="reveal" style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          <BookButton>{FINAL.cta}</BookButton>
          <Link href="/approach" className="btn btn--ghost">{FINAL.secondary}<Arrow /></Link>
        </div>
        <ul className="final__fine mono reveal">
          {FINAL.fine.map(f => <li key={f}>{f}</li>)}
        </ul>
      </div>
    </section>
  );
}
