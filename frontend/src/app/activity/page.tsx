import { DetailedView } from "@/components/DetailedView";
import { getActivityDetails } from "@/lib/api-client";
import { Header1 } from "@/components/ui/header";

export default async function Page({ searchParams }: { searchParams: Promise<{ activityId: string }> }) {
    const { activityId } = await searchParams;

    if (!activityId) {
        return (
            <main>
                <div>Invalid activity ID</div>
            </main>
        );
    }

    const activityDetails = await getActivityDetails(Number(activityId));
    if (!activityDetails) {
        return (
            <main>
                <div>Activity not found or you are not authorized to view it.</div>
            </main>
        );
    }

  return (
    <main>
        <Header1 />
        <DetailedView activity={activityDetails} />
    </main>
  );
}