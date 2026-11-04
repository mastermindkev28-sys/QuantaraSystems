import { FINAL, OVERVIEW_PDF } from '../content';
import BookButton from './BookButton';
import { Arrow } from './Icons';
import QMark from './QMark';

export default function FinalCta() {
  return (
    <section className="section final on-dark">
      <QMark id="final-mark" size="100%" className="final__mark" stroke={14} fan={false} />
      <div className="wrap final__inner">
        <span className="eyebrow reveal">Consultation</span>
        <h2 className="display reveal final__title">
          {FINAL.titleA} <span style={{ color: 'var(--text-3)' }}>{FINAL.titleB}</span>
        </h2>
        <p className="lede reveal">{FINAL.body}</p>
        <div className="reveal" style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          <BookButton>{FINAL.cta}</BookButton>
          <a href={OVERVIEW_PDF} download className="btn btn--ghost">Download the QS1 overview<Arrow /></a>
        </div>
        <p className="muted reveal" style={{ fontSize: 14 }}>{FINAL.fine.join('  ·  ')}</p>
      </div>
    </section>
  );
}
