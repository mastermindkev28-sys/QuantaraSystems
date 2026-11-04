import type { Metadata } from 'next';
import { ACCESS } from '../content';
import ConsultationForm from '../components/ConsultationForm';
import { Check } from '../components/Icons';

export const metadata: Metadata = {
  title: 'Request a Private Walkthrough',
  description: 'Request a private, 45-minute walkthrough of the QS1 framework with Quantara Systems.',
};

const EXPECT = ['A private, 45-minute video session with a member of our team', ...ACCESS.covers.slice(0, 4)];

export default function ConsultationPage() {
  return (
    <section className="consult">
      <div className="wrap consult__layout">
        <div className="consult__intro">
          <span className="eyebrow hero-in">Private walkthrough</span>
          <h1 className="h2 hero-in" style={{ animationDelay: '0.08s' }}>Understand the system behind every execution.</h1>
          <p className="lede hero-in" style={{ animationDelay: '0.16s' }}>
            Tell us a little about yourself, then choose a time. Your walkthrough is built around your questions,
            and every request is reviewed by our team before the call.
          </p>
          <div className="consult__expect hero-in" style={{ animationDelay: '0.24s' }}>
            <p className="eyebrow">What your walkthrough covers</p>
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
