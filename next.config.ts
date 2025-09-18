import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["merchant-logos.monzo.com"],
  },
  experimental: {
    optimizePackageImports: [
      "@/components/atoms",
      "@/components/molecules",
      "@/assets/svgs",
    ],
  },
};

export default nextConfig;
