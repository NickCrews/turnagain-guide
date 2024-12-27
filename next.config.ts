import type { NextConfig } from "next";
import withSerwistInit from '@serwist/next';

const withSerwist = withSerwistInit({
  swSrc: 'app/sw.ts', 
  swDest: 'public/sw.js',
});


const nextConfig: NextConfig = withSerwist({
  // Next.js config options

  // make a static website
  output: 'export',
});

export default nextConfig;
