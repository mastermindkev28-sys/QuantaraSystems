import Link from 'next/link';
import { DISCLOSURE, FOOTER_NAV } from '../content';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer__top">
          <div style={{ display: 'grid', gap: 16, alignContent: 'start' }}>
            <Link href="/" className="brand">
              <Logo size={36} />
              <span className="brand__word">Quantara <span>Systems</span></span>
            </Link>
            <p className="body muted" style={{ maxWidth: 360, fontSize: 15 }}>
              Systematic execution for COMEX gold futures.
            </p>
          </div>
          <nav className="footer__cols" aria-label="Footer">
            {FOOTER_NAV.map(col => (
              <div key={col.title}>
                <p className="footer__title">{col.title}</p>
                <ul>
                  {col.links.map(l => (
                    <li key={l.href}>
                      {l.href.endsWith('.pdf') ? <a href={l.href} download>{l.label}</a> : <Link href={l.href}>{l.label}</Link>}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
        <p className="disclosure"><strong>Important information.</strong> {DISCLOSURE}</p>
        <div className="footer__base">
          <span>&copy; {new Date().getFullYear()} Quantara Systems. All rights reserved.</span>
          <span>quantarasystems.io</span>
        </div>
      </div>
    </footer>
  );
}
