import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { EpisodesTable } from '@/features/podcasts/EpisodesTable'
import { PlayerProvider } from '@/app/providers/PlayerProvider'
import type { Episode } from '@/entities/episode/types'

const mockEpisodes: Episode[] = [
  {
    id: '1',
    title: 'Episode 1',
    description: 'Description 1',
    releaseDate: '2024-01-15T10:00:00Z',
    durationMs: 3600000,
    audioUrl: 'https://example.com/ep1.mp3',
  },
  {
    id: '2',
    title: 'Episode 2',
    description: 'Description 2',
    releaseDate: '2024-01-08T14:30:00Z',
    durationMs: 5400000,
    audioUrl: 'https://example.com/ep2.mp3',
  },
]

function renderWithRouter(component: React.ReactElement) {
  return render(
    <PlayerProvider>
      <BrowserRouter>{component}</BrowserRouter>
    </PlayerProvider>
  )
}

describe('EpisodesTable', () => {
  it('should render episodes list', () => {
    renderWithRouter(<EpisodesTable podcastId="123" episodes={mockEpisodes} />)

    expect(screen.getByText('Todos los episodios')).toBeInTheDocument()
    expect(screen.getByText('Episode 1')).toBeInTheDocument()
    expect(screen.getByText('Episode 2')).toBeInTheDocument()
  })

  it('should display episode count', () => {
    renderWithRouter(<EpisodesTable podcastId="123" episodes={mockEpisodes} />)

    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it('should format release dates correctly', () => {
    renderWithRouter(<EpisodesTable podcastId="123" episodes={mockEpisodes} />)

    expect(screen.getByText('15 Jan 2024')).toBeInTheDocument()
    expect(screen.getByText('08 Jan 2024')).toBeInTheDocument()
  })

  it('should format durations correctly', () => {
    renderWithRouter(<EpisodesTable podcastId="123" episodes={mockEpisodes} />)

    expect(screen.getByText('1:00:00')).toBeInTheDocument()
    expect(screen.getByText('1:30:00')).toBeInTheDocument()
  })

  it('should render episode links with correct href', () => {
    renderWithRouter(<EpisodesTable podcastId="123" episodes={mockEpisodes} />)

    const links = screen.getAllByRole('link')
    expect(links.some(link => link.getAttribute('href') === '/podcast/123/episode/1')).toBe(true)
    expect(links.some(link => link.getAttribute('href') === '/podcast/123/episode/2')).toBe(true)
  })

  it('should render play buttons for each episode', () => {
    renderWithRouter(<EpisodesTable podcastId="123" episodes={mockEpisodes} />)

    const playButtons = screen.getAllByRole('button', { name: /Play Episode/i })
    expect(playButtons.length).toBe(2)
  })

  it('should render empty state when no episodes', () => {
    renderWithRouter(<EpisodesTable podcastId="123" episodes={[]} />)

    expect(screen.getByText('Todos los episodios')).toBeInTheDocument()
    expect(screen.getByText('0')).toBeInTheDocument()
  })

  it('should display episode metadata correctly', () => {
    renderWithRouter(<EpisodesTable podcastId="123" episodes={mockEpisodes} />)

    expect(screen.getByText('Episode 1')).toBeInTheDocument()
    expect(screen.getByText('15 Jan 2024')).toBeInTheDocument()
    expect(screen.getByText('1:00:00')).toBeInTheDocument()
  })
})
