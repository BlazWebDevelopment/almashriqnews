'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Breadcrumb from '@/components/Breadcrumb'
import SectionHeading from '@/components/SectionHeading'
import ArticleMeta from '@/components/ArticleMeta'
import ShareBar from '@/components/ShareBar'
import NewsletterForm from '@/components/NewsletterForm'
import {
  getArticleBySlug,
  getArticleSlug,
  getArticleImageSrc,
  articles,
  type Article,
} from '@/data/articles'
import { SITE_NAME } from '@/lib/brand'
import { articleDateline } from '@/lib/time'
import Link from 'next/link'

const FALLBACK_HERO_IMAGE =
  'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=1600&q=80&auto=format&fit=crop'

const BROWSE_LINKS = [
  { href: '/hot', label: 'Hot' },
  { href: '/newspaper', label: 'Politics' },
  { href: '/live', label: 'Live' },
  { href: '/opinion', label: 'Opinion' },
  { href: '/finance', label: 'Business' },
  { href: '/tech', label: 'Technology' },
  { href: '/culture', label: 'Culture' },
  { href: '/sports', label: 'Sports' },
]

interface ArticlePageProps {
  params: {
    slug: string
  }
}

/** Turn bare http(s) URLs in copy into clickable links. */
function linkify(text: string): React.ReactNode {
  const parts = text.split(/(https?:\/\/[^\s]+)/g)
  return parts.map((part, i) =>
    /^https?:\/\//.test(part) ? (
      <a key={i} href={part} target="_blank" rel="noopener noreferrer">
        {part}
      </a>
    ) : (
      part
    )
  )
}

function Kicker({ children }: { children: React.ReactNode }) {
  return <div className="section-label mb-3">{children}</div>
}

function Headline({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="headline headline-lg mb-4 text-[30px] sm:text-[38px] md:text-[44px]">
      {children}
    </h1>
  )
}

function Deck({ children }: { children: React.ReactNode }) {
  return <p className="st-deck mb-6 text-[19px] leading-[1.5]">{children}</p>
}

/** Byline block: rules above and below, share controls on the right. */
function Byline({
  author,
  facts,
  shareTitle,
}: {
  author: string
  facts: string[]
  shareTitle?: string
}) {
  return (
    <div className="mb-7 flex flex-col gap-3 border-y border-[color:var(--border-soft)] py-3.5 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <div className="font-sans text-[13px] font-bold uppercase tracking-[0.07em] text-[color:var(--text-primary)]">
          By {author}
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 font-sans text-[12px] text-[color:var(--text-muted)]">
          {facts.map((fact, i) => (
            <span key={fact} className="flex items-center gap-2">
              {i > 0 && (
                <span className="h-2.5 w-px bg-[color:var(--border-strong)]" aria-hidden="true" />
              )}
              <span>{fact}</span>
            </span>
          ))}
        </div>
      </div>
      {shareTitle ? (
        <div className="shrink-0">
          <ShareBar title={shareTitle} />
        </div>
      ) : null}
    </div>
  )
}

function Caption({ children }: { children: React.ReactNode }) {
  return (
    <figcaption className="st-caption mt-2 border-t border-[color:var(--border-subtle)] pt-2">
      {children}
    </figcaption>
  )
}

/** Tinted box used for explainers and takeaway lists. */
function InsetPanel({
  heading,
  children,
}: {
  heading?: string
  children: React.ReactNode
}) {
  return (
    <div className="st-pull-end my-7 border-y border-[color:var(--border-soft)] bg-[color:var(--bg-surface)] px-5 py-4">
      {heading && (
        <h3 className="section-label mb-2.5">{heading}</h3>
      )}
      <div className="font-serif text-[16px] leading-[1.6] text-[color:var(--text-secondary)] [&>p]:mb-0 [&>ul]:list-disc [&>ul]:space-y-1.5 [&>ul]:pl-5">
        {children}
      </div>
    </div>
  )
}

