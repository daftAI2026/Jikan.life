# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed
- **Home Preview Refinement**: Optimized `HomePreviewPane` by removing redundant `SCREEN_WIDTH`/`HEIGHT` constants and simplifying the `drawPreview` dependency array. Enhanced the preview hint typography for better visibility.
- **Topbar Layout**: Refined `HomeTopbar` layout for improved visual balance during the settings-visual transition.
- **Settings UX**: Introduced numerical index marks (1-6) to `HomeSettingsPane` cards via `SettingsCardShell` to emphasize the progressive configuration sequence and improve flow legibility.

### Documentation
- **GEB Protocol Sync**: Updated `SettingsCardShell` L3 headers and module-level `CLAUDE.md` files to reflect the newly integrated `indexMark` feature and its role in the registry workspace.

### Added
- **Validation Script**: Introduced `scripts/check-wallpaper-core.js` for automated verification of wallpaper core logic and font handling.

### Changed
- **Calendar UI Overhaul**: Fully decoupled `calendar.jsx` from CVA `buttonVariants`. Refined navigation arrows (now size-9 and perfectly centered) and implemented a high-contrast selected state (black background with white text) using Kumo design tokens for improved visual consistency.
- **Goal Visual Refinement**: Further refined the goal countdown ring in the sidebar card by reducing the stroke width from `3.5` (via `0.035`) to `2.5` (via `0.025`) for a more elegant and lightweight appearance.
- **DatePicker Popup Background**: Aligned DatePicker popup background from `bg-popover` (#FAFAFA) to `bg-kumo-control` (#FFFFFF) to match Kumo Select popup consistency.
- **Theme State Unification**: Eliminated localStorage `theme` key dual-write in `ThemeToggle.jsx`. All theme persistence now uses a single `mode` key, consistent with `Header.jsx`.
- **Border → Ring Migration**: Active components (`date-picker`, `card`, `field`) migrated from `border` to `ring ring-kumo-line` per Kumo design standard.
- **Grouped Device Select**: Implemented visual grouping in the device selection dropdown. iPhone, Android, and iPad models are now organized under category headers using Base UI primitives.
- **Timezone Tooltip**: Added a localized tooltip to the "Location" label across the app, explaining the necessity of timezone accuracy for day progress. Enhanced the `Label` UI component to support native tooltips with a help icon, allowing the removal of redundant "For timezone" hint text.
- **Typography Engine**: Unified font family fallback logic across browser preview and Cloudflare Worker SVG generator, supporting Inter and Noto Sans SC/TC/JP.
- **I18n Refinement**: Standardized localization keys in `CustomizeSection` and `RegistrySettingsPane` for improved translation consistency.

### Fixed
- **Font Fallback**: Corrected font detection in `worker/svg.js` to ensure proper multi-language glyph rendering in generated wallpapers.
- **ColorPicker Accent Sync**: Fixed accent color button not updating when background color changes. Registry page now reads the computed safe accent; Landing page now writes user picks to the correct state key so `getSafeAccent` can recalculate properly.
- **I18n Cleanup**: Removed stale `config.locationHint` references following the timezone tooltip implementation.
- **Runtime Safety**: Fixed missing `Label` import in `CustomizeSection` and restored accidentally deleted `labelVariants` in `field.jsx`.

### Documentation
- **GEB Protocol Sync**: Performed a project-wide synchronization of L1/L2/L3 documentation. Updated file headers and module maps in `CLAUDE.md` to reflect recent architectural shifts and dependency cleanups.
- **UX Roadmap**: Updated `CONSOLIDATED_KNOWLEDGE.md` with "Phase 4: Registry UX Evolution", outlining the upcoming 6-grid progressive configuration flow and full-overlay settings panel requirements.

## [1.1.4] - 2026-02-15

### Changed
- **Goal Countdown Visualization**: Refined the visual hierarchy within the Registry Sidebar's "Goal" style card. Increased the "Days left" label font size for better readability and significantly optimized vertical spacing for both the countdown number and label text to achieve superior visual balance.
- **Internationalization**: Updated "Make it Yours" translations in Simplified Chinese, Traditional Chinese, and Japanese for more natural localized expression.

## [1.1.3] - 2026-02-14

### Changed
- **Registry Topbar Refinement**: Transitioned social links to utilize `LinkButton` from Kumo UI, ensuring consistent design tokens and interaction feedback.
- **Goal Configuration UI**: Simplified the layout for goal settings in both the Landing page and Registry workspace by removing redundant container borders and optimizing spacing.

### Fixed
- **CustomizeSection Layout**: Added missing connectivity classes to `DatePicker` in the customization section to ensure full-width alignment within grid columns.
- **Maintainer Contact**: Updated the official support/report email in `CODE_OF_CONDUCT.md` to `info@sofxcking.cool`.

## [1.1.2] - 2026-02-14

### Changed
- **ColorPicker Visual Polish**: Optimized the pick button layout by adjusting padding for better horizontal balance.

### Fixed
- **Test Integrity**: Updated `kumo-migration.behavior.test.js` to align with the new ColorPicker layout tokens, ensuring automated design system verification passes.

## [1.1.1] - 2026-02-14

### Added
- **Refined Color Primitives**: Upgraded ColorThumbs with a "dot-in-ring" visual style and transitioned all color containers to `rounded-lg` for Kumo alignment.
- **Dynamic Color Channel Mapping**: Refactored `ColorPicker` to use a declarative mapping system for RGB/HSL/HSB channels, simplifying rendering logic.

### Changed
- **ColorPicker Visual Polish**: Optimized pick button layout and updated typography/spacing to match the premium Kumo spec.


## [1.1.0] - 2026-02-13

### Added
- **Design System Registry**: Implemented a comprehensive Component Registry at `/registry` with a split-pane workspace, live configuration, and instant preview.
- **Kumo Infrastructure**: Introduced `vendor/kumo` as a tracked Git submodule and established a decoupled UI component library in `src/components/ui`.
- **GEB Protocol v2**: Achieved 100% fractal documentation coverage across core directories with recursive `CLAUDE.md` maps and L3 header contracts.
- **Advanced UI Components**: 
    - **ColorPicker**: Premium implementation with WCAG contrast intelligence and state-bridging for smooth HSB/HEX sync.
    - **Button Adapter**: Intelligent wrapper mapping legacy variants to Kumo primitives with `react-aria` support.
    - **Popover**: Direct high-performance re-export of Kumo primitives.
- **Wallpaper Refinements**: Support for device-level `cols` and `padding` overrides; centralized font rendering for consistent CJK support.
- **Registry Features**: Integrated Xiaohongshu/GitHub social links and localized wallpaper testing shell.

### Changed
- **Architecture Migration**: Decoupled core registry components from vendor documentation to provide a tailored, stable design system workspace.
- **UI Primitives Migration**: Refactored 20+ base components to use Kumo-style tokens and `react-aria-components`.
- **Testing Evolution**: Expanded behavioral testing to cover design system compliance, workspace integrity, and localized rendering.
- **Global Theme Engine**: Upgraded to Tailwind v4 compatible theme tokens and native `light-dark()` schemes.

### Fixed
- **State & Logic**: Resolved HSB channel jumping, DatePicker validation matchers, lifespan input clamping, and worker cache collisions.
- **i18n & UX**: Fixed translation reactivity in `TypesSection`, corrected Goal card design, and refined iOS/Android setup instructions including terminology alignment.
- **Visuals**: Fixed color primitive clipping (overflow-hidden) and added styling refinements like DatePicker inner shadows.


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
