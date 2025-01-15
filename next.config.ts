import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true, // Disable default image optimization
  },
  assetPrefix: isProd ? '/chinese-flashcards/' : '',
  basePath: isProd ? '/chinese-flashcards' : '',
  output: 'export'
};

export default nextConfig;