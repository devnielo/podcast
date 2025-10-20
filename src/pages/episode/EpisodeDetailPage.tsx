import DOMPurify from 'dompurify'
import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { PodcastSidebar } from '@/features/podcasts/PodcastSidebar'
import { usePodcastDetailQuery, usePodcastEpisodesQuery } from '@/features/podcasts/hooks'

export function EpisodeDetailPage() {
  const { podcastId = '', episodeId = '' } = useParams()
  const { data: podcast } = usePodcastDetailQuery(podcastId)
  const { data: episodes = [], isLoading } = usePodcastEpisodesQuery(podcastId)

  const episode = useMemo(() => episodes.find((e) => e.id === episodeId), [episodes, episodeId])
  const sanitized = useMemo(() => {
    const html = episode?.description ?? ''
    return DOMPurify.sanitize(html)
  }, [episode?.description])

  if (isLoading) {
    return (
      <section className="grid gap-6 md:grid-cols-3">
        <div className="rounded-3xl bg-dark-card shimmer h-[480px]" />
        <div className="md:col-span-2 space-y-4">
          <div className="h-10 w-2/3 rounded-lg bg-dark-card shimmer" />
          <div className="h-[420px] rounded-2xl bg-dark-card shimmer" />
        </div>
      </section>
    )
  }

  if (!podcast || !episode) {
    return (
      <section className="space-y-3 text-white/80">
        <h1 className="text-xl font-semibold">No se pudo cargar el episodio</h1>
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
      <div className="md:col-span-2 space-y-6">
        <h1 className="text-2xl font-semibold">{episode.title}</h1>
        <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: sanitized }} />
        {episode.audioUrl && (
          <audio controls className="w-full">
            <source src={episode.audioUrl} />
          </audio>
        )}
      </div>
    </section>
  )
}
