export const API_URLS = {
  TOP_PODCASTS: 'https://itunes.apple.com/us/rss/toppodcasts/limit=100/genre=1310/json',
  PODCAST_LOOKUP: 'https://itunes.apple.com/lookup?id=',
  CORS_PROXY: 'https://allorigins.win/api/raw?url=',
}

export const CACHE_TTL = {
  PODCASTS: 24 * 60 * 60 * 1000,
  EPISODES: 24 * 60 * 60 * 1000,
}

export const CACHE_KEYS = {
  TOP_PODCASTS: 'top_podcasts',
  PODCAST_DETAIL: (id: number) => `podcast_${id}`,
  EPISODES: (id: number) => `episodes_${id}`,
}

export const DEBOUNCE_DELAY = 300

export const APP_NAME = 'Podcast App'
