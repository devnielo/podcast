import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { podcastApi, episodeApi } from '@services'
import { PodcastSidebar } from '@components/podcast'
import { EpisodeList } from '@components/episode'
import { MainLayout } from '@components/layout/MainLayout'
import { useNavigationStore } from '@store/navigationStore'

export const PodcastDetailPage = () => {
  const { podcastId } = useParams<{ podcastId: string }>()
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

  useEffect(() => {
    const isLoading = podcastQuery.isLoading || episodesQuery.isLoading
    setLoading(isLoading)
  }, [podcastQuery.isLoading, episodesQuery.isLoading, setLoading])

  if (podcastQuery.isLoading) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <p className="text-gray-600">Cargando podcast...</p>
        </div>
      </MainLayout>
    )
  }

  if (!podcastQuery.data) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <p className="text-red-600">Podcast no encontrado</p>
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

        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Episodios
            </h2>
            <p className="text-gray-600 mb-6">
              {episodesQuery.data?.length || 0} episodios disponibles
            </p>

            <EpisodeList
              episodes={episodesQuery.data || []}
              podcastId={Number(podcastId)}
              isLoading={episodesQuery.isLoading}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
