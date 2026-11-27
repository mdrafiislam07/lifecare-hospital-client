import { cld } from '@/lib/img';

const initials = (n = '') => n.replace(/^(Prof\.|Dr\.|Dr|Md\.|Mr\.|Mrs\.|Most\.|Adv\.)\s*/i, '').split(' ').slice(0, 2).map((w) => w[0]).join('');
const Mail = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>;
const Phone = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" /></svg>;

export default function TeamGrid({ items }) {
  if (!items.length) return <p className="ab-empty">Management team-er tothyo shiggroi add kora hobe.</p>;
  return (
    <div className="ab-team">
      {items.map((m) => (
        <article className="ab-tcard" key={m._id}>
          <div className="ab-tmedia">
            {m.photo
              // eslint-disable-next-line @next/next/no-img-element
              ? <img src={cld(m.photo, 'w_640,h_704,c_fill,g_face,q_auto,f_auto')} alt={m.name} loading="lazy" />
              : <span className="ab-ini" aria-hidden="true">{initials(m.name)}</span>}
            <span className="ab-chip">Leadership</span>
          </div>
          <div className="ab-tbody">
            <h3>{m.name}</h3>
            {m.designation && <p className="ab-role">{m.designation}</p>}
            {m.bio && <p className="ab-bio">{m.bio}</p>}
            {(m.email || m.phone) && (
              <div className="ab-links">
                {m.email && <a className="ab-ic" href={`mailto:${m.email}`} aria-label={`Email ${m.name}`}><Mail /></a>}
                {m.phone && <a className="ab-ic" href={`tel:${m.phone}`} aria-label={`Call ${m.name}`}><Phone /></a>}
              </div>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}