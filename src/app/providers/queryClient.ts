import { QueryClient } from '@tanstack/react-query'

import { CACHE_TTL_MS } from '@/shared/config/api'

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: CACHE_TTL_MS,
        gcTime: CACHE_TTL_MS,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        retry: 1,
      },
    },
  })
}
