'use client';
import { useEffect, useRef, useState, useCallback } from 'react';

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '';
let scriptPromise;
function loadTurnstile() {
  if (typeof window === 'undefined') return Promise.reject();
  if (window.turnstile) return Promise.resolve();
  if (!scriptPromise) {
    scriptPromise = new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      s.async = true; s.onload = resolve; s.onerror = reject;
      document.head.appendChild(s);
    });
  }
  return scriptPromise;
}

function Widget({ onToken }) {
  const ref = useRef(null);
  useEffect(() => {
    let id;
    loadTurnstile().then(() => {
      if (!ref.current || !window.turnstile) return;
      id = window.turnstile.render(ref.current, { sitekey: SITE_KEY, callback: onToken, 'expired-callback': () => onToken(''), 'error-callback': () => onToken('') });
    }).catch(() => {});
    return () => { try { if (id !== undefined) window.turnstile.remove(id); } catch { /* ignore */ } };
  }, [onToken]);
  return <div ref={ref} className="turnstile" />;
}

/**
 * Bot protection hook.
 *  - field   : <hidden honeypot> + (optional) Cloudflare Turnstile widget  -> form e boshan
 *  - payload : request body te merge korun ({...data, ...bot.payload()})
 *  - ready() : CAPTCHA lagle token ache kina
 *  - reset() : submit er por
 */
export function useBotGuard({ captcha = true } = {}) {
  const t0 = useRef(Date.now());
  const [hp, setHp] = useState('');
  const [token, setToken] = useState('');
  const useCaptcha = captcha && !!SITE_KEY;
  const onToken = useCallback((t) => setToken(t), []);

  const field = (
    <>
      {/* honeypot: manush dekhe na, bot puron kore */}
      <div className="hp" aria-hidden="true">
        <label>Website<input tabIndex={-1} autoComplete="off" value={hp} onChange={(e) => setHp(e.target.value)} name="website" /></label>
      </div>
      {useCaptcha && <div className="full"><Widget onToken={onToken} /></div>}
    </>
  );

  return {
    field,
    payload: () => ({ website: hp, _el: Date.now() - t0.current, ...(useCaptcha ? { cfToken: token } : {}) }),
    ready: () => !useCaptcha || !!token,
    reset: () => { t0.current = Date.now(); setToken(''); try { window.turnstile?.reset(); } catch { /* ignore */ } }
  };
}
