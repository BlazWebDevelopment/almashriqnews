'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Breadcrumb from '@/components/Breadcrumb'
import SectionHeading from '@/components/SectionHeading'
import ArticleMeta from '@/components/ArticleMeta'
import PageTitle from '@/components/PageTitle'
import { searchArticles, articles, getArticleImageSrc, getArticleSlug } from '@/data/articles'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

const POPULAR_SEARCHES = [
  'Gemini',
  'AI',
  'Bitcoin',
  'Knicks',
  'NYC',
  'Yankees',
  'Memecoin',
  'OpenAI',
]

function SearchResults() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const results = query ? searchArticles(query) : []

  return (
    <div className="min-h-screen">
      <Header />
      <Breadcrumb current="Search" />

      <main className="mx-auto max-w-broadsheet px-4 py-8 md:px-6">
        <div className="flex flex-col gap-8 lg:flex-row lg:gap-9">
          <div className="min-w-0 flex-1">
            <PageTitle
              kicker="Search"
              title={<>Results for &ldquo;{query}&rdquo;</>}
              meta={`${results.length} ${results.length === 1 ? 'result' : 'results'}`}
            />

            {results.length > 0 ? (
              <ul>
                {results.map((article, i) => (
                  <li
                    key={article.id}
                    className={i > 0 ? 'border-t border-[color:var(--border-soft)]' : ''}
                  >
                    <Link
                      href={`/article/${getArticleSlug(article)}`}
                      className="group flex gap-5 py-5 first:pt-0"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="section-label mb-1.5">{article.category}</div>
                        <h3 className="headline mb-1.5 line-clamp-3 text-[18px] leading-snug group-hover:text-[color:var(--accent)]">
                          {article.title}
                        </h3>
                        <p className="st-deck mb-2 line-clamp-2 text-[14px]">
                          {article.summary}
                        </p>
                        <ArticleMeta article={article} />
                      </div>
                      {getArticleImageSrc(article.image) ? (
                        <div className="st-thumb h-[86px] w-[116px] shrink-0 overflow-hidden">
                          <img
                            src={getArticleImageSrc(article.image)!}
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
            ) : (
              <div className="st-panel p-10 text-center">
                <h3 className="headline mb-1.5 text-[20px]">No results</h3>
                <p className="st-deck text-[15px]">
                  Try different keywords, or pick one of the popular searches.
                </p>
              </div>
            )}
          </div>

          <aside className="lg:w-[300px] lg:shrink-0 lg:border-l lg:border-[color:var(--border-soft)] lg:pl-8">
            <div className="space-y-8">
              <section>
                <SectionHeading title="Popular Searches" />
                <div className="flex flex-wrap gap-2">
                  {POPULAR_SEARCHES.map((term) => (
                    <Link
                      key={term}
                      href={`/search?q=${encodeURIComponent(term)}`}
                      className={`st-chip ${
                        term.toLowerCase() === query.trim().toLowerCase()
                          ? 'st-chip-active'
                          : ''
                      }`}
                    >
                      {term}
                    </Link>
                  ))}
                </div>
              </section>

              <section>
                <SectionHeading title="Trending Now" />
                <ol>
                  {articles.slice(0, 6).map((article, index) => (
                    <li
                      key={article.id}
                      className={index > 0 ? 'border-t border-[color:var(--border-subtle)]' : ''}
                    >
                      <Link
                        href={`/article/${getArticleSlug(article)}`}
                        className="group flex gap-3 py-3 first:pt-0"
                      >
                        <span className="st-rank w-6 shrink-0 text-[24px]">{index + 1}</span>
                        <div className="min-w-0 flex-1">
                          <h3 className="headline mb-1 line-clamp-3 text-[13.5px] leading-snug group-hover:text-[color:var(--accent)]">
                            {article.title}
                          </h3>
                          <ArticleMeta article={article} />
                        </div>
                      </Link>
                    </li>
                  ))}
                </ol>
              </section>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center font-sans text-[13px] text-[color:var(--text-secondary)]">
          Loading…
        </div>
      }
    >
      <SearchResults />
    </Suspense>
  )
}
