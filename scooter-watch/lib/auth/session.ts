import { NextRequest } from 'next/server'

export function getBearerToken(req: NextRequest): string | null {
  const auth = req.headers.get('authorization')
  if (!auth) return null
  const [type, token] = auth.split(' ')
  if (type?.toLowerCase() !== 'bearer' || !token) return null
  return token
}

export async function requireUserId(req: NextRequest): Promise<string> {
  const token = getBearerToken(req)
  if (!token) {
    throw new Error('Unauthorized')
  }
  // MVP: token == userId (в продакшене проверять через JWT или БД)
  // Проверяем, что пользователь существует
  const { prisma } = await import('@/lib/prisma')
  const user = await prisma.user.findUnique({
    where: { id: token },
  })
  if (!user) {
    throw new Error('Unauthorized')
  }
  return token
}
