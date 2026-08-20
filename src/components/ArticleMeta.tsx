import type { Article } from '@/data/articles'
import { SITE_NAME } from '@/lib/brand'
import { relativeTime } from '@/lib/time'

/**
 * In a list every story is already ours, so the masthead prefix on desk bylines
 * is dead weight that pushes the useful part out of narrow rails. Named authors
 * are left untouched.
 */
export function shortByline(byline?: string): string {
  if (!byline) return SITE_NAME
  return byline.startsWith(`${SITE_NAME} `) ? byline.slice(SITE_NAME.length + 1) : byline
}

export default function ArticleMeta({ article }: { article: Article }) {
  return (
    <div className="meta-line flex min-w-0 items-center gap-2">
      <span className="truncate font-medium text-[color:var(--text-secondary)]">
        {shortByline(article.byline)}
      </span>
      <span
        className="h-2.5 w-px shrink-0 bg-[color:var(--border-strong)]"
        aria-hidden="true"
      />
      <span className="shrink-0">{relativeTime(article.date, article.time)}</span>
    </div>
  )
}
