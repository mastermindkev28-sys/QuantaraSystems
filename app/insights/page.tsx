import type { Metadata } from 'next';
import Link from 'next/link';
import FinalCta from '../components/FinalCta';
import { Arrow } from '../components/Icons';
import { PageHero } from '../components/Section';
import { ARTICLES, formatDate } from './articles';

export const metadata: Metadata = {
  title: 'Insights',
  description: 'Research notes from Quantara Systems on systematic execution, market regimes and risk management.',
};

export default function InsightsPage() {
  return (
    <>
      <PageHero
        eyebrow="Insights"
        title="Notes on execution and risk."
        lede="Short research notes on the ideas behind QS1. Written for readers who want to understand how systematic execution works, not to be sold on it."
      />
      <section className="section">
        <div className="wrap">
          <ol className="article-list">
            {ARTICLES.map(a => (
              <li key={a.slug} className="draw-in reveal">
                <Link href={`/insights/${a.slug}`} className="article-row">
                  <span className="article-row__meta">
                    <span>{a.topic}</span>
                    <span>{formatDate(a.date)} · {a.readMinutes} min read</span>
                  </span>
                  <span className="article-row__main">
                    <span className="h2 article-row__title">{a.title}</span>
                    <span className="body">{a.summary}</span>
                  </span>
                  <span className="article-row__go" aria-hidden="true"><Arrow size={20} /></span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <FinalCta />
    </>
  );
}
