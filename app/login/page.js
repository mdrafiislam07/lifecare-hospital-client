'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { Alert, Field } from '@/components/Ui';

export default function Login() {
  const { login } = useAuth();
  const router = useRouter();
  const [f, setF] = useState({ email: '', password: '' });
  const [err, setErr] = useState(''); const [busy, setBusy] = useState(false);
  const submit = async (e) => {
    e.preventDefault(); setErr(''); setBusy(true);
    try { const u = await login(f.email, f.password); router.push(u.role === 'admin' ? '/admin' : '/dashboard'); }
    catch (x) { setErr(x.message); } finally { setBusy(false); }
  };
  return (
    <section className="container section narrow-sm">
      <form className="card form-grid one" onSubmit={submit}>
        <h1>Login</h1><Alert>{err}</Alert>
        <Field label="Email"><input type="email" required autoComplete="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></Field>
        <Field label="Password"><input type="password" required autoComplete="current-password" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} /></Field>
        <button className="btn btn-primary btn-lg" disabled={busy}>{busy ? 'Please wait…' : 'Login'}</button>
        <p className="center">New? <Link href="/register">Create Account</Link></p>
      </form>
    </section>
  );
}
