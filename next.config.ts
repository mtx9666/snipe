import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    domains: ['solscan.io'], // Add any other domains you might be loading images from
  },
  // Ensure environment variables are available
  env: {
    NEXT_PUBLIC_SOLANA_RPC_URL: process.env.NEXT_PUBLIC_SOLANA_RPC_URL || '',
    NEXT_PUBLIC_JUPITER_API_URL: process.env.NEXT_PUBLIC_JUPITER_API_URL || '',
  }
};

export default nextConfig;
