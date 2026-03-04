# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.7.5] - 2026-03-04

### Infrastructure
- **Dependency Upgrades**: Synchronized packages to their latest versions, including `framer-motion` to `12.34.5` and `wrangler` to `4.70.0`.
## [1.7.4] - 2026-03-04

### Architecture
- **Responsive Layout Engine**: Introduced `effectiveLayoutTier` module (`effective-layout-tier.js`) to completely decouple complex breakpoint classification logic from the main components, establishing a centralized truth source for programmatic layout structure shifts.
- **Settings Flexibility**: Upgraded `HomeGrid`, `HomeSettingsPane`, and `SettingsCardShell` to dynamically consume the new `effectiveLayoutTier`. This allows the complex progressive 6-card setup grid to gracefully break structural boundaries, intelligently shifting between dense desktop layouts (`lg`) and linear tablet/mobile lists (`md`) without bloated inline rules.

### Documentation
- **Fractal Protocol Sync**: Updated L2 module maps in `registry/CLAUDE.md`, `sections/workspace/CLAUDE.md`, and `tests/CLAUDE.md` to document the new `effectiveLayoutTier` entity and its architectural responsibilities.
- **Contract Enforcement**: Enforced strict L3 `[INPUT]/[OUTPUT]/[POS]` headers on `HomeSettingsPane` and `SettingsCardShell` to declare dependency on `effectiveLayoutTier`.

### Tests
- **Responsive Logic Guards**: Added pure unit test suite (`registry-effective-layout.unit.test.js`) to strictly validate physical screen boundaries against virtual logic tiers.
- **UI Constraints**: Synchronized `kumo-migration.ui.behavior.test.js` to assert the structural `className` adjustments within the settings panel driven by the new `effectiveLayoutTier` engine.

## [1.7.3] - 2026-03-04

### UI & UX
- **Mobile Navigation**: Introduced a unified `MobileFooter` component, replacing the floating language button. The new mobile footer provides a clean three-column layout, docking action links (GitHub, Xiaohongshu) on the edges with a centered Language Selector, aligning with premium app paradigms.
- **Theme Toggle**: Relocated `ThemeToggle` from the topbar into the `HomeSidebar` header to integrate it directly within the settings workflow.
- **Viewport Dimensioning**: Refactored the mobile workspace height calculation (`.registry-main-content-mobile-height`) to dynamically subtract both topbar and the new `MobileFooter` boundary heights, preventing browser native overscroll leaking.
- **Mobile Menu Overlay**: Upgraded the mobile settings auto-flow menu from a partial drawer to a full-screen immersive structure (`inset-0`, `z-[60]`) to provide a more focused configuration experience.
- **Auto-expansion**: Enhanced the mobile settings auto-flow so that when no style is selected during onboarding, it automatically opens the configuration menu. Conversely, selecting a style immediately dismisses it, smoothing the setup sequence on small screens.

### Documentation
- **Fractal Protocol Sync**: Brought `src/pages/registry/CLAUDE.md` and `src/pages/registry/sections/CLAUDE.md` into compliance by documenting the structural addition of `MobileFooter` and its impact on the `LanguageSelect` export map.

### Tests
- **Mobile Architecture Guards**: Expanded `kumo-migration.ui.behavior.test.js` to assert structural constraints of the new `MobileFooter` (three-column layout, links, ARIA labels, semantic tags) and its conditional integration within the `HomePage`. Validated the updated global CSS calculation formulas for dual topbar/footer viewport heights.
- **Mobile Flow Constraints**: Expanded `kumo-migration.ui.behavior.test.js` to assert the structural layout constraints of the new full-screen mobile menu layer, as well as its automatic toggle behaviors.

## [1.7.2] - 2026-03-02

### UI & UX
- **Device Layout**: Adjusted clock height placement (`clockHeight` from `0.287` to `0.217`) for iPhone notch models to better align with the iOS lock screen and prevent text overlap.

## [1.7.1] - 2026-03-01

