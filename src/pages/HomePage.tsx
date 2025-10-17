import { useEffect } from 'react'
import { usePodcasts } from '@hooks'
import { PodcastFilter, PodcastList } from '@components/podcast'
import { MainLayout } from '@components/layout/MainLayout'
import { useNavigationStore } from '@store/navigationStore'

export const HomePage = () => {
  const { data: podcasts = [], isLoading, error } = usePodcasts()
  const setLoading = useNavigationStore((state) => state.setLoading)

  useEffect(() => {
    setLoading(isLoading)
  }, [isLoading, setLoading])

  if (error) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <p className="text-red-600 text-lg">Error al cargar los podcasts</p>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Top 100 Podcasts
        </h2>
        <p className="text-gray-600 mb-8">
          Descubre los podcasts más populares de Apple
        </p>

        <PodcastFilter />
        <PodcastList podcasts={podcasts} isLoading={isLoading} />
      </div>
    </MainLayout>
  )
}
