// Generate every Alma Shriq News brand asset from real Libre Franklin outlines.
//
//   node scripts/generate-brand.mjs
//
// Writes: public/logo.svg, public/favicon.svg, public/logo.png,
//         public/apple-icon.png, public/icon-192.png, public/icon-512.png,
//         public/favicon.ico, public/og-image.png, public/wordmark.svg,
//         public/site.webmanifest, src/lib/brand-mark.ts
//
// The mark is a flat red medallion — a white rising sun and horizon inside a
// thin white ring — in the New York Post tradition of a loud red badge.
// "Al Mashriq" is the East, the place of sunrise, so the symbol is the name.
//
// Glyphs are converted to vector paths rather than left as <text>, so the
// wordmark and monogram render identically in browsers, rasterisers and
// anywhere the SVG is used without the webfont loaded.
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import https from 'node:https'
import opentype from 'opentype.js'
import sharp from 'sharp'
import pngToIco from 'png-to-ico'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const publicDir = resolve(root, 'public')
const cacheDir = resolve(__dirname, '.cache')

const FONT_URL =
  'https://cdn.jsdelivr.net/npm/@fontsource/libre-franklin@4.5.11/files/libre-franklin-latin-900-normal.woff'
const FONT_CACHE = resolve(cacheDir, 'libre-franklin-900.woff')

const RED = '#c8102e'
const RED_DEEP = '#9c0a22'
const INK = '#111111'
const PAPER = '#ffffff'

const NAME = 'ALMA SHRIQ NEWS'
const TAGLINE = 'INDEPENDENT REPORTING \u00b7 UPDATED HOURLY'
const SECTIONS = 'WORLD \u00b7 BUSINESS \u00b7 TECHNOLOGY \u00b7 SPORT \u00b7 CULTURE'

function download(url) {
  return new Promise((res, rej) => {
    https
      .get(url, { headers: { 'user-agent': 'Mozilla/5.0' } }, (r) => {
        if (r.statusCode >= 300 && r.statusCode < 400 && r.headers.location) {
          return download(r.headers.location).then(res, rej)
        }
        if (r.statusCode !== 200) return rej(new Error(`${url} -> ${r.statusCode}`))
        const chunks = []
        r.on('data', (d) => chunks.push(d))
        r.on('end', () => res(Buffer.concat(chunks)))
      })
      .on('error', rej)
  })
}

async function loadFont() {
  await mkdir(cacheDir, { recursive: true })
  if (!existsSync(FONT_CACHE)) {
    const buf = await download(FONT_URL)
    await writeFile(FONT_CACHE, buf)
    console.log(`Cached font (${buf.length} bytes)`)
  }
  const buf = await readFile(FONT_CACHE)
  return opentype.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength))
}

/**
 * Lay out `text` as SVG path data, scaled so its inked bounding box exactly
 * fills the requested box, then centred on (cx, cy).
 *
 * The path data is serialised by hand: opentype's own `toPathData` applies a
 * y-flip against a recomputed bounding box, which corrupts already-transformed
 * coordinates.
 */
function glyphPath(font, text, { height, width, cx, cy, letterSpacing = 0 }) {
  const unitSize = 1000
  const path = font.getPath(text, 0, 0, unitSize, { letterSpacing })
  const bb = path.getBoundingBox()
  const bw = bb.x2 - bb.x1
  const bh = bb.y2 - bb.y1

  let scale
  if (height != null && width != null) scale = Math.min(height / bh, width / bw)
  else if (height != null) scale = height / bh
  else scale = width / bw

  const dx = cx - (bb.x1 + bw / 2) * scale
  const dy = cy - (bb.y1 + bh / 2) * scale

  const px = (v) => Number((v * scale + dx).toFixed(2))
  const py = (v) => Number((v * scale + dy).toFixed(2))

  const parts = []
  for (const c of path.commands) {
    switch (c.type) {
      case 'M':
        parts.push(`M${px(c.x)} ${py(c.y)}`)
        break
      case 'L':
        parts.push(`L${px(c.x)} ${py(c.y)}`)
        break
      case 'Q':
        parts.push(`Q${px(c.x1)} ${py(c.y1)} ${px(c.x)} ${py(c.y)}`)
        break
      case 'C':
        parts.push(
          `C${px(c.x1)} ${py(c.y1)} ${px(c.x2)} ${py(c.y2)} ${px(c.x)} ${py(c.y)}`
        )
        break
      case 'Z':
        parts.push('Z')
        break
      default:
        throw new Error(`Unhandled path command: ${c.type}`)
    }
  }

  const d = parts.join('')
  if (d.includes('NaN')) throw new Error(`Glyph path for "${text}" produced NaN`)

  return { d, width: bw * scale, height: bh * scale }
}

const font = await loadFont()

/* ------------------------------------------------------------------
   1. The mark — a red medallion. White sun rising over a white
   horizon rule, five tapered rays, all held inside a thin white
   ring on a flat red disc.

   Geometry is expressed as fractions of the grid so every size is
   the same drawing. Below ~64px the ring and rays vanish into
   pixels, so the small variant drops them, grows the sun and
   thickens the horizon.
   ------------------------------------------------------------------ */

