'use client'

import Link from 'next/link'
import { Camera, History, Wallet } from 'lucide-react'

export function Header() {
  return (
    <header className="bg-background border-b border-border px-4 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-foreground">
          ScooterWatch
        </Link>

        <nav className="flex items-center space-x-6">
          <Link
            href="/record"
            className="flex items-center text-muted-foreground hover:text-foreground"
          >
            <Camera className="w-5 h-5 mr-1" />
            Запись
          </Link>
          <Link
            href="/history"
            className="flex items-center text-muted-foreground hover:text-foreground"
          >
            <History className="w-5 h-5 mr-1" />
            История
          </Link>
          <Link
            href="/wallet"
            className="flex items-center text-muted-foreground hover:text-foreground"
          >
            <Wallet className="w-5 h-5 mr-1" />
            Кошелек
          </Link>
        </nav>
      </div>
    </header>
  )
}
