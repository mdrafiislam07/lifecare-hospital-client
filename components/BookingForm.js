'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from './AuthProvider';
import { Alert, Field } from './Ui';
import { SPECIALTIES } from '@/lib/data';
import { useBotGuard } from './BotGuard';

export default function BookingForm() {
  const sp = useSearchParams();
  const { token, user } = useAuth() || {};
  const [doctors, setDoctors] = useState([]);
  const [dept, setDept] = useState('');
  const [doctor, setDoctor] = useState(sp.get('doctor') || '');
  const [date, setDate] = useState('');
  const [slots, setSlots] = useState(null);
  const [slotMsg, setSlotMsg] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [f, setF] = useState({ patientName: '', phone: '', age: '', gender: '', reason: '' });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [done, setDone] = useState(null);
  const bot = useBotGuard();
  const today = new Date().toISOString().slice(0, 10);

  useEffect(() => { if (user) setF((x) => ({ ...x, patientName: x.patientName || user.name, phone: x.phone || user.phone || '' })); }, [user]);

  useEffect(() => {
    api(`/doctors?limit=50${dept ? `&department=${encodeURIComponent(dept)}` : ''}`).then((d) => setDoctors(d.items)).catch(() => setErr('Doctor list load kora jayni'));
  }, [dept]);

  useEffect(() => {
    setSlots(null); setTimeSlot(''); setSlotMsg('');
    if (!doctor || !date) return;
    api(`/doctors/${doctor}/slots?date=${date}`).then((d) => { setSlots(d.slots); if (!d.available) setSlotMsg(d.message); }).catch((e) => setErr(e.message));
  }, [doctor, date]);

  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const selected = doctors.find((d) => d._id === doctor);

  const submit = async (e) => {
    e.preventDefault(); setErr('');
    if (!timeSlot) return setErr('Ekta time slot select korun');
    if (!bot.ready()) return setErr('“I am human” verification complete korun');
    setBusy(true);
    try {
      const body = { doctor, date, timeSlot, patientName: f.patientName, phone: f.phone, reason: f.reason || undefined,
        age: f.age ? Number(f.age) : undefined, gender: f.gender || undefined, ...bot.payload() };
      const d = await api('/appointments', { method: 'POST', body, token });
      setDone(d.item);
    } catch (e2) { setErr(e2.message); bot.reset(); } finally { setBusy(false); }
  };

  if (done) return (
    <div className="card success-card">
      <h2>Appointment request pathano hoyeche</h2>
      <p>Serial no: <b>{done.serial}</b></p>
      <p>{selected?.name} · {done.date} · {done.timeSlot}</p>
      <p>we will call you at: <b>01806-176500</b></p>
      <button className="btn btn-primary" onClick={() => { setDone(null); setTimeSlot(''); setSlots(null); }}>Book another  appointment</button>
    </div>
  );

  return (
    <form className="card form-grid" onSubmit={submit} noValidate>
      <Alert>{err}</Alert>
      <Field label="Department">
        <select value={dept} onChange={(e) => { setDept(e.target.value); setDoctor(''); }}>
          <option value="">All Department</option>
          {SPECIALTIES.map((s) => <option key={s}>{s}</option>)}
        </select>
      </Field>
      <Field label="Doctor *">
        <select value={doctor} onChange={(e) => setDoctor(e.target.value)} required>
          <option value="">Doctor select korun</option>
          {doctors.map((d) => <option key={d._id} value={d._id}>{d.name} — {d.department}</option>)}
        </select>
      </Field>
      <Field label="Date *" hint={selected?.days?.length ? `Available: ${selected.days.join(', ')}` : ''}>
        <input type="date" min={today} value={date} onChange={(e) => setDate(e.target.value)} required />
      </Field>

      {doctor && date && (
        <div className="field full">
          <span>Time slot *</span>
          {slotMsg && <Alert>{slotMsg}</Alert>}
          {!slots && !slotMsg && <p className="muted">Loading slots…</p>}
          {slots && (
            <div className="slots">
              {slots.map((s) => (
                <button type="button" key={s.time} disabled={s.booked} onClick={() => setTimeSlot(s.time)}
                  className={`slot ${timeSlot === s.time ? 'on' : ''}`} aria-pressed={timeSlot === s.time}>{s.time}</button>
              ))}
            </div>
          )}
        </div>
      )}

      <Field label="Patient name *"><input value={f.patientName} onChange={set('patientName')} required maxLength={80} /></Field>
      <Field label="Mobile number *"><input type="tel" inputMode="tel" placeholder="01XXXXXXXXX" value={f.phone} onChange={set('phone')} required /></Field>
      <Field label="Age"><input type="number" min="0" max="120" value={f.age} onChange={set('age')} /></Field>
      <Field label="Gender">
        <select value={f.gender} onChange={set('gender')}><option value="">—</option><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option></select>
      </Field>
      <Field label="Problem / reason"><textarea rows={3} maxLength={500} value={f.reason} onChange={set('reason')} /></Field>
      {bot.field}
      <button className="btn btn-primary btn-lg full" disabled={busy}>{busy ? 'Submitting…' : 'Confirm appointment'}</button>
    </form>
  );
}
