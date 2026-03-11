# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.8.29] - 2026-03-12

### UI & UX
- **Preview Reveal Sequence**: Enhanced the initial onboarding sequence in the workspace grid by introducing a deliberate `150ms` delay after all configuration cards are unlocked before dynamically fading in the live browser preview chrome. This avoids simultaneous visual jumps and establishes a natural, step-by-step cognitive focal path.
- **Lock Screen Isolation**: Wrapped the `LockScreenOverlay` within an independent animated container (`data-preview-overlay="lock-screen"`). This explicitly isolates DOM fade-in transitions, preventing React layout tracking or animation reflows from bleeding back into the complex SVG structural paths of the lock screen shell.

### Architecture
- **State Orchestration**: Refactored `HomePreviewPane` to explicitly consume a parent `showOverlay` boolean from the grid instead of internally computing fallback triggers, centralizing the entire onboarding display sequence up to the `HomeGrid` root boundary.
- **Timer Garbage Collection**: Guarded `HomeGrid` with a robust `autoflowTimerRef` system that structurally collects and aggressively clears pending `setTimeout`, `setInterval`, and `requestAnimationFrame` IDs on unmount, completely eradicating concurrent racing conditions during fast progression.

### Documentation & Tests
- **UI Sequence Guards**: Expanded `kumo-migration.ui.behavior.test.js` to rigidly encompass the new onboarding preview mechanics, asserting the synchronized delay variables, refs for timer disposal, strict boolean prop drilling, and physical fade-in wrapper inclusion within `LockScreenPreviewFrame`.
- **Fractal Protocol**: Applied GEB documentation sync to `tests/CLAUDE.md` documenting the 150ms reveal strategy and layout boundaries.

## [1.8.28] - 2026-03-12

### Architecture
- **Goal Ring Geometry Unification**: Extracted the Goal countdown ring drawing semantics into a shared `getGoalRingGeometry` engine (`shared/goal-ring-geometry.js`). All three rendering layers—Canvas preview (`renderer.js`), sidebar thumbnail (`home-sidebar-visuals.jsx`), and Worker SVG (`worker/generators/goal.js`)—now consume a single source of truth for visibility gating, sweep degrees, and stroke dash offset ratios, completely eradicating inline arc math duplication.
- **Completion-Based Ring Semantics**: Reversed the ring drawing direction from "remaining ratio decrement" to "completed ratio clockwise sweep". The ring now starts empty at 0% and fills clockwise to 360° at 100%, aligning with the intuitive mental model of progress accumulation.

### Documentation & Tests
- **Ring Geometry Guards**: Expanded `kumo-migration.core.behavior.test.js` to assert completed-progress semantics (`progress = elapsed / total`), multi-scenario window calculations (explicit start, fallback 30-day, past-goal saturation), and strict `getGoalRingGeometry` import presence across all three rendering layers.
- **Visual Hash Synchronization**: Updated `wallpaper-visual-snapshots.behavior.test.js` to lock down the new deterministic SHA-256 SVG hash reflecting the reversed ring sweep direction.

## [1.8.27] - 2026-03-12

### UI & UX
- **Lock Screen Universality**: Upgraded the lock screen preview shell to universally display the dynamic top status bar (cellular, wifi, battery, and top-corner time) across all wallpaper styles ("year", "life", and "goal").
- **Widget Visibility**: Introduced conditional widget rendering. The main lock screen widgets (large clock and date) are now exclusively visible when configuring the "goal" wallpaper style, eliminating visual conflicts with the core graphics of the "year" and "life" layouts.
- **Goal Geometry Refinement**: Lowered the vertical placement of the Goal countdown ring to shift the visual weight downwards. It now anchors its vertical center (`clockHeight`) dynamically based on a `0.6` factor of the minimum uniform dimension, providing breathing room for the newly introduced universal lock screen top overlay.

### Architecture
- **Preview Frame Decoupling**: Refactored `LockScreenPreviewFrame` and `LockScreenOverlay` to decouple the continuous top overlay rendering (`showOverlay`) from the main center content rendering (`showWidgets`). This architectural split allows surgical control over active preview layers based on the active `wallpaperType`.

### Documentation & Tests
- **Structural Constraints**: Updated `kumo-migration.ui.behavior.test.js` to strictly assert the new `showWidgets` props drilling and the conditional rendering boundaries of the main SVG widget grouping within `LockScreenOverlay`.
- **Layout Math Guards**: Expanded `kumo-migration.core.behavior.test.js` to assert the updated `clockHeight` calculation mapping to the new `uniformDimension` constraint.
- **Visual Hash Synchronization**: Locked down the new deterministic SHA-256 SVG hash for the Goal wallpaper in `wallpaper-visual-snapshots.behavior.test.js` to reflect the adjusted ring geometry.

## [1.8.26] - 2026-03-12

### UI & UX
- **Lock Screen Date Localization**: Upgraded the lock screen preview to format its date dynamically based on the current `wallpaperLang` setting instead of defaulting to English. Dates are now localized correctly (e.g., `3月11日 星期三` for Simplified Chinese, `3月11日 水曜日` for Japanese) with precise formatting rules, strictly mirroring native OS typography.

### Architecture
- **Date Formatting Engine**: Refactored `formatLockScreenDate` in `lock-screen-overlay.runtime.js` to accept language targets, leveraging `Intl.DateTimeFormat` to construct localized strings while explicitly enforcing a single ASCII space delimiter between the month-day and weekday for CJK locales.
- **Font Stack Resolution**: Replaced hardcoded English font fallbacks with a unified `resolveLockScreenFontFamily` mechanism. Non-Apple platforms now correctly dispatch to the official centralized `getWallpaperFontFamily` engine based on layout language.

### Documentation & Tests
- **Runtime Layout Guards**: Expanded `lock-screen-overlay-runtime.unit.test.js` to rigidly assert the exact output of multi-language date formatting strings and localized font family resolution mechanics.
- **UI Architecture Guards**: Updated `kumo-migration.ui.behavior.test.js` to enforce the consumption of `wallpaperLang` within the overlay render boundary.

## [1.8.25] - 2026-03-12

### UI & UX
- **Lock Screen Glass Scaling**: Refactored the lock screen's bottom action glass layer to render within a unified `402x874` fixed internal coordinate plane, scaling the entire container surface universally via `transform: scale()`. This completely eliminates fractional calculation artifacts when resolving bottom action dimensions and guarantees flawless edge alignment at any preview size.

### Architecture
- **Glass Offset Constraints**: Deprecated percentage-based dimension calculations (`resolveActionGlassFrameStyle`) and `calc()` positioning for dynamic lock screen glass materials. Enforced absolute pixel boundaries using `ACTION_GLASS_OFFSET_X/Y` constants to prevent arbitrary UI shifts from bleeding into the parent container layout.

