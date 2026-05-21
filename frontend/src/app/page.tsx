// app/page.tsx
import { getActivityData } from "@/lib/api-client";
import { TestCard } from "@/components/testcard"
import { Header1 } from "@/components/ui/header";
import { Feature5 } from "@/components/ui/feature5";

export default async function Page() {
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
      <div><TestCard data={activityData} /></div>
    </main>
  );
}