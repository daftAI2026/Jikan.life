/**
 * [INPUT]: 依赖 node:test/node:assert 与 tests/helpers/source-test-helpers
 * [OUTPUT]: Kumo 迁移 UI/工作区护栏测试
 * [POS]: tests/ 迁移护栏（主题一：UI 结构、布局、交互）
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { test } from "node:test"
import assert from "node:assert/strict"
import { assertNamedImports, fs, listFiles, path, pathToFileURL, readJson, readSource } from "./helpers/source-test-helpers.js"

test("Dependencies include Kumo, Base UI, and Phosphor", () => {
  const pkg = readJson("package.json")
  const deps = pkg.dependencies || {}

  assert.ok(deps["@cloudflare/kumo"], "@cloudflare/kumo dependency missing")
  assert.ok(deps["@base-ui/react"], "@base-ui/react dependency missing")
  assert.ok(deps["@phosphor-icons/react"], "@phosphor-icons/react dependency missing")
})

test("react-icons is removed from dependencies", () => {
  const pkg = readJson("package.json")
  const deps = pkg.dependencies || {}

  assert.equal(deps["react-icons"], undefined)
})

test("version metadata sync script is wired into npm version lifecycle", () => {
  const pkg = readJson("package.json")
  const scripts = pkg.scripts || {}

  assert.ok(scripts["sync:version-metadata"], "sync:version-metadata script missing")
  assert.ok(scripts["check:version-metadata"], "check:version-metadata script missing")
  assert.match(
    scripts.version || "",
    /sync:version-metadata/,
    "version lifecycle should include unified version metadata sync"
  )
  assert.equal(scripts["sync:readme-version"], undefined, "legacy sync:readme-version should be removed")
  assert.equal(scripts["sync:package-lock-version"], undefined, "legacy sync:package-lock-version should be removed")
})

test("version metadata sync script uses explicit lock-field checks instead of stringify diff", () => {
  const source = readSource("scripts/sync-version-metadata.js")

  assert.match(source, /const lockVersionChanged =/)
  assert.match(source, /const lockRootPackageVersionChanged =/)
  assert.match(source, /const packageLockChanged = lockVersionChanged \|\| lockRootPackageVersionChanged/)

  assert.doesNotMatch(
    source,
    /JSON\.stringify\(nextPackageLock\)\s*!==\s*JSON\.stringify\(packageLock\)/,
    "package-lock change detection should not rely on whole-object stringify diff"
  )
})

test("git pre-commit hook auto-syncs version metadata", () => {
  const pkg = readJson("package.json")
  const scripts = pkg.scripts || {}
  const hookSource = readSource("scripts/git-hooks/pre-commit")

  assert.match(
    scripts["hooks:install"] || "",
    /git config core\.hooksPath scripts\/git-hooks/,
    "hooks:install should configure repo hooks path"
  )
  assert.match(
    scripts["postinstall"] || "",
    /hooks:install/,
    "postinstall should auto-install git hooks"
  )
  assert.match(
    hookSource,
    /node scripts\/sync-version-metadata\.js/,
    "pre-commit hook should run version metadata sync"
  )
  assert.match(
    hookSource,
    /git add README\.md package-lock\.json/,
    "pre-commit hook should stage synchronized metadata files"
  )
})

test("CI pipeline enforces version metadata check", () => {
  const source = readSource(".github/workflows/ci.yml")

  assert.match(source, /Run version metadata check/)
  assert.match(source, /npm run check:version-metadata/)
})

test("index.html sets data-mode on html element", () => {
  const source = readSource("index.html")
  assert.match(source, /<html[^>]*data-mode=/)
})

test("index.css imports Kumo styles and removes dark variant", () => {
  const source = readSource("src/index.css")

  assert.match(source, /@source\s+"\.\.\/node_modules\/@cloudflare\/kumo\/dist\/\*\*\/\*\*\.\{js,jsx,ts,tsx\}";/)
  assert.match(source, /@import\s+"tailwindcss";/)
  assert.match(source, /@import\s+"@cloudflare\/kumo\/styles";/)

  assert.doesNotMatch(source, /@custom-variant\s+dark/)
  assert.doesNotMatch(source, /\n\.dark\s*\{/)
  assert.doesNotMatch(source, /--neumorphic-/)
})

test("index.css base layer uses Kumo native tokens instead of legacy semantic classes", () => {
  const source = readSource("src/index.css")

  assert.match(source, /@apply border-kumo-line outline-kumo-ring\/50;/)
  assert.match(source, /@apply bg-kumo-base text-kumo-default;/)
  assert.doesNotMatch(source, /@apply border-border outline-ring\/50;/)
  assert.doesNotMatch(source, /@apply bg-background text-foreground;/)
})

test("App routes include home entry and /app redirect", () => {
  const source = readSource("src/App.jsx")

  assert.match(source, /HomePage/)
  assert.match(source, /path=["']\/app["']/)
  assert.match(source, /Navigate to=["']\/["'] replace/)
  assert.doesNotMatch(source, /path=["']\/design["']/)
})

test("App shell uses Kumo base surface token", () => {
  const source = readSource("src/App.jsx")
  assert.match(source, /bg-kumo-base/)
})

test("P0 UI components are backed by Kumo primitives (popover re-exports Kumo primitive)", () => {
  const input = readSource("src/components/ui/input.jsx")
  const select = readSource("src/components/ui/select.jsx")
  const switchControl = readSource("src/components/ui/switch.jsx")
  const tooltip = readSource("src/components/ui/tooltip.jsx")
  const popover = readSource("src/components/ui/popover.jsx")

  assert.match(input, /@cloudflare\/kumo\/components\/input/)
  assert.match(select, /@cloudflare\/kumo\/components\/select/)
  assert.match(switchControl, /@cloudflare\/kumo\/components\/switch/)
  assert.match(tooltip, /@cloudflare\/kumo\/components\/tooltip/)
  assert.match(popover, /@cloudflare\/kumo\/components\/popover/)
})

test("Input export uses local wrapper and keeps accessible-name fallback contract", () => {
  const kumo = readSource("src/components/ui/kumo.jsx")
  const input = readSource("src/components/ui/input.jsx")

  assert.match(kumo, /export \{ Input \} from "@\/components\/ui\/input"/)
  assert.match(input, /const hasAccessibleName = Boolean\(/)
  assert.match(input, /const fallbackAriaLabel =/)
  assert.match(input, /aria-label=\{props\["aria-label"\] \?\? fallbackAriaLabel\}/)
})

test("Legacy local UI files are removed", () => {
  const root = process.cwd()
  const removedFiles = [
    "src/components/ui/calendar.jsx",
    "src/components/ui/date-picker.jsx",
    "src/components/ui/datefield.jsx",
    "src/components/ui/dropdown-menu.jsx",
    "src/components/ui/card.jsx",
    "src/components/ui/field.jsx",
    "src/components/ui/label.jsx",
    "src/components/ui/separator.jsx",
    "src/components/ui/button.jsx",
    "src/pages/registry/sections/workspace/cards/settings-card-date-picker-field.jsx",
  ]

  removedFiles.forEach((relativePath) => {
    assert.equal(
      fs.existsSync(path.join(root, relativePath)),
      false,
      `${relativePath} should be removed`
    )
  })
})

test("ColorPicker uses Kumo popover trigger/content structure without shadcn select subcomponents", () => {
  const source = readSource("src/components/ui/color-picker.jsx")

  assertNamedImports(source, "@/components/ui/popover", ["Popover"])
  assert.match(source, /<Popover\.Trigger asChild>/)
  assert.match(source, /<Popover\.Content/)
  assert.doesNotMatch(source, /SelectContent/)
  assert.doesNotMatch(source, /SelectTrigger/)
  assert.doesNotMatch(source, /SelectValue/)
})

test("ColorPicker uses KUMO visual tokens without changing state bridge behavior", () => {
  const source = readSource("src/components/ui/color-picker.jsx")
  const bridgeSource = readSource("src/components/ui/use-color-picker-state-bridge.js")

  assert.doesNotMatch(source, /rounded-xl/)
  assert.match(source, /className=\{cn\(\s*"w-full justify-start rounded-lg px-2 text-left font-normal"/)
  assert.match(
    source,
    /showValue\s*\?\s*"size-6 shrink-0 rounded-md ring ring-kumo-line"\s*:\s*"h-5 w-full rounded-md ring ring-kumo-line"/
  )
  assert.match(source, /className="truncate font-mono text-sm uppercase text-kumo-subtle"/)
  assert.match(source, /<Popover\.Content className="w-64 p-3" sideOffset=\{8\}>/)
  assert.match(source, /className="h-9 w-\[72px\] shrink-0 rounded-lg text-sm font-medium uppercase"/)
  assert.match(source, /className="h-9 min-w-0 w-0 flex-1 rounded-lg text-center font-mono text-sm uppercase"/)
  assert.match(source, /const commitHexInput = \(hexValue\) =>/)
  assert.match(source, /key=\{internalColor\.toString\('hex'\)\}/)
  assert.match(source, /defaultValue=\{internalColor\.toString\('hex'\)\}/)
  assert.match(source, /onBlur=\{\(e\) => commitHexInput\(e\.target\.value\)\}/)
  assert.match(source, /onKeyDown=\{\(e\) => \{/)
  assert.match(source, /if \(e\.key === "Enter"\)/)
  assert.match(source, /commitHexInput\(e\.currentTarget\.value\)/)
  assert.doesNotMatch(source, /handleColorChange\(parseColor\(e\.target\.value\)\)/)
  assert.doesNotMatch(source, /\{colorSpace === "hex" && \(/)
  assert.match(source, /className="flex min-w-0 items-center gap-2"/)
  assert.match(source, /bg-kumo-control/)
  assert.match(source, /ring-kumo-line/)
  assert.match(source, /focus-visible:ring-kumo-ring/)
  assert.match(source, /const COLOR_SPACE_CHANNELS = \{/)
  assert.match(source, /rgb:\s*\["red", "green", "blue"\]/)
  assert.match(source, /hsl:\s*\["hue", "saturation", "lightness"\]/)
  assert.match(source, /hsb:\s*\["hue", "saturation", "brightness"\]/)
  assert.match(source, /const channels = COLOR_SPACE_CHANNELS\[colorSpace\] \?\? null/)
  assert.match(source, /\{channels && \(/)
  assert.match(source, /\{renderChannelInputs\(colorSpace, channels\)\}/)
  assert.doesNotMatch(source, /colorSpace === "rgb"/)
  assert.doesNotMatch(source, /colorSpace === "hsl"/)
  assert.doesNotMatch(source, /colorSpace === "hsb"/)

  assert.match(source, /className="w-full aspect-square shrink-0"/)
  assert.match(source, /className="h-3 w-full rounded-full"/)
  assertNamedImports(source, "@/components/ui/use-color-picker-state-bridge", ["useColorPickerStateBridge"])
  assert.doesNotMatch(source, /function useColorPickerStateBridge\(value\)/)
  assert.match(source, /const \{ internalColor, setInternalColor \} = useColorPickerStateBridge\(value\)/)
  assert.match(source, /setInternalColor\(newColor\)/)
  assert.match(bridgeSource, /export function useColorPickerStateBridge\(value\)/)
  assert.match(bridgeSource, /const \[internalColor, setInternalColor\] = useState\(externalColor\)/)
  assert.match(bridgeSource, /const externalHex = useMemo\(\(\) => externalColor\.toString\('hex'\), \[externalColor\]\)/)
  assert.match(bridgeSource, /setInternalColor\(\(prev\) =>/)
  assert.match(bridgeSource, /prev\.toString\('hex'\) === externalHex \? prev : externalColor/)
  assert.match(bridgeSource, /\}, \[externalColor, externalHex\]\)/)
  assert.doesNotMatch(bridgeSource, /\}, \[externalColor, internalColor\]\)/)
  assert.doesNotMatch(source, /ColorAreaAbsolutePointerBridge/)
  assert.doesNotMatch(source, /BOTTOM_EPSILON/)
  assert.doesNotMatch(source, /pointer-events-none/)
  assert.doesNotMatch(source, /h-40 w-full[^\n]*border/)
  assert.doesNotMatch(source, /h-3 w-full rounded-full[^\n]*border/)
})

test("Color primitives avoid overflow clipping so thumbs stay visible", () => {
  const source = readSource("src/components/ui/color.jsx")

  assert.match(source, /size-\[192px\] shrink-0 rounded-lg ring-1 ring-kumo-line shadow-sm/)
  assert.match(source, /h-7 w-\[192px\] rounded-lg ring-1 ring-kumo-line/)
  assert.match(source, /const COLOR_THUMB_BASE_CLASS/)
  assert.match(source, /const COLOR_THUMB_OUTER_RING_CLASS/)
  assert.match(source, /const COLOR_THUMB_CENTER_DOT_CLASS/)
  assert.match(source, /const COLOR_THUMB_FOCUS_CLASS/)
  assert.match(source, /z-20 box-border size-5 rounded-\[50%\] overflow-hidden shadow-md/)
  assert.match(source, /before:bg-\[var\(--color-white\)\]/)
  assert.match(source, /after:bg-\[inherit\]/)
  assert.match(source, /data-\[focus-visible\]:ring-kumo-ring/)
  assert.doesNotMatch(source, /size-\[192px\] shrink-0 overflow-hidden/)
  assert.doesNotMatch(source, /h-7 w-\[192px\] overflow-hidden/)
})

test("No shadcn Select subcomponents remain in src", () => {
  const sourceFiles = listFiles("src").filter((file) => file.endsWith(".jsx"))
  const forbidden = [
    /\bSelectContent\b/,
    /\bSelectTrigger\b/,
    /\bSelectValue\b/,
    /\bSelectItem\b/,
    /\bSelectGroup\b/,
    /\bSelectLabel\b/,
  ]

  const offenders = sourceFiles.filter((file) => {
    const source = readSource(file)
    return forbidden.some((pattern) => pattern.test(source))
  })

  assert.equal(
    offenders.length,
    0,
    `shadcn Select subcomponents still used in: ${offenders.join(", ")}`
  )
})

test("No shadcn Tabs subcomponents remain in src", () => {
  const sourceFiles = listFiles("src").filter((file) => file.endsWith(".jsx"))
  const forbidden = [
    /\bTabsList\b/,
    /\bTabsTrigger\b/,
    /\bTabsContent\b/,
  ]

  const offenders = sourceFiles.filter((file) => {
    const source = readSource(file)
    return forbidden.some((pattern) => pattern.test(source))
  })

  assert.equal(
    offenders.length,
    0,
    `shadcn Tabs subcomponents still used in: ${offenders.join(", ")}`
  )
})

test("No deprecated TextBolder icon import remains in src", () => {
  const sourceFiles = listFiles("src").filter((file) => file.endsWith(".jsx"))
  const offenders = sourceFiles.filter((file) => /\bTextBolder\b/.test(readSource(file)))

  assert.equal(
    offenders.length,
    0,
    `TextBolder still used in: ${offenders.join(", ")}`
  )
})

test("Core presentation components use Kumo surfaces", () => {
  const badge = readSource("src/components/ui/badge.jsx")

  assert.match(badge, /@cloudflare\/kumo\/components\/badge/)
})

test("Registry layout mirrors Kumo home layout", () => {
  const source = readSource("src/pages/registry/HomePage.jsx")

  assert.match(source, /className="isolate"/)
  assert.match(source, /HomeTopbar/)
  assert.match(source, /HomeSidebar/)
  assert.match(source, /HomeGrid/)
  assert.match(source, /ThemeToggle/)
  assert.match(source, /MobileFooter/)
  assert.match(source, /md:pr-12/)
})

test("md breakpoint routes main scrolling to outer main-content container", () => {
  const homePageSource = readSource("src/pages/registry/HomePage.jsx")
  const layoutTierSource = readSource("src/pages/registry/effective-layout-tier.js")
  const homeGridSource = readSource("src/pages/registry/sections/components/HomeGrid.jsx")
  const settingsSource = readSource("src/pages/registry/sections/workspace/HomeSettingsPane.jsx")

  assert.match(layoutTierSource, /const MD_MIN = 768/)
  assert.match(layoutTierSource, /const LG_MIN = 1024/)
  assert.match(layoutTierSource, /const SIDEBAR_MID_MAX = 1314/)
  assert.match(layoutTierSource, /if \(sidebarOpen && viewportWidth <= SIDEBAR_MID_MAX\) return "mid"/)
  assert.match(homePageSource, /id="main-content"/)
  assert.match(homePageSource, /resolveEffectiveLayoutTier/)
  assert.match(homePageSource, /const effectiveLayoutTier = resolveEffectiveLayoutTier\(\{ viewportWidth, sidebarOpen \}\)/)
  assert.match(homePageSource, /const isDesktopShell = effectiveLayoutTier === "lg" \|\| effectiveLayoutTier === "mid"/)
  assert.match(homePageSource, /effectiveLayoutTier=\{effectiveLayoutTier\}/)
  assert.match(homePageSource, /registry-main-content-mobile-height/)
  assert.doesNotMatch(homePageSource, /h-\[calc\(100vh-var\(--registry-topbar-height\)\)\]/)
  assert.match(homePageSource, /md:overflow-y-auto/)
  assert.match(homePageSource, /md:overscroll-y-none/)
  assert.match(homePageSource, /isDesktopShell \? "md:overflow-y-hidden" : ""/)
  assert.match(homePageSource, /isDesktopShell \? "md:h-full" : ""/)
  assert.match(homePageSource, /isDesktopShell \? "md:h-full" : "",/)

  assert.match(homeGridSource, /relative grid/)
  assert.match(homeGridSource, /overflow-x-hidden/)
  assert.match(homeGridSource, /overflow-y-auto/)
  assert.match(homeGridSource, /overscroll-y-contain/)
  assert.match(homeGridSource, /md:h-auto/)
  assert.match(homeGridSource, /md:overflow-y-visible/)
  assert.match(homeGridSource, /md:overscroll-y-auto/)
  assert.doesNotMatch(homeGridSource, /md:overflow-visible/)
  assert.match(homeGridSource, /effectiveLayoutTier = "lg"/)
  assert.match(homeGridSource, /const isDesktopShell = effectiveLayoutTier === "lg" \|\| effectiveLayoutTier === "mid"/)
  assert.match(homeGridSource, /isDesktopShell \? "md:h-full md:grid-cols-2 md:divide-x md:divide-kumo-line md:overflow-hidden" : ""/)

  assert.match(settingsSource, /overflow-x-hidden/)
  assert.match(settingsSource, /overflow-y-auto/)
  assert.match(settingsSource, /md:h-auto/)
  assert.match(settingsSource, /md:overflow-y-visible/)
  assert.doesNotMatch(settingsSource, /md:overflow-visible/)
  assert.match(settingsSource, /effectiveLayoutTier = "lg"/)
  assert.match(settingsSource, /const isMid = effectiveLayoutTier === "mid"/)
  assert.match(settingsSource, /const isLg = effectiveLayoutTier === "lg"/)
  assert.match(settingsSource, /const isDesktopShell = isMid \|\| isLg/)
  assert.match(settingsSource, /isDesktopShell \? "md:h-full md:overflow-y-hidden" : ""/)
})

test("Registry page applies global x/y-axis overscroll guard and blocking state attributes", () => {
  const homePageSource = readSource("src/pages/registry/HomePage.jsx")
  const cssSource = readSource("src/index.css")

  assertNamedImports(homePageSource, "react", ["useEffect", "useState"])
  assert.match(homePageSource, /root\.setAttribute\("data-registry-page", "true"\)/)
  assert.match(homePageSource, /root\.removeAttribute\("data-registry-page"\)/)
  assert.match(homePageSource, /root\.removeAttribute\("data-registry-blocking"\)/)

  assert.match(cssSource, /html\[data-registry-page="true"\],/)
  assert.match(cssSource, /html\[data-registry-page="true"\] body \{/)
  assert.match(cssSource, /--registry-topbar-height:\s*48px;/)
  assert.match(cssSource, /--registry-rail-width:\s*48px;/)
  assert.match(cssSource, /--registry-tools-rail-width:\s*48px;/)
  assert.match(cssSource, /--registry-sidebar-panel-width:\s*290px;/)
  assert.match(
    cssSource,
    /html\[data-registry-page="true"\],\s*html\[data-registry-page="true"\] body \{[\s\S]*overflow-x:\s*hidden;[\s\S]*overscroll-behavior-x:\s*none;[\s\S]*overflow-y:\s*hidden;[\s\S]*overscroll-behavior-y:\s*none;/
  )
  assert.match(cssSource, /html\[data-registry-page="true"\]\[data-registry-blocking="true"\],/)
  assert.match(cssSource, /overscroll-behavior-y:\s*none;/)
  assert.match(cssSource, /html\[data-registry-page="true"\]\[data-registry-blocking="true"\] #main-content/)
  assert.match(cssSource, /overflow-y:\s*hidden !important;/)
  assert.match(cssSource, /\.registry-main-content-mobile-height\s*\{/)
  assert.match(cssSource, /@supports \(height:\s*100dvh\)\s*\{/)
  assert.match(cssSource, /height:\s*calc\(100dvh\s*-\s*var\(--registry-topbar-height\)\s*-\s*var\(--registry-topbar-height\)\);/)
})

test("Registry topbar mounts language selector near left side", () => {
  const source = readSource("src/pages/registry/sections/HomeTopbar.jsx")

  assert.match(source, /<LanguageSelect\s*\/>/)
  assert.match(source, /<header className="hidden sticky top-0 z-10 h-\[var\(--registry-topbar-height\)\] border-b border-kumo-line bg-kumo-elevated md:block md:pr-12">/)
  assert.match(source, /<div className="mx-auto hidden h-full items-center px-4 md:flex md:border-r md:border-kumo-line">/)
})

test("HomePage keeps language selector as mobile fallback", () => {
  const source = readSource("src/pages/registry/HomePage.jsx")

  assert.match(source, /import \{ MobileFooter \} from "\.\/sections\/MobileFooter"/)
  assert.match(source, /<MobileFooter\s*\/>/)
})

test("MobileFooter provides mobile three-column footer with social links and centered language select", () => {
  const source = readSource("src/pages/registry/sections/MobileFooter.jsx")

  assert.match(source, /const MOBILE_FOOTER_SOCIAL_ORDER = \["github", "xiaohongshu"\]/)
  assert.match(source, /fixed inset-x-0 bottom-0 z-50 flex h-\[var\(--registry-topbar-height\)\] items-center border-t border-kumo-line bg-kumo-elevated md:hidden/)
  assert.match(source, /absolute inset-y-0 left-0 flex items-center px-3/)
  assert.match(source, /absolute inset-y-0 right-0 flex items-center px-3/)
  assert.match(source, /<LanguageSelect\s*\/>/)
  assert.match(source, /GitHubInvertocatLogo/)
  assert.match(source, /XiaohongshuLogo/)
  assert.match(source, /aria-label=\{mobileGithub\.label\}/)
  assert.match(source, /aria-label=\{mobileXiaohongshu\.label\}/)
  assert.match(source, /shape="base"/)
  assert.match(source, /className="h-9 px-2\.5"/)
})

test("Registry topbar shows GitHub and Xiaohongshu links", () => {
  const source = readSource("src/pages/registry/sections/HomeTopbar.jsx")

  assert.match(source, /SOCIAL_LINKS/)
  assert.match(source, /TOPBAR_SOCIAL_ORDER\s*=\s*\["xiaohongshu",\s*"github"\]/)
  assert.match(source, /(GithubLogo|GitHubInvertocatLogo)/)
  assert.match(source, /XiaohongshuLogo/)
  assert.match(source, /aria-label={social.label}/)
  assert.doesNotMatch(source, /<span className=/)
})

test("Kumo home components are present", () => {
  const homeGrid = path.join("src/pages/registry/sections/components", "HomeGrid.jsx")
  const themeToggle = path.join("src/pages/registry/sections", "ThemeToggle.jsx")
  const languageSelect = path.join("src/pages/registry/sections", "LanguageSelect.jsx")
  const mobileFooter = path.join("src/pages/registry/sections", "MobileFooter.jsx")
  const searchDialog = path.join("src/pages/registry/sections", "SearchDialog.jsx")
  const menuIcon = path.join("src/pages/registry/sections", "JikanMenuIcon.jsx")

  assert.ok(fs.existsSync(path.join(process.cwd(), homeGrid)))
  assert.ok(fs.existsSync(path.join(process.cwd(), themeToggle)))
  assert.ok(fs.existsSync(path.join(process.cwd(), languageSelect)))
  assert.ok(fs.existsSync(path.join(process.cwd(), mobileFooter)))
  assert.ok(fs.existsSync(path.join(process.cwd(), searchDialog)))
  assert.ok(fs.existsSync(path.join(process.cwd(), menuIcon)))
})

test("LanguageSelect uses Kumo Select and I18n state", () => {
  const source = readSource("src/pages/registry/sections/LanguageSelect.jsx")

  assert.match(source, /@\/components\/ui\/kumo/)
  assert.match(source, /@phosphor-icons\/react/)
  assert.match(source, /\bSelect\b/)
  assert.match(source, /\bGlobe\b/)
  assert.match(source, /useState/)
  assert.match(source, /onOpenChange/)
  assert.match(source, /useI18n/)
  assert.match(source, /setLanguage/)
  assert.match(source, /LANGUAGE_META/)
  assert.match(source, /t\("lang\.select"\)/)
  assert.match(source, /inline-flex items-center/)
  assert.match(source, /triggerLabel/)
  assert.match(source, /menuFlag/)
  assert.match(source, /menuLabel/)
  assert.match(source, /registry-language-select-open/)
  assert.match(source, /\[\&>span:first-child\]:h-full/)
  assert.match(source, /\[\&>span:first-child\]:items-center/)
  assert.match(source, /\[\&>\*:last-child\]:hidden/)
  assert.match(source, /justify-start/)
  assert.match(source, /px-2/)
  assert.match(source, /min-w-\[104px\]/)
  assert.match(source, /not-disabled:hover:!bg-kumo-tint/)
  assert.doesNotMatch(source, /🌐/)
  assert.match(source, /meta\.flag/)
  assert.doesNotMatch(source, /compact/)
  assert.doesNotMatch(source, /meta\.short/)
})

test("Registry language dropdown aligns left edge with trigger", () => {
  const source = readSource("src/index.css")

  assert.match(source, /registry-language-select-open/)
  assert.match(source, /\[data-side\]\[data-align\] > \.p-1\\\.5/)
  assert.match(source, /padding-left:\s*0/)
  assert.match(source, /padding-right:\s*0/)
})

test("Registry wrappers are local and avoid vendor docs imports", () => {
  const themeToggle = readSource("src/pages/registry/sections/ThemeToggle.jsx")
  const searchDialog = readSource("src/pages/registry/sections/SearchDialog.jsx")
  const menuIcon = readSource("src/pages/registry/sections/JikanMenuIcon.jsx")

  assert.match(themeToggle, /function ThemeToggle/)
  assert.match(themeToggle, /@\/components\/ui\/kumo/)
  assert.match(themeToggle, /document\.documentElement\.setAttribute\("data-mode"/)

  assert.match(searchDialog, /function SearchDialog/)
  assert.doesNotMatch(searchDialog, /vendor\/kumo\/packages\/kumo-docs-astro/)

  assert.match(menuIcon, /function JikanMenuIcon/)
  assert.match(menuIcon, /clipPathId/)
  assert.doesNotMatch(menuIcon, /vendor\/kumo\/packages\/kumo-docs-astro/)
})

test("Registry page layer imports UI components via local ui entry only", () => {
  const registryFiles = listFiles("src/pages/registry").filter((file) => {
    return file.endsWith(".jsx") || file.endsWith(".js")
  })

  const directKumoImports = registryFiles.filter((file) => {
    const source = readSource(file)
    return /^import .*@cloudflare\/kumo/m.test(source)
  })

  assert.equal(
    directKumoImports.length,
    0,
    `registry page layer should not import @cloudflare/kumo directly: ${directKumoImports.join(", ")}`
  )
})

test("Source code has no direct vendor/kumo path references", () => {
  const sourceFiles = listFiles("src").filter((file) => file.endsWith(".jsx") || file.endsWith(".js"))
  const offenders = sourceFiles.filter((file) => /vendor\/kumo/.test(readSource(file)))

  assert.equal(
    offenders.length,
    0,
    `source files should not reference vendor/kumo paths: ${offenders.join(", ")}`
  )
})

test("HomeSidebar is non-scrollable and hides Life style card", () => {
  const source = readSource("src/pages/registry/sections/HomeSidebar.jsx")
  const cardsSource = readSource("src/pages/registry/sections/home-sidebar-cards.jsx")
  const visualsSource = readSource("src/pages/registry/sections/home-sidebar-visuals.jsx")
  const statsSource = readSource("src/pages/registry/sections/home-sidebar-date-stats.js")
  const lockHookSource = readSource("src/pages/registry/sections/useRegistryBlockingScrollLock.js")

  assertNamedImports(source, "react", ["useEffect", "useMemo", "useState"])
  assertNamedImports(source, "./useRegistryBlockingScrollLock", ["useRegistryBlockingScrollLock"])
  assert.match(source, /useRegistryBlockingScrollLock\(mobileMenuOpen\)/)
  assert.match(source, /window\.matchMedia\("\(min-width: 768px\)"\)/)
  assert.match(source, /setMobileMenuOpen\(false\)/)
  assert.match(source, /function isMobileViewport\(\) \{/)
  assert.match(source, /window\.matchMedia\("\(max-width: 767px\)"\)\.matches/)
  assert.match(source, /const \[mobileMenuOpen, setMobileMenuOpen\] = useState\(\(\) => \{/)
  assert.match(source, /if \(selectedStyle !== null\) return false/)
  assert.match(source, /return isMobileViewport\(\)/)
  assert.match(source, /if \(selectedStyle !== null\) return/)
  assert.match(source, /setMobileMenuOpen\(true\)/)
  assert.doesNotMatch(source, /window\.setTimeout\(\(\) => \{/)
  assert.match(source, /fixed inset-0 z-\[60\] flex w-full flex-col bg-kumo-elevated text-kumo-default md:hidden/)
  assert.match(source, /mobileMenuOpen \? "translate-x-0" : "-translate-x-full"/)
  assert.match(source, /if \(isMobileViewport\(\)\) setMobileMenuOpen\(false\)/)
  assert.match(lockHookSource, /function useRegistryBlockingScrollLock\(active\)/)
  assert.match(lockHookSource, /const REGISTRY_BLOCKING_ATTR = "data-registry-blocking"/)
  assert.match(lockHookSource, /registryBlockingLockCount \+= 1/)
  assert.match(lockHookSource, /registryBlockingLockCount = Math\.max\(0, registryBlockingLockCount - 1\)/)
  assert.match(lockHookSource, /export \{ useRegistryBlockingScrollLock \}/)
  assert.doesNotMatch(source, /overflow-y-auto/)
  assert.match(source, /h-full/)
  assert.match(source, /selectedStyle = "year"/)
  assert.match(cardsSource, /id:\s*"year"/)
  assert.match(cardsSource, /id:\s*"goal"/)
  assert.match(cardsSource, /const HIDDEN_STYLE_CARD_IDS = new Set\(\["life"\]\)/)
  assert.match(cardsSource, /\.filter\(\(style\)\s*=>\s*!HIDDEN_STYLE_CARD_IDS\.has\(style\.id\)\)/)
  assert.doesNotMatch(cardsSource, /style\.id === "life"/)
  assert.doesNotMatch(source, /const cardStats = useMemo/)
  assert.match(cardsSource, /border-t border-kumo-line/)
  assert.match(source, /t\("types\.header"\)/)
  assertNamedImports(source, "./ThemeToggle", ["ThemeToggle"])
  assert.match(source, /<ThemeToggle \/>/)
  assert.doesNotMatch(source, /<div className="size-9" \/>/)
  assert.match(cardsSource, /t\("type\.year\.name"\)/)
  assert.match(cardsSource, /t\("type\.goal\.name"\)/)
  assert.doesNotMatch(source, /<span>Select<\/span>/)
  assert.doesNotMatch(source, /button\.selected/)
  assert.doesNotMatch(source, /["']Selected["']/)
  assert.doesNotMatch(source, /CheckIcon/)
  assert.doesNotMatch(source, /ArrowRightIcon/)
  assert.match(visualsSource, /gap-\[4px\]/)
  assert.match(visualsSource, /h-\[10px\] w-\[10px\] origin-center scale-\[0\.84\]/)
  assert.match(visualsSource, /h-\[100px\] w-\[100px\]/)
  assertNamedImports(source, "./home-sidebar-cards", ["HomeSidebarCards"])
  assertNamedImports(cardsSource, "./home-sidebar-visuals", ["GoalVisual", "LifeVisual", "YearVisual"])
  assertNamedImports(source, "./home-sidebar-date-stats", ["getGoalPreviewLayout", "getYearStats"])
  assert.match(visualsSource, /const YEAR_GRID_COLUMNS = 10/)
  assert.match(statsSource, /return \{ day, week, percent, totalDays \}/)
  assert.match(source, /const \[todayKey, setTodayKey\] = useState\(\(\) => getLocalDateKey\(\)\)/)
  assert.match(source, /useEffect\(\(\) => \{/)
  assert.match(source, /const yearStats = useMemo\(\(\) => getYearStats\(\), \[todayKey\]\)/)
  assert.doesNotMatch(source, /const yearStats = useMemo\(\(\) => getYearStats\(\), \[\]\)/)
  assert.match(visualsSource, /const totalDots = YEAR_GRID_COLUMNS \* YEAR_GRID_COLUMNS/)
  assert.match(visualsSource, /function YearVisual\(\{ percent \}\)/)
  assert.match(cardsSource, /<div className="origin-center scale-\[1\]">\s*<YearVisual percent=\{yearStats\.percent\} \/>/)
  assert.match(cardsSource, /<YearVisual percent=\{yearStats\.percent\} \/>/)
  assert.match(visualsSource, /const filledCount = Math\.min\(totalDots, Math\.max\(0, percent\)\)/)
  assert.doesNotMatch(source, /YEAR_EXTRA_FILLED_ROWS/)
  assert.doesNotMatch(source, /baseFilledCount/)
  assert.doesNotMatch(source, /progressDots/)
  assert.doesNotMatch(source, /progressFilledCount/)
  assert.match(visualsSource, /gridTemplateColumns:\s*`repeat\(\$\{YEAR_GRID_COLUMNS\}, minmax\(0, 1fr\)\)`/)
  assert.match(cardsSource, /scale-\[1\.8\]/)
  assert.doesNotMatch(source, /scale-\[0\.8\]/)
})

test("HomeSidebar year visual uses three-state dot design tokens", () => {
  const source = readSource("src/pages/registry/sections/home-sidebar-visuals.jsx")

  assert.match(source, /const YEAR_DOT_STATE_TOKENS = \{/)
  assert.match(source, /today:\s*"bg-kumo-contrast"/)
  assert.match(source, /completed:\s*"bg-kumo-contrast\/75"/)
  assert.match(source, /pending:\s*"bg-kumo-contrast\/12"/)
  assert.match(source, /const todayIndex = Math\.min\(totalDots - 1, Math\.max\(0, filledCount - 1\)\)/)
  assert.match(source, /if \(index === todayIndex\) return "today"/)
  assert.match(source, /if \(index < filledCount\) return "completed"/)
  assert.match(source, /return "pending"/)
  assert.match(source, /YEAR_DOT_STATE_TOKENS\[dotState\]/)
  assert.match(source, /data-dot-state={dotState}/)
})

test("HomeSidebar delegates style-card rendering to HomeSidebarCards with callback bridge", () => {
  const sidebarSource = readSource("src/pages/registry/sections/HomeSidebar.jsx")
  const cardsSource = readSource("src/pages/registry/sections/home-sidebar-cards.jsx")

  assert.match(sidebarSource, /import \{ HomeSidebarCards \} from "\.\/home-sidebar-cards"/)
  assert.match(sidebarSource, /<HomeSidebarCards[\s\S]*onStyleSelect={handleStyleSelect}/)
  assert.match(cardsSource, /function HomeSidebarCards\(\{ selectedStyle, onStyleSelect, yearStats, goalPreviewLayout, t \}\)/)
  assert.match(cardsSource, /onClick=\{\(\) => onStyleSelect\?\.\(style\.id\)\}/)
})

test("HomeSidebar goal visual text positions follow preview layout parameters", () => {
  const source = readSource("src/pages/registry/sections/home-sidebar-visuals.jsx")

  assert.match(source, /const \{ ring, daysRemaining, daysLeftText, numberFontSize, labelFontSize, labelY \} = layout/)
  assert.match(source, /y={ring\.centerY - 1}/)
  assert.match(source, /y={labelY \+ 8}/)
  assert.doesNotMatch(source, /ring\.centerY \+ ring\.radius \* 0\.62/)
})

test("HomePage keeps selectedStyle as single source of truth", () => {
  const source = readSource("src/pages/registry/HomePage.jsx")

  assert.match(source, /const AUTOFLOW_STORAGE_KEY = "registry\.settingsAutoflow\.v1"/)
  assert.match(source, /const ONBOARDING_FORCE_QUERY_VALUE = "force"/)
  assert.match(source, /function isForceOnboardingEnabled\(search\)/)
  assert.match(source, /params\.get\("onboarding"\) === ONBOARDING_FORCE_QUERY_VALUE/)
  assert.match(source, /const forceOnboarding = useMemo\(\(\) => isForceOnboardingEnabled\(location\.search\), \[location\.search\]\)/)
  assert.match(source, /if \(!forceOnboarding\) return/)
  assert.match(source, /setSelectedStyle\(null\)/)
  assert.match(source, /if \(forceOnboarding\) return/)
  assert.match(source, /window\.localStorage\.getItem\(AUTOFLOW_STORAGE_KEY\) === "1"/)
  assert.match(source, /setSelectedStyle\("year"\)/)
  assert.match(source, /useState\(null\)/)
  assert.doesNotMatch(source, /useState\(["']year["']\)/)
  assert.match(source, /selectedStyle={selectedStyle}/)
  assert.match(source, /onStyleChange={setSelectedStyle}/)
  assert.match(source, /<HomeGrid\s+selectedStyle={selectedStyle}/)
  assert.match(source, /forceOnboarding={forceOnboarding}/)
})

test("Registry sidebar is local controlled implementation", () => {
  const source = readSource("src/pages/registry/sections/HomeSidebar.jsx")
  const cardsSource = readSource("src/pages/registry/sections/home-sidebar-cards.jsx")

  assert.match(source, /data-sidebar-open={isSidebarOpen}/)
  assert.match(source, /t\("types\.header"\)/)
  assert.match(cardsSource, /t\("type\.year\.name"\)/)
  assert.match(cardsSource, /t\("type\.goal\.name"\)/)
  assert.match(cardsSource, /const HIDDEN_STYLE_CARD_IDS = new Set\(\["life"\]\)/)
  assert.match(cardsSource, /\.filter\(\(style\)\s*=>\s*!HIDDEN_STYLE_CARD_IDS\.has\(style\.id\)\)/)
  assert.doesNotMatch(cardsSource, /style\.id === "life"/)
  assert.doesNotMatch(source, /const cardStats = useMemo/)
  assert.match(source, /t\("registry\.menu\.open"\)/)
  assert.match(source, /t\("registry\.menu\.close"\)/)
  assert.match(source, /t\("registry\.sidebar\.toggle"\)/)
  assert.doesNotMatch(source, /Choose Your Style/)
  assert.doesNotMatch(source, /Year Progress/)
  assert.doesNotMatch(source, /Life Calendar/)
  assert.doesNotMatch(source, /Goal Countdown/)
  assert.doesNotMatch(source, /vendor\/kumo\/packages\/kumo-docs-astro\/src\/components\/SidebarNav/)
})

test("Registry workspace no longer hardcodes UI language to English", () => {
  const source = readSource("src/pages/registry/sections/workspace/useHomeWallpaperConfig.js")
  const mapperSource = readSource("src/pages/registry/sections/workspace/view-model-mappers.js")

  assert.match(source, /useI18n/)
  assert.match(source, /LANGUAGE_META/)
  assert.match(source, /const\s+\{\s*t\s*\}\s*=\s*useI18n\(\)/)
  assert.match(source, /mapLanguageOptions\(LANGUAGE_META,\s*t\)/)
  assert.match(mapperSource, /flag:\s*meta\.flag/)
  assert.match(mapperSource, /name:\s*t\(meta\.labelKey\)/)
  assert.doesNotMatch(source, /REGISTRY_UI_LANG/)
  assert.doesNotMatch(source, /createEnglishTranslator/)
})

test("Registry config keeps selectedType empty before style selection", () => {
  const source = readSource("src/pages/registry/sections/workspace/useHomeWallpaperConfig.js")
  const initSource = readSource("src/pages/registry/sections/workspace/config-init.js")
  const urlBuilderSource = readSource("src/pages/registry/sections/workspace/url-builder.js")

  assert.match(initSource, /function resolveSelectedType\(selectedStyle\)/)
  assert.match(initSource, /return STYLE_TO_TYPE\[selectedStyle\] \?\? null/)
  assert.match(source, /const selectedType = resolveSelectedType\(selectedStyle\)/)
  assert.match(urlBuilderSource, /if \(!config\.selectedType\) return ""/)
})

test("Registry settings wallpaper language uses flag + name rendering", () => {
  const source = readSource("src/pages/registry/sections/workspace/cards/wallpaper-lang-card.jsx")

  assert.match(source, /inline-flex items-center gap-1\.5/)
  assert.match(source, /option\.flag/)
  assert.match(source, /option\.name/)
})

test("Registry settings does not render selected type badge", () => {
  const source = readSource("src/pages/registry/sections/workspace/HomeSettingsPane.jsx")
  const homeGridSource = readSource("src/pages/registry/sections/components/HomeGrid.jsx")
  const hookSource = readSource("src/pages/registry/sections/workspace/useHomeWallpaperConfig.js")

  assert.doesNotMatch(source, /customize\.selected/)
  assert.doesNotMatch(homeGridSource, /typeName={viewModel\.typeName}/)
  assert.doesNotMatch(hookSource, /typeName/)
  assert.doesNotMatch(hookSource, /getTypeName/)
})

test("Registry settings colors use shared ColorPicker component", () => {
  const source = readSource("src/pages/registry/sections/workspace/cards/colors-card.jsx")
  const fieldShellSource = readSource("src/pages/registry/sections/workspace/cards/CardField.jsx")

  assertNamedImports(source, "@/components/ui/color-picker", ["ColorPicker"])
  assertNamedImports(source, "./CardField", ["CardField", "CardFieldsStack"])
  assert.match(source, /titleKey:\s*"config\.colors"/)
  assert.match(source, /<CardFieldsStack>/)
  assert.match(fieldShellSource, /flex w-full max-w-full flex-col items-center px-4 py-1/)
  assert.match(fieldShellSource, /gap-4/)
  assert.match(source, /className="grid w-\[200px\] max-w-full grid-cols-2 gap-2"/)
  assert.match(source, /className="min-w-0 space-y-1\.5"/)
  assert.match(source, /ColorPicker[\s\S]*?className="w-full"/)
  assert.match(source, /t\("config\.background"\)[\s\S]*?<ColorPicker[\s\S]*?showValue=\{false\}/)
  assert.match(source, /t\("config\.accent"\)[\s\S]*?<ColorPicker[\s\S]*?showValue=\{false\}/)
  assert.match(source, /t\("config\.colorPresets"\)/)
  assert.match(source, /actions\.setBackgroundColor/)
  assert.match(source, /actions\.setAccentColor/)
  assert.match(source, /actions\.applyPalette\(preset\.bg,\s*preset\.accent\)/)
  assert.match(source, /className="flex w-\[200px\] max-w-full flex-wrap gap-2"/)
  assert.match(fieldShellSource, /w-\[200px\] max-w-full/)
  assert.doesNotMatch(source, /title:\s*"Switch"/)
  assert.doesNotMatch(source, /<Switch/)
  assert.doesNotMatch(source, /type="color"/)
})

test("Registry settings device card uses grouped Select with resolution hint", () => {
  const source = readSource("src/pages/registry/sections/workspace/cards/device-card.jsx")

  assert.match(source, /titleKey:\s*"config\.device"/)
  assert.match(source, /titleTooltipKey:\s*"config\.deviceTooltip"/)
  assert.match(source, /actions\.setDevice/)
  assert.match(source, /className="w-\[200px\] max-w-full"/)
  assertNamedImports(source, "../device-visibility", ["VISIBLE_DEVICE_CATEGORIES"])
  assert.match(source, /VISIBLE_DEVICE_CATEGORIES\.map/)
  assert.match(source, /SelectBase\.Group/)
  assert.match(source, /const shouldShowGroupLabel = VISIBLE_DEVICE_CATEGORIES\.length > 1/)
  assert.match(source, /shouldShowGroupLabel && \(/)
  assert.match(source, /selectedDevice\.width/)
  assert.match(source, /selectedDevice\.height/)
  assert.match(source, /×/)
  assert.doesNotMatch(source, /title:\s*"Dropdown"/)
  assert.doesNotMatch(source, /<DropdownMenu/)
  assert.doesNotMatch(source, /Worker/)
  assert.doesNotMatch(source, /Pages/)
})

test("Device data splits grouped iPhone labels into single-model entries and keeps legacy aliases", async () => {
  const source = readSource("src/data/devices.js")

  assert.match(source, /name:\s*"iPhone 16 Plus"/)
  assert.match(source, /name:\s*"iPhone 15 Pro Max"/)
  assert.match(source, /name:\s*"iPhone 15 Plus"/)
  assert.match(source, /name:\s*"iPhone 14 Pro Max"/)
  assert.match(source, /name:\s*"iPhone 16"/)
  assert.match(source, /name:\s*"iPhone 15 Pro"/)
  assert.match(source, /name:\s*"iPhone 15"/)
  assert.match(source, /name:\s*"iPhone 14 Pro"/)
  assert.match(source, /name:\s*"iPhone 14 Plus"/)
  assert.match(source, /name:\s*"iPhone 13 Pro Max"/)
  assert.match(source, /name:\s*"iPhone 14"/)
  assert.match(source, /name:\s*"iPhone 13 Pro"/)
  assert.match(source, /name:\s*"iPhone 13"/)

  assert.doesNotMatch(source, /name:\s*"iPhone 14 Pro Max \/ 15 Plus \/ 15 Pro Max \/ 16 Plus"/)
  assert.doesNotMatch(source, /name:\s*"iPhone 14 Pro \/ 15 \/ 15 Pro \/ 16"/)
  assert.doesNotMatch(source, /name:\s*"iPhone 13 Pro Max \/ 14 Plus"/)
  assert.doesNotMatch(source, /name:\s*"iPhone 13 \/ 13 Pro \/ 14"/)

  assert.match(source, /const LEGACY_DEVICE_NAME_MAP = \{/)
  assert.match(source, /export function normalizeDeviceName\(deviceName\)/)
  assert.match(source, /return LEGACY_DEVICE_NAME_MAP\[deviceName\] \?\? deviceName/)

  const moduleUrl = pathToFileURL(path.join(process.cwd(), "src/data/devices.js")).href
  const { devices } = await import(`${moduleUrl}?v=${Date.now()}`)
  const iphones = devices.filter((device) => device.category === "iPhone")
  const iphoneResolutionByName = new Map(
    iphones.map((device) => [device.name, `${device.width} x ${device.height}`])
  )

  assert.equal(iphoneResolutionByName.get("iPhone 17"), "1206 x 2622")
  assert.equal(iphoneResolutionByName.get("iPhone 17 Pro"), "1206 x 2622")
  assert.equal(iphoneResolutionByName.get("iPhone 17 Air"), "1260 x 2736")
  assert.equal(iphoneResolutionByName.get("iPhone 16 Pro"), "1206 x 2622")
  assert.equal(iphoneResolutionByName.get("iPhone 16 Pro Max"), "1320 x 2868")
  assert.equal(iphoneResolutionByName.get("iPhone 13 mini"), "1080 x 2340")
  assert.equal(iphoneResolutionByName.get("iPhone 12 mini"), "1080 x 2340")

  const seriesOrder = [
    "iPhone 17 Pro Max",
    "iPhone 17 Pro",
    "iPhone 17 Air",
    "iPhone 17",
    "iPhone 16 Pro Max",
    "iPhone 16 Pro",
    "iPhone 16 Plus",
    "iPhone 16",
    "iPhone 15 Pro Max",
    "iPhone 15 Pro",
    "iPhone 15 Plus",
    "iPhone 15",
    "iPhone 14 Pro Max",
    "iPhone 14 Pro",
    "iPhone 14 Plus",
    "iPhone 14",
    "iPhone 13 Pro Max",
    "iPhone 13 Pro",
    "iPhone 13",
    "iPhone 13 mini",
    "iPhone 12 mini",
  ]
  const seriesPositions = seriesOrder.map((deviceName) =>
    iphones.findIndex((device) => device.name === deviceName)
  )

  assert.ok(seriesPositions.every((index) => index >= 0))
  for (let i = 1; i < seriesPositions.length; i += 1) {
    assert.ok(seriesPositions[i] > seriesPositions[i - 1], `${seriesOrder[i - 1]} should come before ${seriesOrder[i]}`)
  }
})

test("Home wallpaper config normalizes device value before persisting", () => {
  const source = readSource("src/pages/registry/sections/workspace/useHomeWallpaperConfig.js")
  const actionsSource = readSource("src/pages/registry/sections/workspace/config-actions.js")

  assert.match(source, /normalizeDeviceName/)
  assert.match(actionsSource, /setDevice\(value\)\s*\{[\s\S]*?normalizeDeviceName\(value\)/)
  assertNamedImports(source, "./device-visibility", [
    "PRIMARY_VISIBLE_DEVICE_CATEGORY",
    "isVisibleDeviceCategory",
  ])
  assert.match(source, /isVisibleDeviceCategory\(resolvedDevice\?\.category\)/)
  assert.match(source, /device\.category === PRIMARY_VISIBLE_DEVICE_CATEGORY/)
})

test("Goal/Life slot 3 uses dedicated fields card and hides palettes card in active orders", () => {
  const source = readSource("src/pages/registry/sections/workspace/HomeSettingsPane.jsx")

  assert.match(source, /const YEAR_SETTINGS_CARD_IDS = \["location", "wallpaper-lang", "colors", "device", "url"\]/)
  assert.match(source, /const LIFE_SETTINGS_CARD_IDS = \["location", "wallpaper-lang", "life-fields", "colors", "device", "url"\]/)
  assert.match(source, /const GOAL_SETTINGS_CARD_IDS = \["location", "wallpaper-lang", "goal-fields", "colors", "device", "url"\]/)
  assert.match(source, /const CARD_ORDER_BY_TYPE = \{[\s\S]*?year:\s*YEAR_SETTINGS_CARD_IDS,[\s\S]*?life:\s*LIFE_SETTINGS_CARD_IDS,[\s\S]*?goal:\s*GOAL_SETTINGS_CARD_IDS,/)
  assert.doesNotMatch(source, /const YEAR_SETTINGS_CARD_IDS = \[[^\]]*"palettes"[^\]]*\]/)
  assert.doesNotMatch(source, /const LIFE_SETTINGS_CARD_IDS = \[[^\]]*"palettes"[^\]]*\]/)
  assert.doesNotMatch(source, /const GOAL_SETTINGS_CARD_IDS = \[[^\]]*"palettes"[^\]]*\]/)
})

test("Goal countdown keeps url card at slot 6 for Set flow", () => {
  const source = readSource("src/pages/registry/sections/workspace/HomeSettingsPane.jsx")

  assert.match(
    source,
    /const GOAL_SETTINGS_CARD_IDS = \["location", "wallpaper-lang", "goal-fields", "colors", "device", "url"\]/
  )
})

test("Goal fields card uses goal name + date range field wiring", () => {
  const source = readSource("src/pages/registry/sections/workspace/cards/goal-fields-card.jsx")
  const fieldShellSource = readSource("src/pages/registry/sections/workspace/cards/CardField.jsx")

  assert.match(source, /title:\s*"Goal"/)
  assertNamedImports(source, "./CardField", ["CardField", "CardFieldsStack"])
  assert.match(source, /<CardFieldsStack>/)
  assert.match(fieldShellSource, /function CardFieldsStack/)
  assert.match(source, /actions\.setGoalName/)
  assert.match(source, /actions\.setGoalRange/)
  assert.match(source, /t\("config\.dateRange"\)/)
  assert.match(source, /GoalDateRangeField/)
  assert.match(source, /className="w-\[200px\] max-w-full"/)
  assert.doesNotMatch(source, /SettingsCardDatePickerField/)
})

test("Life fields card uses dob/lifespan bindings and keeps hints in card view", () => {
  const source = readSource("src/pages/registry/sections/workspace/cards/life-fields-card.jsx")

  assert.match(source, /title:\s*"Life"/)
  assert.match(source, /actions\.setDob/)
  assert.match(source, /actions\.setLifespan/)
  assert.match(source, /actions\.normalizeLifespan/)
  assert.match(source, /DatePicker/)
  assert.match(source, /mode="single"/)
  assert.match(source, /disabled=\{todayDate \? \[\{ after: todayDate \}\] : undefined\}/)
  assert.match(source, /Popover/)
  assert.match(source, /variant="outline"/)
  assert.match(source, /type="number"/)
  assert.match(source, /min=\{50\}/)
  assert.match(source, /max=\{120\}/)
  assert.match(source, /t\("config\.dateOfBirthHint"\)/)
  assert.match(source, /t\("config\.lifespanHint"\)/)
  assert.match(source, /className="w-\[200px\] max-w-full"/)
  assert.doesNotMatch(source, /SettingsCardDatePickerField/)
  assert.doesNotMatch(source, /maxValue=\{todayISO\}/)
})

test("Goal url card uses setup title and set flow guarded by copy success", () => {
  const gridSource = readSource("src/pages/registry/sections/components/HomeGrid.jsx")
  const paneSource = readSource("src/pages/registry/sections/workspace/HomeSettingsPane.jsx")
  const urlSource = readSource("src/pages/registry/sections/workspace/cards/url-card.jsx")

  assert.match(gridSource, /const SETUP_FLOW_TYPES = new Set\(\["year", "goal"\]\)/)
  assert.match(urlSource, /const SETUP_FLOW_TYPES = new Set\(\["year", "goal"\]\)/)
  assert.match(urlSource, /function renderMidAnchoredUrlRow\(\{ onSetIt, t, url \}\)/)
  assert.match(urlSource, /render: \(\{ config, effectiveLayoutTier, onSetIt, t, url \}\) =>/)
  assert.match(urlSource, /resolveTitle:\s*\(\{\s*config,\s*t\s*\}\)\s*=>[\s\S]*?SETUP_FLOW_TYPES\.has\(config\.selectedType\)\s*\?\s*t\("setup\.title"\)\s*:\s*"Collapsible"/)
  assert.match(urlSource, /const isMidGoal = config\.selectedType === "goal" && effectiveLayoutTier === "mid"/)
  assert.match(urlSource, /if \(isMidGoal\) \{/)
  assert.match(urlSource, /return renderMidAnchoredUrlRow\(\{ onSetIt, t, url \}\)/)
  assert.match(urlSource, /if\s*\(config\.selectedType === "goal"\)/)
  assert.match(urlSource, /w-\[220px\] max-w-full flex-col gap-2 px-3 py-1/)
  assert.match(urlSource, /KumoButton[\s\S]*?variant="secondary"/)
  assert.match(urlSource, /w-full justify-center text-center transition-colors not-disabled:hover:!bg-kumo-tint/)
  assert.match(urlSource, /variant="secondary"/)
  assert.match(urlSource, /not-disabled:hover:!bg-kumo-tint/)
  assert.match(urlSource, /t\("url\.set"\)/)
  assert.match(urlSource, /onClick=\{\(event\) => void onSetIt\(event\.currentTarget\)\}/)
  assert.match(gridSource, /const \[isSetupPanelOpen, setIsSetupPanelOpen\] = useState\(false\)/)
  assert.match(gridSource, /const \[setupPlatform, setSetupPlatform\] = useState\("ios"\)/)
  assert.match(gridSource, /const setupTriggerRef = useRef\(null\)/)
  assert.match(gridSource, /const handleSetIt = async \(triggerElement\) => \{[\s\S]*?const ok = await viewModel\.actions\.copyUrl\(\)/)
  assert.match(gridSource, /const handleSetIt = async \(triggerElement\) => \{[\s\S]*?if \(!ok\) return/)
  assert.match(gridSource, /setupTriggerRef\.current = triggerElement \?\? null/)
  assert.match(gridSource, /window\.requestAnimationFrame\(\(\) => \{[\s\S]*?setupTriggerRef\.current\?\.focus\?\.\(\{ preventScroll: true \}\)/)
  assert.match(gridSource, /useEffect\(\(\) => \{[\s\S]*?if \(!SETUP_FLOW_TYPES\.has\(viewModel\.config\.selectedType\)\) \{/)
  assert.match(gridSource, /viewModel\.selectedDevice\.category === "Android" \? "android" : "ios"/)
  assert.match(gridSource, /useRegistryBlockingScrollLock\(isSetupPanelOpen\)/)
  assert.match(gridSource, /containerClassName="overflow-hidden overscroll-none"/)
  assert.match(gridSource, /asideClassName="md:w-full md:border-l-0 md:border-r"/)
  assert.match(gridSource, /const shouldRenderGridGuideHost = effectiveLayoutTier === "md"/)
  assert.match(gridSource, /const shouldRenderPaneGuideHost = !shouldRenderGridGuideHost/)
  assert.match(gridSource, /\{shouldRenderGridGuideHost \? \(/)
  assert.match(gridSource, /isDesktopShell \? "md:hidden" : ""/)
  assert.match(gridSource, /effectiveLayoutTier=\{effectiveLayoutTier\}/)
  assert.match(gridSource, /shouldRenderPaneGuideHost=\{shouldRenderPaneGuideHost\}/)
  assert.match(gridSource, /<SetupGuidePanel[\s\S]*?open=\{isSetupPanelOpen\}/)
  assert.match(gridSource, /<SetupGuidePanel[\s\S]*?platform=\{setupPlatform\}/)
  assert.match(gridSource, /<SetupGuidePanel[\s\S]*?onClose=\{handleCloseSetupPanel\}/)
  assert.match(gridSource, /<SetupGuidePanel[\s\S]*?url=\{viewModel\.url\}/)
  assert.match(paneSource, /onSetIt,/)
  assert.match(paneSource, /const cardViewModel = \{[\s\S]*effectiveLayoutTier,[\s\S]*\}/)
  assert.match(paneSource, /isSetupPanelOpen,/)
  assert.match(paneSource, /setupPlatform,/)
  assert.match(paneSource, /onCloseSetupPanel,/)
  assert.match(paneSource, /shouldRenderPaneGuideHost = true,/)
  assert.match(paneSource, /\{shouldRenderPaneGuideHost \? \(/)
  assert.doesNotMatch(paneSource, /effectiveLayoutTier !== "md"/)
  assert.doesNotMatch(paneSource, /guideVisibilityClassName/)
  assert.doesNotMatch(paneSource, /visibilityClassName=\{guideVisibilityClassName\}/)
  assert.doesNotMatch(paneSource, /const \[isSetupPanelOpen, setIsSetupPanelOpen\] = useState/)
  assert.doesNotMatch(paneSource, /const handleSetIt = async \(\) => \{/)
})

test("Year merged slot uses setup url card as slot 5 with compact inline row on md+", () => {
  const source = readSource("src/pages/registry/sections/workspace/HomeSettingsPane.jsx")
  const urlSource = readSource("src/pages/registry/sections/workspace/cards/url-card.jsx")

  assert.match(source, /const YEAR_SETTINGS_CARD_IDS = \["location", "wallpaper-lang", "colors", "device", "url"\]/)
  assert.match(source, /const CARD_SHELL_CLASS_BY_TYPE = \{[\s\S]*?year:\s*\{[\s\S]*?url:\s*"md:col-span-2"/)
  assert.match(source, /className=\{resolveCardShellClassName\(\{ selectedType: config\.selectedType, cardId, isMid \}\)\}/)
  assert.match(source, /if \(isMid\) return ""/)
  assert.match(urlSource, /if\s*\(config\.selectedType === "year"\)/)
  assert.match(urlSource, /const isMidYear = config\.selectedType === "year" && effectiveLayoutTier === "mid"/)
  assert.match(urlSource, /if \(isMidYear\) \{/)
  assert.match(urlSource, /return renderMidAnchoredUrlRow\(\{ onSetIt, t, url \}\)/)
  assert.match(urlSource, /className="w-full px-4 py-1"/)
  assert.match(urlSource, /grid-cols-\[minmax\(0,1fr\)_auto\]/)
  assert.match(urlSource, /items-center gap-2/)
  assert.match(urlSource, /className="min-w-0 w-full font-mono text-xs"/)
  assert.match(
    urlSource,
    /className="min-w-\[88px\] shrink-0 justify-center px-4 text-center transition-colors not-disabled:hover:!bg-kumo-tint"/
  )
  assert.match(urlSource, /w-full px-4 py-1/)
  assert.match(urlSource, /md:px-\[calc\(25%-100px\)\]/)
  assert.match(urlSource, /flex max-w-full flex-col gap-2 md:flex-row md:items-center md:gap-2/)
  assert.match(urlSource, /className="min-w-0 w-full font-mono text-xs md:flex-1"/)
  assert.match(urlSource, /variant="secondary"/)
  assert.match(
    urlSource,
    /className="min-w-\[88px\] justify-center px-4 text-center transition-colors not-disabled:hover:!bg-kumo-tint md:shrink-0"/
  )
  assert.match(urlSource, /not-disabled:hover:!bg-kumo-tint/)
  assert.doesNotMatch(urlSource, /md:grid-cols-2/)
})

test("Setup guide panel uses local right-slide overlay with sidebar-aligned timing", () => {
  const source = readSource("src/pages/registry/sections/workspace/SetupGuidePanel.jsx")
  const cssSource = readSource("src/index.css")
  const i18nSource = readSource("src/data/i18n.js")

  assert.match(source, /containerClassName/)
  assert.match(source, /asideClassName/)
  assert.match(source, /visibilityClassName/)
  assert.match(source, /const DEFAULT_CONTAINER_CLASSNAME = "pointer-events-none absolute inset-0 z-40 overflow-hidden overscroll-none"/)
  assert.match(source, /const DEFAULT_ASIDE_CLASSNAME =/)
  assert.match(source, /data-home-settings-setup-panel/)
  assert.match(source, /className=\{cn\(DEFAULT_CONTAINER_CLASSNAME,\s*visibilityClassName,\s*containerClassName\)\}/)
  assert.match(source, /pointer-events-none absolute inset-0 z-40 overflow-hidden overscroll-none/)
  assert.match(source, /className=\{cn\(\s*DEFAULT_ASIDE_CLASSNAME,\s*asideClassName,/)
  assert.match(source, /role="dialog"/)
  assert.match(source, /aria-modal=\{open \? true : undefined\}/)
  assert.match(source, /aria-hidden=\{!open\}/)
  assert.match(source, /inert=\{open \? undefined : true\}/)
  assert.match(source, /pointer-events-auto absolute inset-y-0 right-0/)
  assert.match(source, /transition-transform duration-300 ease-out/)
  assert.match(source, /open \? "translate-x-0" : "translate-x-full"/)
  assertNamedImports(source, "@/components/ui/kumo", [
    "Banner",
    "Button as KumoButton",
    "ClipboardText",
    "Surface",
    "Text",
  ])
  assert.match(source, /<header className="relative flex items-start border-b border-kumo-line px-4 py-4">/)
  assert.match(source, /<Text as="h3" variant="heading3" DANGEROUS_className="leading-6">/)
  assert.match(source, /<Text as="h4" variant="body" size="sm" bold>/)
  assert.match(source, /min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-y-contain p-4/)
  assert.match(source, /const STEP_DESC_TEXT_CLASSNAME = "text-sm leading-5 text-kumo-subtle \[\&_strong\]:font-semibold \[\&_strong\]:text-kumo-default"/)
  assert.match(source, /className=\{STEP_DESC_TEXT_CLASSNAME\}/)
  assert.match(source, /className=\{`space-y-2\.5 \$\{STEP_DESC_TEXT_CLASSNAME\}`\}/)
  assert.match(source, /<div className="space-y-2\.5">/)
  assert.match(source, /<div className="space-y-2 rounded-md bg-kumo-elevated px-2\.5 py-2">/)
  assert.match(source, /<div className="space-y-1">/)
  assert.match(source, /<Banner[\s\S]*?variant="alert"/)
  assert.match(source, /icon=\{[\s\S]*<Warning size=\{16\} weight="fill" \/>[\s\S]*\}/)
  assert.doesNotMatch(source, /className="!w-fit !max-w-full !p-4"/)
  assert.match(source, /<Text as="p" variant="body" size="sm" DANGEROUS_className="m-0 leading-5 !text-inherit \[\&_strong\]:font-semibold \[\&_strong\]:text-current">/)
  assert.match(source, /<SetupGuideAlertBanner html=\{t\("setup\.ios\.step4Warning"\)\} \/>/)
  assert.match(source, /<SetupGuideAlertBanner html=\{t\("setup\.android\.step4_1Tip"\)\} \/>/)
  assert.doesNotMatch(source, /className="space-y-2 text-xs leading-5 text-kumo-subtle \[\&_strong\]:font-semibold \[\&_strong\]:text-kumo-default"/)
  assert.doesNotMatch(source, /className="text-xs font-medium text-kumo-default"/)
  assert.match(source, /className="absolute top-2 right-2"/)
  assert.match(source, /onClick=\{onClose\}/)
  assert.doesNotMatch(source, /bg-black\/30/)
  assert.match(source, /setup\.ios\.step1/)
  assert.match(source, /setup\.ios\.step3\.action1/)
  assert.match(source, /ClipboardText/)
  assert.match(source, /<ClipboardText[\s\S]*?size="base"/)
  assert.match(source, /const resolvedUrl = url \|\| t\("url\.placeholder"\)/)
  assert.match(source, /className="w-3\/4 max-w-full"/)
  assert.match(source, /setup\.android\.step1/)
  assert.match(source, /dangerouslySetInnerHTML/)
  assert.doesNotMatch(source, /setup\.ios\.step4Desc/)
  assert.match(cssSource, /\.step-list-ul li \{[\s\S]*font-size: inherit;/)
  assert.match(cssSource, /\.step-list-ul li \{[\s\S]*margin-bottom: 0\.25rem;/)
  assert.match(cssSource, /\.step-list-ul li::before \{[\s\S]*color:\s*var\(--step-list-bullet-color,\s*var\(--color-kumo-brand\)\);/)
  assert.match(cssSource, /\[data-home-settings-setup-panel\]\s*\{[\s\S]*--step-list-bullet-color:\s*var\(--text-color-kumo-default\);/)
  assert.doesNotMatch(cssSource, /\.highlight-badge \{/)
  assert.match(i18nSource, /'setup\.android\.step4_1Tip':/)
  assert.doesNotMatch(i18nSource, /highlight-badge/)
})

test("Registry settings cards only expose business ID selector", () => {
  const paneSource = readSource("src/pages/registry/sections/workspace/HomeSettingsPane.jsx")
  const shellSource = readSource("src/pages/registry/sections/workspace/SettingsCardShell.jsx")

  assert.match(shellSource, /data-home-settings-card=\{cardId\}/)
  assert.match(shellSource, /compactAtDesktop = true/)
  assert.match(shellSource, /compactAtDesktop \? "lg:min-h-0" : ""/)
  assert.doesNotMatch(shellSource, /data-home-settings-card-legacy/)
  assert.doesNotMatch(shellSource, /legacyCardId/)

  assert.match(paneSource, /compactAtDesktop=\{isDesktopShell\}/)
  assert.doesNotMatch(paneSource, /legacyId:/)
  assert.doesNotMatch(paneSource, /legacyCardId=/)
})


test("Registry settings URL block uses responsive row and flexible input", () => {
  const source = readSource("src/pages/registry/sections/workspace/cards/url-card.jsx")

  assert.match(source, /if \(config\.selectedType === "year"\)/)
  assert.match(source, /if \(config\.selectedType === "goal"\)/)
  assert.match(source, /className="min-w-0 w-full font-mono text-xs md:flex-1"/)
  assert.match(source, /className="min-w-0 w-full font-mono text-xs"/)
})

test("Registry goal config stays in goal-fields card with official range date picker and presets", () => {
  const goalSource = readSource("src/pages/registry/sections/workspace/cards/goal-fields-card.jsx")
  const rangeSource = readSource("src/pages/registry/sections/workspace/cards/goal-date-range-field.jsx")

  assert.match(goalSource, /t\("config\.goalName"\)/)
  assert.match(goalSource, /t\("config\.dateRange"\)/)
  assert.match(goalSource, /actions\.setGoalRange/)
  assert.match(goalSource, /config\.goalStartError/)
  assert.match(goalSource, /config\.goalDateError/)
  assert.match(rangeSource, /DatePicker/)
  assert.match(rangeSource, /mode="range"/)
  assert.match(rangeSource, /t\("preset\.range\.next30"\)/)
  assert.match(rangeSource, /t\("preset\.range\.next90"\)/)
  assert.match(rangeSource, /onChange/)
  assert.match(rangeSource, /today/)
  assert.match(rangeSource, /GOAL_START_MIN_ISO/)
  assert.match(rangeSource, /GOAL_TARGET_MAX_ISO/)
})

test("Legacy settings fallback is fully removed from HomeSettingsPane", () => {
  const source = readSource("src/pages/registry/sections/workspace/HomeSettingsPane.jsx")

  assert.doesNotMatch(source, /function shouldShowLegacySettings\(/)
  assert.doesNotMatch(source, /function LegacySettingsForm\(/)
  assert.doesNotMatch(source, /data-home-settings-legacy/)
  assert.doesNotMatch(source, /legacySettings=1/)
})

test("Registry menu accessibility labels are present in i18n", () => {
  const source = readSource("src/data/i18n.js")

  assert.match(source, /'registry\.menu\.open'/)
  assert.match(source, /'registry\.menu\.close'/)
  assert.match(source, /'registry\.sidebar\.toggle'/)
})

test("HomeGrid provides split workspace layout", () => {
  const source = readSource("src/pages/registry/sections/components/HomeGrid.jsx")

  assert.match(source, /const AUTOFLOW_INTERVAL_MS = 500/)
  assert.match(source, /const AUTOFLOW_STORAGE_KEY = "registry\.settingsAutoflow\.v1"/)
  assert.match(source, /function HomeGrid\(\{\s*selectedStyle,\s*forceOnboarding = false,\s*effectiveLayoutTier = "lg"\s*\}\)/)
  assert.match(source, /const isDesktopShell = effectiveLayoutTier === "lg" \|\| effectiveLayoutTier === "mid"/)
  assert.match(source, /localStorage\.getItem\(AUTOFLOW_STORAGE_KEY\)/)
  assert.match(source, /localStorage\.setItem\(AUTOFLOW_STORAGE_KEY,\s*"1"\)/)
  assert.match(source, /if \(forceOnboarding\) return/)
  assert.match(source, /const shouldSkipAutoflow = hasSeenAutoflow && !forceOnboarding/)
  assert.match(source, /const \[revealStage, setRevealStage\] = useState\(0\)/)
  assert.match(source, /const \[hasSeenAutoflow, setHasSeenAutoflow\] = useState\(\(\) => \{/)
  assert.match(source, /const handleRevealAll = useCallback\(\(\) => \{/)
  assert.match(source, /onRequestRevealAll=\{handleRevealAll\}/)
  assert.match(source, /data-registry-workspace/)
  assert.match(source, /data-registry-pane=["']preview["']/)
  assert.match(source, /data-registry-pane=["']settings["']/)
  assert.match(source, /<HomeSettingsPane[\s\S]*?revealStage=\{revealStage\}/)
  assert.match(source, /<HomeSettingsPane[\s\S]*?effectiveLayoutTier=\{effectiveLayoutTier\}/)
  assert.doesNotMatch(source, /vendor\/kumo\/packages\/kumo-docs-astro\/src\/components\/demos\/HomeGrid/)
})

test("HomeSettingsPane supports mid tier as desktop shell single-column equal rows", () => {
  const source = readSource("src/pages/registry/sections/workspace/HomeSettingsPane.jsx")

  assert.match(source, /const isMid = effectiveLayoutTier === "mid"/)
  assert.match(source, /const isLg = effectiveLayoutTier === "lg"/)
  assert.match(source, /const isDesktopShell = isMid \|\| isLg/)
  assert.match(source, /const rowCount = resolveMidRowCount\(config\.selectedType\)/)
  assert.match(source, /const gridInlineStyle = isMid \? \{ gridTemplateRows: `repeat\(\$\{rowCount\}, minmax\(0, 1fr\)\)` \} : undefined/)
  assert.match(source, /isMid \? "md:grid-cols-1" : "md:grid-cols-2"/)
  assert.match(source, /style=\{gridInlineStyle\}/)
})

test("HomePreviewPane keeps select-type hint before style selection", () => {
  const source = readSource("src/pages/registry/sections/workspace/HomePreviewPane.jsx")

  assert.match(source, /function HomePreviewPane\(\{\s*config,\s*selectedDevice,\s*t\s*\}\)/)
  assert.match(source, /preview\.selectType/)
  assert.doesNotMatch(source, /SkeletonLine/)
})

test("HomeSettingsPane uses six-slot skeleton base and stage-based reveal", () => {
  const source = readSource("src/pages/registry/sections/workspace/HomeSettingsPane.jsx")

  assertNamedImports(source, "@/components/ui/kumo", ["SkeletonLine"])
  assert.match(source, /const SKELETON_SLOT_MARKS = \["➊", "➋", "➌", "➍", "➎", "➏"\]/)
  assert.match(source, /function SettingsCardTitleSkeleton\(\)/)
  assert.match(source, /\{!config\.selectedType/)
  assert.match(source, /title={<SettingsCardTitleSkeleton \/>}/)
  assert.match(source, /const title = isUnlocked \? resolvedTitle : <SettingsCardTitleSkeleton \/>/)
  assert.match(source, /const titleTooltip = isUnlocked \? resolvedTitleTooltip : undefined/)
  assert.match(source, /const unlockedCount = Math\.min\(cardOrder\.length, Math\.max\(0, revealStage\)\)/)
  assert.match(source, /onRequestRevealAll/)
  assert.match(source, /<SkeletonLine/)
})

test("Kumo UI export includes SkeletonLine for page-level placeholders", () => {
  const source = readSource("src/components/ui/kumo.jsx")
  assert.match(source, /SkeletonLine/)
})

test("No unsupported Text variants are used in src", () => {
  const sourceFiles = listFiles("src").filter((file) => file.endsWith(".jsx"))
  const offenders = sourceFiles.filter((file) => /\bvariant=["']heading4["']/.test(readSource(file)))

  assert.equal(
    offenders.length,
    0,
    `Unsupported Text variant heading4 used in: ${offenders.join(", ")}`
  )
})

test("Lucide icons are fully removed from src", () => {
  const sourceFiles = listFiles("src").filter((file) => file.endsWith(".jsx"))
  const offenders = sourceFiles.filter((file) => readSource(file).includes("lucide-react"))

  assert.equal(
    offenders.length,
    0,
    `lucide-react still used in: ${offenders.join(", ")}`
  )
})

test("react-icons is fully removed from src", () => {
  const sourceFiles = listFiles("src").filter((file) => file.endsWith(".jsx"))
  const offenders = sourceFiles.filter((file) => readSource(file).includes("react-icons"))

  assert.equal(
    offenders.length,
    0,
    `react-icons still used in: ${offenders.join(", ")}`
  )
})

test("Neumorphic variables are fully removed from src", () => {
  const sourceFiles = listFiles("src").filter((file) => file.endsWith(".jsx") || file.endsWith(".css"))
  const offenders = sourceFiles.filter((file) => readSource(file).includes("--neumorphic-"))

  assert.equal(
    offenders.length,
    0,
    `--neumorphic-* still used in: ${offenders.join(", ")}`
  )
})
