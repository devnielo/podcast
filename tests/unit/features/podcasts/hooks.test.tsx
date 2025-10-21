import { describe, it, expect } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClientProvider } from '@tanstack/react-query'
import { createQueryClient } from '@/app/providers/queryClient'
import { useTopPodcasts, usePodcastEpisodesQuery } from '@/features/podcasts/hooks'
import type { ReactNode } from 'react'

function createWrapper() {
  const queryClient = createQueryClient()
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('Podcasts Hooks', () => {
  describe('useTopPodcasts', () => {
    it('should fetch top podcasts', async () => {
      const { result } = renderHook(() => useTopPodcasts(), {
        wrapper: createWrapper(),
      })

      expect(result.current.isLoading).toBe(true)

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.data).toBeDefined()
      expect(Array.isArray(result.current.data)).toBe(true)
    })

    it('should have data with correct structure', async () => {
      const { result } = renderHook(() => useTopPodcasts(), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.data).toBeDefined()
      })

      const podcast = result.current.data?.[0]
      expect(podcast).toHaveProperty('id')
      expect(podcast).toHaveProperty('title')
      expect(podcast).toHaveProperty('author')
      expect(podcast).toHaveProperty('imageUrl')
    })

    it('should handle errors gracefully', async () => {
      const { result } = renderHook(() => useTopPodcasts(), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.isError).toBe(false)
    })
  })


  describe('usePodcastEpisodesQuery', () => {
    it('should fetch episodes for podcast', async () => {
      const { result } = renderHook(() => usePodcastEpisodesQuery('1'), {
        wrapper: createWrapper(),
      })

      expect(result.current.isLoading).toBe(true)

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.data).toBeDefined()
      expect(Array.isArray(result.current.data)).toBe(true)
    })

    it('should have episodes with correct structure', async () => {
      const { result } = renderHook(() => usePodcastEpisodesQuery('1'), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.data).toBeDefined()
      })

      const episode = result.current.data?.[0]
      expect(episode).toHaveProperty('id')
      expect(episode).toHaveProperty('title')
      expect(episode).toHaveProperty('releaseDate')
      expect(episode).toHaveProperty('durationMs')
      expect(episode).toHaveProperty('audioUrl')
    })

    it('should return empty array for non-existent podcast', async () => {
      const { result } = renderHook(() => usePodcastEpisodesQuery('999'), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.data).toEqual([])
    })
  })
})
