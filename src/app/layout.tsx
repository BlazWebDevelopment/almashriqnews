import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import { SITE_DESCRIPTION, SITE_INITIALS, SITE_NAME } from '@/lib/brand'

/*
 * Fonts are self-hosted variable woff2 rather than fetched from Google, so the
 * build never depends on a third-party request and readers make no cross-origin
 * hop before the masthead paints.
 */

/* UI: masthead, headlines, navigation, kickers, meta lines and forms. */
const ui = localFont({
  src: '../fonts/LibreFranklin-Variable.woff2',
  weight: '100 900',
  style: 'normal',
  display: 'swap',
  variable: '--font-ui',
  fallback: ['Helvetica Neue', 'Arial', 'sans-serif'],
})

/* Editorial: article body copy and long-form prose. */
const editorial = localFont({
  src: [
    { path: '../fonts/SourceSerif4-Variable.woff2', weight: '200 900', style: 'normal' },
    {
      path: '../fonts/SourceSerif4-VariableItalic.woff2',
      weight: '200 900',
      style: 'italic',
    },
  ],
  display: 'swap',
  variable: '--font-editorial',
  fallback: ['Georgia', 'Times New Roman', 'serif'],
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  ? new URL(process.env.NEXT_PUBLIC_SITE_URL)
  : new URL('http://localhost:3000')

const pageTitle = `${SITE_NAME} (${SITE_INITIALS}) — Breaking news, world, business, tech, sport & culture`

export const viewport: Viewport = {
  themeColor: '#c8102e',
  colorScheme: 'light',
}

export const metadata: Metadata = {
  title: pageTitle,
  description: SITE_DESCRIPTION,
  metadataBase: siteUrl,
  applicationName: SITE_NAME,
  keywords: [
    'Alma Shriq News',
    'alma shriq news',
    'ASN',
    'ASN news',
    'breaking news',
    'world news',
    'business',
    'technology',
    'sports',
    'culture',
    'opinion',
  ],
  authors: [{ name: SITE_NAME }],
  icons: {
    icon: [
      { url: '/favicon.ico', type: 'image/x-icon', sizes: '16x16 32x32 48x48 64x64' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/logo.png', type: 'image/png', sizes: '512x512' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-icon.png',
  },
  manifest: '/site.webmanifest',
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    title: pageTitle,
    description: SITE_DESCRIPTION,
    url: '/',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} — ${SITE_DESCRIPTION}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: pageTitle,
    description: SITE_DESCRIPTION,
    images: ['/og-image.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${ui.variable} ${editorial.variable}`}>
      <body>{children}</body>
    </html>
  )
}
