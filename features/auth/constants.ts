/**
 * Auth Feature Constants
 */

export const AUTH_CONSTANTS = {
  // Storage keys
  STORAGE_KEYS: {
    TOKEN: 'scooter-watch-token',
    USER: 'scooter-watch-user',
  },

  // OTP configuration
  OTP: {
    LENGTH: 4,
    EXPIRES_IN: 5 * 60 * 1000, // 5 minutes
    MOCK_CODE: '1234', // For development
  },

  // Validation
  VALIDATION: {
    PHONE_MIN_LENGTH: 10,
    PHONE_MAX_LENGTH: 15,
  },

  // Routes
  ROUTES: {
    LOGIN: '/auth',
    AFTER_LOGIN: '/record',
    AFTER_LOGOUT: '/',
  },
} as const
