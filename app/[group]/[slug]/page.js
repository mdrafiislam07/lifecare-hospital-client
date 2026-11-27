import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPage, getSettings, getList, ABOUT_SOURCES } from '@/lib/content';
import { cld } from '@/lib/img';
import AboutSection from '@/components/about/AboutSection';
import '@/styles/cms.css';
import '@/styles/page.css';

export const revalidate = 60;
export const dynamicParams = true;
export function generateStaticParams() { return []; }   // page gulo prothom visit e render hoy, tarpor ISR cache

export async function generateMetadata({ params }) {
  const { group, slug } = await params;            // Next 15+ e params Promise
  const r = await getPage(group, slug);
  return { title: r?.item?.title || 'Page' };
}

const T = 'c_fill,g_auto,q_auto,f_auto';           // banner sob shomoy 1920x560 (ratio ek)

export default async function InfoPage({ params }) {
  const { group, slug } = await params;
  const [r, site] = await Promise.all([getPage(group, slug), getSettings()]);
  if (!r?.item) notFound();
  const page = r.item;

  // dynamic type (team / staff / faq / career / blogs) hole tar data ane
  const src = ABOUT_SOURCES[page.type];
  const dyn = Boolean(src);
  const items = dyn ? await getList(src) : [];
  const b = page.banner;

  return (
    <>
      {/* banner: admin upload korle tobei dekhabe, na korle kichui na */}
      {b && (
        <section className="pg-banner" aria-label={page.title}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={cld(b, `w_1920,h_560,${T}`)}
            srcSet={`${cld(b, `w_768,h_224,${T}`)} 768w, ${cld(b, `w_1280,h_373,${T}`)} 1280w, ${cld(b, `w_1920,h_560,${T}`)} 1920w`}
            sizes="100vw" width="1920" height="560" alt={page.title} fetchPriority="high"
          />
        </section>
      )}

      <section className={`pg ${dyn ? 'pg-wide' : 'pg-read'}`}>
        <h1 className="pg-title">{page.title}</h1>
        {page.desc && (dyn || !page.content) && <p className="pg-desc">{page.desc}</p>}

        {dyn ? (
          <>
            {/* content = optional intro text */}
            {page.content && <div className="pg-intro"><div className="rich" dangerouslySetInnerHTML={{ __html: page.content }} /></div>}
            <AboutSection type={page.type} items={items} />
          </>
        ) : (
          <>
            {/* content server e sanitize kora (sanitize-html) */}
            <div className="rich" dangerouslySetInnerHTML={{ __html: page.content || '' }} />
            <div className="pg-cta">
              <a className="btn btn-primary" href={`tel:${site.hotline}`}>Call {site.hotline}</a>
              <Link className="btn btn-outline" href="/appointment">Doctor Appointment</Link>
            </div>
          </>
        )}
      </section>
    </>
  );
}