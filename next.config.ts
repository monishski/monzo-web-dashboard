import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname, ".."),
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "merchant-logos.monzo.com" },
    ],
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