### Accessibility & UI
- **Input Accessibility**: Enhanced the form input infrastructure (`Input` component). Introduced a local accessibility wrapper layer that automatically provides an `aria-label` fallback (using the `placeholder` value when no explicit accessible name is provided). Completed missing `aria-label` contracts for multiple input controls (search bar, goal name, date range, read-only URL box, HEX color input) to adhere to stricter accessibility standards.
- **CI Enhancements**: Restored the `npm run test` step in GitHub Actions (`ci.yml`) to ensure all infrastructure tests and accessibility fallback contracts pass mandatory CI validation.

### Documentation
- **Fractal Protocol**: Updated L3 header contracts for `src/components/ui/input.jsx` and `src/components/ui/kumo.jsx`, explicitly declaring the new responsibility boundaries for the unified Input accessible name fallback.

## [1.7.0] - 2026-03-01

### Architecture
- **Mainline Integration**: Comprehensively merged all previous Semantic Refactoring branches into the mainline. This merge solidifies the deep decoupling achievements of the core wallpaper engine, state configuration hooks (e.g., `useHomeWallpaperConfig`), and UI card components.

## [1.6.1] - 2026-03-01

### Architecture
- **Wallpaper Core Decoupling**: Completely shattered the massive `shared/wallpaper-core.js` into focused semantic modules: `layout-core.js` (rendering boundaries and dimension computation), `wallpaper-color-core.js` (canvas composition and dynamic foreground switching), `wallpaper-text.js` (text metrics and typography placement), and `goal-validation.js` (business logic guards). `wallpaper-core.js` now acts simply as a facade exporting these capabilities.

### Documentation
- **Fractal Protocol**: Executed comprehensive GEB protocol compliance across the newly extracted shared modules. Updated L2 module maps in `shared/CLAUDE.md` and `tests/CLAUDE.md`. Maintained rigid L3 headers for all new architectural entities.

### Tests
- **API & Visualization Testing**: Introduced new test boundaries: `wallpaper-core-api.behavior.test.js` (ensuring rigid contract structure and backwards compatibility) and `wallpaper-visual-snapshots.behavior.test.js` (validating output geometry, color assignments, and text configurations).
- **Migration Guards**: Updated `kumo-migration.core.behavior.test.js` to assert the successful dismantling of `wallpaper-core.js` and upgraded goalDefault validation from brittle shape assertions to robust runtime behavior assertions.

## [1.6.0] - 2026-03-01

### Architecture
- **Semantic Refactoring**: Executed a massive architectural decoupling across 38 files, transitioning the system from "mechanical file splitting" to "semantic responsibility domains".
- **Sidebar Component Decoupling**: Completely shattered the monolithic `HomeSidebar.jsx` (reduced by over 300 lines). Extracted card data construction into `home-sidebar-cards.jsx`, layout computation into `home-sidebar-date-stats.js`, and specialized graphic rendering into `home-sidebar-visuals.jsx`. The sidebar now operates purely as a layout container and state bridge.
- **Hook Actions Factory Extraction**: Dismantled the massive `useHomeWallpaperConfig.js` hook. Decoupled its 75-line actions block into an independent factory `workspace/config-actions.js`. Further separated concerns by extracting config initialization (`config-init.js`), URL generation (`url-builder.js`), and option mapping (`view-model-mappers.js`), allowing the main hook to focus solely on React state orchestration and lifecycle management.
- **Goal Date Updater Semantic Entry**: Replaced the monolithic `type`-based dispatch function in `goal-date-updater.js` with three explicit semantic entry points (`applyGoalRangeUpdate`, `applyGoalStartUpdate`, `applyGoalDateUpdate`). This strictly types the validation pipeline and guarantees consistent error state merging behavior across all edge cases.
- **Shared Date Math Truth Source**: Consolidated date calculations (leap year, days in year, day of year) into `shared/date-math.js`. Eliminated duplicate ad-hoc formulas across the `worker` environment (`worker/timezone.js`) and the browser environment (`src/lib/date-utils.js`), guaranteeing mathematical alignment.

