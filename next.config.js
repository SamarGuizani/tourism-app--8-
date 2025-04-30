/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ["localhost", "vercel-blob.com"],
    unoptimized: true,
  },
  experimental: {
    allowedDevOrigins: ["localhost", "127.0.0.1"],
  },
}

module.exports = nextConfig
