'use client';
import { useEffect, useState, useCallback } from 'react';
import { api } from '@/lib/api';
import { Alert, Field } from '@/components/Ui';

const blank = { name: '', price: '', testsText: '', description: '', order: '', isActive: true };
const toForm = (p) => ({
  name: p.name, price: p.price, testsText: (p.tests || []).join('\n'),
  description: p.description || '', order: p.order ?? 0, isActive: p.isActive !== false
});

// Admin > Packages: add / edit / delete / show-hide / order
export default function PackagesManager({ token }) {
  const [items, setItems] = useState(null);
  const [form, setForm] = useState(blank);
  const [editId, setEditId] = useState(null);
  const [err, setErr] = useState('');
  const [ok, setOk] = useState('');
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try { setItems((await api('/packages/all', { token })).items); }
    catch (e) { setErr(e.message); }
  }, [token]);
  useEffect(() => { load(); }, [load]);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });

  const reset = () => { setForm(blank); setEditId(null); };

  const submit = async (e) => {
    e.preventDefault(); setErr(''); setOk(''); setBusy(true);
    try {
      const body = {
        name: form.name.trim(),
        price: Number(form.price),
        tests: form.testsText.split('\n').map((t) => t.trim()).filter(Boolean),
        description: form.description.trim(),
        isActive: form.isActive
      };
      if (form.order !== '') body.order = Number(form.order);
      if (editId) await api(`/packages/${editId}`, { method: 'PUT', token, body });
      else await api('/packages', { method: 'POST', token, body });
      setOk(editId ? 'Package update hoyeche' : 'Package add hoyeche');
      reset(); await load();
    } catch (x) { setErr(x.message); } finally { setBusy(false); }
  };

  const edit = (p) => {
    setEditId(p._id); setForm(toForm(p)); setOk(''); setErr('');
    document.getElementById('pkg-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const toggle = async (p) => {
    setErr(''); setOk('');
    try { await api(`/packages/${p._id}`, { method: 'PUT', token, body: { isActive: !p.isActive } }); await load(); }
    catch (x) { setErr(x.message); }
  };

  const del = async (p) => {
    if (!confirm(`"${p.name}" delete korben?`)) return;
    setErr(''); setOk('');
    try { await api(`/packages/${p._id}`, { method: 'DELETE', token }); setOk('Delete hoyeche'); if (editId === p._id) reset(); await load(); }
    catch (x) { setErr(x.message); }
  };

  return (
    <div>
      <Alert>{err}</Alert><Alert type="ok">{ok}</Alert>

      <form id="pkg-form" className="card form-grid" onSubmit={submit}>
        <h3 className="full">{editId ? 'Package edit korun' : 'Notun package add korun'}</h3>
        <Field label="Package name *"><input required value={form.name} onChange={set('name')} placeholder="e.g. Basic Health Checkup" /></Field>
        <Field label="Price (৳) *"><input required type="number" min="0" value={form.price} onChange={set('price')} /></Field>
        <Field label="Order" hint="Choto number age dekhabe (khali rakhle shesh e)"><input type="number" min="0" value={form.order} onChange={set('order')} /></Field>
        <label className="cms-check"><input type="checkbox" checked={form.isActive} onChange={set('isActive')} /> Site e dekhabe</label>
        <div className="full">
          <Field label="Tests / included items" hint="Prottek line e ekta kore likhun"><textarea rows={7} value={form.testsText} onChange={set('testsText')} placeholder={'CBC\nBlood Sugar (F)\nECG'} /></Field>
        </div>
        <div className="full">
          <Field label="Short description (optional)"><textarea rows={2} maxLength={1000} value={form.description} onChange={set('description')} /></Field>
        </div>
        <div className="row-actions full">
          <button className="btn btn-primary btn-lg" disabled={busy}>{busy ? 'Saving…' : editId ? 'Update package' : 'Add package'}</button>
          {editId && <button type="button" className="btn btn-outline btn-lg" onClick={reset}>Cancel</button>}
        </div>
      </form>

      <div className="admin-list">
        {!items && <p>Loading…</p>}
        {items?.length === 0 && <p className="muted">Kono package nei. Upore theke add korun.</p>}
        {items?.map((p) => (
          <div className="admin-row" key={p._id} style={{ flexWrap: 'wrap' }}>
            <div className="grow">
              <b>{p.name}</b>
              {!p.isActive && <span className="mini warn">Hidden</span>}
              <small>৳{Number(p.price).toLocaleString('en-US')} · {p.tests?.length || 0} tests · order {p.order ?? 0}</small>
            </div>
            <div className="row-actions">
              <button className="btn btn-sm btn-outline" onClick={() => toggle(p)}>{p.isActive ? 'Hide' : 'Show'}</button>
              <button className="btn btn-sm btn-primary" onClick={() => edit(p)}>Edit</button>
              <button className="btn btn-sm btn-del" onClick={() => del(p)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}