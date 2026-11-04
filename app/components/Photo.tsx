import fs from 'node:fs';
import path from 'node:path';
import QMark from './QMark';

// A brand-toned photograph. If the file isn't in public/ yet, a quiet navy panel
// with the Q mark stands in, so layouts never break while photography is pending.
export default function Photo({
  src,
  alt,
  ratio = '21 / 9',
  caption,
  priority,
  className = '',
}: {
  src: string;
  alt: string;
  ratio?: string;
  caption?: string;
  priority?: boolean;
  className?: string;
}) {
  const exists = fs.existsSync(path.join(process.cwd(), 'public', src));
  return (
    <figure className={`photo ${className}`}>
      <div className="photo__frame" style={{ aspectRatio: ratio }}>
        {exists ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={alt} loading={priority ? 'eager' : 'lazy'} decoding="async" />
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
