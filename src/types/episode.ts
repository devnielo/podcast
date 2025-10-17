export interface Episode {
  id: string
  title: string
  description: string
  pubDate: string
  duration: number
  enclosure: {
    url: string
    type: string
    length: number
  }
  link: string
  guid: string
}

export interface EpisodeDetail extends Episode {
  content: string
  image?: string
}
