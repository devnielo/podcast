import { Search } from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'

import { mapTopPodcastsResponse } from '@/entities/podcast/mappers'
import type { PodcastSummary } from '@/entities/podcast/types'
import type { ItunesTopPodcastsResponse } from '@/shared/api/itunes/types'
import { PodcastCard } from '@/shared/components/PodcastCard'
import Button from '@/shared/components/Button'
import { Input } from '@/shared/components/Input'

interface FeaturedPodcast extends PodcastSummary {
  summary: string
  releaseLabel: string
  category: string
}

const MOCK_TOP_PODCASTS_FEED: ItunesTopPodcastsResponse = {
  feed: {
    entry: [
      {
        id: { attributes: { 'im:id': '1535809341' } },
        title: { label: 'The Joe Budden Podcast - The Joe Budden Network' },
        summary: {
          label:
            'Tune into Joe Budden y sus amigos. Acompaña las aventuras y debates crudos de este panel sobre cultura pop e hip-hop.',
        },
        'im:name': { label: 'The Joe Budden Podcast' },
        'im:artist': { label: 'The Joe Budden Network' },
        'im:image': [
          {
            label:
              'https://is1-ssl.mzstatic.com/image/thumb/Podcasts113/v4/f2/21/fa/f221fabd-017f-5125-633b-f1fe4f39802a/mza_182995249085044287.jpg/55x55bb.png',
            attributes: { height: '55' },
          },
          {
            label:
              'https://is1-ssl.mzstatic.com/image/thumb/Podcasts113/v4/f2/21/fa/f221fabd-017f-5125-633b-f1fe4f39802a/mza_182995249085044287.jpg/60x60bb.png',
            attributes: { height: '60' },
          },
          {
            label:
              'https://is1-ssl.mzstatic.com/image/thumb/Podcasts113/v4/f2/21/fa/f221fabd-017f-5125-633b-f1fe4f39802a/mza_182995249085044287.jpg/170x170bb.png',
            attributes: { height: '170' },
          },
        ],
        category: { attributes: { term: 'Music', label: 'Music' } },
        'im:releaseDate': {
          label: '2025-10-17T19:00:00-07:00',
          attributes: { label: 'October 17, 2025' },
        },
      },
      {
        id: { attributes: { 'im:id': '1751194045' } },
        title: { label: "Tony Mantor's : Almost Live.. Nashville" },
        summary: {
          label:
            'Nashville-based veteran producer Tony Mantor comparte conversaciones profundas con artistas sobre cultura y entretenimiento.',
        },
        'im:name': { label: "Tony Mantor's : Almost Live.. Nashville" },
        'im:artist': { label: 'Tony Mantor' },
        'im:image': [
          {
            label:
              'https://is1-ssl.mzstatic.com/image/thumb/Podcasts211/v4/3e/e4/59/3ee459ec-ca6a-8963-06a4-360f3059876c/mza_2940575243774001153.jpg/55x55bb.png',
            attributes: { height: '55' },
          },
          {
            label:
              'https://is1-ssl.mzstatic.com/image/thumb/Podcasts211/v4/3e/e4/59/3ee459ec-ca6a-8963-06a4-360f3059876c/mza_2940575243774001153.jpg/60x60bb.png',
            attributes: { height: '60' },
          },
          {
            label:
              'https://is1-ssl.mzstatic.com/image/thumb/Podcasts211/v4/3e/e4/59/3ee459ec-ca6a-8963-06a4-360f3059876c/mza_2940575243774001153.jpg/170x170bb.png',
            attributes: { height: '170' },
          },
        ],
        category: { attributes: { term: 'Music Interviews', label: 'Music Interviews' } },
        'im:releaseDate': {
          label: '2025-10-07T15:00:00-07:00',
          attributes: { label: 'October 7, 2025' },
        },
      },
      {
        id: { attributes: { 'im:id': '1825201502' } },
        title: { label: 'Decoding Taylor Swift - Joe Romm and Toni Romm' },
        summary: {
          label:
            'Joe y Toni Romm desmenuzan las letras y estrategias narrativas que han hecho de Taylor Swift un fenómeno global.',
        },
        'im:name': { label: 'Decoding Taylor Swift' },
        'im:artist': { label: 'Joe Romm and Toni Romm' },
        'im:image': [
          {
            label:
              'https://is1-ssl.mzstatic.com/image/thumb/Podcasts221/v4/29/4d/9d/294d9d26-4204-4675-9ca6-613f50e26609/mza_1960016062812587976.jpeg/55x55bb.png',
            attributes: { height: '55' },
          },
          {
            label:
              'https://is1-ssl.mzstatic.com/image/thumb/Podcasts221/v4/29/4d/9d/294d9d26-4204-4675-9ca6-613f50e26609/mza_1960016062812587976.jpeg/60x60bb.png',
            attributes: { height: '60' },
          },
          {
            label:
              'https://is1-ssl.mzstatic.com/image/thumb/Podcasts221/v4/29/4d/9d/294d9d26-4204-4675-9ca6-613f50e26609/mza_1960016062812587976.jpeg/170x170bb.png',
            attributes: { height: '170' },
          },
        ],
        category: { attributes: { term: 'Music Commentary', label: 'Music Commentary' } },
        'im:releaseDate': {
          label: '2025-10-14T06:55:00-07:00',
          attributes: { label: 'October 14, 2025' },
        },
      },
      {
        id: { attributes: { 'im:id': '1703080557' } },
        title: { label: 'Music Saved Me Podcast - iHeartPodcasts' },
        summary: {
          label:
            'Historias sobre cómo la música impacta la salud mental, con artistas que encuentran refugio en el arte.',
        },
        'im:name': { label: 'Music Saved Me Podcast' },
        'im:artist': { label: 'iHeartPodcasts' },
        'im:image': [
          {
            label:
              'https://is1-ssl.mzstatic.com/image/thumb/Podcasts221/v4/c3/e7/43/c3e74308-bd36-73b6-bde8-12a2b8847c32/mza_7335659604130995475.jpg/55x55bb.png',
            attributes: { height: '55' },
          },
          {
            label:
              'https://is1-ssl.mzstatic.com/image/thumb/Podcasts221/v4/c3/e7/43/c3e74308-bd36-73b6-bde8-12a2b8847c32/mza_7335659604130995475.jpg/60x60bb.png',
            attributes: { height: '60' },
          },
          {
            label:
              'https://is1-ssl.mzstatic.com/image/thumb/Podcasts221/v4/c3/e7/43/c3e74308-bd36-73b6-bde8-12a2b8847c32/mza_7335659604130995475.jpg/170x170bb.png',
            attributes: { height: '170' },
          },
        ],
        category: { attributes: { term: 'Music Interviews', label: 'Music Interviews' } },
        'im:releaseDate': {
          label: '2025-10-19T00:00:00-07:00',
          attributes: { label: 'October 19, 2025' },
        },
      },
      {
        id: { attributes: { 'im:id': '1572182022' } },
        title: { label: 'New Rory & MAL - iHeartPodcasts and The Volume' },
        summary: {
          label:
            'Nuevas historias, risas y opiniones sin filtro desde Nueva York con Rory, MAL y sus invitados sorpresa.',
        },
        'im:name': { label: 'New Rory & MAL' },
        'im:artist': { label: 'iHeartPodcasts and The Volume' },
        'im:image': [
          {
            label:
              'https://is1-ssl.mzstatic.com/image/thumb/Podcasts211/v4/8c/b7/fb/8cb7fb9e-ad6c-25db-3019-bb3e42a1418a/mza_10391427218211947909.jpg/55x55bb.png',
            attributes: { height: '55' },
          },
          {
            label:
              'https://is1-ssl.mzstatic.com/image/thumb/Podcasts211/v4/8c/b7/fb/8cb7fb9e-ad6c-25db-3019-bb3e42a1418a/mza_10391427218211947909.jpg/60x60bb.png',
            attributes: { height: '60' },
          },
          {
            label:
              'https://is1-ssl.mzstatic.com/image/thumb/Podcasts211/v4/8c/b7/fb/8cb7fb9e-ad6c-25db-3019-bb3e42a1418a/mza_10391427218211947909.jpg/170x170bb.png',
            attributes: { height: '170' },
          },
        ],
        category: { attributes: { term: 'Music', label: 'Music' } },
        'im:releaseDate': {
          label: '2025-10-19T01:00:00-07:00',
          attributes: { label: 'October 19, 2025' },
        },
      },
      {
        id: { attributes: { 'im:id': '1636001234' } },
        title: { label: 'Dem Vinyl Boyz - Podcast Playground' },
        summary: {
          label:
            'Celebración analógica del soul, funk y hip-hop con datos coleccionistas y mezclas en vinilo.',
        },
        'im:name': { label: 'Dem Vinyl Boyz' },
        'im:artist': { label: 'Podcast Playground' },
        'im:image': [
          {
            label:
              'https://is1-ssl.mzstatic.com/image/thumb/Podcasts221/v4/0e/42/f6/0e42f616-ec92-0583-071d-8ad604165a46/mza_6813945298084218940.jpg/55x55bb.png',
            attributes: { height: '55' },
          },
          {
            label:
              'https://is1-ssl.mzstatic.com/image/thumb/Podcasts221/v4/0e/42/f6/0e42f616-ec92-0583-071d-8ad604165a46/mza_6813945298084218940.jpg/60x60bb.png',
            attributes: { height: '60' },
          },
          {
            label:
              'https://is1-ssl.mzstatic.com/image/thumb/Podcasts221/v4/0e/42/f6/0e42f616-ec92-0583-071d-8ad604165a46/mza_6813945298084218940.jpg/170x170bb.png',
            attributes: { height: '170' },
          },
        ],
        category: { attributes: { term: 'Music Commentary', label: 'Music Commentary' } },
        'im:releaseDate': {
          label: '2025-10-16T14:00:00-07:00',
          attributes: { label: 'October 16, 2025' },
        },
      },
      {
        id: { attributes: { 'im:id': '788236947' } },
        title: { label: 'Song Exploder - Hrishikesh Hirway' },
        summary: {
          label:
            'Cada episodio desmonta una canción con relatos íntimos y decisiones creativas de los artistas.',
        },
        'im:name': { label: 'Song Exploder' },
        'im:artist': { label: 'Hrishikesh Hirway' },
        'im:image': [
          {
            label:
              'https://is1-ssl.mzstatic.com/image/thumb/Podcasts221/v4/05/7b/35/057b3588-c74c-0334-d8ef-c6b8166d4afc/mza_12324100546486323942.jpg/55x55bb.png',
            attributes: { height: '55' },
          },
          {
            label:
              'https://is1-ssl.mzstatic.com/image/thumb/Podcasts221/v4/05/7b/35/057b3588-c74c-0334-d8ef-c6b8166d4afc/mza_12324100546486323942.jpg/60x60bb.png',
            attributes: { height: '60' },
          },
          {
            label:
              'https://is1-ssl.mzstatic.com/image/thumb/Podcasts221/v4/05/7b/35/057b3588-c74c-0334-d8ef-c6b8166d4afc/mza_12324100546486323942.jpg/170x170bb.png',
            attributes: { height: '170' },
          },
        ],
        category: { attributes: { term: 'Music', label: 'Music' } },
        'im:releaseDate': {
          label: '2025-10-15T06:30:00-07:00',
          attributes: { label: 'October 15, 2025' },
        },
      },
      {
        id: { attributes: { 'im:id': '1275172907' } },
        title: { label: 'DISGRACELAND - Double Elvis Productions' },
        summary: {
          label:
            'Relatos de true crime musical que revelan el caos detrás de iconos de la música.',
        },
        'im:name': { label: 'DISGRACELAND' },
        'im:artist': { label: 'Double Elvis Productions' },
        'im:image': [
          {
            label:
              'https://is1-ssl.mzstatic.com/image/thumb/Podcasts211/v4/3c/db/14/3cdb1400-5990-c22d-9bb9-a8c4df028f40/mza_9064738222575760330.jpg/55x55bb.png',
            attributes: { height: '55' },
          },
          {
            label:
              'https://is1-ssl.mzstatic.com/image/thumb/Podcasts211/v4/3c/db/14/3cdb1400-5990-c22d-9bb9-a8c4df028f40/mza_9064738222575760330.jpg/60x60bb.png',
            attributes: { height: '60' },
          },
          {
            label:
              'https://is1-ssl.mzstatic.com/image/thumb/Podcasts211/v4/3c/db/14/3cdb1400-5990-c22d-9bb9-a8c4df028f40/mza_9064738222575760330.jpg/170x170bb.png',
            attributes: { height: '170' },
          },
        ],
        category: { attributes: { term: 'Music', label: 'Music' } },
        'im:releaseDate': {
          label: '2025-10-19T00:00:00-07:00',
          attributes: { label: 'October 19, 2025' },
        },
      },
      {
        id: { attributes: { 'im:id': '1703570820' } },
        title: { label: 'Eras - BBC Radio 2' },
        summary: {
          label:
            'Bill Bailey repasa la historia de Queen con testimonios inéditos de Brian May y Roger Taylor.',
        },
        'im:name': { label: 'Eras' },
        'im:artist': { label: 'BBC Radio 2' },
        'im:image': [
          {
            label:
              'https://is1-ssl.mzstatic.com/image/thumb/Podcasts221/v4/2a/4e/29/2a4e29ad-0b3c-fb2d-c991-a92c4bba4d9f/mza_17833981376332336777.jpg/55x55bb.png',
            attributes: { height: '55' },
          },
          {
            label:
              'https://is1-ssl.mzstatic.com/image/thumb/Podcasts221/v4/2a/4e/29/2a4e29ad-0b3c-fb2d-c991-a92c4bba4d9f/mza_17833981376332336777.jpg/60x60bb.png',
            attributes: { height: '60' },
          },
          {
            label:
              'https://is1-ssl.mzstatic.com/image/thumb/Podcasts221/v4/2a/4e/29/2a4e29ad-0b3c-fb2d-c991-a92c4bba4d9f/mza_17833981376332336777.jpg/170x170bb.png',
            attributes: { height: '170' },
          },
        ],
        category: { attributes: { term: 'Music History', label: 'Music History' } },
        'im:releaseDate': {
          label: '2025-10-12T00:00:00-07:00',
          attributes: { label: 'October 12, 2025' },
        },
      },
      {
        id: { attributes: { 'im:id': '1812462068' } },
        title: { label: 'Joe and Jada - iHeartPodcasts and The Volume' },
        summary: {
          label:
            'Fat Joe y Jadakiss comparten anécdotas sobre hip-hop, negocios y cultura urbana en estado puro.',
        },
        'im:name': { label: 'Joe and Jada' },
        'im:artist': { label: 'iHeartPodcasts and The Volume' },
        'im:image': [
          {
            label:
              'https://is1-ssl.mzstatic.com/image/thumb/Podcasts221/v4/d4/d2/72/d4d27258-65ec-e139-9ccd-41036f4813da/mza_7673522444412362355.jpg/55x55bb.png',
            attributes: { height: '55' },
          },
          {
            label:
              'https://is1-ssl.mzstatic.com/image/thumb/Podcasts221/v4/d4/d2/72/d4d27258-65ec-e139-9ccd-41036f4813da/mza_7673522444412362355.jpg/60x60bb.png',
            attributes: { height: '60' },
          },
          {
            label:
              'https://is1-ssl.mzstatic.com/image/thumb/Podcasts221/v4/d4/d2/72/d4d27258-65ec-e139-9ccd-41036f4813da/mza_7673522444412362355.jpg/170x170bb.png',
            attributes: { height: '170' },
          },
        ],
        category: { attributes: { term: 'Music', label: 'Music' } },
        'im:releaseDate': {
          label: '2025-10-16T03:00:00-07:00',
          attributes: { label: 'October 16, 2025' },
        },
      },
      {
        id: { attributes: { 'im:id': '788236940' } },
        title: { label: 'Questlove Supreme - iHeartPodcasts' },
        summary: {
          label:
            'Questlove conversa con leyendas y héroes anónimos de la música para preservar la historia oral del groove.',
        },
        'im:name': { label: 'Questlove Supreme' },
        'im:artist': { label: 'iHeartPodcasts' },
        'im:image': [
          {
            label:
              'https://is1-ssl.mzstatic.com/image/thumb/Podcasts221/v4/d9/20/5c/d9205c3b-676f-6c68-35f4-1f22883c6bfc/mza_3389063600571555044.jpg/55x55bb.png',
            attributes: { height: '55' },
          },
          {
            label:
              'https://is1-ssl.mzstatic.com/image/thumb/Podcasts221/v4/d9/20/5c/d9205c3b-676f-6c68-35f4-1f22883c6bfc/mza_3389063600571555044.jpg/60x60bb.png',
            attributes: { height: '60' },
          },
          {
            label:
              'https://is1-ssl.mzstatic.com/image/thumb/Podcasts221/v4/d9/20/5c/d9205c3b-676f-6c68-35f4-1f22883c6bfc/mza_3389063600571555044.jpg/170x170bb.png',
            attributes: { height: '170' },
          },
        ],
        category: { attributes: { term: 'Music', label: 'Music' } },
        'im:releaseDate': {
          label: '2025-06-15T16:15:00-07:00',
          attributes: { label: 'June 15, 2025' },
        },
      },
    ],
  },
}

