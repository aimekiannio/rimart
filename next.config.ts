import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  ...(process.env.GITHUB_PAGES === "true" ? { basePath: "/rimart" } : {}),
  outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;
