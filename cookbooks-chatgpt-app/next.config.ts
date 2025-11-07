import type { NextConfig } from 'next';
import { baseURL } from './baseUrl';

const corsHeaders = [
  { key: 'Access-Control-Allow-Origin', value: '*' },
  { key: 'Access-Control-Allow-Methods', value: 'GET,POST,OPTIONS' },
  {
    key: 'Access-Control-Allow-Headers',
    value: 'Content-Type, Authorization, X-Requested-With'
  }
];

const nextConfig: NextConfig = {
  assetPrefix: baseURL,
  async headers() {
    return [
      {
        source: '/:path*',
        headers: corsHeaders
      },
      {
        source: '/_next/:path*',
        headers: corsHeaders
      },
      {
        source: '/static/:path*',
        headers: corsHeaders
      }
    ];
  }
};

export default nextConfig;
