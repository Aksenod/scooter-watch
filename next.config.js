/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'prisma'],
  },
  images: {
    domains: ['localhost', 'your-project.supabase.co'],
  },
}

module.exports = nextConfig
