/** Section / search / info page masthead: kicker, headline, meta rule, intro. */
export default function PageTitle({
  title,
  kicker,
  meta,
  intro,
}: {
  title: React.ReactNode
  kicker?: string
  meta?: string
  intro?: string
}) {
  return (
    <header className="mb-8">
      {kicker && <div className="section-label mb-2.5">{kicker}</div>}
      <h1 className="headline headline-lg text-[32px] md:text-[42px]">{title}</h1>
      {intro && <p className="st-deck mt-4 max-w-2xl text-[17px]">{intro}</p>}
      {meta && (
        <div className="mt-5 border-t border-[color:var(--border-soft)] pt-3">
          <span className="font-sans text-[11.5px] font-semibold uppercase tracking-[0.1em] text-[color:var(--text-muted)]">
            {meta}
          </span>
        </div>
      )}
    </header>
  )
}
