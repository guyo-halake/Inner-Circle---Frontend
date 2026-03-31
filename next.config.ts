import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "static.thenounproject.com",
      },
    ],
  },
};

export default nextConfig;
