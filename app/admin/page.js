'use client';
import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { api } from '@/lib/api';
import { cld } from '@/lib/img';
import { Alert, Field, PageHero } from '@/components/Ui';
import ImageUpload from '@/components/ImageUpload';
import SettingsEditor from '@/components/admin/SettingsEditor';
import PagesManager from '@/components/admin/PagesManager';
import BannerManager from '@/components/admin/BannerManager';
import PackagesManager from '@/components/admin/PackagesManager';
import MenuEditor from '@/components/admin/MenuEditor';
import FooterEditor from '@/components/admin/FooterEditor';

const TABS = ['Overview', 'Appointments', 'Ambulance', 'Messages', 'Doctors', 'News', 'Media', 'Packages', 'Settings', 'Pages', 'Banners', 'Menu', 'Footer'];
const SELF_LOADING = ['Settings', 'Pages', 'Banners', 'Packages', 'Menu', 'Footer'];   // ei tab gulo nijer data nije load kore
const DAYS = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const PLACEMENTS = [['gallery', 'Gallery'], ['about', 'Home – About section'], ['technology', 'Home – Technology section'], ['news', 'Home – News section']];
const blank = { days: [], placement: 'gallery' };
const lines = (t) => String(t || '').split('\n').map((x) => x.trim()).filter(Boolean);

