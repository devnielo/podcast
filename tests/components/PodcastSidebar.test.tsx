import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { PodcastSidebar } from '@/features/podcasts/PodcastSidebar'

function renderWithRouter(component: React.ReactElement) {
  return render(<BrowserRouter>{component}</BrowserRouter>)
}

describe('PodcastSidebar', () => {
  const defaultProps = {
    id: '123',
    title: 'Test Podcast',
    author: 'Test Author',
    imageUrl: 'https://example.com/image.jpg',
    description: 'This is a test podcast description',
  }

  it('should render podcast image', () => {
    renderWithRouter(<PodcastSidebar {...defaultProps} />)

    const image = screen.getByAltText('Test Podcast')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', 'https://example.com/image.jpg')
  })

  it('should render podcast title', () => {
    renderWithRouter(<PodcastSidebar {...defaultProps} />)

    expect(screen.getByText('Test Podcast')).toBeInTheDocument()
  })

  it('should render podcast author', () => {
    renderWithRouter(<PodcastSidebar {...defaultProps} />)

    expect(screen.getByText('Test Author')).toBeInTheDocument()
  })

  it('should render description when provided', () => {
    renderWithRouter(<PodcastSidebar {...defaultProps} />)

    expect(screen.getByText('This is a test podcast description')).toBeInTheDocument()
  })

  it('should not render description when not provided', () => {
    const { ...propsWithoutDescription } = defaultProps
    renderWithRouter(<PodcastSidebar {...propsWithoutDescription} />)

    expect(screen.queryByText('This is a test podcast description')).not.toBeInTheDocument()
  })

  it('should render links to podcast detail page', () => {
    renderWithRouter(<PodcastSidebar {...defaultProps} />)

    const links = screen.getAllByRole('link')
    expect(links.length).toBeGreaterThan(0)
    links.forEach((link) => {
      expect(link).toHaveAttribute('href', '/podcast/123')
    })
  })

  it('should use podcastId from params when id prop is empty', () => {
    const { ...propsWithoutId } = defaultProps
    renderWithRouter(<PodcastSidebar {...propsWithoutId} id="" />)

    const links = screen.getAllByRole('link')
    expect(links.length).toBeGreaterThan(0)
  })

  it('should have proper accessibility attributes', () => {
    renderWithRouter(<PodcastSidebar {...defaultProps} />)

    const image = screen.getByAltText('Test Podcast')
    expect(image).toHaveAttribute('alt')
  })

  it('should render with proper styling classes', () => {
    const { container } = renderWithRouter(<PodcastSidebar {...defaultProps} />)

    const sidebar = container.querySelector('.sticky')
    expect(sidebar).toBeInTheDocument()
  })

  it('should handle long descriptions with line clamping', () => {
    const longDescription = 'A'.repeat(500)
    renderWithRouter(
      <PodcastSidebar {...defaultProps} description={longDescription} />,
    )

    const descriptionElement = screen.getByText(longDescription)
    expect(descriptionElement).toHaveClass('line-clamp-[12]')
  })
})
