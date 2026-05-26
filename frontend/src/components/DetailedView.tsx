import { Feature1 } from "@/components/ui/feature1";
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

export const DetailedView = ({activity}: {activity: Activity}) => {
    return ( 
        <div className="w-full py-20 px-4 sm:px-6lg:py-40">
            <Feature1 polyline={activity.summary_polyline} />
            <h1>{activity.name}</h1>
            <p>Type: {activity.type}</p>
            <p>Distance: {(activity.distance / 1000).toFixed(2)} km</p>
            <p>Moving Time: {(activity.moving_time / 60).toFixed(2)} minutes</p>
            <p>Elapsed Time: {(activity.elapsed_time / 60).toFixed(2)} minutes</p>
            <p>Start Date: {new Date(activity.start_date).toLocaleString()}</p>
            <p>Summary Polyline: {activity.summary_polyline}</p>
            <p>Coordinates: {JSON.stringify(activity.coordinates)}</p>
        </div>
    )
}
