export function generateOtp(length = 4): string {
  const min = 10 ** (length - 1)
  const max = 10 ** length - 1
  return String(Math.floor(min + Math.random() * (max - min + 1)))
}

export function isOtpValid(code: string, expected: string): boolean {
  return code.trim() === expected.trim()
}
