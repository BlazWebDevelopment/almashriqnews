// Generate every Alma Shriq News brand asset from real Libre Franklin outlines.
//
//   node scripts/generate-brand.mjs
//
// Writes: public/logo.svg, public/favicon.svg, public/logo.png,
//         public/apple-icon.png, public/icon-192.png, public/icon-512.png,
//         public/favicon.ico, public/og-image.png, public/wordmark.svg,
//         public/site.webmanifest, src/lib/brand-mark.ts
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
  'https://cdn.jsdelivr.net/npm/@fontsource/libre-franklin@4.5.11/files/libre-franklin-latin-800-normal.woff'
const FONT_CACHE = resolve(cacheDir, 'libre-franklin-800.woff')

const RED = '#c8102e'
const INK = '#0f1419'
const PAPER = '#ffffff'
const HAIRLINE = '#dfe3e9'
const MUTED = '#6b7480'

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
   1. The mark — a red sun rising over a paper horizon rule, on a
   rounded ink tile. "Al Mashriq" is the East, the place of sunrise,
   so the symbol is the name.

   Geometry is expressed as fractions of the tile so every size is the
   same drawing. The large mark carries five tapered rays; below ~64px
   the rays vanish into pixels, so the small variant drops them, grows
   the sun and thickens the horizon.
   ------------------------------------------------------------------ */

const MARK = {
  large: {
    sunR: 0.26,
    horizonY: 0.635,
    horizonX: 0.14,
    horizonH: 0.03,
    rays: { inner: 0.335, outer: 0.42, halfIn: 4.5, halfOut: 2.25 },
  },
  small: {
    sunR: 0.32,
    horizonY: 0.6,
    horizonX: 0.08,
    horizonH: 0.075,
    rays: null,
  },
}
/* Rounded tile: reads as a modern app mark instead of a stamp. */
const RADIUS_RATIO = 0.1875

const RAY_ANGLES = [157.5, 123.75, 90, 56.25, 22.5]

/** One tapered ray as a polygon, angles in degrees above the horizon. */
function rayPath(cx, cy, angleDeg, r1, r2, halfIn, halfOut) {
  const rad = (d) => (d * Math.PI) / 180
  const pt = (r, deg) =>
    `${Number((cx + r * Math.cos(rad(deg))).toFixed(2))} ${Number((cy - r * Math.sin(rad(deg))).toFixed(2))}`
  return `M${pt(r1, angleDeg - halfIn)}L${pt(r2, angleDeg - halfOut)}L${pt(r2, angleDeg + halfOut)}L${pt(r1, angleDeg + halfIn)}Z`
}

/** Sun disc plus rays as one path, on a `size`-unit grid. */
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

/** Tile, sun and horizon as bare markup, ready to inline at any size. */
function markBody({ size, small = false, field, horizon, sun, radiusRatio = RADIUS_RATIO }) {
  const m = small ? MARK.small : MARK.large
  const n = (v) => Number(v.toFixed(2))
  const r = n(size * radiusRatio)
  return [
    `<rect width="${size}" height="${size}" rx="${r}" ry="${r}" fill="${field}"/>`,
    `<path d="${sunPath(size, m)}" fill="${sun}"/>`,
    `<rect class="h" x="${n(size * m.horizonX)}" y="${n(size * m.horizonY)}" width="${n(size * (1 - 2 * m.horizonX))}" height="${n(size * m.horizonH)}" fill="${horizon}"/>`,
  ].join('\n  ')
}

function markSvg({
  size,
  small = false,
  field = INK,
  horizon = PAPER,
  sun = RED,
  radiusRatio = RADIUS_RATIO,
  style = '',
}) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" role="img" aria-label="${NAME}">
  ${style}${markBody({ size, small, field, horizon, sun, radiusRatio })}
