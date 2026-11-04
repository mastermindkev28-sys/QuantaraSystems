import { ImageResponse } from 'next/og';

// Branded preview image for links shared on LinkedIn, iMessage, email and so on.
export const alt = 'Quantara Systems — Systematic execution for COMEX gold futures';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const MARK = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="280 280 465 465" fill="none"><g stroke="#ffffff" stroke-width="22" fill="none"><path d="M 311,480 A 202,202 0 1 1 641,663"/><path d="M 575,700 A 202,202 0 0 1 350,630"/></g><path fill="#ffffff" d="M 454.4,539.8 L 587.3,625.5 L 708.5,727.9 L 697.5,742.1 L 566.7,652.5 L 449.6,546.2 Z"/><path fill="#ffffff" d="M 564,458 L 577,457 L 592,600 L 579,602 Z"/></svg>`;
const src = `data:image/svg+xml;base64,${Buffer.from(MARK).toString('base64')}`;

export default function Image() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: '#0b1e3a', padding: '72px 80px', color: '#ffffff', fontFamily: 'sans-serif', position: 'relative' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} width={620} height={620} alt="" style={{ position: 'absolute', right: -120, bottom: -180, opacity: 0.08 }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} width={52} height={52} alt="" />
          <div style={{ display: 'flex', fontSize: 26, letterSpacing: 6, fontWeight: 600 }}>
            QUANTARA<span style={{ marginLeft: 12, opacity: 0.6, fontWeight: 400 }}>SYSTEMS</span>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ display: 'flex', fontSize: 22, letterSpacing: 3, opacity: 0.6 }}>QS1 · SYSTEMATIC EXECUTION</div>
          <div style={{ display: 'flex', fontSize: 104, letterSpacing: -4, lineHeight: 1, fontWeight: 300 }}>Discipline, engineered.</div>
          <div style={{ display: 'flex', fontSize: 28, opacity: 0.75 }}>Autonomous execution for COMEX gold futures.</div>
        </div>
        <div style={{ display: 'flex', height: 2, background: '#ffffff', opacity: 0.9, width: 160 }} />
      </div>
    ),
    size
  );
}
