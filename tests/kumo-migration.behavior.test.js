/**
 * [INPUT]: 依赖 node:test, node:assert/strict, node:fs, node:path
 * [OUTPUT]: Kumo 迁移关键约束的回归测试（含 ColorPicker 状态桥接、弹层链路、Year 10x10 点阵与跨午夜刷新护栏）
 * [POS]: tests/ UI 迁移护栏，防止主题/组件体系、ColorPicker 拖拽语义、Year 进度映射与日切刷新语义回退
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { test } from "node:test"
import assert from "node:assert/strict"
import fs from "node:fs"
import path from "node:path"
import { pathToFileURL } from "node:url"

const readSource = (relativePath) => {
  const filePath = path.join(process.cwd(), relativePath)
  return fs.readFileSync(filePath, "utf8")
}

const readJson = (relativePath) => {
  const filePath = path.join(process.cwd(), relativePath)
  return JSON.parse(fs.readFileSync(filePath, "utf8"))
}

const listFiles = (relativePath) => {
  const root = path.join(process.cwd(), relativePath)
  const entries = fs.readdirSync(root, { withFileTypes: true })
  return entries.flatMap((entry) => {
    const nextPath = path.join(relativePath, entry.name)
    if (entry.isDirectory()) {
      return listFiles(nextPath)
    }
    return [nextPath]
  })
}

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

test("Header toggles data-mode instead of .dark class", () => {
  const source = readSource("src/components/layout/Header.jsx")

  assert.match(source, /data-mode/)
  assert.doesNotMatch(source, /classList\.add\(['"]dark['"]\)/)
  assert.doesNotMatch(source, /classList\.remove\(['"]dark['"]\)/)
})

test("Sonner toaster reads data-mode and does not depend on next-themes", () => {
  const source = readSource("src/components/ui/sonner.jsx")

  assert.doesNotMatch(source, /next-themes/)
  assert.doesNotMatch(source, /useTheme/)
  assert.match(source, /data-mode/)
})

test("Header uses Phosphor icons", () => {
  const source = readSource("src/components/layout/Header.jsx")
  assert.match(source, /@phosphor-icons\/react/)
})

test("App uses KumoShell layout", () => {
  const source = readSource("src/App.jsx")
  assert.match(source, /KumoShell/)
})

test("App routes include home entry, /app redirect, and /design entry", () => {
  const source = readSource("src/App.jsx")

  assert.match(source, /HomePage/)
  assert.match(source, /path=["']\/app["']/)
  assert.match(source, /Navigate to=["']\/["'] replace/)
  assert.match(source, /path=["']\/design["']/)
})

test("KumoShell defines sidebar and content slots", () => {
  const source = readSource("src/components/layout/KumoShell.jsx")
  assert.match(source, /data-kumo-shell/)
  assert.match(source, /<aside/)
  assert.match(source, /<main/)
})

test("P0 UI components are backed by Kumo primitives (popover re-exports Kumo primitive)", () => {
  const button = readSource("src/components/ui/button.jsx")
  const input = readSource("src/components/ui/input.jsx")
  const select = readSource("src/components/ui/select.jsx")
  const dialog = readSource("src/components/ui/dialog.jsx")
  const tabs = readSource("src/components/ui/tabs.jsx")
  const switchControl = readSource("src/components/ui/switch.jsx")
  const tooltip = readSource("src/components/ui/tooltip.jsx")
  const popover = readSource("src/components/ui/popover.jsx")

  assert.match(button, /@cloudflare\/kumo\/components\/button/)
  assert.match(input, /@cloudflare\/kumo\/components\/input/)
  assert.match(select, /@cloudflare\/kumo\/components\/select/)
  assert.match(dialog, /@cloudflare\/kumo\/components\/dialog/)
  assert.match(tabs, /@cloudflare\/kumo\/components\/tabs/)
  assert.match(switchControl, /@cloudflare\/kumo\/components\/switch/)
  assert.match(tooltip, /@cloudflare\/kumo\/components\/tooltip/)
  assert.match(popover, /@cloudflare\/kumo\/components\/popover/)
})

test("Calendar avoids shadcn Select subcomponents", () => {
  const source = readSource("src/components/ui/calendar.jsx")

  assert.doesNotMatch(source, /SelectContent/)
  assert.doesNotMatch(source, /SelectTrigger/)
  assert.doesNotMatch(source, /SelectValue/)
})

test("ColorPicker uses Kumo popover trigger/content structure without shadcn select subcomponents", () => {
  const source = readSource("src/components/ui/color-picker.jsx")

  assert.match(source, /import \{ Popover \} from "@\/components\/ui\/popover"/)
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
  assert.match(source, /\{colorSpace === "hex" && \(/)
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
  assert.match(source, /import \{ useColorPickerStateBridge \} from "@\/components\/ui\/use-color-picker-state-bridge"/)
  assert.doesNotMatch(source, /function useColorPickerStateBridge\(value\)/)
  assert.match(source, /const \{ internalColor, setInternalColor \} = useColorPickerStateBridge\(value\)/)
  assert.match(source, /setInternalColor\(newColor\)/)
  assert.match(bridgeSource, /export function useColorPickerStateBridge\(value\)/)
  assert.match(bridgeSource, /const \[internalColor, setInternalColor\] = useState\(externalColor\)/)
  assert.match(bridgeSource, /if \(externalColor\.toString\('hex'\) !== internalColor\.toString\('hex'\)\)/)
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
  const card = readSource("src/components/ui/card.jsx")

  assert.match(badge, /@cloudflare\/kumo\/components\/badge/)
  assert.match(card, /@cloudflare\/kumo\/components\/surface/)
})

test("Registry layout mirrors Kumo home layout", () => {
  const source = readSource("src/pages/registry/HomePage.jsx")

  assert.match(source, /className="isolate"/)
  assert.match(source, /HomeTopbar/)
  assert.match(source, /HomeSidebar/)
  assert.match(source, /HomeGrid/)
  assert.match(source, /ThemeToggle/)
  assert.match(source, /LanguageSelect/)
  assert.match(source, /md:pr-12/)
})

test("Registry topbar mounts language selector near left side", () => {
  const source = readSource("src/pages/registry/sections/HomeTopbar.jsx")

  assert.match(source, /<LanguageSelect\s*\/>/)
  assert.match(source, /<div className="mx-auto hidden h-12 items-center px-4 md:flex md:border-r md:border-kumo-line">/)
})

test("HomePage keeps language selector as mobile fallback", () => {
  const source = readSource("src/pages/registry/HomePage.jsx")

  assert.match(source, /<LanguageSelect\s*\/>/)
  assert.match(source, /fixed right-2 bottom-2 z-50 md:hidden/)
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
  const searchDialog = path.join("src/pages/registry/sections", "SearchDialog.jsx")
  const menuIcon = path.join("src/pages/registry/sections", "JikanMenuIcon.jsx")

  assert.ok(fs.existsSync(path.join(process.cwd(), homeGrid)))
  assert.ok(fs.existsSync(path.join(process.cwd(), themeToggle)))
  assert.ok(fs.existsSync(path.join(process.cwd(), languageSelect)))
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

test("HomeSidebar is non-scrollable and hides Life style card", () => {
  const source = readSource("src/pages/registry/sections/HomeSidebar.jsx")

  assert.match(source, /import \{ useEffect, useMemo, useState \} from "react"/)
  assert.doesNotMatch(source, /overflow-y-auto/)
  assert.match(source, /h-full/)
  assert.match(source, /selectedStyle = "year"/)
  assert.match(source, /id:\s*"year"/)
  assert.match(source, /id:\s*"goal"/)
  assert.match(source, /const HIDDEN_STYLE_CARD_IDS = new Set\(\["life"\]\)/)
  assert.match(source, /\.filter\(\(style\)\s*=>\s*!HIDDEN_STYLE_CARD_IDS\.has\(style\.id\)\)/)
  assert.doesNotMatch(source, /style\.id === "life"/)
  assert.doesNotMatch(source, /const cardStats = useMemo/)
  assert.match(source, /border-t border-kumo-line/)
  assert.match(source, /t\("types\.header"\)/)
  assert.match(source, /t\("type\.year\.name"\)/)
  assert.match(source, /t\("type\.goal\.name"\)/)
  assert.doesNotMatch(source, /<span>Select<\/span>/)
  assert.doesNotMatch(source, /button\.selected/)
  assert.doesNotMatch(source, /["']Selected["']/)
  assert.doesNotMatch(source, /CheckIcon/)
  assert.doesNotMatch(source, /ArrowRightIcon/)
  assert.match(source, /gap-\[4px\]/)
  assert.match(source, /h-\[10px\] w-\[10px\] origin-center scale-\[0\.84\]/)
  assert.match(source, /h-\[100px\] w-\[100px\]/)
  assert.match(source, /const YEAR_GRID_COLUMNS = 10/)
  assert.match(source, /return \{ day, week, percent, totalDays \}/)
  assert.match(source, /const \[todayKey, setTodayKey\] = useState\(\(\) => getLocalDateKey\(\)\)/)
  assert.match(source, /useEffect\(\(\) => \{/)
  assert.match(source, /const yearStats = useMemo\(\(\) => getYearStats\(\), \[todayKey\]\)/)
  assert.doesNotMatch(source, /const yearStats = useMemo\(\(\) => getYearStats\(\), \[\]\)/)
  assert.match(source, /const totalDots = YEAR_GRID_COLUMNS \* YEAR_GRID_COLUMNS/)
  assert.match(source, /function YearVisual\(\{ percent \}\)/)
  assert.match(source, /<div className="origin-center scale-\[1\]">\s*<YearVisual percent=\{yearStats\.percent\} \/>/)
  assert.match(source, /<YearVisual percent=\{yearStats\.percent\} \/>/)
  assert.match(source, /const filledCount = Math\.min\(totalDots, Math\.max\(0, percent\)\)/)
  assert.doesNotMatch(source, /YEAR_EXTRA_FILLED_ROWS/)
  assert.doesNotMatch(source, /baseFilledCount/)
  assert.doesNotMatch(source, /progressDots/)
  assert.doesNotMatch(source, /progressFilledCount/)
  assert.match(source, /gridTemplateColumns:\s*`repeat\(\$\{YEAR_GRID_COLUMNS\}, minmax\(0, 1fr\)\)`/)
  assert.match(source, /scale-\[1\.8\]/)
  assert.doesNotMatch(source, /scale-\[0\.8\]/)
})

test("HomeSidebar year visual uses three-state dot design tokens", () => {
  const source = readSource("src/pages/registry/sections/HomeSidebar.jsx")

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

test("HomeSidebar goal visual text positions follow preview layout parameters", () => {
  const source = readSource("src/pages/registry/sections/HomeSidebar.jsx")

  assert.match(source, /const \{ ring, daysRemaining, daysLeftText, numberFontSize, labelFontSize, labelY \} = layout/)
  assert.match(source, /y={ring\.centerY - 1}/)
  assert.match(source, /y={labelY \+ 8}/)
  assert.doesNotMatch(source, /ring\.centerY \+ ring\.radius \* 0\.62/)
})

test("HomePage keeps selectedStyle as single source of truth", () => {
  const source = readSource("src/pages/registry/HomePage.jsx")

  assert.match(source, /useState\(["']year["']\)/)
  assert.match(source, /selectedStyle={selectedStyle}/)
  assert.match(source, /onStyleChange={setSelectedStyle}/)
  assert.match(source, /<HomeGrid\s+selectedStyle={selectedStyle}/)
})

test("Registry sidebar is local controlled implementation", () => {
  const source = readSource("src/pages/registry/sections/HomeSidebar.jsx")

  assert.match(source, /data-sidebar-open={isSidebarOpen}/)
  assert.match(source, /t\("types\.header"\)/)
  assert.match(source, /t\("type\.year\.name"\)/)
  assert.match(source, /t\("type\.goal\.name"\)/)
  assert.match(source, /const HIDDEN_STYLE_CARD_IDS = new Set\(\["life"\]\)/)
  assert.match(source, /\.filter\(\(style\)\s*=>\s*!HIDDEN_STYLE_CARD_IDS\.has\(style\.id\)\)/)
  assert.doesNotMatch(source, /style\.id === "life"/)
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

  assert.match(source, /useI18n/)
  assert.match(source, /LANGUAGE_META/)
  assert.match(source, /const\s+\{\s*t\s*\}\s*=\s*useI18n\(\)/)
  assert.match(source, /flag:\s*meta\.flag/)
  assert.match(source, /name:\s*t\(meta\.labelKey\)/)
  assert.doesNotMatch(source, /REGISTRY_UI_LANG/)
  assert.doesNotMatch(source, /createEnglishTranslator/)
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

  assert.match(source, /import\s+\{\s*ColorPicker\s*\}\s+from\s+"@\/components\/ui\/color-picker"/)
  assert.match(source, /titleKey:\s*"config\.colors"/)
  assert.match(source, /className="flex w-full max-w-full flex-col items-center gap-4 px-4 py-1"/)
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
  assert.match(source, /className="w-\[200px\] max-w-full[^\"]*"/)
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
  assert.match(source, /import\s+\{\s*VISIBLE_DEVICE_CATEGORIES\s*\}\s+from\s+"\.\.\/device-visibility"/)
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

  assert.match(source, /normalizeDeviceName/)
  assert.match(source, /setDevice\(value\)\s*\{[\s\S]*?normalizeDeviceName\(value\)/)
  assert.match(source, /import\s+\{[\s\S]*PRIMARY_VISIBLE_DEVICE_CATEGORY[\s\S]*isVisibleDeviceCategory[\s\S]*\}\s+from\s+"\.\/device-visibility"/)
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

  assert.match(source, /title:\s*"Goal"/)
  assert.match(source, /className="flex w-full max-w-full flex-col items-center gap-4 px-4 py-1"/)
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
  assert.match(source, /maxValue=\{todayISO\}/)
  assert.match(source, /type="number"/)
  assert.match(source, /min=\{50\}/)
  assert.match(source, /max=\{120\}/)
  assert.match(source, /t\("config\.dateOfBirthHint"\)/)
  assert.match(source, /t\("config\.lifespanHint"\)/)
  assert.match(source, /className="w-\[200px\] max-w-full"/)
})

test("Goal url card uses setup title and set flow guarded by copy success", () => {
  const source = readSource("src/pages/registry/sections/workspace/HomeSettingsPane.jsx")
  const urlSource = readSource("src/pages/registry/sections/workspace/cards/url-card.jsx")

  assert.match(source, /const SETUP_FLOW_TYPES = new Set\(\["year", "goal"\]\)/)
  assert.match(urlSource, /const SETUP_FLOW_TYPES = new Set\(\["year", "goal"\]\)/)
  assert.match(urlSource, /resolveTitle:\s*\(\{\s*config,\s*t\s*\}\)\s*=>[\s\S]*?SETUP_FLOW_TYPES\.has\(config\.selectedType\)\s*\?\s*t\("setup\.title"\)\s*:\s*"Collapsible"/)
  assert.match(urlSource, /if\s*\(config\.selectedType === "goal"\)/)
  assert.match(urlSource, /w-\[220px\] max-w-full flex-col gap-2 px-3 py-1/)
  assert.match(urlSource, /KumoButton[\s\S]*?variant="secondary"/)
  assert.match(urlSource, /w-full justify-center text-center transition-colors not-disabled:hover:!bg-kumo-tint/)
  assert.match(urlSource, /variant="secondary"/)
  assert.match(urlSource, /not-disabled:hover:!bg-kumo-tint/)
  assert.match(urlSource, /t\("url\.set"\)/)
  assert.match(source, /const handleSetIt = async \(\) => \{[\s\S]*?const ok = await actions\.copyUrl\(\)/)
  assert.match(source, /const handleSetIt = async \(\) => \{[\s\S]*?if \(!ok\) return/)
  assert.match(source, /useEffect\(\(\) => \{[\s\S]*?if \(!SETUP_FLOW_TYPES\.has\(config\.selectedType\)\) \{/)
  assert.match(source, /selectedDevice\.category === "Android" \? "android" : "ios"/)
  assert.match(source, /<SetupGuidePanel[\s\S]*?open=\{isSetupPanelOpen\}/)
  assert.match(source, /<SetupGuidePanel[\s\S]*?platform=\{setupPlatform\}/)
  assert.match(source, /<SetupGuidePanel[\s\S]*?onClose=\{handleCloseSetupPanel\}/)
  assert.match(source, /<SetupGuidePanel[\s\S]*?url=\{url\}/)
})

test("Year merged slot uses setup url card as slot 5 with compact inline row on md+", () => {
  const source = readSource("src/pages/registry/sections/workspace/HomeSettingsPane.jsx")
  const urlSource = readSource("src/pages/registry/sections/workspace/cards/url-card.jsx")

  assert.match(source, /const YEAR_SETTINGS_CARD_IDS = \["location", "wallpaper-lang", "colors", "device", "url"\]/)
  assert.match(source, /const CARD_SHELL_CLASS_BY_TYPE = \{[\s\S]*?year:\s*\{[\s\S]*?url:\s*"md:col-span-2"/)
  assert.match(source, /className=\{resolveCardShellClassName\(config\.selectedType,\s*cardId\)\}/)
  assert.match(urlSource, /if\s*\(config\.selectedType === "year"\)/)
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

  assert.match(source, /data-home-settings-setup-panel/)
  assert.match(source, /pointer-events-none absolute inset-0 z-40/)
  assert.match(source, /pointer-events-auto absolute inset-y-0 right-0/)
  assert.match(source, /transition-transform duration-300 ease-out/)
  assert.match(source, /open \? "translate-x-0" : "translate-x-full"/)
  assert.match(source, /import\s+\{\s*Banner,\s*Button as KumoButton,\s*ClipboardText,\s*Surface,\s*Text\s*\}\s+from\s+"@\/components\/ui\/kumo"/)
  assert.match(source, /<header className="relative flex items-start border-b border-kumo-line px-4 py-4">/)
  assert.match(source, /<Text as="h3" variant="heading3" DANGEROUS_className="leading-6">/)
  assert.match(source, /<Text as="h4" variant="body" size="sm" bold>/)
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
  assert.match(cssSource, /\.step-list-ul li::before \{[\s\S]*color:\s*var\(--step-list-bullet-color,\s*var\(--primary\)\);/)
  assert.match(cssSource, /\[data-home-settings-setup-panel\]\s*\{[\s\S]*--step-list-bullet-color:\s*var\(--foreground\);/)
  assert.doesNotMatch(cssSource, /\.highlight-badge \{/)
  assert.match(i18nSource, /'setup\.android\.step4_1Tip':/)
  assert.doesNotMatch(i18nSource, /highlight-badge/)
})

test("Registry settings cards only expose business ID selector", () => {
  const paneSource = readSource("src/pages/registry/sections/workspace/HomeSettingsPane.jsx")
  const shellSource = readSource("src/pages/registry/sections/workspace/SettingsCardShell.jsx")

  assert.match(shellSource, /data-home-settings-card=\{cardId\}/)
  assert.doesNotMatch(shellSource, /data-home-settings-card-legacy/)
  assert.doesNotMatch(shellSource, /legacyCardId/)

  assert.doesNotMatch(paneSource, /legacyId:/)
  assert.doesNotMatch(paneSource, /legacyCardId=/)
})

test("Button adapter normalizes legacy props and preserves react-aria trigger compatibility", () => {
  const source = readSource("src/components/ui/button.jsx")

  assert.match(source, /usePress/)
  assert.match(source, /ButtonContext/)
  assert.match(source, /const LEGACY_VARIANT_TO_KUMO_VARIANT\s*=\s*\{/)
  assert.match(source, /default:\s*"secondary"/)
  assert.match(source, /link:\s*"ghost"/)
  assert.match(source, /accent:\s*"primary"/)
  assert.match(source, /const LEGACY_SIZE_TO_KUMO_SIZE\s*=\s*\{/)
  assert.match(source, /default:\s*"base"/)
  assert.match(source, /icon:\s*"lg"/)
  assert.match(source, /size === "icon" \? "square" : "base"/)
  assert.match(source, /if \(asChild\)/)
  assert.match(source, /<Slot/)
  assert.match(source, /variant={resolvedVariant}/)
  assert.match(source, /size={resolvedSize}/)
  assert.match(source, /shape={resolvedShape}/)
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

  assert.match(source, /data-registry-workspace/)
  assert.match(source, /data-registry-pane=["']preview["']/)
  assert.match(source, /data-registry-pane=["']settings["']/)
  assert.doesNotMatch(source, /vendor\/kumo\/packages\/kumo-docs-astro\/src\/components\/demos\/HomeGrid/)
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

test("Wallpaper preview shares one language font strategy from shared core", async () => {
  const corePath = path.join(process.cwd(), "shared/wallpaper-core.js")
  const { getWallpaperFontFamily } = await import(`file://${corePath}`)
  const rendererSource = readSource("src/lib/renderer.js")
  const yearSource = readSource("worker/generators/year.js")
  const lifeSource = readSource("worker/generators/life.js")
  const indexSource = readSource("index.html")

  assert.equal(typeof getWallpaperFontFamily, "function")
  assert.equal(getWallpaperFontFamily("en"), '"Inter", sans-serif')
  assert.equal(getWallpaperFontFamily("zh-CN"), '"Noto Sans SC", "Inter", sans-serif')
  assert.equal(getWallpaperFontFamily("zh-TW"), '"Noto Sans TC", "Inter", sans-serif')
  assert.equal(getWallpaperFontFamily("ja"), '"Noto Sans JP", "Inter", sans-serif')

  assert.match(rendererSource, /getWallpaperFontFamily/)
  assert.doesNotMatch(rendererSource, /"SF Mono"|"Menlo"|"Courier New"/)
  assert.doesNotMatch(yearSource, /font-family="Inter"/)
  assert.doesNotMatch(lifeSource, /font-family="Inter"/)

  assert.match(indexSource, /Noto\+Sans\+SC/)
  assert.match(indexSource, /Noto\+Sans\+TC/)
  assert.match(indexSource, /Noto\+Sans\+JP/)
})

test("Worker SVG reuses shared getWallpaperFontFamily without local font map", () => {
  const svgSource = readSource("worker/svg.js")

  assert.match(svgSource, /import\s+\{\s*getWallpaperFontFamily\s*\}\s+from\s+['"]\.\.\/shared\/wallpaper-core\.js['"]/)
  assert.match(svgSource, /getWallpaperFontFamily\(lang\)/)
  assert.doesNotMatch(svgSource, /FONT_FAMILY_BY_LANG/)
})

test("GoalStart is wired through registry config state and URL generation", () => {
  const source = readSource("src/pages/registry/sections/workspace/useHomeWallpaperConfig.js")

  assert.match(source, /goalStart:\s*""/)
  assert.match(source, /goalStartError:\s*""/)
  assert.match(source, /goalDateError:\s*""/)
  assert.match(source, /validateGoalDateInputs/)
  assert.match(source, /if \(config\.goalStart && !goalDateErrors\.goalStartError\) params\.set\("goalStart", config\.goalStart\)/)
  assert.match(source, /setGoalStart\(value\)/)
  assert.match(source, /setGoalRange\(\{\s*startISO,\s*endISO\s*\}\)/)
})

test("Goal date actions delegate to a single internal updater without changing compatibility entrypoints", () => {
  const source = readSource("src/pages/registry/sections/workspace/useHomeWallpaperConfig.js")

  assert.match(source, /function applyGoalDateUpdate\(prev,\s*payload\)/)
  assert.match(source, /setGoalRange\(\{\s*startISO,\s*endISO\s*\}\)\s*\{[\s\S]*applyGoalDateUpdate\(prev,\s*\{[\s\S]*type:\s*"range",[\s\S]*startISO,[\s\S]*endISO,[\s\S]*todayISO,[\s\S]*\}\)/)
  assert.match(source, /setGoalStart\(value\)\s*\{[\s\S]*applyGoalDateUpdate\(prev,\s*\{[\s\S]*type:\s*"start",[\s\S]*value,[\s\S]*todayISO,[\s\S]*\}\)/)
  assert.match(source, /setGoalDate\(value\)\s*\{[\s\S]*applyGoalDateUpdate\(prev,\s*\{[\s\S]*type:\s*"date",[\s\S]*value,[\s\S]*todayISO,[\s\S]*\}\)/)
})

test("Unified goal date updater preserves legacy start/date guard semantics", () => {
  const source = readSource("src/pages/registry/sections/workspace/useHomeWallpaperConfig.js")

  assert.match(source, /if \(payload\.type === "start"\)[\s\S]*if \(!value\)[\s\S]*goalStart:\s*""/)
  assert.match(source, /if \(payload\.type === "start"\)[\s\S]*if \(!isValidISODateString\(value\)\)[\s\S]*goalStartError:\s*"error\.goalStart\.outOfRange"/)
  assert.match(source, /if \(payload\.type === "start"\)[\s\S]*if \(nextErrors\.goalStartError\)[\s\S]*goalDateError:\s*nextErrors\.goalDateError\s*\|\|\s*prev\.goalDateError/)

  assert.match(source, /if \(payload\.type === "date"\)[\s\S]*if \(!value\)[\s\S]*goalDate:\s*""/)
  assert.match(source, /if \(payload\.type === "date"\)[\s\S]*if \(!isValidISODateString\(value\)\)[\s\S]*goalDateError:\s*"error\.goalDate\.outOfRange"/)
  assert.match(source, /if \(payload\.type === "date"\)[\s\S]*if \(nextErrors\.goalDateError\)[\s\S]*goalStartError:\s*nextErrors\.goalStartError\s*\|\|\s*prev\.goalStartError/)
})

test("Home settings goal config uses date range label and unified goal-range action", () => {
  const source = readSource("src/pages/registry/sections/workspace/cards/goal-fields-card.jsx")

  assert.match(source, /t\("config\.dateRange"\)/)
  assert.match(source, /startISO=\{config\.goalStart\}/)
  assert.match(source, /endISO=\{config\.goalDate\}/)
  assert.match(source, /onChange=\{actions\.setGoalRange\}/)
  assert.match(source, /config\.goalStartError \|\| config\.goalDateError/)
  assert.match(source, /t\(config\.goalStartError \|\| config\.goalDateError\)/)
})

test("Renderer and worker pass goalStart into shared goal layout", () => {
  const rendererSource = readSource("src/lib/renderer.js")
  const workerIndexSource = readSource("worker/index.js")
  const goalGeneratorSource = readSource("worker/generators/goal.js")

  assert.match(rendererSource, /goalStart:\s*config\.goalStart/)
  assert.match(workerIndexSource, /goalStart:\s*validated\.goalStart/)
  assert.match(goalGeneratorSource, /goalStart,/)
  assert.match(goalGeneratorSource, /const decodedGoalName = decodeGoalName\(goalName\)/)
  assert.match(goalGeneratorSource, /goalStart,\s*goalName: resolvedGoalName/)
})

test("Goal default label follows wallpaper language when goalName is empty", () => {
  const rendererSource = readSource("src/lib/renderer.js")
  const goalGeneratorSource = readSource("worker/generators/goal.js")
  const coreSource = readSource("shared/wallpaper-core.js")
  const validationSource = readSource("worker/validation.js")

  assert.match(coreSource, /en:\s*\{[\s\S]*goalDefault:\s*'Goal',/)
  assert.match(coreSource, /'zh-CN':\s*\{[\s\S]*goalDefault:\s*'目标',/)
  assert.match(coreSource, /'zh-TW':\s*\{[\s\S]*goalDefault:\s*'目標',/)
  assert.match(coreSource, /ja:\s*\{[\s\S]*goalDefault:\s*'目標',/)
  assert.match(rendererSource, /goalName:\s*config\.goalName\?\.trim\(\)\s*\|\|\s*getWallpaperText\(config\.wallpaperLang,\s*'goalDefault',\s*''\)/)
  assert.match(goalGeneratorSource, /const resolvedGoalName = decodedGoalName\?\.trim\(\) \|\| getWallpaperText\(lang,\s*'goalDefault',\s*''\)/)
  assert.match(validationSource, /goalName:\s*z\.string\(\)\.max\(100,\s*"Goal name too long"\)\.default\(''\)/)
})

test("Goal preview and worker render goalName with foreground accent, not background contrast", () => {
  const rendererSource = readSource("src/lib/renderer.js")
  const goalGeneratorSource = readSource("worker/generators/goal.js")

  assert.match(rendererSource, /if \(layout\.goalName\) \{[\s\S]*ctx\.fillStyle = safeAccent;/)
  assert.doesNotMatch(rendererSource, /ctx\.fillStyle = contrastAlpha\(bgColor, 0\.9\);/)

  assert.match(goalGeneratorSource, /if \(layout\.goalName\) \{[\s\S]*fill: accentFill,/)
  assert.doesNotMatch(goalGeneratorSource, /fill: svgContrastAlpha\(bgColor, 0\.9\),/)
})

test("Worker validation enforces goalStart schema, year range, and relation to goal", () => {
  const source = readSource("worker/validation.js")

  assert.match(source, /goalStart:\s*dateSchema\.optional\(\)/)
  assert.match(source, /GOAL_START_MIN_ISO/)
  assert.match(source, /GOAL_TARGET_MAX_ISO/)
  assert.match(source, /Goal start date must be between 1900-01-01 and 2100-12-31/)
  assert.match(source, /Goal target date must be between 1900-01-01 and 2100-12-31/)
  assert.match(source, /if \(data\.goalStart && data\.goal && data\.goalStart > data\.goal\)/)
  assert.match(source, /Goal start date must be on or before the goal date/)
})

test("i18n includes start date label, placeholder, and date error keys in all languages", () => {
  const source = readSource("src/data/i18n.js")

  const startDateCount = (source.match(/'config\.startDate':/g) || []).length
  const placeholderCount = (source.match(/'placeholder\.selectStartDate':/g) || []).length
  const startRangeErrorCount = (source.match(/'error\.goalStart\.outOfRange':/g) || []).length
  const targetRangeErrorCount = (source.match(/'error\.goalDate\.outOfRange':/g) || []).length
  const startAfterTargetErrorCount = (source.match(/'error\.goalStart\.afterTarget':/g) || []).length
  const targetBeforeStartErrorCount = (source.match(/'error\.goalDate\.beforeStart':/g) || []).length

  assert.equal(startDateCount, 4)
  assert.equal(placeholderCount, 4)
  assert.equal(startRangeErrorCount, 4)
  assert.equal(targetRangeErrorCount, 4)
  assert.equal(startAfterTargetErrorCount, 4)
  assert.equal(targetBeforeStartErrorCount, 4)
})

test("i18n includes date range and preset labels in all languages", () => {
  const source = readSource("src/data/i18n.js")

  const dateRangeCount = (source.match(/'config\.dateRange':/g) || []).length
  const dateRangePlaceholderCount = (source.match(/'placeholder\.selectDateRange':/g) || []).length
  const next30Count = (source.match(/'preset\.range\.next30':/g) || []).length
  const next90Count = (source.match(/'preset\.range\.next90':/g) || []).length

  assert.equal(dateRangeCount, 4)
  assert.equal(dateRangePlaceholderCount, 4)
  assert.equal(next30Count, 4)
  assert.equal(next90Count, 4)
})

test("i18n includes set button key in all languages", () => {
  const source = readSource("src/data/i18n.js")
  const setKeyCount = (source.match(/'url\.set':/g) || []).length

  assert.equal(setKeyCount, 4)
})

test("i18n includes device tooltip key in all languages", () => {
  const source = readSource("src/data/i18n.js")
  const deviceTooltipCount = (source.match(/'config\.deviceTooltip':/g) || []).length

  assert.equal(deviceTooltipCount, 4)
})

test("i18n includes iOS shortcut clipboard keys in all languages", () => {
  const source = readSource("src/data/i18n.js")
  const action1Count = (source.match(/'setup\.ios\.step3\.action1':/g) || []).length
  const action2Count = (source.match(/'setup\.ios\.step3\.action2':/g) || []).length
  const action2DescCount = (source.match(/'setup\.ios\.step3\.action2Desc':/g) || []).length
  const copyTooltipCount = (source.match(/'setup\.ios\.step3\.copyTooltip':/g) || []).length
  const copiedTooltipCount = (source.match(/'setup\.ios\.step3\.copiedTooltip':/g) || []).length
  const copyActionCount = (source.match(/'setup\.ios\.step3\.copyAction':/g) || []).length
  const legacyStep3DescCount = (source.match(/'setup\.ios\.step3Desc':/g) || []).length

  assert.equal(action1Count, 4)
  assert.equal(action2Count, 4)
  assert.equal(action2DescCount, 4)
  assert.equal(copyTooltipCount, 4)
  assert.equal(copiedTooltipCount, 4)
  assert.equal(copyActionCount, 4)
  assert.equal(legacyStep3DescCount, 0)
})

test("ThemeToggle uses single 'mode' key without 'theme' dual-write", () => {
  const source = readSource("src/pages/registry/sections/ThemeToggle.jsx")

  assert.match(source, /localStorage\.setItem\("mode"/)
  assert.doesNotMatch(source, /localStorage\.setItem\("theme"/)
  assert.doesNotMatch(source, /localStorage\.getItem\("theme"\)/)
})

test("Calendar does not depend on CVA buttonVariants", () => {
  const source = readSource("src/components/ui/calendar.jsx")

  assert.doesNotMatch(source, /buttonVariants/)
  assert.doesNotMatch(source, /import.*from.*button/)
})
