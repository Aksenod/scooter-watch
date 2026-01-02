/**
 * Auth Feature Configuration
 */

export const authConfig = {
  // API endpoints
  endpoints: {
    otpRequest: '/api/auth/otp-request',
    otpVerify: '/api/auth/otp-verify',
  },

  // Feature flags
  features: {
    mockOtp: process.env.NODE_ENV === 'development',
    rememberMe: true,
  },

  // SMS provider (for future integration)
  smsProvider: {
    provider: process.env.SMS_PROVIDER || 'mock', // 'twilio' | 'vonage' | 'mock'
    apiKey: process.env.SMS_API_KEY,
  },
} as const
