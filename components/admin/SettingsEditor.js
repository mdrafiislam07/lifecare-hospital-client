'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Alert, Field } from '@/components/Ui';
import ImageUpload from '@/components/ImageUpload';
import { mergeHome, HOME_SECTIONS, BANNER_PAGES } from '@/lib/homeDefaults';
import '@/styles/cms.css';

const ICONS = ['calendar', 'steth', 'clipboard', 'ambulance', 'phone', 'ribbon', 'brain', 'lungs', 'baby', 'bone', 'thumb', 'check', 'clock', 'quote'];
const lines = (t) => String(t || '').split('\n').map((x) => x.trim()).filter(Boolean);
const paras = (t) => String(t || '').split(/\n\s*\n/).map((x) => x.trim()).filter(Boolean);

// Google Maps embed code (<iframe ...>) puro paste korle-o shudhu src="..." ta ber kore nibe
const embedSrc = (v) => {
  const t = String(v || '').trim();
  const m = t.match(/src\s*=\s*["']([^"']+)["']/i);
  return (m ? m[1] : t).replace(/&amp;/g, '&');
};

const blankDept = { name: '', icon: 'steth', dept: '', image: '', imagePublicId: '' };
const blankWhy = { icon: 'steth', title: '', text: '' };
const blankTech = { title: '', text: '' };

