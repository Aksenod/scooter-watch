import type { Evidence } from './evidence'
import type { Reward } from './reward'

export interface Report {
  id: string
  userId: string
  violationType: string
  status: 'submitted' | 'underreview' | 'fineissued' | 'rejected'
  confidence?: number
  latitude?: number
  longitude?: number
  createdAt: Date
  updatedAt: Date
}

export interface CreateReportData {
  userId: string
  violationType?: string
  latitude?: number
  longitude?: number
}

export interface ReportWithEvidence extends Report {
  evidence: Evidence[]
  reward?: Reward
}

export interface ReportListItem {
  id: string
  violationType: string
  status: string
  createdAt: Date
  rewardAmount?: number
}
