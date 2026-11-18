import Link from 'next/link';
import Icon from './Icons';
import { cld } from '@/lib/img';

const initials = (n) => n.replace(/^(Prof\.|Dr\.|Dr)\s*/i, '').split(' ').slice(0, 2).map((w) => w[0]).join('');

export default function DoctorCard({ d }) {
  const book = d._id?.startsWith('f') ? '/appointment' : `/appointment?doctor=${d._id}`;
  return (
    <article className="doc-card">
      <div className="doc-top">
        {d.photo ? <img src={cld(d.photo, 'w_200,h_200,c_fill,g_face')} alt={d.name} loading="lazy" width="84" height="84" className="doc-photo" /> : <div className="doc-avatar" aria-hidden="true">{initials(d.name)}</div>}
        <span className="chip">{d.department}</span>
      </div>
      <h3>{d.name}</h3>
      {d.nameBn && <p className="bn doc-bn">{d.nameBn}</p>}
      <p className="doc-desig">{d.designation}</p>
      {d.degrees && <p className="doc-deg">{d.degrees}</p>}
      <ul className="doc-meta">
        {d.days?.length > 0 && <li><Icon name="calendar" size={16} /> {d.days.join(', ')}</li>}
        <li><Icon name="clock" size={16} /> {d.startTime} – {d.endTime}</li>
        {d.fee ? <li><Icon name="check" size={16} /> Fee: ৳{d.fee}</li> : null}
      </ul>
      <Link href={book} className="btn btn-primary btn-block">Book appointment</Link>
    </article>
  );
}