</svg>
`
}

const logoSvg = markSvg({ size: 512 })

/*
 * The SVG favicon flips to a paper tile in dark chrome: an ink tile on a dark
 * tab strip loses its edges. Rasterisers ignore the media query and keep the
 * light drawing, which is exactly what the .ico wants.
 */
const faviconSvg = markSvg({
  size: 64,
  small: true,
  field: 'currentColor',
  horizon: PAPER,
  sun: RED,
  style: `<style>
    svg { color: ${INK} }
    @media (prefers-color-scheme: dark) { svg { color: ${PAPER} } .h { fill: ${INK} } }
  </style>
  `,
})

/* Same drawing with flat fills, for anything that rasterises. */
const faviconRasterSvg = markSvg({ size: 64, small: true })

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
const appleSvg = markSvg({ size: 180, radiusRatio: 0 })
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
    sharp(Buffer.from(faviconRasterSvg)).resize(size, size).png().toBuffer()
  )
)
const ico = await pngToIco(icoPngs)
await writeFile(resolve(publicDir, 'favicon.ico'), ico)
console.log(`Wrote public/favicon.ico (${ico.length} bytes) sizes: ${icoSizes.join(', ')}`)

/* ------------------------------------------------------------------
   3. Social card — the lockup on paper, between brand rules.
   ------------------------------------------------------------------ */

const OG_W = 1200
const OG_H = 630
const TILE = 132
const ogWordmark = glyphPath(font, NAME, {
  width: 960,
  height: 96,
  cx: OG_W / 2,
  cy: 360,
  letterSpacing: -0.018,
})
const ogTagline = glyphPath(font, TAGLINE, {
  width: 700,
  height: 20,
  cx: OG_W / 2,
  cy: 455,
  letterSpacing: 0.14,
})
const ogSections = glyphPath(font, SECTIONS, {
  width: 820,
  height: 20,
  cx: OG_W / 2,
  cy: 540,
  letterSpacing: 0.12,
})

const ogSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${OG_W}" height="${OG_H}" viewBox="0 0 ${OG_W} ${OG_H}">
  <rect width="${OG_W}" height="${OG_H}" fill="${PAPER}"/>
  <rect x="0" y="0" width="${OG_W}" height="14" fill="${RED}"/>
  <rect x="0" y="${OG_H - 14}" width="${OG_W}" height="14" fill="${INK}"/>
  <g transform="translate(${(OG_W - TILE) / 2},${196 - TILE / 2})">
  ${markBody({ size: TILE, field: INK, horizon: PAPER, sun: RED })}
  </g>
  <path d="${ogWordmark.d}" fill="${INK}"/>
  <rect x="290" y="${492}" width="${OG_W - 580}" height="1" fill="${HAIRLINE}"/>
  <path d="${ogTagline.d}" fill="${MUTED}"/>
  <path d="${ogSections.d}" fill="${RED}"/>
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
  letterSpacing: -0.018,
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
   6. Mark geometry for the app, so the header tile is the same drawing
   as public/logo.svg without costing a request. The outlines live here
   rather than in the component because they come out of the font.
   ------------------------------------------------------------------ */

const G = 512
const n = (v) => Number(v.toFixed(2))
await writeFile(
  resolve(root, 'src/lib/brand-mark.ts'),
  `// Generated by scripts/generate-brand.mjs — run \`npm run brand\` to update.
//
// The rising sun over its horizon rule, on a ${G}-unit grid. Drawn inline by
// <BrandMark> so the masthead tile matches public/logo.svg exactly.
export const MARK_GRID = ${G}
export const MARK_RADIUS = ${n(G * RADIUS_RATIO)}
export const MARK_SUN =
  '${sunPath(G, MARK.large)}'
export const MARK_HORIZON = {
  x: ${n(G * MARK.large.horizonX)},
  y: ${n(G * MARK.large.horizonY)},
  width: ${n(G * (1 - 2 * MARK.large.horizonX))},
  height: ${n(G * MARK.large.horizonH)},
}
`
)
console.log('Wrote src/lib/brand-mark.ts')
