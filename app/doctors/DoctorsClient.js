'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import DoctorCard from '@/components/DoctorCard';
import { api } from '@/lib/api';
import '@/styles/doctors.css';

const LIMIT = 12;

export default function DoctorsClient() {
  const sp = useSearchParams();
  const [q, setQ] = useState(sp.get('q') || '');
  const [term, setTerm] = useState((sp.get('q') || '').trim());
  const [dept, setDept] = useState(sp.get('department') || '');
  const [page, setPage] = useState(1);
  const [depts, setDepts] = useState([]);
  const [res, setRes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  // search box: 350ms thamle tabei search hobe
  useEffect(() => {
    const t = setTimeout(() => { setTerm(q.trim()); setPage(1); }, 350);
    return () => clearTimeout(t);
  }, [q]);

  useEffect(() => { api('/doctors/departments').then((r) => setDepts(r.items || [])).catch(() => {}); }, []);

  useEffect(() => {
    let live = true;
    setLoading(true); setErr('');
    const p = new URLSearchParams({ limit: String(LIMIT), page: String(page) });
    if (dept) p.set('department', dept);
    if (term) p.set('q', term);
    api(`/doctors?${p}`)
      .then((r) => { if (live) { setRes(r); setLoading(false); } })
      .catch((e) => { if (live) { setErr(e.message); setLoading(false); } });
    return () => { live = false; };
  }, [dept, term, page]);

  const pick = (d) => { setDept(d); setPage(1); };
  const go = (n) => { setPage(n); document.getElementById('dc-list')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); };
  const items = res?.items || [];

  return (
    <section className="container section dc-section" id="dc-list">
      <div className="filters">
        <label className="search">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search doctor by name…" aria-label="Search doctor" />
        </label>
        <div className="chips" role="tablist" aria-label="Departments">
          <button type="button" className={`chip-btn ${dept === '' ? 'on' : ''}`} onClick={() => pick('')}>All</button>
          {depts.map((d) => (
            <button type="button" key={d.name} className={`chip-btn ${dept === d.name ? 'on' : ''}`} onClick={() => pick(d.name)}>{d.name} <small>({d.count})</small></button>
          ))}
        </div>
      </div>

      {err && <p className="dc-empty">{err}</p>}

      {loading && !res && (
        <div className="dc-grid" aria-busy="true">{[0, 1, 2, 3].map((i) => <div className="dc-skel" key={i} />)}</div>
      )}

      {res && (
        <>
          <p className="dc-count">{res.total} doctor{res.total === 1 ? '' : 's'} found{dept ? ` in ${dept}` : ''}</p>
          {items.length === 0
            ? <p className="dc-empty">No doctor found. Try another name or department.</p>
            : <div className={`dc-grid ${loading ? 'is-loading' : ''}`}>{items.map((d) => <DoctorCard key={d._id} d={d} />)}</div>}
          {res.pages > 1 && (
            <div className="pager">
              <button className="btn btn-outline" disabled={page <= 1} onClick={() => go(page - 1)}>← Previous</button>
              <span>Page {res.page} of {res.pages}</span>
              <button className="btn btn-outline" disabled={page >= res.pages} onClick={() => go(page + 1)}>Next →</button>
            </div>
          )}
        </>
      )}
    </section>
  );
}