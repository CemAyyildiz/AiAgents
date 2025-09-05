/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
  },
  // Enable standalone output for Docker deployment
  output: 'standalone',
}

module.exports = nextConfig