const MARK = {
  large: {
    ring: { r: 0.425, stroke: 0.026 },
    sunR: 0.2,
    horizonY: 0.585,
    horizonHalf: 0.365,
    horizonH: 0.027,
    rays: { inner: 0.27, outer: 0.375, halfIn: 5, halfOut: 2.5 },
  },
  small: {
    ring: null,
    sunR: 0.3,
    horizonY: 0.6,
    horizonHalf: 0.39,
    horizonH: 0.07,
    rays: null,
  },
}

const RAY_ANGLES = [157.5, 123.75, 90, 56.25, 22.5]

/** One tapered ray as a polygon, angles in degrees above the horizon. */
function rayPath(cx, cy, angleDeg, r1, r2, halfIn, halfOut) {
  const rad = (d) => (d * Math.PI) / 180
  const pt = (r, deg) =>
    `${Number((cx + r * Math.cos(rad(deg))).toFixed(2))} ${Number((cy - r * Math.sin(rad(deg))).toFixed(2))}`
  return `M${pt(r1, angleDeg - halfIn)}L${pt(r2, angleDeg - halfOut)}L${pt(r2, angleDeg + halfOut)}L${pt(r1, angleDeg + halfIn)}Z`
}

/** Sun half-disc plus rays as one path, on a `size`-unit grid. */
function sunPath(size, m) {
  const cx = size / 2
  const cy = size * m.horizonY
  const r = size * m.sunR
  const n = (v) => Number(v.toFixed(2))
  let d = `M${n(cx - r)} ${n(cy)}A${n(r)} ${n(r)} 0 0 1 ${n(cx + r)} ${n(cy)}Z`
  if (m.rays) {
    for (const a of RAY_ANGLES) {
      d += rayPath(cx, cy, a, size * m.rays.inner, size * m.rays.outer, m.rays.halfIn, m.rays.halfOut)
    }
  }
  return d
}

/** Horizon bar geometry on a `size`-unit grid. */
function horizonRect(size, m) {
  const n = (v) => Number(v.toFixed(2))
  return {
    x: n(size / 2 - size * m.horizonHalf),
    y: n(size * m.horizonY),
    width: n(size * m.horizonHalf * 2),
    height: n(size * m.horizonH),
  }
}

/** Disc, ring, sun and horizon as bare markup, ready to inline at any size. */
function markBody({ size, small = false, field = RED, detail = PAPER, square = false }) {
  const m = small ? MARK.small : MARK.large
  const n = (v) => Number(v.toFixed(2))
  const h = horizonRect(size, m)
  const parts = []
  if (square) {
    parts.push(`<rect width="${size}" height="${size}" fill="${field}"/>`)
  } else {
    parts.push(`<circle cx="${n(size / 2)}" cy="${n(size / 2)}" r="${n(size / 2)}" fill="${field}"/>`)
  }
  if (m.ring) {
    parts.push(
      `<circle cx="${n(size / 2)}" cy="${n(size / 2)}" r="${n(size * m.ring.r)}" fill="none" stroke="${detail}" stroke-width="${n(size * m.ring.stroke)}"/>`
    )
  }
  parts.push(`<path d="${sunPath(size, m)}" fill="${detail}"/>`)
  parts.push(
    `<rect x="${h.x}" y="${h.y}" width="${h.width}" height="${h.height}" fill="${detail}"/>`
  )
  return parts.join('\n  ')
}

