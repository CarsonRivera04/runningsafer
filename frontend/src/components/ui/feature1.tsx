import { ChartNoAxesColumnIncreasing, Hourglass, ShieldCheck, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MoveLeft } from "lucide-react";
import { ActivityImgAlt } from "@/components/ActivityImgAlt";
import { formatMinutesSeconds } from "@/lib/format-activity";
import { getAverageSafetyRank, getColorByScore, getMapMarkers, type MapDetail } from "@/lib/map-details";
import { Activity } from "./feature5";

export const Feature1 = ({
  polyline,
  mapDetails,
  activity
}: {
  polyline: string;
  mapDetails: MapDetail[];
  activity: Activity;
}) => {
  const averageSafetyRank = getAverageSafetyRank(mapDetails);
  const averageSafetyRankLabel = averageSafetyRank?.toFixed(1) ?? "N/A";
  const averageSafetyRankColor = getColorByScore(Math.round(averageSafetyRank ?? 0));

  return (
    <div className="w-full py-20 px-4 sm:px-6 lg:py-40">
      <div className="container mx-auto">
        <div className="grid border rounded-lg container py-8 px-4 sm:px-6 grid-cols-1 gap-8 items-center lg:grid-cols-2">
          <div className="flex gap-10 flex-col">
            <div className="flex gap-4 flex-col">
              <div className="flex px-4 sm:px-6 gap-2 flex-col">
                <Link href="/">
                  <Button>
                    <MoveLeft className="w-4 h-4" /> Back
                  </Button>
                </Link>
                <h2 className="text-3xl lg:text-5xl tracking-tighter max-w-xl text-left font-regular">
                  {activity.name}
                </h2>
                <p className="text-lg leading-relaxed tracking-tight text-muted-foreground max-w-xl text-left">
                  {activity.type} on {new Date(activity.start_date).toLocaleString()} 
                </p>
              </div>
            </div>
            <div className="grid lg:pl-6 grid-cols-1 sm:grid-cols-3 items-start lg:grid-cols-1 gap-6">
              <div className="flex flex-row gap-6 items-start">
                <ShieldCheck className="w-4 h-4 mt-2 text-primary" />
                <div className="flex flex-col gap-1">
                  <p>Average safety rank</p>
                  <div className="flex flex-wrap items-center gap-2 text-muted-foreground text-sm">
                    <span
                      className="h-3 w-3 shrink-0 rounded-full border border-black/15"
                      style={{ backgroundColor: averageSafetyRankColor }}
                      aria-label={`Average safety rank ${averageSafetyRankLabel} color`}
                    />
                    <span>
                      {averageSafetyRank === null
                        ? "No segment ranks available"
                        : `${averageSafetyRankLabel}/10 across ${mapDetails.length} segments`}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-row gap-6 items-start">
                <ChartNoAxesColumnIncreasing className="w-4 h-4 mt-2 text-primary" />
                <div className="flex flex-col gap-1">
                  <p>Distance (km / mi)</p>
                  <p className="text-muted-foreground text-sm">
                    {(activity.distance / 1000).toFixed(2)} km / {(activity.distance / 1609.34).toFixed(2)} mi
                  </p>
                </div>
              </div>
              <div className="flex flex-row gap-6 items-start">
                <Hourglass className="w-4 h-4 mt-2 text-primary" />
                <div className="flex flex-col gap-1">
                  <p>Moving time / Elapsed time</p>
                  <p className="text-muted-foreground text-sm">
                    {formatMinutesSeconds(activity.moving_time)} / {formatMinutesSeconds(activity.elapsed_time)}
                  </p>
                </div>
              </div>
              <div className="flex flex-row gap-6 items-start">
                <Timer className="w-4 h-4 mt-2 text-primary" />
                <div className="flex flex-col gap-1">
                  <p>Pace (min/km / min/mi)</p>
                  <p className="text-muted-foreground text-sm">
                    {formatMinutesSeconds(activity.moving_time / (activity.distance / 1000))} min/km / {formatMinutesSeconds(activity.moving_time / (activity.distance / 1609.34))} min/mi
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-muted rounded-md">
            <ActivityImgAlt polyline={polyline} markers={getMapMarkers(mapDetails)} />
          </div>
        </div>
      </div>
    </div>
  );
};
