import withSerwistInit from "@serwist/next";
import type { NextConfig } from "next";

const withSerwist = withSerwistInit({
  swSrc: "sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {
  output: process.env.DOCKER_BUILD === "true" ? "standalone" : undefined,
  reactStrictMode: true,
  transpilePackages: ["@piletrack/shared"],
  // typedRoutes: true, // disabled: causes strict typing issues with dynamic paths
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default withSerwist(nextConfig);
