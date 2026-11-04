import { ACCESS } from '../content';
import BookButton from './BookButton';
import { Check } from './Icons';

// What a prospective client gets from the walkthrough, and who QS1 suits.
export default function CapacityPanel() {
  return (
    <div className="access on-dark reveal">
      <div style={{ display: 'grid', gap: 24, justifyItems: 'start', alignContent: 'start' }}>
        <span className="eyebrow">{ACCESS.eyebrow}</span>
        <h2 className="h2">{ACCESS.title}</h2>
        <p className="lede">{ACCESS.body}</p>
        <ul className="criteria" style={{ width: '100%' }}>
          {ACCESS.covers.map(c => (
            <li key={c}><Check size={18} />{c}</li>
          ))}
        </ul>
        <BookButton>{ACCESS.cta}</BookButton>
      </div>
      <div style={{ display: 'grid', gap: 24, alignContent: 'start' }}>
        <div>
          <p className="eyebrow" style={{ marginBottom: 16 }}>{ACCESS.criteriaTitle}</p>
          <ul className="criteria">
            {ACCESS.criteria.map(c => (
              <li key={c}><Check size={18} />{c}</li>
            ))}
          </ul>
        </div>
        <div className="guarantee">
          <Check size={18} />
          <span><strong>{ACCESS.guaranteeStrong}</strong> {ACCESS.guarantee}</span>
        </div>
      </div>
    </div>
  );
}
