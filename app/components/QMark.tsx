// The Quantara mark: a ring broken at two points, a tapered blade through it, an
// upright stem, and a fan of lines converging into the blade. Drawn in the artwork's
// own 1024-unit space and cropped by the viewBox.

const FAN = Array.from({ length: 13 }, (_, i) => {
  const sx = 297, sy = 490 + i * 11.4, ex = 477, ey = 556;
  const cx = sx + (ex - sx) * 0.62, cy = sy + (ey - sy) * 0.06;
  return `M ${sx},${sy.toFixed(1)} Q ${cx.toFixed(1)},${cy.toFixed(1)} ${ex},${ey}`;
});

export default function QMark({
  size = 32,
  id,
  fan,
  stroke = 26,
  className,
}: {
  size?: number | string;
  /** Unique per instance on the page: used for the gradient id. */
  id: string;
  fan?: boolean;
  stroke?: number;
  className?: string;
}) {
  const gid = `qm-${id}`;
  const showFan = fan ?? (typeof size === 'number' ? size >= 56 : true);
  return (
    <svg
      width={size}
      height={size}
      viewBox="280 280 465 465"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gid} x1="320" y1="300" x2="700" y2="745" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F5F8FC" />
          <stop offset="34%" stopColor="#B9C8DC" />
          <stop offset="68%" stopColor="#8398B4" />
          <stop offset="100%" stopColor="#61789A" />
        </linearGradient>
      </defs>
      <path d="M 311,480 A 202,202 0 1 1 641,663" stroke={`url(#${gid})`} strokeWidth={stroke} fill="none" />
      <path d="M 575,700 A 202,202 0 0 1 350,630" stroke={`url(#${gid})`} strokeWidth={stroke} fill="none" />
      {showFan && FAN.map((d, i) => <path key={i} d={d} stroke={`url(#${gid})`} strokeWidth="4.2" fill="none" opacity={0.95} />)}
      <path d="M 454.4,539.8 L 587.3,625.5 L 708.5,727.9 L 697.5,742.1 L 566.7,652.5 L 449.6,546.2 Z" fill={`url(#${gid})`} />
      <path d="M 564,458 L 577,457 L 592,600 L 579,602 Z" fill={`url(#${gid})`} />
    </svg>
  );
}