const FILTER_TABS = [
  { id: 'all', label: 'Todo' },
  { id: 'music', label: 'Música' },
  { id: 'shows', label: 'Podcasts' },
] as const satisfies readonly { id: 'all' | 'music' | 'shows'; label: string }[]

type FilterTabId = (typeof FILTER_TABS)[number]['id']

export function HomePage() {
  const parsedFeed = mapTopPodcastsResponse(MOCK_TOP_PODCASTS_FEED)
  const podcasts: FeaturedPodcast[] = parsedFeed.map((podcast) => ({
    ...podcast,
    summary: podcast.summary ?? '',
    category: podcast.category ?? 'Music',
    releaseLabel: podcast.releaseLabel ?? 'Sin fecha',
  }))

  const [filter, setFilter] = useState('')
  const [activeTag, setActiveTag] = useState<FilterTabId>('all')

  const matchesTag = useCallback(
    (podcast: FeaturedPodcast) => {
      const category = (podcast.category ?? '').toLowerCase()
      if (activeTag === 'all') return true
      if (activeTag === 'music') return category.includes('music')
      return !category.includes('music')
    },
    [activeTag],
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

  return (
    <div className="space-y-12">
      <header className="space-y-8">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.45em] text-dark-text-secondary">Selección Editorial</p>
          <h1 className="text-4xl font-semibold tracking-tight text-dark-text-primary lg:text-5xl">
            Música en estado puro
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-dark-text-secondary">
            Explora los podcasts musicales más escuchados en iTunes. Curamos episodios recientes, entrevistas y sesiones que marcan tendencia semana a semana.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {FILTER_TABS.map((tab) => {
            const active = activeTag === tab.id
            return (
              <Button
                key={tab.id}
                type="button"
                onClick={() => setActiveTag(tab.id)}
                variant={active ? 'primary' : 'secondary'}
                size="sm"
              >
                {tab.label}
              </Button>
            )
          })}

          <div className="ml-auto flex w-full flex-wrap items-center gap-3 sm:w-auto">
            <div className="text-xs uppercase tracking-[0.35em] text-dark-text-secondary shrink-0">
              {visiblePodcasts.length} resultados
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

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {visiblePodcasts.map((podcast) => (
          <PodcastCard
            key={podcast.id}
            title={podcast.title}
            author={podcast.author}
            summary={podcast.summary}
            longSummary={[podcast.summary, podcast.summary, podcast.summary].filter(Boolean).join(' ')}
            releaseLabel={podcast.releaseLabel}
            imageUrl={podcast.imageUrl}
          />
        ))}
      </section>

      {visiblePodcasts.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dark-border/40 bg-dark-card/80 py-20 text-center shadow-inner">
          <Search className="mb-4 h-16 w-16 text-dark-text-muted" strokeWidth={1.25} />
          <h3 className="mb-2 text-lg font-semibold text-dark-text-primary">No se encontraron podcasts</h3>
          <p className="text-sm text-dark-text-secondary">Prueba con otra categoría o artista.</p>
        </div>
      )}
    </div>
  )
}
