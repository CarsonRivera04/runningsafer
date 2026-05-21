// app/page.tsx
import { getHealthStatus, getActivityData } from "@/lib/api-client";
import { TestCard } from "@/components/testcard"
import { Header1 } from "@/components/ui/header";
import { Feature5 } from "@/components/ui/feature5";
import { ActivityImg } from "@/components/activitycard";

export default async function Page() {
  const healthData = await getHealthStatus(); // Fetched on the server
  let activityData = null; 
  try {
    activityData = await getActivityData(1, 6); 
  } catch (error) {
    console.error("Failed to fetch activity data:", error);
  }
  

  return (
    <main>
      <Header1/>
      <Feature5 activities={activityData} />
      <div><ActivityImg polyline={activityData?.[0]?.summary_polyline} /></div>
      <div><TestCard data={activityData} /></div>
    </main>
  );
}