import { Episode } from '@types'
import { EpisodeItem } from './EpisodeItem'

interface EpisodeListProps {
  episodes: Episode[]
  podcastId: number
  isLoading: boolean
}

export const EpisodeList = ({ episodes, podcastId, isLoading }: EpisodeListProps) => {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="bg-gray-200 rounded-lg h-20 animate-pulse" />
        ))}
      </div>
    )
  }

  if (episodes.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No hay episodios disponibles</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {episodes.map((episode) => (
        <EpisodeItem key={episode.id} episode={episode} podcastId={podcastId} />
      ))}
    </div>
  )
}
