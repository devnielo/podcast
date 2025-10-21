import { describe, it, expect } from 'vitest'

describe('HomePage Integration (Smoke Tests)', () => {
  it('should be importable without errors', async () => {
    const { HomePage } = await import('@/pages/home/HomePage')
    expect(HomePage).toBeDefined()
  })

  it('should export HomePage as a function component', async () => {
    const { HomePage } = await import('@/pages/home/HomePage')
    expect(typeof HomePage).toBe('function')
  })
})
