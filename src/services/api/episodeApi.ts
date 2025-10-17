import { httpClient } from './httpClient'
import { cacheService } from '../cache/cacheService'
import { Episode } from '@types'
import { CACHE_KEYS, CACHE_TTL, API_URLS } from '@utils'
import { parseEpisodesFromFeed } from './feedParser'

export const episodeApi = {
  getEpisodes: async (feedUrl: string, podcastId: number): Promise<Episode[]> => {
    return cacheService.getOrFetch(
      CACHE_KEYS.EPISODES(podcastId),
      async () => {
        const corsUrl = `${API_URLS.CORS_PROXY}${encodeURIComponent(feedUrl)}`
        const response = await httpClient.get<string>(corsUrl)
        return parseEpisodesFromFeed(response.data)
      },
      CACHE_TTL.EPISODES
    )
  },
}
