'use client'

import { useEffect, useState } from 'react'
import { apiService } from '@/lib/services/api'

export function useAuth() {
  const [token, setToken] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const savedToken = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
    const savedUser = typeof window !== 'undefined' ? localStorage.getItem('auth_user') : null

    setToken(savedToken)
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (e) {
        console.error('Failed to parse user data:', e)
      }
    }
  }, [])

  const login = async (phone: string, code: string, name?: string) => {
    setLoading(true)
    setError(null)
    try {
      const data = await apiService.verifyOTP(phone, code, name)
      localStorage.setItem('auth_token', data.token)
      localStorage.setItem('auth_user', JSON.stringify(data.user))
      setToken(data.token)
      setUser(data.user)
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
      return false
    } finally {
      setLoading(false)
    }
  }

  const requestOTP = async (phone: string) => {
    setLoading(true)
    setError(null)
    try {
      await apiService.requestOTP(phone)
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to request OTP')
      return false
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
    setToken(null)
    setUser(null)
  }

  return {
    token,
    user,
    isAuthed: Boolean(token),
    loading,
    error,
    login,
    requestOTP,
    logout,
  }
}
