/** @type {import('next').NextConfig} */
const nextConfig = {
  // Убрано output: 'export' для работы API routes на Render
  // Для GitHub Pages workflow временно добавляет export
  basePath: process.env.NODE_ENV === 'production' && process.env.GITHUB_PAGES ? '/scooter-watch' : '',
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
