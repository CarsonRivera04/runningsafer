// app/components/HealthCard.tsx
export function HealthCard({ data }: { data: any }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow duration-200 hover:shadow-md">
      <h2 className="mb-2 text-xl font-bold italic">System Health</h2>
      <pre className="rounded bg-slate-50 p-2 font-mono text-sm text-slate-700">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}