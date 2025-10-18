export interface ItunesImage {
  label: string
  attributes?: {
    height?: string
  }
}

export interface ItunesTopPodcastEntry {
  id: { attributes: { 'im:id': string } }
  title?: { label?: string }
  summary?: { label?: string }
  'im:name'?: { label?: string }
  'im:artist'?: { label?: string }
  'im:image'?: ItunesImage[]
}

export interface ItunesTopPodcastsResponse {
  feed?: {
    entry?: ItunesTopPodcastEntry[]
  }
}

export interface ItunesPodcastResult {
  wrapperType?: string
  kind?: string
  collectionId?: number
  trackId?: number
  collectionName?: string
  trackName?: string
  artistName?: string
  artworkUrl100?: string
  artworkUrl600?: string
  artworkUrl160?: string
  artworkUrl512?: string
  description?: string
  longDescription?: string
  feedUrl?: string
  collectionViewUrl?: string
  trackCount?: number
}

export interface ItunesPodcastEpisodeResult {
  wrapperType?: string
  kind?: string
  trackId?: number
  episodeGuid?: string
  trackName?: string
  shortDescription?: string
  description?: string
  releaseDate?: string
  trackTimeMillis?: number
  episodeUrl?: string
  previewUrl?: string
  trackViewUrl?: string
  artworkUrl60?: string
  artworkUrl100?: string
}

export interface ItunesPodcastLookupResponse {
  resultCount?: number
  results?: Array<ItunesPodcastResult | ItunesPodcastEpisodeResult>
}
