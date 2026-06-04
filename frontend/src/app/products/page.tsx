'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import DataTable from '@/components/DataTable';
import toast from 'react-hot-toast';

export default function ProductsPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState<any>({ sku:'', barcode:'', name:'', cost_price:0, sell_price:0, stock_qty:0, reorder_level:5 });

  async function load() {
    const r = await api.get('/products');
    setRows(r.data.data || r.data);
  }
  useEffect(() => { load(); }, []);

  function startCreate() { setEditing(null); setForm({ sku:'', barcode:'', name:'', cost_price:0, sell_price:0, stock_qty:0, reorder_level:5 }); setOpen(true); }
  function startEdit(p: any) { setEditing(p); setForm(p); setOpen(true); }

  async function save() {
    try {
      const payload = { ...form, cost_price: Number(form.cost_price), sell_price: Number(form.sell_price),
        stock_qty: Number(form.stock_qty), reorder_level: Number(form.reorder_level) };
      if (editing) await api.put(`/products/${editing.id}`, payload);
      else await api.post('/products', payload);
      toast.success('Saved'); setOpen(false); load();
    } catch (e: any) { toast.error(e.response?.data?.error || 'Failed'); }
  }

  async function remove(id: number) {
    if (!confirm('Delete this product?')) return;
    try { await api.delete(`/products/${id}`); toast.success('Deleted'); load(); }
    catch (e: any) { toast.error(e.response?.data?.error || 'Failed'); }
  }

  async function adjust(id: number) {
    const v = prompt('Stock change (+ or -):'); if (!v) return;
    try { await api.post(`/products/${id}/adjust`, { change_qty: Number(v), reason: 'manual' }); load(); }
    catch (e: any) { toast.error(e.response?.data?.error || 'Failed'); }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Products</h1>
        <button onClick={startCreate} className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded text-sm">New product</button>
      </div>
      <DataTable rows={rows} cols={[
        { key:'sku', label:'SKU' },
        { key:'name', label:'Name' },
        { key:'stock_qty', label:'Stock' },
        { key:'sell_price', label:'Price' },
        { key:'actions', label:'', render: (r:any)=>(
          <div className="flex gap-2">
            <button onClick={()=>adjust(r.id)} className="text-xs px-2 py-1 rounded bg-slate-100 dark:bg-slate-800">Adjust</button>
            <button onClick={()=>startEdit(r)} className="text-xs px-2 py-1 rounded bg-slate-100 dark:bg-slate-800">Edit</button>
            <button onClick={()=>remove(r.id)} className="text-xs px-2 py-1 rounded bg-red-100 text-red-700">Delete</button>
          </div>
        )},
      ]} />

      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 rounded-lg p-6 w-full max-w-lg space-y-3">
            <h3 className="font-semibold">{editing ? 'Edit' : 'New'} product</h3>
            {['sku','barcode','name','cost_price','sell_price','stock_qty','reorder_level'].map(k => (
              <div key={k}>
                <label className="text-xs uppercase text-slate-500">{k}</label>
                <input value={form[k] ?? ''} onChange={e=>setForm({...form, [k]: e.target.value})}
                  className="mt-1 w-full px-3 py-2 rounded border border-slate-300 dark:border-slate-700 bg-transparent" />
              </div>
            ))}
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={()=>setOpen(false)} className="px-3 py-1.5 rounded bg-slate-100 dark:bg-slate-800 text-sm">Cancel</button>
              <button onClick={save} className="px-3 py-1.5 rounded bg-indigo-600 text-white text-sm">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