function SourceLine({ children }: { children: React.ReactNode }) {
  return (
    <div className="st-disclaimer mt-8 p-3.5 font-sans text-[12px] leading-relaxed text-[color:var(--text-muted)]">
      {children}
    </div>
  )
}

function Tags({ tags }: { tags: string[] }) {
  return (
    <div className="mt-7 border-t border-[color:var(--border-soft)] pt-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="section-label mr-1">Tags</span>
        {tags.map((tag) => (
          <span key={tag} className="st-chip">
            {tag}
          </span>
        ))}
      </div>
    </div>
  )
}

/** Rough reading time from the words in the body blocks. */
function readingTime(article: Article): string {
  const words = article.body.reduce((total, block) => {
    if (typeof block === 'string') return total + block.split(/\s+/).length
    if (block.type === 'heading') return total + block.text.split(/\s+/).length
    if (block.type === 'list')
      return total + block.items.join(' ').split(/\s+/).length
    return total
  }, article.summary.split(/\s+/).length)
  return `${Math.max(1, Math.round(words / 220))} min read`
}

export default function ArticlePage({ params }: ArticlePageProps) {
  const article = getArticleBySlug(params.slug)
  const articleImageSrc = getArticleImageSrc(article?.image)

  const isFeaturedArticle = article?.id === '98437239'
  const isBoomerArticle = article?.id === '98437267'

  const relatedArticles = articles.filter((a) => a.id !== article?.id).slice(0, 5)
  const moreFromSection = article
    ? articles.filter((a) => a.id !== article.id && a.section === article.section).slice(0, 4)
    : []

  return (
    <div className="min-h-screen">
      <Header />
      <Breadcrumb
        trail={[{ href: '/hot', label: 'Hot' }]}
        current={article?.category ?? 'Article'}
      />

      <div className="mx-auto max-w-broadsheet px-4 py-8 md:px-6">
        <div className="flex gap-9">
          <main className="min-w-0 flex-1">
            <article className="mx-auto max-w-[700px]">
              {isFeaturedArticle ? (
                <>
                  <Kicker>Crypto</Kicker>

                  <Headline>
                    Gemini Rolls Out &ldquo;Agentic Trading&rdquo;: Let ChatGPT, Claude — and
                    Even Meme Agents — Directly Trade Your Crypto Account
                  </Headline>

                  <Byline
                    author={`${SITE_NAME} Crypto Desk`}
                    facts={['Apr 27, 2026 · 16:05', '1,284 reads', '92 comments']}
                    shareTitle="Gemini Rolls Out Agentic Trading"
                  />

                  <figure className="mb-7">
                    <img
                      src={articleImageSrc ?? FALLBACK_HERO_IMAGE}
                      alt="AI agent connected to a live crypto trading dashboard"
                      className="st-media h-auto w-full object-cover"
                    />
                    <Caption>
                      Illustrative: Gemini&apos;s new &ldquo;Agentic Trading&rdquo; panel lets a
                      &ldquo;My Trading Agent&rdquo; and a dedicated &ldquo;Meme Agent&rdquo; trade
                      under granular, user-defined permissions.
                    </Caption>
                  </figure>

                  <div className="article-content">
                    <p className="text-[20px] font-semibold text-[color:var(--text-primary)]">
                      Gemini today rolled out &ldquo;Agentic Trading,&rdquo; a new product that
                      wires AI models like ChatGPT and Claude directly into your crypto account.
                      Going live on April 27, 2026, the feature uses Anthropic&apos;s open Model
                      Context Protocol (MCP) to let an authorized AI agent monitor markets, place
                      trades, and manage risk under preset rules. Gemini calls it &ldquo;the first
                      agentic trading tool to be available directly through a regulated US-based
                      exchange.&rdquo;
                    </p>

                    <p>
                      The flow is simple: pick the agent you trust, set permissions, then review
                      and connect. The new dashboard exposes a three-step &ldquo;Connect.
                      Authorize. Automate.&rdquo; path, with granular toggles for what an agent
                      can actually do — view balances, view order history, place orders, edit
                      orders, and (off by default) withdraw funds. Users can pause, edit, or
                      revoke access at any time.
                    </p>

                    <InsetPanel heading="How it works under the hood">
                      <p>
                        Gemini has wired its full trading API into the MCP standard. Supported
                        models can request market data and call trading functions through that
                        bridge, then act inside the limits a user has set. The exchange also
                        shipped &ldquo;Trading Skills&rdquo; — modular functions an agent can
                        invoke, including &ldquo;Find the Spread&rdquo; (current bid-ask for any
                        pair) and &ldquo;Retrieve Candles&rdquo; (historical OHLC data for pattern
                        checks and backtesting). More skills are planned.
                      </p>
                    </InsetPanel>

                    <h2>Meet the Meme Agent: AI that trades the trend for you</h2>

                    <p>
                      Alongside a generic &ldquo;My Trading Agent,&rdquo; Gemini&apos;s
                      connected-agents list now showcases a dedicated Meme Agent — a purpose-built
                      AI for the messy, fast-moving memecoin corner of crypto. The pitch is
                      honest: most retail traders cannot watch X, Telegram and on-chain feeds at
                      3 a.m., but an agent can. With your rules, a Meme Agent can flag trending
                      tokens, evaluate liquidity, size in small, set a hard stop, and bail when
                      momentum dies.
                    </p>

                    <p>
                      In the official screenshot, &ldquo;Meme Agent&rdquo; sits right below
                      &ldquo;My Trading Agent&rdquo; in the Connected Agents panel — both showing
                      as Active, both labeled with last activity timestamps. The implication is
                      clear: agents are no longer one-size-fits-all. You can run a conservative
                      agent on your spot account and a tightly-leashed Meme Agent on a separate
                      sub-balance for memecoin trades, each with its own permissions.
                    </p>

                    <InsetPanel heading="What a Meme Agent can do for you">
                      <ul>
                        <li>Watch trending tickers across social and on-chain signals 24/7</li>
                        <li>Use &ldquo;Find the Spread&rdquo; before sizing — skip illiquid traps</li>
                        <li>Backtest patterns with &ldquo;Retrieve Candles&rdquo; before going live</li>
                        <li>Place orders only inside the position size and max-loss you set</li>
                        <li>Auto-exit on stop-loss, take-profit, or momentum reversal</li>
                      </ul>
                    </InsetPanel>

                    <h2>You stay in control</h2>

                    <p>
                      Gemini is leaning hard into the &ldquo;secure by design / always in
                      control&rdquo; framing. The Agent Permissions sidebar shows exactly which
                      capabilities are on (view balances, view order history, place orders, edit
                      orders) and which are off (withdraw funds is blocked by default). A
                      persistent footer reminds users: &ldquo;You can pause or revoke access at
                      any time.&rdquo;
                    </p>

                    <p>
                      That matters because Agentic Trading lands during a wider push to give AI
                      agents real hands on real systems. Coinbase has backed x402 (an open
                      payments standard for AI bots, now under the Linux Foundation), and Tempo
                      is building MPP for machine-to-machine payments — both also use MCP.
                      Gemini&apos;s difference is that it brings agentic AI directly inside a
                      regulated exchange, not a wallet wrapper.
                    </p>

                    <h2>Limits, safety, and what the agent should not do</h2>

                    <p>
                      Letting an AI place real trades raises real questions: How do you stop a
                      model from chasing pumps? How do you cap a bad day? Gemini&apos;s answer is
                      the permissions UI plus Trading Skills that force the agent to look at
                      spreads and history before acting. Withdrawals being off by default is the
                      most important safety rail — even if the model is jailbroken or
                      hallucinates, it cannot drain the account.
                    </p>

                    <p>
                      Gemini frames the launch as the start of a category, not a one-off feature:
                      &ldquo;Agentic trading isn&apos;t just a feature.&rdquo; Expect more Trading
                      Skills, more agent templates (a Meme Agent today, perhaps a DCA Agent or
                      Hedging Agent tomorrow), and tighter MCP integrations with leading models.
                    </p>

                    <h2>Key takeaways</h2>

                    <InsetPanel>
                      <ul>
                        <li>
                          Gemini&apos;s Agentic Trading is live as of April 27, 2026 — AI models
                          like ChatGPT and Claude can connect via MCP to monitor markets and
                          trade.
                        </li>
                        <li>
                          A dedicated Meme Agent template is featured in Connected Agents —
                          purpose-built for memecoin trading with strict, user-set limits.
                        </li>
                        <li>
                          Gemini ships &ldquo;Trading Skills&rdquo; like Find the Spread and
                          Retrieve Candles, with more on the way.
                        </li>
                        <li>
                          Withdrawals are off by default; users can pause, edit or revoke any
                          agent at any time.
                        </li>
                      </ul>
                    </InsetPanel>

                    <SourceLine>
                      <strong className="text-[color:var(--text-primary)]">Reporter:</strong>{' '}
                      {SITE_NAME} Crypto Desk |{' '}
                      <strong className="text-[color:var(--text-primary)]">Editor:</strong> Marcus
                      Chen |{' '}
                      <strong className="text-[color:var(--text-primary)]">Source:</strong>{' '}
                      Gemini, The Block, MoneyCheck |{' '}
                      <strong className="text-[color:var(--text-primary)]">Reviewer:</strong>{' '}
                      David Park
                    </SourceLine>
                  </div>

                  <Tags
                    tags={[
                      '#Gemini',
                      '#AgenticTrading',
                      '#MemeAgent',
                      '#MCP',
                      '#ChatGPT',
                      '#Claude',
                      '#Crypto',
                    ]}
                  />
                </>
              ) : isBoomerArticle ? (
                <>
                  <Kicker>ETF Concept</Kicker>

                  <Headline>
                    Meet BOOMER: A VanEck &ldquo;Old People ETF&rdquo; Concept Built for Investors
                    50+
                  </Headline>

                  <Byline
                    author={`${SITE_NAME} Finance Desk`}
                    facts={['Apr 16, 2026 · 09:45']}
                    shareTitle="Meet BOOMER: A VanEck Old People ETF Concept"
                  />

                  <div className="article-content">
                    <p className="text-[20px] font-semibold text-[color:var(--text-primary)]">
                      GENZ asks a sharp question: if digital natives are reshaping spending and
                      risk habits, why not build an ETF around them? The GENZ idea targets Gen Z
                      and younger millennials who live their financial lives online, across
                      segments like &ldquo;Millennial Finance,&rdquo; the &ldquo;Gig
                      Economy,&rdquo; and digital sports betting.
                    </p>

                    <p>
                      BOOMER turns that premise on its head. This article is fictional and
                      satirical: it imagines a &ldquo;VanEck Old People ETF&rdquo; where the
                      beneficiaries are people 50 and up. Instead of investing in youth-first
                      disruption, BOOMER asks what happens when the theme is centered on
                      accumulated wealth, more mature spending patterns, and the way investors
                      typically allocate risk after age 50.
                    </p>

                    <InsetPanel heading="How BOOMER would “find” the 50+ names">
                      <p>
                        In this thought experiment, &ldquo;old people ETF&rdquo; does not mean
                        buying companies because they have pension plans. It means weighting
                        constituents toward companies expected to benefit from the 50+ cohort as
                        customers — and (in this playful methodology) toward companies whose
                        shareholder/customer profile is skewed toward investors aged 50+. In
                        short: BOOMER imagines an index with a demographic tilt, then rebalances
                        to keep the theme consistent.
                      </p>
                    </InsetPanel>

                    <h2>What BOOMER could invest in</h2>

                    <InsetPanel>
                      <ul>
                        <li>
                          50+ Digital Access: accessibility-first platforms that help older users
                          shop, manage accounts, and access services online.
                        </li>
                        <li>
                          Care &amp; Outcomes: health management, care coordination, and
                          &ldquo;aging well&rdquo; services and tools.
                        </li>
                        <li>
                          Retirement &amp; Risk Navigation: brokerage, advisory, and fintech
                          infrastructure that turns risk into plain language.
                        </li>
                      </ul>
                    </InsetPanel>

                    <h2>Limits &amp; safety (because demographics can drift)</h2>

                    <p>
                      Even if the thesis sounds clean, demographic themes can change fast. Health
                      outcomes evolve, technology adoption among older users can accelerate or
                      slow, and a real implementation would struggle to measure &ldquo;who holds
                      the stock&rdquo; reliably. The safer design always includes diversification
                      and transparent risk controls.
                    </p>

                    <h2>Key takeaways</h2>

                    <InsetPanel>
                      <ul>
                        <li>GENZ frames the market around digital native consumers; BOOMER flips the lens to 50+.</li>
                        <li>In this fictional methodology, the &ldquo;50+ holder&rdquo; idea is a demographic tilt, not a magic rule.</li>
                        <li>Themes guide the story, but risk controls decide the outcome.</li>
                      </ul>
                    </InsetPanel>

                    <SourceLine>
                      <strong className="text-[color:var(--text-primary)]">Reporter:</strong>{' '}
                      {SITE_NAME} Finance Desk |{' '}
                      <strong className="text-[color:var(--text-primary)]">Source:</strong> GENZ
                      theme inspiration (fictional BOOMER rewrite)
                    </SourceLine>
                  </div>

                  <Tags tags={['#BOOMER', '#VanEck', '#ETF', '#50Plus', '#Demographics']} />
                </>
              ) : article ? (
                <>
                  <Kicker>{article.category}</Kicker>

                  <Headline>{article.title}</Headline>

                  <Deck>{article.summary}</Deck>

                  <Byline
                    author={article.byline ?? `${SITE_NAME} Staff`}
                    facts={[
                      articleDateline(article.date),
                      article.time,
                      readingTime(article),
                    ].filter(Boolean)}
                    shareTitle={article.title}
                  />

                  {articleImageSrc ? (
                    <figure className="mb-7">
                      <img
                        src={articleImageSrc}
                        alt={article.title}
                        className="st-media mx-auto h-auto max-h-[520px] w-full object-cover"
                      />
                      <Caption>
                        {article.title} — {SITE_NAME} file image.
                      </Caption>
                    </figure>
                  ) : null}

                  <div className="article-content">
                    {article.body.length > 0 ? (
                      article.body.map((block, idx) => {
                        if (typeof block === 'string') {
                          return <p key={idx}>{linkify(block)}</p>
                        }
                        if (block.type === 'heading') {
                          return <h2 key={idx}>{block.text}</h2>
                        }
                        if (block.type === 'list') {
                          return (
                            <ul key={idx} className="mb-6 list-disc space-y-1.5 pl-5">
                              {block.items.map((item) => (
                                <li key={item}>{linkify(item)}</li>
                              ))}
                            </ul>
                          )
                        }
                        if (block.type === 'image') {
                          return (
                            <figure key={idx} className="my-8">
                              <img
                                src={getArticleImageSrc(block.src) ?? ''}
                                alt={block.alt ?? block.caption ?? ''}
                                loading="lazy"
                                className="st-media h-auto w-full object-cover"
                              />
                              {block.caption ? <Caption>{block.caption}</Caption> : null}
                            </figure>
                          )
                        }
                        return (
                          <figure key={idx} className="my-8">
                            <div className="st-media relative aspect-video w-full overflow-hidden bg-black">
                              <iframe
                                src={`https://www.youtube.com/embed/${block.videoId}`}
                                title={block.title ?? block.caption ?? 'Embedded video'}
                                className="absolute inset-0 h-full w-full"
                                loading="lazy"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                referrerPolicy="strict-origin-when-cross-origin"
                                allowFullScreen
                              />
                            </div>
                            {block.caption ? <Caption>{block.caption}</Caption> : null}
                          </figure>
                        )
                      })
                    ) : (
                      <p className="italic">
                        More from this story is being filed by the desk. Check back shortly.
                      </p>
                    )}

                    <SourceLine>
                      <strong className="text-[color:var(--text-primary)]">Reporter:</strong>{' '}
                      {article.byline ?? `${SITE_NAME} Staff`} |{' '}
                      <strong className="text-[color:var(--text-primary)]">Section:</strong>{' '}
                      {article.section.toUpperCase()} |{' '}
                      <strong className="text-[color:var(--text-primary)]">Source:</strong>{' '}
                      {SITE_NAME}
                    </SourceLine>
                  </div>

                  <Tags
                    tags={[
                      `#${article.category.replace(/\s+/g, '')}`,
                      `#${article.section}`,
                      '#AlmaShriqNews',
                    ]}
                  />
                </>
              ) : (
                <>
                  <Headline>Article not found</Headline>
                  <p className="st-deck text-[17px]">
                    Sorry, the story you&apos;re looking for has either been moved or never
                    existed. Head back to the{' '}
                    <Link href="/" className="text-[color:var(--accent)] underline">
                      front page
                    </Link>{' '}
                    for today&apos;s headlines.
                  </p>
                </>
              )}

              <div className="mt-7 flex flex-col gap-1 border-t border-[color:var(--border-soft)] pt-3 font-sans text-[11px] text-[color:var(--text-muted)] sm:flex-row sm:items-center sm:justify-between">
                <span>Article ID: {article?.id ?? params.slug}</span>
                <span>
                  &copy; {new Date().getFullYear()} {SITE_NAME}.
                </span>
              </div>

              {/* Inline newsletter offer at the end of the story */}
              <section className="st-panel-accent mt-8 p-5 sm:p-6">
                <span className="st-eyebrow text-[color:var(--accent-hover)]">
                  Free newsletter
                </span>
                <h2 className="headline mb-2 mt-1.5 text-[22px]">
                  Get the Morning Briefing
                </h2>
                <p className="st-deck mb-4 max-w-md text-[15px]">
                  Five sharp headlines in your inbox every weekday morning. No filler, no
                  noise.
                </p>
                <div className="max-w-md">
                  <NewsletterForm
                    variant="inline"
                    buttonLabel="Subscribe"
                    placeholder="Your email address"
                  />
                </div>
              </section>
            </article>

            {moreFromSection.length > 0 && (
              <section className="mx-auto mt-10 max-w-[700px]">
                <SectionHeading
                  title={`More in ${article?.section ?? ''}`}
                  href={article ? `/${article.section}` : undefined}
                />
                <ul className="grid grid-cols-1 sm:grid-cols-2 sm:gap-x-7">
                  {moreFromSection.map((a, idx) => (
                    <li key={a.id}>
                      <Link
                        href={`/article/${getArticleSlug(a)}`}
                        className={`group flex gap-3 border-t border-[color:var(--border-subtle)] py-3.5 ${
                          idx === 0 ? 'border-t-0' : ''
                        } ${idx === 1 ? 'sm:border-t-0' : ''}`}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="section-label mb-1.5">{a.category}</div>
                          <h3 className="headline mb-1.5 line-clamp-3 text-[15px] group-hover:text-[color:var(--accent)]">
                            {a.title}
                          </h3>
                          <ArticleMeta article={a} />
                        </div>
                        {getArticleImageSrc(a.image) ? (
                          <div className="st-thumb h-[64px] w-[86px] shrink-0 overflow-hidden">
                            <img
                              src={getArticleImageSrc(a.image)!}
                              alt=""
                              loading="lazy"
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ) : null}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </main>

          <aside className="hidden w-[300px] flex-shrink-0 border-l border-[color:var(--border-soft)] pl-8 xl:block">
            <div className="sticky top-24 space-y-8">
              <section>
                <SectionHeading title="Trending Now" />
                <ol>
                  {relatedArticles.map((a, index) => (
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
                  {BROWSE_LINKS.map((link) => (
                    <Link key={link.href} href={link.href} className="st-chip">
                      {link.label}
                    </Link>
                  ))}
                </div>
              </section>
            </div>
          </aside>
        </div>
      </div>

      <Footer />
    </div>
  )
}
