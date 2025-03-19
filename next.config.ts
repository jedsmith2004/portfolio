import { setupDevPlatform } from '@cloudflare/next-on-pages/next-dev';

/** @type {import('next').NextConfig} */
const nextConfig = async () => {
  if (process.env.NODE_ENV === 'development') {
    await setupDevPlatform();
  }

  return {};
};

export default nextConfig;