# Alma Shriq News (ASN)

A modern daily news front page built with Next.js — world, business, technology,
sport and culture, set in clean type on white.

## Development

```bash
npm install
npm run dev
```

## Design system

Tokens live in `src/app/globals.css` as CSS custom properties, with a matching
Tailwind palette under the `asn` namespace in `tailwind.config.ts`.

- **Ink** `#0f1419` on paper `#ffffff`, with cool grey `#f6f7f9` surfaces
- **House red** `#c8102e` for the mark, kickers, links, section tabs and live furniture
- **Ink slabs** carry the utility rail and the footer
- Soft radii (`4–10px`, pill chips), light hairline rules and low-contrast shadows

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