### UI & UX
- **Action API Cohesion**: Updated settings UI cards (`colors-card`, `goal-fields-card`, `life-fields-card`) to consume the highly cohesive `actions.*` factory methods.
- **Goal Range Input**: Standardized the Goal fields card to leverage the unified `setGoalRange` action, ensuring synchronized error validation immediately upon range selection.

### Tests
- **Behavioral Evolution**: Re-architected migration guards to assert on module delegation patterns and explicit I/O rather than brittle, shape-based source code regexes. Split the monolithic behavior test into `kumo-migration.ui.behavior.test.js` and `kumo-migration.core.behavior.test.js`.
- **Unit Testing Engine**: Introduced isolated, dependency-free unit test suites (`date-math.unit.test.js` and `goal-date-updater.unit.test.js`) to securely guard the newly extracted core logic branches. Added robust validation matrices for start/target date constraints.
- **Test Infrastructure**: Created `tests/helpers/source-test-helpers.js` to standardize AST-like import lookups processing across all test suites.

### Documentation
- **Fractal Protocol Sync**: Executed comprehensive GEB protocol compliance across all new and modified modules. Added L2 tracking to `CLAUDE.md` in `shared`, `worker`, `sections`, `workspace`, and `lib`.
- **Contract Enforcement**: Ensured all newly extracted logic hosts (e.g., `config-actions.js`, `url-builder.js`) feature rigid `[INPUT]/[OUTPUT]/[POS]` L3 header contracts.

## [1.5.5] - 2026-03-01

### Infrastructure
- **Dependency Upgrades**: Synchronized packages to their latest versions, including `@base-ui/react`, `@cloudflare/kumo`, `tailwindcss`, `framer-motion`, `react-router-dom`, and other ecosystem dependencies.

## [1.5.4] - 2026-03-01

### Documentation
- **Brand Alignment**: Updated branding references from `LifeGrid` to `Jikan.life` in `MULTILINGUAL.md` examples and `wrangler.toml` header to ensure consistent project naming.

## [1.5.3] - 2026-03-01

### UI & UX
- **Color Picker**: Ensured the HEX input field is always visible regardless of the selected color space for more convenient color code entry.

## [1.5.2] - 2026-03-01

### Architecture
- **Legacy UI Purge**: Deleted unused legacy localized UI components (`card.jsx`, `field.jsx`, `label.jsx`, `separator.jsx`, `button.jsx`) from `src/components/ui/`.
- **UI Convergence**: Switched `ColorPicker` to directly consume Kumo Button primitives, eliminating the need for the intermediate button adapter.
- **Dependency Optimization**: Removed redundant UI dependencies (`@radix-ui/react-label`, `@radix-ui/react-separator`, `@radix-ui/react-slot`, `class-variance-authority`) from `package.json` to streamline the tree.

### Documentation
- **Fractal Protocol**: Synchronized `src/components/ui/CLAUDE.md` to reflect the removal of all deleted legacy UI components.
- **Dependency Audit**: Added `ghost-dependency-investigation-2026-03-01.md` documenting the native Kumo dependency tree origins for `@base-ui/react` and `react-day-picker`.

### Tests
- **Migration Guards**: Expanded `kumo-migration.behavior.test.js` to assert the removal of legacy UI components and cleaned up outdated structural assertions for the legacy button adapter.

## [1.5.1] - 2026-03-01

### Documentation
- **Contribution Guidelines**: Updated `CONTRIBUTING.md` to clarify the Kumo UI migration, add UI token and GEB protocol checklists, and correct the dev command descriptions.
- **Project Meta**: Bumped version to 1.5.0 and updated license to Apache-2.0 in `package.json`.


