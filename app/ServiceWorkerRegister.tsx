'use client'

import { useEffect } from 'react'

export function ServiceWorkerRegister({ basePath }: { basePath: string }) {
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!('serviceWorker' in navigator)) return

    const swUrl = `${basePath}/sw.js`

    navigator.serviceWorker.register(swUrl).catch(() => {})
  }, [basePath])

  return null
}
