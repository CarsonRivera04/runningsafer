import { Feature1 } from "@/components/ui/feature1";
import { formatMinutesSeconds } from "@/lib/format-activity";
import type { MapDetail } from "@/lib/map-details";
import { getColorByScore } from "@/lib/map-details";

export interface Activity {
    id: number;
    name: string;
    type: string;
    distance: number;
    moving_time: number;
    elapsed_time: number;
    start_date: string;
    summary_polyline: string;
    coordinates: [number, number][];
}

export const DetailedView = ({
    activity,
    mapDetails,
}: {
    activity: Activity;
    mapDetails: MapDetail[];
}) => {
    return ( 
        <div className="w-full py-20 px-4 sm:px-6lg:py-40">
            <Feature1 polyline={activity.summary_polyline} mapDetails={mapDetails} activity={activity}/>
            <section className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Map Safety Details</h2>
                {mapDetails.length ? (
                    <ul className="space-y-4">
                        {mapDetails.map((detail, index) => (
                            <li
                                key={`${detail.closest_lat}-${detail.closest_lon}-${index}`}
                                className="border rounded-md p-4"
                                style={{ backgroundColor: getColorByScore(detail.score) }}
                            >
                                <h3 className="font-semibold">{detail.name}</h3>
                                <p>Safety Score: {detail.score}</p>
                                <p>Road Type: {detail.highway_type}</p>
                                {detail.highway_caption && <p>{detail.highway_caption}</p>}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No map details found for this activity.</p>
                )}
            </section>
        </div>
    )
}
