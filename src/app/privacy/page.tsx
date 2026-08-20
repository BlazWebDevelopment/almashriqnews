import InfoPage from '@/components/InfoPage'

export const metadata = {
  title: 'Privacy Policy — Alma Shriq News',
  description:
    'Privacy Policy for Alma Shriq News — what we collect, how we use it, and the choices you have.',
}

export default function PrivacyPage() {
  return (
    <InfoPage
      title="Privacy Policy"
      kicker="Privacy"
      updated="May 6, 2026"
      intro="This Privacy Policy explains what information Alma Shriq News collects when you use the site, why we collect it, and the choices you have. We try to keep it short, clear, and free of legalese."
    >
      <h2>1. Information we collect</h2>
      <p>
        We collect the minimum information needed to run Alma Shriq News and improve the reading
        experience:
      </p>
      <ul>
        <li>
          <strong>Newsletter email.</strong> If you sign up for the daily briefing, we store the
          email address you submit so we can send you the newsletter.
        </li>
        <li>
          <strong>Local preferences.</strong> Some preferences (such as your subscribed email) are
          stored in your browser&apos;s local storage. These never leave your device unless you
          sign up for a feature that requires them.
        </li>
        <li>
          <strong>Basic analytics.</strong> Like most websites, we collect aggregated, anonymized
          usage data — pages viewed, approximate region, browser type — to understand which
          stories resonate.
        </li>
      </ul>

      <h2>2. How we use information</h2>
      <p>We use the data above to:</p>
      <ul>
        <li>Deliver the newsletter you signed up for.</li>
        <li>Remember your preferences across visits.</li>
        <li>Improve the product and prioritize editorial coverage.</li>
        <li>Detect and prevent abuse, spam and fraudulent activity.</li>
      </ul>
      <p>
        We do <strong>not</strong> sell personal information, and we do not share your email
        address with third parties for marketing.
      </p>

      <h2>3. Cookies and similar technologies</h2>
      <p>
        Alma Shriq News uses a small number of essential cookies and the browser&apos;s local
        storage. These keep you signed in to the newsletter, remember your preferences, and help
        diagnose errors. You can clear them at any time from your browser settings.
      </p>

      <h2>4. Your choices</h2>
      <ul>
        <li>
          <strong>Unsubscribe.</strong> Every newsletter email contains a one-click unsubscribe
          link. You can also clear your subscription on the site by clicking the &ldquo;Use a
          different email&rdquo; control under the success message.
        </li>
        <li>
          <strong>Access &amp; deletion.</strong> Email{' '}
          <a href="mailto:privacy@almashriqnews.example">privacy@almashriqnews.example</a> to request
          a copy of the data we hold about you, or to ask us to delete it.
        </li>
        <li>
          <strong>Opt-out of analytics.</strong> Most browsers offer a &ldquo;Do Not Track&rdquo;
          setting and built-in privacy controls; we honor those signals.
        </li>
      </ul>

      <h2>5. Data retention</h2>
      <p>
        We retain newsletter email addresses for as long as you remain subscribed, plus a short
        period afterwards for record-keeping. Anonymized analytics may be retained for longer in
        aggregated form.
      </p>

      <h2>6. Children</h2>
      <p>
        Alma Shriq News is not directed to children under 13, and we do not knowingly collect
        personal information from them. If you believe a child has signed up, please contact us
        and we will delete the account.
      </p>

      <h2>7. Changes to this policy</h2>
      <p>
        We may update this Privacy Policy from time to time. When we make material changes, we
        will note them at the top of this page and update the &ldquo;Last updated&rdquo; date.
      </p>

      <h2>8. Contact</h2>
      <p>
        Questions about this policy? Email{' '}
        <a href="mailto:privacy@almashriqnews.example">privacy@almashriqnews.example</a>.
      </p>
    </InfoPage>
  )
}
