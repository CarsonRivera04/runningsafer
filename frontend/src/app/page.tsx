import { getHealthStatus } from "@/lib/api-client";

export default async function HomePage() {
  const data = await getHealthStatus();

  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Frontend + FastAPI Connection</h1>
      <div style={{ 
        padding: '1rem', 
        border: '1px solid #ccc', 
        borderRadius: '8px',
        backgroundColor: data.status === 'ok' ? '#e6fffa' : '#fff5f5'
      }}>
        <p><strong>Message from Backend:</strong> {data.message}</p>
        <p><strong>Status:</strong> {data.status}</p>
      </div>
    </main>
  );
}