### Documentation
- **README Refinement**: Redesigned the project README for better visual clarity, including a centralized logo, badges, a unified architecture diagram, and an improved project structure overview.
- **Fractal Protocol**: Conducted a comprehensive L3 header audit across all 76 business source files, fixing minor inaccuracies in `badge.jsx`, `i18n.js`, `devices.js`, and `worker/i18n.js`.
- **Dependency Cleanup**: Removed 8 unused packages (`react-colorful`, `lucide-react`, `html-to-image`, `@hookform/resolvers`, `react-hook-form`, `@radix-ui/react-dropdown-menu`, `tailwind-variants`, `shadcn`), eliminating over 300 transitive dependencies from the node_modules tree.
- **Dependency Upgrades**: Synchronized all outdated packages to their latest versions, including `@base-ui/react`, `@cloudflare/kumo`, `tailwindcss`, and `wrangler`.
- **Infrastructure**: Conducted a full dependency audit to map architectural usage and ensure zero-vulnerability integrity.

### Architecture
- **Legacy UI Purge**: Deleted legacy localized UI wrapper `dropdown-menu.jsx` to complete migration to Kumo primitives.
- **CSS Architecture**: Migrated global CSS tokens in `src/index.css` from legacy semantic classes (`border-border`, `bg-background`) to official Kumo native tokens (`kumo-line`, `kumo-base`) for base layer. Further migrated custom page styling to standard Kumo text and border tokens (`--text-color-kumo-default`, `--color-kumo-line`, `--color-kumo-recessed`).

### State Management
- **Color State Bridge**: Refactored `useColorPickerStateBridge` optimization by extracting the external hex evaluation into an independent `useMemo`, preventing circular re-renders with `internalColor` and ensuring precise color injection.

### Documentation
- **Fractal Protocol**: Conducted a comprehensive L3 header audit across all 76 business source files, fixing minor inaccuracies in `badge.jsx`, `i18n.js`, `devices.js`, and `worker/i18n.js`.
- **Fractal Protocol**: Synchronized L2 module maps in `sections/CLAUDE.md`, `registry/CLAUDE.md`, `doc/CLAUDE.md`, `dist/CLAUDE.md`, and `dist/api/CLAUDE.md` with actual directory inventories. Removed stale references from L1 map.
- **Fractal Protocol**: Synchronized `src/CLAUDE.md`, `src/components/ui/CLAUDE.md`, and `tests/CLAUDE.md` to reflect the latest color picker optimization and strict token usage.

### Tests
- **Migration Guards**: Expanded `kumo-migration.behavior.test.js` to assert the removal of legacy `dropdown-menu.jsx` and enforce the Kumo-prefixed token requirements in the CSS base layer. Validated the `useColorPickerStateBridge` structural integrity and specific setup text overrides.
- **HEX Input Guards**: Added 8 assertions verifying `commitHexInput` extraction, uncontrolled `key`/`defaultValue` pattern, `onBlur`/`onKeyDown` commit handlers, and absence of inline `onChange` parsing.

## [1.5.0] - 2026-02-28

### Architecture
- **Official Kumo Migration**: Finalized the transition to the official `@cloudflare/kumo` design system packages. Completely removed the `vendor/kumo` Git submodule, establishing single-source-of-truth imports from npm.
- **Legacy UI Purge**: Deleted over 30 legacy localized UI wrappers (including `calendar.jsx`, `date-picker.jsx`, `dialog.jsx`, `form.jsx`, `sheet.jsx`, etc.) from `src/components/ui/`, redirecting all application imports directly to Kumo primitives.
- **Legacy Layout Cleanup**: Removed deprecated architectural components such as the `DesignSystem` page and legacy layout shells (`KumoShell`, `Header`, `Footer`).
- **Dependency Optimization**: Cleaned up `package.json` to reflect the streamlined React and Vite stack, removing redundant UI dependencies and obsolete `match-sorter-shim` overrides.

