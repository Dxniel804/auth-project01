import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh7-rt.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'media-cdn.tripadvisor.com',
      },
    ],
  },
};

export default nextConfig;
