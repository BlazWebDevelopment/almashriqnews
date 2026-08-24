'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { SITE_NAME, SITE_TAGLINE } from '@/lib/brand'
import { BrandMark, Wordmark } from './Logo'

type NavItem = {
  href: string
  label: string
  live?: boolean
}

const navItems: NavItem[] = [
  { href: '/', label: 'Top Stories' },
  { href: '/hot', label: 'Hot' },
  { href: '/live', label: 'Live', live: true },
  { href: '/newspaper', label: 'Politics' },
  { href: '/finance', label: 'Business' },
  { href: '/tech', label: 'Technology' },
  { href: '/sports', label: 'Sports' },
  { href: '/culture', label: 'Culture' },
  { href: '/opinion', label: 'Opinion' },
]

const utilityLinks = [
  { href: '/about', label: 'About' },
  { href: '/help', label: 'Help' },
  { href: '/terms', label: 'Terms' },
]

function SearchIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="8.5" cy="8.5" r="5.25" />
      <path d="M12.5 12.5 17 17" />
    </svg>
  )
}

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('')
  const [today, setToday] = useState('')
  const [navPinned, setNavPinned] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  // Rendered on the client only so the printed date never mismatches the server.
  useEffect(() => {
    setToday(
      new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    )
  }, [])

  // The compact medallion only earns its place once the masthead has scrolled off.
  useEffect(() => {
    const onScroll = () => setNavPinned(window.scrollY > 180)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const renderItem = (item: NavItem) => {
    const isActive = pathname === item.href
    return (
      <Link
        key={item.href}
        href={item.href}
        aria-current={isActive ? 'page' : undefined}
        className={`flex shrink-0 items-center gap-1.5 whitespace-nowrap border-b-[3px] px-3 pb-[10px] pt-[13px] font-sans text-[12.5px] font-bold uppercase tracking-[0.05em] transition-colors ${
          isActive
            ? 'border-[color:var(--brand-red)] text-[color:var(--brand-red)]'
            : 'border-transparent text-[color:var(--text-primary)] hover:border-[color:var(--accent-border)] hover:text-[color:var(--brand-red)]'
        }`}
      >
        {item.live && (
          <span className="live-dot h-1.5 w-1.5 rounded-full bg-[color:var(--live)]" />
        )}
        <span>{item.label}</span>
      </Link>
    )
  }

  return (
    <header className="st-header-slab">
      {/* Slim black utility rail: dateline left, secondary links and subscribe right */}
      <div className="st-utility-rail">
        <div className="mx-auto max-w-broadsheet px-4 md:px-6">
          <div className="flex h-9 items-center justify-between gap-4 font-sans text-[11.5px]">
            <span className="truncate tracking-[0.02em] text-[color:var(--on-ink-muted)]">
              {today || '\u00a0'}
            </span>
            <div className="flex items-center gap-4">
              <span className="hidden items-center gap-4 sm:flex">
                {utilityLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="font-medium text-[color:var(--on-ink-muted)] transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                ))}
              </span>
              <Link
                href="/#newsletter"
                className="st-btn-cta px-3 py-1 text-[10.5px] uppercase tracking-[0.1em]"
              >
                Subscribe
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Red masthead slab: medallion and white wordmark left, search right */}
      <div className="st-masthead-slab">
        <div className="mx-auto max-w-broadsheet px-4 md:px-6">
          <div className="flex flex-col gap-4 py-5 md:flex-row md:items-center md:justify-between md:py-6">
            <Link href="/" className="group flex items-center gap-3.5">
              <BrandMark
                size={52}
                tone="onRed"
                className="transition-transform group-hover:scale-105"
              />
              <span className="flex flex-col">
                <Wordmark className="text-[1.6rem] leading-none text-white sm:text-[2rem] md:text-[2.3rem]" />
                <span className="st-eyebrow mt-1.5 text-[#f3c9d0]">
                  {SITE_TAGLINE}
                </span>
              </span>
            </Link>

            <form
              onSubmit={handleSearch}
              className="st-search flex h-10 items-center pl-3.5 md:w-[300px]"
            >
              <SearchIcon className="h-4 w-4 shrink-0 text-[color:var(--text-muted)]" />
              <input
                type="text"
                placeholder={`Search ${SITE_NAME}`}
                aria-label={`Search ${SITE_NAME}`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="min-w-0 flex-1 bg-transparent px-2.5 font-sans text-[13px] text-[color:var(--text-primary)] placeholder-[color:var(--text-muted)] focus:outline-none"
              />
              <button
                type="submit"
                className="mr-1 shrink-0 px-3 py-1.5 font-sans text-[10.5px] font-bold uppercase tracking-[0.1em] text-[color:var(--text-secondary)] transition-colors hover:bg-[color:var(--brand-red)] hover:text-white"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Section nav, pinned once the masthead scrolls away */}
      <nav
        className={`st-nav-rail st-sticky-rail ${navPinned ? 'st-sticky-rail-pinned' : ''}`}
        aria-label="Sections"
      >
        <div className="mx-auto max-w-broadsheet px-2 md:px-6">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              aria-label={SITE_NAME}
              aria-hidden={!navPinned}
              tabIndex={navPinned ? undefined : -1}
              className={`hidden shrink-0 items-center overflow-hidden transition-all duration-200 lg:flex ${
                navPinned
                  ? 'w-[34px] opacity-100'
                  : 'pointer-events-none w-0 opacity-0'
              }`}
            >
              <BrandMark size={28} />
            </Link>
            <div className="flex flex-1 items-center overflow-x-auto scrollbar-hide">
              {navItems.map(renderItem)}
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}
