import { Link } from 'react-router-dom'
import { Podcast } from '@types'

interface PodcastSidebarProps {
  podcast: Podcast
}

export const PodcastSidebar = ({ podcast }: PodcastSidebarProps) => {
  return (
    <aside className="bg-white rounded-lg shadow-md p-6">
      <Link
        to={`/podcast/${podcast.collectionId}`}
        className="block mb-4 hover:opacity-80 transition-opacity"
      >
        <img
          src={podcast.artworkUrl600}
          alt={podcast.collectionName}
          className="w-full rounded-lg shadow-md"
        />
      </Link>

      <Link
        to={`/podcast/${podcast.collectionId}`}
        className="block text-xl font-bold text-gray-900 hover:text-primary-600 transition-colors mb-2"
      >
        {podcast.collectionName}
      </Link>

      <Link
        to={`/podcast/${podcast.collectionId}`}
        className="block text-sm text-primary-600 hover:text-primary-700 font-medium mb-4"
      >
        {podcast.artistName}
      </Link>

      {podcast.description && (
        <p className="text-sm text-gray-600 line-clamp-6">
          {podcast.description}
        </p>
      )}
    </aside>
  )
}
