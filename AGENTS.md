# JIKAN AGENT KNOWLEDGE BASE

**Last verified:** 2026-06-02

## OVERVIEW

JIKAN is a stateless dynamic lock-screen wallpaper generator. React + Vite renders the live workspace and inline SVG previews; Cloudflare Workers render `/generate` PNG output and `/og-image.png`; `shared/` is the single rendering truth source consumed by both sides.

Agents must treat this repository as a documented fractal system: read the nearest `CLAUDE.md` before changing a directory, keep file L3 headers aligned with imports/exports/responsibility, then update the relevant L2/L1 docs after any structural or interface change.

## STRUCTURE

```text
Jikan.life/
├── .github/                     # CI automation -> see .github/CLAUDE.md
├── src/                         # React frontend -> see src/CLAUDE.md
│   ├── components/ui/           # Kumo UI adapter layer -> see src/components/ui/CLAUDE.md
│   ├── data/                    # i18n, countries, devices -> see src/data/CLAUDE.md
│   ├── lib/                     # i18n context, motion, date/utils -> see src/lib/CLAUDE.md
│   └── pages/registry/          # Home workspace -> see src/pages/registry/CLAUDE.md
├── shared/                      # Cross-end rendering core -> see shared/CLAUDE.md
├── worker/                      # Cloudflare Worker API/image backend -> see worker/CLAUDE.md
├── tests/                       # Node test guards -> see tests/CLAUDE.md
├── scripts/                     # Validation/sync scripts -> see scripts/CLAUDE.md
├── public/                      # Static assets and static API files -> see public/CLAUDE.md
├── dist-worker/                 # Generated Worker build artifact notes
└── dist/                        # Generated frontend build output; ignored, do not edit
```

## WHERE TO LOOK

| Task | Location | Notes |
| --- | --- | --- |
| Project map | `CLAUDE.md` | L1 constitution: stack, architecture laws, config truth sources |
| Agent rules | `AGENTS.md` | Operational map for future coding agents |
| Product facts | `README.md`, `CHANGELOG.md` | Public status, version matrix, release history |
| Frontend entry | `src/App.jsx`, `src/main.jsx`, `src/pages/registry/HomePage.jsx` | SPA routing, i18n provider, Home workspace shell |
| Workspace state | `src/pages/registry/sections/workspace/useHomeWallpaperConfig.js` | Main config hook; delegates action/date/init helpers |
| URL generation | `src/pages/registry/sections/workspace/url-builder.js` | Stateless parameter serialization |
| Shared rendering API | `shared/wallpaper-core.js` | Stable facade. Keep existing import path compatible |
| Layout math | `shared/layout-core.js`, `shared/goal-ring-geometry.js` | Year/Life/Goal geometry, progress and ring truth source |
| Color logic | `shared/wallpaper-color-core.js`, `shared/random-palette.js` | WCAG contrast, safe accent, random palette |
| Text/font logic | `shared/wallpaper-text.js` | Wallpaper i18n text and goalName script-aware font strategy |
| Inline previews | `src/pages/registry/sections/workspace/YearPreviewSvg.jsx`, `src/pages/registry/sections/workspace/GoalPreviewSvg.jsx`, `src/pages/registry/sections/workspace/LockScreenPreviewFrame.jsx` | Browser SVG preview must match Worker output semantics |
| Lock-screen chrome | `src/pages/registry/sections/workspace/lock-screen-overlay/` | Live overlay runtime, colors, controls, symbols and constants |
| Worker routes | `worker/index.js`, `wrangler.toml` | `/`, `/generate`, `/og-image.png`, `/health`, `/app` routing |
| Worker SVG | `worker/svg.js`, `worker/generators/*.js` | SVG primitives and Year/Life/Goal/OG generators |
| UI adapters | `src/components/ui/kumo.jsx`, `src/components/ui/*.jsx` | Pages consume Kumo through local adapters only |
| Vendor bridge | `src/components/ui/vendor/kumo-date-picker/` | Temporary Kumo DatePicker snapshot; do not generalize it |
| i18n | `src/data/i18n.js`, `src/lib/I18nContext.jsx` | EN / zh-CN / zh-TW / ja UI text and runtime language |
| Device data | `src/data/devices.js`, `src/pages/registry/sections/workspace/device-visibility.js` | iPhone-only visible policy with legacy normalization |
| Tests | `tests/*.test.js`, `tests/helpers/source-test-helpers.js` | Behavior guards plus limited source-contract guards |
| CI | `.github/workflows/ci.yml` | `npm ci` -> metadata check -> tests -> build |

