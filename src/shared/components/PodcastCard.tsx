import { MoreHorizontal, Play, Plus } from 'lucide-react'
import { useEffect, useId, useRef, useState, type ReactNode, type MouseEvent, type CSSProperties } from 'react'

import type { ToastTone } from '@/shared/components/Toast'
import { useToast } from '@/shared/hooks/useToast'
import Button from './Button'

const CARD_HEIGHT = 550
const COVER_SIZE = 230
const SUMMARY_STEP = 3
const SUMMARY_MAX = 11
const SUMMARY_HARD_LIMIT = 11

interface PodcastCardProps {
  title: string
  author: string
  summary: string
  longSummary?: string
  releaseLabel: string
  imageUrl: string
  previewLabel?: string
  footer?: ReactNode
  onPreviewClick?: () => void
  onPlayClick?: () => void
  href?: string
}

export function PodcastCard({
  title,
  author,
  summary,
  longSummary,
  releaseLabel,
  imageUrl,
  previewLabel = 'Muestra del episodio',
  footer,
  onPreviewClick,
  onPlayClick,
  href = '#',
}: PodcastCardProps) {
  const { pushToast } = useToast()
  const [expanded, setExpanded] = useState(false)
  const [visibleLines, setVisibleLines] = useState(SUMMARY_STEP)
  const summaryId = useId()
  const summaryRef = useRef<HTMLParagraphElement | null>(null)

  const notify = (label: string, tone: ToastTone = 'info', icon?: ReactNode) => {
    pushToast({
      title: label,
      description: title,
      tone,
      icon,
    })
  }

  function handlePreviewClick(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault()
    event.stopPropagation()
    // No toast para previsualización para reducir ruido
    onPreviewClick?.()
  }

  function handleMoreClick(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault()
    event.stopPropagation()
    // Toggle inmediato: primera pulsación expande y oculta portada
    const next = !expanded
    setExpanded(next)
    setVisibleLines(next ? Math.min(SUMMARY_MAX, SUMMARY_HARD_LIMIT) : SUMMARY_STEP)
  }

  function handlePlayClick(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault()
    event.stopPropagation()
    notify('Reproducir ahora', 'success', <Play className="h-3.5 w-3.5" fill="currentColor" strokeWidth={0} />)
    onPlayClick?.()
  }

  function handleAuxiliaryClick(event: MouseEvent<HTMLButtonElement>, actionLabel: string, tone: ToastTone, icon: ReactNode) {
    event.preventDefault()
    event.stopPropagation()
    notify(actionLabel, tone, icon)
  }

  useEffect(() => {
    const el = summaryRef.current
    if (!el) return
  }, [expanded, visibleLines, summary, longSummary])

  return (
    <article className="group relative block">
      <div
        className="relative overflow-hidden rounded-3xl border border-dark-border bg-dark-card p-8 text-dark-text-primary shadow-[0_35px_90px_rgba(0,0,0,0.45)] transition-colors duration-300 hover:bg-dark-hover"
        style={{ height: CARD_HEIGHT }}
      >

        <div className="relative z-10 flex flex-col pb-24 md:pb-28">
          {/* Cabecera: título y subtítulo */}
          <div className="space-y-1">
            <a href={href} className="rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60">
              <h2
                className="text-[30px] font-semibold uppercase leading-[1.1] tracking-tight text-dark-text-primary lg:text-[36px] break-words overflow-hidden"
                style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}
              >
                {title}
              </h2>
            </a>
            <p className="text-sm font-medium text-dark-text-secondary">
              Episodio <span className="mx-1 text-dark-text-muted">•</span>
              <span className="text-dark-text-primary/90">{author}</span>
            </p>
          </div>

          {/* Portada centrada + barras EQ y overlay en hover */}
          {!expanded && (
          <div className="relative mt-4 flex justify-center">
            {/* Barras EQ laterales (solo md+ y hover) */}
            <div aria-hidden className="pointer-events-none absolute left-6 right-6 top-1/2 hidden -translate-y-1/2 opacity-0 transition-opacity duration-300 md:block group-hover:opacity-100">
              <div className="absolute left-0 top-1/2 flex -translate-y-1/2 items-end gap-1.5">
                <span className="block h-6 w-1.5 rounded bg-white/30 motion-safe:animate-bounce" style={{ animationDuration: '1.4s', animationDelay: '0ms' }} />
                <span className="block h-10 w-1.5 rounded bg-white/30 motion-safe:animate-bounce" style={{ animationDuration: '1.2s', animationDelay: '120ms' }} />
                <span className="block h-8 w-1.5 rounded bg-white/30 motion-safe:animate-bounce" style={{ animationDuration: '1.6s', animationDelay: '240ms' }} />
                <span className="block h-12 w-1.5 rounded bg-white/30 motion-safe:animate-bounce" style={{ animationDuration: '1.3s', animationDelay: '360ms' }} />
                <span className="block h-7 w-1.5 rounded bg-white/30 motion-safe:animate-bounce" style={{ animationDuration: '1.5s', animationDelay: '480ms' }} />
                <span className="block h-9 w-1.5 rounded bg-white/30 motion-safe:animate-bounce" style={{ animationDuration: '1.25s', animationDelay: '600ms' }} />
              </div>
              <div className="absolute right-0 top-1/2 flex -translate-y-1/2 items-end gap-1.5">
                <span className="block h-9 w-1.5 rounded bg-white/30 motion-safe:animate-bounce" style={{ animationDuration: '1.25s', animationDelay: '0ms' }} />
                <span className="block h-7 w-1.5 rounded bg-white/30 motion-safe:animate-bounce" style={{ animationDuration: '1.5s', animationDelay: '120ms' }} />
                <span className="block h-12 w-1.5 rounded bg-white/30 motion-safe:animate-bounce" style={{ animationDuration: '1.3s', animationDelay: '240ms' }} />
                <span className="block h-8 w-1.5 rounded bg-white/30 motion-safe:animate-bounce" style={{ animationDuration: '1.6s', animationDelay: '360ms' }} />
                <span className="block h-10 w-1.5 rounded bg-white/30 motion-safe:animate-bounce" style={{ animationDuration: '1.2s', animationDelay: '480ms' }} />
                <span className="block h-6 w-1.5 rounded bg-white/30 motion-safe:animate-bounce" style={{ animationDuration: '1.4s', animationDelay: '600ms' }} />
              </div>
            </div>

            <a href={href} className="rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60">
              <div
                className="relative shrink-0 overflow-hidden rounded-2xl border border-dark-border/70 shadow-[0_20px_55px_rgba(0,0,0,0.45)] transition-transform duration-300 group-hover:scale-[0.84]"
                style={{ height: COVER_SIZE, width: COVER_SIZE }}
              >
                <img src={imageUrl} alt={title} className="h-full w-full object-cover" loading="lazy" />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/25 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="pointer-events-none absolute bottom-2 left-2 rounded-full bg-black/60 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-white">
                  {releaseLabel}
                </div>
              </div>
            </a>
          </div>
          )}

          {/* Contenido y meta */}
          <div className={`mt-4`}> 
            <div className={`space-y-1 translate-y-0 ${!expanded ? 'transition-transform duration-300 ease-out group-hover:-translate-y-6 group-focus-within:-translate-y-6' : ''}`}>
              <div className="relative">
                <p
                  id={summaryId}
                  ref={summaryRef}
                  className={`overflow-hidden break-words text-base text-dark-text-primary/85 pr-1`}
                  style={{
                    display: '-webkit-box',
                    WebkitLineClamp: expanded ? SUMMARY_HARD_LIMIT : Math.min(visibleLines, SUMMARY_HARD_LIMIT),
                    WebkitBoxOrient: 'vertical',
                  } as CSSProperties}
                >
                  {expanded && longSummary ? longSummary : summary}
                </p>
                <div className="flex justify-end mt-1">
                  <button
                    type="button"
                    onClick={handleMoreClick}
                    aria-expanded={expanded}
                    aria-controls={summaryId}
                    className="absolute -bottom-4 right-0 text-xs font-semibold uppercase tracking-[0.22em] text-white/90 hover:underline hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                  >
                    {expanded ? 'Mostrar menos' : 'Mostrar más'}
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>



        {/* Controles emergentes desde la parte no visible (abajo) */}
        <div className="pointer-events-none absolute bottom-4 left-8 right-8 z-20">
          <div className="flex items-center gap-3 translate-y-6 opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100 pointer-events-auto">
            <Button
              type="button"
              onClick={handlePreviewClick}
              variant="secondary"
              size="sm"
            >
              {previewLabel}
            </Button>

            <div className="ml-auto flex items-center gap-2.5">
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-dark-border bg-white/10 text-white transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                aria-label="Mostrar opciones"
              >
                <MoreHorizontal className="h-4 w-4" strokeWidth={1.75} />
              </button>
              <button
                type="button"
                onClick={(event) => handleAuxiliaryClick(event, 'Añadido a tu biblioteca', 'success', <Plus className="h-4 w-4" strokeWidth={1.75} />)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-dark-border bg-white/10 text-white transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                aria-label="Añadir podcast"
              >
                <Plus className="h-4 w-4" strokeWidth={1.75} />
              </button>
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={handlePlayClick}
                className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-500 text-white shadow-[0_05px_10px_rgba(230,54,54,0.55)] transition duration-300 hover:bg-brand-400 hover:shadow-[0_08px_15px_rgba(230,54,54,0.45)] group-hover:scale-110 focus-visible:outline-none focus-visible:ring-2"
                aria-label="Reproducir"
              >
                <Play className="h-6 w-6 translate-x-0.5" fill="currentColor" stroke="none"  />
              </button>
            </div>
          </div>
        </div>

        {footer && (
          <div className="mt-8 border-t border-dark-border/60 pt-5 text-sm text-dark-text-secondary">{footer}</div>
        )}
      </div>
    </article>
  )
}
