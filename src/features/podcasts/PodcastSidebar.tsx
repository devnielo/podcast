import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { sanitizeText } from '@/shared/utils/sanitizer'

interface PodcastSidebarProps {
  id: string
  title: string
  author: string
  imageUrl: string
  description?: string
  totalEpisodes?: number
  feedUrl?: string
  collectionViewUrl?: string
}

export function PodcastSidebar({ id, title, author, imageUrl, description, totalEpisodes, feedUrl, collectionViewUrl }: PodcastSidebarProps) {
  const { podcastId } = useParams()
  const targetId = id || podcastId || ''
  const sanitizedDescription = useMemo(() => sanitizeText(description || ''), [description])
  return (
    <div className="sticky top-[96px] space-y-4">
      <Link to={`/podcast/${targetId}`} className="block overflow-hidden rounded-3xl border border-dark-border/40 bg-dark-card/80 shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
        <img src={imageUrl} alt={title} className="aspect-square w-full object-cover" />
      </Link>
      <div className="space-y-1 rounded-3xl border border-dark-border/40 bg-dark-card/60 p-4">
        <Link to={`/podcast/${targetId}`} className="block text-lg font-semibold text-white">
          {title}
        </Link>
        <Link to={`/podcast/${targetId}`} className="block text-sm text-white/70">
          {author}
        </Link>
      </div>
      {sanitizedDescription && (
        <div className="rounded-3xl border border-dark-border/40 bg-dark-card/50 p-4 text-sm text-white/80">
          <div className="line-clamp-[12] whitespace-pre-line">{sanitizedDescription}</div>
        </div>
      )}
      {(totalEpisodes !== undefined || feedUrl || collectionViewUrl) && (
        <div className="rounded-3xl border border-dark-border/40 bg-dark-card/50 p-4 space-y-2 text-xs text-white/70">
          {totalEpisodes !== undefined && (
            <div className="flex items-center justify-between">
              <span>Episodios:</span>
              <span className="font-semibold text-white">{totalEpisodes}</span>
            </div>
          )}
          <div className="space-y-2 pt-2 border-t border-dark-border/40">
            {feedUrl && (
              <a
                href={feedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-brand-300 hover:text-brand-200 transition-colors break-all text-[10px]"
              >
                RSS Feed
              </a>
            )}
            {collectionViewUrl && (
              <a
                href={collectionViewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-brand-300 hover:text-brand-200 transition-colors break-all text-[10px]"
              >
                Ver en iTunes
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
