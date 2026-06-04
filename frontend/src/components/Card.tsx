export default function Card({ title, value, hint }: { title: string; value: string | number; hint?: string }) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5">
      <div className="text-xs uppercase text-slate-500">{title}</div>
      <div className="text-2xl font-semibold mt-2">{value}</div>
      {hint && <div className="text-xs text-slate-400 mt-1">{hint}</div>}
    </div>
  );
}
