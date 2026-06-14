// middleware.ts (placed in your project root)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const backendBaseUrl = (
  process.env.BACKEND_BASE_URL || "http://127.0.0.1:8000"
).replace(/\/$/, "");

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // skip middleware logic for Next.js internal files, api routes, and the login page
  if (
    pathname.startsWith('/_next') || 
    pathname.startsWith('/api') || 
    pathname === '/login'
  ) {
    return NextResponse.next();
  }

  // protect exactly the root page OR anything starting with /temppage
  const isProtectedRoute = pathname === '/' || pathname.startsWith('/temppage');

  if (isProtectedRoute) {
    // extract cookies from the incoming request
    const cookieHeader = request.headers.get('cookie') || '';

    // forward the request to your FastAPI backend server directly
    try {
      const authResponse = await fetch(`${backendBaseUrl}/api/py/auth/me`, {
        headers: {
          'Cookie': cookieHeader // Hand off cookies so FastAPI knows who this is
        },
        cache: 'no-store'
      });

      // if backend says no, kick them back to login page
      if (!authResponse.ok) {
        return NextResponse.redirect(new URL('/login', request.url));
      }
    } catch (err) {
      // backend down or error fetching? Safely redirect to login
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

// limit the middleware to run only on these specific routes for optimal performance
export const config = {
  matcher: ['/', '/temppage/:path*'],
};
