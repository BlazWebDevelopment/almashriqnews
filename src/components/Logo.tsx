import { SITE_NAME } from '@/lib/brand'
import { MARK_GLYPH, MARK_GRID, MARK_RADIUS, MARK_RULE } from '@/lib/brand-mark'

/**
 * The house mark: an "A" monogram standing on the red press rule, on an ink
 * tile. Drawn inline from the same outlines as `public/logo.svg` so the
 * masthead, the favicon and the social card are one drawing at no extra
 * request. `tone="inverse"` reverses the tile for the dark footer slab.
 */
export function BrandMark({
  size = 40,
  tone = 'ink',
  className = '',
}: {
  size?: number
  tone?: 'ink' | 'inverse'
  className?: string
}) {
  const field = tone === 'inverse' ? 'var(--bg-base)' : 'var(--ink)'
  const letter = tone === 'inverse' ? 'var(--ink)' : 'var(--bg-base)'

  return (
    <svg
      viewBox={`0 0 ${MARK_GRID} ${MARK_GRID}`}
      width={size}
      height={size}
      aria-hidden="true"
      className={`shrink-0 ${className}`}
    >
      <rect
        width={MARK_GRID}
        height={MARK_GRID}
        rx={MARK_RADIUS}
        ry={MARK_RADIUS}
        fill={field}
      />
      <path d={MARK_GLYPH} fill={letter} />
      <rect
        x={MARK_RULE.x}
        y={MARK_RULE.y}
        width={MARK_RULE.width}
        height={MARK_RULE.height}
        fill="var(--brand-red)"
      />
    </svg>
  )
}

/**
 * The masthead wordmark. Colour is inherited so the same component reads on
 * paper and on the dark footer slab; the closing word carries the house red.
 */
export function Wordmark({
  className = '',
  accentLastWord = false,
}: {
  className?: string
  accentLastWord?: boolean
}) {
  if (!accentLastWord) {
    return <span className={`st-wordmark ${className}`}>{SITE_NAME}</span>
  }

  const words = SITE_NAME.split(' ')
  const last = words.pop()

  return (
    <span className={`st-wordmark ${className}`}>
      {words.join(' ')} <span className="st-wordmark-accent">{last}</span>
    </span>
  )
}
