<div align="center">

# Vadim Grushin — Portfolio

**Go developer · Backend / DevOps**<br>
A fast, dependency-free personal site: bilingual (RU / EN), light and dark themes,
and a one-page résumé built from the same source.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/Vanilla_JS-F7DF1E?logo=javascript&logoColor=black)
![No build step](https://img.shields.io/badge/build_step-none-0e7490)
![Languages](https://img.shields.io/badge/lang-RU_%7C_EN-0b1220)
![Themes](https://img.shields.io/badge/theme-light_%7C_dark-0b1220)

**English** · [Русский](README.ru.md)

<br>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/screenshots/hero-dark.png">
  <img alt="Portfolio landing screen: name, role and an animated request-path diagram of the fintracker backend" src="docs/screenshots/hero-light.png" width="900">
</picture>

</div>

<br>

## What it is

The site I send to recruiters and engineers together with my résumé. It has one job: let someone
understand in ten seconds **what I build, with what, and how well**, then let them dig into the code.

I'm a backend developer, so there is no product UI to screenshot. Instead the page shows how the work is built:

- **The hero is a diagram, not a photo.** An animated trace shows a request travelling through
  [fintracker](https://github.com/moraziss/fintracker): `client → nginx → handler → service → repository → PostgreSQL`, with Redis on the side.
- **Projects are written as case studies**, not bullet lists: an architecture or delivery diagram,
  then four themes (architecture, security, performance, delivery) with the concrete decisions behind them.
- **Facts over adjectives.** A strip of numbers (Go since 2024, ~20 endpoints, 2 IDOR vulnerabilities found and fixed, 60+ tests) instead of "passionate developer".

## Features

| | |
|---|---|
| **Bilingual** | Russian copy lives in the HTML (works without JS, readable by crawlers); the English dictionary is in `main.js`. Deep links: `?lang=en`, `?lang=ru`. |
| **Light / dark** | Light by default, remembered per visitor, `?theme=dark` for sharing. Colors are design tokens in `style.css`. |
| **Responsive** | Phone-first layout, no horizontal scroll, tested from 375 px up. |
| **Accessible** | Semantic landmarks, skip link, visible focus, `aria-pressed` toggles, `prefers-reduced-motion` respected. |
| **Polished details** | Scroll-spy navigation, cursor spotlight on cards, reveal-on-scroll, copy-to-clipboard for the e-mail. |
| **Zero dependencies** | Plain HTML, CSS and JavaScript. Only Google Fonts (Manrope, JetBrains Mono) are loaded from outside. |
| **Résumé pipeline** | HTML → PDF with headless Edge/Chrome: single column, real text, correct reading order for ATS. RU and EN. |

## Screenshots

<p align="center">
  <img alt="Mobile, light theme" src="docs/screenshots/mobile-light.png" width="260">
  &nbsp;&nbsp;
  <img alt="Mobile, dark theme" src="docs/screenshots/mobile-dark.png" width="260">
</p>

<details>
<summary><b>Full page</b></summary>
<br>
<p align="center"><img alt="Full page, light theme" src="docs/screenshots/full-light.png" width="780"></p>
</details>

<details>
<summary><b>Résumé (English, one page)</b></summary>
<br>
<p align="center"><img alt="One-page résumé" src="docs/screenshots/resume-en.png" width="560"></p>
</details>

## Project structure

```
.
├── index.html           markup and the Russian copy
├── style.css            design tokens, light/dark themes, layout, animations
├── main.js              EN dictionary, language & theme switching, scroll-spy, reveal, copy button
├── assets/              favicon and the public résumé PDFs (RU / EN)
├── resume/              résumé sources (HTML + CSS) and the PDF build script
├── scripts/             screenshot generator for this README
└── docs/screenshots/    images used in this README
```

## Run locally

No install, no build. Serve the folder with any static server:

```bash
git clone https://github.com/moraziss/portfolio.git
cd portfolio
python -m http.server 5173
```

Open <http://localhost:5173> (or add `?lang=en&theme=dark`).

## Edit the content

- **Russian text** — directly in `index.html`.
- **English text** — the `EN` object at the top of `main.js`; each key matches a `data-i18n` attribute.
- **Colors and fonts** — CSS variables at the top of `style.css`.

## Rebuild the résumé

```bash
powershell -ExecutionPolicy Bypass -File resume/build.ps1
```

Needs Edge or Chrome. Output:

- `assets/*.pdf` — public versions (no phone number), served by the site; the button follows the page language.
- `resume/dist/*.pdf` — full versions for recruiters. The phone number is read from `resume/phone.local.txt`,
  which is git-ignored, so it never reaches this public repository.

Regenerate the README images with `powershell -ExecutionPolicy Bypass -File scripts/screenshots.ps1`.

## Deploy

GitHub Pages, straight from the `main` branch:

1. **Settings → Pages → Build and deployment →** *Deploy from a branch* → `main` / `(root)`.
2. For a custom domain, enter it under **Custom domain** (GitHub commits a `CNAME` file), then enable **Enforce HTTPS**.
3. DNS at the registrar — apex domain: four `A` records `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`;
   `www`: a `CNAME` to `moraziss.github.io`.

## Contact

[grusinvadim55@gmail.com](mailto:grusinvadim55@gmail.com) ·
[Telegram @moraziss](https://t.me/moraziss) ·
[LinkedIn](https://www.linkedin.com/in/vadim-grushin-0a9a0b392) ·
[GitHub @moraziss](https://github.com/moraziss)
