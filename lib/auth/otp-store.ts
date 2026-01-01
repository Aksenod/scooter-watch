// Временное хранилище OTP (в продакшене использовать Redis)
export const otpStore = new Map<string, { code: string; expiresAt: number }>()

// Очистка истекших OTP каждые 5 минут
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now()
    otpStore.forEach((data, phone) => {
      if (data.expiresAt < now) {
        otpStore.delete(phone)
      }
    })
  }, 5 * 60 * 1000)
}
