'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { Alert, Field } from '@/components/Ui';
import { useBotGuard } from '@/components/BotGuard';

export default function Register() {
  const { register } = useAuth();
  const router = useRouter();
  const [f, setF] = useState({ name: '', email: '', phone: '', password: '' });
  const [err, setErr] = useState(''); const [busy, setBusy] = useState(false);
  const bot = useBotGuard();
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const submit = async (e) => {
    e.preventDefault(); setErr(''); setBusy(true);
    if (!bot.ready()) { setBusy(false); return setErr('Human verification complete korun'); }
    try { await register({ ...f, phone: f.phone || undefined, ...bot.payload() }); router.push('/dashboard'); }
    catch (x) { setErr(x.message); bot.reset(); } finally { setBusy(false); }
  };
  return (
    <section className="container section narrow-sm">
      <form className="card form-grid one" onSubmit={submit}>
        <h1>Create account</h1><Alert>{err}</Alert>
        <Field label="Full name"><input required value={f.name} onChange={set('name')} /></Field>
        <Field label="Email"><input type="email" required autoComplete="email" value={f.email} onChange={set('email')} /></Field>
        <Field label="Mobile"><input type="tel" placeholder="01XXXXXXXXX" value={f.phone} onChange={set('phone')} /></Field>
        <Field label="Password" hint="Komopokkho 6 character"><input type="password" minLength={6} required autoComplete="new-password" value={f.password} onChange={set('password')} /></Field>
        {bot.field}
        <button className="btn btn-primary btn-lg" disabled={busy}>{busy ? 'Please wait…' : 'Register'}</button>
        <p className="center">Account ache? <Link href="/login">Login</Link></p>
      </form>
    </section>
  );
}
