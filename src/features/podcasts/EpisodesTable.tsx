import { format } from 'date-fns'
import { Link } from 'react-router-dom'
import { PlayButton } from '@/shared/components/PlayButton'
import type { Episode } from '@/entities/episode/types'

interface EpisodesTableProps {
  podcastId: string
  episodes: Episode[]
  podcastAuthor?: string
  podcastImage?: string
  isLoading?: boolean
}

function formatDuration(ms?: number) {
  if (!ms || ms <= 0) return '—'
  const totalSeconds = Math.floor(ms / 1000)
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60
  const parts = [h > 0 ? String(h) : null, String(m).padStart(2, '0'), String(s).padStart(2, '0')].filter(Boolean)
  return parts.join(':')
}

export function EpisodesTable({ podcastId, episodes, podcastAuthor = 'Unknown', podcastImage = '' }: EpisodesTableProps) {
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between shrink-0 pb-4">
        <h2 className="text-xl font-semibold">Todos los episodios</h2>
        <span className="text-sm text-white/60">{episodes.length}</span>
      </div>
      <div className="flex-1 overflow-y-auto space-y-3 min-h-0">
        {episodes.map((ep) => (
          <div
            key={ep.id}
            className="flex gap-4 p-3 rounded-lg bg-dark-card/40 hover:bg-dark-hover/40 transition-colors group"
          >
            <Link
              to={`/podcast/${podcastId}/episode/${ep.id}`}
              className="shrink-0 w-16 h-16 rounded-md overflow-hidden"
            >
              <img
                src={podcastImage}
                alt={ep.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
            </Link>
            <div className="flex-1 min-w-0 flex flex-col justify-center">
              <Link
                to={`/podcast/${podcastId}/episode/${ep.id}`}
                className="text-sm font-semibold text-white hover:text-brand-300 transition-colors line-clamp-2"
              >
                {ep.title}
              </Link>
              <div className="flex items-center gap-2 text-xs text-white/60 mt-1">
                {ep.releaseDate && (
                  <span>{format(new Date(ep.releaseDate), 'dd MMM yyyy')}</span>
                )}
                {ep.releaseDate && ep.durationMs && (
                  <span className="text-white/40">•</span>
                )}
                {ep.durationMs && (
                  <span>{formatDuration(ep.durationMs)}</span>
                )}
              </div>
            </div>
            <div className="shrink-0 flex items-center">
              {ep.audioUrl && (
                <PlayButton
                  episode={{
                    id: ep.id,
                    title: ep.title,
                    author: podcastAuthor,
                    imageUrl: podcastImage,
                    audioUrl: ep.audioUrl,
                    duration: ep.durationMs,
                  }}
                  podcastId={podcastId}
                  variant="icon"
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
