// app/components/HealthCard.tsx
export function HealthCard({ data }: { data: unknown }) {
  return (
    <div>
      <h2>System Health</h2>
      <pre>
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}
