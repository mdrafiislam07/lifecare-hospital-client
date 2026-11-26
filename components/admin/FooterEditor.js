'use client';
import { useEffect, useRef, useState } from 'react';
import { api } from '@/lib/api';
import { Alert, Field } from '@/components/Ui';

const DEFAULT_LINKS = [
  { label: 'Doctor', href: '/doctors' }, { label: 'Emergency', href: '/services/emergency' },
  { label: 'Privacy', href: '/admission/privacy' }, { label: 'Admission time', href: '/admission/admission-time' },
  { label: 'Media Center', href: '/news' }, { label: 'Career', href: '/contact' }
];
const MAX_ABOUT = 800;
const validHref = (h) => /^(\/|https?:\/\/)/i.test(h.trim());
const toRows = (arr) => arr.map((l) => ({ label: l.label, href: l.href }));

export default function FooterEditor({ token }) {
  const [links, setLinks] = useState(null);
  const [about, setAbout] = useState('');
  const [color, setColor] = useState('#2563eb');
  const [err, setErr] = useState(''); const [ok, setOk] = useState(''); const [busy, setBusy] = useState(false);
  const [dirty, setDirty] = useState(false);
  const msgRef = useRef(null);

  useEffect(() => {
    // /settings/admin = cache nei, shobsomoy latest data
    api('/settings/admin', { token }).then((d) => {
      const it = d.item || {};
      setLinks(it.footerLinks?.length ? toRows(it.footerLinks) : DEFAULT_LINKS);
      setAbout(it.footerAbout || '');
      setColor(it.themeColor || '#2563eb');
    }).catch((e) => setErr(e.message));
  }, [token]);

  const touch = (fn) => { setDirty(true); setOk(''); fn(); };
  const upd = (i, k, v) => touch(() => setLinks(links.map((l, x) => (x === i ? { ...l, [k]: v } : l))));
  const move = (i, d) => {
    const j = i + d; if (j < 0 || j >= links.length) return;
    touch(() => { const a = [...links]; [a[i], a[j]] = [a[j], a[i]]; setLinks(a); });
  };
  const show = (type, text) => {                       // message Save button er thik pashei dekhabe + scroll
    if (type === 'err') { setErr(text); setOk(''); } else { setOk(text); setErr(''); }
    setTimeout(() => msgRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 50);
  };

  const save = async (e) => {
    e.preventDefault(); setErr(''); setOk('');
    if (about.length > MAX_ABOUT) return show('err', `About text onek boro (${about.length}/${MAX_ABOUT} character). Choto korun.`);
    const clean = links.map((l) => ({ label: l.label.trim(), href: l.href.trim() })).filter((l) => l.label || l.href);
    const bad = clean.findIndex((l) => !l.label || !l.href || !validHref(l.href));
    if (bad !== -1) return show('err', `Link #${bad + 1}: label ar link duto-i lagbe, ar link "/" ba "https://" diye shuru hote hobe (e.g. /contact)`);
    setBusy(true);
    try {
      const d = await api('/settings', { method: 'PUT', token, body: { footerAbout: about.trim(), footerLinks: clean, themeColor: color } });
      const saved = d.item?.footerLinks || [];
      setLinks(saved.length ? toRows(saved) : DEFAULT_LINKS);
      setAbout(d.item?.footerAbout ?? about.trim());
      setDirty(false);
      show('ok', '✓ Database e save hoyeche. Public site e 1 minute er moddhe update hobe (page refresh korun).');
    } catch (x) { show('err', `Save hoyni: ${x.message}`); } finally { setBusy(false); }
  };

  if (!links) return <><Alert>{err}</Alert><p className="muted">Loading…</p></>;
  return (
    <form className="card form-grid one" onSubmit={save}>
      <h3>Footer – About Us</h3>
      <Field label="Footer about text" hint={`Footer er "About Us" e ei lekha dekhabe. Khali rakhle default text dekhabe. (${about.length}/${MAX_ABOUT})`}>
        <textarea rows={5} maxLength={MAX_ABOUT} value={about} onChange={(e) => touch(() => setAbout(e.target.value))} />
      </Field>

      <h3>Footer – Useful Links</h3>
      {links.map((l, i) => (
        <div className="admin-row" key={i} style={{ flexWrap: 'wrap' }}>
          <input style={{ flex: '1 1 160px', minWidth: 0 }} aria-label="Label" placeholder="Label" value={l.label} onChange={(e) => upd(i, 'label', e.target.value)} />
          <input style={{ flex: '2 1 200px', minWidth: 0 }} aria-label="Link" placeholder="/doctors ba https://…" value={l.href} onChange={(e) => upd(i, 'href', e.target.value)} />
          <div style={{ display: 'flex', gap: 8, flex: 'none' }}>
            <button type="button" className="btn btn-sm btn-outline" onClick={() => move(i, -1)} aria-label="Up">↑</button>
            <button type="button" className="btn btn-sm btn-outline" onClick={() => move(i, 1)} aria-label="Down">↓</button>
            <button type="button" className="btn btn-sm btn-del" style={{ whiteSpace: 'nowrap', flex: 'none' }} onClick={() => touch(() => setLinks(links.filter((_, x) => x !== i)))}>Delete</button>
          </div>
        </div>
      ))}
      <button type="button" className="btn btn-outline" onClick={() => touch(() => setLinks([...links, { label: '', href: '/' }]))}>+ Add link</button>
      <Field label="Mobile browser bar color" hint="Shudhu PHONE er browser er upor-er bar er rang bodlay. Computer e kono poriborton dekha jabe na.">
        <input type="color" value={color} onChange={(e) => touch(() => setColor(e.target.value))} />
      </Field>
      <div ref={msgRef}><Alert>{err}</Alert><Alert type="ok">{ok}</Alert></div>
      <button className="btn btn-primary btn-lg" disabled={busy}>{busy ? 'Saving…' : dirty ? 'Save (unsaved changes)' : 'Save'}</button>
    </form>
  );
}