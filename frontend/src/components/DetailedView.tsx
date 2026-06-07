import { Feature1 } from "@/components/ui/feature1";
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
                                className="overflow-hidden rounded-md border bg-white"
                            >
                                <details>
                                    <summary className="flex cursor-pointer list-none items-center gap-3 p-4 font-semibold marker:hidden [&::-webkit-details-marker]:hidden">
                                        <span
                                            className="h-4 w-4 shrink-0 rounded-full border border-black/15"
                                            style={{ backgroundColor: getColorByScore(detail.score) }}
                                            aria-label={`Safety score ${detail.score} color`}
                                        />
                                        <span>{detail.name || "Unnamed street"}</span>
                                    </summary>
                                    <div className="space-y-2 border-t px-4 py-3 text-sm">
                                        <p>Safety Score: {detail.score}</p>
                                        <p>Road Type: {detail.highway_type}</p>
                                        {detail.highway_caption && <p>{detail.highway_caption}</p>}
                                    </div>
                                </details>
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
