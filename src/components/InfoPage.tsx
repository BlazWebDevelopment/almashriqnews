import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Breadcrumb from '@/components/Breadcrumb'
import PageTitle from '@/components/PageTitle'

interface InfoPageProps {
  title: string
  kicker?: string
  updated?: string
  intro?: string
  children: React.ReactNode
}

export default function InfoPage({ title, kicker, updated, intro, children }: InfoPageProps) {
  return (
    <div className="min-h-screen">
      <Header />
      <Breadcrumb current={title} />

      <main className="mx-auto max-w-[760px] px-4 py-10 md:px-6">
        <article>
          <PageTitle
            title={title}
            kicker={kicker}
            meta={updated ? `Last updated ${updated}` : undefined}
            intro={intro}
          />
          <div className="info-content">{children}</div>
        </article>
      </main>

      <Footer />
    </div>
  )
}
