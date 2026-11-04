import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { OVERVIEW_PDF } from '../../content';
import BookButton from '../../components/BookButton';
import { Arrow } from '../../components/Icons';
import { ARTICLES, formatDate, getArticle } from '../articles';

export const dynamicParams = false;

export function generateStaticParams() {
  return ARTICLES.map(a => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const a = getArticle((await params).slug);
  return a ? { title: a.title, description: a.summary, openGraph: { title: a.title, description: a.summary, type: 'article' } } : {};
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const a = getArticle((await params).slug);
  if (!a) notFound();
  const others = ARTICLES.filter(o => o.slug !== a.slug);
  return (
    <>
      <article>
        <header className="page-hero on-dark">
          <div className="wrap page-hero__inner article__hero">
            <Link href="/insights" className="eyebrow hero-in">Insights · {a.topic}</Link>
            <h1 className="display page-hero__title article__title hero-in" style={{ animationDelay: '0.08s' }}>{a.title}</h1>
            <p className="muted hero-in" style={{ animationDelay: '0.16s' }}>
              Quantara Systems Research · {formatDate(a.date)} · {a.readMinutes} min read
            </p>
          </div>
        </header>
        <div className="section">
          <div className="wrap article">
            <p className="article__lede">{a.summary}</p>
            {a.sections.map((s, i) => (
              <section key={i}>
                {s.heading && <h2 className="h3 article__h">{s.heading}</h2>}
                {s.paragraphs.map((p, j) => <p key={j} className="article__p">{p}</p>)}
              </section>
            ))}
            <aside className="article__aside">
              <p>
                This note is for general information and education. It is not investment advice and does not describe
                the results of any account.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 20 }}>
                <BookButton>Request a consultation</BookButton>
                <a href={OVERVIEW_PDF} download className="btn btn--ghost">Download the QS1 overview<Arrow /></a>
              </div>
            </aside>
          </div>
        </div>
      </article>
      <section className="section section--stone">
        <div className="wrap">
          <p className="eyebrow" style={{ marginBottom: 24 }}>Further reading</p>
          <div className="cards cards--2">
            {others.map(o => (
              <Link key={o.slug} href={`/insights/${o.slug}`} className="card">
                <span className="card__meta">{o.topic} · {formatDate(o.date)}</span>
                <h3 className="h3">{o.title}</h3>
                <p className="body">{o.summary}</p>
                <span className="text-link">Read · {o.readMinutes} min<Arrow /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
