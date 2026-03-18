import type { NextConfig } from "next";

// Use static export only when building on Netlify (NETLIFY env var is set
// automatically by the Netlify build environment). Locally, Next.js runs as a
// normal dev server so the /api/chat route handler is available without needing
// the Netlify edge functions runtime.
const isNetlify = Boolean(process.env.NETLIFY);

const nextConfig: NextConfig = {
  output: isNetlify ? "export" : undefined,
  productionBrowserSourceMaps: false,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
