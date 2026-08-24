# Alma Shriq News (ASN)

A daily tabloid front page built with Next.js — world, business, technology,
sport and culture, set flat and loud in the 2015 tradition: red masthead slab,
hard rules, clean type on white.

## Development

```bash
npm install
npm run dev
```

## Design system

Tokens live in `src/app/globals.css` as CSS custom properties, with a matching
Tailwind palette under the `asn` namespace in `tailwind.config.ts`.

- **Ink** `#111111` on paper `#ffffff`, with flat grey `#f4f4f4` surfaces
- **House red** `#c8102e` carries the masthead slab, the medallion, links,
  kickers, section tabs and live furniture; `#9c0a22` is its deep shade
- **Ink slabs** carry the utility rail and the footer
- Square corners, hard hairline rules, no gradients and no soft shadows

The mark is a red medallion — a white rising sun over a horizon rule inside a
thin white ring. "Al Mashriq" is the East, the place of sunrise, so the symbol
is the name.

Typography is self-hosted from `src/fonts` and wired up in `src/app/layout.tsx`:

| Role | Face | CSS variable |
| --- | --- | --- |
| Masthead, headlines, decks, navigation, meta, forms | Libre Franklin | `--font-ui` |
| Article body and long-form prose | Source Serif 4 | `--font-editorial` |

## Brand assets

The ASN monogram, favicon, app icons, social card, wordmark and web manifest are
all generated from real Libre Franklin outlines, so they render identically
without the webfont loaded:

```bash
npm run brand
```

## Review screenshots

With the dev server running, capture every template at desktop and mobile
widths, plus a typography and console-error report:

```bash
node scripts/shots.mjs
```
