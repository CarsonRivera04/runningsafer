import { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/api-client";

const USERNAME = "mapbox";
const STYLE_ID = "streets-v12";
const STROKE_WIDTH = 3;
const STROKE_COLOR = "f44";
const STROKE_OPACITY = 1;
const OTHER = "auto";
const WIDTH = 500;
const HEIGHT = 300;

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

  const encodedPolyline = encodeURIComponent(polyline);
  const overlay = `path-${STROKE_WIDTH}+${STROKE_COLOR}-${STROKE_OPACITY}(${encodedPolyline})`;
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
