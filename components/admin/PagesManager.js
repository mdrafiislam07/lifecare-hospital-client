'use client';
import { useCallback, useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Alert, Field } from '@/components/Ui';
import RichEditor from '@/components/RichEditor';
import '@/styles/cms.css';

const EMPTY = { group: 'about', title: '', slug: '', desc: '', content: '', showInMenu: true, published: true };

export default function PagesManager({ token }) {
  const [items, setItems] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [ek, setEk] = useState(0);               // editor remount key
  const [err, setErr] = useState(''); const [ok, setOk] = useState(''); const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try { setItems((await api('/pages', { token })).items); } catch (e) { setErr(e.message); }
  }, [token]);
  useEffect(() => { load(); }, [load]);

  const groups = [...new Set(['about', 'services', 'admission', ...(items || []).map((p) => p.group)])];
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const top = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const reset = () => { setForm(EMPTY); setEditId(null); setEk((k) => k + 1); };
  const edit = async (p) => {
    setErr(''); setOk('');
    try {
      const { item } = await api(`/pages/id/${p._id}`, { token });
      setForm({ group: item.group, title: item.title, slug: item.slug, desc: item.desc || '', content: item.content || '', showInMenu: item.showInMenu, published: item.published });
      setEditId(p._id); setEk((k) => k + 1); top();
    } catch (e) { setErr(e.message); }
  };

  const save = async (e) => {
    e.preventDefault(); setErr(''); setOk(''); setBusy(true);
    try {
      const body = { group: form.group.trim().toLowerCase(), title: form.title, desc: form.desc, content: form.content, showInMenu: form.showInMenu, published: form.published };
      if (form.slug.trim()) body.slug = form.slug.trim().toLowerCase();
      if (editId) await api(`/pages/${editId}`, { method: 'PUT', token, body });
      else await api('/pages', { method: 'POST', token, body });
      setOk(editId ? 'Page update hoyeche' : 'Page toiri hoyeche'); reset(); load(); top();
    } catch (e2) { setErr(e2.message); top(); }
    setBusy(false);
  };

  const patch = async (p, body) => { setErr(''); try { await api(`/pages/${p._id}`, { method: 'PUT', token, body }); load(); } catch (e) { setErr(e.message); } };
  const del = async (p) => {
    if (!confirm(`"${p.title}" delete korben?`)) return;
    setErr(''); try { await api(`/pages/${p._id}`, { method: 'DELETE', token }); if (editId === p._id) reset(); setOk('Delete hoyeche'); load(); } catch (e) { setErr(e.message); }
  };
  const move = async (g, id, dir) => {
    const ids = items.filter((p) => p.group === g).map((p) => p._id);
    const i = ids.indexOf(id), j = i + dir;
    if (j < 0 || j >= ids.length) return;
    [ids[i], ids[j]] = [ids[j], ids[i]];
    setErr(''); try { await api('/pages/reorder', { method: 'PUT', token, body: { ids } }); load(); } catch (e) { setErr(e.message); }
  };

  return (
    <>
      <Alert>{err}</Alert><Alert type="ok">{ok}</Alert>

      <form className="card cms-sec cms-form" onSubmit={save}>
        <h3>{editId ? 'Edit page' : 'New page'}</h3>
        <div className="cms-grid">
          <Field label="Group *" hint="about / services / admission ba nijer New group (english, small letter)">
            <input required list="page-groups" value={form.group} onChange={set('group')} pattern="[a-z0-9-]{2,40}" />
            <datalist id="page-groups">{groups.map((g) => <option key={g} value={g} />)}</datalist>
          </Field>
          <Field label="Title *"><input required value={form.title} onChange={set('title')} /></Field>
          <Field label="Slug (URL)" hint={editId ? 'URL bodlale puraton link kaj korbe na' : 'Khali rakhle title theke auto hobe'}><input value={form.slug} onChange={set('slug')} pattern="[a-z0-9-]{1,80}" placeholder="auto" /></Field>
          <Field label="Short description (page header)"><input value={form.desc} onChange={set('desc')} /></Field>
          <div className="full"><span className="field-label">Content</span><RichEditor key={ek} token={token} value={form.content} onChange={(html) => setForm((f) => ({ ...f, content: html }))} /></div>
          <label className="cms-check"><input type="checkbox" checked={form.showInMenu} onChange={(e) => setForm({ ...form, showInMenu: e.target.checked })} /> Menu / sidebar e dekhabe</label>
          <label className="cms-check"><input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} /> Published</label>
        </div>
        <div className="row-actions" style={{ marginTop: 12 }}>
          <button className="btn btn-primary btn-lg" disabled={busy}>{busy ? 'Saving…' : editId ? 'Update page' : 'Create page'}</button>
          {editId && <button type="button" className="btn btn-outline btn-lg" onClick={reset}>Cancel</button>}
        </div>
      </form>

      {!items ? <p>Loading…</p> : groups.filter((g) => items.some((p) => p.group === g)).map((g) => {
        const list = items.filter((p) => p.group === g);
        return (
          <div key={g}>
            <h3 className="cms-group-title">{g} <span className="mini">{list.length}</span></h3>
            <div className="admin-list">
              {list.map((p, i) => (
                <div className="admin-row" key={p._id} style={{ flexWrap: 'wrap' }}>
                  <div className="grow"><b>{p.title}</b>
                    {!p.published && <span className="mini warn">Draft</span>}{!p.showInMenu && <span className="mini">Menu te nei</span>}
                    <small>/{p.group}/{p.slug}</small></div>
                  <div className="row-actions">
                    <button className="btn btn-sm btn-outline" aria-label="Upore" disabled={i === 0} onClick={() => move(g, p._id, -1)}>▲</button>
                    <button className="btn btn-sm btn-outline" aria-label="Niche" disabled={i === list.length - 1} onClick={() => move(g, p._id, 1)}>▼</button>
                    <button className="btn btn-sm btn-outline" onClick={() => patch(p, { showInMenu: !p.showInMenu })}>{p.showInMenu ? 'Hide menu' : 'Show menu'}</button>
                    <button className="btn btn-sm btn-outline" onClick={() => patch(p, { published: !p.published })}>{p.published ? 'Unpublish' : 'Publish'}</button>
                    <a className="btn btn-sm btn-outline" href={`/${p.group}/${p.slug}`} target="_blank" rel="noreferrer">View</a>
                    <button className="btn btn-sm btn-primary" onClick={() => edit(p)}>Edit</button>
                    <button className="btn btn-sm btn-del" onClick={() => del(p)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </>
  );
}