### Documentation & Tests
- **Structural Integrity Guards**: Rigidly updated `kumo-migration.ui.behavior.test.js` to assert the centralized container transform, strict `overlayScale` passthrough from `LockScreenPreviewFrame`, and zero-value offset constants, explicitly forbidding legacy `calc()` computations.
- **Fractal Protocol**: Executed GEB architecture synchronization across `tests/CLAUDE.md`, `lock-screen-overlay/CLAUDE.md`, and `workspace/CLAUDE.md` to officially record the new universal scaling dimension and glass plane rendering boundaries.

## [1.8.24] - 2026-03-11

### UI & UX
- **Accent Color Lock**: Introduced an `accentMode` (`"auto"` vs `"manual"`) boundary. Manually selecting an accent color now locks it to manual mode, ensuring it stays unchanged when swapping background colors. Applying a predefined palette preset immediately restores the accent to automatic mode.

### Architecture
- **Contrast Core Engine**: Replaced the hardcoded `0.179` perceptual luminance split with precise, math-driven WCAG contrast ratios (`getContrastRatio`) across the `wallpaper-color-core.js` engine. Automatic text color assignment (`getContrastBase`) and safe accent fallback (`getSafeAccent`) now independently calculate and select whichever monochrome color produces the mathematically superior contrast ratio over the dynamic background.
- **State Initialization Boundaries**: Centralized the accent auto/manual mode tracking and default resolution deep within the `config-init.js` layer.

### Documentation & Tests
- **Contrast Constraints Guards**: Refactored the `contrast-threshold.behavior.test.js` test suite to strictly assert WCAG math calculations instead of the legacy luminance values, verifying maximum contrast assignments for pure black/white text against multiple gray fields.
- **UI Logic Guards**: Created the `accent-mode.behavior.test.js` suite to formally secure the workspace state transitions between auto/manual accent bindings on initialization, manual entry, and palette preset selection.
- **API Topology Guards**: Asserted the newly exposed `getContrastRatio` function export through `wallpaper-core-api.behavior.test.js`.
- **Fractal Protocol Sync**: Updated GEB protocol headers (`CLAUDE.md`) in `shared`, `tests`, and `src/pages/registry/sections/workspace` to document the architectural transition to WCAG contrast math and the implementation of the new `accentMode` boundary logic.

## [1.8.23] - 2026-03-11

### UI & UX
- **Lock Screen Controls Material**: Upgraded the lock screen bottom actions (flashlight, camera) from legacy static SVG fills to robust CSS glassmorphism materials. Implemented dynamic backdrop filters, borders, top/left highlights, and inner glow drop shadows that intelligently adjust their intensity and opacity based on the wallpaper background color, guaranteeing premium Apple-like visual fidelity.

### Architecture
- **Action Glass Engineering**: Extracted dynamic glass configuration into an independent `createLockScreenActionGlassMaterial` engine within `lock-screen-overlay.colors.js`. This strictly decouples the complex multi-layer shadow and highlight layout logic from the core SVG structural markup.

### Documentation & Tests
- **Visual Integrity Guards**: Expanded unit tests (`lock-screen-overlay-colors.unit.test.js`) to rigidly assert the RGBA structural states of the new glass material engine across extreme dark, extreme light, and medium-saturated backgrounds.
- **Structural Constraints**: Adapted `kumo-migration.ui.behavior.test.js` to enforce the absolute structural presence of `backdropFilter`, layer blending properties (`mixBlendMode`), and rendering passes of the dynamic background material.
- **Fractal Protocol**: Executed GEB architecture synchronization across `workspace/CLAUDE.md`, `lock-screen-overlay/CLAUDE.md`, and `tests/CLAUDE.md` to reflect the new dynamic glass engineering module and expanded CSS boundaries.

## [1.8.22] - 2026-03-11

### UI & UX
- **Lock Screen Controls**: Upgraded the lock screen preview overlay bottom action controls (flashlight and camera) from a static SVG asset to dynamic runtime SVG paths. These controls now accurately inherit their foreground color from the dynamic background contrast engine, instantly adapting to pure white on dark backgrounds and pure black on light backgrounds to ensure perfect visibility.

### Architecture
- **Preview Assets Decoupling**: Deleted the static `lock-screen-controls.svg` asset and extracted its structural geometry and rendering metadata into an isolated `lock-screen-overlay.controls.js` module. This completes the eradication of monolithic Figma SVG assets from the lock screen preview shell, enabling precise programmatic control over individual UI components.

### Documentation & Tests
- **Fractal Protocol**: Executed full GEB architecture synchronization across `public/preview/CLAUDE.md`, `public/preview/iPhone/CLAUDE.md`, `workspace/CLAUDE.md`, `lock-screen-overlay/CLAUDE.md`, and `tests/CLAUDE.md`, reflecting the removal of the static asset and the introduction of the new dynamic controls module.
- **Visual Structure Guards**: Updated `kumo-migration.ui.behavior.test.js` to strictly forbid the legacy `<image>` reference to `lock-screen-controls.svg`, now asserting the precise frame definitions (`ACTION_LEFT_FRAME`, `STACK_FRAME`) and the new controls module exports.
- **Visual Integrity Guards**: Expanded unit tests (`lock-screen-overlay-colors.unit.test.js`) to rigidly assert the contrast behavior of the new `action-left-icon` and `action-right-icon` color mappings.

## [1.8.21] - 2026-03-11

### Architecture
- **Color Token Parity**: Migrated lock screen overlay top status elements (home indicator, status bar, battery, wifi, cellular) from absolute hex codes and contextual text tokens to the strict structural tokens (`var(--color-white)` and `var(--color-black)`), solidifying absolute contrast boundaries across runtime configurations.

### Documentation & Tests
- **Visual Integrity Guards**: Updated `lock-screen-overlay-colors.unit.test.js` to strictly assert the new pure white and pure black structural design tokens.
- **Fractal Protocol**: Executed GEB architecture synchronization in `tests/CLAUDE.md` to formally document the transition to pure structural tokens for lock screen top overlays.

## [1.8.20] - 2026-03-11

### Architecture
- **Theme Agnosticism**: Renamed `LockScreenDarkOverlay` to `LockScreenOverlay` and stripped out hardcoded "dark" semantic prefixes, unifying the lock screen preview into a single, theme-agnostic architecture.
- **Asset Normalization**: Migrated all lock screen static preview assets from the device-specific `public/preview/ios26001` directory to a generic `public/preview/iPhone` namespace, eliminating rigid light/dark boundaries.

### Documentation & Tests
- **Fractal Protocol**: Executed full GEB architecture synchronization across `workspace/CLAUDE.md`, `lock-screen-overlay/CLAUDE.md`, and `tests/CLAUDE.md` reflecting the component renaming and new asset paths.
- **Visual Structure Guards**: Updated `kumo-migration.ui.behavior.test.js` to rigidly enforce the new `LockScreenOverlay` interface bounds and migration to `public/preview/iPhone` runtime assets.

