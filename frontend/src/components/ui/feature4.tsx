import { ChartNoAxesColumnIncreasing, Hourglass, Timer } from "lucide-react";
import Image from  "next/image";
import { formatMinutesSeconds } from "@/lib/format-activity";
import { getColorByScore, type MapDetail } from "@/lib/map-details";

const sampleActivity = {
  name: "Evening River Run",
  type: "Run",
  distance: 4880,
  moving_time: 1624,
  elapsed_time: 1934,
  start_date: "6/7/2026, 7:30:00 PM",
};

const sampleMapDetails: MapDetail[] = [
  {
    name: "Albany Street",
    highway_type: "secondary",
    highway_caption: "The next most important roads in a country's system. (Often link towns.)",
    sidewalk: "both",
    sidewalk_caption: "Dedicated pedestrian space on both sides.",
    sidewalk_right: "yes",
    sidewalk_left: "yes",
    sidewalk_both: "yes",
    coordinates: [],
    closest_lat: 41.881,
    closest_lon: -87.616,
    score: 7,
  },
  {
    name: "Hamilton Street",
    highway_type: "tertiary",
    highway_caption: "The next most important roads in a country's system. (Often link smaller towns and villages)",
    sidewalk: "right",
    sidewalk_caption: "Sidewalk present on one side only.",
    sidewalk_right: "yes",
    sidewalk_left: "no",
    sidewalk_both: "no",
    coordinates: [],
    closest_lat: 41.883,
    closest_lon: -87.622,
    score: 6,
  },
  {
    name: "Johnson Drive",
    highway_type: "tertiary",
    highway_caption: "The next most important roads in a country's system. (Often link smaller towns and villages)",
    sidewalk: "both",
    sidewalk_caption: "Sidewalks available, but crossings are busier.",
    sidewalk_right: "yes",
    sidewalk_left: "yes",
    sidewalk_both: "yes",
    coordinates: [],
    closest_lat: 41.879,
    closest_lon: -87.629,
    score: 6,
  },
];

export const Feature4 = () => (
  <div className="w-full py-20 px-4 sm:px-6 lg:py-40">
    <div className="container mx-auto">
      <div className="flex flex-col lg:flex-row gap-10 lg:items-start">
        <div className="flex gap-4 flex-col flex-1">
          <div className="flex gap-2 flex-col">
            <h2 className="text-xl md:text-3xl md:text-5xl tracking-tighter lg:max-w-xl font-regular text-left">
              Running Safer
            </h2>
            <p className="text-lg max-w-xl lg:max-w-sm leading-relaxed tracking-tight text-muted-foreground text-left">
              Connect your Strava account to Running Safer and get personalized safety insights based on your running and walking activities. 
            </p>
          </div>
          <a href="/api/py/auth/login">
            <Image 
              src="/images/btn_strava_connect.png" 
              alt="Connect with Strava" 
              width={200} 
              height={50} 
              priority
              className="w-48 h-auto"/>
          </a>
        </div>
        <div className="w-full flex-[1.35] rounded-md border bg-white p-4 shadow-sm sm:p-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_220px]">
            <div className="flex min-w-0 flex-col gap-5">
              <div className="flex flex-col gap-1">
                <p className="text-sm text-muted-foreground">{sampleActivity.type} on {sampleActivity.start_date}</p>
                <h3 className="text-2xl font-semibold tracking-tight">{sampleActivity.name}</h3>
              </div>
              <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
                <div className="flex items-start gap-3">
                  <ChartNoAxesColumnIncreasing className="mt-1 size-4 shrink-0 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Distance</p>
                    <p className="text-sm text-muted-foreground">
                      {(sampleActivity.distance / 1000).toFixed(2)} km / {(sampleActivity.distance / 1609.34).toFixed(2)} mi
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Hourglass className="mt-1 size-4 shrink-0 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Moving / elapsed</p>
                    <p className="text-sm text-muted-foreground">
                      {formatMinutesSeconds(sampleActivity.moving_time)} / {formatMinutesSeconds(sampleActivity.elapsed_time)}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Timer className="mt-1 size-4 shrink-0 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Pace</p>
                    <p className="text-sm text-muted-foreground">
                      {formatMinutesSeconds(sampleActivity.moving_time / (sampleActivity.distance / 1000))} min/km / {formatMinutesSeconds(sampleActivity.moving_time / (sampleActivity.distance / 1609.34))} min/mi
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mx-auto w-full max-w-[220px] overflow-hidden rounded-md bg-muted">
              <Image 
                src="/images/demo_img.png" 
                alt="Sample Safety Map" 
                width={500} 
                height={500} 
                priority
                className="h-auto w-full"
              />
            </div>
          </div>
          <section className="mt-6">
            <h3 className="mb-3 text-lg font-semibold">Map Safety Details</h3>
            <ul className="space-y-3">
              {sampleMapDetails.map((detail) => (
                <li
                  key={`${detail.name}-${detail.score}`}
                  className="overflow-hidden rounded-md border bg-white"
                >
                  <details>
                    <summary className="flex cursor-pointer list-none items-center gap-3 p-4 text-sm font-semibold marker:hidden [&::-webkit-details-marker]:hidden">
                      <span
                        className="size-4 shrink-0 rounded-full border border-black/15"
                        style={{ backgroundColor: getColorByScore(detail.score) }}
                        aria-label={`Safety rank ${detail.score} color`}
                      />
                      <span>{detail.name}</span>
                    </summary>
                    <div className="space-y-2 border-t px-4 py-3 text-sm text-muted-foreground">
                      <p>Safety Rank: {detail.score}/10</p>
                      <p>Road Type: {detail.highway_type}</p>
                      {detail.highway_caption && <p>{detail.highway_caption}</p>}
                      {detail.sidewalk_caption && <p>{detail.sidewalk_caption}</p>}
                    </div>
                  </details>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  </div>
);
