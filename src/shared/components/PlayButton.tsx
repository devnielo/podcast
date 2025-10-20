import { Play } from 'lucide-react'
import { Button } from '@/shared/components/Button'
import { usePlayer } from '@/app/providers/PlayerProvider'
import type { CurrentEpisode } from '@/app/providers/PlayerProvider'

interface PlayButtonProps {
  episode: Omit<CurrentEpisode, 'podcastId'>
  podcastId: string
  variant?: 'icon' | 'button'
  onPlay?: () => void
}

export function PlayButton({ episode, podcastId, variant = 'icon', onPlay }: PlayButtonProps) {
  const { setCurrentEpisode } = usePlayer()

  const handlePlay = () => {
    setCurrentEpisode({
      ...episode,
      podcastId,
    })
    onPlay?.()
  }

  if (variant === 'icon') {
    return (
      <button
        onClick={handlePlay}
        className="p-2 hover:bg-dark-hover rounded-lg transition-colors"
        aria-label={`Play ${episode.title}`}
      >
        <Play size={18} className="text-brand-500" />
      </button>
    )
  }

  return (
    <Button
      onClick={handlePlay}
      variant="primary"
      size="md"
      leftIcon={<Play size={16} />}
      aria-label={`Play ${episode.title}`}
    >
      Play
    </Button>
  )
}
