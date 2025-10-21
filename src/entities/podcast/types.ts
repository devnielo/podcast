export interface PodcastSummary {
  id: string
  title: string
  author: string
  imageUrl: string
  summary?: string
  category?: string
  releaseLabel?: string
}

export interface PodcastDetail extends PodcastSummary {
  description?: string
  totalEpisodes: number
  feedUrl?: string
  collectionViewUrl?: string
}