## [1.8.19] - 2026-03-11

### UI & UX
- **Swipe Indicator Contrast**: Upgraded the lock screen preview to calculate a sophisticated, context-aware color for the bottom swipe indicator. It now converges to measured neutral tones (light or dark) or retains hue while softening depending on the dynamic background color.
- **Dynamic Island Removal**: Removed the static pseudo "Dynamic Island" element from the lock screen UI layer to provide a cleaner, uninterrupted wallpaper preview experience.

### Architecture
- **Symbol Geometry Extraction**: Eliminated reliance on the proprietary `SF Pro` font fallback for SF Symbols (e.g., Apple Watch, Sunrise, and Umbrella icons). These icons have been entirely replaced with pure SVG paths extracted into an independent `lock-screen-overlay.symbols.js` module, guaranteeing perfect icon rendering across all operating systems.

### Documentation & Tests
- **Visual Integrity Guards**: Expanded unit tests (`lock-screen-overlay-colors.unit.test.js`) to rigidly assert the light/dark neutral convergence and hue-retention logic of the new swipe indicator color generation.
- **Structural Guards**: Updated `kumo-migration.ui.behavior.test.js` to rigidly forbid the presence of legacy `SF Pro` font declarations for symbols, hardcoded complication text, and the dynamic island layer, verifying the new pure SVG path structures.
- **Fractal Protocol**: Executed full GEB architecture synchronization across `workspace/CLAUDE.md`, `lock-screen-overlay/CLAUDE.md`, and `tests/CLAUDE.md` to reflect the extracted symbols module and new color mechanics.

## [1.8.18] - 2026-03-11

### UI & UX
- **Lock Screen Color Integration**: Enhanced the lock screen preview overlay to dynamically respond to the user's background color. The top status bar (time, battery, wifi, cellular) and home indicator now automatically adapt their color contrast—using inverse tokens on dark backgrounds and default tokens on light backgrounds—ensuring optimal visibility.

### Architecture
- **Overlay Color Engineering**: Extracted `createLockScreenTopOverlayColors` within `lock-screen-overlay.colors.js` to compute background contrast logic independently. This separation shields the top status elements and home indicator from inappropriate accent color bleed.

### Documentation & Tests
- **Visual Integrity Guards**: Expanded unit tests (`lock-screen-overlay-colors.unit.test.js`) to rigidly validate the light/dark background contrast token mapping. Extended `kumo-migration.ui.behavior.test.js` to assert the structural merging of both accent and background color profiles within `HomePreviewPane`.
- **Fractal Protocol**: Executed GEB architecture synchronization across `workspace/CLAUDE.md`, `lock-screen-overlay/CLAUDE.md`, and `tests/CLAUDE.md` reflecting the new top overlay color generation mechanics.

## [1.8.17] - 2026-03-11

### UI & UX
- **Lock Screen Real Time**: Upgraded the lock screen preview overlay to display the real 24-hour time for the main clock and the top-left status bar instead of hardcoded `9:41` and static SVG paths. The overlay now accurately refreshes automatically on the minute boundary.

### Architecture
- **Overlay Font Decoupling**: Separated the font stack responsibilities in `LockScreenDarkOverlay`. Regular text now universally follows the runtime platform font resolution (System Font or `Inter`), while SF Symbols glyphs are strictly isolated to use `SF Pro`, preventing font fallback drift on Windows/Android.
- **Time Formatting Engine**: Extended `lock-screen-overlay.runtime.js` to provide consistent 24-hour `Intl.DateTimeFormat` text (`formatLockScreenTime24`) and precise minute-boundary calculation logic (`getMsUntilNextMinute`).
- **Layout Alignment**: Corrected the lock screen widget group vertical offset from `669` to `679` to ensure perfect visual alignment with the new dynamic real-time text block geometry.

### Documentation & Tests
- **Runtime Integrity Guards**: Added unit tests to `lock-screen-overlay-runtime.unit.test.js` to rigidly assert the new 24-hour time formatting and next-minute boundary calculations.
- **Visual Structure Guards**: Expanded `kumo-migration.ui.behavior.test.js` to enforce the structural absence of old hardcoded times (`9:41`), static clock path geometries, and unchecked inline `SF Pro` declarations on regular overlay text, locking down the exact exported real time properties.
- **Fractal Protocol**: Executed full GEB architecture sync across `workspace/CLAUDE.md`, `lock-screen-overlay/CLAUDE.md`, and `tests/CLAUDE.md` reflecting the new real-time components, decoupled font mechanics, and expanded test boundaries.

## [1.8.16] - 2026-03-11

### UI & UX
- **Lock Screen Runtime**: Upgraded the lock screen preview overlay from a static Figma SVG to a dynamic runtime React component (`LockScreenDarkOverlay`). The lock screen preview now displays the real current date, automatically detects Apple/non-Apple platforms to serve the correct font stack, and automatically schedules midnight refreshes for precise date rendering.

### Architecture
- **Preview Assets Decoupling**: Deleted the monolithic static overlay asset (`lock-screen-dark-overlay.svg`) and extracted reusable sub-assets (like controls) to significantly increase the modularity of the preview shell.
- **Overlay State Bridge**: Extracted lock-screen overlay specific logic, rendering elements, and runtime constants (e.g., `LOCK_SCREEN_DARK_OVERLAY_DEFAULT_COLORS`) into an isolated `lock-screen-overlay` domain, removing hardcoded date tokens from the presentation layer.

### Documentation & Tests
- **Runtime Layout Guards**: Added `lock-screen-overlay-runtime.unit.test.js` to rigidly validate cross-environment font resolution (Apple vs Windows/Android) and midnight calculation accuracy.
- **Visual Integrity Guards**: Updated `kumo-migration.ui.behavior.test.js` to strictly assert the new overlay architecture, locking down the exact exported layer IDs, asserting the transition away from hardcoded Figma text fallback, and ensuring the runtime component bounds.
- **Fractal Protocol**: Executed full GEB architecture sync across `tests/CLAUDE.md`, `public/preview/ios26001/CLAUDE.md`, and `src/pages/registry/sections/workspace/CLAUDE.md` to reflect the new overlay component layer and the removed monolithic SVGs.

## [1.8.15] - 2026-03-10

### Documentation
- **Architecture Updates**: Updated `CONTRIBUTING.md` to reflect the Cloudflare Worker `/generate` endpoint route, added `worker/index.js` to the directory structure, and refined the pull request checklist regarding rendering layout and shared modules.
- **Root Context**: Correctly documented in `MULTILINGUAL.md` that the `I18nContext` provider is now located within `src/App.jsx` instead of the legacy `src/main.jsx`.
- **Device Support Vision**: Clarified Android support status in `README.md`, noting that while MacroDroid setup copy and Android device data reside in the codebase, the public device picker intentionally keeps the Android entry hidden to focus on the iPhone experience.

