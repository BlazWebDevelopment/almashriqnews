import Link from 'next/link'

/** Uppercase label sitting on a rule — the standard section marker. */
export default function SectionHeading({
  title,
  href,
  linkLabel = 'More',
  aside,
}: {
  title: string
  href?: string
  linkLabel?: string
  aside?: string
}) {
  return (
    <div className="st-section-accent mb-4 flex items-baseline justify-between gap-3">
      <h2 className="font-sans text-[13px] font-extrabold uppercase tracking-[0.1em] text-[color:var(--text-primary)]">
        {title}
      </h2>
      {href ? (
        <Link
          href={href}
          className="group shrink-0 font-sans text-[11.5px] font-bold uppercase tracking-[0.06em] text-[color:var(--accent)] transition-colors hover:text-[color:var(--accent-hover)]"
        >
          {linkLabel}{' '}
          <span className="inline-block transition-transform group-hover:translate-x-0.5">
            &rarr;
          </span>
        </Link>
      ) : aside ? (
        <span className="shrink-0 font-sans text-[11px] text-[color:var(--text-muted)]">
          {aside}
        </span>
      ) : null}
    </div>
  )
}
