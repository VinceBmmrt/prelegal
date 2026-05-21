import type { NextConfig } from "next";

// Docker builds set NEXT_OUTPUT=export to produce static files served by FastAPI.
// In development, Next.js runs as a server and proxies /api/* to the FastAPI backend.
const isStaticBuild = process.env.NEXT_OUTPUT === "export";
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8000";

const nextConfig: NextConfig = {
  reactCompiler: true,
  ...(isStaticBuild
    ? { output: "export" }
    : {
        async rewrites() {
          return [
            {
              source: "/api/:path*",
              destination: `${BACKEND_URL}/api/:path*`,
            },
          ];
        },
      }),
};

export default nextConfig;