## [1.8.14] - 2026-03-10

### UI & UX
- **Goal Range Restart Flow**: Upgraded the Goal Date Range picker to support a `restart` selection behavior. Introduced a drafted selection state (`draftRange`) that isolates in-progress selections from the trigger label, guaranteeing the UI label only updates upon a complete valid range selection (`onRangeComplete`).

### Architecture
- **Vendor Path Fencing**: Enforced a strict boundary on `vendor/kumo` DatePicker imports. Fenced all underlying date picker references strictly within the local bridge (`src/components/ui/kumo.jsx`), completely eradicating legacy decentralized vendor imports across the application source code.

### Documentation & Tests
- **Fractal Protocol**: Updated GEB documentation (`tests/CLAUDE.md`) to reflect the newly introduced bridge fencing and DatePicker range restart mechanisms.
- **UI Architecture Guards**: Expanded `kumo-migration.ui.behavior.test.js` and `kumo-migration.ui.registry-shell.behavior.test.js` to rigidly assert the `draftRange` controlled state, the `rangeSelectionBehavior="restart"` attribute, and the strict isolation of direct vendor imports.

## [1.8.13] - 2026-03-10

### UI & UX
- **Goal Progress Localization**: Refactored the Goal wallpaper to use a localized fallback string (`goalDefault`) when the goal name is empty, automatically adapting to the user's `wallpaperLang` setting.
- **I18n Font Parity**: Synchronized font-family resolution for Goal name characters between the web preview and Cloudflare Worker SVG generators, ensuring flawless multi-language typography for Japanese and Chinese glyphs.

### Architecture
- **Goal Ring Geometry**: Extracted Goal ring stroke width from raw math into the centralized `GOAL_RING_STROKE_WIDTH` constant in `shared/layout-core.js`. This eliminates magic numbers and guarantees geometric parity across rendering layers.

### Documentation & Tests
- **GEB Protocol**: Executed comprehensive L3 GEB documentation header updates across `worker/generators/goal.js` and shared core modules.
- **Visual Hash Synchronization**: Leveraged `scripts/sync-wallpaper-snapshots.js` to rigidly lock down the new deterministic SHA-256 SVG hashes for the i18n font alignment.

## [1.8.12] - 2026-03-10

### Infrastructure & Tests
- **Visual Snapshot Synchronization**: Introduced `scripts/sync-wallpaper-snapshots.js` to automatically extract and synchronize deterministic SHA-256 SVG hashes from generator functions into the `wallpaper-visual-snapshots.behavior.test.js` suite.
- **Workflow Automation**: Wired `sync:wallpaper-snapshots` into the `package.json` scripts, providing a single command to safely update visual snapshot expectations after intentional typography or geometric layout adjustments.

### Documentation
- **Fractal Protocol**: Executed full L2 GEB documentation alignment across `scripts/CLAUDE.md` and `tests/CLAUDE.md` to track the new hash synchronization script and its topological relationship with the visual behavior tests.

## [1.8.11] - 2026-03-10

### UI & UX
- **Preview Scaling Strictness**: Upgraded `HomePreviewPane` to use a unified `previewScale` mathematical factor across both dimensions. This eliminates fractional scaling disparities between `scaleX` and `scaleY`, guaranteeing that the live browser preview renders with physically perfect proportions matching the final exported wallpaper.

### Architecture
- **Lock Screen Delegation**: Refactored `HomePreviewPane` to delegate lock screen frame rendering to `LockScreenPreviewFrame`, deriving shell metrics from Figma wallpaper geometry instead of hardcoded preview chrome numbers.
- **Year Geometry Constants**: Extracted `YEAR_DOT_RADIUS_SCALE` and `YEAR_TODAY_DOT_RADIUS_SCALE` from raw inline math into exported constants within `shared/layout-core.js` and `shared/wallpaper-core.js`. This centralizes the single source of truth for the Year progress visual design.

### Documentation & Tests
- **Fractal Protocol**: Executed comprehensive L3 GEB documentation header updates across tests, `worker/generators`, and UI core components.
- **UI Architecture Guards**: Added strict assertions for `LockScreenPreviewFrame` delegation, Figma metric derivations, the existence of static shell assets in `public/preview/ios26001`, and the new proportional `previewScale` semantics.

## [1.8.10] - 2026-03-10

### UI & UX
- **Preview WYSIWYG Rendering Unification**: Refactored `HomePreviewPane` to use a unified rendering strategy for all wallpaper styles ("year", "life", and "goal"). The preview now universally calculates relative `scaleX` and `scaleY` factors dynamically from base device coordinates (`baseWidth`/`baseHeight`), guaranteeing mathematically identical rendering logic and removing visual disparities between the live browser preview and the exported high-resolution wallpaper across all types.

### Tests
- **Test Architecture Reorganization**: Completely shattered the massive monolithic `kumo-migration.ui.behavior.test.js` suite into focused, context-specific semantic domains (`kumo-migration.ui.foundation.behavior.test.js`, `kumo-migration.ui.registry-shell.behavior.test.js`, and `kumo-migration.ui.bottom-tabs.behavior.test.js`). This significantly improves maintainability and parallel execution speed.
- **Preview Scaling Guards**: Expanded and adapted behavior tests to assert that `drawWallpaperPreview`, `scaleX`, and `scaleY` are applied universally for all configured wallpaper types instead of exclusively targeting the goal layout.

## [1.8.9] - 2026-03-10

### UI & UX
- **Goal Ring WYSIWYG Parity**: Refactored the Goal countdown ring rendering in `HomePreviewPane`. By applying a dynamic `previewScale` and explicitly drawing from the base device coordinate system (`baseWidth`/`baseHeight`), the browser preview now perfectly reflects the exact scaled stroke width (`ringStrokeWidth`) of the final exported wallpaper, eliminating visual discrepancies.

### Architecture
- **Layout Math Calibration**: Calibrated the baseline Goal `ringStrokeWidth` from 6 to 8 in `shared/layout-core.js` to ensure the exported SVG stroke maintains elegant proportions at native device resolutions.

### Tests
- **Preview Scaling Guards**: Expanded `kumo-migration.ui.behavior.test.js` to strictly assert the new `ctx.scale` matrix isolation and coordinate scaling for the Goal countdown preview.
- **Visual Hash Synchronization**: Updated `wallpaper-visual-snapshots.behavior.test.js` to lock down the new reference SVG hash resulting from the thickness adjustment.

## [1.8.8] - 2026-03-10

