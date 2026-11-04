import type { Point } from '../lib/useMarkets';

// Smooth area sparkline. With no data it draws a faint placeholder wave so the
// layout never jumps while the feed loads.
export default function Sparkline({
  points,
  id,
  positive = true,
  height = 64,
}: {
  points?: Point[];
  id: string;
  positive?: boolean;
  height?: number;
}) {
  const W = 480, H = height, pad = 4;
  const prices =
    points && points.length > 1
      ? points.map(p => p.p)
      : Array.from({ length: 48 }, (_, i) => Math.sin(i / 5) * 0.6 + Math.sin(i / 2.3) * 0.25 + i * 0.02);
  const live = !!points && points.length > 1;
  const min = Math.min(...prices), max = Math.max(...prices), range = max - min || 1;
  const x = (i: number) => (i / (prices.length - 1)) * W;
  const y = (p: number) => H - pad - ((p - min) / range) * (H - pad * 2);
  const line = prices.map((p, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(p).toFixed(1)}`).join(' ');
  const area = `${line} L${W},${H} L0,${H} Z`;
  const color = !live ? '#4a5870' : positive ? '#6fd6ad' : '#f08a94';
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" width="100%" height={H} aria-hidden="true" style={{ display: 'block' }}>
      <defs>
        <linearGradient id={`sp-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={live ? 0.22 : 0.08} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#sp-${id})`} />
      <path d={line} fill="none" stroke={color} strokeWidth="1.5" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
    </svg>
  );
}
