type P = { size?: number };

const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
});

export const Arrow = ({ size = 16 }: P) => (
  <svg {...base(size)} className="arrow"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);
export const Check = ({ size = 16 }: P) => (
  <svg {...base(size)}><path d="M5 12.5l4.2 4.2L19 7" /></svg>
);
export const Plus = ({ size = 14 }: P) => (
  <svg {...base(size)}><path d="M12 5v14M5 12h14" /></svg>
);
export const Cloud = ({ size = 20 }: P) => (
  <svg {...base(size)}><path d="M7 18h10a4 4 0 0 0 .6-7.95A6 6 0 0 0 6.1 9.2 4.5 4.5 0 0 0 7 18z" /></svg>
);
export const Pulse = ({ size = 20 }: P) => (
  <svg {...base(size)}><path d="M3 12h4l2.5-6 4 12 2.5-6H21" /></svg>
);
export const Lock = ({ size = 20 }: P) => (
  <svg {...base(size)}><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>
);
export const Eye = ({ size = 20 }: P) => (
  <svg {...base(size)}><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></svg>
);
export const Replay = ({ size = 14 }: P) => (
  <svg {...base(size)}><path d="M4 5v5h5" /><path d="M5.1 15a8 8 0 1 0 .9-8.3L4 10" /></svg>
);

export const INFRA_ICONS = { cloud: Cloud, pulse: Pulse, lock: Lock, eye: Eye } as const;
