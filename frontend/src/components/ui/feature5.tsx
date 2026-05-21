import { Badge } from "@/components/ui/badge";
import { ActivityImg } from "@/components/ActivityImg";

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

export interface Feature5Props {
    activities: Activity[];
}

export const Feature5 = ({ activities }: Feature5Props) => {
    return (
        <div className="w-full py-20 px-4 sm:px-6 lg:py-40">
            <div className="container mx-auto">
                <div className="flex flex-col gap-10">
                    <div className="flex gap-4 flex-col items-start">
                        <div>
                            <Badge>Platform</Badge>
                        </div>
                        <div className="flex gap-2 flex-col">
                            <h2 className="text-3xl md:text-5xl tracking-tighter max-w-xl font-regular text-left">
                                Something new!
                            </h2>
                            <p className="text-lg max-w-xl lg:max-w-lg leading-relaxed tracking-tight text-muted-foreground text-left">
                                Managing a small business today is already tough.
                            </p>
                        </div>
                    </div>
                    
                    {/* 2. Dynamically mapping over the activities array */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {activities?.map((activity) => (
                            <div key={activity.id} className="flex flex-col gap-2">
                                <div className="bg-muted rounded-md aspect-video mb-2">
                                    <ActivityImg polyline={activity.summary_polyline} />
                                </div>
                                <h3 className="text-xl tracking-tight">{activity.name}</h3>
                                <p className="text-muted-foreground text-base">
                                    {activity.distance} meters - {activity.type} on {new Date(activity.start_date).toLocaleDateString()}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};