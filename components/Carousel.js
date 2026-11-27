'use client';
import { Children, useEffect, useLayoutEffect, useRef, useState } from 'react';
import Icon from './Icons';

// User swipe/scroll korar por koto ms pore abar auto-run shuru hobe
const IDLE_MS = 2500;
// SSR e warning na dite
const useIso = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/**
 * Carousel
 * - marquee (default true): card gulo screen er cheye boro hole RIGHT -> LEFT auto-run kore (seamless loop).
 *   Card gulo screen e eki ghe fit hoye gele (jemon 1 ta doctor) kono duplicate hoy na, auto-run o hoy na,
 *   ar card gulo majhkhane thake.
 *   User touch/scroll korle auto-run thame jay, 2.5s por abar cholte thake. Mouse hover / keyboard focus e-o pause.
 * - marquee={false}: old behaviour (swipe + prev/next buttons).
 * - speed: seconds per card (default 9). Smaller = faster.
 */
export default function Carousel({ children, label, marquee = true, speed = 9 }) {
  const ref = useRef(null);    // prev/next mode er track
  const boxRef = useRef(null); // marquee mode er scrollable box
  const trackRef = useRef(null);
  const loopRef = useRef(false);
  const [loop, setLoop] = useState(false); // true hole-i shudhu duplicate set render hoy
  const items = Children.toArray(children);
  const isMarquee = marquee && items.length > 0;
  const duration = Math.max(30, items.length * speed); // ekta puro loop e koto second
  loopRef.current = loop;

  // Card gulo ki screen er cheye boro? Tahole-i loop (duplicate) dorkar
  useIso(() => {
    if (!isMarquee) return undefined;
    const box = boxRef.current;
    const track = trackRef.current;
    if (!box || !track) return undefined;
    const measure = () => {
      const one = loopRef.current ? track.scrollWidth / 2 : track.scrollWidth; // ek set er width
      setLoop(one > box.clientWidth + 1);
    };
    measure();
    let ro;
    if ('ResizeObserver' in window) { ro = new ResizeObserver(measure); ro.observe(box); }
    window.addEventListener('resize', measure);
    return () => { ro?.disconnect(); window.removeEventListener('resize', measure); };
  }, [isMarquee, items.length]);

  useEffect(() => {
    if (!isMarquee || !loop) return undefined;
    const box = boxRef.current;
    if (!box) return undefined;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches; // true hole auto-run nei, shudhu swipe
    const phone = window.matchMedia('(max-width: 680px)');

    let raf = 0;
    let last = 0;
    let pos = box.scrollLeft;
    let hover = false;
    let focus = false;
    let touching = false;
    let visible = true;
    let idleUntil = 0;

    const now = () => performance.now();
    const half = () => box.scrollWidth / 2; // list duibar render kora, tai adheker por abar shuru
    const userBusy = () => touching || now() < idleUntil;
    const paused = () => hover || focus || !visible || userBusy();

    // Forward e sesh e gele shuru te ferot (dekhte ekdom ek rokom, tai jump bujha jay na)
    const wrap = () => {
      const h = half();
      if (box.scrollLeft >= h) { box.scrollLeft -= h; pos = box.scrollLeft; }
    };
    // Shuru te thakle user ke pichone swipe korte deya: ek loop pichone niye jai
    const nudge = () => {
      const h = half();
      if (box.scrollLeft < 1 && h > box.clientWidth) { box.scrollLeft = h - 1; pos = box.scrollLeft; }
    };

    const tick = (t) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(t - (last || t), 64) / 1000;
      last = t;
      if (reduce || paused()) return;
      const h = half();
      if (h <= box.clientWidth) return; // content choto, loop korar moto na
      const v = h / (duration * (phone.matches ? 0.8 : 1)); // px/second (phone e ektu druto, ager moto)
      pos += v * dt;
      if (pos >= h) pos -= h;
      box.scrollLeft = pos;
    };

    const onScroll = () => {
      if (userBusy()) { pos = box.scrollLeft; idleUntil = now() + IDLE_MS; } // user er scroll / momentum
      wrap();
    };
    const onTouchStart = () => { touching = true; nudge(); };
    const onTouchEnd = () => { touching = false; idleUntil = now() + IDLE_MS; };
    const onWheel = (e) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) { nudge(); idleUntil = now() + IDLE_MS; } // shudhu horizontal scroll hole
    };
    const onEnter = (e) => { if (e.pointerType === 'mouse') hover = true; }; // touch e sticky hover hoy, tai shudhu mouse
    const onLeave = (e) => { if (e.pointerType === 'mouse') hover = false; };
    const onFocusIn = () => { focus = true; };
    const onFocusOut = () => { focus = false; };

    box.addEventListener('scroll', onScroll, { passive: true });
    box.addEventListener('touchstart', onTouchStart, { passive: true });
    box.addEventListener('touchend', onTouchEnd, { passive: true });
    box.addEventListener('touchcancel', onTouchEnd, { passive: true });
    box.addEventListener('wheel', onWheel, { passive: true });
    box.addEventListener('pointerenter', onEnter);
    box.addEventListener('pointerleave', onLeave);
    box.addEventListener('focusin', onFocusIn);
    box.addEventListener('focusout', onFocusOut);

    // Screen er baire thakle auto-run bondho (battery / performance)
    let io;
    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; }, { threshold: 0 });
      io.observe(box);
    }

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      io?.disconnect();
      box.removeEventListener('scroll', onScroll);
      box.removeEventListener('touchstart', onTouchStart);
      box.removeEventListener('touchend', onTouchEnd);
      box.removeEventListener('touchcancel', onTouchEnd);
      box.removeEventListener('wheel', onWheel);
      box.removeEventListener('pointerenter', onEnter);
      box.removeEventListener('pointerleave', onLeave);
      box.removeEventListener('focusin', onFocusIn);
      box.removeEventListener('focusout', onFocusOut);
    };
  }, [isMarquee, loop, duration]);

  if (isMarquee) {
    return (
      <div className="carousel is-marquee" role="region" aria-label={label} ref={boxRef}>
        <div
          className="car-track marquee"
          ref={trackRef}
          style={loop ? undefined : { marginLeft: 'auto', marginRight: 'auto' }} /* kom card hole majhkhane */
        >
          {items}
          {/* duplicate set shudhu tokhon-i, jokhon card gulo screen er cheye boro (seamless loop er jonno) */}
          {loop && <div style={{ display: 'contents' }} aria-hidden="true">{items}</div>}
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