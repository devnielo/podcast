import { format } from 'date-fns'

const DATE_FORMAT = 'dd/MM/yyyy'

export function formatReleaseDate(input?: string) {
  if (!input) return undefined

  try {
    return format(new Date(input), DATE_FORMAT)
  } catch {
    console.error('[dates] invalid date format', { input })
    return undefined
  }
}
