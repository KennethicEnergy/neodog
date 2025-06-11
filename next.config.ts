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
    domains: ['images.unsplash.com']
  }
};

export default nextConfig;
