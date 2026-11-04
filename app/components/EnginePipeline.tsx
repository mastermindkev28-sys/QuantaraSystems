'use client';

import { useEffect, useRef, useState } from 'react';
import { ENGINE } from '../content';
import StageViz from './StageViz';

const DWELL_S = 7;
// Illustrative price level used by the stage demonstrations (matches the other demos).
const ILLUSTRATIVE_BASE = 4018.4;

export default function EnginePipeline() {
  const stages = ENGINE.stages;
  const [active, setActive] = useState(0);
  const [hover, setHover] = useState(false);
  const [inView, setInView] = useState(false);
  const [reduced, setReduced] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // On narrow screens the stage list scrolls sideways: keep the active stage visible
  // without moving the page itself.
  useEffect(() => {
    const box = list.current;
    const btn = box?.children[active] as HTMLElement | undefined;
    if (!box || !btn || box.scrollWidth <= box.clientWidth) return;
    box.scrollTo({ left: btn.offsetLeft - 16, behavior: 'smooth' });
  }, [active]);

  const s = stages[active];
  const paused = hover || !inView || reduced;

  return (
    <div
      ref={root}
      className={`pipeline${paused ? ' is-paused' : ''}`}
      style={{ ['--dwell' as string]: `${DWELL_S}s` }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="panel stages" ref={list} role="tablist" aria-label="Engine stages">
        {stages.map((st, i) => (
          <button
            key={st.key}
            role="tab"
            aria-selected={i === active}
            aria-controls="engine-detail"
            className={`stage${i === active ? ' is-active' : ''}`}
            onClick={() => setActive(i)}
          >
            <span className="stage__n mono">{String(i + 1).padStart(2, '0')}</span>
            <span>
              <span className="stage__t">{st.name}</span>
              <span className="stage__s">{st.sub}</span>
            </span>
            <span className="stage__bar">
              {i === active && (
                <i
                  key={`${active}`}
                  onAnimationEnd={() => {
                    if (!reduced) setActive(a => (a + 1) % stages.length);
                  }}
                />
              )}
            </span>
          </button>
        ))}
      </div>

      <div className="panel detail" id="engine-detail" role="tabpanel">
        <div className="detail__head mono">
          <span>Stage {String(active + 1).padStart(2, '0')} / {String(stages.length).padStart(2, '0')}<span className="hide-sm"> · {s.sub}</span></span>
          <span className="console__status">Illustrative</span>
        </div>
        <ol className="rail" aria-label="Position in the lifecycle">
          {stages.map((st, i) => (
            <li key={st.key} className={i < active ? 'is-done' : i === active ? 'is-active' : ''}>
              <button onClick={() => setActive(i)} aria-label={`Stage ${i + 1}: ${st.name}`}>
                <span className="rail__dot" />
                <span className="rail__label mono">{st.name}</span>
              </button>
            </li>
          ))}
        </ol>
        <div className="detail__body fade-swap" key={s.key}>
          <div>
            <span className="eyebrow">{s.name}</span>
            <h3 className="detail__title">{s.title}</h3>
            <p className="body">{s.body}</p>
            <ul className="detail__points">
              {s.points.map(p => <li key={p}>{p}</li>)}
            </ul>
          </div>
          <div className="detail__viz">
            <StageViz stage={s.key} base={ILLUSTRATIVE_BASE} />
          </div>
        </div>
        <div className="detail__foot">
          {s.tags.map(t => <span key={t} className="chip">{t}</span>)}
        </div>
      </div>
    </div>
  );
}
