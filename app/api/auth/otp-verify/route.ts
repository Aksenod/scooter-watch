import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { phone, code } = await request.json()

    if (!phone) {
      return NextResponse.json(
        { error: 'Phone is required' },
        { status: 400 }
      )
    }

    // MVP simplification: allow login by phone only (OTP will be enabled later)
    void code

    const user = await prisma.user.upsert({
      where: { phone },
      create: { phone },
      update: {},
    })

    await prisma.wallet.upsert({
      where: { userId: user.id },
      create: { userId: user.id, balance: 0 },
      update: {},
    })

    // MVP token == userId (later replace with JWT/NextAuth)
    const token = user.id

    return NextResponse.json({
      success: true,
      token,
      user,
    })
  } catch (error) {
    console.error('OTP verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
