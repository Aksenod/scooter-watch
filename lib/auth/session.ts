import { NextRequest } from 'next/server'

export function getBearerToken(req: NextRequest): string | null {
  const auth = req.headers.get('authorization')
  if (!auth) return null
  const [type, token] = auth.split(' ')
  if (type?.toLowerCase() !== 'bearer' || !token) return null
  return token
}

export function requireUserId(req: NextRequest): { userId: string } | { error: string } {
  const token = getBearerToken(req)
  if (!token) return { error: 'Unauthorized' }
  // MVP: token == userId
  return { userId: token }
}
