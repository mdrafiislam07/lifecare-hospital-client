'use client';
import { useCallback, useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { cld } from '@/lib/img';
import { Alert, Field } from '@/components/Ui';
import ImageUpload from '@/components/ImageUpload';

const F = (k, l, x = {}) => ({ k, l, ...x });
const JOB_TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship'];

const SECTIONS = {
  leadership: {
    label: 'Management Team', path: '/about/team', kind: 'leadership', img: true,
    fields: [F('name', 'Name *', { req: true }), F('designation', 'Designation (e.g. Chairman)'), F('email', 'Email'), F('phone', 'Phone'), F('bio', 'Short bio', { t: 'textarea', full: true })],
    title: (r) => r.name, sub: (r) => r.designation
  },
  staff: {
    label: 'All Staff', path: '/about/team', kind: 'staff', img: true,
    fields: [F('name', 'Name *', { req: true }), F('designation', 'Designation'), F('department', 'Department *', { req: true, list: 'ab-depts' }),
      F('level', 'Level', { t: 'select', opts: [['junior', 'Junior Staff'], ['senior', 'Senior Staff']] })],
    title: (r) => r.name, sub: (r) => `${r.department || '—'} · ${r.level} ${r.designation ? '· ' + r.designation : ''}`
  },
  faq: {
    label: 'FAQ', path: '/about/faq',
    fields: [F('question', 'Question *', { req: true, full: true }), F('answer', 'Answer *', { t: 'textarea', req: true, full: true, rows: 6 })],
    title: (r) => r.question, sub: () => ''
  },
  jobs: {
    label: 'Career / Jobs', path: '/about/jobs',
    fields: [F('title', 'Job title *', { req: true }), F('department', 'Department'),
      F('type', 'Type', { t: 'select', opts: JOB_TYPES.map((x) => [x, x]) }), F('location', 'Location'),
      F('deadline', 'Last date', { t: 'date' }), F('vacancies', 'Vacancies', { t: 'number' }),
      F('applyEmail', 'Apply email'), F('applyPhone', 'Apply phone'),
      F('description', 'Job description', { t: 'textarea', full: true, rows: 5 }), F('requirements', 'Requirements', { t: 'textarea', full: true, rows: 5 })],
    title: (r) => r.title, sub: (r) => `${r.type}${r.deadline ? ' · ' + r.deadline : ''}`
  }
};

const blankOf = (S) => Object.fromEntries(S.fields.map((f) => [f.k, f.t === 'select' ? f.opts[0][0] : f.t === 'number' ? 1 : '']));

export default function AboutManager({ token }) {
  const [sec, setSec] = useState('leadership');
  const S = SECTIONS[sec];
  const [items, setItems] = useState(null);
  const [form, setForm] = useState(() => ({ ...blankOf(SECTIONS.leadership), isActive: true }));
  const [img, setImg] = useState(null);
  const [editId, setEditId] = useState(null);
  const [err, setErr] = useState(''); const [ok, setOk] = useState(''); const [busy, setBusy] = useState(false);

  const q = S.kind ? `?kind=${S.kind}` : '';
  const load = useCallback(async () => {
    setItems(null);
    try { setItems((await api(`${S.path}/admin${q}`, { token })).items); } catch (e) { setErr(e.message); }
  }, [S.path, q, token]);
  useEffect(() => { load(); }, [load]);

  const reset = (key = sec) => { setForm({ ...blankOf(SECTIONS[key]), isActive: true }); setImg(null); setEditId(null); };
  const pick = (key) => { setSec(key); setErr(''); setOk(''); reset(key); };
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const top = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const edit = (row) => {
    const b = blankOf(S);
    setForm({ ...Object.fromEntries(S.fields.map((f) => [f.k, row[f.k] ?? b[f.k]])), isActive: row.isActive !== false });
    setImg(row.photo ? { url: row.photo, publicId: row.photoPublicId } : null);
    setEditId(row._id); setErr(''); setOk(''); top();
  };

  const save = async (e) => {
    e.preventDefault(); setErr(''); setOk(''); setBusy(true);
    try {
      const body = { isActive: form.isActive !== false };
      S.fields.forEach((f) => {
        const v = form[f.k];
        if (v === undefined || v === null) return;
        body[f.k] = f.t === 'number' ? Number(v) || 0 : String(v).trim();
      });
      if (S.kind) body.kind = S.kind;
      if (S.img) { body.photo = img?.url || ''; body.photoPublicId = img?.publicId || ''; }
      if (editId) await api(`${S.path}/${editId}`, { method: 'PUT', token, body });
      else await api(S.path, { method: 'POST', token, body });
      setOk(editId ? 'Update hoyeche' : 'Add hoyeche'); reset(); load(); top();
    } catch (x) { setErr(x.message); top(); }
    setBusy(false);
  };

  const patch = async (row, body) => { setErr(''); try { await api(`${S.path}/${row._id}`, { method: 'PUT', token, body }); load(); } catch (x) { setErr(x.message); } };
  const del = async (row) => {
    if (!confirm(`"${S.title(row)}" delete korben?`)) return;
    setErr(''); try { await api(`${S.path}/${row._id}`, { method: 'DELETE', token }); if (editId === row._id) reset(); setOk('Delete hoyeche'); load(); } catch (x) { setErr(x.message); }
  };
  const move = async (i, dir) => {
    const ids = items.map((r) => r._id), j = i + dir;
    if (j < 0 || j >= ids.length) return;
    [ids[i], ids[j]] = [ids[j], ids[i]];
    setErr(''); try { await api(`${S.path}/reorder`, { method: 'PUT', token, body: { ids } }); load(); } catch (x) { setErr(x.message); }
  };

  const depts = [...new Set((items || []).map((r) => r.department).filter(Boolean))];

  return (
    <>
      <div className="chips" role="tablist">
        {Object.entries(SECTIONS).map(([k, s]) => <button key={k} type="button" role="tab" aria-selected={sec === k} className={`chip-btn ${sec === k ? 'on' : ''}`} onClick={() => pick(k)}>{s.label}</button>)}
      </div>
      <Alert>{err}</Alert><Alert type="ok">{ok}</Alert>

      <form className="card form-grid" onSubmit={save}>
        <h3 className="full">{editId ? `Edit — ${S.label}` : `Add — ${S.label}`}</h3>
        {S.img && <ImageUpload folder={sec === 'staff' ? 'staff' : 'team'} token={token} value={img} onChange={setImg} label="Photo (Cloudinary)" />}
        {S.fields.map((f) => (
          <div className={f.full ? 'full' : ''} key={f.k}>
            <Field label={f.l}>
              {f.t === 'textarea'
                ? <textarea rows={f.rows || 4} required={f.req} value={form[f.k] ?? ''} onChange={set(f.k)} />
                : f.t === 'select'
                  ? <select value={form[f.k] ?? ''} onChange={set(f.k)}>{f.opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
                  : <input type={f.t === 'date' ? 'date' : f.t === 'number' ? 'number' : 'text'} min={f.t === 'number' ? 0 : undefined} required={f.req} list={f.list} value={form[f.k] ?? ''} onChange={set(f.k)} />}
            </Field>
          </div>
        ))}
        {sec === 'staff' && <datalist id="ab-depts">{depts.map((d) => <option key={d} value={d} />)}</datalist>}
        <label className="cms-check full"><input type="checkbox" checked={form.isActive !== false} onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))} /> Site e dekhabe (untick korle hide thakbe)</label>
        <div className="row-actions full">
          <button className="btn btn-primary btn-lg" disabled={busy}>{busy ? 'Saving…' : editId ? 'Update' : 'Add'}</button>
          {editId && <button type="button" className="btn btn-outline btn-lg" onClick={() => reset()}>Cancel</button>}
        </div>
      </form>

      {!items ? <p>Loading…</p> : items.length === 0 ? <p>Ekhono kichu add kora hoyni.</p> : (
        <div className="admin-list">
          {items.map((r, i) => (
            <div className="admin-row" key={r._id} style={{ flexWrap: 'wrap' }}>
              {S.img && (r.photo ? <img src={cld(r.photo, 'w_112,h_112,c_fill,g_face')} alt="" /> : null)}
              <div className="grow"><b>{S.title(r)}</b>{!r.isActive && <span className="mini warn">Hidden</span>}<small>{S.sub(r)}</small></div>
              <div className="row-actions">
                <button type="button" className="btn btn-sm btn-outline" aria-label="Upore" disabled={i === 0} onClick={() => move(i, -1)}>▲</button>
                <button type="button" className="btn btn-sm btn-outline" aria-label="Niche" disabled={i === items.length - 1} onClick={() => move(i, 1)}>▼</button>
                <button type="button" className="btn btn-sm btn-outline" onClick={() => patch(r, { isActive: !r.isActive })}>{r.isActive ? 'Hide' : 'Show'}</button>
                <button type="button" className="btn btn-sm btn-primary" onClick={() => edit(r)}>Edit</button>
                <button type="button" className="btn btn-sm btn-del" onClick={() => del(r)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}