# Contributing

Thanks for your interest in contributing to **JIKAN**! This project is a modern React application powered by Cloudflare Workers.

## 🏗 Project Architecture

- **`src/`**: React 19 frontend application (Vite).
  - `components/ui/`: Kumo UI adapter layer (Base UI primitives).
  - `components/icons/`: Brand icon components.
  - `data/`: Static data (i18n, countries, devices).
  - `lib/`: Utilities (renderer, motion, i18n context).
  - `pages/`: Registry workspace (Home).
- **`worker/`**: Cloudflare Workers backend.
  - `index.js`: Worker entry, route handling, and WASM/font initialization.
  - `generators/`: SVG rendering adapters.
  - `validation.js`: URL parameter validation.
  - `timezone.js`: Timezone resolution.
- **`shared/`**: Core logic shared between Browser (Canvas) and Worker (SVG).
- **`tests/`**: Node.js behavioral regression tests.

## 🚀 Quick Start

### Prerequisites
- Node.js & npm
- Cloudflare Wrangler CLI (`npm install -g wrangler`)

### Local Development

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   # Frontend (Vite)
   npm run dev
   ```
   Access the app at `http://localhost:5173` (or port assigned by Vite).

3. **Backend Only (Optional)**
   If you need to debug specific Worker endpoints:
   ```bash
   npx wrangler dev
   ```

## 🌐 Internationalization (i18n)

We use a custom React Context solution (`src/lib/I18nContext.jsx`) backed by `src/data/i18n.js`.
See [`MULTILINGUAL.md`](./MULTILINGUAL.md) for detailed instructions on adding translations.
All translation work (including i18n automation flows) must follow the fixed principles in `MULTILINGUAL.md` under `翻译基线（i18n 固定规则）`.

## 🎨 Design System

- **Kumo UI**: All components are built on `@cloudflare/kumo` (Base UI). Adapters live in `src/components/ui/`.
- **Tailwind CSS v4**: No `tailwind.config.js` — everything is in `src/index.css`.
- **Theme**: OKLCH colors via CSS variables. Do not hardcode hex values; use `var(--color-*)` tokens.
- **Vendor Immutability**: Never modify `@cloudflare/kumo` source. Customize via `className` overrides or adapter wrappers.

## 🛠 Working on the Worker

The Cloudflare Worker (`worker/`) handles:
1. **Dynamic Image Generation**: `/generate` endpoint returns PNGs via Resvg WASM.
2. **Static Asset Serving**: Serves the built React app via Cloudflare Static Assets binding.

**Testing Generation:**
```bash
curl "http://localhost:8787/generate?type=year&country=CN" -o test.png
```

## 📋 Pull Request Checklist

- [ ] **Architecture**: Does your change follow the `CLAUDE.md` structure?
- [ ] **Rendering Unity**: If you changed layout, text, date math, or validation rules, did you update `shared/wallpaper-core.js` first and then verify the affected adapters (`src/lib/renderer.js`, `worker/generators/*.js`) still match?
- [ ] **i18n**: Did you extract new text strings to `src/data/i18n.js`?
- [ ] **Design Tokens**: Are you using Kumo tokens and CSS variables (no hardcoded colors)?
- [ ] **GEB Protocol**: Did you update L3 headers and relevant `CLAUDE.md` maps?

## 🤝 Code of Conduct

Please review [`CODE_OF_CONDUCT.md`](./CODE_OF_CONDUCT.md) before participating.
