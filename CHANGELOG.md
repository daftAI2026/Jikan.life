# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **Font Unification**: Centralized font family logic in `shared/wallpaper-core.js` to ensure consistent CJK rendering across Canvas preview and Worker SVG generation.
- **Registry Language Selector**: Integrated a dedicated language selector into the Registry shell for independent testing of localized wallpaper content.
- **Registry Shell Layout**: Refined the three-column layout (Sidebar/Preview/Settings) and enforced `fixed` positioning for the topbar to ensure a stable workspace.


- **Registry Social Links**: Integrated Xiaohongshu and GitHub navigation into the Registry topbar, replacing static version strings with branded iconography.
- **Workspace Directory**: Created `src/pages/registry/sections/workspace` to host isolated feature previews within the registry shell.
- **Kumo Infrastructure**: Introduced `vendor/kumo` as the primitive core and established a decoupled UI component library in `src/components/ui`.

### Changed
- **Vendor Decoupling**: Refactored `ThemeToggle`, `SearchDialog`, and `KumoMenuIcon` in the registry to be local implementations, removing direct source dependencies on `vendor/kumo` documentation components.
- **Registry Test Hardening**: Updated behavior tests to validate local workspace implementations and localized string rendering, replacing legacy vendor-based assertions.
- **Registry Architecture**: Decoupled the Registry Sidebar from Kumo's vendor components to provide a tailored navigation experience for Jikan.life's design system style selector.
- **Registry Navigation**: Refactored `RegistryHome` to use `selectedStyle` as the single source of truth for component switching.
- **Behavioral Testing**: Expanded `tests/kumo-migration.behavior.test.js` to cover local workspace implementations and social link validation.
- **UI Primitives Migration**: Refactored 20+ base components (Button, Input, Select, etc.) to use Kumo-style tokens and `react-aria-components` for enhanced accessibility.


### Added (Previous)
- **Design System Registry**: Implemented a comprehensive Component Registry at `/registry` for visual testing and documentation of Kumo primitives.
- **GEB Protocol v2**: Established recursive `CLAUDE.md` maps across all core directories (`/src/components`, `/src/lib`, `/src/pages`) to ensure architectural alignment.
- **Kumo Shell**: Created `KumoShell.jsx` as the new layout foundation for Kumo-based pages.
- **Year Grid Customization**: Year Progress wallpaper now supports device-level `cols` and `padding` overrides. iPhone models default to 16 columns with optimized padding for visual consistency.

### Fixed (Previous)
- **Worker Cache**: Fixed cache collision by including `lang`, `format`, `clockHeight`, `cols`, and `padding` in cache key calculation.


- Types cards: clamp descriptions to two lines to keep card heights consistent across languages.
- Restore react-aria trigger wiring so date and color picker popovers open reliably without altering button styling.
- **DatePicker Validation**: Resolved issue where `fromDate`/`toDate` didn't actually disable dates. Implemented `disabled` matcher functions to correctly restrict Date of Birth (max today) and Goal (min today).
- **Lifespan Input**: Fixed "jumping numbers" bug when deleting digits by deferring range clamping (50-120) to `onBlur`.
- **Theme Toggle**: Fixed theme switching by correctly updating the `.dark` class on the root element to match Tailwind V4 selectors.
- **i18n Reactivity**: Fixed a critical bug where the `TypesSection` did not refresh translations on language change. Implemented `useMemo` with `t` dependency and refactored `TypeCard` to remove redundant state.
- **Goal Card**: Fixed duplicated "Daily Updates" text and restored original design (Bold "Daily" + Small "UPDATES").
- **iOS Automation Setup**: Fixed a missing "Tap Next" step and refined the flow with the "+ (Upper-right corner)" prompt for better UX.
- **Reference Documentation**: Added `src/data/terminology-reference.md` as the unified source of truth for iOS (Shortcuts) and Android (MacroDroid) setup terminology.

### Changed
- Hardened date/time rendering against DST and timezone drift while unifying shared country mappings for consistent previews and caching.
- Changelog: merge duplicate Internationalization heading to keep Unreleased sections consistent.
- Simplified the landing footer to reduce visual clutter while keeping branded social links.
- Preserve the original neumorphic button feel and centralize palette presets so UI styling stays consistent across frontend and worker.
- UI date controls: standardized date field primitives to improve keyboard input reliability and visual consistency.
- **DatePicker Styling**: Added inner shadow to DatePicker buttons for better visual consistency with input fields and improved contrast on muted backgrounds.
- **Default Device**: Set the default device to iPhone 17 Pro Max for a better out-of-the-box experience on modern premium devices.

