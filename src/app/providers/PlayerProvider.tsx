import { useState, useCallback } from 'react'
import type { ReactNode } from 'react'
import { PlayerContext, type CurrentEpisode, type PlayerContextType } from './PlayerContext'

export type { CurrentEpisode }

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


