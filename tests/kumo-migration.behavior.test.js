/**
 * [INPUT]: 依赖 node:test, node:assert/strict, node:fs, node:path
 * [OUTPUT]: Kumo 迁移关键约束的回归测试
 * [POS]: tests/ UI 迁移护栏，防止主题/组件体系回退
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

test("P0 UI components are backed by Kumo primitives", () => {
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

test("ColorPicker avoids shadcn popover/select subcomponents", () => {
  const source = readSource("src/components/ui/color-picker.jsx")

  assert.doesNotMatch(source, /PopoverDialog/)
  assert.doesNotMatch(source, /PopoverTrigger/)
  assert.doesNotMatch(source, /SelectContent/)
  assert.doesNotMatch(source, /SelectTrigger/)
  assert.doesNotMatch(source, /SelectValue/)
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
  assert.match(source, /md:pr-12/)
})

test("Registry topbar shows package and version", () => {
  const source = readSource("src/pages/registry/sections/RegistryTopbar.jsx")

  assert.match(source, /@cloudflare\/kumo/)
  assert.match(source, /KUMO_VERSION/)
})

test("Kumo home components are present", () => {
  const homeGrid = path.join("src/pages/registry/sections/components", "HomeGrid.jsx")
  const themeToggle = path.join("src/pages/registry/sections", "ThemeToggle.jsx")
  const searchDialog = path.join("src/pages/registry/sections", "SearchDialog.jsx")
  const menuIcon = path.join("src/pages/registry/sections", "KumoMenuIcon.jsx")

  assert.ok(fs.existsSync(path.join(process.cwd(), homeGrid)))
  assert.ok(fs.existsSync(path.join(process.cwd(), themeToggle)))
  assert.ok(fs.existsSync(path.join(process.cwd(), searchDialog)))
  assert.ok(fs.existsSync(path.join(process.cwd(), menuIcon)))
})

test("Registry wrappers are source-aligned to vendor/kumo", () => {
  const sidebar = readSource("src/pages/registry/sections/RegistrySidebar.jsx")
  const homeGrid = readSource("src/pages/registry/sections/components/HomeGrid.jsx")
  const themeToggle = readSource("src/pages/registry/sections/ThemeToggle.jsx")
  const searchDialog = readSource("src/pages/registry/sections/SearchDialog.jsx")
  const menuIcon = readSource("src/pages/registry/sections/KumoMenuIcon.jsx")

  assert.match(sidebar, /vendor\/kumo\/packages\/kumo-docs-astro\/src\/components\/SidebarNav/)
  assert.match(homeGrid, /vendor\/kumo\/packages\/kumo-docs-astro\/src\/components\/demos\/HomeGrid/)
  assert.match(themeToggle, /vendor\/kumo\/packages\/kumo-docs-astro\/src\/components\/ThemeToggle/)
  assert.match(searchDialog, /vendor\/kumo\/packages\/kumo-docs-astro\/src\/components\/SearchDialog/)
  assert.match(menuIcon, /vendor\/kumo\/packages\/kumo-docs-astro\/src\/components\/KumoMenuIcon/)
})

test("HomeGrid is mounted from vendor source", () => {
  const source = readSource("src/pages/registry/sections/components/HomeGrid.jsx")

  assert.match(source, /vendor\/kumo\/packages\/kumo-docs-astro\/src\/components\/demos\/HomeGrid/)
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
