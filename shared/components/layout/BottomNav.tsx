'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Camera, History, Wallet, Home } from 'lucide-react'
import { cn } from '@/lib/utils'

export function BottomNav() {
  const pathname = usePathname()

  const navItems = [
    { href: '/', label: 'Главная', icon: Home },
    { href: null, label: '', icon: null },
    { href: '/history', label: 'История', icon: History },
    { href: '/wallet', label: 'Кошелек', icon: Wallet },
  ]

  const isRecordActive = pathname === '/record'

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 pb-[env(safe-area-inset-bottom)]">
      <div className="relative mx-auto w-full max-w-md">
        <div className="absolute left-1/2 -translate-x-1/2 -top-6">
          <Link
            href="/record"
            aria-label="Запись"
            className={cn(
              "h-14 w-14 rounded-full shadow-lg flex items-center justify-center transition-colors",
              isRecordActive
                ? "bg-primary text-primary-foreground"
                : "bg-foreground text-background hover:bg-foreground/90"
            )}
          >
            <Camera className="w-7 h-7" />
          </Link>
        </div>

        <div className="bg-background border-t border-border px-2 py-2">
          <div className="grid grid-cols-4 gap-1">
            {navItems.map(({ href, label, icon: Icon }, idx) => {
              if (!href || !Icon) {
                return <div key={`nav-spacer-${idx}`} aria-hidden className="py-2 px-2" />
              }

              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex flex-col items-center justify-center py-2 px-2 rounded-lg transition-colors",
                    pathname === href
                      ? "text-foreground bg-surface-2"
                      : "text-muted-foreground hover:text-foreground hover:bg-surface"
                  )}
                >
                  <Icon className="w-6 h-6 mb-1" />
                  <span className="text-xs font-medium whitespace-nowrap">{label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}
