'use client';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import Protected from '@/components/Protected';
import { ReactNode } from 'react';
export default function L({ children }: { children: ReactNode }) {
  return (
    <Protected>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Topbar />
          <main className="p-6 flex-1">{children}</main>
        </div>
      </div>
    </Protected>
  );
}
