import { useMemo } from 'react'
import { Podcast } from '@types'
import { PodcastCard } from './PodcastCard'
import { useFilterStore } from '@store/filterStore'
import { useDebounce } from '@hooks'
import { DEBOUNCE_DELAY } from '@utils'

interface PodcastListProps {
  podcasts: Podcast[]
  isLoading: boolean
}

export const PodcastList = ({ podcasts, isLoading }: PodcastListProps) => {
  const searchTerm = useFilterStore((state) => state.searchTerm)
  const debouncedSearchTerm = useDebounce(searchTerm, DEBOUNCE_DELAY)

  const filteredPodcasts = useMemo(() => {
    if (!debouncedSearchTerm.trim()) return podcasts

    const term = debouncedSearchTerm.toLowerCase()
    return podcasts.filter(
      (podcast) =>
        podcast.collectionName.toLowerCase().includes(term) ||
        podcast.artistName.toLowerCase().includes(term)
    )
  }, [podcasts, debouncedSearchTerm])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-gray-200 rounded-lg h-64 animate-pulse" />
        ))}
      </div>
    )
  }

  if (filteredPodcasts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg">
          {debouncedSearchTerm
            ? `No se encontraron podcasts para "${debouncedSearchTerm}"`
            : 'No hay podcasts disponibles'}
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {filteredPodcasts.map((podcast) => (
        <PodcastCard key={podcast.collectionId} podcast={podcast} />
      ))}
    </div>
  )
}
