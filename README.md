# rvnu. — website

Single-page static landing site for **rvnu**, a B2B marketing intelligence agency
based in Riyadh, Saudi Arabia. The name is short for *revenue*.

> *Sustainable Growth.*

## Stack

Pure static — no build step.

- `index.html` — page markup and copy
- `styles.css` — brand tokens, layout, components
- `script.js` — sticky-header scroll state, mobile nav, year stamp
- `assets/` — logo SVGs (wordmark + submark + favicon)
- `brand/fonts/` — self-hosted brand fonts (see `brand/fonts/README.md`)
- Type: **Season Sans TRIAL** (sans) + **Cormorant SemiBoldItalic** (italic
  accent) — self-hosted, with Inter / Georgia fallbacks.

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

- `--font-sans`  → `Season Sans TRIAL` (Regular 400 · Medium 500 · SemiBold 600)
- `--font-serif` → `Cormorant` SemiBoldItalic (italic only — used as the brand's
  signature accent on words like *Growth*, *Grow*, *Sales*, *expertise*)

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

All copy lives directly in `index.html`. Wrap any word in
`<span class="serif-italic">…</span>` to apply the brand's italic-serif accent.

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
