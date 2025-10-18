export interface PodcastSummary {
  id: string
  title: string
  author: string
  imageUrl: string
  summary?: string
}

export interface PodcastDetail extends PodcastSummary {
  description?: string
  totalEpisodes: number
  feedUrl?: string
}
