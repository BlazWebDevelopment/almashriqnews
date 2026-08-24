import { SITE_NAME } from '@/lib/brand'
import { MARK_GRID, MARK_HORIZON, MARK_RING, MARK_SUN } from '@/lib/brand-mark'

/**
 * The house mark: a red medallion — white rising sun, horizon rule and thin
 * ring on a flat red disc. Drawn inline from the same geometry as
 * `public/logo.svg` so the masthead, the favicon and the social card are one
 * drawing at no extra request. `tone="onRed"` deepens the disc so the
 * medallion still reads when it sits on the red masthead slab.
 */
export function BrandMark({
  size = 40,
  tone = 'brand',
  className = '',
}: {
  size?: number
  tone?: 'brand' | 'onRed'
  className?: string
}) {
  const field = tone === 'onRed' ? 'var(--brand-red-deep)' : 'var(--brand-red)'
  const c = MARK_GRID / 2

  return (
    <svg
      viewBox={`0 0 ${MARK_GRID} ${MARK_GRID}`}
      width={size}
      height={size}
      aria-hidden="true"
      className={`shrink-0 ${className}`}
    >
      <circle cx={c} cy={c} r={c} fill={field} />
      <circle
        cx={c}
        cy={c}
        r={MARK_RING.r}
        fill="none"
        stroke="#ffffff"
        strokeWidth={MARK_RING.stroke}
      />
      <path d={MARK_SUN} fill="#ffffff" />
      <rect
        x={MARK_HORIZON.x}
        y={MARK_HORIZON.y}
        width={MARK_HORIZON.width}
        height={MARK_HORIZON.height}
        fill="#ffffff"
      />
    </svg>
  )
}

/**
 * The masthead wordmark. Colour is inherited so the same component reads in
 * white on the red slab and on the dark footer; `accentLastWord` paints the
 * closing word house red for use on paper.
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
