import type { NextConfig } from 'next';
import path from 'path';

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
    includePaths: ['./src'],
    // Disable deprecation warnings for @import
    quietDeps: true,
    // Custom importer to handle @/ alias
    importer: (url: string) => {
      if (url.startsWith('@/')) {
        const resolvedPath = path.resolve('./src', url.substring(2));
        return { file: resolvedPath };
      }
      return null;
    }
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
