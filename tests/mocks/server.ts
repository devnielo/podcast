import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'

const ITUNES_TOP_URL = 'https://itunes.apple.com/us/rss/toppodcasts/limit=100/genre=1310/json'
const ITUNES_LOOKUP_URL = 'https://itunes.apple.com/lookup'

export const server = setupServer(
  http.get(ITUNES_TOP_URL, () => {
    return HttpResponse.json({
      feed: {
        entry: [
          {
            id: { attributes: { 'im:id': '1' } },
            'im:name': { label: 'Podcast 1' },
            'im:artist': { label: 'Artist 1' },
            'im:image': [
              { label: 'https://example.com/img1.jpg', attributes: { height: '600' } },
            ],
            summary: { label: 'Summary 1' },
            category: { attributes: { label: 'Music' } },
            'im:releaseDate': { label: '2024-01-01' },
          },
          {
            id: { attributes: { 'im:id': '2' } },
            'im:name': { label: 'Podcast 2' },
            'im:artist': { label: 'Artist 2' },
            'im:image': [
              { label: 'https://example.com/img2.jpg', attributes: { height: '600' } },
            ],
            summary: { label: 'Summary 2' },
            category: { attributes: { label: 'Technology' } },
            'im:releaseDate': { label: '2024-01-02' },
          },
        ],
      },
    })
  }),

  http.get(ITUNES_LOOKUP_URL, ({ request }) => {
    const url = new URL(request.url)
    const podcastId = url.searchParams.get('id')

    if (podcastId === '1') {
      return HttpResponse.json({
        resultCount: 2,
        results: [
          {
            collectionId: 1,
            collectionName: 'Podcast 1',
            artistName: 'Artist 1',
            artworkUrl600: 'https://example.com/img1.jpg',
            trackCount: 2,
            description: 'Full description of podcast 1',
            longDescription: 'Long description of podcast 1',
          },
          {
            trackId: 101,
            trackName: 'Episode 1',
            description: 'Episode description 1',
            releaseDate: '2024-01-01T00:00:00Z',
            trackTimeMillis: 3600000,
            episodeUrl: 'https://example.com/ep1.mp3',
            trackViewUrl: 'https://example.com/ep1',
            wrapperType: 'podcastEpisode',
          },
          {
            trackId: 102,
            trackName: 'Episode 2',
            description: 'Episode description 2',
            releaseDate: '2024-01-02T00:00:00Z',
            trackTimeMillis: 5400000,
            episodeUrl: 'https://example.com/ep2.mp3',
            trackViewUrl: 'https://example.com/ep2',
            wrapperType: 'podcastEpisode',
          },
        ],
      })
    }

    return HttpResponse.json({ resultCount: 0, results: [] })
  }),
)
