// app/page.tsx
import { getHealthStatus } from "@/lib/api-client";
import { HealthCard } from "@/components/HealthCard";
import { Hero1 } from "@/components/ui/hero"

export default async function Page() {
  const healthData = await getHealthStatus(); // Fetched on the server
      // <HealthCard data={healthData} />

  return (
    <main>
      <div><Hero1/></div>
    </main>
  );
}