### UI & UX
- **Skeleton Base**: Implemented a progressive six-slot skeleton layout (`SkeletonLine`) in `HomeSettingsPane` before a style is selected, providing a clearer visual structure for the empty state.
- **AutoFlow Onboarding**: Added an automatic reveal sequence (AutoFlow) in `HomeGrid` that progressively displays settings cards upon first visit, enhancing the onboarding experience.
- **Empty State Hints**: Updated `HomePreviewPane` to display a "select-type" hint when no wallpaper style is selected, and refactored `HomePage` to initialize `selectedStyle` to `null` instead of defaulting to `"year"`.
- **Scroll Containment**: Reset overscroll behavior on `md` breakpoints (`md:overscroll-y-auto`) for `HomeGrid` to handle the shift of main scrolling context to the outer container.
- **Rail Layout Alignment**: Refactored the positioning of `ThemeToggle` in `HomePage` and the menu toggle button in `HomeSidebar` to use CSS Grid (`grid place-items-center`) instead of absolute positioning, ensuring perfect vertical and horizontal centering within their respective desktop tool rails.

### Architecture
- **Kumo Components**: Exported `SkeletonLine` from the unified `kumo.jsx` interface to support page-level placeholders.

### Documentation
- **Visual Assets**: Added `screenshots/design-page.png` to document the latest design iteration of the registry page.
- **Fractal Protocol**: Synchronized `CLAUDE.md` maps across `src/components/ui`, `src/pages/registry`, and its subdirectories to document the new `SkeletonLine` export and AutoFlow architecture. Updated L3 headers in `useHomeWallpaperConfig.js`.

### Tests
- **Import Assertions**: Refactored `kumo-migration.behavior.test.js` to replace brittle Regex `assert.match` import checks with a robust `assertNamedImports` helper. This ensures reliable validation of named imports and prevents false positives during dependency audits.
- **UI & AutoFlow Constraints**: Expanded `kumo-migration.behavior.test.js` to enforce structural constraints on the `HomePage` empty state initialization, the AutoFlow sequence local storage implementation, and the official `SkeletonLine` integration within `HomeSettingsPane`.
- **Scroll Integrity**: Added assertions in `kumo-migration.behavior.test.js` to verify the new `md:overscroll-y-auto` utility class on `HomeGrid`.
- **Rail Layout Constraints**: Added assertions in `kumo-migration.behavior.test.js` to verify the CSS Grid centering logic (`place-items-center`) for both `HomePage`'s ThemeToggle container and `HomeSidebar`'s header rail box.

## [1.1.12] - 2026-02-27

### Features
- **i18n Automation**: Codified fixed translation principles (Accuracy, Fluency, Conciseness, Consistency) and prompt templates in `CONTRIBUTING.md` and `MULTILINGUAL.md` to standardize future AI-driven localization workflows.

### UI & UX
- **Mobile Layout**: Hid the duplicated `HomeTopbar` on mobile devices (`hidden md:block`) to prevent double top borders, relying solely on the sticky header from `HomeSidebar`.
- **Scroll Containment**: Appended `overscroll-y-contain` to `HomeGrid`'s mobile scrolling container. Working alongside the global `overflow-y: hidden` guard, this strictly prevents trackpad/touch vertical overscroll chaining from leaking to the browser viewport.
- **Setup Guide**: Added step-level "Completed" (已完成/完了) badges to Step 1 of both iOS and Android guides in `SetupGuidePanel` to improve user orientation and setup progress clarity.
- **Goal Stats**: Refined `HomeSidebar` Goal stats display by replacing the placeholder infinity ("∞") symbol with reliable static text "Target Date" and "Tracking".
- **Localization Refinement**: Shortened "Days left" suffix from "天剩余"/"日残り" to "天"/"日" in `shared/wallpaper-core.js` and removed unused translation keys in `src/data/i18n.js` for a cleaner UI footprint.

### Tests
- **Scroll Integrity**: Updated `kumo-migration.behavior.test.js` to assert the new `overscroll-contain` rules, viewport height dynamic calculations, and the mobile topbar responsive state.

## [1.1.11] - 2026-02-27

