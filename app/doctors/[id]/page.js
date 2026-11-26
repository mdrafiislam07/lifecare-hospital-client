import Link from 'next/link';
import { notFound } from 'next/navigation';
import Icon from '@/components/Icons';
import DoctorCard from '@/components/DoctorCard';
import SectionTitle from '@/components/SectionTitle';
import { serverGet } from '@/lib/api';
import { getSettings } from '@/lib/content';
import { cld } from '@/lib/img';
import '@/styles/doctors.css';

export const revalidate = 60;

const DAYS = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const initials = (n = '') => n.replace(/^(Prof\.|Dr\.|Dr)\s*/i, '').split(' ').slice(0, 2).map((w) => w[0]).join('');
const t12 = (t) => {
  const [h, m] = String(t || '').split(':').map(Number);
  if (Number.isNaN(h)) return t || '';
  return `${((h + 11) % 12) + 1}:${String(m || 0).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`;
};

async function load(id) {
  if (!/^[a-f\d]{24}$/i.test(id)) return null;
  const r = await serverGet(`/doctors/${id}`, null);
  return r?.item || null;
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const d = await load(id);
  if (!d) return { title: 'Doctor not found' };
  return { title: `${d.name} - ${d.department}`, description: `${d.name}, ${d.designation || 'Consultant'} (${d.department}). View profile, visiting schedule and book an appointment.` };
}

export default async function DoctorProfile({ params }) {
  const { id } = await params;
  const d = await load(id);
  if (!d) notFound();

  const [site, rel] = await Promise.all([
    getSettings(),
    serverGet(`/doctors?department=${encodeURIComponent(d.department)}&limit=5`, { items: [] })
  ]);
  const related = (rel.items || []).filter((x) => x._id !== d._id).slice(0, 4);
  const spec = d.specialties?.length ? d.specialties : [d.department];
  const about = d.about
    || `${d.name} is a ${d.designation || 'consultant'} in the Department of ${d.department}${d.degrees ? `, qualified with ${d.degrees}` : ''}. Book an appointment to consult with the doctor at ${site.siteName}.`;
  const tel = String(site.hotline || '').replace(/[^\d+]/g, '');
  const book = `/appointment?doctor=${d._id}`;

  return (
    <div className="dp-wrap">
      <div className="container">
        <nav className="dp-crumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link> <span>/</span> <Link href="/doctors">Doctors</Link> <span>/</span> <b>{d.name}</b>
        </nav>

        <div className="dp-grid">
          {/* LEFT: photo */}
          <aside className="dp-photo">
            <div className="dp-frame">
              {d.photo
                ? <img src={cld(d.photo, 'w_800,h_1000,c_fill,g_face,q_auto,f_auto')} alt={d.name} />
                : <span className="dc-ini" aria-hidden="true">{initials(d.name)}</span>}
            </div>
            <div className="dp-photo-cta">
              <Link href={book} className="btn btn-primary btn-block">Book appointment</Link>
              {tel && <a href={`tel:${tel}`} className="btn btn-outline btn-block"><Icon name="phone" size={16} /> Call {site.hotline}</a>}
            </div>
          </aside>

          {/* RIGHT: details */}
          <main className="dp-main">
            <div className="dp-head">
              <div>
                <span className="dp-tag"><Icon name="steth" size={14} /> Doctor Profile</span>
                <h1 className="dp-name">{d.name}</h1>
                {d.nameBn && <p className="bn dp-bn">{d.nameBn}</p>}
                {d.designation && <p className="dp-desig">{d.designation}</p>}
                {d.degrees && <p className="dp-deg">{d.degrees}</p>}
              </div>
              <Link href={book} className="btn btn-primary btn-lg dp-book">Book Appointment <Icon name="chevron" size={16} /></Link>
            </div>

            <div className="dp-stats">
              <div className="dp-stat"><small>Department</small><b>{d.department}</b></div>
              <div className="dp-stat"><small>Consultation Fee</small><b>{d.fee ? `৳${d.fee}` : 'Contact hospital'}</b></div>
              <div className="dp-stat"><small>Visiting Time</small><b>{d.startTime ? `${t12(d.startTime)} – ${t12(d.endTime)}` : '—'}</b></div>
              {d.experience && <div className="dp-stat"><small>Experience</small><b>{d.experience}</b></div>}
            </div>

            <div className="dp-days-box">
              <h2 className="dp-h">Visiting Days</h2>
              <div className="dp-days">
                {DAYS.map((x) => <span key={x} className={`dp-day ${d.days?.includes(x) ? 'on' : ''}`}>{x}</span>)}
              </div>
            </div>

            <div className="dp-cols">
              <section>
                <h2 className="dp-h">About Doctor</h2>
                {about.split(/\n\s*\n/).map((p, i) => <p key={i} className="dp-about">{p}</p>)}
              </section>
              <section>
                <h2 className="dp-h">Specialized In</h2>
                <ul className="dp-list">{spec.map((s) => <li key={s}><Icon name="check" size={18} />{s}</li>)}</ul>
              </section>
            </div>
          </main>
        </div>

        {related.length > 0 && (
          <section className="dp-related">
            <SectionTitle title={`More from ${d.department}`} />
            <div className="dc-grid">{related.map((x) => <DoctorCard key={x._id} d={x} />)}</div>
          </section>
        )}
      </div>
    </div>
  );
}