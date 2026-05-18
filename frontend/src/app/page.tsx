// app/page.tsx
import { getHealthStatus, getActivityData } from "@/lib/api-client";
import { TestCard } from "@/components/testcard"
import { Hero1 } from "@/components/ui/hero"
import { Header1 } from "@/components/ui/header";

export default async function Page() {
  const healthData = await getHealthStatus(); // Fetched on the server
  let activityData = null; 
  try {
    activityData = await getActivityData(1, 5); 
  } catch (error) {
    console.error("Failed to fetch activity data:", error);
  }
  

  return (
    <main>
      <Header1/>
      <div><Hero1/></div>
      <div><TestCard data={activityData} /></div>
    </main>
  );
}