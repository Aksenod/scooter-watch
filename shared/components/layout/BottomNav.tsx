'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Camera, History, Wallet, Home } from 'lucide-react'
import { cn } from '@/lib/utils'

export function BottomNav() {
  const pathname = usePathname()

  const navItems = [
    { href: '/', label: 'Главная', icon: Home },
    { href: '/record', label: 'Запись', icon: Camera },
    { href: '/history', label: 'История', icon: History },
    { href: '/wallet', label: 'Кошелек', icon: Wallet },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 pb-[env(safe-area-inset-bottom)]">
      <div className="w-full flex justify-around items-center px-2 py-2">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex flex-col items-center justify-center min-w-[64px] py-2 px-3 rounded-lg transition-colors",
              pathname === href
                ? "text-blue-700 bg-blue-50"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            )}
          >
            <Icon className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium whitespace-nowrap">{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  )
}
