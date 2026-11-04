import fs from 'node:fs';
import path from 'node:path';
import { PLATFORMS } from '../content';

// Compatible firms and platforms. Each shows its official logo once the file
// exists at public/logos/<slug>.svg, and a neutral text wordmark until then.
export default function Platforms() {
  return (
    <div className="platforms">
      <div className="platforms__head draw-in">
        <span className="eyebrow">{PLATFORMS.eyebrow}</span>
        <h2 className="h3">{PLATFORMS.title}</h2>
      </div>
      <div className="platforms__groups">
        {PLATFORMS.groups.map(g => (
          <div key={g.label} className="platforms__group reveal">
            <p className="platforms__label">{g.label}</p>
            <ul className="platforms__list">
              {g.items.map(i => {
                const file = `/logos/${i.slug}.svg`;
                const hasLogo = fs.existsSync(path.join(process.cwd(), 'public', file));
                return (
                  <li key={i.slug} className="platforms__item">
                    {hasLogo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={file} alt={i.name} />
                    ) : (
                      <span className="wordmark">{i.name}</span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
      <p className="platforms__note">{PLATFORMS.note}</p>
    </div>
  );
}
