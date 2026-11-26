import Link from 'next/link';
import Icon from '@/components/Icons';
import HeroSlider from '@/components/HeroSlider';
import Carousel from '@/components/Carousel';
import DoctorCard from '@/components/DoctorCard';
import SectionTitle from '@/components/SectionTitle';
import YouTube from '@/components/YouTube';
import NewsCard from '@/components/NewsCard';
import { serverGet } from '@/lib/api';
import { getSettings, getMenu } from '@/lib/content';
import { cld } from '@/lib/img';
import '@/styles/home-extra.css';
import { FALLBACK_DOCTORS, FALLBACK_NEWS, FALLBACK_FEEDBACK } from '@/lib/data';

export const revalidate = 60;

// Location button er map pin icon
const PinIcon = ({ size = 34 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.6" />
  </svg>
);

// Facilities stats er icon
const FAC_ICONS = {
  bed: <><path d="M3 18V7M3 13h18v5M21 13v-2a3 3 0 0 0-3-3h-7v5" /><circle cx="7" cy="10.5" r="1.8" /></>,
  opd: <><rect x="5" y="3" width="14" height="18" rx="2" /><path d="M9 8h6M9 12h6M9 16h3" /></>,
  ot: <><circle cx="12" cy="12" r="9" /><path d="M12 8v8M8 12h8" /></>,
  area: <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
};
const FacIcon = ({ k }) => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{FAC_ICONS[k]}</svg>
);

// Heading e [[...]] er vitore ja thake seta highlight (<em>) hoy
const Heading = ({ text }) => String(text || '').split(/\[\[(.+?)\]\]/).map((p, i) => (i % 2 ? <em key={i}>{p}</em> : p));

