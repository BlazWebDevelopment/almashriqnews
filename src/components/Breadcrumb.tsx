import Link from 'next/link'

interface Crumb {
  href: string
  label: string
}

/** Thin strip under the masthead: Home / Section / Current page. */
export default function Breadcrumb({
  trail = [],
  current,
}: {
  trail?: Crumb[]
  current: string
}) {
  return (
    <div className="st-hero-shell">
      <div className="mx-auto max-w-broadsheet px-4 py-2.5 md:px-6">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 font-sans text-[11px] text-[color:var(--text-muted)]"
        >
          <Link href="/" className="hover:text-[color:var(--accent)]">
            Home
          </Link>
          {trail.map((crumb) => (
            <span key={crumb.href} className="flex items-center gap-2">
              <span className="text-[color:var(--border-strong)]" aria-hidden="true">
                /
              </span>
              <Link href={crumb.href} className="hover:text-[color:var(--accent)]">
                {crumb.label}
              </Link>
            </span>
          ))}
          <span className="text-[color:var(--border-strong)]" aria-hidden="true">
            /
          </span>
          <span className="truncate text-[color:var(--text-primary)]">{current}</span>
        </nav>
      </div>
    </div>
  )
}
