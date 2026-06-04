'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import DataTable from '@/components/DataTable';
import toast from 'react-hot-toast';

export default function Page() {
  const [rows, setRows] = useState<any[]>([]);
  const [f, setF] = useState({ name:'', email:'', phone:'', address:'' });
  async function load() { setRows((await api.get('/suppliers')).data); }
  useEffect(() => { load(); }, []);
  async function add() {
    if(!f.name) return;
    try { await api.post('/suppliers', f); setF({name:'',email:'',phone:'',address:''}); load(); }
    catch(e:any){ toast.error(e.response?.data?.error||'Failed'); }
  }
  async function remove(id:number){ if(!confirm('Delete?'))return; await api.delete(`/suppliers/${id}`); load(); }
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Suppliers</h1>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
        {(['name','email','phone','address'] as const).map(k => (
          <input key={k} placeholder={k} value={f[k]} onChange={e=>setF({...f,[k]:e.target.value})}
            className="px-3 py-2 rounded border border-slate-300 dark:border-slate-700 bg-transparent" />
        ))}
        <button onClick={add} className="bg-indigo-600 text-white px-3 rounded text-sm">Add</button>
      </div>
      <DataTable rows={rows} cols={[
        { key:'name', label:'Name' }, { key:'email', label:'Email' }, { key:'phone', label:'Phone' }, { key:'address', label:'Address' },
        { key:'a', label:'', render:(r:any)=><button onClick={()=>remove(r.id)} className="text-xs px-2 py-1 rounded bg-red-100 text-red-700">Delete</button> },
      ]} />
    </div>
  );
}
