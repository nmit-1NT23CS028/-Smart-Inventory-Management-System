'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const nav = [
  { href: '/dashboard', label: 'Dashboard', roles: ['admin','manager','staff'] },
  { href: '/products', label: 'Products', roles: ['admin','manager','staff'] },
  { href: '/categories', label: 'Categories', roles: ['admin','manager'] },
  { href: '/suppliers', label: 'Suppliers', roles: ['admin','manager'] },
  { href: '/orders', label: 'Orders', roles: ['admin','manager','staff'] },
  { href: '/users', label: 'Users', roles: ['admin'] },
];

export default function Sidebar() {
  const path = usePathname();
  const { user, logout } = useAuth();
  if (!user) return null;
  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 hidden md:flex md:flex-col">
      <div className="p-5 text-lg font-bold tracking-tight">SIMS</div>
      <nav className="flex-1 px-2 space-y-1">
        {nav.filter(n => n.roles.includes(user.role)).map(n => (
          <Link key={n.href} href={n.href}
            className={`block px-3 py-2 rounded-md text-sm ${path?.startsWith(n.href) ? 'bg-indigo-600 text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
            {n.label}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        <div className="text-xs text-slate-500">{user.name}</div>
        <div className="text-xs text-slate-400 uppercase">{user.role}</div>
        <button onClick={logout} className="mt-2 w-full text-sm bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded px-3 py-1.5">Sign out</button>
      </div>
    </aside>
  );
}
