import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  assetPrefix: isProd ? '/korean-flashcards/' : '',
  basePath: isProd ? '/korean-flashcards' : '',
  output: 'export',
  env: {
    NEXT_PUBLIC_API_URL: 'https://korean-flashcards.vercel.app/api'  // Make sure to add /api
  }
};

export default nextConfig;