import { createContext, useContext, useState, useCallback } from 'react'
import type { ReactNode } from 'react'

export interface CurrentEpisode {
  id: string
  podcastId: string
  title: string
  author: string
  imageUrl: string
  audioUrl: string
  duration?: number
}

interface PlayerContextType {
  currentEpisode: CurrentEpisode | null
  isPlaying: boolean
  currentTime: number
  duration: number
  setCurrentEpisode: (episode: CurrentEpisode) => void
  setIsPlaying: (playing: boolean) => void
  setCurrentTime: (time: number) => void
  setDuration: (duration: number) => void
  clearEpisode: () => void
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined)

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [currentEpisode, setCurrentEpisode] = useState<CurrentEpisode | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  const handleSetCurrentEpisode = useCallback((episode: CurrentEpisode) => {
    setCurrentEpisode(episode)
    setCurrentTime(0)
    setIsPlaying(true)
  }, [])

  const handleClearEpisode = useCallback(() => {
    setCurrentEpisode(null)
    setIsPlaying(false)
    setCurrentTime(0)
    setDuration(0)
  }, [])

  const value: PlayerContextType = {
    currentEpisode,
    isPlaying,
    currentTime,
    duration,
    setCurrentEpisode: handleSetCurrentEpisode,
    setIsPlaying,
    setCurrentTime,
    setDuration,
    clearEpisode: handleClearEpisode,
  }

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
}

export function usePlayer() {
  const context = useContext(PlayerContext)
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider')
  }
  return context
}
