'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { api } from '@/lib/api';
import { Alert, PageHero } from '@/components/Ui';

export default function Dashboard() {
  const { user, token, ready } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState(null);
  const [err, setErr] = useState('');

  useEffect(() => { if (ready && !user) router.replace('/login'); }, [ready, user, router]);
  useEffect(() => { if (token) api('/appointments/my', { token }).then((d) => setItems(d.items)).catch((e) => setErr(e.message)); }, [token]);

  const cancel = async (id) => {
    if (!confirm('Are you sure you want to cancel this appointment?')) return;
    try { await api(`/appointments/${id}/cancel`, { method: 'PATCH', token }); setItems(items.map((a) => (a._id === id ? { ...a, status: 'cancelled' } : a))); }
    catch (e) { setErr(e.message); }
  };

  if (!user) return null;
  return (
    <>
      <PageHero title={`Welcome, ${user.name}`} text="See your appointments here." />
      <section className="container section">
        <Alert>{err}</Alert>
        <p><Link href="/appointment" className="btn btn-primary">New appointment</Link></p>
        {!items ? <p className="muted">Loading…</p> : items.length === 0 ? <p className="muted">You have no appointments.</p> : (
          <div className="table-wrap">
            <table className="table">
              <thead><tr><th>Serial</th><th>Doctor</th><th>Date</th><th>Time</th><th>Status</th><th /></tr></thead>
              <tbody>{items.map((a) => (
                <tr key={a._id}>
                  <td data-l="Serial">{a.serial}</td><td data-l="Doctor">{a.doctor?.name}<small>{a.doctor?.department}</small></td>
                  <td data-l="Date">{a.date}</td><td data-l="Time">{a.timeSlot}</td>
                  <td data-l="Status"><span className={`badge ${a.status}`}>{a.status}</span></td>
                  <td>{['pending', 'confirmed'].includes(a.status) && <button className="btn btn-outline btn-sm" onClick={() => cancel(a._id)}>Cancel</button>}</td>
                </tr>))}</tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
