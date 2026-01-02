'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Camera, History, Wallet, Home } from 'lucide-react'
import { cn } from '@/lib/utils'

export function BottomNav() {
  const pathname = usePathname()

  const activeHref = (() => {
    if (pathname === '/record' || pathname.startsWith('/record/')) return '/record'
    if (pathname === '/tips' || pathname.startsWith('/tips/')) return '/record'
    if (pathname === '/history' || pathname.startsWith('/history/') || pathname === '/case' || pathname.startsWith('/case/')) return '/history'
    if (pathname === '/wallet' || pathname.startsWith('/wallet/')) return '/wallet'
    if (pathname === '/profile' || pathname.startsWith('/profile/')) return '/'
    if (pathname === '/referrals' || pathname.startsWith('/referrals/')) return '/'
    if (pathname === '/support' || pathname.startsWith('/support/')) return '/'
    return '/'
  })()

  const navItems = [
    { href: '/', label: 'Главная', icon: Home },
    { href: '/record', label: 'Снять', icon: Camera },
    { href: '/history', label: 'История', icon: History },
    { href: '/wallet', label: 'Кошелек', icon: Wallet },
  ]

  const isRecordActive = activeHref === '/record'

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      <div className="mx-auto w-full max-w-lg px-3 pb-[calc(env(safe-area-inset-bottom)+0.5rem)]">
        {/* Floating pill nav */}
        <div className="rounded-2xl bg-card/95 supports-[backdrop-filter]:bg-card/80 backdrop-blur-xl border border-border/50 shadow-lg shadow-black/5 p-1">
          <div className="grid grid-cols-4 gap-1">
            {navItems.map(({ href, label, icon: Icon }) => {
              const isActive = activeHref === href
              const isRecord = href === '/record'
              
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={isActive ? 'page' : undefined}
                  aria-label={label}
                  className={cn(
                    "relative flex flex-col items-center justify-center min-h-14 py-2 px-1 rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    isRecord
                      ? "text-foreground"
                      : isActive
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {isRecord ? (
                    <div
                      className={cn(
                        "relative h-11 w-11 rounded-xl shadow-lg flex items-center justify-center transition-all duration-200",
                        isRecordActive
                          ? "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground scale-105"
                          : "bg-gradient-to-br from-foreground to-foreground/90 text-background hover:scale-105"
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      {/* Glow effect */}
                      <div className={cn(
                        "absolute inset-0 rounded-xl blur-md -z-10 transition-opacity",
                        isRecordActive ? "bg-primary/40 opacity-100" : "bg-foreground/20 opacity-0"
                      )} />
                    </div>
                  ) : (
                    <>
                      <div className={cn(
                        "relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200",
                        isActive 
                          ? "bg-primary text-primary-foreground shadow-md shadow-primary/30" 
                          : "hover:bg-surface-2"
                      )}>
                        <Icon className={cn(
                          "w-5 h-5 transition-all duration-200", 
                          isActive && "scale-110"
                        )} />
                      </div>
                      
                      {/* Active dot indicator */}
                      <div className={cn(
                        "w-1 h-1 rounded-full mt-1 transition-all duration-200",
                        isActive ? "bg-primary opacity-100" : "opacity-0"
                      )} />
                    </>
                  )}
                  
                  <span className="sr-only">{label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}
