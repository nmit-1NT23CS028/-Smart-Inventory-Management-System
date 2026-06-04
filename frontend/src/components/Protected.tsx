'use client';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';

export default function Protected({ roles, children }: { roles?: string[]; children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!loading && !user) router.replace('/login');
    if (!loading && user && roles && !roles.includes(user.role)) router.replace('/dashboard');
  }, [user, loading, roles, router]);
  if (loading || !user) return <div className="p-8 text-sm">Loading…</div>;
  return <>{children}</>;
}
