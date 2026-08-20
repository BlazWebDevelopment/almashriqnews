import InfoPage from '@/components/InfoPage'
import Link from 'next/link'

export const metadata = {
  title: 'Help & FAQ — Alma Shriq News',
  description:
    'Help center for Alma Shriq News — answers to the questions readers ask most often.',
}

const faqs: { q: string; a: React.ReactNode }[] = [
  {
    q: 'How is the front page chosen?',
    a: (
      <p>
        The front page is curated by our top-stories editor based on a mix of editorial weight,
        recency, and what readers are reading right now. Sections like{' '}
        <Link href="/finance">Business</Link>, <Link href="/tech">Technology</Link>,{' '}
        <Link href="/sports">Sports</Link>, <Link href="/culture">Culture</Link> and{' '}
        <Link href="/opinion">Opinion</Link> are curated by their respective desks.
      </p>
    ),
  },
  {
    q: 'How do I subscribe to the newsletter?',
    a: (
      <p>
        Scroll to the &ldquo;Daily briefing&rdquo; card on the home page, or to the form in the
        footer of any page. Enter your email and click <strong>Subscribe</strong>. You&apos;ll see
        a green &ldquo;Successfully subscribed!&rdquo; confirmation when it&apos;s done.
      </p>
    ),
  },
  {
    q: 'How do I unsubscribe?',
    a: (
      <p>
        Every email includes a one-click unsubscribe link. You can also unsubscribe directly on
        the site: open the newsletter card, then click <strong>Use a different email</strong>{' '}
        under the success message to clear your subscription on this device.
      </p>
    ),
  },
  {
    q: 'I changed my email — how do I update it?',
    a: (
      <p>
        Click <strong>Use a different email</strong> on the newsletter card to clear your current
        subscription, then submit the new email address. We&apos;ll start sending the briefing to
        the new address from the next morning.
      </p>
    ),
  },
  {
    q: 'Why isn’t my browser remembering that I’m subscribed?',
    a: (
      <p>
        Alma Shriq News stores your subscription preference in your browser&apos;s local storage. If
        you use private/incognito mode, clear cookies regularly, or switch devices, you may see
        the subscription form again — but you remain subscribed on our end. Just submit the same
        email; it won&apos;t create duplicates.
      </p>
    ),
  },
  {
    q: 'How do I search for a story?',
    a: (
      <p>
        Use the search bar at the top of any page (or the mobile search field below it). Hit
        Enter to see results across every section. You can also try one of the popular tags on
        the <Link href="/search?q=Bitcoin">search page</Link>.
      </p>
    ),
  },
  {
    q: 'I see something wrong in a story. How do I report a correction?',
    a: (
      <p>
        Email <a href="mailto:editorial@almashriqnews.example">editorial@almashriqnews.example</a>{' '}
        with the article URL and what you think is wrong. We take corrections seriously and aim
        to update or annotate within 24 hours.
      </p>
    ),
  },
  {
    q: 'Can I republish or quote your articles?',
    a: (
      <p>
        Short excerpts and direct links are always welcome. For longer reuse, syndication, or any
        commercial reproduction, please write to{' '}
        <a href="mailto:press@almashriqnews.example">press@almashriqnews.example</a> first. Read
        our <Link href="/terms">Terms of Service</Link> for details.
      </p>
    ),
  },
  {
    q: 'How do I tip the newsroom?',
    a: (
      <p>
        Send the lead to <a href="mailto:tips@almashriqnews.example">tips@almashriqnews.example</a>.
        Please include as much detail as you can — documents, screenshots, names of people who
        can corroborate. We protect our sources.
      </p>
    ),
  },
  {
    q: 'How does Alma Shriq News protect my data?',
    a: (
      <p>
        We collect the minimum data needed and never sell personal information. See our{' '}
        <Link href="/privacy">Privacy Policy</Link> for the full breakdown of what we collect and
        the controls you have.
      </p>
    ),
  },
]

export default function HelpPage() {
  return (
    <InfoPage
      title="Help & FAQ"
      kicker="Help"
      updated="May 6, 2026"
      intro="Quick answers to the questions readers ask most often. Can’t find what you’re looking for? Email help@almashriqnews.example and a real human will get back to you."
    >
      <h2>Frequently asked questions</h2>
      <div className="st-card overflow-hidden mt-4">
        {faqs.map((item, idx) => (
          <details
            key={idx}
            className="info-faq border-t border-[color:var(--border-soft)] first:border-t-0"
          >
            <summary>
              <span className="flex-1">{item.q}</span>
            </summary>
            <div>{item.a}</div>
          </details>
        ))}
      </div>

      <h2>Still need help?</h2>
      <p>
        Drop us a line at{' '}
        <a href="mailto:help@almashriqnews.example">help@almashriqnews.example</a>. For privacy
        requests, use <a href="mailto:privacy@almashriqnews.example">privacy@almashriqnews.example</a>.
        For press, partnerships and republishing, write to{' '}
        <a href="mailto:press@almashriqnews.example">press@almashriqnews.example</a>.
      </p>
    </InfoPage>
  )
}
