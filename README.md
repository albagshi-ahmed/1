# rvnu. — website

Single-page static landing site for **rvnu**, a growth agency (وكالة نمو)
based in Riyadh, Saudi Arabia. The name is short for *revenue*.

> *Sustainable Growth.*

rvnu is not a marketing agency — it's a scientific system that turns growth
from lucky strikes into disciplined, compounding knowledge.

## Stack

Pure static — no build step.

- `index.html` — English landing page (EN, LTR)
- `ar.html` — Arabic parallel page (AR, RTL)
- `brand.html` — public brand styleguide (one-liner, pillars, rvnu circle,
  color, type, downloads)
- `styles.css` — brand tokens, layout, components, RTL overrides, brand-page
  specimens
- `script.js` — sticky-header scroll state, mobile nav, year stamp
- `assets/` — logo SVGs (wordmark + submark + favicon)
- `brand/` — official brand assets:
  - `rvnu-visual-identity-2026.pdf` — 53-page visual identity guide (from the brand designer)
  - `social/` — 11 social media template layouts (JPG)
  - `reports/` — 5 report template layouts (JPG)
  - `fonts/` — self-hosted brand fonts (see `brand/fonts/README.md`)
- Type: **Season Sans TRIAL** (Latin) + **Cormorant SemiBoldItalic** (italic
  accent) + **Expo Arabic** (Arabic), all self-hosted with system fallbacks.

## Run locally

Just open `index.html` in a browser, or serve it with anything:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploy

Static — drop the folder on any host:

- **GitHub Pages** — settings → Pages → deploy from this branch, root.
- **Netlify / Vercel** — drag-and-drop the folder, or connect the repo (no build
  command, publish directory `/`).
- **S3 / Cloudflare Pages** — same.

## Brand tokens (in `styles.css`)

| Token        | Value     | Use                       |
|--------------|-----------|---------------------------|
| `--cream`    | `#F2F0E9` | Page background           |
| `--paper`    | `#FFFFFF` | Card surfaces             |
| `--ink`      | `#0A0A0A` | Body text, primary button |
| `--orange`   | `#F26B2A` | Primary accent, CTA wave  |
| `--navy`     | `#1F2D70` | Deep accent               |
| `--yellow`   | `#ECEB1F` | Highlight accent          |
| `--lavender` | `#BCAEE6` | Soft accent               |
| `--green`    | `#5BBF74` | Status / location pill    |

Typography:

- `--font-sans`   → `Season Sans TRIAL` (Regular 400 · Medium 500 · SemiBold 600)
- `--font-serif`  → `Cormorant` SemiBoldItalic (italic only — used as the brand's
  signature accent on words like *Growth*, *Grow*, *Sales*, *expertise*)
- `--font-arabic` → `Expo Arabic` (Light 300 · Medium 500) — applied on
  `html[lang="ar"]` via a scoped override block near the bottom of `styles.css`

Font files are self-hosted from `brand/fonts/`. If that folder is empty the
site falls back to Inter / Georgia via the CSS stack. See
[`brand/fonts/README.md`](brand/fonts/README.md) for the list of required TTFs.

Hierarchy in use (matches the PDF/deck system):

| Slot                          | Face  | Weight |
|-------------------------------|-------|--------|
| Hero / section headline       | SS    | 600    |
| Accent words (*Growth* …)     | Cormorant | 600 italic |
| Card titles                   | SS    | 500    |
| Hero KPI number               | SS    | 600    |
| Uppercase label / eyebrow     | SS    | 600    |
| Body / observations           | SS    | 400    |
| Chrome / metadata / copyright | SS    | 400    |

## Editing copy

Copy lives directly in `index.html` (English) and `ar.html` (Arabic). Wrap
any word in `<span class="serif-italic">…</span>` to apply the brand's
italic-serif accent — in Arabic this still renders as Expo Arabic, so the
accent reads as a semantic pivot word rather than an italic swap.

When editing, keep the never-say / always-say rules from `/brand`:

- **Never say**: "marketing agency", "ads agency", "creative studio",
  "marketing intelligence agency".
- **Always say**: growth agency / وكالة نمو — a scientific system for
  sustainable growth.

## Bilingual model

- `index.html` is English (LTR); `ar.html` is Arabic (RTL).
- Language toggle (`ع` / `EN`) lives in each header; a full "العربية" /
  "English" link is in the mobile nav.
- Per brand policy the two are **parallel experiences**, not translations —
  both must stay in sync when copy changes.

## Brand styleguide

`brand.html` is the public brand reference, with the one-liner, never-say /
always-say block, three pillars, the rvnu circle (spend → activity →
acquisition → purchase → spend), color palette, type specimens, department
list, and download cards. Drop `rvnu-brand-guidelines.pdf` and
`rvnu-brand-assets.zip` into `brand/` to activate the downloads.

## Swapping in the official logo

The wordmark and submark in `assets/` are SVG reconstructions traced from the
identity screenshots — geometric, theme-able via `currentColor`, and good enough
to ship. To replace with the official vectors:

1. Drop the official `.svg` into `assets/`.
2. Either rename it to `logo-rvnu.svg` (no other change needed), or update the
   inline `<svg>` in `index.html` (header + footer) to `<img src="…">`.

## Updating the primary CTA

Both CTAs currently open an email draft to `albagshi@revenueagency.net`. To swap
to a Calendly (or any other) link, edit two lines in `index.html`:

```html
<a class="btn btn-primary" href="mailto:albagshi@revenueagency.net?…">Book a call</a>
<a class="btn btn-on-dark" href="mailto:albagshi@revenueagency.net?…">Book a call</a>
```

Replace the `href` with `https://calendly.com/your-link` (or similar).

## Browser support

Modern evergreen browsers. Uses `color-mix()` and `backdrop-filter`; older
browsers degrade gracefully (the page just looks slightly less polished).

## License

© 2026 rvnu. All rights reserved.
