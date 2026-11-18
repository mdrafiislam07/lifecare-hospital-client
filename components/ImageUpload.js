'use client';
import { useState } from 'react';
import { uploadImage } from '@/lib/api';
import { cld } from '@/lib/img';

// Chobi select korlei Cloudinary te upload hoy. onChange({url, publicId}) | onChange(null)
export default function ImageUpload({ folder, token, value, onChange, label = 'Image' }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const pick = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setErr('');
    if (!/^image\/(jpeg|png|webp|avif)$/.test(file.type)) return setErr('Shudhu JPG, PNG, WEBP ba AVIF');
    if (file.size > 5 * 1024 * 1024) return setErr('Chobi 5MB er choto hote hobe');
    setBusy(true);
    try { const r = await uploadImage(file, folder, token); onChange({ url: r.url, publicId: r.publicId }); }
    catch (x) { setErr(x.message); } finally { setBusy(false); }
  };

  return (
    <div className="field full">
      <span>{label}</span>
      <div className="upload-box">
        {value?.url && <img src={cld(value.url, 'w_168,h_168,c_fill')} alt="Preview" />}
        <input type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={pick} disabled={busy} aria-label={label} />
        {busy && <small>Uploading to Cloudinary…</small>}
        {value?.url && !busy && <button type="button" className="btn btn-outline btn-sm" onClick={() => onChange(null)}>Remove</button>}
      </div>
      {err && <small style={{ color: '#8a1f14' }}>{err}</small>}
    </div>
  );
}
