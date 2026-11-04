import type { Metadata } from 'next';
import ConsultationForm from '../components/ConsultationForm';
import { Check } from '../components/Icons';

export const metadata: Metadata = {
  title: 'Request a consultation',
  description: 'Request a private, 45-minute consultation with Quantara Systems.',
};

const EXPECT = [
  'A private, 45-minute video call with a member of our team',
  'A walk-through of how QS1 executes and controls risk',
  'An honest discussion of whether QS1 suits your situation',
  'No obligation, and no pressure to proceed',
];

export default function ConsultationPage() {
  return (
    <section className="consult">
      <div className="wrap consult__layout">
        <div className="consult__intro">
          <span className="eyebrow hero-in">Consultation</span>
          <h1 className="h2 hero-in" style={{ animationDelay: '0.08s' }}>Request a private consultation.</h1>
          <p className="lede hero-in" style={{ animationDelay: '0.16s' }}>
            Tell us a little about yourself, then choose a time that suits you. We onboard a limited number of
            accounts each month, so every request is reviewed personally.
          </p>
          <div className="consult__expect hero-in" style={{ animationDelay: '0.24s' }}>
            <p className="eyebrow">What to expect</p>
            <ul className="criteria">
              {EXPECT.map(e => <li key={e}><Check size={18} />{e}</li>)}
            </ul>
          </div>
        </div>
        <div className="consult__panel hero-in" style={{ animationDelay: '0.2s' }}>
          <ConsultationForm />
        </div>
      </div>
    </section>
  );
}
