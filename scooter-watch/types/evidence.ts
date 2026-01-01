export interface Evidence {
  id: string
  reportId: string
  type: 'photo' | 'video'
  url: string
  createdAt: Date
}

export interface CreateEvidenceData {
  reportId: string
  type: 'photo' | 'video'
  url: string
}
