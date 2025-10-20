import { useEffect, useRef, useState } from 'react'
import { Play, Pause, Volume2, VolumeX } from 'lucide-react'
import { usePlayer } from '@/app/providers/PlayerProvider'
import { getCorsProxyUrl } from '@/shared/api/cors-proxies'

function formatDuration(seconds: number): string {
  if (!seconds || !isFinite(seconds) || isNaN(seconds)) return '00:00'
  const totalSeconds = Math.floor(seconds)
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60
  const parts = [h > 0 ? String(h) : null, String(m).padStart(2, '0'), String(s).padStart(2, '0')].filter(Boolean)
  return parts.join(':')
}

export function AudioPlayer() {
  const { currentEpisode, isPlaying, currentTime, duration, setIsPlaying, setCurrentTime, setDuration } =
    usePlayer()
  const audioRef = useRef<HTMLAudioElement>(null)
  const [volume, setVolume] = useState(1)
  const [showVolumeSlider, setShowVolumeSlider] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Use episode duration from metadata if available (convert from ms to seconds)
  const episodeDuration = currentEpisode?.duration ? currentEpisode.duration / 1000 : duration

  // Load audio when episode changes
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !currentEpisode) return

    // Set initial URL when episode changes (use direct URL first)
    audio.src = getCorsProxyUrl(currentEpisode.audioUrl, 0)
    audio.load()
  }, [currentEpisode])

  // Handle play/pause separately
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !currentEpisode) return

    if (isPlaying) {
      audio.play().catch(() => {
        setIsPlaying(false)
      })
    } else {
      audio.pause()
    }
  }, [isPlaying, currentEpisode, setIsPlaying])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !currentEpisode) return

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime)
    const handleLoadedMetadata = () => setDuration(audio.duration)
    const handleEnded = () => setIsPlaying(false)
    const handleWaiting = () => setIsLoading(true)
    const handleCanPlay = () => setIsLoading(false)

    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('waiting', handleWaiting)
    audio.addEventListener('canplay', handleCanPlay)

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('waiting', handleWaiting)
      audio.removeEventListener('canplay', handleCanPlay)
    }
  }, [setCurrentTime, setDuration, setIsPlaying, currentEpisode])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value)
    setCurrentTime(newTime)
    if (audioRef.current) {
      audioRef.current.currentTime = newTime
    }
  }

  if (!currentEpisode) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-dark-surface/95 border-t border-dark-border/50 z-50">
      <audio
        ref={audioRef}
        src={currentEpisode.audioUrl}
        crossOrigin="anonymous"
        preload="metadata"
      />

      <div className="max-w-screen-2xl mx-auto px-6 py-3">
        {/* Progress bar */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs text-white/60 w-8 text-right">{formatDuration(currentTime)}</span>
          <input
            type="range"
            min="0"
            max={episodeDuration || 0}
            value={currentTime}
            onChange={handleProgressChange}
            className="flex-1 h-0.5 bg-dark-border rounded-full appearance-none cursor-pointer accent-brand-500"
            aria-label="Progress bar"
          />
          <span className="text-xs text-white/60 w-8">{formatDuration(episodeDuration)}</span>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between gap-4">
          {/* Left: Image + Info */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <img
              src={currentEpisode.imageUrl}
              alt={currentEpisode.title}
              className="w-12 h-12 rounded object-cover shrink-0"
            />
            <div className="min-w-0">
              <p className="text-xs font-medium text-white truncate">{currentEpisode.title}</p>
              <p className="text-xs text-white/60 truncate">{currentEpisode.author}</p>
            </div>
          </div>

          {/* Center: Play button */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            disabled={isLoading}
            className="p-2 bg-brand-500 hover:bg-brand-600 rounded-full transition-colors shrink-0 disabled:opacity-70 disabled:cursor-not-allowed"
            aria-label={isLoading ? 'Cargando' : isPlaying ? 'Pause' : 'Play'}
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : isPlaying ? (
              <Pause size={16} className="text-white" />
            ) : (
              <Play size={16} className="text-white" />
            )}
          </button>

          {/* Right: Volume */}
          <div className="flex items-center gap-2 shrink-0 relative">
            <button
              onClick={() => setShowVolumeSlider(!showVolumeSlider)}
              className="p-1.5 hover:bg-dark-hover rounded transition-colors"
              aria-label="Volume"
            >
              {volume === 0 ? (
                <VolumeX size={16} className="text-white/60" />
              ) : (
                <Volume2 size={16} className="text-white/60" />
              )}
            </button>

            {showVolumeSlider && (
              <div className="absolute bottom-full right-0 mb-2 bg-dark-card border border-dark-border/40 rounded-lg p-2">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-20 h-1 bg-dark-border rounded-full appearance-none cursor-pointer accent-brand-500 vertical-slider"
                  aria-label="Volume control"
                  style={{
                    writingMode: 'bt-lr',
                  } as any}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
