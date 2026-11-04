'use client';

import Script from 'next/script';
import { useEffect, useRef, useState } from 'react';
import { CALENDLY_URL } from '../content';
import { Arrow, Check } from './Icons';

declare global {
  interface Window {
    Calendly?: {
      initInlineWidget: (o: {
        url: string;
        parentElement: HTMLElement;
        prefill?: { name?: string; email?: string; customAnswers?: Record<string, string> };
      }) => void;
    };
  }
}

const EXPERIENCE = ['No futures experience', 'Some experience', 'Experienced futures trader'];

interface Intake {
  name: string;
  email: string;
  phone: string;
  country: string;
  experience: string;
  source: string;
  notes: string;
}

// Two steps: a short intake, then Calendly with the visitor's details filled in.
// The intake answers travel to Calendly as the first custom question (a1), so add
// a question such as "Anything we should know?" to the Calendly event to keep them.
export default function ConsultationForm() {
  const [step, setStep] = useState<1 | 2>(1);
  const [data, setData] = useState<Intake>({ name: '', email: '', phone: '', country: '', experience: '', source: '', notes: '' });
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof Intake | 'agree', string>>>({});
  const [ready, setReady] = useState(false);
  const embed = useRef<HTMLDivElement>(null);

  const set = (k: keyof Intake) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setData(d => ({ ...d, [k]: e.target.value }));

  const summary = [
    data.phone && `Phone: ${data.phone}`,
    data.country && `Country: ${data.country}`,
    data.experience && `Experience: ${data.experience}`,
    data.source && `Heard about us: ${data.source}`,
    data.notes && `Notes: ${data.notes}`,
  ].filter(Boolean).join(' | ');

  const fallbackUrl = `${CALENDLY_URL}?${new URLSearchParams({ name: data.name, email: data.email, a1: summary })}`;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const err: typeof errors = {};
    if (!data.name.trim()) err.name = 'Please enter your name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) err.email = 'Please enter a valid email address.';
    if (!data.experience) err.experience = 'Please choose one.';
    if (!agree) err.agree = 'Please confirm before continuing.';
    setErrors(err);
    if (Object.keys(err).length) return;
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    if (step !== 2 || !ready || !embed.current || !window.Calendly) return;
    embed.current.innerHTML = '';
    window.Calendly.initInlineWidget({
      url: `${CALENDLY_URL}?hide_gdpr_banner=1`,
      parentElement: embed.current,
      prefill: { name: data.name, email: data.email, customAnswers: { a1: summary } },
    });
  }, [step, ready, data.name, data.email, summary]);

  return (
    <>
      <Script src="https://assets.calendly.com/assets/external/widget.js" strategy="afterInteractive" onReady={() => setReady(true)} />
      <ol className="form-steps" aria-label="Progress">
        <li className={step === 1 ? 'is-current' : 'is-done'}>{step === 2 ? <Check size={14} /> : '1'} Your details</li>
        <li className={step === 2 ? 'is-current' : ''}>2 Choose a time</li>
      </ol>

      {step === 1 ? (
        <form className="form" onSubmit={submit} noValidate>
          <div className="form__row">
            <Field label="Full name" error={errors.name} required>
              <input name="name" autoComplete="name" value={data.name} onChange={set('name')} aria-invalid={!!errors.name} />
            </Field>
            <Field label="Email" error={errors.email} required>
              <input name="email" type="email" autoComplete="email" value={data.email} onChange={set('email')} aria-invalid={!!errors.email} />
            </Field>
          </div>
          <div className="form__row">
            <Field label="Phone" hint="Optional">
              <input name="phone" type="tel" autoComplete="tel" value={data.phone} onChange={set('phone')} />
            </Field>
            <Field label="Country of residence" hint="Optional">
              <input name="country" autoComplete="country-name" value={data.country} onChange={set('country')} />
            </Field>
          </div>
          <Field label="Futures trading experience" error={errors.experience} required>
            <select name="experience" value={data.experience} onChange={set('experience')} aria-invalid={!!errors.experience}>
              <option value="" disabled>Select one</option>
              {EXPERIENCE.map(o => <option key={o}>{o}</option>)}
            </select>
          </Field>
          <Field label="How did you hear about Quantara?" hint="Optional">
            <input name="source" value={data.source} onChange={set('source')} />
          </Field>
          <Field label="Anything you'd like us to know before the call?" hint="Optional">
            <textarea name="notes" rows={4} value={data.notes} onChange={set('notes')} />
          </Field>
          <label className={`consent${errors.agree ? ' is-error' : ''}`}>
            <input type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)} />
            <span>
              I understand that trading futures involves substantial risk of loss, and that Quantara Systems does not
              guarantee results. I have read the <a href="/legal/risk-disclosure" target="_blank" className="inline-link">risk disclosure</a>.
            </span>
          </label>
          {errors.agree && <p className="field__error" role="alert">{errors.agree}</p>}
          <div className="form__foot">
            <button type="submit" className="btn btn--primary">Continue to scheduling<Arrow /></button>
            <p className="muted" style={{ fontSize: 13 }}>
              Your details are used only to arrange and prepare for your consultation. See our <a href="/legal/privacy" className="inline-link">privacy policy</a>.
            </p>
          </div>
        </form>
      ) : (
        <div className="schedule">
          <div className="schedule__head">
            <p className="body">
              Thank you, {data.name.split(' ')[0]}. Choose a time below for your 45-minute consultation.
            </p>
            <button className="text-link" onClick={() => setStep(1)}>Edit details</button>
          </div>
          <div ref={embed} className="schedule__embed">
            <p className="muted" style={{ padding: 24 }}>
              Loading the scheduler… If it doesn’t appear, <a href={fallbackUrl} target="_blank" rel="noopener noreferrer" className="inline-link">open it in a new tab</a>.
            </p>
          </div>
        </div>
      )}
    </>
  );
}

function Field({ label, hint, error, required, children }: { label: string; hint?: string; error?: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className={`field${error ? ' is-error' : ''}`}>
      <span className="field__label">
        {label}{required && <span aria-hidden="true"> *</span>}
        {hint && <span className="field__hint">{hint}</span>}
      </span>
      {children}
      {error && <span className="field__error" role="alert">{error}</span>}
    </label>
  );
}
