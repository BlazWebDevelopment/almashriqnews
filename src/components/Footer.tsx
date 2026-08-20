import Link from 'next/link'
import NewsletterForm from './NewsletterForm'
import { BrandMark, Wordmark } from './Logo'
import { SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE } from '@/lib/brand'

const newsLinks = [
  { href: '/', label: 'Top Stories' },
  { href: '/hot', label: 'Hot' },
  { href: '/live', label: 'Live' },
  { href: '/newspaper', label: 'Politics' },
  { href: '/opinion', label: 'Opinion' },
]

const categoryLinks = [
  { href: '/finance', label: 'Business' },
  { href: '/tech', label: 'Technology' },
  { href: '/culture', label: 'Culture' },
  { href: '/sports', label: 'Sports' },
  { href: '/search', label: 'Search' },
]

const companyLinks = [
  { href: '/about', label: 'About us' },
  { href: '/help', label: 'Help centre' },
  { href: '/privacy', label: 'Privacy' },
  { href: '/terms', label: 'Terms of service' },
]

function ColumnHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-4 flex items-center gap-2 font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-white">
      <span
        className="h-3 w-[3px] shrink-0 bg-[color:var(--accent)]"
        aria-hidden="true"
      />
      {children}
    </h3>
  )
}

function LinkColumn({
  heading,
  links,
}: {
  heading: string
  links: { href: string; label: string }[]
}) {
  return (
    <div className="md:col-span-2">
      <ColumnHeading>{heading}</ColumnHeading>
      <ul className="space-y-2.5 font-sans text-[13px]">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-[color:var(--on-ink-muted)] transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function Footer() {
  return (
    <footer className="st-footer-slab mt-14">
      <div className="mx-auto max-w-broadsheet px-4 py-11 md:px-6 md:py-14">
        <div className="grid grid-cols-1 gap-9 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-4">
            <Link href="/" className="mb-4 flex items-center gap-3">
              <BrandMark size={40} tone="inverse" />
              <span className="flex flex-col text-white">
                <Wordmark className="text-[1.35rem] leading-none" />
                <span className="st-eyebrow mt-1.5 text-[color:var(--on-ink-muted)]">
                  {SITE_TAGLINE}
                </span>
              </span>
            </Link>
            <p className="max-w-sm font-sans text-[14px] leading-[1.65] text-[color:var(--on-ink-muted)]">
              {SITE_DESCRIPTION}
            </p>
          </div>

          <LinkColumn heading="News" links={newsLinks} />
          <LinkColumn heading="Sections" links={categoryLinks} />

          <div id="newsletter" className="scroll-mt-24 md:col-span-4">
            <ColumnHeading>Morning briefing</ColumnHeading>
            <p className="mb-4 font-sans text-[14px] leading-[1.6] text-[color:var(--on-ink-muted)]">
              Five sharp headlines in your inbox every weekday morning. Free, and no
              filler.
            </p>
            <NewsletterForm
              variant="inline"
              buttonLabel="Subscribe"
              placeholder="Your email address"
            />
            <ul className="mt-6 space-y-2.5 font-sans text-[13px]">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[color:var(--on-ink-muted)] transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-[color:var(--on-ink-border)]">
        <div className="mx-auto max-w-broadsheet px-4 py-5 md:px-6">
          <div className="flex flex-col items-center justify-between gap-3 font-sans text-[11.5px] text-[color:var(--on-ink-muted)] md:flex-row">
            <span>
              &copy; {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
            </span>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
              {companyLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
