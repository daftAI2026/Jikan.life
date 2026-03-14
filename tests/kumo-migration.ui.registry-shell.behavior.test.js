/**
 * [INPUT]: 依赖 node:test/node:assert 与 tests/helpers/source-test-helpers
 * [OUTPUT]: 向 `node --test` 注册 Registry 壳层护栏用例，覆盖 HomePage、Sidebar、Topbar、LanguageSelect、MobileFooter 与页面壳导入边界
 * [POS]: tests/ UI 迁移护栏的页面壳层，锁定 HomePage、Sidebar、Topbar、语言切换与壳层导入边界
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { test } from "node:test"
import assert from "node:assert/strict"
import { assertNamedImports, fs, listFiles, path, readSource } from "./helpers/source-test-helpers.js"

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
  assert.match(layoutTierSource, /function shouldUseDesktopWorkspaceShell\(\{ effectiveLayoutTier, sidebarOpen \}\)/)
  assert.match(layoutTierSource, /function shouldUseSegmentedWorkspace\(\{ effectiveLayoutTier, sidebarOpen \}\)/)
  assert.match(layoutTierSource, /if \(effectiveLayoutTier === "md"\) return !sidebarOpen/)
  assert.match(homePageSource, /id="main-content"/)
  assert.match(homePageSource, /resolveEffectiveLayoutTier/)
  assert.match(homePageSource, /const effectiveLayoutTier = resolveEffectiveLayoutTier\(\{ viewportWidth, sidebarOpen \}\)/)
  assert.match(homePageSource, /const isDesktopShell = effectiveLayoutTier === "lg" \|\| effectiveLayoutTier === "mid"/)
  assert.match(homePageSource, /const isMdClosedPane = effectiveLayoutTier === "md" && !sidebarOpen/)
  assert.match(homePageSource, /effectiveLayoutTier=\{effectiveLayoutTier\}/)
  assert.match(homePageSource, /registry-main-content-mobile-height/)
  assert.match(homePageSource, /md:overflow-y-auto/)
  assert.match(homePageSource, /md:overscroll-y-none/)
  assert.match(homePageSource, /isDesktopShell \? "md:overflow-y-hidden" : ""/)
  assert.match(homePageSource, /isDesktopShell \? "md:h-full" : ""/)
  assert.match(homePageSource, /isMdClosedPane/)
  assert.match(homePageSource, /"md:h-\[calc\(100vh-var\(--registry-topbar-height\)\)\]"/)
  assert.match(homePageSource, /isDesktopShell[\s\S]*"md:h-full"/)
  assert.doesNotMatch(homePageSource, /resolveSettingsLayoutTier/)
  assert.doesNotMatch(homePageSource, /shouldUseDesktopWorkspaceShell/)

  assert.match(homeGridSource, /relative grid/)
  assert.match(homeGridSource, /overflow-x-hidden/)
  assert.match(homeGridSource, /bg-kumo-elevated/)
  assert.match(homeGridSource, /md:h-auto/)
  assert.match(homeGridSource, /md:overflow-y-visible/)
  assert.match(homeGridSource, /md:overscroll-y-auto/)
  assert.doesNotMatch(homeGridSource, /md:overflow-visible/)
  assert.match(homeGridSource, /effectiveLayoutTier = "lg"/)
  assert.match(homeGridSource, /const isDesktopShell = shouldUseDesktopWorkspaceShell\(\{ effectiveLayoutTier, sidebarOpen \}\)/)
  assert.match(homeGridSource, /const useSegmentedWorkspaceLayout = shouldUseSegmentedWorkspace\(\{ effectiveLayoutTier, sidebarOpen \}\)/)
  assert.match(homeGridSource, /const paneEffectiveLayoutTier = effectiveLayoutTier === "md" && !sidebarOpen \? "mid" : effectiveLayoutTier/)
  assert.match(homeGridSource, /const segmentedWorkspaceLayoutClassName = effectiveLayoutTier === "mobile"/)
  assert.match(homeGridSource, /\? "h-full grid-rows-\[minmax\(0,1fr\)_auto\] overflow-y-hidden"/)
  assert.match(homeGridSource, /: "md:h-\[calc\(100vh-var\(--registry-topbar-height\)\)\] md:grid-rows-\[minmax\(0,1fr\)_auto\] md:overflow-hidden"/)
  assert.match(homeGridSource, /const workspaceLayoutClassName = useSegmentedWorkspaceLayout/)
  assert.match(homeGridSource, /: isDesktopShell/)
  assert.match(homeGridSource, /\? "md:h-full md:grid-cols-2 md:divide-x md:divide-kumo-line md:overflow-hidden"/)
  assert.match(homeGridSource, /: "overflow-y-auto overscroll-y-contain md:h-auto md:overflow-y-visible md:overscroll-y-auto"/)
  assert.match(homeGridSource, /const shouldRenderGridGuideHost = effectiveLayoutTier === "md" && sidebarOpen/)
  assert.match(homeGridSource, /const shouldRenderMobileGuideHost = effectiveLayoutTier === "mobile"/)
  assert.match(homeGridSource, /const shouldRenderPaneGuideHost = !shouldRenderGridGuideHost && !shouldRenderMobileGuideHost/)
  assert.doesNotMatch(homeGridSource, /relative grid h-full min-h-0 grid-cols-1 overflow-x-hidden overflow-y-auto overscroll-y-contain bg-kumo-elevated/)

  assert.match(settingsSource, /overflow-x-hidden/)
  assert.match(settingsSource, /overflow-y-auto/)
  assert.match(settingsSource, /effectiveLayoutTier = "lg"/)
  assert.match(settingsSource, /const isMid = effectiveLayoutTier === "mid"/)
  assert.match(settingsSource, /const isLg = effectiveLayoutTier === "lg"/)
  assert.match(settingsSource, /const isDesktopShell = isMid \|\| isLg/)
  assert.match(settingsSource, /isDesktopShell \? "md:h-full md:overflow-y-hidden" : "md:h-auto md:overflow-y-visible"/)
  assert.doesNotMatch(settingsSource, /settingsLayoutTier/)
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
  assert.match(
    cssSource,
    /height:\s*calc\(100dvh\s*-\s*var\(--registry-topbar-height\)\s*-\s*var\(--registry-mobile-footer-height\)\);/
  )
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

test("Source code keeps vendor/kumo references fenced to the local DatePicker bridge", () => {
  const sourceFiles = listFiles("src").filter((file) => file.endsWith(".jsx") || file.endsWith(".js"))
  const illegalVendorImports = sourceFiles.filter((file) => {
    const source = readSource(file)
    return /from ["'][^"']*vendor\/kumo(?!-date-picker)[^"']*["']/.test(source)
  })
  const bridgeImports = sourceFiles.filter((file) => {
    const source = readSource(file)
    return /from ["'][^"']*vendor\/kumo-date-picker[^"']*["']/.test(source)
  })

  assert.equal(
    illegalVendorImports.length,
    0,
    `source files should not reference legacy vendor/kumo paths: ${illegalVendorImports.join(", ")}`
  )
  assert.deepEqual(bridgeImports, ["src/components/ui/kumo.jsx"])
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
  assert.match(source, /y={ring\.centerY}/)
  assert.doesNotMatch(source, /y={ring\.centerY - 1}/)
  assert.match(source, /y={labelY}/)
  assert.doesNotMatch(source, /y={labelY \+ 8}/)
  assert.doesNotMatch(source, /ring\.centerY \+ ring\.radius \* 0\.62/)
})

test("HomeSidebar goal visual recenters the preview ring geometry inside the square card", () => {
  const source = readSource("src/pages/registry/sections/home-sidebar-visuals.jsx")

  assert.doesNotMatch(source, /const previewOffsetY = 50 - ring\.centerY/)
  assert.doesNotMatch(source, /<g transform=\{`translate\(0 \$\{previewOffsetY\}\)`\}>/)
  assert.match(source, /cx={ring\.centerX}/)
  assert.match(source, /cy={ring\.centerY}/)
})

test("HomeSidebar goal preview fixes the ring progress to match the 69-day sample", () => {
  const source = readSource("src/pages/registry/sections/home-sidebar-date-stats.js")

  assert.match(source, /const GOAL_PREVIEW_PROGRESS = 0\.69/)
  assert.match(source, /const GOAL_PREVIEW_DAYS_REMAINING = 69/)
  assert.match(source, /const GOAL_PREVIEW_RING = \{ centerX: 50, centerY: 50, radius: 34\.5, progress: GOAL_PREVIEW_PROGRESS \}/)
  assert.match(source, /const GOAL_PREVIEW_NUMBER_FONT_SIZE = 24/)
  assert.match(source, /const GOAL_PREVIEW_LABEL_FONT_SIZE = 5/)
  assert.match(source, /const GOAL_PREVIEW_LABEL_Y = 69/)
  assert.match(source, /daysLeftText:\s*getWallpaperText\(lang,\s*"daysLeftLabel",\s*""\)/)
  assert.doesNotMatch(source, /computeGoalLayout/)
  assert.doesNotMatch(source, /clockHeight:/)
  assert.doesNotMatch(source, /goalStart/)
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
