/**
 * [INPUT]: 依赖 node:test, node:assert/strict, node:fs, node:path
 * [OUTPUT]: Kumo 迁移关键约束的回归测试（含 Popover/ColorPicker 同构链路护栏）
 * [POS]: tests/ UI 迁移护栏，防止主题/组件体系与弹层实现回退
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { test } from "node:test"
import assert from "node:assert/strict"
import fs from "node:fs"
import path from "node:path"

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

test("App routes include registry home and /app entry", () => {
  const source = readSource("src/App.jsx")

  assert.match(source, /RegistryHome/)
  assert.match(source, /path=["']\/app["']/)
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

test("ColorPicker avoids duplicate border ownership on ColorArea and SliderTrack", () => {
  const source = readSource("src/components/ui/color-picker.jsx")

  assert.match(source, /className="h-40 w-full shrink-0"/)
  assert.match(source, /className="h-3 w-full rounded-full"/)
  assert.match(source, /function useColorPickerStateBridge\(value\)/)
  assert.match(source, /const \{ internalColor, setInternalColor \} = useColorPickerStateBridge\(value\)/)
  assert.match(source, /if \(externalColor\.toString\('hex'\) !== internalColor\.toString\('hex'\)\)/)
  assert.match(source, /setInternalColor\(newColor\)/)
  assert.doesNotMatch(source, /ColorAreaAbsolutePointerBridge/)
  assert.doesNotMatch(source, /BOTTOM_EPSILON/)
  assert.doesNotMatch(source, /pointer-events-none/)
  assert.doesNotMatch(source, /h-40 w-full[^\n]*border/)
  assert.doesNotMatch(source, /h-3 w-full rounded-full[^\n]*border/)
})

test("Color primitives avoid overflow clipping so thumbs stay visible", () => {
  const source = readSource("src/components/ui/color.jsx")

  assert.match(source, /size-\[192px\] shrink-0 rounded-md ring-1 ring-kumo-fill shadow-sm/)
  assert.match(source, /h-7 w-\[192px\] rounded-md ring-1 ring-kumo-fill/)
  assert.match(source, /z-20 box-border size-5 rounded-\[50%\] border-2 border-foreground shadow-md/)
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
  const source = readSource("src/pages/registry/RegistryHome.jsx")

  assert.match(source, /className="isolate"/)
  assert.match(source, /RegistryTopbar/)
  assert.match(source, /RegistrySidebar/)
  assert.match(source, /HomeGrid/)
  assert.match(source, /ThemeToggle/)
  assert.match(source, /LanguageSelect/)
  assert.match(source, /md:pr-12/)
})

test("Registry topbar mounts language selector near left side", () => {
  const source = readSource("src/pages/registry/sections/RegistryTopbar.jsx")

  assert.match(source, /<LanguageSelect\s*\/>/)
  assert.match(source, /<div className="mx-auto hidden h-12 items-center px-4 md:flex md:border-r md:border-kumo-line">/)
})

test("RegistryHome keeps language selector as mobile fallback", () => {
  const source = readSource("src/pages/registry/RegistryHome.jsx")

  assert.match(source, /<LanguageSelect\s*\/>/)
  assert.match(source, /fixed right-2 bottom-2 z-50 md:hidden/)
})

test("Registry topbar shows GitHub and Xiaohongshu links", () => {
  const source = readSource("src/pages/registry/sections/RegistryTopbar.jsx")

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
  const menuIcon = path.join("src/pages/registry/sections", "KumoMenuIcon.jsx")

  assert.ok(fs.existsSync(path.join(process.cwd(), homeGrid)))
  assert.ok(fs.existsSync(path.join(process.cwd(), themeToggle)))
  assert.ok(fs.existsSync(path.join(process.cwd(), languageSelect)))
  assert.ok(fs.existsSync(path.join(process.cwd(), searchDialog)))
  assert.ok(fs.existsSync(path.join(process.cwd(), menuIcon)))
})

test("LanguageSelect uses Kumo Select and I18n state", () => {
  const source = readSource("src/pages/registry/sections/LanguageSelect.jsx")

  assert.match(source, /@cloudflare\/kumo/)
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
  const menuIcon = readSource("src/pages/registry/sections/KumoMenuIcon.jsx")

  assert.match(themeToggle, /function ThemeToggle/)
  assert.match(themeToggle, /@cloudflare\/kumo/)
  assert.match(themeToggle, /document\.documentElement\.setAttribute\("data-mode"/)

  assert.match(searchDialog, /function SearchDialog/)
  assert.doesNotMatch(searchDialog, /vendor\/kumo\/packages\/kumo-docs-astro/)

  assert.match(menuIcon, /function KumoMenuIcon/)
  assert.match(menuIcon, /clipPathId/)
  assert.doesNotMatch(menuIcon, /vendor\/kumo\/packages\/kumo-docs-astro/)
})

test("RegistrySidebar is non-scrollable and renders three style cards", () => {
  const source = readSource("src/pages/registry/sections/RegistrySidebar.jsx")

  assert.doesNotMatch(source, /overflow-y-auto/)
  assert.match(source, /h-full/)
  assert.match(source, /selectedStyle = "year"/)
  assert.match(source, /id:\s*"year"/)
  assert.match(source, /id:\s*"life"/)
  assert.match(source, /id:\s*"goal"/)
  assert.match(source, /border-t border-kumo-line/)
  assert.match(source, /t\("types\.header"\)/)
  assert.match(source, /t\("type\.year\.name"\)/)
  assert.match(source, /t\("type\.life\.name"\)/)
  assert.match(source, /t\("type\.goal\.name"\)/)
  assert.doesNotMatch(source, /<span>Select<\/span>/)
  assert.doesNotMatch(source, /button\.selected/)
  assert.doesNotMatch(source, /["']Selected["']/)
  assert.doesNotMatch(source, /CheckIcon/)
  assert.doesNotMatch(source, /ArrowRightIcon/)
  assert.match(source, /gap-\[4px\]/)
  assert.match(source, /h-\[10px\] w-\[10px\]/)
  assert.match(source, /h-\[100px\] w-\[100px\]/)
})

test("RegistryHome keeps selectedStyle as single source of truth", () => {
  const source = readSource("src/pages/registry/RegistryHome.jsx")

  assert.match(source, /useState\(["']year["']\)/)
  assert.match(source, /selectedStyle={selectedStyle}/)
  assert.match(source, /onStyleChange={setSelectedStyle}/)
  assert.match(source, /<HomeGrid\s+selectedStyle={selectedStyle}/)
})

test("Registry sidebar is local controlled implementation", () => {
  const source = readSource("src/pages/registry/sections/RegistrySidebar.jsx")

  assert.match(source, /data-sidebar-open={sidebarOpen}/)
  assert.match(source, /t\("types\.header"\)/)
  assert.match(source, /t\("type\.year\.name"\)/)
  assert.match(source, /t\("type\.life\.name"\)/)
  assert.match(source, /t\("type\.goal\.name"\)/)
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
  const source = readSource("src/pages/registry/sections/workspace/useRegistryWallpaperConfig.js")

  assert.match(source, /useI18n/)
  assert.match(source, /LANGUAGE_META/)
  assert.match(source, /const\s+\{\s*t\s*\}\s*=\s*useI18n\(\)/)
  assert.match(source, /flag:\s*meta\.flag/)
  assert.match(source, /name:\s*t\(meta\.labelKey\)/)
  assert.doesNotMatch(source, /REGISTRY_UI_LANG/)
  assert.doesNotMatch(source, /createEnglishTranslator/)
})

test("Registry settings wallpaper language uses flag + name rendering", () => {
  const source = readSource("src/pages/registry/sections/workspace/RegistrySettingsPane.jsx")

  assert.match(source, /inline-flex items-center gap-1\.5/)
  assert.match(source, /option\.flag/)
  assert.match(source, /option\.name/)
})

test("Registry settings does not render selected type badge", () => {
  const source = readSource("src/pages/registry/sections/workspace/RegistrySettingsPane.jsx")
  const homeGridSource = readSource("src/pages/registry/sections/components/HomeGrid.jsx")
  const hookSource = readSource("src/pages/registry/sections/workspace/useRegistryWallpaperConfig.js")

  assert.doesNotMatch(source, /customize\.selected/)
  assert.doesNotMatch(homeGridSource, /typeName={viewModel\.typeName}/)
  assert.doesNotMatch(hookSource, /typeName/)
  assert.doesNotMatch(hookSource, /getTypeName/)
})

test("Registry settings colors use shared ColorPicker component", () => {
  const source = readSource("src/pages/registry/sections/workspace/RegistrySettingsPane.jsx")

  assert.match(source, /import\s+\{\s*ColorPicker\s*\}\s+from\s+"@\/components\/ui\/color-picker"/)
  assert.match(source, /<ColorPicker/)
  assert.doesNotMatch(source, /type="color"/)
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
  const source = readSource("src/pages/registry/sections/workspace/RegistrySettingsPane.jsx")

  assert.match(source, /className="space-y-4"/)
  assert.match(source, /flex flex-col gap-2 sm:flex-row sm:items-center/)
  assert.match(source, /className="min-w-0 flex-1 font-mono text-xs"/)
})

test("Registry goal config keeps xl two-column layout with stacked label/input", () => {
  const source = readSource("src/pages/registry/sections/workspace/RegistrySettingsPane.jsx")

  assert.match(source, /config\.selectedType === "goal"/)
  assert.match(source, /grid grid-cols-1 gap-5 rounded-lg border border-kumo-line bg-kumo-control p-5 xl:grid-cols-2/)
  assert.match(source, /label className="block text-sm font-medium text-kumo-default"/)
})

test("Registry wallpaper language field keeps consistent label-to-control spacing", () => {
  const source = readSource("src/pages/registry/sections/workspace/RegistrySettingsPane.jsx")

  assert.match(source, /config\.wallpaperLang/)
  assert.match(source, /space-y-4/)
  assert.match(source, /label className="flex items-baseline justify-between text-sm"/)
  assert.match(source, /text-xs text-kumo-subtle invisible/)
})

test("Registry life config uses label hints for date of birth and lifespan", () => {
  const source = readSource("src/pages/registry/sections/workspace/RegistrySettingsPane.jsx")

  assert.match(source, /config\.selectedType === "life"/)
  assert.match(source, /t\("config\.dateOfBirthHint"\)/)
  assert.match(source, /t\("config\.lifespanHint"\)/)
  assert.match(source, /label className="flex items-baseline justify-between text-sm"/)
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

test("Wallpaper preview and worker share one language font strategy", async () => {
  const corePath = path.join(process.cwd(), "shared/wallpaper-core.js")
  const { getWallpaperFontFamily } = await import(`file://${corePath}`)
  const rendererSource = readSource("src/lib/renderer.js")
  const svgSource = readSource("worker/svg.js")
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
  assert.match(svgSource, /getWallpaperFontFamily/)
  assert.doesNotMatch(yearSource, /font-family="Inter"/)
  assert.doesNotMatch(lifeSource, /font-family="Inter"/)

  assert.match(indexSource, /Noto\+Sans\+SC/)
  assert.match(indexSource, /Noto\+Sans\+TC/)
  assert.match(indexSource, /Noto\+Sans\+JP/)
})
