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
import { HOME_DEPTS, SERVICE_GRID, WHY, FACILITIES, TECH,
  FALLBACK_DOCTORS, FALLBACK_NEWS, FALLBACK_FEEDBACK } from '@/lib/data';

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
          <h2>One Of The Best Private Hospital Of Bangladesh For Quality Health Care, Surgery &amp; Emergency</h2>
          <p>Life Care Hospital is a 250-beded tertiary care hospital (a sister concern of United Healthcare Services Ltd.) It is a state-of-the-art medical facility established in Jamalpur with world class healthcare amenities backed by a multidisciplinary team of medical fraternity with the finest state of the art technology available in Bangladesh.</p>
          <p>The operations of the hospital are conducting under direct supervision of United Healthcare Services Ltd. where we have full time salaried doctors, consultants on retainership basis and visiting consultants.</p>
          <p>The emergency department of Life Care Hospital is designed with a nationally competitive standard of medical experience which was missing in Jamalpur. With its modern equipment and facilities, we are ensuring affordable high quality medical care, i.e. right diagnosis for right treatment.</p>
        </div>
      </section>

      {/* DOCTORS */}
      <section className="section section-tint">
        <div className="container">
          <SectionTitle title="Our Experienced And Qualified Doctors" />
          <Carousel label="Doctors">
            {docs.items.map((d) => <div className="car-item" key={d._id}><DoctorCard d={d} /></div>)}
          </Carousel>
          <p className="center"><Link href="/doctors" className="btn btn-outline">View all doctors</Link></p>
        </div>
      </section>

      {/* FEEDBACK */}
      <section className="section container">
        <SectionTitle title="Patient Experience And Feedback" />
        <Carousel label="Patient feedback">
          {fb.items.map((t) => (
            <figure className="car-item quote" key={t._id}>
              <p className="bn">আস্থা রাখুন... সুস্থ থাকুন</p>
              <Icon name="quote" size={34} />
              <blockquote className="bn">{t.message}</blockquote>
              <figcaption>{t.name}<small>{'★'.repeat(t.rating || 5)}</small></figcaption>
            </figure>
          ))}
        </Carousel>
      </section>

      {/* DEPARTMENTS */}
      <section className="section container">
        <SectionTitle title="Our Departments: A Wide Range Of Medical Solutions" />
        <div className="dept-grid">
          {HOME_DEPTS.map((d) => (
            <Link key={d.name} href={`/doctors?department=${encodeURIComponent(d.dept || d.name)}`} className="dept">
              <span className="dept-ico"><Icon name={d.icon} size={52} /></span>
              <span>{d.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section className="section container">
        <SectionTitle title="Our Services: Providing Affordable High Quality Medical Care Backed By A Multidisciplinary Team Of Medical Fraternity"
          sub="Our patient-centric environment and multi-disciplinary treatment facilities make us unique from others." />
        <div className="svc-grid">{SERVICE_GRID.map((s) => <div className="svc" key={s}>{s}</div>)}</div>
      </section>

      {/* WHY */}
      <section className="section section-tint">
        <div className="container">
          <SectionTitle title="WHY CHOOSE US?" sub="We provide tertiary level clinical care backed by a multidisciplinary team of medical fraternity with the finest state of the art technology available in Bangladesh." />
          <div className="why-grid">
            {WHY.map((w) => (
              <article className="why" key={w.title}><Icon name={w.icon} size={48} /><h3>{w.title}</h3><p>{w.text}</p></article>
            ))}
          </div>
        </div>
      </section>

      {/* FACILITIES */}
      <section className="section container fac">
        <div>
          <h2>Our Facilities &amp; Amenities</h2>
          <ul className="checks">{FACILITIES.map((f) => <li key={f}><Icon name="check" size={18} />{f}</li>)}</ul>
        </div>
        <div className="fac-panel" aria-hidden="true">
          {STATS.map(([n, l]) => <div key={l}><b>{n}</b><span>{l}</span></div>)}
        </div>
      </section>

      {/* TECH */}
      <section className="section container">
        <div className="tech-head">
          <h2>Our State-Of-The-Art Technology</h2>
          <p>We have the finest state of the art technologies and modern equipment for screening, diagnosis, and treatment of specific diseases.</p>
        </div>
        <div className={techVideo ? 'tech-layout' : ''}>
          {techVideo && <YouTube id={techVideo.youtubeId} title={techVideo.title} />}
          <div className={`tech-grid ${techVideo ? 'two' : ''}`}>{TECH.map((t) => <article key={t.title} className="tech"><h3>{t.title}</h3><p>{t.text}</p></article>)}</div>
        </div>
      </section>

      {/* NEWS */}
      <section className="section section-tint">
        <div className="container">
          <SectionTitle title="News & Updates" icon="clipboard" />
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
    </>
  );
}
