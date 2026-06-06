import { DetailedView } from "@/components/DetailedView";
import { getActivityDetails, getMapDetails } from "@/lib/api-client";
import { Header1 } from "@/components/ui/header";
import type { MapDetail } from "@/lib/map-details";

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

    let mapDetails: MapDetail[] = [];
    try {
        mapDetails = await getMapDetails(activityDetails.summary_polyline) ?? [];
    } catch (error) {
        console.error("Error fetching map details:", error);
    }

  return (
    <main>
        <Header1 />
        <DetailedView activity={activityDetails} mapDetails={mapDetails} />
    </main>
  );
}