function markSvg({ size, small = false, field = RED, detail = PAPER, square = false }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" role="img" aria-label="${NAME}">
  ${markBody({ size, small, field, detail, square })}
</svg>
`
}

const logoSvg = markSvg({ size: 512 })

/* The red disc holds its own on light and dark chrome, so one drawing
   serves every favicon. */
const faviconSvg = markSvg({ size: 64, small: true })

await writeFile(resolve(publicDir, 'logo.svg'), logoSvg)
console.log('Wrote public/logo.svg')
await writeFile(resolve(publicDir, 'favicon.svg'), faviconSvg)
console.log('Wrote public/favicon.svg')

/* ------------------------------------------------------------------
   2. Raster icons
   ------------------------------------------------------------------ */

const logoPng = await sharp(Buffer.from(logoSvg)).resize(512, 512).png().toBuffer()
await writeFile(resolve(publicDir, 'logo.png'), logoPng)
console.log('Wrote public/logo.png')

/* iOS rounds the home-screen icon itself, so this one ships square. */
const appleSvg = markSvg({ size: 180, square: true })
const applePng = await sharp(Buffer.from(appleSvg)).resize(180, 180).png().toBuffer()
await writeFile(resolve(publicDir, 'apple-icon.png'), applePng)
console.log('Wrote public/apple-icon.png')

for (const size of [192, 512]) {
  const png = await sharp(Buffer.from(logoSvg)).resize(size, size).png().toBuffer()
  await writeFile(resolve(publicDir, `icon-${size}.png`), png)
  console.log(`Wrote public/icon-${size}.png`)
}

const icoSizes = [16, 32, 48, 64]
const icoPngs = await Promise.all(
  icoSizes.map((size) =>
    sharp(Buffer.from(faviconSvg)).resize(size, size).png().toBuffer()
  )
)
const ico = await pngToIco(icoPngs)
await writeFile(resolve(publicDir, 'favicon.ico'), ico)
console.log(`Wrote public/favicon.ico (${ico.length} bytes) sizes: ${icoSizes.join(', ')}`)

/* ------------------------------------------------------------------
   3. Social card — the medallion and white wordmark on a full red
   field, front-page style.
   ------------------------------------------------------------------ */

const OG_W = 1200
const OG_H = 630
const MEDAL = 148
const ogWordmark = glyphPath(font, NAME, {
  width: 980,
  height: 100,
  cx: OG_W / 2,
  cy: 372,
  letterSpacing: -0.03,
})
const ogTagline = glyphPath(font, TAGLINE, {
  width: 660,
  height: 19,
  cx: OG_W / 2,
  cy: 468,
  letterSpacing: 0.14,
})
const ogSections = glyphPath(font, SECTIONS, {
  width: 780,
  height: 19,
  cx: OG_W / 2,
  cy: 552,
  letterSpacing: 0.12,
})

const ogSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${OG_W}" height="${OG_H}" viewBox="0 0 ${OG_W} ${OG_H}">
  <rect width="${OG_W}" height="${OG_H}" fill="${RED}"/>
  <rect x="0" y="0" width="${OG_W}" height="12" fill="${INK}"/>
  <rect x="0" y="${OG_H - 12}" width="${OG_W}" height="12" fill="${INK}"/>
  <g transform="translate(${(OG_W - MEDAL) / 2},${188 - MEDAL / 2})">
  ${markBody({ size: MEDAL, field: RED_DEEP, detail: PAPER })}
  </g>
  <path d="${ogWordmark.d}" fill="${PAPER}"/>
  <rect x="300" y="${506}" width="${OG_W - 600}" height="2" fill="${RED_DEEP}"/>
  <path d="${ogTagline.d}" fill="#f3c9d0"/>
  <path d="${ogSections.d}" fill="${PAPER}"/>
</svg>
`

const ogPng = await sharp(Buffer.from(ogSvg)).png().toBuffer()
await writeFile(resolve(publicDir, 'og-image.png'), ogPng)
console.log('Wrote public/og-image.png')

/* ------------------------------------------------------------------
   4. Wordmark SVG, for anywhere the webfont cannot be relied on.
   ------------------------------------------------------------------ */

const markW = 720
const markH = 96
const flat = glyphPath(font, NAME, {
  width: markW - 24,
  height: markH - 34,
  cx: markW / 2,
  cy: markH / 2,
  letterSpacing: -0.03,
})
await writeFile(
  resolve(publicDir, 'wordmark.svg'),
  `<svg xmlns="http://www.w3.org/2000/svg" width="${markW}" height="${markH}" viewBox="0 0 ${markW} ${markH}" role="img" aria-label="${NAME}">
  <path d="${flat.d}" fill="${INK}"/>
</svg>
`
)
console.log('Wrote public/wordmark.svg')

/* ------------------------------------------------------------------
   5. Web app manifest
   ------------------------------------------------------------------ */

await writeFile(
  resolve(publicDir, 'site.webmanifest'),
  JSON.stringify(
    {
      name: 'Alma Shriq News',
      short_name: 'ASN',
      description:
        'Alma Shriq News (ASN) is an independent newsroom covering world politics, business, technology, sport and culture.',
      start_url: '/',
      display: 'standalone',
      background_color: PAPER,
      theme_color: RED,
      icons: [
        { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
        { src: '/logo.svg', sizes: 'any', type: 'image/svg+xml' },
      ],
    },
    null,
    2
  ) + '\n'
)
console.log('Wrote public/site.webmanifest')

/* ------------------------------------------------------------------
   6. Mark geometry for the app, so the header medallion is the same
   drawing as public/logo.svg without costing a request.
   ------------------------------------------------------------------ */

const G = 512
const n = (v) => Number(v.toFixed(2))
const gh = horizonRect(G, MARK.large)
await writeFile(
  resolve(root, 'src/lib/brand-mark.ts'),
  `// Generated by scripts/generate-brand.mjs — run \`npm run brand\` to update.
//
// The red medallion: white rising sun, horizon rule and thin ring on a
// ${G}-unit grid. Drawn inline by <BrandMark> so the masthead medallion
// matches public/logo.svg exactly.
export const MARK_GRID = ${G}
export const MARK_RING = {
  r: ${n(G * MARK.large.ring.r)},
  stroke: ${n(G * MARK.large.ring.stroke)},
}
export const MARK_SUN =
  '${sunPath(G, MARK.large)}'
export const MARK_HORIZON = {
  x: ${gh.x},
  y: ${gh.y},
  width: ${gh.width},
  height: ${gh.height},
}
`
)
console.log('Wrote src/lib/brand-mark.ts')
