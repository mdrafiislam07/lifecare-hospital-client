'use client';
import { useEffect, useState, useCallback } from 'react';
import { api } from '@/lib/api';
import ImageUpload from '@/components/ImageUpload';
import { Alert } from '@/components/Ui';

// Admin > Banners: prottek page (About / Services / Admission / custom) er jonno banner upload, replace, remove
export default function BannerManager({ token }) {
  const [items, setItems] = useState(null);
  const [err, setErr] = useState('');
  const [ok, setOk] = useState('');
  const [busy, setBusy] = useState('');

  const load = useCallback(async () => {
    try { setItems((await api('/pages', { token })).items); }
    catch (e) { setErr(e.message); }
  }, [token]);
  useEffect(() => { load(); }, [load]);

  const save = async (p, img) => {
    setErr(''); setOk(''); setBusy(p._id);
    try {
      await api(`/pages/${p._id}`, { method: 'PUT', token, body: { banner: img?.url || '', bannerPublicId: img?.publicId || '' } });
      setOk(img ? `"${p.title}" banner save hoyeche` : `"${p.title}" banner remove hoyeche`);
      await load();
    } catch (e) { setErr(e.message); } finally { setBusy(''); }
  };

  if (!items) return <><Alert>{err}</Alert><p>Loading…</p></>;

  const groups = items.reduce((m, p) => { (m[p.group] ||= []).push(p); return m; }, {});

  return (
    <div>
      <Alert>{err}</Alert><Alert type="ok">{ok}</Alert>
      <p className="muted">Prottek page er jonno ekta wide banner chobi din (proshonsho: 1920×600 px, 5MB er choto). Banner dile page er upore full-width dekhabe; na dile default blue header dekhabe.</p>
      {Object.entries(groups).map(([g, pages]) => (
        <section key={g}>
          <h3 className="cms-group-title">{g.replace(/-/g, ' ')}</h3>
          {pages.map((p) => (
            <div className="card cms-sec" key={p._id}>
              <h3>{p.title}</h3>
              <ImageUpload
                folder="banners"
                token={token}
                label="Banner image"
                value={p.banner ? { url: p.banner, publicId: p.bannerPublicId } : null}
                onChange={(img) => save(p, img)}
              />
              {busy === p._id && <small>Saving…</small>}
            </div>
          ))}
        </section>
      ))}
    </div>
  );
}