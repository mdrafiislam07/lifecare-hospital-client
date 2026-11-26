'use client';
import { useEffect, useRef, useState, useCallback } from 'react';

// Full-width hero banner slider. slides = [{ url, alt }]
// Auto change (default 5s), dots, arrows, hover/touch pause, swipe, tab hidden hole pause.
export default function HeroSlider({ slides = [], interval = 5000 }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchX = useRef(null);
  const n = slides.length;

  const go = useCallback((d) => setI((v) => (v + d + n) % n), [n]);

  useEffect(() => {
    if (n < 2 || paused) return;
    const t = setInterval(() => {
      if (!document.hidden) setI((v) => (v + 1) % n);
    }, interval);
    return () => clearInterval(t);
  }, [n, paused, interval]);

  if (!n) return null;

  const onTouchStart = (e) => { touchX.current = e.touches[0].clientX; setPaused(true); };
  const onTouchEnd = (e) => {
    if (touchX.current != null) {
      const dx = e.changedTouches[0].clientX - touchX.current;
      if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
    }
    touchX.current = null;
    setPaused(false);
  };

  return (
    <section
      className="hs"
      aria-roledescription="carousel"
      aria-label="Hospital banners"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="hs-track">
        {slides.map((s, k) => (
          <div key={k} className={`hs-slide${k === i ? ' on' : ''}`} aria-hidden={k !== i} style={{ '--bg': `url("${s.url}")` }}>
            <span className="hs-bg" aria-hidden="true" />
            <img src={s.url} alt={s.alt || `Banner ${k + 1}`} loading={k === 0 ? 'eager' : 'lazy'} draggable="false" />
          </div>
        ))}
      </div>
      {n > 1 && (
        <>
          <button type="button" className="hs-arrow prev" onClick={() => go(-1)} aria-label="Previous banner">‹</button>
          <button type="button" className="hs-arrow next" onClick={() => go(1)} aria-label="Next banner">›</button>
          <div className="hs-dots">
            {slides.map((_, k) => (
              <button key={k} type="button" className={k === i ? 'on' : ''} onClick={() => setI(k)} aria-label={`Banner ${k + 1}`} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}