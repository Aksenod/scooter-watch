'use client'

import { useEffect, useState } from 'react'

export function useAuth() {
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    setToken(typeof window !== 'undefined' ? localStorage.getItem('token') : null)
  }, [])

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
  }

  return {
    token,
    isAuthed: Boolean(token),
    logout,
  }
}
