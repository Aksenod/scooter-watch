import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ScooterWatch - AI-powered scooter violation reporting',
  description: 'Report scooter violations and get rewarded. AI-powered crowd-sourced monitoring.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans">
        <div className="min-h-screen bg-background">
          {children}
        </div>
      </body>
    </html>
  )
}