### UI & UX
- **Setup Guide Overlay**: Refactored the layout structure of the `SetupGuidePanel` to solve an overflow clipping issue on tablet/iPad sizes (`md` breakpoints). The panel now conditionally shifts its mounting point up to the `HomeGrid` level on medium screens to ensure the sliding animation smoothly covers the entire right-side workspace.
- **Scroll Lock**: Implemented `useRegistryBlockingScrollLock` to prevent background scrolling when overlays or setup panels are active in the Registry workspace.

### Architecture
- **Font Strategy Unification**: Deprecated the local `FONT_FAMILY_BY_LANG` map in `worker/svg.js` in favor of importing `getWallpaperFontFamily` from `shared/wallpaper-core.js`, ensuring a single source of truth for font allocation across browser and worker environments.
- **State Management**: Refactored `useHomeWallpaperConfig` by extracting three disjointed goal date update routines (`setGoalRange`, `setGoalStart`, `setGoalDate`) into a single, cohesive `applyGoalDateUpdate` state transition function. This guarantees uniform validation behavior across all date-related interactions without altering the external API.
- **CSS Architecture**: Established a local variable override strategy (e.g., `--step-list-bullet-color`) over global token modification for localized semantic color adjustments.
- **Registry Overlays**: Integrated ARIA-compliant dialog attributes (`role="dialog"`, `aria-modal`) for the Setup Guide Panel to improve accessibility.
- **Dependency Map**: Upgraded frontend toolchain mapping from Vite 6 to Vite 7 in `CLAUDE.md`.

### Fixes
- **Worker XML Security**: Introduced `escapeXmlAttribute` in `worker/svg.js` to ensure the dynamically injected `font-family` string is properly escaped (e.g., converting quotes to `&quot;`), preventing XML parsing errors when shared font strings contain quotes.

### Documentation
- **Fractal Protocol**: Synchronized project guidelines in `CLAUDE.md`, explicitly codifying the Vendor Immutability rule (`vendor/kumo` is strictly read-only) and the `Surface` component isomorphism rule for Setup guide cards.
- **Fractal Protocol**: Updated `src/CLAUDE.md` and `src/index.css` L3 contracts to reflect the new scoped CSS variable strategies for Setup components.

### Tests
- **Setup Guide Layout**: Expanded `kumo-migration.behavior.test.js` to enforce structural constraints on the new `SetupGuidePanel` responsive overlay rendering, validating visibility classes for both `md` and `lg` layouts.
- **Worker Guards**: Upgraded the worker font technical debt tracker from a `test.todo` to active structural and behavioral assertions in `kumo-migration.behavior.test.js` and `worker-svg.behavior.test.js`. Validated the removal of local font maps and strict adherence to XML-safe formatting for SVG outputs.
- **Migration Guards**: Strengthened `kumo-migration.behavior.test.js` with new architectural assertions: enforcing `Surface` adoption for `SetupGuidePanel`, locking down `STEP_DESC_TEXT_CLASSNAME` references, and validating CSS variable injections for list bullets.

## [1.1.10] - 2026-02-25

### Features
- **Foreground Color**: Adopted perceptual mid-gray threshold (`0.179`) instead of linear midpoint (`0.5`) in `getContrastBase` for more accurate automatic light/dark text switching.
- **Color Override**: Implemented a backend `foregroundOverride` mechanism across Canvas and Worker SVG generators, allowing manual locking of foreground color via the `fg=light|dark` URL parameter while keeping the automatic default.
- **Goal Localization**: Refactored the Goal wallpaper to use a localized fallback string (`goalDefault`) when the goal name is empty, automatically adapting to the user's `wallpaperLang` setting.

