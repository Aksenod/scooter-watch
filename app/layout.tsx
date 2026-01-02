import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

export const metadata: Metadata = {
  title: 'ScooterWatch - AI-powered scooter violation reporting',
  description: 'Report scooter violations and get rewarded. AI-powered crowd-sourced monitoring.',
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
