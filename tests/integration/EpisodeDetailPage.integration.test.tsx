import { describe, it, expect } from 'vitest'

describe('EpisodeDetailPage Integration (Smoke Tests)', () => {
  it('should be importable without errors', async () => {
    const { EpisodeDetailPage } = await import('@/pages/episode/EpisodeDetailPage')
    expect(EpisodeDetailPage).toBeDefined()
  })

  it('should export EpisodeDetailPage as a function component', async () => {
    const { EpisodeDetailPage } = await import('@/pages/episode/EpisodeDetailPage')
    expect(typeof EpisodeDetailPage).toBe('function')
  })
})
