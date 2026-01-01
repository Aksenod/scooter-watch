import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireUserId } from '@/lib/auth/session'

export async function GET(request: NextRequest) {
  try {
    const auth = requireUserId(request)
    if ('error' in auth) {
      return NextResponse.json({ error: auth.error }, { status: 401 })
    }
    const { userId } = auth

    const wallet = await prisma.wallet.upsert({
      where: { userId },
      create: { userId, balance: 0 },
      update: {},
    })

    const pendingRewards = await prisma.reward.findMany({
      where: { userId, status: { in: ['pending', 'approved'] } },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({
      wallet,
      pendingRewards,
    })
  } catch (error) {
    console.error('Wallet fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
