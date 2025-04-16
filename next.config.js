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
      crypto: false,
      stream: false,
      path: false,
      os: false,
      http: false,
      https: false,
      zlib: false,
    };
    
    // Handle wallet adapter
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@solana/wallet-adapter-base': '@solana/wallet-adapter-base/lib/cjs',
        '@solana/wallet-adapter-react': '@solana/wallet-adapter-react/lib/cjs',
        '@solana/wallet-adapter-react-ui': '@solana/wallet-adapter-react-ui/lib/cjs',
        '@solana/wallet-adapter-wallets': '@solana/wallet-adapter-wallets/lib/cjs',
      };
    }
    
    // Optimize the build
    config.optimization = {
      ...config.optimization,
      minimize: true,
      moduleIds: 'deterministic',
      chunkIds: 'deterministic',
    };
    
    return config;
  },
  // Add experimental features that might help with the build
  experimental: {
    optimizeCss: true,
    optimizePackageImports: [
      '@solana/wallet-adapter-base',
      '@solana/wallet-adapter-react',
      '@solana/wallet-adapter-react-ui',
      '@solana/wallet-adapter-wallets',
    ],
  },
};

module.exports = nextConfig; 