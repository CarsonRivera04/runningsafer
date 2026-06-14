import type { NextConfig } from "next";

const backendBaseUrl = (
  process.env.BACKEND_BASE_URL || "http://127.0.0.1:8000"
).replace(/\/$/, "");

const nextConfig: NextConfig = {
  /* config options here */
  rewrites: async () => {
    return [
      {
        source: "/api/py/:path*",
        destination: `${backendBaseUrl}/api/py/:path*`,
      },
      {
        source: "/docs",
        destination: `${backendBaseUrl}/api/py/docs`,
      },
      {
        source: "/openapi.json",
        destination: `${backendBaseUrl}/api/py/openapi.json`,
      },
    ];
  },
};

export default nextConfig;
