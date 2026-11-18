'use client';
import { useState } from 'react';
import { api } from '@/lib/api';
import { Alert, Field } from './Ui';
import { useBotGuard } from './BotGuard';

// kind: 'ambulance' | 'contact' | 'feedback'
export default function SimpleForm({ kind }) {
  const isAmb = kind === 'ambulance';
  const isFb = kind === 'feedback';
  const bot = useBotGuard({ captcha: !isAmb });   // ambulance e CAPTCHA nei: emergency e jeno atke na jay
  const [f, setF] = useState({});
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [ok, setOk] = useState('');
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault(); setErr(''); setOk('');
    if (!bot.ready()) return setErr('Human verification complete korun');
    setBusy(true);
    try {
      let body;
      if (isAmb) body = { name: f.name, phone: f.phone, pickupAddress: f.pickupAddress, type: f.type || 'basic', note: f.note || undefined };
      else if (isFb) body = { name: f.name, message: f.message, rating: Number(f.rating) || 5 };
      else body = { name: f.name, email: f.email || undefined, phone: f.phone || undefined, subject: f.subject || undefined, message: f.message };
      const d = await api(isAmb ? '/ambulance' : isFb ? '/feedback' : '/contact', { method: 'POST', body: { ...body, ...bot.payload() } });
      setOk(d.message); setF({}); bot.reset();
    } catch (e2) { setErr(e2.message); bot.reset(); } finally { setBusy(false); }
  };

  return (
    <form className="card form-grid" onSubmit={submit}>
      <Alert>{err}</Alert><Alert type="ok">{ok}</Alert>
      <Field label="Name *"><input required value={f.name || ''} onChange={set('name')} /></Field>
      {!isFb && <Field label={isAmb ? 'Mobile *' : 'Mobile'}><input type="tel" inputMode="tel" placeholder="01XXXXXXXXX" required={isAmb} value={f.phone || ''} onChange={set('phone')} /></Field>}
      {isFb && <Field label="Rating"><select value={f.rating || 5} onChange={set('rating')}>{[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{'★'.repeat(n)}</option>)}</select></Field>}
      {isAmb ? (
        <>
          <Field label="Pickup address *"><input required value={f.pickupAddress || ''} onChange={set('pickupAddress')} /></Field>
          <Field label="Ambulance type">
            <select value={f.type || 'basic'} onChange={set('type')}><option value="basic">Basic</option><option value="icu">ICU</option><option value="freezer">Freezer</option></select>
          </Field>
          <Field label="Note"><textarea rows={3} value={f.note || ''} onChange={set('note')} /></Field>
        </>
      ) : isFb ? (
        <div className="full"><Field label="Your Feedback *"><textarea rows={4} required minLength={10} maxLength={600} value={f.message || ''} onChange={set('message')} /></Field></div>
      ) : (
        <>
          <Field label="Email"><input type="email" value={f.email || ''} onChange={set('email')} /></Field>
          <Field label="Subject"><input value={f.subject || ''} onChange={set('subject')} /></Field>
          <Field label="Message *"><textarea rows={5} required minLength={5} value={f.message || ''} onChange={set('message')} /></Field>
        </>
      )}
      {bot.field}
      <button className="btn btn-primary btn-lg full" disabled={busy}>{busy ? 'Sending…' : isAmb ? 'Request ambulance' : isFb ? 'Submit feedback' : 'Send message'}</button>
    </form>
  );
}
