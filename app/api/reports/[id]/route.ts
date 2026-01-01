import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireUserId } from '@/lib/auth/session'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = requireUserId(request)
    if ('error' in auth) {
      return NextResponse.json({ error: auth.error }, { status: 401 })
    }
    const { userId } = auth

    const { id } = params

    const report = await prisma.report.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        evidence: true,
      },
    })

    if (!report) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json({ report })
  } catch (error) {
    console.error('Report detail error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
