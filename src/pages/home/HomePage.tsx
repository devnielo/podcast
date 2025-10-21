import { Search } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useIsFetching } from '@tanstack/react-query'

import type { PodcastSummary } from '@/entities/podcast/types'
import { PodcastCard } from '@/shared/components/PodcastCard'
import Button from '@/shared/components/Button'
import { Input } from '@/shared/components/Input'
import { useTopPodcasts } from '@/features/podcasts'

interface FeaturedPodcast extends PodcastSummary {
  summary: string
  releaseLabel: string
  category: string
}


const CATEGORY_MAX = 4

export function HomePage() {
  const navigate = useNavigate()
  const { data, isLoading, isError } = useTopPodcasts()
  const isFetching = useIsFetching() > 0
  const podcasts: FeaturedPodcast[] = useMemo(
    () =>
      (data ?? []).map((podcast) => ({
        ...podcast,
        summary: podcast.summary ?? '',
        category: podcast.category ?? 'Music',
        releaseLabel: podcast.releaseLabel ?? 'Sin fecha',
      })),
    [data],
  )

  const [filter, setFilter] = useState(() => new URLSearchParams(window.location.search).get('q') ?? '')
  const [activeTag, setActiveTag] = useState<string>(() => new URLSearchParams(window.location.search).get('tag') ?? 'all')

  const loading = isLoading && podcasts.length === 0
  const showInitialSkeleton = (isLoading || isFetching) && podcasts.length === 0
  const LOAD_STEP = 12
  const [visibleCount, setVisibleCount] = useState(LOAD_STEP)
  const sentinelRef = useRef<HTMLDivElement | null>(null)
  const [allowEmpty, setAllowEmpty] = useState(false)
  const filtersRef = useRef<HTMLDivElement | null>(null)
  const [pinFilters, setPinFilters] = useState(false)
  const [stickyTop, setStickyTop] = useState<number>(72)

  const categoryCounts = useMemo(() => {
    const m = new Map<string, number>()
    for (const p of podcasts) {
      const key = (p.category ?? '').trim() || 'Other'
      m.set(key, (m.get(key) ?? 0) + 1)
    }
    return m
  }, [podcasts])

  const topCategories = useMemo(() => {
    return Array.from(categoryCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, CATEGORY_MAX)
      .map(([name]) => name)
  }, [categoryCounts])

  const topSet = useMemo(() => new Set(topCategories.map((c) => c.toLowerCase())), [topCategories])

  const tabs = useMemo(() => {
    const total = podcasts.length
    const top = topCategories.map((name) => ({ id: name, label: `${name} (${categoryCounts.get(name) ?? 0})` }))
    const othersCount = total - topCategories.reduce((acc, name) => acc + (categoryCounts.get(name) ?? 0), 0)
    const withOthers = othersCount > 0 ? [...top, { id: 'other', label: `Otros (${othersCount})` }] : top
    return [{ id: 'all', label: `Todo (${total})` }, ...withOthers]
  }, [podcasts.length, topCategories, categoryCounts])

  const matchesTag = useCallback(
    (podcast: FeaturedPodcast) => {
      const raw = podcast.category ?? ''
      const category = raw.toLowerCase()
      if (activeTag === 'all') return true
      if (activeTag === 'other') return !topSet.has(category)
      return category === activeTag.toLowerCase()
    },
    [activeTag, topSet],
  )

  const filteredPodcasts = useMemo(
    () =>
      podcasts.filter((podcast) => {
        const term = filter.trim().toLowerCase()
        if (!term) return true
        return (
          podcast.title.toLowerCase().includes(term) ||
          podcast.author.toLowerCase().includes(term) ||
          (podcast.category ?? '').toLowerCase().includes(term)
        )
      }),
    [filter, podcasts],
  )

  const visiblePodcasts = useMemo(
    () => filteredPodcasts.filter(matchesTag),
    [filteredPodcasts, matchesTag],
  )

  useEffect(() => {
    setVisibleCount(LOAD_STEP)
  }, [filter, activeTag, data?.length])

  // Gate empty state a bit to avoid flashing "no results" before data resolves from cache/network
  useEffect(() => {
    const timer = window.setTimeout(() => setAllowEmpty(true), 900)
    return () => window.clearTimeout(timer)
  }, [])

  // Measure Header height (app header is sticky top-0) and set sticky top accordingly
  useEffect(() => {
    function computeTop() {
      const appHeader = document.querySelector('header.sticky') as HTMLElement | null
      const h = appHeader?.offsetHeight ?? 72
      setStickyTop(h)
    }
    computeTop()
    window.addEventListener('resize', computeTop)
    return () => window.removeEventListener('resize', computeTop)
  }, [])

  // After data/filter changes, if the content is shorter than viewport, auto-load more until it fills or we reach the end
  useEffect(() => {
    if (loading || isError) return
    let iterations = 0
    function needsMore(): boolean {
      const docH = document.documentElement.scrollHeight
      const viewportH = window.innerHeight
      return docH < viewportH + 200 && visibleCount < visiblePodcasts.length
    }
    while (needsMore() && iterations < 5) {
      iterations += 1
      setVisibleCount((prev) => Math.min(prev + LOAD_STEP, visiblePodcasts.length))
    }
  }, [loading, isError, visibleCount, visiblePodcasts.length])

  // Sync filter and tag with URL (querystring)
  useEffect(() => {
    const sp = new URLSearchParams(window.location.search)
    if (filter) sp.set('q', filter)
    else sp.delete('q')
    if (activeTag && activeTag !== 'all') sp.set('tag', activeTag)
    else sp.delete('tag')
    const qs = sp.toString()
    const next = `${window.location.pathname}${qs ? `?${qs}` : ''}`
    window.history.replaceState(null, '', next)
  }, [filter, activeTag])

  // Update state on browser navigation
  useEffect(() => {
    function onPop() {
      const sp = new URLSearchParams(window.location.search)
      setFilter(sp.get('q') ?? '')
      setActiveTag(sp.get('tag') ?? 'all')
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  // Pin as soon as the header would overlap the filters row
  useEffect(() => {
    function onScroll() {
      const el = filtersRef.current
      if (!el) return
      const top = el.getBoundingClientRect().top
      // Add small cushion so it appears just before overlapping
      setPinFilters(top <= stickyTop + 4)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [stickyTop])

  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry.isIntersecting && !loading) {
          setVisibleCount((prev) => Math.min(prev + LOAD_STEP, visiblePodcasts.length))
        }
      },
      { root: null, rootMargin: '800px 0px', threshold: 0 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [loading, visiblePodcasts.length, LOAD_STEP])

  // Clamp to available items in case of overshoot
  useEffect(() => {
    setVisibleCount((prev) => Math.min(prev, visiblePodcasts.length || 0))
  }, [visiblePodcasts.length])

  // Fallback: in case IntersectionObserver doesn't fire (some browsers/edge cases)
  useEffect(() => {
    function onScroll() {
      if (loading) return
      const scrollY = window.scrollY || window.pageYOffset
      const viewportH = window.innerHeight
      const docH = document.documentElement.scrollHeight
      const nearBottom = scrollY + viewportH >= docH - 800
      if (nearBottom) {
        setVisibleCount((prev) => Math.min(prev + LOAD_STEP, visiblePodcasts.length))
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [loading, visiblePodcasts.length, LOAD_STEP])

  return (
    <div className="flex flex-col h-full gap-8">
      <header className="space-y-8 shrink-0">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.45em] text-dark-text-secondary">Selección Editorial</p>
          <h1 className="text-4xl font-semibold tracking-tight text-dark-text-primary lg:text-5xl">
            Música en estado puro
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-dark-text-secondary">
            Explora los podcasts musicales más escuchados en iTunes. Curamos episodios recientes, entrevistas y sesiones que marcan tendencia semana a semana.
          </p>
        </div>

        <div
          ref={filtersRef}
          className="flex flex-wrap items-center gap-3"
          role="tablist"
          aria-label="Filtros"
          onKeyDown={(e) => {
            if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
            e.preventDefault()
            const ids = tabs.map((t) => t.id)
            const idx = Math.max(0, ids.findIndex((id) => id.toLowerCase() === activeTag.toLowerCase()))
            const nextIdx = e.key === 'ArrowLeft' ? (idx - 1 + ids.length) % ids.length : (idx + 1) % ids.length
            setActiveTag(ids[nextIdx])
          }}
        >
          {tabs.map((tab) => {
            const active = activeTag.toLowerCase() === tab.id.toLowerCase()
            return (
              <Button
                key={tab.id}
                type="button"
                onClick={() => setActiveTag(tab.id)}
                variant={active ? 'primary' : 'secondary'}
                size="sm"
                role="tab"
                aria-selected={active}
                tabIndex={active ? 0 : -1}
              >
                {tab.label}
              </Button>
            )
          })}

          <div className="ml-auto flex w-full flex-wrap items-center gap-3 sm:w-auto">
            <div className="text-xs uppercase tracking-[0.35em] text-dark-text-secondary shrink-0">
              {showInitialSkeleton ? 'Cargando…' : `${Math.min(visibleCount, visiblePodcasts.length)}/${visiblePodcasts.length} resultados`}
            </div>
            <div className="relative ml-auto w-full min-w-0 sm:w-auto sm:min-w-[280px] md:min-w-[340px] lg:min-w-[380px] max-w-md">
              <Input
                type="text"
                placeholder="Filtrar por título, autor o categoría"
                value={filter}
                onChange={(event) => setFilter(event.target.value)}
                size="sm"
                rightIcon={<Search className="h-4 w-4" strokeWidth={1.5} />}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Compact floating filters under the header (smooth show/hide) — fixed, full-width */}
      {!showInitialSkeleton && (
        <div
          className={`fixed left-0 right-0 z-40 border-b border-dark-border/40 bg-dark-surface/90 backdrop-blur transition-all duration-300 ease-out ${
            pinFilters ? 'opacity-100 translate-y-0 shadow-[0_10px_20px_rgba(0,0,0,0.35)]' : 'opacity-0 -translate-y-2 pointer-events-none'
          }`}
          style={{ top: 41, width: '100%' }}
          aria-hidden={!pinFilters}
        >
          <div className="mx-auto flex w-full max-w-screen-2xl items-center gap-3 px-6 py-2">
            <div className="flex-1 overflow-x-auto">
              <div
                className="flex items-center gap-2 min-w-max"
                role="tablist"
                aria-label="Filtros"
                onKeyDown={(e) => {
                  if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
                  e.preventDefault()
                  const ids = tabs.map((t) => t.id)
                  const idx = Math.max(0, ids.findIndex((id) => id.toLowerCase() === activeTag.toLowerCase()))
                  const nextIdx = e.key === 'ArrowLeft' ? (idx - 1 + ids.length) % ids.length : (idx + 1) % ids.length
                  setActiveTag(ids[nextIdx])
                }}
              >
                {tabs.map((tab) => {
                  const active = activeTag.toLowerCase() === tab.id.toLowerCase()
                  return (
                    <Button
                      key={`compact-${tab.id}`}
                      type="button"
                      onClick={() => setActiveTag(tab.id)}
                      variant={active ? 'primary' : 'secondary'}
                      size="sm"
                      role="tab"
                      aria-selected={active}
                      tabIndex={active ? 0 : -1}
                    >
                      {tab.label}
                    </Button>
                  )
                })}
              </div>
            </div>
            <div className="hidden md:flex items-center gap-3">
              <span className="text-[10px] uppercase tracking-[0.3em] text-dark-text-secondary">
                {`${Math.min(visibleCount, visiblePodcasts.length)}/${visiblePodcasts.length}`}
              </span>
              <div className="relative w-[260px]">
                <Input
                  type="text"
                  placeholder="Filtrar…"
                  value={filter}
                  onChange={(event) => setFilter(event.target.value)}
                  size="sm"
                  rightIcon={<Search className="h-4 w-4" strokeWidth={1.5} />}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <section className="flex-1 overflow-y-auto space-y-12">
        {showInitialSkeleton ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="h-[550px] rounded-3xl bg-dark-card shimmer"
              />
            ))}
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dark-border/40 bg-dark-card/80 py-20 text-center shadow-inner">
            <Search className="mb-4 h-16 w-16 text-dark-text-muted" strokeWidth={1.25} />
            <h3 className="mb-2 text-lg font-semibold text-dark-text-primary">Error al cargar podcasts</h3>
            <p className="text-sm text-dark-text-secondary">Intenta de nuevo en unos segundos.</p>
          </div>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {visiblePodcasts.slice(0, visibleCount).map((podcast) => (
                <PodcastCard
                  key={podcast.id}
                  title={podcast.title}
                  author={podcast.author}
                  summary={podcast.summary}
                  longSummary={[podcast.summary, podcast.summary, podcast.summary].filter(Boolean).join(' ')}
                  releaseLabel={podcast.releaseLabel}
                  imageUrl={podcast.imageUrl}
                  href={`/podcast/${podcast.id}`}
                  onPlayClick={() => navigate(`/podcast/${podcast.id}`)}
                />
              ))}
              {!showInitialSkeleton && visiblePodcasts.length > visibleCount && (
                <div ref={sentinelRef} className="md:col-span-2 xl:col-span-3 h-4 w-full" />
              )}
            </div>

            {!showInitialSkeleton && visiblePodcasts.length > visibleCount && (
              <div className="flex justify-center py-4">
                <Button
                  type="button"
                  variant="secondary"
                  size="md"
                  onClick={() => setVisibleCount((prev) => Math.min(prev + LOAD_STEP, visiblePodcasts.length))}
                >
                  Cargar más
                </Button>
              </div>
            )}

            {allowEmpty && visiblePodcasts.length === 0 && (
              <div className="flex flex-col items-center justify-center rounded-3xl border border-dark-border/40 bg-dark-card/80 py-20 text-center shadow-inner">
                <Search className="mb-4 h-16 w-16 text-dark-text-muted" strokeWidth={1.25} />
                <h3 className="mb-2 text-lg font-semibold text-dark-text-primary">No se encontraron podcasts</h3>
                <p className="text-sm text-dark-text-secondary">Prueba con otra categoría o artista.</p>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  )
}
