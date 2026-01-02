/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: process.env.NODE_ENV === 'production' ? '/scooter-watch' : '',
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
