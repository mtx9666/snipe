/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // Changed from 'standalone' to 'export' for static hosting
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    domains: ['solscan.io'], // Add any other domains you might be loading images from
    unoptimized: true, // Required for static export
  },
  // Ensure environment variables are available
  env: {
    NEXT_PUBLIC_SOLANA_RPC_URL: process.env.NEXT_PUBLIC_SOLANA_RPC_URL || '',
    NEXT_PUBLIC_JUPITER_API_URL: process.env.NEXT_PUBLIC_JUPITER_API_URL || '',
  },
  eslint: {
    ignoreDuringBuilds: true, // Ignore ESLint errors during build
  },
  typescript: {
    ignoreBuildErrors: true, // Also ignore TypeScript errors during build
  },
  // Add trailing slashes for better compatibility
  trailingSlash: true,
  // Add webpack configuration to handle potential class inheritance issues
  webpack: (config, { isServer }) => {
    // Add any necessary webpack configurations here
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    return config;
  },
};

module.exports = nextConfig; 