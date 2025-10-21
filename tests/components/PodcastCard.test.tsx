import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { PodcastCard } from '@/shared/components/PodcastCard'
import { ToastProvider } from '@/app/providers/ToastProvider'

function renderWithProviders(component: React.ReactElement) {
  return render(
    <ToastProvider>
      <BrowserRouter>{component}</BrowserRouter>
    </ToastProvider>,
  )
}

describe('PodcastCard', () => {
  const defaultProps = {
    title: 'Test Podcast',
    author: 'Test Author',
    summary: 'Test summary',
    longSummary: 'Test long summary',
    releaseLabel: '2024-01-01',
    imageUrl: 'https://example.com/image.jpg',
  }

  it('should render podcast title', () => {
    renderWithProviders(<PodcastCard {...defaultProps} />)
    expect(screen.getByText('Test Podcast')).toBeInTheDocument()
  })

  it('should render podcast author', () => {
    renderWithProviders(<PodcastCard {...defaultProps} />)
    expect(screen.getByText('Test Author')).toBeInTheDocument()
  })

  it('should render podcast image', () => {
    renderWithProviders(<PodcastCard {...defaultProps} />)
    const image = screen.getByAltText('Test Podcast')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', 'https://example.com/image.jpg')
  })

  it('should render release label', () => {
    renderWithProviders(<PodcastCard {...defaultProps} />)
    expect(screen.getByText('2024-01-01')).toBeInTheDocument()
  })

  it('should render summary text', () => {
    renderWithProviders(<PodcastCard {...defaultProps} />)
    expect(screen.getByText('Test summary')).toBeInTheDocument()
  })
})
