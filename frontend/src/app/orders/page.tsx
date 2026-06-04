'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import DataTable from '@/components/DataTable';
import toast from 'react-hot-toast';

export default function Page() {
  const [rows, setRows] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<'purchase'|'sales'>('sales');
  const [customer, setCustomer] = useState('');
  const [items, setItems] = useState<any[]>([]);

  async function load() {
    setRows((await api.get('/orders')).data);
    const pr = await api.get('/products');
    setProducts(pr.data.data || pr.data);
  }
  useEffect(() => { load(); }, []);

  function addItem() { setItems([...items, { product_id: products[0]?.id, quantity:1, unit_price: products[0]?.sell_price || 0 }]); }
  function setItem(i:number, patch:any) { setItems(items.map((it,idx)=>idx===i?{...it,...patch}:it)); }

  async function save() {
    try {
      await api.post('/orders', { type, customer_name: customer || null, items: items.map(it => ({
        product_id: Number(it.product_id), quantity: Number(it.quantity), unit_price: Number(it.unit_price)
      }))});
      toast.success('Order created'); setOpen(false); setItems([]); setCustomer(''); load();
    } catch(e:any){ toast.error(e.response?.data?.error||'Failed'); }
  }

  async function setStatus(id:number, status:string) {
    try { await api.patch(`/orders/${id}/status`, { status }); load(); }
    catch(e:any){ toast.error(e.response?.data?.error||'Failed'); }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Orders</h1>
        <button onClick={()=>setOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded text-sm">New order</button>
      </div>
      <DataTable rows={rows} cols={[
        { key:'order_no', label:'No.' },
        { key:'type', label:'Type' },
        { key:'status', label:'Status' },
        { key:'total_amount', label:'Total' },
        { key:'created_by_name', label:'By' },
        { key:'a', label:'', render:(r:any)=>(
          <select defaultValue={r.status} onChange={e=>setStatus(r.id, e.target.value)} className="text-xs px-2 py-1 rounded bg-slate-100 dark:bg-slate-800">
            {['pending','approved','completed','cancelled'].map(s=><option key={s}>{s}</option>)}
          </select>
        )},
      ]} />

      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 rounded-lg p-6 w-full max-w-2xl space-y-3">
            <h3 className="font-semibold">New order</h3>
            <div className="flex gap-2">
              <select value={type} onChange={e=>setType(e.target.value as any)} className="px-3 py-2 rounded border border-slate-300 dark:border-slate-700 bg-transparent">
                <option value="sales">sales</option><option value="purchase">purchase</option>
              </select>
              <input placeholder="Customer / Note" value={customer} onChange={e=>setCustomer(e.target.value)}
                className="flex-1 px-3 py-2 rounded border border-slate-300 dark:border-slate-700 bg-transparent" />
            </div>
            <div className="space-y-2 max-h-72 overflow-y-auto">
              {items.map((it,i)=>(
                <div key={i} className="grid grid-cols-12 gap-2">
                  <select value={it.product_id} onChange={e=>setItem(i,{product_id:e.target.value})} className="col-span-6 px-3 py-2 rounded border border-slate-300 dark:border-slate-700 bg-transparent">
                    {products.map(p=><option key={p.id} value={p.id}>{p.sku} — {p.name}</option>)}
                  </select>
                  <input type="number" min={1} value={it.quantity} onChange={e=>setItem(i,{quantity:e.target.value})} className="col-span-3 px-3 py-2 rounded border border-slate-300 dark:border-slate-700 bg-transparent" />
                  <input type="number" step="0.01" value={it.unit_price} onChange={e=>setItem(i,{unit_price:e.target.value})} className="col-span-3 px-3 py-2 rounded border border-slate-300 dark:border-slate-700 bg-transparent" />
                </div>
              ))}
              <button onClick={addItem} className="text-sm text-indigo-600">+ Add item</button>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={()=>setOpen(false)} className="px-3 py-1.5 rounded bg-slate-100 dark:bg-slate-800 text-sm">Cancel</button>
              <button onClick={save} className="px-3 py-1.5 rounded bg-indigo-600 text-white text-sm">Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
