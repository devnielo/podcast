import { describe, it, expect, vi } from 'vitest'
import { buildProxiedUrl, fetchJson, fetchJsonSmart } from '@/shared/api/fetcher'

describe('Fetcher Utils', () => {
  describe('buildProxiedUrl', () => {
    it('should build proxied URL with AllOrigins by default', () => {
      const url = 'https://example.com/api'
      const result = buildProxiedUrl(url)

      expect(result).toBe('https://api.allorigins.win/raw?url=https%3A%2F%2Fexample.com%2Fapi')
    })

    it('should return original URL when corsProxy is false', () => {
      const url = 'https://example.com/api'
      const result = buildProxiedUrl(url, false)

      expect(result).toBe(url)
    })

    it('should use custom proxy base when provided', () => {
      const url = 'https://example.com/api'
      const customBase = 'https://custom-proxy.com/?url='
      const result = buildProxiedUrl(url, true, customBase)

      expect(result).toBe('https://custom-proxy.com/?url=https%3A%2F%2Fexample.com%2Fapi')
    })

    it('should properly encode special characters in URL', () => {
      const url = 'https://example.com/api?q=hello world&filter=test'
      const result = buildProxiedUrl(url)

      expect(result).toContain('https%3A%2F%2Fexample.com%2Fapi%3Fq%3Dhello%20world%26filter%3Dtest')
    })
  })

  describe('fetchJson', () => {
    it('should fetch and parse JSON successfully', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: 'test' }),
      })

      const result = await fetchJson('https://example.com/api')

      expect(result).toEqual({ data: 'test' })
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('https://api.allorigins.win'),
        expect.any(Object),
      )
    })

    it('should throw error on non-ok response', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        text: async () => 'Not found',
      })

      await expect(fetchJson('https://example.com/api')).rejects.toThrow('Request failed: 404 Not Found')
    })

    it('should include custom headers', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      })

      await fetchJson('https://example.com/api', { headers: { 'X-Custom': 'value' } })

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'X-Custom': 'value',
            Accept: expect.any(String),
          }),
        }),
      )
    })
  })

  describe('fetchJsonSmart', () => {
    it('should try direct fetch first with timeout', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: 'direct' }),
      })

      const result = await fetchJsonSmart('https://example.com/api', undefined, {
        timeoutDirectMs: 2000,
        tryDirectFirst: true,
      })

      expect(result).toEqual({ data: 'direct' })
    })

    it('should fallback to proxies on direct fetch failure', async () => {
      let callCount = 0
      global.fetch = vi.fn().mockImplementation(() => {
        callCount++
        if (callCount === 1) {
          return Promise.reject(new Error('Direct failed'))
        }
        return Promise.resolve({
          ok: true,
          json: async () => ({ data: 'proxy' }),
        })
      })

      const result = await fetchJsonSmart('https://example.com/api', undefined, {
        timeoutDirectMs: 100,
        timeoutProxyMs: 2000,
        tryDirectFirst: true,
      })

      expect(result).toEqual({ data: 'proxy' })
    })

    it('should race multiple proxies and return first success', async () => {
      global.fetch = vi.fn().mockImplementation(async (url) => {
        if (url.includes('allorigins')) {
          await new Promise((resolve) => setTimeout(resolve, 100))
          return { ok: true, json: async () => ({ data: 'allorigins' }) }
        }
        return { ok: true, json: async () => ({ data: 'isomorphic' }) }
      })

      const result = await fetchJsonSmart('https://example.com/api', undefined, {
        timeoutDirectMs: 100,
        timeoutProxyMs: 2000,
        tryDirectFirst: false,
      })

      expect(result).toBeDefined()
    })
  })
})
