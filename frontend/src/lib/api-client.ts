const baseUrl = "http://localhost:3000/api/py";

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
 * Because of the Next.js rewrite, the browser automatically forwards 
 * the HttpOnly session cookies to FastAPI.
 */
export async function getCurrentUser() {
  try {
    const res = await fetch(`${baseUrl}/auth/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
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