# Chayka — Ghost theme

Sailing-journal theme built from the 1A direction: **Raceway** wordmark, **Golos Text** headings/UI, **Lora** body, **IBM Plex Mono** meta.

## Install

1. Zip the `chayka` folder (the zip must contain `package.json` at its root).
2. Ghost admin → **Settings → Design → Change theme → Upload theme**.
3. Activate.

## Site setup

- **Settings → General → Publication cover** — the home hero photo (parallax, `background-attachment: fixed`). Use ≥2000px wide.
- **Publication description** — renders as the hero eyebrow above the wordmark.
- **Publication language** — drives `<html lang>` and the Remark42 comments locale.
- **Navigation → Primary** — the navy top bar. **Secondary** — the footer row.
- **Design → theme settings → Hero height** — `tall` (default) or `short`, for a lower-profile home/page hero.
- Post **feature image** becomes the article hero; the title, tag and date sit on top of it.
- Posts without a feature image still work: the hero collapses to navy, cards fall back to a striped placeholder.
- A missing page renders a branded, translated 404 (`error-404.hbs`) instead of Ghost's default English one.

## Comments (Remark42)

`post.hbs` mounts `#remark42` and inline-configures the embed — host, site ID, theme colors, and `locale` from the publication language. Point `remark_config.host` / `site_id` in `post.hbs` at your own instance. If Ghost Admin → **Code injection** still has a Remark42 snippet in the footer from before this was templated, clear it, or the embed loads twice.

## Image zoom

Koenig gallery and single-image cards get a dependency-free click-to-zoom lightbox (`assets/js/lightbox.js`, wired up in `default.hbs`): it opens the largest `srcset` candidate, shows the card's `figcaption` as a caption, and supports Esc / ←→ / swipe navigation between shots in the same gallery. Standalone portrait image cards are excluded — they already render large at full column width — but a portrait shot inside a multi-photo gallery row still zooms, since the row can shrink it well below full size.

## Colors

| token | value | use |
|---|---|---|
| paper | `#F5F0E6` | page background |
| navy | `#22293D` | bar, footer, scrims |
| sea | `#135372` | links |
| brass | `#8D5E00` | tags, eyebrows, outline buttons |
| brass light | `#F5E3C0`-ish (`oklch(0.95 0.06 82)`) | accents on photos |

All in `assets/css/screen.css` under `:root` — change them there.

## Fonts

All self-hosted as `.woff2` in `assets/fonts/` (cyrillic-ext/cyrillic/latin-ext/latin subsets each) — no Google Fonts `<link>` or preconnect at runtime.

- Golos Text, Lora (regular + italic), IBM Plex Mono — Google Fonts, OFL-licensed; the license text ships alongside each family in `assets/fonts/`.
- Raceway (wordmark only) is licensed via Adobe Fonts / Type Network, not OFL. Check your license covers self-hosting `raceway.woff2` as shipped, or replace its `@font-face` with an Adobe Fonts web-project `<link>` in `default.hbs`.

## Templates

```
default.hbs      bar + footer shell, loads screen.css and lightbox.js
index.hbs        home: hero, lede post, 2 photo cards, dated list
post.hbs         article: photo hero, prose, tags, author, Remark42 comments, prev/next
page.hbs         static pages
tag.hbs          tag archive
author.hbs       author archive
error-404.hbs    branded not-found page
locales/ru.json  translations for Ghost's built-in nav/pagination/reading-time strings
```

Navigation and pagination use Ghost's default markup and helpers (`{{navigation}}`, `{{pagination}}`) rather than theme partials, translated via `locales/ru.json`.

`posts_per_page` is 9 (1 lede + 2 cards + 6 rows). Change it in `package.json`.
