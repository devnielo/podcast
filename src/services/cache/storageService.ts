import { CacheEntry } from '@types'

export const storageService = {
  set: <T>(key: string, value: T, ttl: number): void => {
    const entry: CacheEntry<T> = {
      data: value,
      timestamp: Date.now(),
      ttl,
    }
    try {
      localStorage.setItem(key, JSON.stringify(entry))
    } catch (error) {
      console.error(`Failed to set cache for key: ${key}`, error)
    }
  },

  get: <T>(key: string): T | null => {
    try {
      const item = localStorage.getItem(key)
      if (!item) return null

      const entry: CacheEntry<T> = JSON.parse(item)
      const isExpired = Date.now() - entry.timestamp > entry.ttl

      if (isExpired) {
        localStorage.removeItem(key)
        return null
      }

      return entry.data
    } catch (error) {
      console.error(`Failed to get cache for key: ${key}`, error)
      return null
    }
  },

  remove: (key: string): void => {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error(`Failed to remove cache for key: ${key}`, error)
    }
  },

  clear: (): void => {
    try {
      localStorage.clear()
    } catch (error) {
      console.error('Failed to clear cache', error)
    }
  },

  isExpired: (key: string): boolean => {
    try {
      const item = localStorage.getItem(key)
      if (!item) return true

      const entry: CacheEntry<unknown> = JSON.parse(item)
      return Date.now() - entry.timestamp > entry.ttl
    } catch {
      return true
    }
  },
}
