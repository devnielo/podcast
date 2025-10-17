export interface ApiResponse<T> {
  resultCount: number
  results: T[]
}

export interface ApiError {
  message: string
  code?: string
  status?: number
}

export interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
}
