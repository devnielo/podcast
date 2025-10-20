import DOMPurify from 'dompurify'
import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { format } from 'date-fns'
import { Button } from '@/shared/components/Button'
import { PlayButton } from '@/shared/components/PlayButton'
import { PodcastSidebar } from '@/features/podcasts/PodcastSidebar'
import { usePodcastDetailQuery, usePodcastEpisodesQuery } from '@/features/podcasts/hooks'

function formatDuration(ms?: number): string {
  if (!ms || ms <= 0) return '—'
  const totalSeconds = Math.floor(ms / 1000)
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60
  const parts = [h > 0 ? String(h) : null, String(m).padStart(2, '0'), String(s).padStart(2, '0')].filter(Boolean)
  return parts.join(':')
}

export function EpisodeDetailPage() {
  const navigate = useNavigate()
  const { podcastId = '', episodeId = '' } = useParams()
  const { data: podcast } = usePodcastDetailQuery(podcastId)
  const { data: episodes = [], isLoading } = usePodcastEpisodesQuery(podcastId)

  const episode = useMemo(() => episodes.find((e) => e.id === episodeId), [episodes, episodeId])
  const sanitized = useMemo(() => {
    const html = episode?.description ?? ''
    return DOMPurify.sanitize(html)
  }, [episode?.description])

  if (isLoading || !podcast) {
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

  if (!episode) {
    return (
      <section className="space-y-3 text-white/80">
        <h1 className="text-xl font-semibold">Episodio no encontrado</h1>
        <p className="text-sm text-white/60">Intenta de nuevo más tarde.</p>
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
        <div className="space-y-4 shrink-0">
          <div>
            <h1 className="text-3xl font-semibold leading-tight">{episode.title}</h1>
            <div className="flex items-center gap-4 text-sm text-dark-text-secondary mt-2">
              {episode.releaseDate && (
                <span>{format(new Date(episode.releaseDate), 'dd MMM yyyy')}</span>
              )}
              {episode.durationMs && (
                <>
                  <span className="text-dark-text-muted">•</span>
                  <span>{formatDuration(episode.durationMs)}</span>
                </>
              )}
            </div>
          </div>
          {episode.audioUrl && (
            <PlayButton
              episode={{
                id: episode.id,
                title: episode.title,
                author: podcast.author,
                imageUrl: podcast.imageUrl,
                audioUrl: episode.audioUrl,
                duration: episode.durationMs,
              }}
              podcastId={podcastId}
              variant="button"
            />
          )}
        </div>

        {sanitized && (
          <div className="flex-1 overflow-y-auto min-h-0 mt-6">
            <div className="prose prose-invert max-w-none text-dark-text-primary/85 leading-relaxed">
              <div dangerouslySetInnerHTML={{ __html: sanitized }} />
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
