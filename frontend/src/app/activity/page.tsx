import { DetailedView } from "@/components/DetailedView";
import { getActivityDetails } from "@/lib/api-client";
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
        <div>DETAILED VIEW PAGE</div>
        <div>{activityId}</div>
        <DetailedView activity={activityDetails} />
    </main>
  );
}