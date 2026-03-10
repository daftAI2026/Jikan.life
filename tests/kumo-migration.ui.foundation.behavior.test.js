/**
 * [INPUT]: 依赖 node:test/node:assert 与 tests/helpers/source-test-helpers
 * [OUTPUT]: 向 `node --test` 注册 UI 基础层迁移护栏用例，覆盖依赖、版本同步链路、全局入口、基础 UI 组件与通用禁用项
 * [POS]: tests/ UI 迁移护栏的基础层，锁定依赖、全局入口、基础组件与通用禁用项
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { test } from "node:test"
import assert from "node:assert/strict"
import { assertNamedImports, fs, listFiles, path, readJson, readSource } from "./helpers/source-test-helpers.js"

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
    /node scripts\/sync-changelog-version\.js/,
    "pre-commit hook should run changelog version sync first"
  )
  assert.match(
    hookSource,
    /node scripts\/sync-version-metadata\.js/,
    "pre-commit hook should run version metadata sync"
  )
  assert.match(
    hookSource,
    /git add package\.json README\.md package-lock\.json/,
    "pre-commit hook should stage all synchronized metadata files"
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

test("Workspace field shells avoid space-y layouts that shift popover triggers when Base UI inserts guards", () => {
  const cardField = readSource("src/pages/registry/sections/workspace/cards/CardField.jsx")
  const colorsCard = readSource("src/pages/registry/sections/workspace/cards/colors-card.jsx")

  assert.doesNotMatch(
    cardField,
    /w-\[200px\] max-w-full space-y-1\.5/,
    "CardField should not use space-y on direct children because Popover injects hidden siblings around triggers"
  )
  assert.match(cardField, /w-\[200px\] max-w-full/)
  assert.match(cardField, /mb-1\.5/)

  assert.doesNotMatch(
    colorsCard,
    /min-w-0 space-y-1\.5/,
    "ColorPicker wrappers should not use space-y because Popover injects hidden siblings around triggers"
  )
  assert.match(colorsCard, /min-w-0/)
  assert.match(colorsCard, /mb-1\.5/)
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