### UI & UX
- **Setup Guide**: Refined step instructions and warning banners by adopting standard typography (`Text`, `Banner`) components from the Kumo UI library, replacing hardcoded badge styles for improved visual consistency.
- **Setup Guide Container**: Upgraded the individual step and action blocks within the `SetupGuidePanel` from native HTML `<article>` tags to the official Kumo `<Surface>` component to ensure robust design token compliance (shadows, borders, backgrounds).
- **Settings Panel**: Upgraded step indicators from hollow circles (`①~⑥`) to solid circles (`➊~➏`) in `HomeSettingsPane` to improve visual recognition.
- **Setup Guide**: Simplified the top header in `SetupGuidePanel` from a two-line layout to a single-line title (e.g., `iOS Setup` instead of `Setup` + `iOS`) to reduce visual jumping and enhance title readability. Repositioned the close button to `absolute top-2 right-2` for a more distinct interaction area.
- **Device Selection**: Optimized the device dropdown in `device-card` to conditionally display group labels only when multiple device categories are visible.

### Architecture
- **Vendor Immutability**: Restored `vendor/kumo` subtree to a clean state. Enshrined the rule in `CLAUDE.md` that vendor source files must never be directly modified; all design system customizations must occur via usage-side `className` overrides or adapter components.

### Fixes
- **Banner Layout**: Corrected vertical icon alignment in the `SetupGuidePanel` alert banner by injecting `items-start` and `mt-0.5` through usage-side `className` overrides, rather than breaking vendor encapsulation.

### Documentation
- **Fractal Protocol**: Executed full GEB protocol sync across 15 files. Updated L3 headers in `wallpaper-core`, `renderer`, `svg`, `generators/*`, `validation`, and `SetupGuidePanel` to reflect `resolveContrastBase` exports, `foregroundOverride` passthrough, `fg` validation, and `<Surface>` component migration. Synchronized L2 `CLAUDE.md` maps across `shared`, `worker`, `generators`, `tests`, `workspace`, and `lib` to document these architectural state changes.
- **Fractal Protocol**: Updated `cards/CLAUDE.md` to document the latest UI adjustments (step indicators and setup guide header changes).

### Tests
- **Migration**: Expanded `kumo-migration.behavior.test.js` to enforce structural constraints on the new `SetupGuidePanel` header layout, the `device-card` conditional group label rendering, and the integration of Kumo typography components within the setup flow.

## [1.1.9] - 2026-02-24

### Features
- **Database**: Added iPhone 17 series (Standard, Pro, Pro Max, Air) to the device database.
- **Logic**: Integrated device name normalization in `useHomeWallpaperConfig` to ensure cross-platform consistency.
- **UI UX**: Temporarily hidden Android and iPad device categories from the device selection interface to focus on iPhone support for the time being.

### Tests
- **Migration**: Synchronized `kumo-migration.behavior.test.js` to verify device sorting and normalization logic.
- Fixed migration test failure in `HomeSettingsPane.jsx` by redirecting `useKumoToastManager` import through unified `components/ui/kumo.jsx` entry.

### Tests
- **Migration**: Synchronized `kumo-migration.behavior.test.js` to verify device sorting and normalization logic.

## [1.1.8] - 2026-02-23

### Infrastructure
- **Vendor Migration**: Upgraded `@cloudflare/kumo` vendor track from `1.5.1` to `1.7.0` to acquire the official `DatePicker` component.

### Features
- **Goal Range Presets**: Added "Today" and "Next 7 days" quick-action buttons to the Goal date range picker.

### Fixes
- **Import Resolution**: Fixed `Uncaught SyntaxError` caused by missing `DatePicker` export in older Kumo versions.
- **Vite Cache**: Cleaned `.vite` pre-bundle cache to ensure new official Kumo exports are correctly indexed.

### UI & UX
- **Pangu Spacing**: Implemented automatic spacing (pangu spacing) between Latin characters/digits and CJK characters in calendar headers (e.g., `2026 年 2 月`).
- **Toast Migration**: Replaced `sonner` with Kumo `@cloudflare/kumo` `Toasty` and `useKumoToastManager` for system-wide toast notifications.
- **Palette Presets**: Refined `PALETTE_PRESETS` with high-contrast, premium color combinations (Ocean Deep, Royal Indigo, Warm Sand, Teal Night).
- **Setup Panel**: Simplified the setup guide panel UI and i18n keys by removing redundant header text.
- **Cleanup**: Removed the redundant calendar icon from the Goal date range trigger for a cleaner look.
- **I18n**: Integrated `date-fns` locales (`enUS`, `zhCN`, `zhTW`, `ja`) into official `DatePicker` for localized month/weekday display.

