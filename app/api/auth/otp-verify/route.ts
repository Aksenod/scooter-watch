import { NextRequest, NextResponse } from 'next/server'
import { isOtpValid } from '@/lib/auth/otp'
import { prisma } from '@/lib/prisma'
import { otpStore } from '@/lib/auth/otp-store'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { phone, code, name } = body

    if (!phone || typeof phone !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Phone number is required' },
        { status: 400 }
      )
    }

    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { success: false, error: 'OTP code is required' },
        { status: 400 }
      )
    }

    // Нормализация номера телефона
    const normalizedPhone = phone.replace(/\D/g, '')

    // Проверяем OTP
    const storedOtp = otpStore.get(normalizedPhone)
    
    if (!storedOtp) {
      return NextResponse.json(
        { success: false, error: 'OTP not found or expired' },
        { status: 400 }
      )
    }

    if (storedOtp.expiresAt < Date.now()) {
      otpStore.delete(normalizedPhone)
      return NextResponse.json(
        { success: false, error: 'OTP expired' },
        { status: 400 }
      )
    }

    if (!isOtpValid(code, storedOtp.code)) {
      return NextResponse.json(
        { success: false, error: 'Invalid OTP code' },
        { status: 400 }
      )
    }

    // OTP валиден, удаляем его
    otpStore.delete(normalizedPhone)

    // Находим или создаем пользователя
    let user = await prisma.user.findUnique({
      where: { phone: normalizedPhone },
    })

    const normalizedName = typeof name === 'string' ? name.trim() : ''

    if (!user) {
      user = await prisma.user.create({
        data: {
          phone: normalizedPhone,
          name: normalizedName || `User ${normalizedPhone.slice(-4)}`,
        },
      })

      // Создаем кошелек для нового пользователя
      await prisma.wallet.create({
        data: {
          userId: user.id,
          balance: 0,
        },
      })
    } else if (normalizedName) {
      const current = typeof user.name === 'string' ? user.name.trim() : ''
      const isPlaceholder = current.startsWith('User ') && current.endsWith(normalizedPhone.slice(-4))
      if (!current || isPlaceholder) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: { name: normalizedName },
        })
      }
    }

    // Генерируем токен (в MVP используем userId как токен)
    // В продакшене использовать JWT или другой механизм
    const token = user.id

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        phone: user.phone,
        name: user.name,
      },
    })
  } catch (error) {
    console.error('OTP verify error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
