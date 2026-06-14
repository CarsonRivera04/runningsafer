import { cookies } from "next/headers";
import type { MapDetail } from "@/lib/map-details";

const appBaseUrl = (
  process.env.APP_BASE_URL ||
  process.env.NEXT_PUBLIC_APP_BASE_URL ||
  "http://localhost:3000"
).replace(/\/$/, "");
const baseUrl = `${appBaseUrl}/api/py`;

async function getCookieHeader() {
  return (await cookies()).toString();
}

export async function getHealthStatus() {
  const res = await fetch(`${baseUrl}/health/healthcheck`, {
    cache: 'no-store' // Ensures you get fresh data on every reload
  });

  if (!res.ok) throw new Error("Failed to fetch health status");
  return res.json();
}

/**
 * Checks if the current user has a valid backend session.
 * Server components need to forward the incoming HttpOnly cookies explicitly.
 */
export async function getCurrentUser() {
  try {
    const cookieHeader = await getCookieHeader();
    const res = await fetch(`${baseUrl}/auth/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      cache: 'no-store' // Always bypass cache for auth checks
    });

    if (!res.ok) {
      // Return unauthenticated state if 401 or any other failure occurs
      return { isAuthenticated: false, user: null };
    }

    return await res.json();
  } catch (error) {
    console.error("Auth check failed:", error);
    return { isAuthenticated: false, user: null };
  }
}

export async function getActivityData(page: number = 1, perPage: number = 30) {
  try {
    const user = await getCurrentUser();
    if (!user.isAuthenticated) {
      return [];
    }

    const cookieHeader = await getCookieHeader();

    const params = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
    });

    const res = await fetch(`${baseUrl}/strava/activities?${params.toString()}`, {
      method: 'GET', 
      cache: 'no-store',
      headers: {
        'accept': 'application/json',
        Cookie: cookieHeader,
      }
    });
    if (res.status === 401) return [];
    if (!res.ok) throw new Error("Failed to fetch activity data");
    return res.json();
  }
  catch (error) {
    console.error("Failed to fetch activity data:", error);
    throw error;
  }
}

export async function getActivityDetails(activityId: number) {
  try {
    const user = await getCurrentUser();
    if (!user.isAuthenticated) {
      return null;
    }
    const cookieHeader = await getCookieHeader();
    const res = await fetch(`${baseUrl}/strava/activities/${activityId}`, {
      method: 'GET',
      cache: 'no-store',
      headers: {
        'accept': 'application/json',
        Cookie: cookieHeader,
      }
    });
    if (!res.ok) throw new Error("Failed to fetch activity details");
    return res.json();
  }
  catch (error) {
    console.error("Failed to fetch activity details:", error);
    throw error;
  }
}

export async function getMapDetails(summaryPolyline: string, radius_meters: number = 15): Promise<MapDetail[] | null> {
  try {
    const user = await getCurrentUser();
    if (!user.isAuthenticated) {
      return null;
    }

    const cookieHeader = await getCookieHeader();
    const params = new URLSearchParams();
    params.append('summary_polyline', summaryPolyline);
    params.append('radius_meters', radius_meters.toString());
    const res = await fetch(`${baseUrl}/strava/details?${params.toString()}`, {
      method: 'GET', 
      cache: 'no-store',
      headers: {
        'accept': 'application/json',
        Cookie: cookieHeader,
      }
    });

    if (!res.ok) {
      throw new Error("Failed to fetch map details");
    }
    return res.json();
  }
  catch (error) {
    console.error("Failed to fetch map details", error);
    throw error;
  }
}
