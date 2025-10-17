import { Episode } from '@types'

export const parseEpisodesFromFeed = (feedXml: string): Episode[] => {
  const parser = new DOMParser()
  const xmlDoc = parser.parseFromString(feedXml, 'text/xml')

  if (xmlDoc.getElementsByTagName('parsererror').length > 0) {
    throw new Error('Failed to parse RSS feed')
  }

  const items = xmlDoc.getElementsByTagName('item')
  const episodes: Episode[] = []

  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    const title = item.getElementsByTagName('title')[0]?.textContent || ''
    const description = item.getElementsByTagName('description')[0]?.textContent || ''
    const pubDate = item.getElementsByTagName('pubDate')[0]?.textContent || ''
    const enclosure = item.getElementsByTagName('enclosure')[0]
    const link = item.getElementsByTagName('link')[0]?.textContent || ''
    const guid = item.getElementsByTagName('guid')[0]?.textContent || ''

    let duration = 0
    const durationElement = item.getElementsByTagName('duration')[0]
    if (durationElement?.textContent) {
      const durationStr = durationElement.textContent
      if (/^\d+$/.test(durationStr)) {
        duration = parseInt(durationStr, 10)
      } else {
        const parts = durationStr.split(':').map(Number)
        if (parts.length === 3) {
          duration = parts[0] * 3600 + parts[1] * 60 + parts[2]
        } else if (parts.length === 2) {
          duration = parts[0] * 60 + parts[1]
        }
      }
    }

    if (enclosure && enclosure.getAttribute('url')) {
      episodes.push({
        id: guid || link,
        title,
        description,
        pubDate,
        duration,
        enclosure: {
          url: enclosure.getAttribute('url') || '',
          type: enclosure.getAttribute('type') || 'audio/mpeg',
          length: parseInt(enclosure.getAttribute('length') || '0', 10),
        },
        link,
        guid,
      })
    }
  }

  return episodes
}
