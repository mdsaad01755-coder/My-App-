import type { NextConfig } from "next";

const repoName = "My-App-";
const basePath = `/${repoName}`;

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