### Architecture
- **Dynamic Font Loading Engine**: Optimized Cloudflare Worker memory consumption by implementing `resolveFontBufferLanguages` in `shared/wallpaper-core.js`. The Worker now intelligently detects specific CJK scripts (JP/SC/TC) present in the `goalName` and dynamically loads only the strictly necessary font buffers (`Noto Sans`) during SVG-to-PNG conversion, eradicating the brute-force inclusion of all CJK fonts.
- **Font Face Pre-declaration**: Synchronized Web (`src/lib/renderer.js`) and Worker (`worker/svg.js`) environments to explicitly pre-declare `Noto Sans JP`, `SC`, and `TC` within the SVG `<style>` `@import` definitions. This ensures flawless multi-language typography fallback for raw SVG exports without relying on local system fonts.

### Documentation & Tests
- **Fractal Protocol Sync**: Executed full L2 documentation alignment across `shared/CLAUDE.md`, `src/lib/CLAUDE.md`, `worker/CLAUDE.md`, and `worker/generators/CLAUDE.md`, documenting the new script detection utilities and the shift to intelligent font buffer loading.
- **Typography Guards**: Expanded `kumo-migration.core.behavior.test.js`, `wallpaper-core-api.behavior.test.js`, and `wallpaper-visual-snapshots.behavior.test.js` to strictly assert the presence of script detection functions (`hasJapanese`, etc.) and to validate the exact `@import` URL payload constraints across both rendering environments, guaranteeing typographic parity.

## [1.8.7] - 2026-03-10

### Architecture
- **Time Source Unification**: Unified the "current day" timezone evaluation logic across both the Canvas renderer and Worker SVG generators. Extracted the `referenceDateData` initialization in worker scripts (`goal.js`, `life.js`) to strictly invoke `getJikanPaddedDate` from `shared/date-math.js`, completely eradicating hydration disparities and ensuring week progress calculations perfectly align.
- **Goal URL Encoding**: Solidified Goal Name URL metric encoding. Extended `url-builder.js` and worker payload extraction to correctly preserve and parse Chinese characters, preventing garbled text boundaries.

### UI & UX
- **WYSIWYG Parity**: Synchronized geometric layout tokens (e.g., `clockHeight`) between `src/lib/renderer.js` and `worker/svg.js` to guarantee perfect What-You-See-Is-What-You-Get parity for the Goal wallpaper across the web preview and downloaded final output.
- **Life Calendar Current Week**: Corrected the visual identification logic of the current week within the Life wallpaper 10x10 dot matrix, guaranteeing visual consistency across both rendering layers.

### Documentation & Tests
- **Fractal Protocol Sync**: Executed full L2 GEB documentation alignment across `shared/CLAUDE.md`, `src/lib/CLAUDE.md`, `worker/CLAUDE.md`, and `worker/generators/CLAUDE.md`, explicitly tracking the single source of truth for time padding and unified geometry logic.
- **WYSIWYG Core Guards**: Expanded `kumo-migration.core.behavior.test.js`, `date-math.unit.test.js`, and `wallpaper-visual-snapshots.behavior.test.js` to rigidly assert exact parity of rendering logic, encoding robustness, and cross-environment time consistency.

## [1.8.6] - 2026-03-10

### Architecture
- **Workspace Decoupling**: Finalized the complete decoupling of the `md` layout tier segmented bottom tabs. Extracted the complex logic from `HomeSettingsPane` into independent layout blocks, significantly enhancing single-responsibility.
- **Unified Segmented Flow**: Transitioned both the `mobile` layout tier and the `md` open-sidebar configurations into a unified segmented workspace flow, solidifying the structural handling of constrained responsive spaces.

### UI & UX
- **Performance Optimization**: Optimized the `md` bottom tabs by resolving synchronous resize edge cases and disabling visual transitions during active layout resizing. This entirely prevents UI flickering and jank during dynamic window adjustments.

## [1.8.5] - 2026-03-10

### Architecture
- **Segmented Workspace Architecture**: Generalized the specific `md` bottom-tabs layout condition (`useMdBottomTabsLayout`) into a broader `useSegmentedWorkspaceLayout` via the newly introduced `shouldUseSegmentedWorkspace` entity in `effective-layout-tier.js`. This efficiently routes both the `mobile` layout tier and the `md` open-sidebar configurations through the same decoupled layout logic, entirely unifying the structural handling of constrained responsive spaces.

### Documentation & Tests
- **Fractal Protocol**: Documented the architectural shift from `useMdBottomTabsLayout` to `useSegmentedWorkspaceLayout` within `src/pages/registry/CLAUDE.md`, `src/pages/registry/sections/workspace/CLAUDE.md`, and `tests/CLAUDE.md`, mapping out the expanded responsibilities of the segmented setup.
- **Responsive Logic Guards**: Updated `kumo-migration.ui.behavior.test.js` to rigidly assert the boundaries of the unified `useSegmentedWorkspaceLayout` variable and container classnames. Expanded the `registry-effective-layout.unit.test.js` matrix to explicitly lock down the routing of the `mobile` tier into the segmented workspace while protecting desktop shells.

## [1.8.4] - 2026-03-10

### Architecture
- **Bottom Tabs Performance Constraint**: Replaced runtime `Array.from` flex class generation in `HomeSettingsPaneBottomTabsLayout` with a pre-compiled `MD_BOTTOM_TAB_TRIGGER_CLASSNAMES` constant array. This structurally eliminates dynamic array instantiation during render cycles, completely stabilizing DOM flex boundaries.

### UI & UX
- **Mobile Footer Guard**: Appended a `SHOW_MOBILE_FOOTER` strict feature gateway in `HomePage.jsx` to dynamically control the instantiation of the mobile interaction footer.

### Tests
- **UI Architecture Guards**: Expanded `kumo-migration.ui.behavior.test.js` to rigidly forbid dynamic tab width iteration, asserting the new pre-compiled flex array constraints and the new `useMdBottomTabsLayout` layout variable.
- **Width Algorithmic Guards**: Expanded unit tests (`md-bottom-tabs-widths.unit.test.js`) boundary testing to assert that surplus container width is shared completely evenly across segmented tabs once baseline natural targets are matched.

## [1.8.3] - 2026-03-09

### Infrastructure
- **Version Synchronization Engine**: Implemented `scripts/sync-changelog-version.js` to automatically parse the latest version string from `CHANGELOG.md` and synchronize it into `package.json`. Integrated this seamlessly into the local `pre-commit` git hook, establishing the changelog as the single source of truth for repository versioning.

### Architecture
- **JSX Extraction Finalization**: Finalized the extraction of the `HomeSettingsPaneBottomTabsLayout` component layout layer from `HomeSettingsPane`, cleanly completing the structural decoupling of the `md` tier settings interface.

