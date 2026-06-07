import { Feature1 } from "@/components/ui/feature1";
import { formatMinutesSeconds } from "@/lib/format-activity";
import type { MapDetail } from "@/lib/map-details";
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
            <h1>{activity.name}</h1>
            <p>Type: {activity.type}</p>
            <p>Distance: {(activity.distance / 1000).toFixed(2)} km</p>
            <p>Moving Time: {formatMinutesSeconds(activity.moving_time)}</p>
            <p>Elapsed Time: {formatMinutesSeconds(activity.elapsed_time)}</p>
            <p>Start Date: {new Date(activity.start_date).toLocaleString()}</p>
            <p>Summary Polyline: {activity.summary_polyline}</p>
            <p>Coordinates: {JSON.stringify(activity.coordinates)}</p>
            <section className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Map Details</h2>
                {mapDetails.length ? (
                    <ul className="space-y-4">
                        {mapDetails.map((detail, index) => (
                            <li key={`${detail.closest_lat}-${detail.closest_lon}-${index}`} className="border rounded-md p-4">
                                <h3 className="font-semibold">{detail.name}</h3>
                                <p>Safety Score: {detail.score}</p>
                                <p>Road Type: {detail.highway_type}</p>
                                {detail.highway_caption && <p>{detail.highway_caption}</p>}
                                <p>Sidewalk: {detail.sidewalk}</p>
                                {detail.sidewalk_caption && <p>{detail.sidewalk_caption}</p>}
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
