import { chromium } from 'playwright'

const BASE = 'http://127.0.0.1:3000'

const slugs = [
  '/opinion',
  '/live',
  '/culture',
]

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1280, height: 1000 } })

for (const path of slugs) {
  const res = await page.goto(BASE + path, { waitUntil: 'networkidle' })
  console.log(`${path} -> ${res.status()}`)
}

// Walk every article link off the front page and confirm each resolves.
await page.goto(BASE + '/', { waitUntil: 'networkidle' })
const hrefs = await page.$$eval('a[href^="/article/"]', (as) => [
  ...new Set(as.map((a) => a.getAttribute('href'))),
])
console.log(`front page article links: ${hrefs.length}`)

let bad = 0
for (const href of hrefs) {
  const res = await page.goto(BASE + href, { waitUntil: 'domcontentloaded' })
  const notFound = await page.locator('h1', { hasText: 'Article not found' }).count()
  if (res.status() !== 200 || notFound > 0) {
    console.log(`  BROKEN ${res.status()} ${href}`)
    bad++
  }
}
console.log(bad === 0 ? 'all article links OK' : `${bad} broken`)

// Confirm every image on the front page actually loaded.
await page.goto(BASE + '/', { waitUntil: 'networkidle' })
const brokenImgs = await page.$$eval('img', (imgs) =>
  imgs.filter((i) => !i.complete || i.naturalWidth === 0).map((i) => i.getAttribute('src'))
)
console.log('broken images:', brokenImgs.length ? brokenImgs : 'none')

await browser.close()
