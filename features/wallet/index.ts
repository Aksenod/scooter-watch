/**
 * Wallet Feature - Public API
 */

// Components
export { WalletBalance } from './components/WalletBalance'
export { RewardHistory } from './components/RewardHistory'
export { WithdrawButton } from './components/WithdrawButton'
export { WalletStats } from './components/WalletStats'

// Hooks
export { useWallet } from './hooks/useWallet'
export { useRewards } from './hooks/useRewards'

// Types
export type { Wallet, Reward, RewardStatus, WithdrawRequest } from './types'

// Constants
export { WALLET_CONSTANTS } from './constants'

// Utils
export { formatCurrency, canWithdraw } from './utils'
