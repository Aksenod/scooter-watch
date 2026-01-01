/**
 * Auth Feature - Public API
 *
 * Экспортирует всё, что нужно другим частям приложения
 */

// Components
export { AuthForm } from './components/AuthForm'

// Hooks
export { useAuth } from './hooks/useAuth'

// Types
export type { User, AuthToken, OTPRequest, OTPVerification } from './types'

// Constants
export { AUTH_CONSTANTS } from './constants'

// Utils (если нужны снаружи)
export { getAuthToken, setAuthToken, clearAuthToken } from './utils/storage'
