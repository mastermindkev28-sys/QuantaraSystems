import { RECORDS } from '../content';

// Illustrative execution record: shows the structure QS1 records for every trade.
const EVENTS = [
  ['09:41:06.219', 'CONDITIONS', 'Regime trending · volatility in range · event window clear'],
  ['09:41:06.221', 'CONFLUENCE', 'Long setup · all conditions aligned · qualified'],
  ['09:41:06.222', 'RISK', '5 / 5 pre-trade checks passed · size 5 MGC'],
  ['09:41:06.224', 'ORDERS', 'Buy 5 @ 4,018.4 · stop 4,012.4 · target 4,030.4'],
  ['09:41:06.301', 'FILL', '5 @ 4,018.4'],
  ['09:52:40.007', 'ADJUST', 'Stop 4,012.4 → 4,018.4 · rule: stop to entry'],
  ['10:04:13.552', 'EXIT', 'Target · 5 @ 4,030.4'],
];

export default function RecordSample() {
  return (
    <div className="records">
      <div className="panel record">
        <div className="detail__head mono">
          <span>Record · MGC · long 5</span>
          <span className="console__status">Illustrative</span>
        </div>
        <ol className="record__lines mono">
          {EVENTS.map(([t, k, v]) => (
            <li key={t + k}>
              <span className="logline__t">{t}</span>
              <span className="record__k">{k}</span>
              <span>{v}</span>
            </li>
          ))}
        </ol>
      </div>
      <dl className="record__fields">
        {RECORDS.fields.map(f => (
          <div key={f.k} className="reveal">
            <dt>{f.k}</dt>
            <dd>{f.v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
