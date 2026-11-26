import { useId } from 'react';

const P = {
  phone: <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" />,
  calendar: <><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M8 2v4M16 2v4M3 10h18" /></>,
  steth: <><path d="M6 3v6a4 4 0 0 0 8 0V3" /><path d="M10 13v2a5 5 0 0 0 10 0v-2" /><circle cx="20" cy="11" r="2" /></>,
  clipboard: <><rect x="5" y="4" width="14" height="18" rx="2" /><path d="M9 2h6v4H9zM9 14l2 2 4-4" /></>,
  ambulance: <><path d="M2 6h12v11H2zM14 10h4l4 4v3h-8" /><circle cx="7" cy="18" r="2" /><circle cx="18" cy="18" r="2" /><path d="M8 8.5v4M6 10.5h4" /></>,
  thumb: <path d="M7 10v12M15 5.9 14 10h5.8a2 2 0 0 1 1.9 2.5l-2.3 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.8a2 2 0 0 0 1.8-1.1L12 2a3.1 3.1 0 0 1 3 3.9z" />,
  check: <path d="M20 6 9 17l-5-5" />,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
  menu: <path d="M3 6h18M3 12h18M3 18h18" />,
  x: <path d="M18 6 6 18M6 6l12 12" />,
  down: <path d="m6 9 6 6 6-6" />,
  left: <path d="m15 18-6-6 6-6" />,
  right: <path d="m9 18 6-6-6-6" />,
  mail: <><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-10 6L2 7" /></>,
  pin: <><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0z" /><circle cx="12" cy="10" r="3" /></>,
  headset: <><path d="M3 14v-2a9 9 0 0 1 18 0v2" /><rect x="2" y="14" width="5" height="7" rx="2" /><rect x="17" y="14" width="5" height="7" rx="2" /></>,
  search: <><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></>,
  chat: <path d="M21 12a8 8 0 0 1-11.6 7.1L3 21l1.9-6.2A8 8 0 1 1 21 12z" />,
  clock: <><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></>,
  fb: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />,
  in: <><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" /><circle cx="4" cy="4" r="2" /></>,
  yt: <><rect x="2" y="5" width="20" height="14" rx="4" /><path d="m10 9 5 3-5 3z" /></>,
  ribbon: <><path d="M8 3a4 4 0 0 1 8 0c0 4-3 5-3 9l5 9M16 3c0 4-8 8-8 18" /><path d="M16 15v6M13 18h6" /></>,
  brain: <><path d="M9 4a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 2 5 3 3 0 0 0 6 1V4a3 3 0 0 0-3 0z" /><path d="M15 4a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1-2 5 3 3 0 0 1-6 1" /></>,
  lungs: <><path d="M12 3v9M9 12c-3 0-6 4-6 8 0 1 1 1.5 2 1 2-1 4-3 4-6zM15 12c3 0 6 4 6 8 0 1-1 1.5-2 1-2-1-4-3-4-6z" /></>,
  baby: <><circle cx="12" cy="7" r="4" /><path d="M5 21c0-4 3-7 7-7s7 3 7 7" /></>,
  bone: <path d="M7 8a3 3 0 1 1 2-2l8 8a3 3 0 1 1-2 2l-8-8a3 3 0 0 1 0 0z" />,
  plus: <path d="M12 5v14M5 12h14" />,
  star: <path d="m12 2 3 7 7 .6-5.3 4.7L18.2 22 12 18l-6.2 4 1.5-7.7L2 9.6 9 9z" />,
  quote: <path d="M7 7h4v5a4 4 0 0 1-4 4M15 7h4v5a4 4 0 0 1-4 4" />
};

export default function Icon({ name, size = 22, className = '', fill = false }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill={fill ? 'currentColor' : 'none'}
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {P[name] || P.plus}
    </svg>
  );
}

/* Animated Blood-Pressure-monitor logo */
export function Logo({ size = 1 }) {
  const gid = 'bpGrad' + useId().replace(/[^a-zA-Z0-9]/g, '');
  return (
    <span className="logo" style={{ '--s': size }}>
      <svg className="bp-logo" viewBox="0 0 64 48" width={64 * size} height={48 * size} aria-hidden="true">
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#5ec1ff" />
            <stop offset="0.55" stopColor="#2f7bff" />
            <stop offset="1" stopColor="#1740b8" />
          </linearGradient>
        </defs>

        <circle className="bp-ring" cx="26" cy="22" r="17" fill="none" stroke="#5ec1ff" strokeWidth="1.5" />

        <path className="bp-tube" d="M38 30c8 2 12 8 10 14" fill="none" stroke="#1740b8" strokeWidth="2.2" strokeLinecap="round" />
        <ellipse className="bp-bulb" cx="48" cy="42" rx="4.2" ry="5.2" fill={`url(#${gid})`} />

        <circle cx="26" cy="22" r="17" fill="#fff" stroke={`url(#${gid})`} strokeWidth="3.5" />
        <circle cx="26" cy="22" r="12.5" fill="#eff5ff" />

        <g stroke="#2f7bff" strokeWidth="1.6" strokeLinecap="round">
          <path d="M26 11.5v2.4" />
          <path d="M15.6 22h2.4" />
          <path d="M34 22h2.4" />
          <path d="M18.7 14.7l1.7 1.7" />
          <path d="M33.3 14.7l-1.7 1.7" />
        </g>

        <g className="bp-needle">
          <path d="M26 22 L26 12.5" stroke="#c0392b" strokeWidth="2.2" strokeLinecap="round" />
        </g>
        <circle cx="26" cy="22" r="2.4" fill="#071a3d" />

        <path className="bp-ecg" d="M10 38h10l3-6 4 11 3-8 2 3h10" fill="none" stroke="#2f7bff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="logo-text">Apollo Hospital <br />Jamalpur</span>
    </span>
  );
}