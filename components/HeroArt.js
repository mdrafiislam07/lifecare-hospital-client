// Hospital building illustration (SVG). Asol photo dite: public/images/hero.webp rakhe CSS e .hero-art background use korun
export default function HeroArt() {
  const floors = Array.from({ length: 8 });
  return (
    <svg className="hero-svg" viewBox="0 0 520 440" role="img" aria-label="Apollo Hospital building">
      <defs>
        <pattern id="win" width="26" height="30" patternUnits="userSpaceOnUse">
          <rect x="4" y="5" width="18" height="20" rx="2" fill="#bfe9e3" stroke="#0f6f75" strokeWidth="1.2" />
          <path d="M13 5v20" stroke="#0f6f75" strokeWidth="1" />
        </pattern>
        <linearGradient id="wall" x1="0" x2="1"><stop offset="0" stopColor="#f3dcb0" /><stop offset="1" stopColor="#e6c58c" /></linearGradient>
      </defs>
      <rect x="150" y="70" width="300" height="350" fill="url(#wall)" />
      <rect x="150" y="70" width="300" height="350" fill="url(#win)" opacity=".95" />
      {floors.map((_, i) => <rect key={i} x="146" y={100 + i * 40} width="308" height="5" fill="#0f6f75" opacity=".35" />)}
      <rect x="120" y="40" width="360" height="34" fill="#0f9b8e" />
      <text x="300" y="64" textAnchor="middle" fontFamily="Barlow, sans-serif" fontWeight="700" fontSize="20" fill="#fff">Apollo Hospital</text>
      <rect x="40" y="250" width="110" height="170" fill="#cfe7e4" /><rect x="40" y="250" width="110" height="170" fill="url(#win)" opacity=".8" />
      <rect x="470" y="190" width="40" height="230" fill="#17b897" />
      <rect x="0" y="420" width="520" height="20" fill="#0f6f75" opacity=".25" />
    </svg>
  );
}