export default function SettingsEditor({ token }) {
  const [f, setF] = useState(null);
  const [logo, setLogo] = useState(null);
  const [hero, setHero] = useState(null);
  const [aboutImg, setAboutImg] = useState(null);
  const [banners, setBanners] = useState({});
  const [heroBanners, setHeroBanners] = useState([]);   // home slider: [{url, publicId} | null]
  const [err, setErr] = useState(''); const [ok, setOk] = useState(''); const [busy, setBusy] = useState(false);

  useEffect(() => {
    api('/settings/admin', { token }).then((r) => {
      const s = r.item;
      const h = mergeHome(s.home);
      setF({
        ...s,
        contactsText: (s.contacts || []).join('\n'), chipsText: (s.brandChips || []).join('\n'),
        quickTiles: [0, 1, 2, 3].map((i) => s.quickTiles?.[i] || { label: '', href: '', icon: 'steth' }),
        home: h,
        aboutText: h.about.paragraphs.join('\n\n'),
        servicesText: h.services.join('\n'),
        facilitiesText: h.facilities.join('\n')
      });
      setLogo(s.logo ? { url: s.logo, publicId: s.logoPublicId } : null);
      setHero(s.heroImage ? { url: s.heroImage, publicId: s.heroImagePublicId } : null);
      setAboutImg(s.aboutImage ? { url: s.aboutImage, publicId: s.aboutImagePublicId || '' } : null);
      setHeroBanners((s.heroBanners || []).filter((b) => b?.url).map((b) => ({ url: b.url, publicId: b.publicId || '' })));
      setBanners(Object.fromEntries(BANNER_PAGES.map(([k]) => [k, s.banners?.[k]?.url ? { url: s.banners[k].url, publicId: s.banners[k].publicId } : null])));
    }).catch((e) => setErr(e.message));
  }, [token]);

  if (!f) return <><Alert>{err}</Alert><p>Loading…</p></>;

  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const setIn = (k, sub) => (e) => setF({ ...f, [k]: { ...f[k], [sub]: e.target.value } });
  const setTile = (i, k, v) => setF({ ...f, quickTiles: f.quickTiles.map((t, x) => (x === i ? { ...t, [k]: v } : t)) });

  // ---- hero slider banner helpers ----
  const hbSet = (i, img) => setHeroBanners(img ? heroBanners.map((b, x) => (x === i ? img : b)) : heroBanners.filter((_, x) => x !== i));
  const hbMove = (i, d) => { const j = i + d; if (j < 0 || j >= heroBanners.length) return; const a = [...heroBanners]; [a[i], a[j]] = [a[j], a[i]]; setHeroBanners(a); };

  // ---- home helpers ----
  const setH = (k, v) => setF({ ...f, home: { ...f.home, [k]: v } });
  const hIn = (k) => (e) => setH(k, e.target.value);
  const rowSet = (k, i, key, v) => setH(k, f.home[k].map((r, x) => (x === i ? { ...r, [key]: v } : r)));
  const rowAdd = (k, blank) => setH(k, [...f.home[k], { ...blank }]);
  const rowDel = (k, i) => setH(k, f.home[k].filter((_, x) => x !== i));
  // ---- service cards (photo shoho) ----
  const cards = f.home.serviceCards || [];
  const cardSet = (i, patch) => setH('serviceCards', cards.map((c, x) => (x === i ? { ...c, ...patch } : c)));
  const cardMove = (i, d) => { const j = i + d; if (j < 0 || j >= cards.length) return; const a = [...cards]; [a[i], a[j]] = [a[j], a[i]]; setH('serviceCards', a); };
  const importServices = async () => {
    setErr(''); setOk('');
    try {
      const r = await api('/menu');
      const g = (r.items || []).find((m) => m.group === 'services' || /^services$/i.test(m.label || ''));
      const list = (g?.children || []).filter((c) => c.label && c.href).map((c) => ({ title: c.label, href: c.href, image: '', imagePublicId: '' }));
      if (!list.length) return setErr('Services menu te kono page pawa jayni');
      const have = new Set(cards.map((c) => c.href));
      setH('serviceCards', [...cards, ...list.filter((c) => !have.has(c.href))].slice(0, 24));
      setOk('Services menu theke import hoyeche. Ekhon prottek card e photo upload kore niche "Save settings" chapun.');
    } catch (e) { setErr(e.message); }
  };

  const toggleHidden = (key) => setH('hidden', f.home.hidden.includes(key) ? f.home.hidden.filter((x) => x !== key) : [...f.home.hidden, key]);

  const save = async (e) => {
    e.preventDefault(); setErr(''); setOk('');

    // Footer map: embed link thik format e ache kina age-i check
    const mapEmbed = embedSrc(f.mapEmbed);
    if (mapEmbed && !/^https:\/\/www\.google\.com\/maps\/embed/i.test(mapEmbed)) {
      setErr('"Footer map (embed link)" thik na. maps.app.goo.gl ba share link ekhane cholbe na. Google Maps > Share > "Embed a map" tab > "COPY HTML" kore oi puro code ekhane paste korun. (Share link ta uporer "Google Map link" field e dite parben.)');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setBusy(true);
    try {
      const num = (v) => Number(v) || 0;
      const H = f.home;
      const body = {
        siteName: f.siteName, logo: logo?.url || '', logoPublicId: logo?.publicId || '',
        hotline: f.hotline || '', emergency: f.emergency || '', contacts: lines(f.contactsText),
        email: f.email || '', address: f.address || '',
        facebook: f.facebook || '', linkedin: f.linkedin || '', youtube: f.youtube || '', mapLink: f.mapLink || '', mapEmbed,
        heroHeading: f.heroHeading || '', heroLead: f.heroLead || '', brandsLabel: f.brandsLabel || '', brandChips: lines(f.chipsText),
        heroImage: hero?.url || '', heroImagePublicId: hero?.publicId || '',
        aboutImage: aboutImg?.url || '', aboutImagePublicId: aboutImg?.publicId || '',
        aboutLink: (f.aboutLink || '').trim(),
        quickTiles: f.quickTiles.filter((t) => t.label.trim() && t.href.trim()),
        stats: { beds: num(f.stats?.beds), opdRooms: num(f.stats?.opdRooms), operationTheatres: num(f.stats?.operationTheatres), sqft: num(f.stats?.sqft) },
        aboutBadge: { big: f.aboutBadge?.big || '', sub: f.aboutBadge?.sub || '' },
        home: {
          hidden: H.hidden,
          about: { title: H.about.title || '', paragraphs: paras(f.aboutText) },
          doctorsTitle: H.doctorsTitle || '', feedbackTitle: H.feedbackTitle || '', feedbackTagline: H.feedbackTagline || '',
          departmentsTitle: H.departmentsTitle || '',
          departments: H.departments.filter((d) => d.name.trim()).map((d) => ({ name: d.name.trim(), icon: d.icon, dept: (d.dept || '').trim(), image: d.image || '', imagePublicId: d.imagePublicId || '' })),
          servicesTitle: H.servicesTitle || '', servicesSub: H.servicesSub || '', services: lines(f.servicesText),
          serviceCards: (H.serviceCards || []).filter((c) => c.title.trim() && c.href.trim()).map((c) => ({ title: c.title.trim(), href: c.href.trim(), image: c.image || '', imagePublicId: c.imagePublicId || '' })),
          whyTitle: H.whyTitle || '', whySub: H.whySub || '',
          why: H.why.filter((w) => w.title.trim()).map((w) => ({ icon: w.icon, title: w.title.trim(), text: (w.text || '').trim() })),
          facilitiesTitle: H.facilitiesTitle || '', facilities: lines(f.facilitiesText),
          techTitle: H.techTitle || '', techText: H.techText || '',
          tech: H.tech.filter((t) => t.title.trim()).map((t) => ({ title: t.title.trim(), text: (t.text || '').trim() })),
          newsTitle: H.newsTitle || ''
        },
        banners: Object.fromEntries(BANNER_PAGES.map(([k]) => [k, { url: banners[k]?.url || '', publicId: banners[k]?.publicId || '' }])),
        heroBanners: heroBanners.filter((b) => b?.url).map((b) => ({ url: b.url, publicId: b.publicId || '' }))
      };
      const res = await api('/settings', { method: 'PUT', token, body });
      setF((cur) => ({ ...cur, mapEmbed: res.item?.mapEmbed ?? mapEmbed }));   // iframe paste korle clean src dekhabe
      setOk('Settings save hoyeche. Site e ~1 minute er moddhe (ba sathe sathe) update hobe.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e2) { setErr(e2.message); window.scrollTo({ top: 0, behavior: 'smooth' }); }
    setBusy(false);
  };

  const iconSelect = (value, onChange, label) => (
    <select aria-label={label} value={value} onChange={(e) => onChange(e.target.value)}>{ICONS.map((x) => <option key={x}>{x}</option>)}</select>
  );

  return (
    <form className="cms-form" onSubmit={save}>
      <Alert>{err}</Alert><Alert type="ok">{ok}</Alert>

      <section className="card cms-sec"><h3>Hospital & Logo</h3>
        <div className="cms-grid">
          <Field label="Hospital name *"><input required value={f.siteName || ''} onChange={set('siteName')} /></Field>
          <ImageUpload folder="settings" token={token} value={logo} onChange={setLogo} label="Logo (Cloudinary)" />
        </div>
      </section>

      <section className="card cms-sec"><h3>Contact (header, footer, home)</h3>
        <div className="cms-grid">
          <Field label="Hotline"><input value={f.hotline || ''} onChange={set('hotline')} inputMode="tel" /></Field>
          <Field label="Emergency number"><input value={f.emergency || ''} onChange={set('emergency')} inputMode="tel" placeholder="+880 1608-100008" /></Field>
          <Field label="Email"><input type="email" value={f.email || ''} onChange={set('email')} /></Field>
          <Field label="Google Map link" hint='Footer e map er niche "Open in Google Maps" link hishebe dekhabe. Google Maps > Share > Copy link'><input value={f.mapLink || ''} onChange={set('mapLink')} placeholder="https://maps.google.com/…" /></Field>
          <div className="full"><Field label="Footer map (embed link)" hint='Footer er map ta ei link theke ashe. Google Maps > Share > "Embed a map" tab > COPY HTML, tarpor puro code (<iframe …>) ekhane paste korun. Khali rakhle Address diye map dekhabe.'><input value={f.mapEmbed || ''} onChange={set('mapEmbed')} placeholder='<iframe src="https://www.google.com/maps/embed?pb=…"></iframe>  ba  https://www.google.com/maps/embed?pb=…' /></Field></div>
          <div className="full"><Field label="Address" hint="Footer e dekhay, ar embed link khali thakle map ei address theke ashe"><input value={f.address || ''} onChange={set('address')} /></Field></div>
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

      <section className="card cms-sec"><h3>Home hero banners (slider)</h3>
        <p className="muted">Home page er upore full-width slider. Ekadhik banner din (max 8), ta 5 second por por auto change hobe. Proshonsho: 1920×800 px, 5MB er choto. Kono banner na dile 2 ta demo banner dekhabe. Order bodlate ↑ ↓ use korun, tarpor niche "Save settings" chapun.</p>
        {heroBanners.map((b, i) => (
          <div className="menu-card" key={i}>
            <ImageUpload folder="banners" token={token} label={`Banner ${i + 1}`} value={b} onChange={(img) => hbSet(i, img)} />
            <div className="row-actions">
              <button type="button" className="btn btn-sm btn-outline" disabled={i === 0} onClick={() => hbMove(i, -1)}>↑ Up</button>
              <button type="button" className="btn btn-sm btn-outline" disabled={i === heroBanners.length - 1} onClick={() => hbMove(i, 1)}>↓ Down</button>
              <button type="button" className="btn btn-sm btn-del" onClick={() => setHeroBanners(heroBanners.filter((_, x) => x !== i))}>Remove</button>
            </div>
          </div>
        ))}
        {heroBanners.length < 8 && <button type="button" className="btn btn-sm btn-outline" onClick={() => setHeroBanners([...heroBanners, null])}>+ Add banner</button>}
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
            {iconSelect(t.icon, (v) => setTile(i, 'icon', v), `Tile ${i + 1} icon`)}
          </div>
        ))}
        <small>Label ba link khali rakhle ei tile dekhabe na.</small>
      </section>

      <section className="card cms-sec"><h3>Home sections on / off</h3>
        <p className="muted">Tick kora section home page e dekhabe, tick tule dile hide hobe.</p>
        <div className="cms-grid">
          {HOME_SECTIONS.map(([k, label]) => (
            <label className="cms-check" key={k}>
              <input type="checkbox" checked={!f.home.hidden.includes(k)} onChange={() => toggleHidden(k)} /> {label}
            </label>
          ))}
        </div>
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

      <section className="card cms-sec"><h3>Home: About section</h3>
        <div className="cms-grid">
          <div className="full"><Field label="Heading"><input value={f.home.about.title} onChange={(e) => setH('about', { ...f.home.about, title: e.target.value })} /></Field></div>
          <div className="full"><Field label="Text" hint="Prottek paragraph er majhe ekta faka line rakhun"><textarea rows={10} value={f.aboutText} onChange={set('aboutText')} /></Field></div>
          <div className="full"><ImageUpload folder="settings" token={token} value={aboutImg} onChange={setAboutImg} label="About photo (hospital building)" /></div>
          <div className="full"><Field label="Know More button link" hint="Khali rakhle About menu-r prothom page e jabe. Jemon: /about/overview ba /doctors"><input value={f.aboutLink || ''} onChange={set('aboutLink')} placeholder="/about/overview" /></Field></div>
        </div>
      </section>

      <section className="card cms-sec"><h3>Home: Section titles</h3>
        <div className="cms-grid">
          <div className="full"><Field label="Doctors section title"><input value={f.home.doctorsTitle} onChange={hIn('doctorsTitle')} /></Field></div>
          <div className="full"><Field label="Patient feedback title"><input value={f.home.feedbackTitle} onChange={hIn('feedbackTitle')} /></Field></div>
          <div className="full"><Field label="Feedback card er upore line (prottek card e)"><input className="bn" value={f.home.feedbackTagline} onChange={hIn('feedbackTagline')} /></Field></div>
          <div className="full"><Field label="News section title"><input value={f.home.newsTitle} onChange={hIn('newsTitle')} /></Field></div>
        </div>
      </section>

      <section className="card cms-sec"><h3>Home: Departments</h3>
        <div className="full"><Field label="Section title"><input value={f.home.departmentsTitle} onChange={hIn('departmentsTitle')} /></Field></div>
        {f.home.departments.map((d, i) => (
          <div key={i} className="menu-card">
            <div className="tile-row">
              <input aria-label="Department name" placeholder="Name (e.g. Orthopedic)" value={d.name} onChange={(e) => rowSet('departments', i, 'name', e.target.value)} />
              <input aria-label="Doctor list department" placeholder="Doctors list e kon department (khali = same)" value={d.dept || ''} onChange={(e) => rowSet('departments', i, 'dept', e.target.value)} />
              {iconSelect(d.icon, (v) => rowSet('departments', i, 'icon', v), 'Department icon')}
            </div>
            <ImageUpload folder="settings" token={token} label="Department photo / icon (optional) — dile icon er jayga-y ei chobi dekhabe"
              value={d.image ? { url: d.image, publicId: d.imagePublicId || '' } : null}
              onChange={(img) => setH('departments', f.home.departments.map((r, x) => (x === i ? { ...r, image: img?.url || '', imagePublicId: img?.publicId || '' } : r)))} />
            <div className="row-actions"><button type="button" className="btn btn-sm btn-del" onClick={() => rowDel('departments', i)}>Remove</button></div>
          </div>
        ))}
        {f.home.departments.length < 12 && <button type="button" className="btn btn-sm btn-outline" onClick={() => rowAdd('departments', blankDept)}>+ Add department</button>}
      </section>

      <section className="card cms-sec"><h3>Home: Services</h3>
        <div className="cms-grid">
          <div className="full"><Field label="Section title"><input value={f.home.servicesTitle} onChange={hIn('servicesTitle')} /></Field></div>
          <div className="full"><Field label="Sub text"><textarea rows={2} value={f.home.servicesSub} onChange={hIn('servicesSub')} /></Field></div>
          <div className="full"><Field label="Services list (shudhu card na thakle fallback)" hint="Prottek line e ekta service. Niche Service cards dile ei list dekhabe na"><textarea rows={10} value={f.servicesText} onChange={set('servicesText')} /></Field></div>
        </div>

        <h4 style={{ margin: '18px 0 6px' }}>Service cards (photo shoho)</h4>
        <p className="muted">Home page e photo wala card hishebe dekhabe. Card na dile Services menu-r prothom 8 ta page photo chara dekhabe. "Import" chapun, tarpor prottek card e photo dien (proshonsho 760×580 px).</p>
        {cards.map((c, i) => (
          <div key={i} className="menu-card">
            <div className="tile-row">
              <input aria-label="Service title" placeholder="Title (e.g. ICU)" value={c.title} onChange={(e) => cardSet(i, { title: e.target.value })} />
              <input aria-label="Service link" placeholder="/services/icu" value={c.href} onChange={(e) => cardSet(i, { href: e.target.value })} />
            </div>
            <ImageUpload folder="settings" token={token} label="Photo"
              value={c.image ? { url: c.image, publicId: c.imagePublicId || '' } : null}
              onChange={(img) => cardSet(i, { image: img?.url || '', imagePublicId: img?.publicId || '' })} />
            <div className="row-actions">
              <button type="button" className="btn btn-sm btn-outline" disabled={i === 0} onClick={() => cardMove(i, -1)}>↑ Up</button>
              <button type="button" className="btn btn-sm btn-outline" disabled={i === cards.length - 1} onClick={() => cardMove(i, 1)}>↓ Down</button>
              <button type="button" className="btn btn-sm btn-del" onClick={() => setH('serviceCards', cards.filter((_, x) => x !== i))}>Remove</button>
            </div>
          </div>
        ))}
        <div className="row-actions">
          {cards.length < 24 && <button type="button" className="btn btn-sm btn-outline" onClick={() => setH('serviceCards', [...cards, { title: '', href: '', image: '', imagePublicId: '' }])}>+ Add card</button>}
          <button type="button" className="btn btn-sm btn-outline" onClick={importServices}>Import from Services menu</button>
        </div>
      </section>

      <section className="card cms-sec"><h3>Home: Why choose us</h3>
        <div className="cms-grid">
          <div className="full"><Field label="Section title"><input value={f.home.whyTitle} onChange={hIn('whyTitle')} /></Field></div>
          <div className="full"><Field label="Sub text"><textarea rows={2} value={f.home.whySub} onChange={hIn('whySub')} /></Field></div>
        </div>
        {f.home.why.map((w, i) => (
          <div key={i} className="menu-card">
            <div className="tile-row">
              <input aria-label="Title" placeholder="Title" value={w.title} onChange={(e) => rowSet('why', i, 'title', e.target.value)} />
              {iconSelect(w.icon, (v) => rowSet('why', i, 'icon', v), 'Icon')}
              <button type="button" className="btn btn-sm btn-del" onClick={() => rowDel('why', i)}>Remove</button>
            </div>
            <textarea aria-label="Text" rows={3} placeholder="Description" value={w.text} onChange={(e) => rowSet('why', i, 'text', e.target.value)} />
          </div>
        ))}
        {f.home.why.length < 6 && <button type="button" className="btn btn-sm btn-outline" onClick={() => rowAdd('why', blankWhy)}>+ Add item</button>}
      </section>

      <section className="card cms-sec"><h3>Home: Facilities & Amenities</h3>
        <div className="cms-grid">
          <div className="full"><Field label="Section title"><input value={f.home.facilitiesTitle} onChange={hIn('facilitiesTitle')} /></Field></div>
          <div className="full"><Field label="Facilities list" hint="Prottek line e ekta"><textarea rows={8} value={f.facilitiesText} onChange={set('facilitiesText')} /></Field></div>
        </div>
      </section>

      <section className="card cms-sec"><h3>Home: Technology</h3>
        <div className="cms-grid">
          <div className="full"><Field label="Section title"><input value={f.home.techTitle} onChange={hIn('techTitle')} /></Field></div>
          <div className="full"><Field label="Intro text"><textarea rows={3} value={f.home.techText} onChange={hIn('techText')} /></Field></div>
        </div>
        {f.home.tech.map((t, i) => (
          <div key={i} className="menu-card">
            <div className="tile-row">
              <input aria-label="Title" placeholder="Title (e.g. MRI)" value={t.title} onChange={(e) => rowSet('tech', i, 'title', e.target.value)} />
              <input aria-label="Text" placeholder="Short description" value={t.text} onChange={(e) => rowSet('tech', i, 'text', e.target.value)} />
              <button type="button" className="btn btn-sm btn-del" onClick={() => rowDel('tech', i)}>Remove</button>
            </div>
          </div>
        ))}
        {f.home.tech.length < 12 && <button type="button" className="btn btn-sm btn-outline" onClick={() => rowAdd('tech', blankTech)}>+ Add item</button>}
      </section>

      <section className="card cms-sec"><h3>Page banners</h3>
        <p className="muted">Prottek page er upore full-width banner (proshonsho: 1920×600 px). Banner dile page er upore oi chobi dekhabe, na dile default blue header. About / Services / Admission er banner Banners tab theke.</p>
        <div className="cms-grid">
          {BANNER_PAGES.map(([k, label]) => (
            <ImageUpload key={k} folder="banners" token={token} label={`${label} banner`}
              value={banners[k]} onChange={(img) => setBanners({ ...banners, [k]: img })} />
          ))}
        </div>
      </section>

      <div className="sticky-save"><button className="btn btn-primary btn-lg" disabled={busy}>{busy ? 'Saving…' : 'Save settings'}</button></div>
    </form>
  );
}