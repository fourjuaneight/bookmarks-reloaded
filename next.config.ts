import type { NextConfig } from "next";
import { config as loadEnv } from "dotenv";

loadEnv();

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compress: true,
  poweredByHeader: false,
  output: "export",
  trailingSlash: true,
  images: {
    formats: ["image/avif", "image/webp"],
    unoptimized: true,
  },
  compiler: {
    removeConsole: isProd ? { exclude: ["error", "warn"] } : false,
  },
  experimental: {
    scrollRestoration: true,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  env: {
    NEXT_PUBLIC_HOME_URL: process.env.HOME_URL ?? "/",
    NEXT_PUBLIC_GH_URL: process.env.GH_URL ?? "/",
  },
  headers: async () => [
    {
      source: "/:all*(js|css|svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|otf)",
      headers: [
        {
          key: "Cache-Control",
          value: "public, max-age=31536000, immutable",
        },
      ],
    },
  ],
};

export default nextConfig;
