import { NextRequest } from "next/server";
import { getCurrentUser, getMapDetails } from "@/lib/api-client";

interface MapDetail {
  name: string;
  highway_type: string;
  sidewalk: string;
  sidewalk_right: string;
  sidewalk_left: string;
  sidewalk_both: string;
  coordinates: [number, number][];
  closest_lat: number;
  closest_lon: number;
  score: number;
}

const getColorByScore = (score: number): string => {
  switch (score) {
    case 1:
      return "#10B981"; 
    case 2:
      return "#FBBF24"; 
    case 3:
      return "#F97316"; 
    case 4:
      return "#EF4444"; 
    default:
      return "#808080"; 
  }
};

const USERNAME = "mapbox";
const STYLE_ID = "streets-v12";
const STROKE_WIDTH = 3;
const STROKE_COLOR = "f44";
const STROKE_OPACITY = 0.5;
const OTHER = "auto";
const WIDTH = 500;
const HEIGHT = 500;

export async function GET(request: NextRequest) {
  const currentUser = await getCurrentUser();
  const accessToken = process.env.MAPBOX_ACCESS_TOKEN;
  const polyline = request.nextUrl.searchParams.get("polyline");

  if (!currentUser.isAuthenticated) {
    return new Response("Unauthorized.", { status: 401 });
  }

  if (!accessToken) {
    return new Response("Mapbox access token is not configured.", {
      status: 500,
    });
  }

  if (!polyline) {
    return new Response("Missing polyline.", { status: 400 });
  }

  let mapDetails: MapDetail[] | null = null;
  try {
    mapDetails = await getMapDetails(polyline);
  } catch (error) {
    console.error("Error fetching map details:", error);
  }

  const geojson = mapDetails?.length
    ? {
      type: "FeatureCollection" as const,
      features: Array.from({ length: Math.min(10, mapDetails.length) }, (_, i) => {
        const step = mapDetails.length / Math.min(20, mapDetails.length);
        const targetIndex = Math.floor(i * step);
        return mapDetails[targetIndex];
      }).map((obj) => ({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [obj.closest_lon, obj.closest_lat],
        },
        properties: {
          "marker-color": getColorByScore(obj.score),
          "marker-size": "small",
          "marker-symbol": "triangle-stroked",
        },
      })),
    }
    : null;

  const encodedPolyline = encodeURIComponent(polyline);
  const path = `path-${STROKE_WIDTH}+${STROKE_COLOR}-${STROKE_OPACITY}(${encodedPolyline})`;
  const overlay = geojson
    ? `${path},geojson(${encodeURIComponent(JSON.stringify(geojson))})`
    : path;
  const mapboxImageUrl = `https://api.mapbox.com/styles/v1/${USERNAME}/${STYLE_ID}/static/${overlay}/${OTHER}/${WIDTH}x${HEIGHT}?access_token=${accessToken}`;
  const mapboxResponse = await fetch(mapboxImageUrl, {
    next: { revalidate: 60 * 60 * 24 },
  });

  if (!mapboxResponse.ok || !mapboxResponse.body) {
    return new Response("Failed to fetch map image.", {
      status: mapboxResponse.status,
    });
  }

  return new Response(mapboxResponse.body, {
    status: mapboxResponse.status,
    headers: {
      "Cache-Control": "private, max-age=86400",
      "Content-Type":
        mapboxResponse.headers.get("Content-Type") ?? "image/png",
    },
  });
}
