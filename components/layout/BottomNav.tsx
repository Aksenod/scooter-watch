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
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50">
      <div className="max-w-6xl mx-auto flex justify-around">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex flex-col items-center py-2 px-3 rounded-md transition-colors",
              pathname === href
                ? "text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            )}
          >
            <Icon className="w-6 h-6 mb-1" />
            <span className="text-xs">{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  )
}
