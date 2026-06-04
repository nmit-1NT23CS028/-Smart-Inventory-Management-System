'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import Card from '@/components/Card';
import DataTable from '@/components/DataTable';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  useEffect(() => { api.get('/dashboard/overview').then(r => setData(r.data.data)); }, []);
  if (!data) return <div>Loading…</div>;
  const { counts, lowStock, recentOrders, salesByDay, topProducts } = data;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card title="Products" value={counts.total_products} />
        <Card title="Total Stock" value={counts.total_stock} />
        <Card title="Low Stock" value={counts.low_stock} hint="At or below reorder level" />
        <Card title="Orders" value={counts.total_orders} />
        <Card title="Active Users" value={counts.total_users} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5">
          <h3 className="font-semibold mb-3">Sales — last 14 days</h3>
          <div className="h-64">
            <ResponsiveContainer>
              <LineChart data={salesByDay}>
                <XAxis dataKey="day" /><YAxis /><Tooltip />
                <Line type="monotone" dataKey="total" stroke="#6366f1" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5">
          <h3 className="font-semibold mb-3">Top selling products</h3>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={topProducts}>
                <XAxis dataKey="name" /><YAxis /><Tooltip />
                <Bar dataKey="sold" fill="#22c55e" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold mb-2">Low-stock alerts</h3>
          <DataTable rows={lowStock} cols={[
            { key: 'sku', label: 'SKU' },
            { key: 'name', label: 'Product' },
            { key: 'stock_qty', label: 'Stock' },
            { key: 'reorder_level', label: 'Reorder' },
          ]} />
        </div>
        <div>
          <h3 className="font-semibold mb-2">Recent orders</h3>
          <DataTable rows={recentOrders} cols={[
            { key: 'order_no', label: 'No.' },
            { key: 'type', label: 'Type' },
            { key: 'status', label: 'Status' },
            { key: 'total_amount', label: 'Total' },
          ]} />
        </div>
      </div>
    </div>
  );
}
