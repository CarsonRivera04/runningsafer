import { ActivityImg } from "@/components/ActivityImg";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

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
    const previousPage = Math.max(page - 1, 1);
    const nextPage = page + 1;

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

                        <div className="flex items-center gap-2">
                            {hasPreviousPage ? (
                                <Button asChild variant="outline">
                                    <Link href={`/?page=${previousPage}`} aria-label="Show previous 6 activities">
                                        <ChevronLeft />
                                        Previous
                                    </Link>
                                </Button>
                            ) : (
                                <Button variant="outline" disabled aria-label="Show previous 6 activities">
                                    <ChevronLeft />
                                    Previous
                                </Button>
                            )}
                            <span className="min-w-16 text-center text-sm text-muted-foreground">
                                Page {page}
                            </span>
                            {hasNextPage ? (
                                <Button asChild variant="outline">
                                    <Link href={`/?page=${nextPage}`} aria-label="Show next 6 activities">
                                        Next
                                        <ChevronRight />
                                    </Link>
                                </Button>
                            ) : (
                                <Button variant="outline" disabled aria-label="Show next 6 activities">
                                    Next
                                    <ChevronRight />
                                </Button>
                            )}
                        </div>
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
