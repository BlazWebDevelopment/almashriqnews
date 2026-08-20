'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import NewsletterForm from '@/components/NewsletterForm'
import ArticleMeta, { shortByline } from '@/components/ArticleMeta'
import SectionHeading from '@/components/SectionHeading'
import { articles, getArticleImageSrc, getArticleSlug, type Article } from '@/data/articles'
import Link from 'next/link'

const FALLBACK_HERO_IMAGE =
  'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=1600&q=80&auto=format&fit=crop'

const TICKER_HEADLINES = [
  'King Charles back in NYC after 19 years',
  'UAE leaves OPEC May 1',
  'Musk vs OpenAI trial opens in California',
  'Knicks roll Hawks 127–97, take 3–2 series lead',
  'Gemini wires AI agents into live crypto trading',
  'Apple unveils Vision Pro 2',
  'Fed cuts rates 50 basis points',
].join('   \u00b7   ')

/** Card used across the headline grids: image on top, kicker, headline, meta. */
function StoryCard({
  article,
  size = 'md',
  showDeck = false,
}: {
  article: Article
  size?: 'sm' | 'md'
  showDeck?: boolean
}) {
  const image = getArticleImageSrc(article.image)
  return (
    <Link
      href={`/article/${getArticleSlug(article)}`}
      className="group flex h-full flex-col"
    >
      <article className="flex h-full flex-col">
        {image ? (
          <div className="st-thumb mb-3 aspect-[16/10] overflow-hidden">
            <img
              src={image}
              alt=""
              loading="lazy"
              className="st-zoom h-full w-full object-cover"
            />
          </div>
        ) : null}
        <div className="section-label mb-1.5">{article.category}</div>
        <h3
          className={`headline mb-1.5 line-clamp-3 group-hover:text-[color:var(--accent)] ${
            size === 'sm' ? 'text-[15px]' : 'text-[17px]'
          }`}
        >
          {article.title}
        </h3>
        {showDeck && (
          <p className="st-deck mb-2.5 line-clamp-2 text-[13.5px]">{article.summary}</p>
        )}
        <div className="mt-auto pt-1">
          <ArticleMeta article={article} />
        </div>
      </article>
    </Link>
  )
}

