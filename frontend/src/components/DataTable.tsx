'use client';
type Col<T> = { key: keyof T | string; label: string; render?: (row: T) => any };
export default function DataTable<T extends Record<string, any>>({ rows, cols }: { rows: T[]; cols: Col<T>[] }) {
  return (
    <div className="overflow-x-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50 dark:bg-slate-800">
          <tr>{cols.map(c => <th key={String(c.key)} className="text-left px-4 py-2 font-medium">{c.label}</th>)}</tr>
        </thead>
        <tbody>
          {rows.length === 0 && <tr><td colSpan={cols.length} className="px-4 py-6 text-center text-slate-500">No data</td></tr>}
          {rows.map((r, i) => (
            <tr key={i} className="border-t border-slate-100 dark:border-slate-800">
              {cols.map(c => <td key={String(c.key)} className="px-4 py-2">{c.render ? c.render(r) : String(r[c.key as keyof T] ?? '')}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
