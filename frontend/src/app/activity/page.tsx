import { DetailedView } from "@/components/DetailedView";
import { getActivityDetails, getMapDetails } from "@/lib/api-client";
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

    let activityDetails = null;
    try {
        activityDetails = await getActivityDetails(Number(activityId));
    } catch (error) {
        console.error("Error fetching activity details:", error);
    }

    if (!activityDetails) {
        return (
            <main>
                <div>Activity not found or you are not authorized to view it.</div>
            </main>
        );
    }
    let mapDetails = null;
    try {
        mapDetails = await getMapDetails(activityDetails.summary_polyline);
    }
    catch (error) {
        console.error("Error fetching map details:", error);
    }

    if (!mapDetails) {
        return (
            <main>
                <Header1 />
                <div>Failed to fetch map details.</div>
            </main>
        );
    }

  return (
    <main>
        <Header1 />
        <DetailedView activity={activityDetails} />
        <div>
            <h2 className="text-2xl font-bold mb-4">Map Details</h2>
            <pre className="bg-gray-100 p-4 rounded">{JSON.stringify(mapDetails, null, 2)}</pre>
        </div>
    </main>
  );
}