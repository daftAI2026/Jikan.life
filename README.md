<p align="center">
  <img src="public/favicon.svg" width="80" alt="JIKAN logo" />
</p>

<h1 align="center">JIKAN</h1>

<p align="center">
  <strong>Data-driven dynamic wallpapers for your lock screen.</strong><br/>
  极简美学，数据驱动。为你的锁屏打造的高精度动态壁纸。
</p>

<p align="center">
  Circular brand mark: <code>public/favicon.svg</code><br/>
  Legacy square mark: <code>public/favicon-square-legacy.svg</code>
</p>

<p align="center">
  <a href="https://github.com/daftAI2026/Jikan.life/actions"><img src="https://github.com/daftAI2026/Jikan.life/actions/workflows/ci.yml/badge.svg" alt="CI" /></a>
  <img src="https://img.shields.io/badge/license-Apache--2.0-blue" alt="License" />
  <img src="https://img.shields.io/badge/version-1.9.25-green" alt="Version" />
  <img src="https://img.shields.io/badge/i18n-EN%20%7C%20zh--CN%20%7C%20zh--TW%20%7C%20ja-orange" alt="i18n" />
</p>

---

## ✨ Wallpaper Styles

| Style | Description |
|-------|-------------|
| **Year Progress** | One dot for every day of the year. Watch your year unfold at a glance. |
| **Goal Countdown** | Circular progress ring counting down to launches, vacations, and milestones. |

## 🏗 Architecture

```
Browser (React)                     Cloudflare Worker
┌──────────────────┐                ┌──────────────────┐
│ Inline SVG Preview│◄── shared ──►│  SVG Generator    │
│  (Live editing)   │   core logic  │  (Resvg WASM→PNG) │
└──────────────────┘                └──────────────────┘
         ▲                                   ▲
         │                                   │
    URL parameters ─── stateless config ─────┘
```

- **Stateless**: All configuration lives in the URL. No database, no tracking, no accounts.
- **Rendering Unity**: Browser inline SVG preview and server SVG export share the same core calculation logic via `shared/wallpaper-core.js`.
- **Privacy First**: Zero server-side storage. Your data never leaves the URL.

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19.2.5 · Vite 8.0.8 · Tailwind CSS 4.2.2 |
| **UI System** | [Kumo UI](https://github.com/cloudflare/kumo) 1.18.0 · Base UI 1.4.0 |
| **Backend** | Cloudflare Workers · Wrangler 4.82.2 · Resvg WASM |
| **Shared** | Unified wallpaper-core (inline SVG + Worker SVG) |
| **i18n** | 🇺🇸 English · 🇨🇳 简体中文 · 🇨🇳 繁體中文 · 🇯🇵 日本語 |
| **CI/CD** | GitHub Actions · npm ci · Cloudflare Static Assets |

## 🚀 Getting Started

```bash
# Install
npm ci

# Frontend dev server
npm run dev

# Worker dev server (API / image generation)
npm run worker:dev
```

### Validate

```bash
npm run check:version-metadata
npm run test
npm run build
```

### Deploy

```bash
# Deploy worker
npm run worker:deploy
```

## 📂 Project Structure

```
package.json          Dependency truth source
package-lock.json     Reproducible npm install graph
src/                  React frontend
  ├── components/ui/  Kumo UI adapter layer
  ├── data/           i18n, countries, devices
  ├── lib/            i18n, date utilities, motion, shared helpers
  └── pages/          Registry workspace (Home)
shared/               Shared rendering logic (browser + worker)
worker/               Cloudflare Worker backend
  └── generators/     SVG generation adapters
tests/                Node.js behavioral regression tests
scripts/              Dev validation scripts
```

## ✅ CI Contract

GitHub Actions runs the same gate locally expected before release:

```bash
npm ci
npm run check:version-metadata
npm run test
npm run build
```

React and React DOM stay pinned to the stable `19.2.5` pair. Canary React builds do not satisfy Base UI's stable peer range and will fail `npm ci` on CI.

## 🌍 Internationalization

JIKAN supports **4 languages** across both the UI and the wallpaper text itself:

- 🇺🇸 English
- 🇨🇳 简体中文
- 🇨🇳 繁體中文
- 🇯🇵 日本語

Language is auto-detected via IP geolocation and can be overridden manually. Wallpaper text language is independently configurable.

## 📱 Device Support

Pixel-perfect wallpaper generation with native resolution support for modern iPhones (including iPhone 17 series). Smart layout adjustments for Notch vs Dynamic Island devices.

> Android device data and MacroDroid setup copy are already in the codebase, but the current public device picker is intentionally limited to iPhone while the Android entry stays hidden.

## ❤️ Credits & Acknowledgements

This project stands on the shoulders of giants.

- **[Kumo UI](https://github.com/cloudflare/kumo)** (`@cloudflare/kumo`) — The design system powering JIKAN's interface.
- **[aradhyacp/LifeGrid](https://github.com/aradhyacp/LifeGrid)** — Original concept and codebase inspiration.

## 📄 License

Made with ❤️ for mindful living.

[Apache License 2.0](LICENSE) — Copyright © 2026 daftAI.
