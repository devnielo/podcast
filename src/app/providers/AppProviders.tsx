import type { ReactNode } from 'react'
import { useMemo, useState } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import { createQueryClient } from '@/app/providers/queryClient'
import { createBrowserPersister } from '@/shared/cache/persister'
import { CACHE_TTL_MS } from '@/shared/config/api'

interface AppProvidersProps {
  children: ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  const [queryClient] = useState(() => createQueryClient())
  const persister = useMemo(() => createBrowserPersister(), [])

  const devtools = import.meta.env.DEV ? <ReactQueryDevtools initialIsOpen={false} /> : null

  if (!persister) {
    return (
      <QueryClientProvider client={queryClient}>
        {children}
        {devtools}
      </QueryClientProvider>
    )
  }

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister, maxAge: CACHE_TTL_MS }}
    >
      {children}
      {devtools}
    </PersistQueryClientProvider>
  )
}
