import { ActivityImg } from "@/components/ActivityImg";
import { ActivityPagination } from "@/components/ui/activity-pagination";
import { LoaderCircle } from "lucide-react";

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
    page: number;
    perPage: number;
    name?: string;
}

export const Feature5 = ({ activities, page, perPage, name }: Feature5Props) => {
    const hasPreviousPage = page > 1;
    const hasNextPage = activities.length === perPage;

    return (
        <div className="w-full py-20 px-4 sm:px-6 lg:py-40">
            <div className="container mx-auto">
                <div className="flex flex-col gap-10">
                    <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                        <div className="flex gap-4 flex-col items-start">
                            <div className="flex gap-2 flex-col">
                                <h2 className="text-3xl md:text-5xl tracking-tighter max-w-xl font-regular text-left mt-2">
                                    {name ? `Welcome, ${name}!` : "Welcome!"}
                                </h2>
                                <p className="text-lg max-w-xl lg:max-w-lg leading-relaxed tracking-tight text-muted-foreground text-left">
                                    Evaluate the safety of your recent Strava activities.
                                </p>
                            </div>
                        </div>

                        <ActivityPagination
                            page={page}
                            hasPreviousPage={hasPreviousPage}
                            hasNextPage={hasNextPage}
                        />
                    </div>

                    {/* 2. Dynamically mapping over the activities array */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {activities?.map((activity) => (
                            <div key={activity.id} className="flex flex-col gap-2">
                                <div className="bg-muted rounded-md aspect-video mb-2 flex items-center justify-center overflow-hidden">
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

export function Feature5Loading({ name }: { name?: string }) {
    return (
        <div className="w-full py-20 px-4 sm:px-6 lg:py-40">
            <div className="container mx-auto">
                <div className="flex flex-col gap-10">
                    <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                        <div className="flex gap-4 flex-col items-start">
                            <div className="flex gap-2 flex-col">
                                <h2 className="text-3xl md:text-5xl tracking-tighter max-w-xl font-regular text-left mt-2">
                                    {name ? `Welcome, ${name}!` : "Welcome!"}
                                </h2>
                                <p className="text-lg max-w-xl lg:max-w-lg leading-relaxed tracking-tight text-muted-foreground text-left">
                                    Evaluate the safety of your recent Strava activities.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div
                        className="flex min-h-72 flex-col items-center justify-center gap-3 rounded-md border border-dashed border-border bg-background/60 text-muted-foreground"
                        role="status"
                        aria-live="polite"
                    >
                        <LoaderCircle className="size-8 animate-spin text-foreground" />
                        <span className="text-sm">Loading activities...</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
