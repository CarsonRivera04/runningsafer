export function TestCard({ data }: { data: unknown }) {
  return (
    <div>
      <h2>Activity Data</h2>
      <pre>
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}
