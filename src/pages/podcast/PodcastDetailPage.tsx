import { useParams } from 'react-router-dom'
import { EpisodesTable } from '@/features/podcasts/EpisodesTable'
import { PodcastSidebar } from '@/features/podcasts/PodcastSidebar'
import { usePodcastDetailQuery, usePodcastEpisodesQuery } from '@/features/podcasts/hooks'

export function PodcastDetailPage() {
  const { podcastId = '' } = useParams()
  const { data: podcast, isLoading: loadingPodcast, isError: errorPodcast } = usePodcastDetailQuery(podcastId)
  const { data: episodes = [], isLoading: loadingEpisodes, isError: errorEpisodes } = usePodcastEpisodesQuery(podcastId)

  const isLoading = loadingPodcast || loadingEpisodes
  const isError = errorPodcast || errorEpisodes

  if (isLoading) {
    return (
      <section className="grid gap-6 md:grid-cols-3">
        <div className="rounded-3xl bg-dark-card shimmer h-[480px]" />
        <div className="md:col-span-2 space-y-4">
          <div className="h-10 w-1/2 rounded-lg bg-dark-card shimmer" />
          <div className="h-[420px] rounded-2xl bg-dark-card shimmer" />
        </div>
      </section>
    )
  }

  if (isError || !podcast) {
    return (
      <section className="space-y-3 text-white/80">
        <h1 className="text-xl font-semibold">No se pudo cargar el podcast</h1>
        <p className="text-sm text-white/60">Intenta de nuevo más tarde.</p>
      </section>
    )
  }

  return (
    <section className="grid gap-8 md:grid-cols-3">
      <div>
        <PodcastSidebar
          id={podcast.id}
          title={podcast.title}
          author={podcast.author}
          imageUrl={podcast.imageUrl}
          description={podcast.description || podcast.summary}
        />
      </div>
      <div className="md:col-span-2">
        <EpisodesTable podcastId={podcast.id} episodes={episodes} />
      </div>
    </section>
  )
}
