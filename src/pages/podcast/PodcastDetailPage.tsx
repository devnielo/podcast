import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/shared/components/Button'
import { EpisodesTable } from '@/features/podcasts/EpisodesTable'
import { PodcastSidebar } from '@/features/podcasts/PodcastSidebar'
import { usePodcastDetailQuery, usePodcastEpisodesQuery } from '@/features/podcasts/hooks'

export function PodcastDetailPage() {
  const navigate = useNavigate()
  const { podcastId = '' } = useParams()
  const { data: podcast, isLoading: loadingPodcast, isError: errorPodcast, error: podcastError } = usePodcastDetailQuery(podcastId)
  const { data: episodes = [], isError: errorEpisodes, error: episodesError } = usePodcastEpisodesQuery(podcastId)

  const isInitialLoading = loadingPodcast && !podcast
  const isError = errorPodcast || errorEpisodes

  if (isInitialLoading) {
    return (
      <section className="flex gap-8">
        <div className="w-72 shrink-0">
          <div className="rounded-3xl bg-dark-card shimmer h-[480px]" />
        </div>
        <div className="flex-1 space-y-4">
          <div className="h-10 w-1/2 rounded-lg bg-dark-card shimmer" />
          <div className="h-[420px] rounded-2xl bg-dark-card shimmer" />
        </div>
      </section>
    )
  }

  if (isError || !podcast) {
    const errorMsg = podcastError?.message || episodesError?.message || 'Error desconocido'
    return (
      <section className="space-y-3 text-white/80">
        <h1 className="text-xl font-semibold">No se pudo cargar el podcast</h1>
        <p className="text-sm text-white/60">{errorMsg}</p>
        <p className="text-xs text-white/40">ID: {podcastId}</p>
      </section>
    )
  }

  return (
    <section className="flex gap-8 flex-1 overflow-hidden">
      <div className="w-72 shrink-0 overflow-y-auto">
        <div className="mb-4">
          <Button
            onClick={() => navigate(-1)}
            variant="ghost"
            size="sm"
            leftIcon={<ArrowLeft size={16} />}
          >
            Volver
          </Button>
        </div>
        <PodcastSidebar
          id={podcast.id}
          title={podcast.title}
          author={podcast.author}
          imageUrl={podcast.imageUrl}
          description={podcast.description || podcast.summary}
          totalEpisodes={podcast.totalEpisodes}
          feedUrl={podcast.feedUrl}
          collectionViewUrl={podcast.collectionViewUrl}
        />
      </div>
      <div className="flex-1 overflow-hidden flex flex-col min-h-0">
        <EpisodesTable
          podcastId={podcast.id}
          episodes={episodes}
          podcastAuthor={podcast.author}
          podcastImage={podcast.imageUrl}
        />
      </div>
    </section>
  )
}
