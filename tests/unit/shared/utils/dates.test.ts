import { describe, it, expect } from 'vitest'

// Helper function to format duration (from EpisodesTable)
function formatDuration(ms?: number) {
  if (!ms || ms <= 0) return '—'
  const totalSeconds = Math.floor(ms / 1000)
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60
  const parts = [h > 0 ? String(h) : null, String(m).padStart(2, '0'), String(s).padStart(2, '0')].filter(Boolean)
  return parts.join(':')
}

describe('Date and Duration Utils', () => {
  describe('formatDuration', () => {
    it('should format duration in milliseconds to HH:MM:SS', () => {
      expect(formatDuration(3661000)).toBe('1:01:01')
    })

    it('should format duration without hours as MM:SS', () => {
      expect(formatDuration(125000)).toBe('02:05')
    })

    it('should format duration with leading zeros', () => {
      expect(formatDuration(65000)).toBe('01:05')
    })

    it('should return dash for undefined duration', () => {
      expect(formatDuration(undefined)).toBe('—')
    })

    it('should return dash for zero duration', () => {
      expect(formatDuration(0)).toBe('—')
    })

    it('should return dash for negative duration', () => {
      expect(formatDuration(-1000)).toBe('—')
    })

    it('should handle large durations (multiple hours)', () => {
      expect(formatDuration(36000000)).toBe('10:00:00')
    })

    it('should handle fractional seconds by flooring', () => {
      expect(formatDuration(1500)).toBe('00:01')
    })
  })
})
