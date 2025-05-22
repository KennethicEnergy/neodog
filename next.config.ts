import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/',
        destination: '/pages/dashboard'
      }
    ];
  }
};

export default nextConfig;
