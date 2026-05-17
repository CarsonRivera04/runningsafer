import { cookies } from "next/headers";

const baseUrl = "http://localhost:3000/api/py";

async function getCookieHeader() {
  return (await cookies()).toString();
}

export async function getHealthStatus() {
  // The rewrite in next.config.ts maps /api/py to http://127.0.0.1:8000
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

export async function getActivityData() {
  try {
    const user = await getCurrentUser();
    if (!user.isAuthenticated) {
      return [];
    }

    const cookieHeader = await getCookieHeader();
    const res = await fetch(`${baseUrl}/auth/activities`, {
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
