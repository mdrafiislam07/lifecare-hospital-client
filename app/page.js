import Link from 'next/link';
import Icon from '@/components/Icons';
import HeroArt from '@/components/HeroArt';
import Carousel from '@/components/Carousel';
import DoctorCard from '@/components/DoctorCard';
import SectionTitle from '@/components/SectionTitle';
import YouTube from '@/components/YouTube';
import NewsCard from '@/components/NewsCard';
import { serverGet } from '@/lib/api';
import { getSettings } from '@/lib/content';
import { cld } from '@/lib/img';
import { FALLBACK_DOCTORS, FALLBACK_NEWS, FALLBACK_FEEDBACK } from '@/lib/data';

export const revalidate = 60;

// Heading e [[...]] er vitore ja thake seta highlight (<em>) hoy
const Heading = ({ text }) => String(text || '').split(/\[\[(.+?)\]\]/).map((p, i) => (i % 2 ? <em key={i}>{p}</em> : p));

export default async function Home() {
  const [site, docs, news, fb, vids] = await Promise.all([
    getSettings(),
    serverGet('/doctors?limit=8', { items: FALLBACK_DOCTORS }),
    serverGet('/news?limit=3', { items: FALLBACK_NEWS }),
    serverGet('/feedback', { items: FALLBACK_FEEDBACK }),
    serverGet('/media?type=video&limit=30', { items: [] })
  ]);
  const H = site.home;                                   // admin > Settings > Home sections
  const show = (k) => !H.hidden.includes(k);             // section on/off
  // Admin panel theke deya YouTube video gulo: placement onujayi boshe
  const vid = (p) => vids.items.find((v) => v.placement === p);
  const STATS = [[site.stats.beds, 'Beds'], [site.stats.opdRooms, 'OPD rooms'], [site.stats.operationTheatres, 'Operation theatres'], [Number(site.stats.sqft || 0).toLocaleString('en-US'), 'Square feet']];
  const aboutVideo = vid('about'), techVideo = vid('technology'), newsVideo = vid('news');

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="container hero-in">
          <div className="hero-copy">
            <p className="brands">{site.brandsLabel}</p>
            <div className="brand-chips">{site.brandChips.map((c) => <span key={c}>{c}</span>)}</div>
            <h1 className="bn"><Heading text={site.heroHeading} /></h1>
            <p className="lead">{site.heroLead}</p>
            <div className="hero-cta">
              <Link href="/appointment" className="btn btn-primary btn-lg">Doctor Appointment</Link>
              <a href={`tel:${site.emergencyTel}`} className="btn btn-outline btn-lg"><Icon name="phone" size={18} /> Emergency {site.emergency}</a>
            </div>
          </div>
          <div className="hero-art">{site.heroImage ? <img src={cld(site.heroImage, 'w_900,c_limit,q_auto,f_auto')} alt={site.siteName} width="900" height="700" style={{ width: '100%', height: 'auto', borderRadius: 16 }} /> : <HeroArt />}</div>
        </div>
      </section>

      <section className="quick">
        {site.quickTiles.map((q, i) => (
          <Link key={q.label} href={q.href} className={`quick-tile q${i}`}>
            <Icon name={q.icon} size={44} />
            <span>{q.label}</span>
          </Link>
        ))}
      </section>

      {/* ABOUT */}
      {show('about') && (
        <section className="section container about">
          <div className="about-media">
            {aboutVideo ? <YouTube id={aboutVideo.youtubeId} title={aboutVideo.title} /> : (
            <div className="about-card">
              <p className="about-big bn">{site.aboutBadge.big}</p>
              <p>{site.aboutBadge.sub}</p>
              <div className="mini-stats">{STATS.map(([n, l]) => <div key={l}><b>{n}</b><span>{l}</span></div>)}</div>
            </div>)}
          </div>
          <div className="about-text">
            <h2>{H.about.title}</h2>
            {H.about.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
          </div>
        </section>
      )}

      {/* DOCTORS */}
      {show('doctors') && (
        <section className="section section-tint">
          <div className="container">
            <SectionTitle title={H.doctorsTitle} />
            <Carousel label="Doctors">
              {docs.items.map((d) => <div className="car-item" key={d._id}><DoctorCard d={d} /></div>)}
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
          <div className="dept-grid">
            {H.departments.map((d) => (
              <Link key={d.name} href={`/doctors?department=${encodeURIComponent(d.dept || d.name)}`} className="dept">
                <span className="dept-ico"><Icon name={d.icon} size={52} /></span>
                <span>{d.name}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* SERVICES */}
      {show('services') && (
        <section className="section container">
          <SectionTitle title={H.servicesTitle} sub={H.servicesSub} />
          <div className="svc-grid">{H.services.map((s) => <div className="svc" key={s}>{s}</div>)}</div>
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
          <div className="fac-panel" aria-hidden="true">
            {STATS.map(([n, l]) => <div key={l}><b>{n}</b><span>{l}</span></div>)}
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