export default function Home() {
  const featuredArticle = articles[0]
  const isLeopoldFeatured = featuredArticle.id === '98437309'
  const subFeatured = articles.slice(1, 4)
  const latestWire = articles.slice(4, 11)
  const headlineRow = articles.slice(11, 15)
  const mostRead = articles.slice(0, 6)
  const opinionFeed = articles.filter((a) => a.section === 'opinion').slice(0, 3)
  const businessFeed = articles.filter((a) => a.section === 'finance').slice(0, 4)
  const techFeed = articles.filter((a) => a.section === 'tech').slice(0, 4)
  const sportsFeed = articles.filter((a) => a.section === 'sports').slice(0, 4)
  const cultureFeed = articles.filter((a) => a.section === 'culture').slice(0, 4)

  const renderModule = (title: string, href: string, items: Article[]) => (
    <section>
      <SectionHeading title={title} href={href} />
      <ul>
        {items.map((a, i) => (
          <li
            key={a.id}
            className={i > 0 ? 'border-t border-[color:var(--border-subtle)]' : ''}
          >
            <Link
              href={`/article/${getArticleSlug(a)}`}
              className="group flex gap-3 py-3 first:pt-0"
            >
              <div className="min-w-0 flex-1">
                <h3 className="headline mb-1.5 line-clamp-3 text-[14.5px] group-hover:text-[color:var(--accent)]">
                  {a.title}
                </h3>
                <ArticleMeta article={a} />
              </div>
              {getArticleImageSrc(a.image) ? (
                <div className="st-thumb h-[56px] w-[76px] shrink-0 overflow-hidden">
                  <img
                    src={getArticleImageSrc(a.image)!}
                    alt=""
                    loading="lazy"
                    className="st-zoom h-full w-full object-cover"
                  />
                </div>
              ) : null}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )

  return (
    <div className="min-h-screen">
      <Header />

      {/* Breaking rail */}
      <div className="st-ticker-rail">
        <div className="mx-auto flex max-w-broadsheet items-center gap-3 overflow-hidden px-4 py-2.5 md:px-6">
          <span className="st-live-pill inline-flex shrink-0 items-center gap-1.5 px-2.5 py-1 font-sans text-[10px] font-bold uppercase tracking-[0.14em]">
            <span className="live-dot h-1.5 w-1.5 rounded-full bg-white" />
            Breaking
          </span>
          <div className="flex-1 overflow-hidden">
            <div className="animate-ticker font-sans text-[13px] font-medium text-[color:var(--text-secondary)]">
              <span className="pr-12">{TICKER_HEADLINES}</span>
              <span className="pr-12" aria-hidden="true">
                {TICKER_HEADLINES}
              </span>
            </div>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-broadsheet px-4 py-8 md:px-6 md:py-10">
        {/* ---------- Above the fold: lead story + rail ---------- */}
        <div className="grid grid-cols-1 gap-9 lg:grid-cols-12 lg:gap-9">
          <div className="min-w-0 lg:col-span-8">
            <Link href={`/article/${getArticleSlug(featuredArticle)}`} className="group block">
              <article>
                <div className="st-media mb-5 aspect-[16/9] overflow-hidden">
                  <img
                    src={getArticleImageSrc(featuredArticle.image) ?? FALLBACK_HERO_IMAGE}
                    alt=""
                    className={`st-zoom h-full w-full ${
                      isLeopoldFeatured ? 'object-contain' : 'object-cover'
                    }`}
                  />
                </div>
                <div className="section-label mb-2.5">{featuredArticle.category}</div>
                <h1 className="headline headline-lg mb-3.5 text-[32px] sm:text-[42px] md:text-[50px] group-hover:text-[color:var(--accent)]">
                  {featuredArticle.title}
                </h1>
                <p className="st-deck mb-3.5 max-w-3xl text-[17px] md:text-[18px]">
                  {featuredArticle.summary}
                </p>
                <ArticleMeta article={featuredArticle} />
              </article>
            </Link>

            {/* Secondary stories */}
            <div className="mt-9 grid grid-cols-1 gap-7 border-t border-[color:var(--border-soft)] pt-7 sm:grid-cols-3 sm:gap-5">
              {subFeatured.map((a) => (
                <StoryCard key={a.id} article={a} showDeck />
              ))}
            </div>
          </div>

          {/* Right rail */}
          <aside className="min-w-0 lg:col-span-4">
            <div className="space-y-9">
              <section>
                <SectionHeading title="The Latest" aside="Updated live" />
                <ul>
                  {latestWire.map((a, i) => (
                    <li
                      key={a.id}
                      className={i > 0 ? 'border-t border-[color:var(--border-subtle)]' : ''}
                    >
                      <Link
                        href={`/article/${getArticleSlug(a)}`}
                        className="group block py-2.5 first:pt-0"
                      >
                        <div className="flex items-baseline gap-2.5">
                          <span className="shrink-0 font-sans text-[11px] font-bold tabular-nums text-[color:var(--accent)]">
                            {a.time}
                          </span>
                          <h3 className="headline line-clamp-3 text-[14px] leading-snug group-hover:text-[color:var(--accent)]">
                            {a.title}
                          </h3>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <SectionHeading title="Most Read" aside="Past 24 hours" />
                <ol>
                  {mostRead.map((article, index) => (
                    <li
                      key={article.id}
                      className={
                        index > 0 ? 'border-t border-[color:var(--border-subtle)]' : ''
                      }
                    >
                      <Link
                        href={`/article/${getArticleSlug(article)}`}
                        className="group flex gap-3 py-3 first:pt-0"
                      >
                        <span className="st-rank w-6 shrink-0 text-[26px]">{index + 1}</span>
                        <div className="min-w-0 flex-1">
                          <h3 className="headline mb-1 line-clamp-3 text-[14px] leading-snug group-hover:text-[color:var(--accent)]">
                            {article.title}
                          </h3>
                          <ArticleMeta article={article} />
                        </div>
                      </Link>
                    </li>
                  ))}
                </ol>
              </section>

              <section id="newsletter" className="st-panel-accent scroll-mt-24 p-5">
                <span className="st-eyebrow text-[color:var(--accent-hover)]">
                  Free newsletter
                </span>
                <h2 className="headline mb-2 mt-1.5 text-[21px]">Morning Briefing</h2>
                <p className="st-deck mb-4 text-[14px]">
                  Five sharp headlines, every weekday morning. No filler, no noise.
                </p>
                <NewsletterForm variant="stacked" buttonLabel="Subscribe" />
              </section>
            </div>
          </aside>
        </div>

        {/* ---------- More headlines ---------- */}
        <section className="mt-12 border-t border-[color:var(--border-soft)] pt-8">
          <SectionHeading title="More Headlines" href="/hot" linkLabel="All top stories" />
          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
            {headlineRow.map((article) => (
              <StoryCard key={article.id} article={article} size="sm" />
            ))}
          </div>
        </section>

        {/* ---------- Opinion band ---------- */}
        {opinionFeed.length > 0 && (
          <section className="st-panel mt-12 p-6 md:p-8">
            <SectionHeading title="Opinion" href="/opinion" linkLabel="All columns" />
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-6">
              {opinionFeed.map((a) => (
                <Link
                  key={a.id}
                  href={`/article/${getArticleSlug(a)}`}
                  className="group block"
                >
                  <span className="st-eyebrow">{shortByline(a.byline)}</span>
                  <h3 className="headline mt-2 line-clamp-4 text-[17px] group-hover:text-[color:var(--accent)]">
                    {a.title}
                  </h3>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ---------- Section modules ---------- */}
        <div className="mt-12 grid grid-cols-1 gap-9 border-t border-[color:var(--border-soft)] pt-8 sm:grid-cols-2 sm:gap-x-7 lg:grid-cols-4">
          {[
            { title: 'Business', href: '/finance', items: businessFeed },
            { title: 'Technology', href: '/tech', items: techFeed },
            { title: 'Sports', href: '/sports', items: sportsFeed },
            { title: 'Culture', href: '/culture', items: cultureFeed },
          ].map((module) => (
            <div key={module.href}>{renderModule(module.title, module.href, module.items)}</div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  )
}
