'use client';
import { useMemo, useState } from 'react';
import { cld } from '@/lib/img';

const initials = (n = '') => n.split(' ').slice(0, 2).map((w) => w[0]).join('');
const deptOf = (i) => i.department || 'General';
const mem = (n) => `${n} member${n === 1 ? '' : 's'}`;

function Card({ s, senior }) {
  return (
    <article className="ab-scard">
      <div className="ab-sph">
        {s.photo
          // eslint-disable-next-line @next/next/no-img-element
          ? <img src={cld(s.photo, 'w_480,h_528,c_fill,g_face,q_auto,f_auto')} alt={s.name} loading="lazy" />
          : <span className="ab-ini" aria-hidden="true">{initials(s.name)}</span>}
        {senior && <span className="ab-badge">Senior</span>}
      </div>
      <div className="ab-sbody">
        <h4>{s.name}</h4>
        {s.designation && <p>{s.designation}</p>}
      </div>
    </article>
  );
}

export default function StaffDirectory({ items }) {
  const [q, setQ] = useState('');
  const [dept, setDept] = useState('');
  const depts = useMemo(() => [...new Set(items.map(deptOf))], [items]);

  const groups = useMemo(() => {
    const t = q.trim().toLowerCase();
    const rows = items.filter((i) => (!dept || deptOf(i) === dept) && (!t || `${i.name} ${i.designation || ''}`.toLowerCase().includes(t)));
    return depts
      .map((d) => {
        const r = rows.filter((i) => deptOf(i) === d);
        return { d, senior: r.filter((i) => i.level === 'senior'), junior: r.filter((i) => i.level !== 'senior'), n: r.length };
      })
      .filter((g) => g.n > 0);
  }, [items, depts, q, dept]);

  if (!items.length) return <p className="ab-empty">Staff-er tothyo shiggroi add kora hobe.</p>;

  return (
    <>
      <div className="ab-bar">
        <input className="ab-search" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Staff-er nam ba designation khujun…" aria-label="Search staff" />
        <div className="ab-chips">
          <button type="button" className={`ab-pill ${dept === '' ? 'on' : ''}`} onClick={() => setDept('')}>All</button>
          {depts.map((d) => <button type="button" key={d} className={`ab-pill ${dept === d ? 'on' : ''}`} onClick={() => setDept(d)}>{d}</button>)}
        </div>
      </div>

      {groups.length === 0 && <p className="ab-empty">Kono staff pawa jayni.</p>}

      {groups.map((g) => (
        <section className="ab-dcard" key={g.d}>
          <div className="ab-dhead">
            <div><span className="ab-eyebrow">Department</span><h3>{g.d}</h3></div>
            <span className="ab-count">{g.n} staff{g.n === 1 ? '' : 's'}</span>
          </div>
          {g.senior.length > 0 && (
            <div className="ab-sub">
              <div className="ab-subh"><h4>Senior Staff</h4><span>{mem(g.senior.length)}</span></div>
              <div className="ab-staff">{g.senior.map((s) => <Card key={s._id} s={s} senior />)}</div>
            </div>
          )}
          {g.junior.length > 0 && (
            <div className="ab-sub">
              <div className="ab-subh"><h4>Junior Staffs</h4><span>{mem(g.junior.length)}</span></div>
              <div className="ab-staff">{g.junior.map((s) => <Card key={s._id} s={s} />)}</div>
            </div>
          )}
        </section>
      ))}
    </>
  );
}