export default function Admin() {
  const { user, token, ready } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState('Overview');
  const [data, setData] = useState(null);
  const [err, setErr] = useState(''); const [ok, setOk] = useState('');
  const [form, setForm] = useState(blank);
  const [img, setImg] = useState(null);
  const [mediaKind, setMediaKind] = useState('video');
  const reqId = useRef(0);

  useEffect(() => { if (ready && (!user || user.role !== 'admin')) router.replace('/login'); }, [ready, user, router]);

  const load = useCallback(async () => {
    if (!token) return;
    const id = ++reqId.current;
    const put = (v) => { if (id === reqId.current) setData(v); };   // late/stale response ignore
    setErr(''); setData(null);
    if (SELF_LOADING.includes(tab)) return;
    try {
      if (tab === 'Overview') put((await api('/admin/stats', { token })).stats);
      if (tab === 'Appointments') put((await api('/appointments?limit=50', { token })).items);
      if (tab === 'Ambulance') put((await api('/ambulance', { token })).items);
      if (tab === 'Messages') put((await api('/messages', { token })).items);
      if (tab === 'Doctors') put((await api('/doctors?limit=50')).items);
      if (tab === 'News') put((await api('/news?limit=30')).items);
      if (tab === 'Media') put((await api('/media?limit=60')).items);
    } catch (e) { if (id === reqId.current) setErr(e.message); }
  }, [tab, token]);
  useEffect(() => { load(); }, [load]);

  const switchTab = (t) => { setData(null); setTab(t); setOk(''); setForm(blank); setImg(null); };
  const act = async (fn, msg) => { setErr(''); setOk(''); try { await fn(); if (msg) setOk(msg); setForm(blank); setImg(null); load(); } catch (e) { setErr(e.message); } };
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const toggleDay = (d) => setForm({ ...form, days: form.days.includes(d) ? form.days.filter((x) => x !== d) : [...form.days, d] });
  const del = (path, name) => { if (confirm(`"${name}" delete korben? Cloudinary theke-o chobi muchhe jabe.`)) act(() => api(path, { method: 'DELETE', token }), 'Delete hoyeche'); };

  const addDoctor = (e) => { e.preventDefault(); act(() => api('/doctors', { method: 'POST', token, body: {
    name: form.name, nameBn: form.nameBn || undefined, department: form.department, designation: form.designation || undefined,
    degrees: form.degrees || undefined, experience: form.experience || undefined, about: form.about || undefined,
    specialties: lines(form.specialties).length ? lines(form.specialties) : undefined, fee: Number(form.fee) || 800, days: form.days, startTime: form.startTime || '09:00', endTime: form.endTime || '17:00',
    photo: img?.url, photoPublicId: img?.publicId } }), 'Doctor add hoyeche'); };

  const addNews = (e) => { e.preventDefault(); act(() => api('/news', { method: 'POST', token, body: {
    title: form.title, excerpt: form.excerpt, content: form.content || undefined, youtubeUrl: form.youtubeUrl || undefined,
    image: img?.url, imagePublicId: img?.publicId } }), 'News publish hoyeche'); };

  const addMedia = (e) => { e.preventDefault();
    if (mediaKind === 'image' && !img) return setErr('Age chobi upload korun');
    act(() => api('/media', { method: 'POST', token, body: mediaKind === 'image'
      ? { type: 'image', title: form.title, description: form.description || undefined, placement: 'gallery', url: img.url, publicId: img.publicId }
      : { type: 'video', title: form.title, description: form.description || undefined, placement: form.placement, youtubeUrl: form.youtubeUrl } }), 'Media Added'); };

  if (!user || user.role !== 'admin') return null;
  return (
    <>
      <PageHero title="Admin Dashboard" text={`Logged in: ${user.email}`} />
      <section className="container section">
        <div className="chips" role="tablist">{TABS.map((t) => <button key={t} role="tab" aria-selected={tab === t} className={`chip-btn ${tab === t ? 'on' : ''}`} onClick={() => switchTab(t)}>{t}</button>)}</div>
        <Alert>{err}</Alert><Alert type="ok">{ok}</Alert>

        {tab === 'Settings' && <SettingsEditor token={token} />}
        {tab === 'Pages' && <PagesManager token={token} />}
        {tab === 'Banners' && <BannerManager token={token} />}
        {tab === 'Packages' && <PackagesManager token={token} />}
        {tab === 'Menu' && <MenuEditor token={token} />}
        {tab === 'Footer' && <FooterEditor token={token} />}

        {tab === 'Overview' && data && !Array.isArray(data) && (
          <div className="stat-grid">
            {[['Doctors', data.doctors], ['Patients', data.patients], ['Appointments', data.appointments], ['Today', data.todayAppts], ['Pending', data.pending], ['New ambulance', data.ambulance], ['Unread msgs', data.unread]].map(([l, n]) => <div className="card stat" key={l}><b>{n}</b><span>{l}</span></div>)}
          </div>
        )}

        {tab === 'Appointments' && Array.isArray(data) && (
          <div className="table-wrap"><table className="table"><thead><tr><th>Serial</th><th>Patient</th><th>Doctor</th><th>Date / time</th><th>Status</th></tr></thead><tbody>
            {data.map((a) => <tr key={a._id}><td data-l="Serial">{a.serial}</td><td data-l="Patient">{a.patientName}<small>{a.phone}</small></td><td data-l="Doctor">{a.doctor?.name}</td><td data-l="Date">{a.date} {a.timeSlot}</td>
              <td data-l="Status"><select value={a.status} onChange={(e) => act(() => api(`/appointments/${a._id}/status`, { method: 'PATCH', token, body: { status: e.target.value } }))}>
                {['pending', 'confirmed', 'completed', 'cancelled'].map((s) => <option key={s}>{s}</option>)}</select></td></tr>)}
          </tbody></table></div>
        )}

        {tab === 'Ambulance' && Array.isArray(data) && (
          <div className="table-wrap"><table className="table"><thead><tr><th>Name</th><th>Phone</th><th>Pickup</th><th>Type</th><th>Status</th></tr></thead><tbody>
            {data.map((a) => <tr key={a._id}><td data-l="Name">{a.name}</td><td data-l="Phone"><a href={`tel:${a.phone}`}>{a.phone}</a></td><td data-l="Pickup">{a.pickupAddress}</td><td data-l="Type">{a.type}</td>
              <td data-l="Status"><select value={a.status} onChange={(e) => act(() => api(`/ambulance/${a._id}`, { method: 'PATCH', token, body: { status: e.target.value } }))}>
                {['new', 'dispatched', 'completed', 'cancelled'].map((s) => <option key={s}>{s}</option>)}</select></td></tr>)}
          </tbody></table></div>
        )}

        {tab === 'Messages' && Array.isArray(data) && (
          <div className="msg-list">{data.map((m) => (
            <article className="card" key={m._id}>
              <b>{m.name}</b> <span className="badge">{m.type}</span> <small>{m.phone || m.email}</small>
              <p className="bn">{m.message}</p>
              {m.type === 'feedback' && !m.approved && <button className="btn btn-primary btn-sm" onClick={() => act(() => api(`/messages/${m._id}/approve`, { method: 'PATCH', token }))}>Approve & show on site</button>}
            </article>))}</div>
        )}

        {tab === 'Doctors' && (
          <>
            <form className="card form-grid" onSubmit={addDoctor}>
              <ImageUpload folder="doctors" token={token} value={img} onChange={setImg} label="Doctor photo (Cloudinary)" />
              <Field label="Name *"><input required value={form.name || ''} onChange={set('name')} /></Field>
              <Field label="Name (Bangla)"><input value={form.nameBn || ''} onChange={set('nameBn')} /></Field>
              <Field label="Department *"><input required value={form.department || ''} onChange={set('department')} placeholder="e.g. Cardiology" /></Field>
              <Field label="Designation"><input value={form.designation || ''} onChange={set('designation')} /></Field>
              <Field label="Degrees"><input value={form.degrees || ''} onChange={set('degrees')} /></Field>
              <Field label="Experience" hint="e.g. 23+ years"><input value={form.experience || ''} onChange={set('experience')} /></Field>
              <Field label="Fee (৳)"><input type="number" value={form.fee || ''} onChange={set('fee')} /></Field>
              <Field label="Start"><input type="time" value={form.startTime || '09:00'} onChange={set('startTime')} /></Field>
              <Field label="End"><input type="time" value={form.endTime || '17:00'} onChange={set('endTime')} /></Field>
              <div className="full"><Field label="Specialized in" hint="Prottek line e ekta (doctor profile page e dekhabe)"><textarea rows={4} value={form.specialties || ''} onChange={set('specialties')} placeholder={'Skin & VD Specialist\nSkin Disease'} /></Field></div>
              <div className="full"><Field label="About doctor" hint="Doctor profile page e dekhabe. Paragraph alada korte majhe faka line din"><textarea rows={6} value={form.about || ''} onChange={set('about')} /></Field></div>
              <div className="field full"><span>Visiting days</span><div className="chips">{DAYS.map((d) => <button type="button" key={d} className={`chip-btn ${form.days.includes(d) ? 'on' : ''}`} onClick={() => toggleDay(d)}>{d}</button>)}</div></div>
              <button className="btn btn-primary btn-lg full">Add doctor</button>
            </form>
            {Array.isArray(data) && <div className="admin-list">{data.map((d) => (
              <div className="admin-row" key={d._id}>
                {d.photo ? <img src={cld(d.photo, 'w_112,h_112,c_fill,g_face')} alt="" /> : null}
                <div className="grow"><b>{d.name}</b><small>{d.department} · {d.days?.join(', ')}</small></div>
                <button className="btn btn-sm btn-del" onClick={() => del(`/doctors/${d._id}`, d.name)}>Delete</button>
              </div>))}</div>}
          </>
        )}

        {tab === 'News' && (
          <>
            <form className="card form-grid one" onSubmit={addNews}>
              <ImageUpload folder="news" token={token} value={img} onChange={setImg} label="News image (Cloudinary)" />
              <Field label="Title *"><input required value={form.title || ''} onChange={set('title')} /></Field>
              <Field label="Short text *"><textarea required rows={3} value={form.excerpt || ''} onChange={set('excerpt')} /></Field>
              <Field label="Full content"><textarea rows={5} value={form.content || ''} onChange={set('content')} /></Field>
              <Field label="YouTube video link (optional)" hint="Video dile image er poriborte video dekhabe"><input value={form.youtubeUrl || ''} onChange={set('youtubeUrl')} placeholder="https://www.youtube.com/watch?v=…" /></Field>
              <button className="btn btn-primary btn-lg">Publish</button>
            </form>
            {Array.isArray(data) && <div className="admin-list">{data.map((n) => (
              <div className="admin-row" key={n._id}>
                {n.image ? <img src={cld(n.image, 'w_112,h_112,c_fill')} alt="" /> : null}
                <div className="grow bn"><b>{n.title}</b>{n.youtubeId && <small>YouTube video</small>}</div>
                <button className="btn btn-sm btn-del" onClick={() => del(`/news/${n._id}`, n.title)}>Delete</button>
              </div>))}</div>}
          </>
        )}

        {tab === 'Media' && (
          <>
            <div className="chips">
              <button className={`chip-btn ${mediaKind === 'video' ? 'on' : ''}`} onClick={() => { setMediaKind('video'); setImg(null); }}>Add YouTube video</button>
              <button className={`chip-btn ${mediaKind === 'image' ? 'on' : ''}`} onClick={() => { setMediaKind('image'); setImg(null); }}>Add gallery photo</button>
            </div>
            <form className="card form-grid" onSubmit={addMedia}>
              {mediaKind === 'image'
                ? <ImageUpload folder="gallery" token={token} value={img} onChange={setImg} label="Photo (Cloudinary)" />
                : <>
                  <Field label="YouTube link *" hint="Browser theke video er link copy kore boshan"><input required value={form.youtubeUrl || ''} onChange={set('youtubeUrl')} placeholder="https://www.youtube.com/watch?v=…  ba  https://youtu.be/…" /></Field>
                  <Field label="Kothay dekhabe">
                    <select value={form.placement} onChange={set('placement')}>{PLACEMENTS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
                  </Field></>}
              <Field label="Title *"><input required value={form.title || ''} onChange={set('title')} /></Field>
              <Field label="Description"><input value={form.description || ''} onChange={set('description')} /></Field>
              <button className="btn btn-primary btn-lg full">{mediaKind === 'image' ? 'Add photo' : 'Add video'}</button>
            </form>
            {Array.isArray(data) && <div className="admin-list">{data.map((m) => (
              <div className="admin-row" key={m._id}>
                {m.type === 'image' ? <img src={cld(m.url, 'w_112,h_112,c_fill')} alt="" /> : <img src={`https://i.ytimg.com/vi/${m.youtubeId}/default.jpg`} alt="" />}
                <div className="grow"><b>{m.title}</b><small>{m.type} · {m.placement}</small></div>
                <button className="btn btn-sm btn-del" onClick={() => del(`/media/${m._id}`, m.title)}>Delete</button>
              </div>))}</div>}
          </>
        )}
      </section>
    </>
  );
}