### Internationalization
- **Full Card i18n**: Completed internationalization for all card stats and status labels across all supported languages.
- **Android Setup**: Synchronized instruction structure and added missing warning badges for Traditional Chinese and Japanese translations.
- **Official Terminology Alignment**: Fully aligned iOS setup instructions (Shortcuts/Automation) with Apple's official standards across English, Simplified Chinese, Traditional Chinese, and Japanese. Refined key terms like "Create Personal Automation", "Specific Time", and "Set Wallpaper Photo".
- **UX Layout**: Standardized iOS Step 2 into a bulleted list with nested "Time of Day" configurations across all languages.

## [1.0.1] - 2026-02-02

### Fixed
- **CJK Font Rendering**: Resolved issue where Chinese and Japanese characters were not rendered in server-generated images (SVG to PNG) by explicitly specifying Noto Sans variants in the SVG font-family.
- **Japanese Translation**: Refined "lived" text translation from "生きた" to more natural "経過".

### CI/CD
- **Automation**: Added GitHub Actions workflow (`ci.yml`) for building and validating every commit, ensuring `main` branch stability.

### Documentation
- **GEB Protocol**: Achieved full compliance with the Fractal Documentation Protocol across the entire codebase (L1/L2/L3 maps aligned).

### Internationalization
- **Landing Page**: Completed i18n integration for `SetupSection` and `CustomizeSection`, enabling rich text translations via `HtmlDesc`.
- **Setup Refinements**: Extensively updated Android (MacroDroid) and iOS setup instructions for better clarity across all supported languages (EN, CN, TW, JA).
- **Placeholders**: Localized all input placeholders and form prompts.

### Infrastructure
- **Cloudflare**: Renamed worker service to `jikan` in `wrangler.toml`.
- **Git Maintenance**: Added `dist/` to `.gitignore` and removed existing build artifacts from version control.

### UI/UX
- **Styles**: Added specific styling for code snippets and highlight badges within i18n instructions.

## [1.0.0] - 2026-02-02

### Architecture
- **Vite + React Migration**: Complete rewrite of the frontend codebase from Vanilla JS to React 19 + Vite for better maintainability and performance.
- **Unified Deployment**: Adopted Cloudflare Workers Static Assets architecture. Frontend served directly from the Worker context.
- **Component-Based UI**: Refactored monolithic HTML/JS into modular React components (CustomizeSection, ColorPicker, etc.).

### Added
- **Private Task Management**: Introduced local-only `TODO.md` (git-ignored).
- **Advanced Color Picker**: Integrated `jollyui` and `react-aria-components` for a robust color selection experience including Eyedropper tool and WCAG contrast intelligence.
- **Internationalization (i18n)**: Full support for English, Simplified Chinese, Traditional Chinese, and Japanese with IP-based geolocation/language detection.
- **Wallpaper Localization**: Independent language selector for wallpaper text (remaining days, progress %) with Worker-side rendering support.
- **Documentation**: Added `CLAUDE.md` (Architecture), `MULTILINGUAL.md` (i18n Guide), and bilingual `README.md`.
- **UI Components**: Premium language selector, dynamic Google Fonts (Noto Sans), and Shadcn UI components.

### Fixed
- **Visual Consistency**: Unified typography sizes/weights between Canvas preview and Server-generated SVGs.
- **Preview Rendering**: Fixed `object-fit: cover` to eliminate gaps, corrected Dark Mode visibility for Goal text, and enforced black hardware notch.

### Changed
- **Directory Structure**: Organized static assets, data, and logic following the new defined architecture.
- **Git Configuration**: Updated `.gitignore` for AI workflows and local artifacts.

### Refactored
- **State Management**: Migrated from ad-hoc DOM manipulation to React's declarative state model.
- **Rendering Pipeline**: Unified logic for Canvas (Preview) and SVG (Worker) via shared core libraries.
- **Cloudflare Deployment**: Migrated to "Static Assets" model (`/public` + `/api`) for simplified single-command deployment.
