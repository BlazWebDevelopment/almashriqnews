import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Breadcrumb from '@/components/Breadcrumb'
import SectionHeading from '@/components/SectionHeading'
import ArticleMeta from '@/components/ArticleMeta'
import PageTitle from '@/components/PageTitle'
import NewsletterForm from '@/components/NewsletterForm'
import {
  getArticlesBySection,
  getArticleImageSrc,
  getArticleSlug,
  articles,
  type Article,
} from '@/data/articles'

interface SectionPageProps {
  section: Article['section']
  title: string
  kicker?: string
}

const browseLinks = [
  { href: '/hot', label: 'Hot' },
  { href: '/newspaper', label: 'Politics' },
  { href: '/live', label: 'Live' },
  { href: '/opinion', label: 'Opinion' },
  { href: '/finance', label: 'Business' },
  { href: '/tech', label: 'Technology' },
  { href: '/culture', label: 'Culture' },
  { href: '/sports', label: 'Sports' },
]

export default function SectionPage({ section, title, kicker }: SectionPageProps) {
  const sectionArticles = getArticlesBySection(section)
  const featured = sectionArticles[0]
  const secondary = sectionArticles.slice(1, 3)
  const rest = sectionArticles.slice(3)
  const count = sectionArticles.length

  return (
    <div className="min-h-screen">
      <Header />
      <Breadcrumb current={title} />

      <main className="mx-auto max-w-broadsheet px-4 py-8 md:px-6">
        <div className="flex flex-col gap-8 lg:flex-row lg:gap-9">
          {/* Main column */}
          <div className="min-w-0 flex-1">
            <PageTitle
              title={title}
              kicker={kicker}
              meta={`${count} ${count === 1 ? 'story' : 'stories'} filed`}
            />

            {count === 0 ? (
              <div className="st-panel p-10 text-center">
                <h3 className="headline mb-1.5 text-[20px]">Nothing on the wire yet</h3>
                <p className="st-deck text-[15px]">
                  No stories filed in this section. Check back soon.
                </p>
              </div>
            ) : (
              <>
                {featured && (
                  <Link href={`/article/${getArticleSlug(featured)}`} className="group block">
                    <article className="mb-8 border-b border-[color:var(--border-soft)] pb-8">
                      {getArticleImageSrc(featured.image) && (
                        <div className="st-media mb-4 aspect-[16/9] overflow-hidden">
                          <img
                            src={getArticleImageSrc(featured.image)!}
                            alt=""
                            className="st-zoom h-full w-full object-cover"
                          />
                        </div>
                      )}
                      <div className="section-label mb-2">{featured.category}</div>
                      <h2 className="headline headline-lg mb-3 text-[28px] md:text-[38px] group-hover:text-[color:var(--accent)]">
                        {featured.title}
                      </h2>
                      <p className="st-deck mb-3 text-[17px]">{featured.summary}</p>
                      <ArticleMeta article={featured} />
                    </article>
                  </Link>
                )}

                {secondary.length > 0 && (
                  <div className="mb-8 grid grid-cols-1 gap-7 border-b border-[color:var(--border-soft)] pb-8 sm:grid-cols-2 sm:gap-6">
                    {secondary.map((article) => (
                      <Link
                        key={article.id}
                        href={`/article/${getArticleSlug(article)}`}
                        className="group block"
                      >
                        <article>
                          {getArticleImageSrc(article.image) && (
                            <div className="st-thumb mb-3 aspect-[16/10] overflow-hidden">
                              <img
                                src={getArticleImageSrc(article.image)!}
                                alt=""
                                loading="lazy"
                                className="st-zoom h-full w-full object-cover"
                              />
                            </div>
                          )}
                          <div className="section-label mb-1.5">{article.category}</div>
                          <h3 className="headline mb-1.5 line-clamp-3 text-[19px] group-hover:text-[color:var(--accent)]">
                            {article.title}
                          </h3>
                          <p className="st-deck mb-2 line-clamp-2 text-[14px]">
                            {article.summary}
                          </p>
                          <ArticleMeta article={article} />
                        </article>
                      </Link>
                    ))}
                  </div>
                )}

                <ul>
                  {rest.map((article, i) => (
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
                          <div className="st-thumb h-[86px] w-[116px] shrink-0 overflow-hidden md:h-[104px] md:w-[148px]">
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
              </>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:w-[300px] lg:shrink-0 lg:border-l lg:border-[color:var(--border-soft)] lg:pl-8">
            <div className="space-y-8">
              <section>
                <SectionHeading title="Trending Now" />
                <ol>
                  {articles.slice(0, 6).map((a, index) => (
                    <li
                      key={a.id}
                      className={index > 0 ? 'border-t border-[color:var(--border-subtle)]' : ''}
                    >
                      <Link
                        href={`/article/${getArticleSlug(a)}`}
                        className="group flex gap-3 py-3 first:pt-0"
                      >
                        <span className="st-rank w-6 shrink-0 text-[24px]">{index + 1}</span>
                        <div className="min-w-0 flex-1">
                          <h3 className="headline mb-1 line-clamp-3 text-[13.5px] leading-snug group-hover:text-[color:var(--accent)]">
                            {a.title}
                          </h3>
                          <ArticleMeta article={a} />
                        </div>
                      </Link>
                    </li>
                  ))}
                </ol>
              </section>

              <section>
                <SectionHeading title="Browse Sections" />
                <div className="flex flex-wrap gap-2">
                  {browseLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`st-chip ${
                        link.href === `/${section}` ? 'st-chip-active' : ''
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </section>

              <section className="st-panel-accent p-5">
                <span className="st-eyebrow text-[color:var(--accent-hover)]">
                  Free newsletter
                </span>
                <h2 className="headline mb-2 mt-1.5 text-[19px]">Morning Briefing</h2>
                <p className="st-deck mb-4 text-[14px]">
                  Five sharp headlines, every weekday morning.
                </p>
                <NewsletterForm variant="stacked" buttonLabel="Subscribe" />
              </section>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  )
}
