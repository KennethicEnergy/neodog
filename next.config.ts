import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/',
        destination: '/dashboard'
      }
    ];
  },
  sassOptions: {
    includePaths: ['./src']
  },
  images: {
    domains: ['api.neodog.app'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.neodog.app',
        port: '',
        pathname: '/api/**'
      }
    ]
  }
};

export default nextConfig;
