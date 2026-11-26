import Link from 'next/link';
import Icon from './Icons';
import { cld } from '@/lib/img';
import '@/styles/doctors.css';

const initials = (n = '') => n.replace(/^(Prof\.|Dr\.|Dr)\s*/i, '').split(' ').slice(0, 2).map((w) => w[0]).join('');

export default function DoctorCard({ d }) {
  // demo (fallback) doctor der real profile nai
  const real = /^[a-f\d]{24}$/i.test(String(d._id || ''));
  const profile = real ? `/doctors/${d._id}` : '/doctors';
  const book = real ? `/appointment?doctor=${d._id}` : '/appointment';
  return (
    <article className="dc-card">
      <Link href={profile} className="dc-media" aria-label={`${d.name} - view profile`}>
        {d.photo
          ? <img src={cld(d.photo, 'w_700,h_740,c_fill,g_face,q_auto,f_auto')} alt={d.name} loading="lazy" />
          : <span className="dc-ini" aria-hidden="true">{initials(d.name)}</span>}
        {d.department && <span className="dc-dept">{d.department}</span>}
        {d.fee ? <span className="dc-fee">Fee ৳{d.fee}</span> : null}
      </Link>
      <div className="dc-body">
        <h3 className="dc-name"><Link href={profile}>{d.name}</Link></h3>
        {d.nameBn && <p className="bn dc-bn">{d.nameBn}</p>}
        {d.designation && <p className="dc-desig">{d.designation}</p>}
        {d.degrees && <p className="dc-deg">{d.degrees}</p>}
        <ul className="dc-meta">
          {d.days?.length > 0 && <li><Icon name="calendar" size={16} /> {d.days.join(', ')}</li>}
          {d.startTime && <li><Icon name="clock" size={16} /> {d.startTime} – {d.endTime}</li>}
        </ul>
        <div className="dc-actions">
          <Link href={profile} className="btn btn-outline">View Profile</Link>
          <Link href={book} className="btn btn-primary">Book Now</Link>
        </div>
      </div>
    </article>
  );
}