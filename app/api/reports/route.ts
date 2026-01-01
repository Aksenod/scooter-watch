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

    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const limit = searchParams.get('limit') || '20'

    const reports = await prisma.report.findMany({
      where: {
        userId,
        ...(status ? { status } : {}),
      },
      orderBy: { createdAt: 'desc' },
      take: Number.parseInt(limit, 10) || 20,
      include: {
        reward: true,
      },
    })

    return NextResponse.json({
      reports: reports.map((r: (typeof reports)[number]) => ({
        id: r.id,
        violationType: r.violationType,
        status: r.status,
        createdAt: r.createdAt,
        rewardAmount: r.reward?.amount ?? 0,
      })),
    })
  } catch (error) {
    console.error('Reports fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = requireUserId(request)
    if ('error' in auth) {
      return NextResponse.json({ error: auth.error }, { status: 401 })
    }
    const { userId } = auth

    const { photoUrl, latitude, longitude } = await request.json()

    if (!photoUrl) {
      return NextResponse.json(
        { error: 'Photo URL is required' },
        { status: 400 }
      )
    }

    const report = await prisma.report.create({
      data: {
        userId,
        violationType: 'pending',
        status: 'submitted',
        latitude: typeof latitude === 'number' ? latitude : null,
        longitude: typeof longitude === 'number' ? longitude : null,
        evidence: {
          create: [{
            type: 'photo',
            url: photoUrl,
          }],
        },
      },
      include: {
        evidence: true,
      },
    })

    return NextResponse.json({
      reportId: report.id,
      report,
    })
  } catch (error) {
    console.error('Report creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
