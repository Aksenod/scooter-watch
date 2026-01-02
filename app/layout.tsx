import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const basePath = process.env.NODE_ENV === 'production' && process.env.GITHUB_PAGES ? '/scooter-watch' : ''

export const metadata: Metadata = {
  title: 'ScooterWatch - AI-powered scooter violation reporting',
  description: 'Report scooter violations and get rewarded. AI-powered crowd-sourced monitoring.',
  manifest: `${basePath}/manifest.webmanifest`,
  themeColor: '#2563eb',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'ScooterWatch',
  },
  icons: {
    icon: `${basePath}/icon.png`,
    apple: `${basePath}/apple-icon.png`,
  },
}

export const viewport: Viewport = {
  themeColor: '#2563eb',
}

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-sans',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body className={`${inter.variable} font-sans antialiased`}>
        <div className="min-h-screen bg-background">
          {children}
        </div>
      </body>
    </html>
  )
}
