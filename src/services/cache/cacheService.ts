import { storageService } from './storageService'

interface MemoryCache {
  [key: string]: unknown
}

const memoryCache: MemoryCache = {}

export const cacheService = {
  set: <T>(key: string, value: T, ttl: number): void => {
    memoryCache[key] = value
    storageService.set(key, value, ttl)
  },

  get: <T>(key: string): T | null => {
    const memValue = memoryCache[key] as T | undefined
    if (memValue !== undefined) return memValue

    const storageValue = storageService.get<T>(key)
    if (storageValue) {
      memoryCache[key] = storageValue
    }
    return storageValue
  },

  remove: (key: string): void => {
    delete memoryCache[key]
    storageService.remove(key)
  },

  clear: (): void => {
    Object.keys(memoryCache).forEach(key => delete memoryCache[key])
    storageService.clear()
  },

  isExpired: (key: string): boolean => {
    return storageService.isExpired(key)
  },

  getOrFetch: async <T>(
    key: string,
    fetcher: () => Promise<T>,
    ttl: number
  ): Promise<T> => {
    const cached = cacheService.get<T>(key)
    if (cached) return cached

    const data = await fetcher()
    cacheService.set(key, data, ttl)
    return data
  },
}