## CONVENTIONS

### Agent Protocol

- User-facing replies are Chinese and start with `哥`.
- Before editing inside a directory, read its nearest `CLAUDE.md`; before editing a file, verify its L3 `[INPUT]/[OUTPUT]/[POS]/[PROTOCOL]` header.
- If a business source file lacks an L3 header, add it before further work.
- After code changes, run the GEB loop: L3 file header -> L2 directory `CLAUDE.md` -> L1 root `CLAUDE.md`.
- Creating, deleting, moving or renaming files is an architecture change. Update the owning `CLAUDE.md` immediately.
- Prefer the smallest working change. If a smell appears, name the smell, explain the risk, and ask whether to optimize unless the optimization is necessary for the current task.

### Rendering And State

- `shared/wallpaper-core.js` is the public facade. Keep consumers on this path unless there is a deliberate facade redesign.
- Browser inline previews and Worker generators must consume the same shared layout/text/color/date functions.
- All personalization is URL-state. Do not add storage, accounts, database state, or hidden server persistence.
- Goal progress is completed-progress, clockwise, via `getGoalRingGeometry()`. Do not reintroduce remaining-progress rings.
- Timezone date math lives in `shared/date-math.js`; avoid browser-local calendar assumptions in wallpaper rendering.

### Styling

- UI is Kumo UI + Tailwind v4 + Kumo tokens. Page code must not direct-import `@cloudflare/kumo`; use `@/components/ui/*`.
- Prefer Kumo `LayerCard`, `Tabs`, `ClipboardText`, `SkeletonLine`, `DatePicker` through `src/components/ui/kumo.jsx`.
- Do not hard-code component colors with raw hex. Use Kumo CSS variables or scoped variables such as `--step-list-bullet-color`.
- ColorPicker uses Kumo Popover + Kumo Select and exposes hex only; keep Color object bridging in `use-color-picker-state-bridge.js`.
- Icons use `@phosphor-icons/react` unless an existing static brand SVG is already the source of truth.
- Public preview shell assets live under `public/preview/`; live overlay behavior stays in React workspace modules.

### Data And I18n

- UI language supports `en`, `zh-CN`, `zh-TW`, `ja`; new visible copy must update all four languages and corresponding tests when covered.
- `src/data/countries.js` proxies `shared/countries.js`; do not split country/timezone truth sources.
- iPhone is the visible public device category. Android/iPad data may exist but must remain hidden unless product scope changes.
- Goal name font selection is content-aware: wallpaper language controls fixed labels; `goalName` can independently trigger CJK font loading.

### Worker And Edge

- `wrangler.toml` is the deployment and observability truth source.
- `/`, `/generate`, `/og-image.png`, `/health`, `/app`, `/app/` must run Worker before static asset fallback.
- `/app` and `/app/` are deprecated and must stay `308 -> /` at the edge.
- Public access to internal `CLAUDE.md` files and `/api/component-registry` is blocked by Worker route guards; do not weaken this.
- `worker/svg.js` must keep XML-safe font-family attributes.

### Tests

- Test runner is Node native: `npm run test`.
- Guard files intentionally combine behavior checks with selected source-contract checks. Do not loosen assertions to hide regressions.
- If Year/Life/Goal SVG rendering legitimately changes, update snapshot hashes only through `npm run sync:wallpaper-snapshots`.
- Version metadata must pass `npm run check:version-metadata`; package version drives README badge and package-lock top metadata.
- For UI changes, run tests and inspect the browser when practical. Visual tasks require real screenshots, not code-only confidence.

### Versioning

- Keep `package.json`, `README.md`, `package-lock.json`, `CHANGELOG.md` in sync.
- `npm version` triggers `sync:version-metadata`; pre-commit also stages metadata fixes through `scripts/git-hooks/pre-commit`.
- Prefer stable registry releases. Alpha/nightly/canary packages need explicit justification in docs.
- Do not run deploy/release commands unless the user explicitly asks.

## ANTI-PATTERNS

