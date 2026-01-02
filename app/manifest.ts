import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  const basePath =
    process.env.NODE_ENV === 'production' && process.env.GITHUB_PAGES
      ? '/scooter-watch'
      : ''

  return {
    name: 'ScooterWatch',
    short_name: 'ScooterWatch',
    description: 'Report scooter violations and get rewarded.',
    start_url: `${basePath}/`,
    scope: `${basePath}/`,
    display: 'standalone',
    background_color: '#0b1220',
    theme_color: '#2563eb',
    icons: [
      {
        src: `${basePath}/icon.png`,
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
