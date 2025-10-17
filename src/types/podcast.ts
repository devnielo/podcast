export interface Podcast {
  id: number
  collectionId: number
  collectionName: string
  artistName: string
  collectionViewUrl: string
  feedUrl: string
  artworkUrl600: string
  artworkUrl100: string
  contentAdvisoryRating?: string
  genres: string[]
  releaseDate: string
  trackCount: number
  description?: string
}

export interface PodcastDetail extends Podcast {
  collectionExplicitness: string
  artistViewUrl: string
  primaryGenreName: string
  primaryGenreId: number
}
