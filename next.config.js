/** @type {import('next').NextConfig} */
const nextConfig = {
  // basePath: process.env.NODE_ENV === 'production' ? '' : '',
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
