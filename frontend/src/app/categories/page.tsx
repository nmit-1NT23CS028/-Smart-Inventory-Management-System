'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import DataTable from '@/components/DataTable';
import toast from 'react-hot-toast';

export default function Page() {
  const [rows, setRows] = useState<any[]>([]);
  const [name, setName] = useState(''); const [description, setDescription] = useState('');
  async function load() { setRows((await api.get('/categories')).data); }
  useEffect(() => { load(); }, []);
  async function add() {
    if (!name) return;
    try { await api.post('/categories', { name, description }); setName(''); setDescription(''); load(); }
    catch (e:any) { toast.error(e.response?.data?.error || 'Failed'); }
  }
  async function remove(id:number) { if(!confirm('Delete?'))return; await api.delete(`/categories/${id}`); load(); }
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Categories</h1>
      <div className="flex gap-2">
        <input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} className="px-3 py-2 rounded border border-slate-300 dark:border-slate-700 bg-transparent" />
        <input placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)} className="flex-1 px-3 py-2 rounded border border-slate-300 dark:border-slate-700 bg-transparent" />
        <button onClick={add} className="bg-indigo-600 text-white px-3 rounded text-sm">Add</button>
      </div>
      <DataTable rows={rows} cols={[
        { key:'name', label:'Name' },
        { key:'description', label:'Description' },
        { key:'a', label:'', render:(r:any)=><button onClick={()=>remove(r.id)} className="text-xs px-2 py-1 rounded bg-red-100 text-red-700">Delete</button> },
      ]} />
    </div>
  );
}
