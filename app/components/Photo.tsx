import fs from 'node:fs';
import path from 'node:path';
import Image from 'next/image';
import QMark from './QMark';

// A brand-toned photograph. If the file isn't in public/ yet, a quiet navy panel
// with the Q mark stands in, so layouts never break while photography is pending.
export default function Photo({
  src,
  alt,
  ratio = '21 / 9',
  caption,
  priority,
  tone,
  className = '',
}: {
  src: string;
  alt: string;
  ratio?: string;
  caption?: string;
  priority?: boolean;
  tone?: 'mono';
  className?: string;
}) {
  const exists = fs.existsSync(path.join(process.cwd(), 'public', src));
  return (
    <figure className={`photo${tone ? ` photo--${tone}` : ''} ${className}`}>
      <div className="photo__frame" style={{ aspectRatio: ratio }}>
        {exists ? (
          <Image src={src} alt={alt} fill priority={priority} sizes="(min-width: 1280px) 1168px, 100vw" quality={78} />
        ) : (
          <div className="photo__fallback on-dark" role="img" aria-label={alt}>
            <QMark id={`ph-${src.replace(/\W/g, '')}`} size="100%" className="photo__mark" stroke={10} fan={false} />
          </div>
        )}
      </div>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}
