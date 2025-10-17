import { httpClient } from './httpClient'
import { cacheService } from '../cache/cacheService'
import { Podcast, PodcastDetail, ApiResponse } from '@types'
import { API_URLS, CACHE_KEYS, CACHE_TTL } from '@utils'

export const podcastApi = {
  getTopPodcasts: async (): Promise<Podcast[]> => {
    return cacheService.getOrFetch(
      CACHE_KEYS.TOP_PODCASTS,
      async () => {
        const response = await httpClient.get<ApiResponse<Podcast>>(
          API_URLS.TOP_PODCASTS
        )
        return response.data.results
      },
      CACHE_TTL.PODCASTS
    )
  },

  getPodcastDetail: async (podcastId: number): Promise<PodcastDetail> => {
    return cacheService.getOrFetch(
      CACHE_KEYS.PODCAST_DETAIL(podcastId),
      async () => {
        const response = await httpClient.get<ApiResponse<PodcastDetail>>(
          `${API_URLS.PODCAST_LOOKUP}${podcastId}`
        )
        if (response.data.results.length === 0) {
          throw new Error(`Podcast with id ${podcastId} not found`)
        }
        return response.data.results[0]
      },
      CACHE_TTL.PODCASTS
    )
  },
}
