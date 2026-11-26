import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPage, getMenu, getSettings } from '@/lib/content';
import { cld } from '@/lib/img';
import { PageHero } from '@/components/Ui';
import '@/styles/cms.css';

export const revalidate = 60;
export const dynamicParams = true;
export function generateStaticParams() { return []; }   // page gulo prothom visit e render hoy, tarpor ISR cache

export async function generateMetadata({ params }) {
  const { group, slug } = await params;            // Next 15+ e params Promise
  const r = await getPage(group, slug);
  return { title: r?.item?.title || 'Page' };
}

export default async function InfoPage({ params }) {
  const { group, slug } = await params;
  const [r, menu, site] = await Promise.all([getPage(group, slug), getMenu(), getSettings()]);
  if (!r?.item) notFound();
  const page = r.item;
  const siblings = Array.isArray(r.siblings) && r.siblings.length ? r.siblings : [page];   // backend siblings na pathale-o crash korbe na
  const label = (Array.isArray(menu) ? menu : []).find((m) => m.group === group)?.label || String(group).replace(/-/g, ' ').replace(/^\w/, (c) => c.toUpperCase());
  return (
    <>
      {page.banner ? (
        <section className="page-banner" aria-label={page.title}>
          <h1 className="sr-only">{page.title}</h1>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={cld(page.banner, 'w_1920,c_limit,q_auto,f_auto')} alt={page.title} fetchPriority="high" />
        </section>
      ) : (
        <PageHero title={page.title} text={page.desc} />
      )}
      <section className="container info-layout section">
        <aside className="info-side" aria-label={`${label} menu`}>
          <h3>{label}</h3>
          <ul>{siblings.map((p) => <li key={p.slug}><Link className={p.slug === page.slug ? 'on' : ''} href={`/${group}/${p.slug}`}>{p.title}</Link></li>)}</ul>
        </aside>
        <article className="info-body card">
          <h2>{page.title}</h2>
          {/* content server e sanitize kora (sanitize-html) */}
          <div className="rich" dangerouslySetInnerHTML={{ __html: page.content || '' }} />
          <div className="info-cta">
            <a className="btn btn-primary" href={`tel:${site.hotline}`}>Call {site.hotline}</a>
            <Link className="btn btn-outline" href="/appointment">Doctor Appointment</Link>
          </div>
        </article>
      </section>
    </>
  );
}