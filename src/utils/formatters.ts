export const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

export const formatDuration = (seconds: number): string => {
  if (!seconds || seconds < 0) return '00:00'
  
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)
  
  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }
  
  return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

export const truncateText = (text: string, length: number): string => {
  if (text.length <= length) return text
  return `${text.substring(0, length)}...`
}

export const sanitizeHtml = (html: string): string => {
  const div = document.createElement('div')
  div.textContent = html
  return div.innerHTML
}
