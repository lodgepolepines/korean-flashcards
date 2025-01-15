import type { NextConfig } from "next";
import crypto from "crypto";

// Hash the password at build time
const correctPasswordHash = crypto
  .createHash('sha256')
  .update(process.env.CORRECT_PASSWORD || '')
  .digest('hex');

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  assetPrefix: isProd ? '/chinese-flashcards/' : '',
  basePath: isProd ? '/chinese-flashcards' : '',
  output: 'export',
  env: {
    CORRECT_PASSWORD_HASH: correctPasswordHash,
    NEXT_PUBLIC_API_URL: 'https://korean-flashcards.vercel.app'
  }
};

export default nextConfig;