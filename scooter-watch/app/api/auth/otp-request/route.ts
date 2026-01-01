import { NextRequest, NextResponse } from 'next/server'
import { generateOtp } from '@/lib/auth/otp'
import { otpStore } from '@/lib/auth/otp-store'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { phone } = body

    if (!phone || typeof phone !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Phone number is required' },
        { status: 400 }
      )
    }

    // Нормализация номера телефона
    const normalizedPhone = phone.replace(/\D/g, '')

    // Генерируем OTP (для демо всегда 1234)
    const otpCode = process.env.NODE_ENV === 'development' ? '1234' : generateOtp(4)
    
    // Сохраняем OTP на 10 минут
    otpStore.set(normalizedPhone, {
      code: otpCode,
      expiresAt: Date.now() + 10 * 60 * 1000, // 10 минут
    })

    // В продакшене здесь отправка SMS через провайдера
    // await sendSMS(phone, `Ваш код: ${otpCode}`)

    console.log(`[OTP Request] Phone: ${normalizedPhone}, Code: ${otpCode}`)

    return NextResponse.json({
      success: true,
      message: 'OTP code sent',
      // В демо режиме возвращаем код для удобства
      ...(process.env.NODE_ENV === 'development' && { demoCode: otpCode }),
    })
  } catch (error) {
    console.error('OTP request error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