### Documentation & Tests
- **Fractal Protocol**: Updated component L2 and L3 records across `tests/CLAUDE.md`, `scripts/CLAUDE.md`, and `src/pages/registry/sections/workspace/CLAUDE.md` to reflect the new version synchronization hook and the bottom tabs extraction.
- **UI Architecture Guards**: Adapted `kumo-migration.ui.behavior.test.js` to rigidly assert the boundaries of the newly isolated `HomeSettingsPaneBottomTabsLayout` source block.

## [1.8.2] - 2026-03-09

### Architecture
- **Bottom Tabs Decoupling**: Completely decoupled the `md` layout tier segmented bottom tabs logic from the monolithic `HomeSettingsPane`. Extracted the complex DOM measurement and resize observation logic into a dedicated `useMdBottomTabsMetrics` hook, and isolated the bottom tabs layout construction into an independent `HomeSettingsPaneBottomTabsLayout` component block. `HomeSettingsPane` now acts strictly as a state orchestrator, vastly improving code clarity and runtime stability.
- **Constants Consolidation**: Extracted hardcoded constants (e.g., the 6-slot skeleton bounds) into shared tokens like `MD_BOTTOM_TABS_SLOT_COUNT` and `SETTINGS_SLOT_MARKS` to ensure a single source of truth across the workspace layout.

### Documentation & Tests
- **Fractal Protocol**: Synchronized L2 module maps in `sections/workspace/CLAUDE.md` and `tests/CLAUDE.md` to document the new `use-md-bottom-tabs-metrics.js` hook.
- **UI Architecture Guards**: Updated `kumo-migration.ui.behavior.test.js` to rigidly assert the usage of the new centralized slot constants and independent title-skelton behaviors rather than brittle hardcoded arrays.

## [1.8.1] - 2026-03-09

### UI & UX
- **Bottom Tabs Performance**: Optimized the `md` layout tier segmented bottom tabs in `HomeSettingsPane`. Migrated from deferred `requestAnimationFrame` measurements to synchronous layout effects. Natural width measurements are now rigidly cached in refs, and continuous window resizing selectively suspends the active tab indicator transition, entirely eliminating resize jitter and animation lag.

### Documentation & Tests
- **Fractal Protocol**: Updated structural tracking in `workspace/CLAUDE.md` and `tests/CLAUDE.md` reflecting the new synchronous resize and indicator handling constraints.
- **Performance Guards**: Expanded `kumo-migration.ui.behavior.test.js` to rigidly assert the synchronous width initialization, `naturalTabWidthsRef` caching strategy, and conditional indicator transition logic.

## [1.8.0] - 2026-03-09

### UI & UX
- **Segmented Bottom Tabs (MD)**: Refactored the `md` layout tier (tablet) settings pane to utilize a sticky bottom tab bar for navigation when the sidebar is open. Implemented a sophisticated width distribution algorithm (`resolveMdBottomTabWidths`) that accurately balances natural label widths against available container space, ensuring tabs occupy the full width synchronously without horizontal scrolling or premature truncation.
- **Empty State Skeletons**: Enhanced the bottom tabs component to gracefully handle empty states by rendering structural skeletons (`SettingsTabLabelSkeleton` and `SettingsCardTitleSkeleton`) prior to configuration initialization, maintaining layout stability during the setup sequence.

### Architecture
- **MD Layout Transformation**: Decoupled the `md` open-sidebar layout from the monolithic `lg` layout grids and `mobile` lists. Introduced a localized `HomeSettingsPaneBottomTabsLayout` architecture that explicitly mounts a single focal card and manages its transition state independently via the new `md-bottom-tabs` segmented control.

### Tests
- **Bottom Tabs Constraints**: Introduced dedicated unit test suite (`md-bottom-tabs-widths.unit.test.js`) to strictly validate the width leveling and shrinking algorithmic semantics.
- **UI Architecture Guards**: Expanded `kumo-migration.ui.behavior.test.js` to rigorously assert the structural boundaries, rendering properties, and skeleton loading sequences of the new `md` bottom tabs wrapper.

## [1.7.27] - 2026-03-09

### Architecture
- **Desktop Shell Engine**: Introduced `shouldUseDesktopWorkspaceShell` to `effective-layout-tier.js` to intelligently route `md` tier (tablet) widths into the full desktop shell architecture when the sidebar is closed. This provides a fluid, unified configuration layout on iPads and smaller desktop windows without forcing the mobile overscroll paradigm unnecessarily.
- **Layout Decoupling**: Refactored `HomeGrid` to decouple physical layout tiers (`effectiveLayoutTier`) from localized pane tiers (`paneEffectiveLayoutTier`), removing bloated layout overrides from nested components like `HomeSettingsPane` and establishing a clean, unidirectional layout flow.

### Tests
- **Responsive Logic Guards**: Expanded unit tests (`registry-effective-layout.unit.test.js`) and UI behavior tests (`kumo-migration.ui.behavior.test.js`) to rigorously validate the `md` closed sidebar state boundaries and guarantee that physical tier properties remain unmutated across state shifts.

## [1.7.26] - 2026-03-08

### UI & UX
- **Goal Date Range Responsive**: Replaced hardcoded pixel values (`252px`/`276px`/`544px`) in the Goal date range popover with CSS variable derivations (`--rdp-day-width`, `--rdp-months-gap`), retaining the viewport-driven compact/wide behavior while eliminating coupling to Kumo internal sizing constants. Compact mode still stacks to single-month and hides the "Next 90 days" preset; wide mode restores dual-month side-by-side layout.
- **Card Title i18n**: Migrated hardcoded card titles (`"Goal"`, `"Life"`) to i18n keys (`config.goal`, `config.life`) across `goal-fields-card` and `life-fields-card`, with translations added for all four languages (EN/CN/TW/JA).
- **Preset Buttons Refactor**: Refactored inline preset buttons to a declarative `PRESETS` array with `.map()` rendering and `data-preset` attributes for cleaner structure and testability.

### Tests
- **Responsive Logic Guards**: Expanded `kumo-migration.ui.behavior.test.js` with comprehensive assertions for the viewport-driven compact/wide mode: CSS variable derivation constants, `matchMedia` listener setup, `datePickerStyles` conditional structure, `visiblePresets` filtering, popover alignment/width switching, and absence of legacy DOM measurement APIs (`ResizeObserver`, `requestAnimationFrame`, `querySelector`).
- **i18n Guards**: Added assertions to verify `config.goal` and `config.life` translation keys exist in all four language blocks and that legacy hardcoded titles are fully eradicated.

## [1.7.25] - 2026-03-07

### UI & UX
- **Setup Guide Layout**: Enhanced the `md` responsive layout tier for the Setup Guide panel (`SetupGuidePanel`). The guide host now dynamically reacts to the `sidebarOpen` state, automatically shifting its left boundary to prevent overlapping the "Choose your style" drawer when the sidebar is active.

