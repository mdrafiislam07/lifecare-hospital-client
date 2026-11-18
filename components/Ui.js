import { cld } from '@/lib/img';
import '@/styles/cms.css';   // .page-banner / .sr-only style ekhane thake (sob page e lagbe)

export function Alert({ type = 'error', children }) {
  if (!children) return null;
  return <div className={`alert alert-${type}`} role={type === 'error' ? 'alert' : 'status'}>{children}</div>;
}
export function Field({ label, children, hint }) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
      {hint && <small>{hint}</small>}
    </label>
  );
}

// banner dile (admin > Settings > Page banners) full-width banner chobi dekhabe, na dile ager blue header
export function PageHero({ title, text, banner }) {
  if (banner) {
    return (
      <section className="page-banner" aria-label={title}>
        <h1 className="sr-only">{title}</h1>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={cld(banner, 'w_1920,c_limit,q_auto,f_auto')} alt={title} fetchPriority="high" />
      </section>
    );
  }
  return (
    <section className="page-hero">
      <div className="container">
        <h1>{title}</h1>
        {text && <p>{text}</p>}
      </div>
    </section>
  );
}