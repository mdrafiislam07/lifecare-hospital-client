'use client';
import { useMemo, useState } from 'react';

export default function FaqAccordion({ items }) {
  const [open, setOpen] = useState(0);
  const [q, setQ] = useState('');
  const list = useMemo(() => {
    const t = q.trim().toLowerCase();
    return t ? items.filter((i) => `${i.question} ${i.answer}`.toLowerCase().includes(t)) : items;
  }, [items, q]);

  if (!items.length) return <p className="ab-empty">FAQ shiggroi add kora hobe.</p>;

  return (
    <>
      <div className="ab-bar" style={{ maxWidth: 1100, margin: '0 auto 12px' }}>
        <input className="ab-search" type="search" value={q} onChange={(e) => { setQ(e.target.value); setOpen(-1); }} placeholder="Proshno khujun…" aria-label="Search FAQ" />
      </div>
      {list.length === 0 && <p className="ab-empty">Kono proshno pawa jayni.</p>}
      <div className="ab-faq">
        {list.map((f, i) => {
          const on = open === i;
          return (
            <div className={`ab-q ${on ? 'open' : ''}`} key={f._id}>
              <button type="button" className="ab-qh" aria-expanded={on} onClick={() => setOpen(on ? -1 : i)}>
                <span className="ab-qi" aria-hidden="true">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
                </span>
                <span className="ab-qt"><b>{i + 1}</b>{f.question}</span>
              </button>
              <div className="ab-qa"><div><p>{f.answer}</p></div></div>
            </div>
          );
        })}
      </div>
    </>
  );
}