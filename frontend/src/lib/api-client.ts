const baseUrl = "http://localhost:3000/api/py";

export async function getHealthStatus() {
  // The rewrite in next.config.ts maps /api/py to http://127.0.0.1:8000
  const res = await fetch(`${baseUrl}/health/healthcheck`, {
    cache: 'no-store' // Ensures you get fresh data on every reload
  });
  
  if (!res.ok) throw new Error("Failed to fetch health status");
  return res.json();
}