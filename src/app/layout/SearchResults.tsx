import { useNavigate } from 'react-router-dom'
import type { PodcastSummary } from '@/entities/podcast/types'

interface SearchResultsProps {
  results: PodcastSummary[]
  query: string
  isOpen: boolean
}

export function SearchResults({ results, query, isOpen }: SearchResultsProps) {
  const navigate = useNavigate()

  if (!isOpen || !query.trim() || results.length === 0) {
    return null
  }

  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-dark-surface border border-dark-border/40 rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
      <div className="p-2 space-y-1">
        {results.map((podcast) => (
          <button
            key={podcast.id}
            onClick={() => navigate(`/podcast/${podcast.id}`)}
            className="w-full flex gap-3 p-2 rounded-lg hover:bg-dark-hover transition-colors text-left"
          >
            <img
              src={podcast.imageUrl}
              alt={podcast.title}
              className="w-12 h-12 rounded object-cover shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-dark-text-primary truncate">{podcast.title}</p>
              <p className="text-xs text-dark-text-secondary truncate">{podcast.author}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