### Architecture
- **State Passthrough**: Updated `HomePage` to explicitly pass the `sidebarOpen` state down into `HomeGrid`, establishing a clean data flow for the guide host width calculations.

### Tests
- **Responsive Logic Guards**: Expanded `kumo-migration.ui.behavior.test.js` to strictly assert the new `sidebarOpen` prop drilling and the dynamic `className` calculations within `HomeGrid` that govern the Setup Guide's horizontal positioning on intermediate screens.

## [1.7.24] - 2026-03-07

### UI & UX
- **Setup Guide Polish**: Upgraded the "Completed" step badge inside `SetupGuidePanel` from a neutral `secondary` variant to an affirmative `success` semantic color to provide clearer visual recognition during the setup workflow.

### Tests
- **UI Constraints**: Synchronized `kumo-migration.ui.behavior.test.js` to strictly assert the updated `success` variant on the Setup Guide step badge.

## [1.7.23] - 2026-03-06

### Infrastructure & Performance
- **Chunk Splitting Strategy**: Implemented deterministic `manualChunks` in `vite.config.js` to split the JavaScript payload into optimized vendor groups (`react-core`, `router`, `motion`, `kumo`, `aria`, `date`, `icons`). This prevents massive monolithic bundles, unlocks parallel downloading, and significantly improves long-term browser caching efficiency.

## [1.7.22] - 2026-03-06

### Architecture
- **Mainline Integration**: Merged the mid-tier responsive layout enhancements (`colors-card` and `goal-fields-card`) into the main branch, solidifying fluid grid adaptations for intermediate screen sizes when the sidebar is active.

## [1.7.21] - 2026-03-06

### UI & UX
- **Responsive Goal Card**: Upgraded the Goal fields card to natively support the `mid` layout tier. On intermediate screens, the Goal Name and Target Date range fields now render side-by-side in an equal-width grid (`grid-cols-2`), with the date trigger button smoothly spanning its full container width.

### Tests
- **Responsive Logic Guards**: Expanded `kumo-migration.ui.behavior.test.js` to rigidly assert the structural `grid-cols-2` layout constraints and specific conditional rendering boundaries of the `goal-fields-card` under the `mid` conceptual tier.

## [1.7.20] - 2026-03-06

### UI & UX
- **Popover Stability**: Refactored `colors-card` layout and `CardField` enclosures to eradicate `space-y` CSS utilities. This prevents aggressive structural shifting when Base UI's `Popover` injects hidden visually-hidden guard elements alongside trigger targets, substituting them for resilient `mb-1.5` margins.
- **Responsive Colors Card**: Streamlined the `mid` layout tier for "year" and "goal" styles. It now retains the standard `lg` two-column configuration (`grid-cols-2`) for color pickers while intelligently hiding the dense preset palette grid, maintaining visual balance without interface crushing when the sidebar is active.

### Tests
- **UI Constraints**: Augmented `kumo-migration.ui.behavior.test.js` to rigidly forbid `space-y` variants near Select/Popover boundaries, and updated assertions to validate the new conditional rendering logic for `colors-card` presets on intermediate layout tiers.

## [1.7.19] - 2026-03-06

### UI & UX
- **Device Select Polish**: Streamlined the `device-card` configuration by hiding the explicit resolution dimensions text beneath the dropdown. This reduces visual clutter while retaining the device resolution information within the input's tooltip.

### Documentation & Tests
- **Fractal Protocol Sync**: Updated `workspace/CLAUDE.md` and `workspace/cards/CLAUDE.md` to document the new `SHOW_DEVICE_RESOLUTION_HINT` local switch.
- **UI Constraints**: Synchronized `kumo-migration.ui.behavior.test.js` to assert the structural removal of the standalone resolution text and the new descriptive label bindings.

### Infrastructure
- **Dependency Upgrades**: Synchronized packages to their latest versions in `package.json`, including `@cloudflare/kumo` to `1.10.0`, `framer-motion` to `12.35.0`, and `react-aria-components` to `1.16.0`.

## [1.7.18] - 2026-03-05

### UI & UX
- **Responsive Colors Card**: Extended the `mid` layout tier optimizations to the colors configuration card for "year" and "goal" wallpapers. The color picker now elegantly transitions into a refined two-column parameter grid (`grid-cols-2`) and a wider four-column preset grid (`grid-cols-4`) on intermediate screens, synchronizing with the responsive behavior of the URL card when the sidebar is active.

### Tests
- **Responsive Logic Guards**: Expanded `kumo-migration.ui.behavior.test.js` to strictly assert the new structural layout constraints and conditional rendering boundaries of the `colors-card` under the `mid` conceptual tier.

## [1.7.17] - 2026-03-05

### Infrastructure
- **Git Hooks Engine**: Introduced an enclosed local Git Hooks mechanism (`scripts/git-hooks`) to establish a `pre-commit` guard. It seamlessly guarantees execution of `npm run version` checks and automatically stages synchronized metadata (`README.md`, `package-lock.json`) before committing.
- **Lifecycle Integration**: Integrated `hooks:install` into local `postinstall` routines, binding the hooks registry autonomously for team environments.
- **CI Pipeline**: Strengthened `.github/workflows/ci.yml` validation pipeline to execute `npm run check:version-metadata` aggressively preventing metadata divergence from polluting mainline.

### Documentation
- **Fractal Protocol**: Extended architectural documentation (`CLAUDE.md`) in `.github/`, `scripts/`, and `tests/` to track the `git-hooks` scope boundaries and CI validation protocol changes.

### Tests
- **Infrastructure Guards**: Augmented `.behavior.test.js` matrix to rigidly assert `postinstall` sequence and explicitly trace `pre-commit` hook execution chains mapped to `package.json`.

## [1.7.16] - 2026-03-05

### Architecture
- **Version Lifecycle**: Introduced `sync-version-metadata.js` to unify the synchronization of the `README.md` version badge and `package-lock.json` top-level version metadata during the `npm version` lifecycle.
- **Migration Guards**: Transitioned from brittle stringify diffs to explicit target-field mutations for locking down the package-lock sync. Deprecated and removed legacy split commands (`sync:readme-version`, `sync:package-lock-version`).

### Documentation
- **Badge Accuracy**: Synchronized the `README.md` version badge to reflect the current active version, and added an official `i18n` language support badge.
- **Fractal Protocol**: Updated L2 member listings in `scripts/CLAUDE.md` and added architectural tracking in `tests/CLAUDE.md` to reflect the new unified version sync script.

### Tests
- **Lifecycle Guards**: Expanded `kumo-migration.ui.behavior.test.js` to strictly assert the presence of `sync/check:version-metadata` scripts and ensure legacy version sync commands are fully eradicated from `package.json`.

