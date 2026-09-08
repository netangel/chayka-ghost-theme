# Chayka — Ghost theme

Sailing-journal theme built from the 1A direction: **Raceway** wordmark, **Golos Text** headings/UI, **Lora** body, **IBM Plex Mono** meta.

## Install

1. Zip the `chayka` folder (the zip must contain `package.json` at its root).
2. Ghost admin → **Settings → Design → Change theme → Upload theme**.
3. Activate.

## Site setup

- **Settings → General → Publication cover** — the home hero photo (parallax, `background-attachment: fixed`). Use ≥2000px wide.
- **Publication description** — renders as the hero eyebrow above the wordmark.
- **Navigation → Primary** — the navy top bar. **Secondary** — the footer row.
- Post **feature image** becomes the article hero; the title, tag and date sit on top of it.
- Posts without a feature image still work: the hero collapses to navy, cards fall back to a striped placeholder.

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

Raceway ships as `assets/fonts/raceway.otf` and is loaded by `@font-face`. Convert it to `.woff2` and swap the `src` for a ~4× smaller download:

```css
src: url('../fonts/raceway.woff2') format('woff2');
```

Raceway is licensed via Adobe Fonts / Type Network — check your license covers self-hosting on the site, or replace the `@font-face` with an Adobe Fonts web-project `<link>` in `default.hbs`.

## Templates

```
default.hbs     bar + footer shell
index.hbs       home: hero, lede post, 2 photo cards, dated list
post.hbs        article: photo hero with title, prose, tags, author, prev/next
page.hbs        static pages
tag.hbs         tag archive
author.hbs      author archive
partials/navigation.hbs
partials/pagination.hbs
```

`posts_per_page` is 9 (1 lede + 2 cards + 6 rows). Change it in `package.json`.
