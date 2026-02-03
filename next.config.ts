import type { NextConfig } from "next";
import withBundleAnalyzer from "@next/bundle-analyzer";

// Cấu hình Analyzer
const analyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  devIndicators: false,

  // Cấu hình ép giảm RAM khi Dev
  experimental: {
    workerThreads: false,
    cpus: 1,
  },

  images: {
    remotePatterns: [
      {
        hostname: "lh3.googleusercontent.com",
        protocol: "https",
      },
      {
        hostname: "jokyo-com-images.b-cdn.net",
        protocol: "https",
      },
    ],
  },
};

// Xuất cấu hình đã được bao bọc bởi analyzer
export default analyzer(nextConfig);
