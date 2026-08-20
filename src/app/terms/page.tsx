import InfoPage from '@/components/InfoPage'

export const metadata = {
  title: 'Terms of Service — Alma Shriq News',
  description:
    'Terms of Service for Alma Shriq News — the rules of the road for using our site and newsletter.',
}

export default function TermsPage() {
  return (
    <InfoPage
      title="Terms of Service"
      kicker="Terms"
      updated="May 6, 2026"
      intro="These Terms of Service govern your use of Alma Shriq News. By using the site or subscribing to the newsletter, you agree to these terms. If you don’t agree, please don’t use the service."
    >
      <h2>1. Use of the service</h2>
      <p>
        Alma Shriq News gives you a personal, non-commercial license to read articles and use the
        features of the site. You agree not to:
      </p>
      <ul>
        <li>Scrape, mass-download, or republish our content without permission.</li>
        <li>Attempt to disrupt, attack, or reverse-engineer the service.</li>
        <li>Use Alma Shriq News to harass others or distribute illegal content.</li>
        <li>Impersonate Alma Shriq News staff or misrepresent your affiliation with us.</li>
      </ul>

      <h2>2. Content and intellectual property</h2>
      <p>
        Articles, headlines, design, code and brand marks on Alma Shriq News are protected by
        copyright and trademark laws. You may share short excerpts and direct links freely. For
        any other reuse — including syndication, training data, and commercial reproduction — you
        must obtain written permission first.
      </p>
      <p>
        Some images and embedded media belong to the publishers, photographers or platforms
        credited in the captions. Their licenses apply to those assets specifically.
      </p>

      <h2>3. Newsletter</h2>
      <p>
        The Alma Shriq News newsletter is provided as-is. We do our best to keep it timely and
        accurate, but we cannot guarantee delivery, formatting in every email client, or that
        every story will reach you. You can unsubscribe at any time using the link in any email
        or by clearing your subscription on the site.
      </p>

      <h2>4. No professional advice</h2>
      <p>
        Alma Shriq News is a news product. Nothing on the site is intended as financial, legal,
        medical, or other professional advice. Always do your own research and consult qualified
        professionals before making decisions.
      </p>

      <h2>5. Third-party links</h2>
      <p>
        We sometimes link to third-party sites, services and embeds. Alma Shriq News is not
        responsible for the content, accuracy, or privacy practices of those external services.
      </p>

      <h2>6. Disclaimers and liability</h2>
      <p>
        Alma Shriq News is provided &ldquo;as is&rdquo; without warranties of any kind, express or
        implied. To the fullest extent permitted by law, Alma Shriq News is not liable for any
        indirect, incidental, special, consequential or punitive damages arising out of your use
        of the service.
      </p>

      <h2>7. Termination</h2>
      <p>
        We may suspend or terminate access to the service at any time, with or without notice, if
        we believe you have violated these terms or applicable law.
      </p>

      <h2>8. Changes to these terms</h2>
      <p>
        We may revise these terms from time to time. Material changes will be reflected by
        updating the &ldquo;Last updated&rdquo; date at the top of this page. Continued use of
        the service after a change means you accept the new terms.
      </p>

      <h2>9. Contact</h2>
      <p>
        Questions about these terms? Email{' '}
        <a href="mailto:legal@almashriqnews.example">legal@almashriqnews.example</a>.
      </p>
    </InfoPage>
  )
}
