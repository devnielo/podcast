import type { Episode } from '@/entities/episode/types'
import type { PodcastDetail, PodcastSummary } from '@/entities/podcast/types'

export type TopPodcastsDTO = PodcastSummary[]

export interface PodcastDetailDTO {
  podcast?: PodcastDetail
  episodes: Episode[]
}
