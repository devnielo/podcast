export const ITUNES_TOP_PODCASTS_URL = 'https://itunes.apple.com/us/rss/toppodcasts/limit=100/genre=1310/json'

export const itunesPodcastLookupUrl = (podcastId: string) =>
  `https://itunes.apple.com/lookup?id=${podcastId}&media=podcast&entity=podcastEpisode`

export const CORS_PROXY_URL = 'https://api.allorigins.win/raw?url='

export const QUERY_KEYS = {
  topPodcasts: ['podcasts', 'top-100'] as const,
  podcastDetail: (podcastId: string) => ['podcasts', podcastId, 'detail'] as const,
} as const

export const CACHE_TTL_MS = 1000 * 60 * 60 * 24
