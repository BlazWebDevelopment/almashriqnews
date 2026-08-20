/** Combine YYYY-MM-DD and HH:MM into a local datetime for age calculations. */
function parseArticleDateTime(dateStr: string, timeStr?: string): Date {
  if (timeStr && /^\d{1,2}:\d{2}$/.test(timeStr)) {
    const [hours, minutes] = timeStr.split(':')
    const local = new Date(dateStr)
    if (!Number.isNaN(local.getTime())) {
      local.setHours(Number(hours), Number(minutes), 0, 0)
      return local
    }
  }

  return new Date(dateStr)
}

/** Short "how long ago" label used in article bylines across the site. */
export function relativeTime(dateStr?: string, timeStr?: string): string {
  if (!dateStr) return 'Today'

  const d = parseArticleDateTime(dateStr, timeStr)
  if (Number.isNaN(d.getTime())) return dateStr

  const diffH = Math.floor((Date.now() - d.getTime()) / 3_600_000)
  if (diffH < 1) return 'Just now'
  if (diffH < 24) return `${diffH}h ago`

  const diffD = Math.floor(diffH / 24)
  if (diffD === 1) return 'Yesterday'
  if (diffD < 7) return `${diffD}d ago`

  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

/**
 * Dateline for a story, e.g. "August 12, 2026". Formatted straight from the
 * YYYY-MM-DD parts rather than through `Date`, so a reader's timezone can never
 * shift the printed day or desync it from the server-rendered markup.
 */
export function articleDateline(dateStr?: string): string {
  if (!dateStr) return ''

  const parts = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr)
  if (!parts) return dateStr

  const [, year, month, day] = parts
  return `${MONTHS[Number(month) - 1]} ${Number(day)}, ${year}`
}

/** Long dateline, e.g. "Friday, July 31, 2026". */
export function longDate(dateStr?: string): string {
  const d = dateStr ? new Date(dateStr) : new Date()
  if (Number.isNaN(d.getTime())) return ''

  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}
