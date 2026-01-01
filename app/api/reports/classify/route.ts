import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireUserId } from '@/lib/auth/session'

export async function POST(request: NextRequest) {
  try {
    const auth = requireUserId(request)
    if ('error' in auth) {
      return NextResponse.json({ error: auth.error }, { status: 401 })
    }
    const { userId } = auth

    const { reportId, photoUrl } = await request.json()

    if (!reportId || !photoUrl) {
      return NextResponse.json(
        { error: 'Report ID and photo URL are required' },
        { status: 400 }
      )
    }

    // Mock AI classification - в реальном приложении вызываем OpenAI/Claude API
    const violationTypes = ['sidewalk', 'wrongparking', 'trafficviolation', 'helmetmissing']
    const mockViolationType = violationTypes[Math.floor(Math.random() * violationTypes.length)]
    const mockConfidence = 0.7 + Math.random() * 0.3 // 0.7-1.0

    const report = await prisma.report.findFirst({
      where: { id: reportId, userId },
      select: { id: true },
    })

    if (!report) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    await prisma.report.update({
      where: { id: reportId },
      data: {
        violationType: mockViolationType,
        confidence: mockConfidence,
        status: 'underreview',
      },
    })

    return NextResponse.json({
      violationType: mockViolationType,
      confidence: mockConfidence,
    })
  } catch (error) {
    console.error('AI classification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
