'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { cld } from '@/lib/img';

const fmt = (d) => (d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '');

export default function BlogGrid({ items }) {
  const [q, setQ] = useState('');
  const [sort, setSort] = useState('new');
  const [open, setOpen] = useState(null);

  const list = useMemo(() => {
    const t = q.trim().toLowerCase();
    const rows = items.filter((n) => !t || `${n.title} ${n.excerpt || ''}`.toLowerCase().includes(t));
    const ts = (n) => new Date(n.createdAt || 0).getTime();
    return [...rows].sort((a, b) => (sort === 'new' ? ts(b) - ts(a) : ts(a) - ts(b)));
  }, [items, q, sort]);

  if (!items.length) return <p className="ab-empty">Ekhono kono blog / news publish hoyni.</p>;

  return (
    <>
      <div className="ab-bhead">
        <h2 className="ab-h2">Articles and News</h2>
        <div className="ab-ctrl">
          <select className="ab-sel" value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort">
            <option value="new">New to Old</option>
            <option value="old">Old to New</option>
          </select>
          <input className="ab-search" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search blog…" aria-label="Search blog" />
        </div>
      </div>

      {list.length === 0 && <p className="ab-empty">Kono blog pawa jayni.</p>}

      <div className="ab-blogs">
        {list.map((n) => {
          const cover = n.image ? cld(n.image, 'w_640,h_440,c_fill,q_auto,f_auto') : n.youtubeId ? `https://i.ytimg.com/vi/${n.youtubeId}/hqdefault.jpg` : '';
          const on = open === n._id;
          return (
            <article className="ab-post" key={n._id}>
              <div className="ab-pmedia">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {cover ? <img className="ab-pimg" src={cover} alt={n.title} loading="lazy" /> : <div className="ab-pimg" aria-hidden="true" />}
              </div>
              <div className="ab-pbody">
                <span className="ab-date">{fmt(n.createdAt)}</span>
                <h3 className="bn">{n.title}</h3>
                {n.excerpt && <p className="ab-ex bn">{n.excerpt}</p>}
                {on && n.content && <p className="ab-txt bn" style={{ marginTop: 10 }}>{n.content}</p>}
                {n.content && (
                  <button type="button" className="ab-more" aria-expanded={on} onClick={() => setOpen(on ? null : n._id)}>
                    {on ? 'See Less' : 'See More'} <span aria-hidden="true">{on ? '↑' : '→'}</span>
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </div>
      <p className="ab-all"><Link className="btn btn-outline" href="/news">Shob news dekhun →</Link></p>
    </>
  );
}