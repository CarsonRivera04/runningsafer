// app/page.tsx
import { getHealthStatus, getActivityData } from "@/lib/api-client";
import { TestCard } from "@/components/testcard"
import { Hero1 } from "@/components/ui/hero"

export default async function Page() {
  const healthData = await getHealthStatus(); // Fetched on the server
  const activityData = await getActivityData();
  

  return (
    <main>
      <div><Hero1/></div>
      <div><TestCard data={activityData} /></div>
    </main>
  );
}