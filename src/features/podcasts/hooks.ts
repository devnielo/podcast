import type { UseQueryOptions } from '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query'

import type { Episode } from '@/entities/episode/types'
import type { PodcastDetail, PodcastSummary } from '@/entities/podcast/types'
import { QUERY_KEYS } from '@/shared/config/api'
import { fetchPodcastDetail, fetchTopPodcasts } from './api'
import type { PodcastDetailDTO } from './dto'

type DetailQueryKey = ReturnType<typeof QUERY_KEYS.podcastDetail>

type LookupOptions<TResult> = Omit<
  UseQueryOptions<PodcastDetailDTO, Error, TResult, DetailQueryKey>,
  'queryKey' | 'queryFn'
>

export function useTopPodcastsQuery(
  options?: Omit<UseQueryOptions<PodcastSummary[], Error>, 'queryKey' | 'queryFn'>,
) {
  return useQuery<PodcastSummary[]>({
    queryKey: QUERY_KEYS.topPodcasts,
    queryFn: fetchTopPodcasts,
    ...options,
  })
}

// Convenience hook matching existing usage in HomePage
export function useTopPodcasts(
  options?: Omit<UseQueryOptions<PodcastSummary[], Error>, 'queryKey' | 'queryFn'>,
) {
  return useTopPodcastsQuery(options)
}

export function usePodcastLookupQuery<TResult = PodcastDetailDTO>(
  podcastId: string,
  options?: LookupOptions<TResult>,
) {
  return useQuery<PodcastDetailDTO, Error, TResult, DetailQueryKey>({
    queryKey: QUERY_KEYS.podcastDetail(podcastId),
    queryFn: () => fetchPodcastDetail(podcastId),
    ...options,
  })
}

export function usePodcastDetailQuery(
  podcastId: string,
  options?: LookupOptions<PodcastDetail | undefined>,
) {
  return usePodcastLookupQuery(podcastId, {
    select: (data) => data.podcast,
    ...options,
  })
}

export function usePodcastEpisodesQuery(
  podcastId: string,
  options?: LookupOptions<Episode[]>,
) {
  return usePodcastLookupQuery(podcastId, {
    select: (data) => data.episodes,
    ...options,
  })
}
