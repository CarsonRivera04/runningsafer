// app/page.tsx
import { getHealthStatus } from "@/lib/api-client";
import { HealthCard } from "@/components/HealthCard";

export default async function Page() {
  const healthData = await getHealthStatus(); // Fetched on the server

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50">
      <HealthCard data={healthData} />
    </main>
  );
}