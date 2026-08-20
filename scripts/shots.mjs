// Capture review screenshots of every template plus a quick health report.
//   node scripts/shots.mjs            (expects the dev server on :3000)
//   BASE=http://127.0.0.1:3001 node scripts/shots.mjs
import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'

const BASE = process.env.BASE ?? 'http://127.0.0.1:3000'
const OUT = 'shots'

mkdirSync(OUT, { recursive: true })

const browser = await chromium.launch()
const problems = []

async function shoot(page, name, path, { fullPage = false } = {}) {
  const errors = []
  const onConsole = (msg) => {
    if (msg.type() === 'error') errors.push(msg.text())
  }
  const onFailed = (req) => errors.push(`request failed: ${req.url()}`)
  page.on('console', onConsole)
  page.on('requestfailed', onFailed)

  const res = await page.goto(BASE + path, { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)
  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage })

  page.off('console', onConsole)
  page.off('requestfailed', onFailed)

  const status = res.status()
  console.log(`${path} -> ${status}  ${name}.png`)
  if (status !== 200) problems.push(`${path} returned ${status}`)
  for (const e of errors) problems.push(`${path}: ${e}`)
  return status
}

const desktop = await browser.newPage({ viewport: { width: 1440, height: 950 } })

// Grab a real article URL off the front page rather than guessing the slug.
await desktop.goto(BASE + '/', { waitUntil: 'domcontentloaded' })
const articlePath = await desktop.getAttribute('a[href^="/article/"]', 'href')

const pages = [
  { name: 'home-fold', path: '/' },
  { name: 'home', path: '/', fullPage: true },
  { name: 'section-hot', path: '/hot', fullPage: true },
  { name: 'section-opinion', path: '/opinion' },
  { name: 'section-live', path: '/live' },
  { name: 'article-fold', path: articlePath },
  { name: 'article', path: articlePath, fullPage: true },
  { name: 'search', path: '/search?q=trump', fullPage: true },
  { name: 'about', path: '/about', fullPage: true },
  { name: 'help', path: '/help' },
]

for (const p of pages) {
  await shoot(desktop, p.name, p.path, { fullPage: p.fullPage })
}

/* Typography / palette sanity check on the front page. */
await desktop.goto(BASE + '/', { waitUntil: 'networkidle' })
await desktop.evaluate(() => document.fonts.ready)
const report = await desktop.evaluate(() => {
  const pick = (sel) => {
    const el = document.querySelector(sel)
    if (!el) return null
    const s = getComputedStyle(el)
    return { font: s.fontFamily, size: s.fontSize, weight: s.fontWeight, color: s.color }
  }
  return {
    wordmark: pick('.st-wordmark'),
    leadHeadline: pick('h1.headline'),
    body: (() => {
      const s = getComputedStyle(document.body)
      return { font: s.fontFamily, bg: s.backgroundColor, color: s.color }
    })(),
    accent: getComputedStyle(document.documentElement).getPropertyValue('--accent').trim(),
    loadedFaces: [...document.fonts].map((f) => `${f.family} ${f.style} ${f.weight} ${f.status}`),
  }
})

const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } })
await shoot(mobile, 'home-mobile-fold', '/')
await shoot(mobile, 'home-mobile', '/', { fullPage: true })
await shoot(mobile, 'article-mobile-fold', articlePath)
await shoot(mobile, 'article-mobile', articlePath, { fullPage: true })

await browser.close()

console.log('\n--- typography ---')
console.log('wordmark     ', report.wordmark)
console.log('lead headline', report.leadHeadline)
console.log('body         ', report.body)
console.log('--accent     ', report.accent)
console.log('font faces   ', report.loadedFaces.join(' | ') || '(none)')

console.log('\n--- problems ---')
console.log(problems.length ? problems.join('\n') : 'none')
