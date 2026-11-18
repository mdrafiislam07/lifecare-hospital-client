'use client';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import DoctorCard from '@/components/DoctorCard';
import Icon from '@/components/Icons';
import { SPECIALTIES, FALLBACK_DOCTORS } from '@/lib/data';

export default function DoctorsClient() {
  const sp = useSearchParams();
  const router = useRouter();
  const dept = sp.get('department') || '';
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const [data, setData] = useState({ items: [], pages: 1 });
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  useEffect(() => { setPage(1); }, [dept, q]);
  useEffect(() => {
    const t = setTimeout(() => {   // search e protibar key chapleo request jabe na (debounce)
      setLoading(true); setErr('');
      const qs = new URLSearchParams({ page, limit: 12 });
      if (dept) qs.set('department', dept);
      if (q.trim()) qs.set('q', q.trim());
      api(`/doctors?${qs}`).then(setData).catch((e) => {
        setErr(e.message);
        setData({ items: dept || q ? [] : FALLBACK_DOCTORS, pages: 1 });
      }).finally(() => setLoading(false));
    }, 350);
    return () => clearTimeout(t);
  }, [dept, q, page]);

  const pick = (d) => router.push(d ? `/doctors?department=${encodeURIComponent(d)}` : '/doctors');

  return (
    <section className="container section">
      <div className="filters">
        <div className="search"><Icon name="search" size={18} /><input type="search" placeholder="Doctor er nam khujun" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search doctor" /></div>
        <div className="chips" role="group" aria-label="Department">
          <button className={`chip-btn ${!dept ? 'on' : ''}`} onClick={() => pick('')}>All</button>
          {SPECIALTIES.map((s) => <button key={s} className={`chip-btn ${dept === s ? 'on' : ''}`} onClick={() => pick(s)}>{s}</button>)}
        </div>
      </div>
      {err && <p className="alert alert-error">{err}</p>}
      {loading ? <p className="muted">Loading…</p> : data.items.length === 0 ? <p className="muted">No doctors found.</p> : (
        <div className="doc-grid">{data.items.map((d) => <DoctorCard key={d._id} d={d} />)}</div>
      )}
      {data.pages > 1 && (
        <div className="pager">
          <button className="btn btn-outline" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button>
          <span>Page {page} / {data.pages}</span>
          <button className="btn btn-outline" disabled={page >= data.pages} onClick={() => setPage(page + 1)}>Next</button>
        </div>
      )}
    </section>
  );
}
