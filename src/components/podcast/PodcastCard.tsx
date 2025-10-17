import { Link } from 'react-router-dom'
import { Podcast } from '@types'
import { truncateText } from '@utils'

interface PodcastCardProps {
  podcast: Podcast
}

export const PodcastCard = ({ podcast }: PodcastCardProps) => {
  return (
    <Link
      to={`/podcast/${podcast.collectionId}`}
      className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
    >
      <div className="aspect-square overflow-hidden bg-gray-200">
        <img
          src={podcast.artworkUrl600}
          alt={podcast.collectionName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-primary-600 transition-colors">
          {podcast.collectionName}
        </h3>
        <p className="text-sm text-gray-600 mt-1">{podcast.artistName}</p>
        <p className="text-xs text-gray-500 mt-2">
          {podcast.trackCount} episodios
        </p>
      </div>
    </Link>
  )
}
