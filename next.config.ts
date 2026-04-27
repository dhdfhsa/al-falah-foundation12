import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  experimental: {
    workerThreads: true,
  },
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
