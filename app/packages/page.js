import Link from 'next/link';
import { serverGet } from '@/lib/api';
import { getSettings } from '@/lib/content';
import { FALLBACK_PACKAGES } from '@/lib/data';
import { PageHero } from '@/components/Ui';
import Icon from '@/components/Icons';

export const metadata = { title: 'Checkup Packages' };
export const revalidate = 60;

export default async function Page() {
  const [{ items }, site] = await Promise.all([serverGet('/packages', { items: FALLBACK_PACKAGES }), getSettings()]);
  return (
    <>
      <PageHero title="Checkup Packages" text="Health check-up package based on your age and needs." banner={site.banners?.packages?.url} />
      <section className="container section">
        {items.length === 0 ? (
          <p className="muted center">Checkup package shiggroi add kora hobe. Bistarito jante call korun.</p>
        ) : (
          <div className="pkg-grid">
            {items.map((p) => (
              <article className="card pkg" key={p._id}>
                <h3>{p.name}</h3>
                <p className="price">৳{Number(p.price).toLocaleString('en-US')}</p>
                {p.description && <p className="muted">{p.description}</p>}
                <ul className="checks">{p.tests?.map((t) => <li key={t}><Icon name="check" size={16} />{t}</li>)}</ul>
                <Link href="/contact" className="btn btn-primary btn-block">Book this package</Link>
              </article>
            ))}
          </div>
        )}
        <p className="muted center">Values may vary. Please contact us for the most up-to-date information.</p>
      </section>
    </>
  );
}