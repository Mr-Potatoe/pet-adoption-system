import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['*', 'images.pexels.com', '192.168.123.111', 'ultra-pet.co.za'], // This allows all external image sources
  },
};

export default nextConfig;
