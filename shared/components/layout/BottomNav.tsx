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
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 supports-[backdrop-filter]:bg-background/80 backdrop-blur">
      <div className="relative mx-auto w-full max-w-lg px-2 pb-[calc(env(safe-area-inset-bottom)+0.5rem)]">
        <div className="absolute left-1/2 -translate-x-1/2 -top-7">
          <Link
            href="/record"
            aria-label="Запись"
            className={cn(
              "h-14 w-14 rounded-full shadow-lg ring-2 ring-background flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              isRecordActive
                ? "bg-primary text-primary-foreground"
                : "bg-foreground text-background hover:bg-foreground/90"
            )}
          >
            <Camera className="w-7 h-7" />
          </Link>
        </div>

        <div className="pt-2">
          <div className="grid grid-cols-4 gap-1">
            {navItems.map(({ href, label, icon: Icon }, idx) => {
              if (!href || !Icon) {
                return <div key={`nav-spacer-${idx}`} aria-hidden className="py-2 px-2" />
              }

              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={pathname === href ? 'page' : undefined}
                  className={cn(
                    "flex flex-col items-center justify-center min-h-12 py-2 px-2 rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                    pathname === href
                      ? "text-foreground bg-surface-2"
                      : "text-muted-foreground hover:text-foreground hover:bg-surface"
                  )}
                >
                  <Icon className="w-6 h-6" />
                  <span className="mt-1 text-[11px] font-medium leading-none whitespace-nowrap">{label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}