## [1.7.15] - 2026-03-05

### Documentation
- **I18n Flags Allocation**: Updated language representations in `README.md` to use regional emojis (🇺🇸, 🇨🇳, 🇯🇵), explicitly aligning both Simplified Chinese and Traditional Chinese with the 🇨🇳 flag.

## [1.7.14] - 2026-03-05

### Tests
- **UI Constraints**: Synchronized `kumo-migration.ui.behavior.test.js` to assert the updated `48px` global CSS tokens for topbar height and tools rail width, as well as the dynamic `h-[var(--registry-topbar-height)]` utility class in `HomeTopbar`.

## [1.7.13] - 2026-03-05

### UI & UX
- **Responsive URL Card**: Enhanced the `mid` layout tier optimizations for the URL card in both "year" and "goal" modes. Adjusted the grid column definitions (`grid-cols-[minmax(0,1fr)_auto]`) and anchored spacing to prevent the “Set it” button from wrapping or being crushed on tablet-sized windows when the sidebar is open.
- **Setup Guide Accessibility**: Strengthened the closing semantics of `SetupGuidePanel`. The dormant aside panel is now structurally isolated using `inert` and `aria-hidden={!open}` attributes, ensuring screen readers and keyboard focus do not accidentally enter the hidden drawer.
- **Keyboard Navigation**: Implemented a focus-return mechanism for the `Set it` button. Opening the Setup Guide now captures the triggering element (`event.currentTarget`) and automatically restores keyboard focus to it when the guide is closed, preserving the user's tab flow.

### Architecture
- **Guide Host Truth Source**: Consolidated the `SetupGuidePanel` mounting logic. Extracted the tier condition into a single source of truth (`shouldRenderGridGuideHost` and `shouldRenderPaneGuideHost`) within `HomeGrid` and passed it down to `HomeSettingsPane`, eliminating duplicated and potentially conflicting layout rules.
- **L3 Contract Enforcement**: Updated L3 header documentation in `worker/generators/*.js` to standardize the fractal sync protocol target to `CLAUDE.md`.

### Tests
- **UI Behavioral Guards**: Massively expanded `kumo-migration.ui.behavior.test.js` to assert the new `mid` responsive layout constraints, the `onClick` event delegation for focus recovery, the `inert`/`aria-hidden` attribute toggles, and the centralized `shouldRenderPaneGuideHost` prop drilling logic.

## [1.7.12] - 2026-03-04

### Documentation
- **GEB Protocol Audit**: Full L2 parent link integrity sweep — fixed 4 broken parent references (`icons/` and `ui/` pointed to `/src/CLAUDE.md` instead of `/src/components/CLAUDE.md`; `sections/components/` and `sections/workspace/` pointed to `registry/CLAUDE.md` instead of `sections/CLAUDE.md`).
- **GEB Member Completeness**: Backfilled 12 missing members in `registry/CLAUDE.md` (HomeSidebar 3-layer split + workspace modularization files) and 3 missing members in `doc/CLAUDE.md` (`ghost-dependency-investigation`, `PLAN_REVIEW_REPORT`, refactoring plan).
- **GEB Formatting**: Fixed `.github/CLAUDE.md` where `[PROTOCOL]` tag was embedded inside member description.

## [1.7.11] - 2026-03-04

### Chore
- **Testing Artifacts Cleanup**: Removed stale Playwright visual testing snapshot images (`output/playwright/*.png`) from the repository to reduce repository bloat.
## [1.7.10] - 2026-03-04

### Architecture
- **Mainline Integration**: Merged the mid-tier responsive layout enhancements into the main branch. This brings fluid, non-collapsing grid layouts to intermediate screen sizes (1024-1314px) when the sidebar is active.
## [1.7.9] - 2026-03-04

### UI & UX
- **Responsive Goal URL Card**: Extended the `mid` layout tier optimizations to the "goal" wallpaper configuration. Extracted the tight grid layout logic into `renderMidAnchoredUrlRow` and applied it to both Year and Goal URL cards when the sidebar is open on intermediate screens, preventing button truncation.

### Documentation & Tests
- **Responsive Logic Guards**: Expanded `kumo-migration.ui.behavior.test.js` to assert the structural layout constraints of the `url-card` under the `mid` tier for the "goal" type, ensuring layout parity with the "year" type.
- **Fractal Protocol**: Updated `tests/CLAUDE.md` to reflect the expanded scope of URL card responsive layout tests.
## [1.7.8] - 2026-03-04

### UI & UX
- **Responsive URL Card**: Refactored the `url-card` to specifically handle the `mid` layout tier when configuring the "year" wallpaper. It now transitions to a tight grid layout (`grid-cols-[minmax(0,1fr)_auto]`) that anchors the title on the left and the button on the right, preventing the button from being aggressively squeezed or wrapping awkwardly on intermediate screens.

### Architecture
- **State Passthrough**: Updated `HomeSettingsPane` to inject `effectiveLayoutTier` into the card view model, allowing individual settings cards to make micro-layout adjustments based on the fluid desktop shell state.

### Documentation & Tests
- **Fractal Protocol**: Updated `tests/CLAUDE.md` to document the new responsive test constraints.
- **Responsive Logic Guards**: Expanded `kumo-migration.ui.behavior.test.js` to assert the specific `grid` layout boundaries and class compositions of the `url-card` under the `mid` conceptual tier.
## [1.7.7] - 2026-03-04

### UI & UX
- **Layout Alignment**: Standardized the registry topbar height and tools rail width from `49px` to `48px` in global CSS tokens (`index.css`), ensuring strict grid adherence. Unified the `HomeTopbar` height definition to explicitly consume the `--registry-topbar-height` variable instead of the hardcoded `h-12` utility.
- **Workspace Background**: Applied the `md:bg-kumo-elevated` token to the `HomePage` main content area, visually separating the core registry grid from the base page background on desktop shells.
## [1.7.6] - 2026-03-04

### Architecture
- **Responsive Engine Upgrade**: Introduced the `mid` conceptual tier to `effective-layout-tier.js` to handle transitional screen sizes (1024px-1314px) when the sidebar is open. This bridges the gap between the strict mobile `md` layout and the full desktop `lg` layout.

### UI & UX
- **Desktop Shell Fluidity**: Upgraded `HomeGrid`, `HomeSettingsPane`, and `SettingsCardShell` to treat the new `mid` tier as part of the `isDesktopShell` context. This allows settings cards to gracefully render in a single-column grid with equal-height rows on intermediate screens, rather than collapsing into the mobile overscroll list.

### Tests
- **Responsive Logic Guards**: Updated unit tests (`registry-effective-layout.unit.test.js`) and UI behavior tests (`kumo-migration.ui.behavior.test.js`) to strictly assert the output constraints of the new `mid` tier boundaries.
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
