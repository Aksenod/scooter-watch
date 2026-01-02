import type { Reward } from './reward'

export interface Wallet {
  id: string
  userId: string
  balance: number
  updatedAt: Date
}

export interface WalletWithPending extends Wallet {
  pendingRewards: Reward[]
}

export interface PayoutRequest {
  amount: number
}
