import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'
import type { Persister } from '@tanstack/react-query-persist-client'

const STORAGE_KEY = 'podcast-query-cache'
const THROTTLE_MS = 1_000

export function createBrowserPersister(): Persister | undefined {
  if (typeof window === 'undefined' || !window.localStorage) {
    return undefined
  }

  return createSyncStoragePersister({
    storage: window.localStorage,
    key: STORAGE_KEY,
    throttleTime: THROTTLE_MS,
  })
}