| Pattern | Why | Instead |
| --- | --- | --- |
| Editing `dist/` or `node_modules/` | Generated/vendor output; changes vanish or corrupt installs | Edit source and rebuild |
| Page imports from `@cloudflare/kumo` | Breaks adapter boundary and tests | Import from `@/components/ui/*` |
| New layout math in Preview only | Splits browser and Worker output | Move math to `shared/` and consume from both |
| Raw hex colors in components | Breaks Kumo theme semantics | Use Kumo tokens or scoped CSS variables |
| URLSearchParams double-encoding | Breaks CJK goal names | Let `URLSearchParams` encode raw strings once |
| Editing tests to pass | Hides real regressions | Fix behavior or update guards with evidence |
| Hand-updating snapshot hashes | Easy to desync baseline | Run `npm run sync:wallpaper-snapshots` |
| Direct Worker dashboard config drift | Local truth becomes false | Update `wrangler.toml` |
| Broad refactors during small fixes | Expands risk across guarded UI | Make the narrowest change, then propose cleanup |
| Missing doc sync after file/interface changes | Breaks GEB map/terrain alignment | Update L3/L2/L1 before finishing |

## COMMANDS

```bash
# Install and local development
npm ci
npm run dev                         # Vite dev server
npm run worker:dev                  # Wrangler local Worker

# Validation
npm run check:version-metadata       # README/package-lock version metadata guard
npm run test                         # Node native tests
npm run build                        # Vite production build

# Sync helpers
npm run sync:version-metadata        # Rewrite README badge + package-lock top version
npm run sync:wallpaper-snapshots     # Regenerate Year/Life/Goal SVG snapshot hashes
node scripts/check-wallpaper-core.js # Lightweight shared rendering sanity check
node scripts/sync-changelog-version.js

# Deployment only when explicitly requested
npm run worker:deploy
```

## BUILD PIPELINE

```text
URL params
   ↓
workspace config helpers
   ↓
shared/wallpaper-core.js facade
   ├── Browser inline SVG preview
   └── Worker generators/*.js -> worker/svg.js -> Resvg WASM -> PNG

index.html + dist assets
   ↓
wrangler.toml run_worker_first
   ↓
Cloudflare Worker routes /, /generate, /og-image.png, /health, /app, /app/
```

## TOOLCHAIN

| Tool | Version | Notes |
| --- | --- | --- |
| Node | CI uses 20 | GitHub Actions `setup-node@v4` |
| npm | lockfile-driven | Use `npm ci`, not ad-hoc installs |
| React / React DOM | 19.2.7 | Stable dependency rail |
| Vite | 8.0.16 | Frontend build and dev server |
| Tailwind CSS | 4.3.1 | Kumo-token styling |
| Kumo UI | 2.5.2 | UI system via local adapters |
| @base-ui/react | 1.5.0 | Kumo primitive foundation |
| react-router-dom | 7.17.0 | SPA routing |
| Framer Motion | 12.40.0 | Motion presets in `src/lib/motion.js` |
| Playwright | 1.60.0 | Browser verification dependency |
| Wrangler | 4.100.0 | Worker dev/deploy |
| esbuild | 0.28.1 | npm override for Vite/Wrangler audit closure |
| Zod | 4.4.3 | Worker parameter validation |
| Resvg WASM | 2.6.2 | SVG to PNG conversion |

## SECURITY

- Never commit `.env`, tokens, account secrets, API keys, cookies or credentials.
- Do not expose internal architecture docs or component registry endpoints publicly.
- Worker HTML filtering must only remove build comments before `<!doctype>`; do not globally strip page comments.
- Keep privacy posture: no accounts, no database, no server-side personalization storage.

## NOTES

- `dist/`, `.wrangler/`, `.codex/`, `.agent/`, `doc/`, `internal_docs/` are ignored local/generated/process paths.
- `public/api/component-registry` exists only to satisfy Kumo SearchDialog expectations in a Vite app.
- `src/components/ui/vendor/kumo-date-picker/` is a narrow bridge for Kumo DatePicker range restart behavior; it is not a pattern for vendoring arbitrary upstream code.
- `CODE_OF_CONDUCT.md` is tracked even though `.gitignore` lists it; do not delete it as "ignored noise".
- The map is part of the system. A code change without matching documentation is incomplete.
