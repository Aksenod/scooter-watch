import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireUserId } from '@/lib/auth/session'

export async function GET(req: NextRequest) {
  try {
    const userId = await requireUserId(req)
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')

    const reports = await prisma.report.findMany({
      where: {
        userId,
        ...(status ? { status } : {}),
      },
      orderBy: { createdAt: 'desc' },
      include: {
        evidence: {
          where: { type: 'photo' },
          orderBy: { createdAt: 'asc' },
          take: 1,
          select: { url: true },
        },
        reward: true,
      },
    })

    return NextResponse.json(
      reports.map((r) => ({
        id: r.id,
        violationType: r.violationType,
        status: r.status,
        createdAt: r.createdAt.toISOString(),
        ...(r.evidence?.[0]?.url ? { previewUrl: r.evidence[0].url } : {}),
        ...(r.reward ? { rewardAmount: r.reward.amount } : {}),
      }))
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    const status = message === 'Unauthorized' ? 401 : 500
    return NextResponse.json({ message }, { status })
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await requireUserId(req)
    const body = await req.json().catch(() => null)

    const violationType = body?.violationType
    const confidence = body?.confidence
    const coordinates = body?.coordinates
    const evidenceUrl = body?.evidenceUrl

    if (!violationType || typeof violationType !== 'string') {
      return NextResponse.json({ message: 'violationType is required' }, { status: 400 })
    }

    if (typeof confidence !== 'number') {
      return NextResponse.json({ message: 'confidence is required' }, { status: 400 })
    }

    if (!evidenceUrl || typeof evidenceUrl !== 'string') {
      return NextResponse.json({ message: 'evidenceUrl is required' }, { status: 400 })
    }

    let latitude: number | undefined
    let longitude: number | undefined

    if (typeof coordinates === 'string' && coordinates.includes(',')) {
      const [latRaw, lngRaw] = coordinates.split(',').map((s: string) => s.trim())
      const lat = Number(latRaw)
      const lng = Number(lngRaw)
      if (!Number.isNaN(lat) && !Number.isNaN(lng)) {
        latitude = lat
        longitude = lng
      }
    }

    const report = await prisma.report.create({
      data: {
        userId,
        violationType,
        confidence,
        ...(typeof latitude === 'number' ? { latitude } : {}),
        ...(typeof longitude === 'number' ? { longitude } : {}),
        evidence: {
          create: {
            type: 'photo',
            url: evidenceUrl,
          },
        },
      },
      include: {
        evidence: true,
      },
    })

    return NextResponse.json({
      id: report.id,
      violationType: report.violationType,
      status: report.status,
      createdAt: report.createdAt.toISOString(),
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    const status = message === 'Unauthorized' ? 401 : 500
    return NextResponse.json({ message }, { status })
  }
}
