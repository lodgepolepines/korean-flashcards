import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';
const nextConfig: NextConfig = {
  output: 'export', // Enable static export
  trailingSlash: true, // Helps with GitHub Pages routing
  reactStrictMode: true,
  images: {
    unoptimized: true, // Disable default image optimization
  },  
  // Configure basePath for GitHub Pages
  assetPrefix: isProd ? '/korean-flashcards/' : '',
  basePath: isProd ? '/korean-flashcards' : '',
};

module.exports = nextConfig;