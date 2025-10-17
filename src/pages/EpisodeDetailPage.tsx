import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { podcastApi, episodeApi } from '@services'
import { PodcastSidebar } from '@components/podcast'
import { AudioPlayer } from '@components/episode'
import { MainLayout } from '@components/layout/MainLayout'
import { useNavigationStore } from '@store/navigationStore'

export const EpisodeDetailPage = () => {
  const { podcastId, episodeId } = useParams<{ podcastId: string; episodeId: string }>()
  const setLoading = useNavigationStore((state) => state.setLoading)

  const podcastQuery = useQuery({
    queryKey: ['podcast', podcastId],
    queryFn: () => podcastApi.getPodcastDetail(Number(podcastId)),
    enabled: !!podcastId,
  })

  const episodesQuery = useQuery({
    queryKey: ['episodes', podcastId],
    queryFn: () => {
      if (!podcastQuery.data?.feedUrl) throw new Error('Feed URL not available')
      return episodeApi.getEpisodes(podcastQuery.data.feedUrl, Number(podcastId))
    },
    enabled: !!podcastQuery.data?.feedUrl,
  })

  const episode = episodesQuery.data?.find((ep) => ep.id === episodeId)

  useEffect(() => {
    const isLoading = podcastQuery.isLoading || episodesQuery.isLoading
    setLoading(isLoading)
  }, [podcastQuery.isLoading, episodesQuery.isLoading, setLoading])

  if (podcastQuery.isLoading || episodesQuery.isLoading) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <p className="text-gray-600">Cargando episodio...</p>
        </div>
      </MainLayout>
    )
  }

  if (!podcastQuery.data || !episode) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <p className="text-red-600">Episodio no encontrado</p>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <PodcastSidebar podcast={podcastQuery.data} />
        </div>

        <div className="lg:col-span-3 space-y-6">
          <AudioPlayer
            audioUrl={episode.enclosure.url}
            title={episode.title}
          />

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {episode.title}
            </h2>

            {episode.description && (
              <div className="prose prose-sm max-w-none text-gray-700">
                <div
                  dangerouslySetInnerHTML={{ __html: episode.description }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
