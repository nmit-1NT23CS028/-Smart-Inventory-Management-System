'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';

type User = { id: number; name: string; email: string; role: 'admin'|'manager'|'staff' };
type Ctx = { user: User | null; loading: boolean; login: (e: string, p: string) => Promise<void>; logout: () => void };

const AuthCtx = createContext<Ctx>({} as Ctx);
export const useAuth = () => useContext(AuthCtx);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('sims_token') : null;
    if (!token) { setLoading(false); return; }
    api.get('/auth/me').then((r) => setUser(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  async function login(email: string, password: string) {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('sims_token', data.token);
    setUser(data.user);
    router.push('/dashboard');
  }

  function logout() {
    localStorage.removeItem('sims_token');
    setUser(null);
    router.push('/login');
  }

  return <AuthCtx.Provider value={{ user, loading, login, logout }}>{children}</AuthCtx.Provider>;
}
