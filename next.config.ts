import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/albertocavasino.it",
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
