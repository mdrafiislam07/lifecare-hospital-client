'use client';
import { Children, useRef } from 'react';
import Icon from './Icons';

/**
 * Carousel
 * - marquee (default true): auto-runs RIGHT -> LEFT, pauses on hover.
 * - marquee={false}: old behaviour (swipe + prev/next buttons).
 * - speed: seconds per card (default 9). Smaller = faster.
 */
export default function Carousel({ children, label, marquee = true, speed = 9 }) {
  const ref = useRef(null);
  const items = Children.toArray(children);

  if (marquee && items.length > 0) {
    const duration = Math.max(30, items.length * speed);
    return (
      <div className="carousel is-marquee" role="region" aria-label={label}>
        <div className="car-track marquee" style={{ '--mq': `${duration}s` }}>
          {items}
          {/* duplicate set for a seamless loop (hidden from screen readers) */}
          <div style={{ display: 'contents' }} aria-hidden="true">{items}</div>
        </div>
      </div>
    );
  }

  const go = (dir) => {
    const el = ref.current; if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: 'smooth' });
  };
  return (
    <div className="carousel" role="region" aria-label={label}>
      <button className="car-btn prev" onClick={() => go(-1)} aria-label="Previous"><Icon name="left" size={26} /></button>
      <div className="car-track" ref={ref}>{children}</div>
      <button className="car-btn next" onClick={() => go(1)} aria-label="Next"><Icon name="right" size={26} /></button>
    </div>
  );
}