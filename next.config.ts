import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  i18n: {
    defaultLocale: "fr",
    locales: ["ar", "fr", "en"],
    localeDetection: false,
  },
};

export default nextConfig;
