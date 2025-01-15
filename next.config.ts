import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export', // Enable static export
  trailingSlash: true, // Helps with GitHub Pages routing
  
  // Configure basePath for GitHub Pages
  basePath: process.env.GITHUB_PAGES ? '/korean-flashcards' : '',
  assetPrefix: process.env.GITHUB_PAGES ? '/korean-flashcards/' : '',

  // Ensure API calls can handle different environments
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  }
};

module.exports = nextConfig;