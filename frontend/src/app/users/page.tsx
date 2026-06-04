'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import DataTable from '@/components/DataTable';
import toast from 'react-hot-toast';

export default function Page() {
  const [rows, setRows] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [f, setF] = useState({ name:'', email:'', password:'', role:'staff' });
  async function load() {
    setRows((await api.get('/users')).data);
    setLogs((await api.get('/users/activity/logs')).data);
  }
  useEffect(() => { load(); }, []);
  async function add() {
    try { await api.post('/users', f); setF({name:'',email:'',password:'',role:'staff'}); load(); }
    catch(e:any){ toast.error(e.response?.data?.error||'Failed'); }
  }
  async function remove(id:number){ if(!confirm('Delete user?'))return; await api.delete(`/users/${id}`); load(); }
  async function toggle(u:any){ await api.put(`/users/${u.id}`, { is_active: !u.is_active }); load(); }
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">Users</h1>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
        <input placeholder="Name" value={f.name} onChange={e=>setF({...f,name:e.target.value})} className="px-3 py-2 rounded border border-slate-300 dark:border-slate-700 bg-transparent" />
        <input placeholder="Email" value={f.email} onChange={e=>setF({...f,email:e.target.value})} className="px-3 py-2 rounded border border-slate-300 dark:border-slate-700 bg-transparent" />
        <input placeholder="Password" type="password" value={f.password} onChange={e=>setF({...f,password:e.target.value})} className="px-3 py-2 rounded border border-slate-300 dark:border-slate-700 bg-transparent" />
        <select value={f.role} onChange={e=>setF({...f,role:e.target.value})} className="px-3 py-2 rounded border border-slate-300 dark:border-slate-700 bg-transparent">
          <option value="admin">admin</option><option value="manager">manager</option><option value="staff">staff</option>
        </select>
        <button onClick={add} className="bg-indigo-600 text-white px-3 rounded text-sm">Add</button>
      </div>
      <DataTable rows={rows} cols={[
        { key:'name', label:'Name' }, { key:'email', label:'Email' }, { key:'role', label:'Role' },
        { key:'is_active', label:'Active', render:(r:any)=>r.is_active?'Yes':'No' },
        { key:'a', label:'', render:(r:any)=>(
          <div className="flex gap-2">
            <button onClick={()=>toggle(r)} className="text-xs px-2 py-1 rounded bg-slate-100 dark:bg-slate-800">{r.is_active?'Disable':'Enable'}</button>
            <button onClick={()=>remove(r.id)} className="text-xs px-2 py-1 rounded bg-red-100 text-red-700">Delete</button>
          </div>
        )},
      ]} />
      <h2 className="text-lg font-semibold mt-6">Activity logs</h2>
      <DataTable rows={logs} cols={[
        { key:'created_at', label:'Time' },
        { key:'user_name', label:'User' },
        { key:'action', label:'Action' },
        { key:'entity', label:'Entity' },
        { key:'entity_id', label:'ID' },
        { key:'ip', label:'IP' },
      ]} />
    </div>
  );
}
