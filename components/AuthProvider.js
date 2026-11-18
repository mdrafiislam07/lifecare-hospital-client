'use client';
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { api } from '@/lib/api';

const Ctx = createContext(null);
export const useAuth = () => useContext(Ctx);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const t = localStorage.getItem('marh_token');
      const u = localStorage.getItem('marh_user');
      if (t && u) { setToken(t); setUser(JSON.parse(u)); }
    } catch { /* ignore */ }
    setReady(true);
  }, []);

  const save = useCallback((t, u) => {
    setToken(t); setUser(u);
    localStorage.setItem('marh_token', t); localStorage.setItem('marh_user', JSON.stringify(u));
  }, []);
  const logout = useCallback(() => {
    setToken(null); setUser(null);
    localStorage.removeItem('marh_token'); localStorage.removeItem('marh_user');
  }, []);
  const login = async (email, password) => { const d = await api('/auth/login', { method: 'POST', body: { email, password } }); save(d.token, d.user); return d.user; };
  const register = async (body) => { const d = await api('/auth/register', { method: 'POST', body }); save(d.token, d.user); return d.user; };

  return <Ctx.Provider value={{ user, token, ready, login, register, logout }}>{children}</Ctx.Provider>;
}
