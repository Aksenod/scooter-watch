'use client'

import { useEffect, useState } from 'react'
import { apiService } from '@/lib/services/api'

export function useWallet() {
  const [balance, setBalance] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    ;(async () => {
      try {
        const data = await apiService.getWallet()
        setBalance(data.wallet?.balance ?? 0)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load wallet')
        console.error('Wallet error:', err)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const refresh = async () => {
    setLoading(true)
    try {
      const data = await apiService.getWallet()
      setBalance(data.wallet?.balance ?? 0)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load wallet')
    } finally {
      setLoading(false)
    }
  }

  return { balance, loading, error, refresh }
}
