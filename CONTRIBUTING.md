# Contributing

Thanks for your interest in contributing to **JIKAN**! This project has evolved into a modern React application powered by Cloudflare Workers.

## 🏗 Project Architecture

- **`src/`**: React 19 frontend application (Vite).
  - `components/`: UI components (shadcn/ui based).
  - `data/`: Configuration presets and i18n strings.
  - `lib/`: Shared utilities and renderer logic.
- **`worker/`**: Cloudflare Workers backend.
  - `generators/`: SVG rendering adapters (Node.js/Resvg).
- **`shared/`**: Core logic shared between Browser (Canvas) and Worker (SVG).

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
   # Starts both frontend (Vite) and backend emulation (Wrangler)
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

## 🎨 Design System

- **Tailwind CSS v4**: We use the latest engine. No `tailwind.config.js`, everything is in `src/index.css`.
- **shadcn/ui**: Components live in `src/components/ui`.
- **Theme**: We use OKLCH colors. Do not hardcode hex values; use CSS variables (e.g., `var(--color-primary)`).

## 🛠 Working on the Worker

The Cloudflare Worker (`worker/`) handles:
1. **Dynamic Image Generation**: `/generate` endpoint returns PNGs.
2. **Static Asset Serving**: Serves the built React app (`dist/`) via `assets` binding.

**Testing Generation:**
You can test the generation logic by hitting the local endpoint:
```bash
curl "http://localhost:8787/api/generate?type=year&country=CN" -o test.png
```

## 📋 Pull Request Checklist

- [ ] **Architecture**: Does your change follow the `CLAUDE.md` structure?
- [ ] **Consistency**: If you changed rendering logic, did you update **BOTH** `src/lib/renderer.js` (Canvas) and `shared/wallpaper-core.js` (SVG)? This is critical for WYSIWYG.
- [ ] **i18n**: Did you extract new text strings to `src/data/i18n.js`?
- [ ] **Linting**: Ensure code is clean and follows the functional React style.

## 🤝 Code of Conduct

Please review [`CODE_OF_CONDUCT.md`](./CODE_OF_CONDUCT.md) before participating.
