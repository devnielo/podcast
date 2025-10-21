import { createContext } from 'react'

export interface CurrentEpisode {
  id: string
  podcastId: string
  title: string
  author: string
  imageUrl: string
  audioUrl: string
  duration?: number
}

export interface PlayerContextType {
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

export const PlayerContext = createContext<PlayerContextType | undefined>(undefined)
