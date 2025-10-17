import { useQuery } from '@tanstack/react-query'
import { episodeApi } from '@services'
import { Episode } from '@types'

export const useEpisodes = (feedUrl: string | null, podcastId: number) => {
  return useQuery<Episode[], Error>({
    queryKey: ['episodes', podcastId],
    queryFn: () => {
      if (!feedUrl) throw new Error('Feed URL is required')
      return episodeApi.getEpisodes(feedUrl, podcastId)
    },
    enabled: !!feedUrl,
    staleTime: 24 * 60 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
  })
}
