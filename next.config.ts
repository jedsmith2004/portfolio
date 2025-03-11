import { setupDevPlatform } from '@cloudflare/next-on-pages/next-dev';

/** @type {import('next').NextConfig} */
const nextConfig = {};

 if (process.env.NODE_ENV === 'development') {
   await setupDevPlatform();
 }

 // filepath: /c:/Users/jack/OneDrive/Desktop/Coding/Portfolio/jacksmith-portfolio/next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  // Your existing Next.js configuration
});

export default nextConfig;