import type {
  ItunesPodcastEpisodeResult,
  ItunesPodcastLookupResponse,
  ItunesPodcastResult,
  ItunesTopPodcastEntry,
  ItunesTopPodcastsResponse,
} from '@/shared/api/itunes/types'
import type { Episode } from '@/entities/episode/types'
import type { PodcastDetail, PodcastSummary } from './types'

const FALLBACK_IMAGE = 'https://placehold.co/512x512?text=Podcast'

function pickImage(images?: ItunesTopPodcastEntry['im:image']) {
  if (!images?.length) return FALLBACK_IMAGE

  return (
    [...images]
      .sort((a, b) => Number(a.attributes?.height ?? 0) - Number(b.attributes?.height ?? 0))
      .at(-1)?.label ?? FALLBACK_IMAGE
  )
}

export function mapTopPodcastsResponse(response: ItunesTopPodcastsResponse): PodcastSummary[] {
  const entries = response.feed?.entry ?? []

  return entries
    .map((entry) => {
      const id = entry.id?.attributes?.['im:id']
      if (!id) return undefined

      return {
        id,
        title: entry['im:name']?.label ?? entry.title?.label ?? 'Unknown title',
        author: entry['im:artist']?.label ?? 'Unknown author',
        imageUrl: pickImage(entry['im:image']),
        summary: entry.summary?.label,
        category: entry.category?.attributes?.label ?? 'Unknown category',
        releaseLabel: entry['im:releaseDate']?.attributes?.label ?? entry['im:releaseDate']?.label,
      } satisfies PodcastSummary
    })
    .filter(Boolean) as PodcastSummary[]
}

function mapPodcastResult(result: ItunesPodcastResult): PodcastDetail | undefined {
  const id = result.collectionId ?? result.trackId
  if (!id) return undefined

  return {
    id: String(id),
    title: result.collectionName ?? result.trackName ?? 'Unknown title',
    author: result.artistName ?? 'Unknown author',
    description: result.longDescription ?? result.description,
    imageUrl:
      result.artworkUrl600 ?? result.artworkUrl512 ?? result.artworkUrl100 ?? FALLBACK_IMAGE,
    summary: result.description ?? result.longDescription,
    totalEpisodes: result.trackCount ?? 0,
    feedUrl: result.feedUrl,
  }
}

function mapEpisodeResult(result: ItunesPodcastEpisodeResult): Episode | undefined {
  const id = String(result.trackId ?? result.episodeGuid ?? '')
  if (!id) return undefined

  return {
    id,
    title: result.trackName ?? 'Sin título',
    description: result.description ?? result.shortDescription,
    releaseDate: result.releaseDate,
    durationMs: result.trackTimeMillis,
    audioUrl: result.episodeUrl ?? result.previewUrl,
    episodeUrl: result.trackViewUrl,
  }
}

export function mapPodcastLookupResponse(
  response: ItunesPodcastLookupResponse,
): { podcast?: PodcastDetail; episodes: Episode[] } {
  const results = response.results ?? []

  const podcastResult = results.find(
    (item): item is ItunesPodcastResult => item.wrapperType === 'track' && item.kind === 'podcast',
  )

  const fallbackCollection = results.find(
    (item): item is ItunesPodcastResult => item.wrapperType === 'collection',
  )

  const podcast = podcastResult ? mapPodcastResult(podcastResult) : undefined
  const podcastFromCollection = !podcast ? fallbackCollection && mapPodcastResult(fallbackCollection) : undefined

  const episodes = results
    .filter(
      (item): item is ItunesPodcastEpisodeResult =>
        item.wrapperType === 'podcastEpisode' || item.wrapperType === 'track',
    )
    .map(mapEpisodeResult)
    .filter(Boolean) as Episode[]

  return {
    podcast: podcast ?? podcastFromCollection,
    episodes,
  }
}
