import { SITE_INITIALS, SITE_NAME } from '@/lib/brand'

/**
 * The ASN monogram tile. Deliberately rebuilt in CSS rather than loaded as an
 * image so it matches `public/logo.svg` exactly while costing no request —
 * both are the initials in white on a signal-red rounded square.
 */
export function BrandMark({
  size = 40,
  className = '',
}: {
  size?: number
  className?: string
}) {
  return (
    <span
      aria-hidden="true"
      className={`st-brand-mark inline-flex shrink-0 items-center justify-center bg-[color:var(--accent)] font-sans font-extrabold uppercase leading-none text-white ${className}`}
      style={{
        width: size,
        height: size,
        borderRadius: Math.max(3, Math.round(size * 0.15)),
        fontSize: size * 0.325,
        letterSpacing: '-0.02em',
      }}
    >
      {SITE_INITIALS}
    </span>
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
