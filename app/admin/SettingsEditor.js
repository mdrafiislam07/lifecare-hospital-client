'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Alert, Field } from '@/components/Ui';
import ImageUpload from '@/components/ImageUpload';
import '@/styles/cms.css';

const ICONS = ['calendar', 'steth', 'clipboard', 'ambulance', 'phone', 'ribbon', 'brain', 'lungs', 'baby', 'bone', 'thumb', 'check', 'clock', 'quote'];
const lines = (t) => String(t || '').split('\n').map((x) => x.trim()).filter(Boolean);

export default function SettingsEditor({ token }) {
  const [f, setF] = useState(null);
  const [logo, setLogo] = useState(null);
  const [hero, setHero] = useState(null);
  const [err, setErr] = useState(''); const [ok, setOk] = useState(''); const [busy, setBusy] = useState(false);

  useEffect(() => {
    api('/settings').then((r) => {
      const s = r.item;
      setF({ ...s, contactsText: (s.contacts || []).join('\n'), chipsText: (s.brandChips || []).join('\n'),
        quickTiles: [0, 1, 2, 3].map((i) => s.quickTiles?.[i] || { label: '', href: '', icon: 'steth' }) });
      setLogo(s.logo ? { url: s.logo, publicId: s.logoPublicId } : null);
      setHero(s.heroImage ? { url: s.heroImage, publicId: s.heroImagePublicId } : null);
    }).catch((e) => setErr(e.message));
  }, []);

  if (!f) return <><Alert>{err}</Alert><p>Loading…</p></>;
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const setIn = (k, sub) => (e) => setF({ ...f, [k]: { ...f[k], [sub]: e.target.value } });
  const setTile = (i, k, v) => setF({ ...f, quickTiles: f.quickTiles.map((t, x) => (x === i ? { ...t, [k]: v } : t)) });

  const save = async (e) => {
    e.preventDefault(); setErr(''); setOk(''); setBusy(true);
    try {
      const num = (v) => Number(v) || 0;
      const body = {
        siteName: f.siteName, logo: logo?.url || '', logoPublicId: logo?.publicId || '',
        hotline: f.hotline || '', emergency: f.emergency || '', contacts: lines(f.contactsText),
        email: f.email || '', address: f.address || '',
        facebook: f.facebook || '', linkedin: f.linkedin || '', youtube: f.youtube || '', mapLink: f.mapLink || '',
        heroHeading: f.heroHeading || '', heroLead: f.heroLead || '', brandsLabel: f.brandsLabel || '', brandChips: lines(f.chipsText),
        heroImage: hero?.url || '', heroImagePublicId: hero?.publicId || '',
        quickTiles: f.quickTiles.filter((t) => t.label.trim() && t.href.trim()),
        stats: { beds: num(f.stats?.beds), opdRooms: num(f.stats?.opdRooms), operationTheatres: num(f.stats?.operationTheatres), sqft: num(f.stats?.sqft) },
        aboutBadge: { big: f.aboutBadge?.big || '', sub: f.aboutBadge?.sub || '' },
        footerAbout: f.footerAbout || ''
      };
      await api('/settings', { method: 'PUT', token, body });
      setOk('Settings save hoyeche. Site e ~1 minute er moddhe (ba sathe sathe) update hobe.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e2) { setErr(e2.message); window.scrollTo({ top: 0, behavior: 'smooth' }); }
    setBusy(false);
  };

  return (
    <form className="cms-form" onSubmit={save}>
      <Alert>{err}</Alert><Alert type="ok">{ok}</Alert>

      <section className="card cms-sec"><h3>Hospital & Logo</h3>
        <div className="cms-grid">
          <Field label="Hospital name *"><input required value={f.siteName || ''} onChange={set('siteName')} /></Field>
          <ImageUpload folder="settings" token={token} value={logo} onChange={setLogo} label="Logo (Cloudinary)" />
        </div>
      </section>

      <section className="card cms-sec"><h3>Contact</h3>
        <div className="cms-grid">
          <Field label="Hotline"><input value={f.hotline || ''} onChange={set('hotline')} inputMode="tel" /></Field>
          <Field label="Emergency number"><input value={f.emergency || ''} onChange={set('emergency')} inputMode="tel" placeholder="+880 1608-100008" /></Field>
          <Field label="Email"><input type="email" value={f.email || ''} onChange={set('email')} /></Field>
          <Field label="New College Road, Kachari Para, Jamalpur-2000." hint="Google Maps > Share > Copy link"><input value={f.mapLink || ''} onChange={set('mapLink')} placeholder="https://maps.app.goo.gl/TkPmYrbpoHL79Z1cA" /></Field>
          <div className="full"><Field label="Address"><input value={f.address || ''} onChange={set('address')} /></Field></div>
          <div className="full"><Field label="Contact numbers" hint="Prottek line e ekta number"><textarea rows={3} value={f.contactsText} onChange={set('contactsText')} /></Field></div>
        </div>
      </section>

      <section className="card cms-sec"><h3>Social links</h3>
        <div className="cms-grid">
          <Field label="Facebook"><input value={f.facebook || ''} onChange={set('facebook')} placeholder="https://facebook.com/…" /></Field>
          <Field label="LinkedIn"><input value={f.linkedin || ''} onChange={set('linkedin')} placeholder="https://linkedin.com/…" /></Field>
          <Field label="YouTube"><input value={f.youtube || ''} onChange={set('youtube')} placeholder="https://youtube.com/…" /></Field>
        </div>
      </section>

      <section className="card cms-sec"><h3>Home hero</h3>
        <div className="cms-grid">
          <div className="full"><Field label="Hero heading" hint="Highlight korte [[ ]] er vitore likhun. Jemon: ... [[লাইফ কেয়ার হসপিটাল]] রয়েছে ..."><textarea rows={3} className="bn" value={f.heroHeading || ''} onChange={set('heroHeading')} /></Field></div>
          <div className="full"><Field label="Hero text"><textarea rows={3} value={f.heroLead || ''} onChange={set('heroLead')} /></Field></div>
          <Field label="Brands label"><input value={f.brandsLabel || ''} onChange={set('brandsLabel')} /></Field>
          <Field label="Brand chips" hint="Prottek line e ekta (max 6)"><textarea rows={3} value={f.chipsText} onChange={set('chipsText')} /></Field>
          <div className="full"><ImageUpload folder="settings" token={token} value={hero} onChange={setHero} label="Hero image (Cloudinary) — na dile default artwork" /></div>
        </div>
      </section>

      <section className="card cms-sec"><h3>Quick tiles (4 ta)</h3>
        {f.quickTiles.map((t, i) => (
          <div className="tile-row" key={i}>
            <input aria-label={`Tile ${i + 1} label`} placeholder="Label" value={t.label} onChange={(e) => setTile(i, 'label', e.target.value)} />
            <input aria-label={`Tile ${i + 1} link`} placeholder="/appointment" value={t.href} onChange={(e) => setTile(i, 'href', e.target.value)} />
            <select aria-label={`Tile ${i + 1} icon`} value={t.icon} onChange={(e) => setTile(i, 'icon', e.target.value)}>{ICONS.map((x) => <option key={x}>{x}</option>)}</select>
          </div>
        ))}
        <small>Label ba link khali rakhle ei tile dekhabe na.</small>
      </section>

      <section className="card cms-sec"><h3>Home stats & About badge</h3>
        <div className="cms-grid">
          <Field label="Beds"><input type="number" min="0" value={f.stats?.beds ?? ''} onChange={setIn('stats', 'beds')} /></Field>
          <Field label="OPD rooms"><input type="number" min="0" value={f.stats?.opdRooms ?? ''} onChange={setIn('stats', 'opdRooms')} /></Field>
          <Field label="Operation theatres"><input type="number" min="0" value={f.stats?.operationTheatres ?? ''} onChange={setIn('stats', 'operationTheatres')} /></Field>
          <Field label="Square feet"><input type="number" min="0" value={f.stats?.sqft ?? ''} onChange={setIn('stats', 'sqft')} /></Field>
          <Field label="About badge (boro text)"><input className="bn" value={f.aboutBadge?.big || ''} onChange={setIn('aboutBadge', 'big')} /></Field>
          <Field label="About badge (choto text)"><input value={f.aboutBadge?.sub || ''} onChange={setIn('aboutBadge', 'sub')} /></Field>
        </div>
      </section>

      <section className="card cms-sec"><h3>Footer</h3>
        <Field label="Footer about text"><textarea rows={4} value={f.footerAbout || ''} onChange={set('footerAbout')} /></Field>
      </section>

      <div className="sticky-save"><button className="btn btn-primary btn-lg" disabled={busy}>{busy ? 'Saving…' : 'Save settings'}</button></div>
    </form>
  );
}
