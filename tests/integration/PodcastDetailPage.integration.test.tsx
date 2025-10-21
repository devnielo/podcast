import { describe, it, expect } from 'vitest'

describe('PodcastDetailPage Integration (Smoke Tests)', () => {
  it('should be importable without errors', async () => {
    const { PodcastDetailPage } = await import('@/pages/podcast/PodcastDetailPage')
    expect(PodcastDetailPage).toBeDefined()
  })

  it('should export PodcastDetailPage as a function component', async () => {
    const { PodcastDetailPage } = await import('@/pages/podcast/PodcastDetailPage')
    expect(typeof PodcastDetailPage).toBe('function')
  })
})
