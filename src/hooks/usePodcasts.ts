import { useQuery } from '@tanstack/react-query'
import { podcastApi } from '@services'
import { Podcast } from '@types'

export const usePodcasts = () => {
  return useQuery<Podcast[], Error>({
    queryKey: ['podcasts'],
    queryFn: () => podcastApi.getTopPodcasts(),
    staleTime: 24 * 60 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
  })
}
