'use client'

import { useEffect, useState } from 'react'

export function useWallet() {
  const [balance, setBalance] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch('/api/wallet')
        if (res.ok) {
          const data = await res.json()
          setBalance(data.wallet?.balance ?? 0)
        }
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  return { balance, loading }
}