export default async function Home() {
  const [site, docs, news, fb, vids, menu] = await Promise.all([
    getSettings(),
    serverGet('/doctors?limit=8', { items: FALLBACK_DOCTORS }),
    serverGet('/news?limit=3', { items: FALLBACK_NEWS }),
    serverGet('/feedback', { items: FALLBACK_FEEDBACK }),
    serverGet('/media?type=video&limit=30', { items: [] }),
    getMenu()
  ]);
  // Admin > Settings > Home hero banners. Kichu na dile 2 ta demo banner dekhabe
  const DEMO_BANNERS = [{ url: '/banners/demo-1.svg' }, { url: '/banners/demo-2.svg' }];
  const slides = (site.heroBanners?.length ? site.heroBanners : DEMO_BANNERS).map((b) => ({
    url: b.url.startsWith('/') ? b.url : cld(b.url, 'w_1920,c_limit,q_auto,f_auto'),
    alt: site.siteName
  }));
  // Quick tiles: Ambulance button bad, tar jayga e Location button (click korle Google Map khule)
  const mapHref = site.mapLink || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.address || site.siteName || '')}`;
  const tiles = site.quickTiles.filter((q) => !/ambulance/i.test(`${q.label} ${q.href} ${q.icon}`));
  if (!tiles.some((q) => /location/i.test(q.label))) tiles.push({ label: 'Location', href: mapHref, external: true });
  else tiles.forEach((q) => { if (/location/i.test(q.label)) { q.href = q.href && q.href !== '#' ? q.href : mapHref; q.external = true; } });
  const H = site.home;                                   // admin > Settings > Home sections
  const show = (k) => !H.hidden.includes(k);             // section on/off
  // Admin panel theke deya YouTube video gulo: placement onujayi boshe
  const vid = (p) => vids.items.find((v) => v.placement === p);
  const STATS = [[site.stats.beds, 'Beds', 'bed'], [site.stats.opdRooms, 'OPD rooms', 'opd'], [site.stats.operationTheatres, 'Operation theatres', 'ot'], [Number(site.stats.sqft || 0).toLocaleString('en-US'), 'Square feet', 'area']];
  // Services section: Services menu-r real page gulo (link shoho). Menu te na thakle admin er text list
  // menu te "Services" top item er children = services er sob page (Emergency, Ambulance, Nursing, LAB ...)
  const svcMenu = (menu || []).find((m) => m.group === 'services' || /^services$/i.test(m.label || ''));
  const svcPages = (svcMenu?.children || [])
    .map((m) => ({ name: m.label || m.title || m.name, href: m.href })).filter((m) => m.name && m.href);
  // Admin > Settings > Home: Services > "Service cards" (photo shoho). Na thakle menu er page gulo (prothom 8 ta)
  const cards = (H.serviceCards || []).filter((c) => c.title && c.href);
  const svcAll = cards.length
    ? cards.map((c) => ({ name: c.title, href: c.href, image: c.image || '' }))
    : (svcPages.length ? svcPages : H.services.map((name) => ({ name, href: '' }))).map((x) => ({ ...x, image: '' }));
  const svcItems = cards.length ? svcAll : svcAll.slice(0, 8);
  const svcMore = svcMenu?.href || svcAll[0]?.href || '/services/emergency';
  const imgUrl = (u, t) => (u.startsWith('/') ? u : cld(u, t));
  const deptImg = (u) => imgUrl(u, 'w_480,h_360,c_fill,g_auto,q_auto,f_auto');
  const svcImg = (u) => imgUrl(u, 'w_760,h_580,c_fill,g_auto,q_auto,f_auto');
  const aboutVideo = vid('about'), techVideo = vid('technology'), newsVideo = vid('news');
  const aboutImg = site.aboutImage
    ? (site.aboutImage.startsWith('/') ? site.aboutImage : cld(site.aboutImage, 'w_1200,c_limit,q_auto,f_auto'))
    : '';
  // Know More: admin e link dile seta, na hole About menu-r prothom page
  const aboutMenu = (menu || []).find((m) => m.group === 'about');
  const aboutLink = site.aboutLink || aboutMenu?.href || '/';

  return (
    <>
      {/* HERO BANNER SLIDER (5 second por por auto change) */}
      <HeroSlider slides={slides} interval={5000} />

      {/* QUICK BUTTONS (gradient strip + rounded cards) */}
      <section className="quick">
        {tiles.map((q, i) => q.external ? (
          <a key={q.label} href={q.href} target="_blank" rel="noopener noreferrer" className={`quick-tile q${i}`}>
            <PinIcon size={34} />
            <span>{q.label}</span>
          </a>
        ) : (
          <Link key={q.label} href={q.href} className={`quick-tile q${i}`}>
            <Icon name={q.icon} size={34} />
            <span>{q.label}</span>
          </Link>
        ))}
      </section>

      {/* ABOUT US */}
      {show('about') && (
        <section className="section container about2">
          <div className="about2-text">
            <p className="about2-label">ABOUT US</p>
            <h2>{H.about.title}</h2>
            {H.about.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
            <Link href={aboutLink} className="btn btn-primary about2-btn">
              Know More <Icon name="chevron" size={16} />
            </Link>
          </div>
          <div className="about2-media">
            {aboutVideo
              ? <YouTube id={aboutVideo.youtubeId} title={aboutVideo.title} />
              : aboutImg
                ? <img src={aboutImg} alt={site.siteName} loading="lazy" />
                : <div className="about2-ph">{site.siteName}</div>}
          </div>
        </section>
      )}

      {/* DOCTORS */}
      {show('doctors') && (
        <section className="section section-tint">
          <div className="container">
            <SectionTitle title={H.doctorsTitle} />
            <Carousel label="Doctors">
              {docs.items.map((d) => <div className="car-item doc-item" key={d._id}><DoctorCard d={d} /></div>)}
            </Carousel>
            <p className="center"><Link href="/doctors" className="btn btn-outline">View all doctors</Link></p>
          </div>
        </section>
      )}

      {/* FEEDBACK */}
      {show('feedback') && (
        <section className="section container">
          <SectionTitle title={H.feedbackTitle} />
          <Carousel label="Patient feedback">
            {fb.items.map((t) => (
              <figure className="car-item quote" key={t._id}>
                <p className="bn">{H.feedbackTagline}</p>
                <Icon name="quote" size={34} />
                <blockquote className="bn">{t.message}</blockquote>
                <figcaption>{t.name}<small>{'★'.repeat(t.rating || 5)}</small></figcaption>
              </figure>
            ))}
          </Carousel>
        </section>
      )}

      {/* DEPARTMENTS */}
      {show('departments') && (
        <section className="section container">
          <SectionTitle title={H.departmentsTitle} />
          <div className="dpx-grid">
            {H.departments.map((d) => (
              <Link key={d.name} href={`/doctors?department=${encodeURIComponent(d.dept || d.name)}`} className="dpx-card">
                <span className="dpx-media">
                  {d.image
                    ? <img src={deptImg(d.image)} alt="" loading="lazy" />
                    : <span className="dpx-ico"><Icon name={d.icon} size={38} /></span>}
                </span>
                <span className="dpx-name">{d.name}</span>
                <span className="dpx-chip">View doctors <Icon name="chevron" size={13} /></span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* SERVICES */}
      {show('services') && (
        <section className="section container">
          <SectionTitle title={H.servicesTitle} sub={H.servicesSub} />
          <div className="svx-grid">
            {svcItems.map((x) => {
              const inner = (
                <>
                  {x.image
                    ? <img className="svx-img" src={svcImg(x.image)} alt="" loading="lazy" />
                    : <span className="svx-ph" aria-hidden="true"><Icon name="steth" size={72} /></span>}
                  <span className="svx-shade" aria-hidden="true" />
                  <span className="svx-body">
                    <strong>{x.name}</strong>
                    {x.href && <span className="svx-go">Learn more <Icon name="chevron" size={14} /></span>}
                  </span>
                  {x.href && <span className="svx-arrow" aria-hidden="true"><Icon name="chevron" size={16} /></span>}
                </>
              );
              return x.href
                ? <Link href={x.href} className="svx-card" key={x.name}>{inner}</Link>
                : <div className="svx-card" key={x.name}>{inner}</div>;
            })}
          </div>
          <p className="center svx-more"><Link href={svcMore} className="btn btn-outline">View all services</Link></p>
        </section>
      )}

      {/* WHY */}
      {show('why') && (
        <section className="section section-tint">
          <div className="container">
            <SectionTitle title={H.whyTitle} sub={H.whySub} />
            <div className="why-grid">
              {H.why.map((w) => (
                <article className="why" key={w.title}><Icon name={w.icon} size={48} /><h3>{w.title}</h3><p>{w.text}</p></article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FACILITIES */}
      {show('facilities') && (
        <section className="section container fac">
          <div>
            <h2>{H.facilitiesTitle}</h2>
            <ul className="checks">{H.facilities.map((f) => <li key={f}><Icon name="check" size={18} />{f}</li>)}</ul>
          </div>
          <div className="fac-panel">
            {STATS.map(([n, l, ic]) => (
              <div className="fac-stat" key={l}>
                <div className="fac-ico"><FacIcon k={ic} /></div>
                <div><b>{n}</b><small>{l}</small></div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TECH */}
      {show('tech') && (
        <section className="section container">
          <div className="tech-head">
            <h2>{H.techTitle}</h2>
            <p>{H.techText}</p>
          </div>
          <div className={techVideo ? 'tech-layout' : ''}>
            {techVideo && <YouTube id={techVideo.youtubeId} title={techVideo.title} />}
            <div className={`tech-grid ${techVideo ? 'two' : ''}`}>{H.tech.map((t) => <article key={t.title} className="tech"><h3>{t.title}</h3><p>{t.text}</p></article>)}</div>
          </div>
        </section>
      )}

      {/* NEWS */}
      {show('news') && (
        <section className="section section-tint">
          <div className="container">
            <SectionTitle title={H.newsTitle} icon="clipboard" />
            {newsVideo && (
              <div className="news-feature">
                <YouTube id={newsVideo.youtubeId} title={newsVideo.title} />
                <div><h3 className="bn">{newsVideo.title}</h3>{newsVideo.description && <p className="bn">{newsVideo.description}</p>}</div>
              </div>
            )}
            <div className="news-grid">
              {news.items.map((n) => <NewsCard key={n._id} n={n} more />)}
            </div>
          </div>
        </section>
      )}
    </>
  );
}