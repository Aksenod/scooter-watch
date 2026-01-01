/** @type {import('next').NextConfig} */
const nextConfig = {
  // Убираем output: 'export' для работы API routes на Render
  // Для GitHub Pages используем отдельный workflow с экспортом
  basePath: process.env.NODE_ENV === 'production' && process.env.GITHUB_PAGES ? '/scooter-watch' : '',
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
