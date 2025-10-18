import type { Episode } from '@/entities/episode/types'
import { mapPodcastLookupResponse, mapTopPodcastsResponse } from '@/entities/podcast/mappers'
import type { PodcastDetail, PodcastSummary } from '@/entities/podcast/types'
import { fetchJson } from '@/shared/api/http'
import type {
  ItunesPodcastLookupResponse,
  ItunesTopPodcastsResponse,
} from '@/shared/api/itunes/types'
import { ITUNES_TOP_PODCASTS_URL, itunesPodcastLookupUrl } from '@/shared/config/api'

export async function fetchTopPodcasts(): Promise<PodcastSummary[]> {
  const payload = await fetchJson<ItunesTopPodcastsResponse>(ITUNES_TOP_PODCASTS_URL)
  return mapTopPodcastsResponse(payload)
}

export async function fetchPodcastDetail(
  podcastId: string,
): Promise<{ podcast?: PodcastDetail; episodes: Episode[] }> {
  const payload = await fetchJson<ItunesPodcastLookupResponse>(itunesPodcastLookupUrl(podcastId))
  return mapPodcastLookupResponse(payload)
}
