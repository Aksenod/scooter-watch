import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { phone } = await request.json()

    if (!phone) {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      )
    }

    // Mock OTP generation - в реальном приложении здесь будет SMS API
    const otp = Math.floor(1000 + Math.random() * 9000).toString()
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000) // 5 минут

    console.log(`OTP for ${phone}: ${otp}`) // Для отладки

    // Здесь должен быть вызов SMS API
    // await sendSMS(phone, `Your OTP: ${otp}`)

    return NextResponse.json({
      success: true,
      expiresAt: expiresAt.toISOString(),
    })
  } catch (error) {
    console.error('OTP request error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