## [1.1.7] - 2026-02-23

### Refactored
- **Settings Architecture (Phase 2)**: Splitted the monolithic `HomeSettingsPane` into 8 independent, decoupled card components (e.g., `colors-card`, `device-card`, `life-fields-card`) within a new `cards/` directory. This drastically reduces file size and complexity, enforcing atomic design principles and paving the way for easier extensibility.

### Added
- **Settings UX Overhaul**: 
    - Implemented a more focused, full-overlay configuration experience in `HomeSettingsPane`.
    - Introduced progressive disclosure for configuration items to reduce cognitive load.
    - Integrated localized tooltips in `SettingsCardShell` for on-demand documentation.
- **Migration Safeguards**: Expanded behavioral tests in `kumo-migration.behavior.test.js` to ensure the integrity of the new settings UI and design system transitions.

### Changed
- **Settings Architecture**: Standardized "Life" and "Goal" configuration fields into standard `SettingsCardShell` components within `HomeSettingsPane`, completely eliminating the legacy fallback system for a unified, progressive setup experience.
- **Year Progress Visual**: Optimized `HomeSidebar`'s Year 10x10 dot matrix mapping to correctly handle `0%` progress while preserving the "today" indicator. Implemented a reliable cross-midnight refresh mechanism using dynamic `todayKey` state, ensuring data accuracy without requiring an app reload.
- **Branding Alignment**: Renamed `KumoMenuIcon` to `JikanMenuIcon` across the registry module to align with project naming conventions.
- **Documentation Sync**: Updated fractal documentation maps (`CLAUDE.md`) to reflect component renaming and the new settings architecture.
- **GEB Protocol Audit**: Full L1/L2/L3 synchronized — removed phantom `src/assets/` from L1 directory tree, updated `SetupGuidePanel` L3 `[POS]` to reflect Year/Goal shared Set flow, and verified `doc/CLAUDE.md` member list against current file inventory.

### Fixed
- **Migration Safeguards**: Expanded `kumo-migration.behavior.test.js` to enforce structural and behavioral constraints on the Year 10x10 visual, specifically locking down grid proportions, state mapping, and midnight data invalidation logic.

## [1.1.6] - 2026-02-22

### Changed
- **SVG Animation Refinement**: Optimized `KumoMenuIcon` animation logic by introducing utility-based motion classes and styles for better state-based scaling and translation.
- **Registry UX Polish**: Refined layout of `HomeTopbar` and `HomeSidebar` for improved visual balance.
- **Visual Assets**: Updated `favicon.svg` with improved path definitions.

### Documentation
- **Fractal Documentation Sync**: Updated `CLAUDE.md` maps in registry modules to reflect latest component structures.

## [1.1.5] - 2026-02-19

### Added
- **Validation Script**: Introduced `scripts/check-wallpaper-core.js` for automated verification of wallpaper core logic and font handling.

### Changed
- **Home Preview Refinement**: Optimized `HomePreviewPane` by removing redundant `SCREEN_WIDTH`/`HEIGHT` constants and simplifying the `drawPreview` dependency array. Enhanced the preview hint typography for better visibility.
- **Topbar Layout**: Refined `HomeTopbar` layout for improved visual balance during the settings-visual transition.
- **Settings UX**: Introduced numerical index marks (1-6) to `HomeSettingsPane` cards via `SettingsCardShell` to emphasize the progressive configuration sequence and improve flow legibility.
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
- **GEB Protocol Sync**: Performed a project-wide synchronization of L1/L2/L3 documentation. Updated file headers and module maps in `CLAUDE.md` to reflect recent architectural shifts and dependency cleanups, including the newly integrated `indexMark` feature.
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
