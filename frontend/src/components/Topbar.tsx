'use client';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function Topbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return (
    <header className="h-14 flex items-center justify-between px-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
      <div className="font-semibold">Smart Inventory</div>
      {mounted && (
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="text-sm px-3 py-1.5 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700"
        >
          {theme === 'dark' ? 'Light' : 'Dark'} mode
        </button>
      )}
    </header>
  );
}
