'use client'

import { useEffect, useState } from 'react'

type Variant = 'inline' | 'stacked'

interface NewsletterFormProps {
  variant?: Variant
  buttonLabel?: string
  placeholder?: string
  className?: string
}

const STORAGE_KEY = 'alma-shriq-news-subscribed-email'

const isValidEmail = (val: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim())
}

const INPUT_CLASS =
  'text-[color:var(--text-primary)] placeholder-[color:var(--text-muted)]'

export default function NewsletterForm({
  variant = 'stacked',
  buttonLabel = 'Subscribe',
  placeholder = 'your@email.com',
  className = '',
}: NewsletterFormProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [subscribedEmail, setSubscribedEmail] = useState<string | null>(null)

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY)
      if (stored) setSubscribedEmail(stored)
    } catch {
      /* localStorage unavailable */
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = email.trim()
    if (!trimmed) {
      setStatus('error')
      setMessage('Please enter your email address.')
      return
    }
    if (!isValidEmail(trimmed)) {
      setStatus('error')
      setMessage("That doesn't look like a valid email.")
      return
    }

    setStatus('submitting')
    setMessage('')

    window.setTimeout(() => {
      try {
        window.localStorage.setItem(STORAGE_KEY, trimmed)
      } catch {
        /* ignore */
      }
      setSubscribedEmail(trimmed)
      setStatus('success')
      setMessage(`You're subscribed — confirmation sent to ${trimmed}.`)
      setEmail('')
    }, 700)
  }

  const handleUnsubscribe = () => {
    try {
      window.localStorage.removeItem(STORAGE_KEY)
    } catch {
      /* ignore */
    }
    setSubscribedEmail(null)
    setStatus('idle')
    setMessage('')
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    if (status === 'error') {
      setStatus('idle')
      setMessage('')
    }
  }

  if (subscribedEmail && status !== 'submitting') {
    return (
      <div className={className} role="status" aria-live="polite">
        <div className="st-notice-ok border border-[color:var(--accent-border)] bg-[color:var(--accent-subtle)] px-3.5 py-3">
          <div className="flex items-start gap-2.5">
            <span
              className="st-icon-btn mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center bg-[color:var(--accent)] text-white"
              aria-hidden="true"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </span>
            <div className="min-w-0 flex-1">
              <div className="font-sans text-[13px] font-bold text-[color:var(--text-primary)]">
                Successfully subscribed
              </div>
              <div className="mt-0.5 break-words font-sans text-[13px] text-[color:var(--text-secondary)]">
                Headlines will land at <span className="font-bold">{subscribedEmail}</span>.
              </div>
              <button
                type="button"
                onClick={handleUnsubscribe}
                className="mt-1.5 text-[12px] text-[color:var(--accent)] hover:text-[color:var(--accent-hover)] underline"
              >
                Use a different email
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className={className} noValidate>
      {variant === 'stacked' ? (
        <>
          <input
            type="email"
            value={email}
            onChange={handleChange}
            placeholder={placeholder}
            disabled={status === 'submitting'}
            aria-invalid={status === 'error'}
            aria-label="Email address"
            className={`st-field mb-2 w-full px-3 py-2.5 font-sans text-[13px] ${INPUT_CLASS}`}
          />
          <button
            type="submit"
            disabled={status === 'submitting'}
            className="st-btn-cta w-full py-2.5 font-sans text-[11.5px] uppercase tracking-[0.12em] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === 'submitting' ? 'Subscribing…' : buttonLabel}
          </button>
        </>
      ) : (
        <div className="flex items-stretch gap-2">
          <input
            type="email"
            value={email}
            onChange={handleChange}
            placeholder={placeholder}
            disabled={status === 'submitting'}
            aria-invalid={status === 'error'}
            aria-label="Email address"
            className={`st-field min-w-0 flex-1 px-3 py-2.5 font-sans text-[13px] ${INPUT_CLASS}`}
          />
          <button
            type="submit"
            disabled={status === 'submitting'}
            className="st-btn-cta shrink-0 whitespace-nowrap px-4 py-2.5 font-sans text-[11.5px] uppercase tracking-[0.12em] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === 'submitting' ? '…' : buttonLabel}
          </button>
        </div>
      )}

      {status === 'error' && message && (
        <div className="mt-1.5 font-sans text-[12px] text-[color:var(--live)]">{message}</div>
      )}
    </form>
  )
}
