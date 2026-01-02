/**
 * Shared TypeScript Types
 *
 * Общие типы, используемые в нескольких фичах
 */

// API Response wrapper
export type ApiResponse<T> = {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Pagination
export type PaginationParams = {
  page: number
  limit: number
}

export type PaginatedResponse<T> = {
  items: T[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

// Date helpers
export type DateRange = {
  from: Date
  to: Date
}

// Location
export type Coordinates = {
  latitude: number
  longitude: number
}

export type Location = {
  coordinates: Coordinates
  address?: string
  city?: string
  country?: string
}

// Status type (generic)
export type Status = 'pending' | 'processing' | 'completed' | 'failed'

// File upload
export type FileUpload = {
  file: File
  preview?: string
  progress?: number
}

export type UploadedFile = {
  url: string
  filename: string
  size: number
  mimeType: string
}
