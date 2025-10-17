import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { Routes } from './routes'
import { LoadingIndicator } from '@components/common'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes />
      <LoadingIndicator />
    </QueryClientProvider>
  )
}
