import { COMPARE } from '../content';

export default function CompareTable() {
  return (
    <div className="compare reveal" role="table" aria-label="Discretionary and systematic execution compared">
      <div className="compare__row compare__row--head" role="row">
        <div className="compare__cell" role="columnheader" />
        <div className="compare__cell compare__cell--you" role="columnheader">{COMPARE.you}</div>
        <div className="compare__cell compare__cell--qs" role="columnheader">{COMPARE.qs}</div>
      </div>
      {COMPARE.rows.map(r => (
        <div key={r.k} className="compare__row" role="row">
          <div className="compare__cell compare__cell--k" role="rowheader">{r.k}</div>
          <div className="compare__cell compare__cell--you" role="cell"><span>{COMPARE.you}</span>{r.you}</div>
          <div className="compare__cell compare__cell--qs" role="cell"><span>{COMPARE.qs}</span>{r.qs}</div>
        </div>
      ))}
    </div>
  );
}
