import { Link } from 'react-router-dom'
import { Play, Clock } from 'lucide-react'
import { Episode } from '@types'
import { formatDate, formatDuration } from '@utils'

interface EpisodeItemProps {
  episode: Episode
  podcastId: number
}

export const EpisodeItem = ({ episode, podcastId }: EpisodeItemProps) => {
  return (
    <Link
      to={`/podcast/${podcastId}/episode/${episode.id}`}
      className="group bg-white rounded-lg p-4 hover:shadow-md transition-shadow border border-gray-200 hover:border-primary-300"
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 mt-1">
          <Play className="w-5 h-5 text-primary-600 group-hover:scale-110 transition-transform" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2">
            {episode.title}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {formatDate(episode.pubDate)}
          </p>
          <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {formatDuration(episode.duration)}
          </p>
        </div>
      </div>
    </Link>
  )
}
