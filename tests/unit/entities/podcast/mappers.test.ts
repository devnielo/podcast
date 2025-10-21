import { describe, it, expect } from 'vitest'
import { mapTopPodcastsResponse, mapPodcastLookupResponse } from '@/entities/podcast/mappers'
import type {
  ItunesTopPodcastsResponse,
  ItunesPodcastLookupResponse,
} from '@/shared/api/itunes/types'

describe('Podcast Mappers', () => {
  describe('mapTopPodcastsResponse', () => {
    it('should map iTunes top podcasts response to PodcastSummary array', () => {
      const response: ItunesTopPodcastsResponse = {
        feed: {
          entry: [
            {
              id: { attributes: { 'im:id': '123' } },
              'im:name': { label: 'Test Podcast' },
              'im:artist': { label: 'Test Artist' },
              'im:image': [
                { label: 'https://example.com/img.jpg', attributes: { height: '600' } },
              ],
              summary: { label: 'Test summary' },
              category: { attributes: { label: 'Music' } },
              'im:releaseDate': { label: '2024-01-01' },
            },
          ],
        },
      }

      const result = mapTopPodcastsResponse(response)

      expect(result).toHaveLength(1)
      expect(result[0]).toEqual({
        id: '123',
        title: 'Test Podcast',
        author: 'Test Artist',
        imageUrl: 'https://example.com/img.jpg',
        summary: 'Test summary',
        category: 'Music',
        releaseLabel: '2024-01-01',
      })
    })

    it('should handle missing optional fields gracefully', () => {
      const response: ItunesTopPodcastsResponse = {
        feed: {
          entry: [
            {
              id: { attributes: { 'im:id': '456' } },
              'im:name': { label: 'Minimal Podcast' },
              'im:artist': { label: 'Artist' },
              'im:image': [],
              category: { attributes: {} },
            },
          ],
        },
      }

      const result = mapTopPodcastsResponse(response)

      expect(result).toHaveLength(1)
      expect(result[0].imageUrl).toBe('https://placehold.co/512x512?text=Podcast')
      expect(result[0].category).toBe('Unknown category')
    })

    it('should filter out entries without id', () => {
      const response: ItunesTopPodcastsResponse = {
        feed: {
          entry: [
            {
              id: { attributes: { 'im:id': '123' } },
              'im:name': { label: 'Valid Podcast' },
              'im:artist': { label: 'Artist' },
              'im:image': [],
            },
            {
              id: { attributes: {} },
              'im:name': { label: 'Invalid Podcast' },
              'im:artist': { label: 'Artist' },
              'im:image': [],
            },
          ],
        },
      }

      const result = mapTopPodcastsResponse(response)

      expect(result).toHaveLength(1)
      expect(result[0].title).toBe('Valid Podcast')
    })

    it('should pick largest image when multiple are available', () => {
      const response: ItunesTopPodcastsResponse = {
        feed: {
          entry: [
            {
              id: { attributes: { 'im:id': '789' } },
              'im:name': { label: 'Podcast' },
              'im:artist': { label: 'Artist' },
              'im:image': [
                { label: 'https://example.com/small.jpg', attributes: { height: '100' } },
                { label: 'https://example.com/large.jpg', attributes: { height: '600' } },
                { label: 'https://example.com/medium.jpg', attributes: { height: '300' } },
              ],
            },
          ],
        },
      }

      const result = mapTopPodcastsResponse(response)

      expect(result[0].imageUrl).toBe('https://example.com/large.jpg')
    })
  })

  describe('mapPodcastLookupResponse', () => {
    it('should map podcast lookup response with episodes', () => {
      const response: ItunesPodcastLookupResponse = {
        resultCount: 3,
        results: [
          {
            collectionId: 123,
            collectionName: 'Test Podcast',
            artistName: 'Test Artist',
            artworkUrl600: 'https://example.com/img.jpg',
            trackCount: 2,
            description: 'Short description',
            longDescription: 'Long description',
            wrapperType: 'collection',
            kind: 'podcast',
          },
          {
            trackId: 1001,
            trackName: 'Episode 1',
            description: 'Episode 1 description',
            releaseDate: '2024-01-01T00:00:00Z',
            trackTimeMillis: 3600000,
            episodeUrl: 'https://example.com/ep1.mp3',
            trackViewUrl: 'https://example.com/ep1',
            wrapperType: 'podcastEpisode',
          },
          {
            trackId: 1002,
            trackName: 'Episode 2',
            description: 'Episode 2 description',
            releaseDate: '2024-01-02T00:00:00Z',
            trackTimeMillis: 5400000,
            episodeUrl: 'https://example.com/ep2.mp3',
            trackViewUrl: 'https://example.com/ep2',
            wrapperType: 'podcastEpisode',
          },
        ],
      }

      const result = mapPodcastLookupResponse(response)

      expect(result.podcast).toBeDefined()
      expect(result.podcast?.id).toBe('123')
      expect(result.podcast?.title).toBe('Test Podcast')
      expect(result.podcast?.totalEpisodes).toBe(2)
      expect(result.episodes).toHaveLength(2)
      expect(result.episodes[0].title).toBe('Episode 1')
      expect(result.episodes[0].durationMs).toBe(3600000)
    })

    it('should handle empty results', () => {
      const response: ItunesPodcastLookupResponse = {
        resultCount: 0,
        results: [],
      }

      const result = mapPodcastLookupResponse(response)

      expect(result.podcast).toBeUndefined()
      expect(result.episodes).toHaveLength(0)
    })

    it('should use fallback collection if track not found', () => {
      const response: ItunesPodcastLookupResponse = {
        resultCount: 1,
        results: [
          {
            collectionId: 456,
            collectionName: 'Fallback Podcast',
            artistName: 'Artist',
            artworkUrl600: 'https://example.com/img.jpg',
            trackCount: 0,
            wrapperType: 'collection',
          },
        ],
      }

      const result = mapPodcastLookupResponse(response)

      expect(result.podcast?.title).toBe('Fallback Podcast')
    })
  })
})
