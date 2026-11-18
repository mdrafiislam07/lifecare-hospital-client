'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Alert } from '@/components/Ui';
import '@/styles/cms.css';

const toText = (c) => (c || []).map((x) => `${x.label} | ${x.href}`).join('\n');
const fromText = (t) => String(t || '').split('\n').map((l) => l.trim()).filter(Boolean).map((l) => {
  const i = l.lastIndexOf('|'); return { label: l.slice(0, i).trim(), href: l.slice(i + 1).trim() };
});

export default function MenuEditor({ token }) {
  const [items, setItems] = useState(null);
  const [groups, setGroups] = useState(['about', 'services', 'admission']);
  const [err, setErr] = useState(''); const [ok, setOk] = useState(''); const [busy, setBusy] = useState(false);

  useEffect(() => {
    Promise.all([api('/menu/admin', { token }), api('/pages', { token })]).then(([m, p]) => {
      setItems(m.items.map((i) => ({ label: i.label, href: i.href || '', group: i.group || '', visible: i.visible !== false, text: toText(i.children) })));
      setGroups([...new Set(['about', 'services', 'admission', ...p.items.map((x) => x.group)])]);
    }).catch((e) => setErr(e.message));
  }, [token]);

  if (!items) return <><Alert>{err}</Alert><p>Loading…</p></>;
  const upd = (i, k, v) => setItems(items.map((x, n) => (n === i ? { ...x, [k]: v } : x)));
  const move = (i, d) => { const j = i + d; if (j < 0 || j >= items.length) return; const a = [...items]; [a[i], a[j]] = [a[j], a[i]]; setItems(a); };

  const save = async () => {
    setErr(''); setOk('');
    const bad = items.find((i) => i.text.split('\n').some((l) => l.trim() && !l.includes('|')));
    if (bad) return setErr(`"${bad.label}": sub-menu line format hobe  Label | /link`);
    setBusy(true);
    try {
      await api('/menu', { method: 'PUT', token, body: { items: items.map((i) => ({ label: i.label, href: i.href, group: i.group, visible: i.visible, children: fromText(i.text) })) } });
      setOk('Menu save hoyeche');
    } catch (e) { setErr(e.message); }
    setBusy(false); window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="cms-form">
      <Alert>{err}</Alert><Alert type="ok">{ok}</Alert>
      <p><small>Group select korle oi group er (Menu te dekhabe ✓) page gulo auto sub-menu hishebe ashbe. Extra sub-menu lagle niche likhun: <code>Label | /link</code> (prottek line e ekta).</small></p>
      {items.map((it, i) => (
        <div className="card menu-card" key={i}>
          <div className="cms-grid">
            <input aria-label="Label" placeholder="Label" value={it.label} onChange={(e) => upd(i, 'label', e.target.value)} />
            <input aria-label="Link" placeholder={it.group ? 'Link (optional, group hole auto)' : '/path'} value={it.href} onChange={(e) => upd(i, 'href', e.target.value)} />
            <select aria-label="Page group" value={it.group} onChange={(e) => upd(i, 'group', e.target.value)}>
              <option value="">— Group nei —</option>{groups.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
            <div className="full"><textarea rows={Math.min(8, Math.max(2, it.text.split('\n').length))} aria-label="Extra sub menu" placeholder="Extra sub-menu: Label | /link" value={it.text} onChange={(e) => upd(i, 'text', e.target.value)} /></div>
          </div>
          <div className="row-actions" style={{ marginTop: 10 }}>
            <label className="cms-check"><input type="checkbox" checked={it.visible} onChange={(e) => upd(i, 'visible', e.target.checked)} /> Dekhabe</label>
            <button className="btn btn-sm btn-outline" disabled={i === 0} onClick={() => move(i, -1)} aria-label="Upore">▲</button>
            <button className="btn btn-sm btn-outline" disabled={i === items.length - 1} onClick={() => move(i, 1)} aria-label="Niche">▼</button>
            <button className="btn btn-sm btn-del" onClick={() => confirm(`"${it.label}" menu theke soriye dibe?`) && setItems(items.filter((_, n) => n !== i))}>Remove</button>
          </div>
        </div>
      ))}
      <div className="row-actions">
        <button className="btn btn-outline" disabled={items.length >= 12} onClick={() => setItems([...items, { label: '', href: '/', group: '', visible: true, text: '' }])}>+ Add menu item</button>
        <button className="btn btn-primary btn-lg" disabled={busy} onClick={save}>{busy ? 'Saving…' : 'Save menu'}</button>
      </div>
    </div>
  );
}
