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
        <>
        </>
    )
}