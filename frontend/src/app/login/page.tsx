'use client';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('admin@sims.local');
  const [password, setPassword] = useState('Admin@123');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try { await login(email, password); }
    catch (err: any) { toast.error(err.response?.data?.error || 'Login failed'); }
    finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 space-y-4">
        <h1 className="text-xl font-bold">Sign in to SIMS</h1>
        <div>
          <label className="text-xs uppercase text-slate-500">Email</label>
          <input value={email} onChange={e=>setEmail(e.target.value)} type="email" required
            className="mt-1 w-full px-3 py-2 rounded border border-slate-300 dark:border-slate-700 bg-transparent" />
        </div>
        <div>
          <label className="text-xs uppercase text-slate-500">Password</label>
          <input value={password} onChange={e=>setPassword(e.target.value)} type="password" required
            className="mt-1 w-full px-3 py-2 rounded border border-slate-300 dark:border-slate-700 bg-transparent" />
        </div>
        <button disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded py-2 text-sm">
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
        <p className="text-xs text-slate-500">Demo: admin@sims.local / Admin@123</p>
      </form>
    </div>
  );
}
