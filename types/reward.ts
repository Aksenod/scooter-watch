export interface Reward {
  id: string
  userId: string
  reportId: string
  amount: number
  status: 'pending' | 'approved' | 'paid'
  createdAt: Date
}

export interface CreateRewardData {
  userId: string
  reportId: string
  amount: number
}
