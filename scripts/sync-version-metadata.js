/**
 * [INPUT]: 依赖 node:fs 与 node:path，读取 package.json/README.md/AGENTS.md/CLAUDE.md/package-lock.json
 * [OUTPUT]: 对外提供统一版本元数据同步能力（README 徽章、文档工具链矩阵、package-lock 顶层版本，支持 --check）
 * [POS]: scripts/ 的版本真相源同步器，以 package.json 驱动发布元数据与依赖文档一致性
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import fs from "node:fs"
import path from "node:path"

/* ---------- 路径与运行模式 ---------- */
const rootDir = process.cwd()
const packageJsonPath = path.join(rootDir, "package.json")
const readmePath = path.join(rootDir, "README.md")
const agentsPath = path.join(rootDir, "AGENTS.md")
const claudePath = path.join(rootDir, "CLAUDE.md")
const packageLockPath = path.join(rootDir, "package-lock.json")
const isCheckMode = process.argv.includes("--check")

/* ---------- 读取版本真相源 ---------- */
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"))
const version = packageJson?.version

if (typeof version !== "string" || version.trim() === "") {
  console.error("[sync-version-metadata] package.json version is missing or invalid.")
  process.exit(1)
}

function getPackageVersion(packageName) {
  const rawVersion =
    packageJson.dependencies?.[packageName] ??
    packageJson.devDependencies?.[packageName] ??
    packageJson.overrides?.[packageName]

  if (typeof rawVersion !== "string" || rawVersion.trim() === "") {
    console.error(`[sync-version-metadata] ${packageName} version is missing from package.json.`)
    process.exit(1)
  }

  return rawVersion.replace(/^[~^]/, "")
}

function replaceRequired(source, pattern, replacement, label) {
  if (!pattern.test(source)) {
    console.error(`[sync-version-metadata] ${label} not found.`)
    process.exit(1)
  }

  return source.replace(pattern, replacement)
}

const packageVersions = {
  baseUi: getPackageVersion("@base-ui/react"),
  kumo: getPackageVersion("@cloudflare/kumo"),
  resvg: getPackageVersion("@resvg/resvg-wasm"),
  framerMotion: getPackageVersion("framer-motion"),
  playwright: getPackageVersion("playwright"),
  react: getPackageVersion("react"),
  reactDom: getPackageVersion("react-dom"),
  reactRouter: getPackageVersion("react-router-dom"),
  tailwindcss: getPackageVersion("tailwindcss"),
  zod: getPackageVersion("zod"),
  vite: getPackageVersion("vite"),
  wrangler: getPackageVersion("wrangler"),
  esbuild: getPackageVersion("esbuild"),
}

/* ---------- README 徽章同步 ---------- */
const readmeSource = fs.readFileSync(readmePath, "utf8")
const versionBadgePattern = /https:\/\/img\.shields\.io\/badge\/version-[^"\s]+-green/g
const nextBadgeUrl = `https://img.shields.io/badge/version-${encodeURIComponent(version)}-green`

if (!versionBadgePattern.test(readmeSource)) {
  console.error("[sync-version-metadata] README version badge not found.")
  process.exit(1)
}

const updatedReadme = readmeSource.replace(versionBadgePattern, nextBadgeUrl)

/* ---------- 文档工具链矩阵同步 ---------- */
const agentsSource = fs.readFileSync(agentsPath, "utf8")
const claudeSource = fs.readFileSync(claudePath, "utf8")

const readmeWithToolchain = [
  {
    label: "README toolchain baseline frontend row",
    pattern: /^\| \*\*Frontend\*\* \| React .* · Vite .* · Tailwind CSS .* \|$/m,
    replacement: `| **Frontend** | React ${packageVersions.react} · Vite ${packageVersions.vite} · Tailwind CSS ${packageVersions.tailwindcss} |`,
  },
  {
    label: "README toolchain baseline UI row",
    pattern: /^\| \*\*UI System\*\* \| \[Kumo UI\]\(https:\/\/github\.com\/cloudflare\/kumo\) .* · Base UI .* \|$/m,
    replacement: `| **UI System** | [Kumo UI](https://github.com/cloudflare/kumo) ${packageVersions.kumo} · Base UI ${packageVersions.baseUi} |`,
  },
  {
    label: "README toolchain baseline backend row",
    pattern: /^\| \*\*Backend\*\* \| Cloudflare Workers · Wrangler .* · Resvg WASM \|$/m,
    replacement: `| **Backend** | Cloudflare Workers · Wrangler ${packageVersions.wrangler} · Resvg WASM |`,
  },
  {
    label: "README toolchain baseline Kumo bullet",
    pattern: /^- `@cloudflare\/kumo` `.*`$/m,
    replacement: `- \`@cloudflare/kumo\` \`${packageVersions.kumo}\``,
  },
  {
    label: "README toolchain baseline Base UI bullet",
    pattern: /^- `@base-ui\/react` `.*`$/m,
    replacement: `- \`@base-ui/react\` \`${packageVersions.baseUi}\``,
  },
  {
    label: "README toolchain baseline router bullet",
    pattern: /^- `react-router-dom` `.*`$/m,
    replacement: `- \`react-router-dom\` \`${packageVersions.reactRouter}\``,
  },
  {
    label: "README toolchain baseline Playwright bullet",
    pattern: /^- `playwright` `.*`$/m,
    replacement: `- \`playwright\` \`${packageVersions.playwright}\``,
  },
  {
    label: "README toolchain baseline Wrangler bullet",
    pattern: /^- `wrangler` `.*`$/m,
    replacement: `- \`wrangler\` \`${packageVersions.wrangler}\``,
  },
  {
    label: "README toolchain baseline esbuild bullet",
    pattern: /^- `esbuild` `.*` via npm override$/m,
    replacement: `- \`esbuild\` \`${packageVersions.esbuild}\` via npm override`,
  },
  {
    label: "README toolchain baseline Zod bullet",
    pattern: /^- `zod` `.*`$/m,
    replacement: `- \`zod\` \`${packageVersions.zod}\``,
  },
].reduce((source, item) => replaceRequired(source, item.pattern, item.replacement, item.label), updatedReadme)

const claudeWithToolchain = [
  {
    label: "CLAUDE stack summary",
    pattern: /^React .* \+ Vite .* \+ Tailwind CSS .* \+ Kumo UI .* \+ Cloudflare Workers$/m,
    replacement: `React ${packageVersions.react} + Vite ${packageVersions.vite} + Tailwind CSS ${packageVersions.tailwindcss} + Kumo UI ${packageVersions.kumo} + Cloudflare Workers`,
  },
  {
    label: "CLAUDE frontend toolchain row",
    pattern: /^- \*\*Frontend\*\*: React .* \+ Vite .* \+ Tailwind CSS .* \+ Kumo UI .* \(Base UI .*\)$/m,
    replacement: `- **Frontend**: React ${packageVersions.react} + Vite ${packageVersions.vite} + Tailwind CSS ${packageVersions.tailwindcss} + Kumo UI ${packageVersions.kumo} (Base UI ${packageVersions.baseUi})`,
  },
].reduce((source, item) => replaceRequired(source, item.pattern, item.replacement, item.label), claudeSource)

const agentsRows = [
  ["React / React DOM", `${packageVersions.react} / ${packageVersions.reactDom}`, "Stable dependency rail"],
  ["Vite", packageVersions.vite, "Frontend build and dev server"],
  ["Tailwind CSS", packageVersions.tailwindcss, "Kumo-token styling"],
  ["Kumo UI", packageVersions.kumo, "UI system via local adapters"],
  ["@base-ui/react", packageVersions.baseUi, "Kumo primitive foundation"],
  ["react-router-dom", packageVersions.reactRouter, "SPA routing"],
  ["Framer Motion", packageVersions.framerMotion, "Motion presets in `src/lib/motion.js`"],
  ["Playwright", packageVersions.playwright, "Browser verification dependency"],
  ["Wrangler", packageVersions.wrangler, "Worker dev/deploy"],
  ["esbuild", packageVersions.esbuild, "npm override for Vite/Wrangler audit closure"],
  ["Zod", packageVersions.zod, "Worker parameter validation"],
  ["Resvg WASM", packageVersions.resvg, "SVG to PNG conversion"],
]

const agentsWithToolchain = agentsRows.reduce((source, [name, rowVersion, note]) => {
  const label = `AGENTS toolchain table ${name} row`
  const pattern = new RegExp(`^\\| ${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")} \\| .* \\| ${note.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")} \\|$`, "m")
  return replaceRequired(source, pattern, `| ${name} | ${rowVersion} | ${note} |`, label)
}, agentsSource)

const readmeMetadataChanged = readmeWithToolchain !== readmeSource
const toolchainDocsChanged = agentsWithToolchain !== agentsSource || claudeWithToolchain !== claudeSource

/* ---------- package-lock 顶层版本同步 ---------- */
const packageLock = JSON.parse(fs.readFileSync(packageLockPath, "utf8"))
const hasRootPackage = Boolean(packageLock.packages && packageLock.packages[""])
const lockVersionChanged = packageLock.version !== version
const lockRootPackageVersionChanged = hasRootPackage && packageLock.packages[""].version !== version
const packageLockChanged = lockVersionChanged || lockRootPackageVersionChanged

const packageLockSyncState = {
  hasRootPackage,
  lockVersionChanged,
  lockRootPackageVersionChanged,
  packageLockChanged,
}

if (lockVersionChanged) {
  packageLock.version = version
}

if (lockRootPackageVersionChanged) {
  packageLock.packages[""].version = version
}

const syncState = {
  readmeChanged: readmeMetadataChanged,
  toolchainDocsChanged,
  packageLock: packageLockSyncState,
}

/* ---------- check 模式：只校验不写入 ---------- */
if (isCheckMode) {
  const mismatchEntries = []
  if (syncState.readmeChanged) mismatchEntries.push("README version badge or toolchain baseline")
  if (syncState.toolchainDocsChanged) mismatchEntries.push("AGENTS toolchain table or CLAUDE stack summary")
  if (syncState.packageLock.packageLockChanged) mismatchEntries.push("package-lock top-level version metadata")

  if (mismatchEntries.length > 0) {
    console.error(`[sync-version-metadata] Out of sync: ${mismatchEntries.join(", ")}. Expected version: ${version}`)
    process.exit(1)
  }

  console.log(`[sync-version-metadata] OK: README, AGENTS, CLAUDE, and package-lock match package.json`)
  process.exit(0)
}

/* ---------- write 模式：最小化写入 ---------- */
if (!syncState.readmeChanged && !toolchainDocsChanged && !packageLockChanged) {
  console.log("[sync-version-metadata] No change needed. Metadata already matches package.json")
  process.exit(0)
}

if (readmeWithToolchain !== readmeSource) {
  fs.writeFileSync(readmePath, readmeWithToolchain)
}

if (agentsWithToolchain !== agentsSource) {
  fs.writeFileSync(agentsPath, agentsWithToolchain)
}

if (claudeWithToolchain !== claudeSource) {
  fs.writeFileSync(claudePath, claudeWithToolchain)
}

if (packageLockChanged) {
  fs.writeFileSync(packageLockPath, `${JSON.stringify(packageLock, null, 2)}\n`)
}

const changedEntries = []
if (readmeWithToolchain !== readmeSource) changedEntries.push("README version badge/toolchain baseline")
if (agentsWithToolchain !== agentsSource) changedEntries.push("AGENTS toolchain table")
if (claudeWithToolchain !== claudeSource) changedEntries.push("CLAUDE stack summary")
if (packageLockChanged) changedEntries.push("package-lock top-level version metadata")
console.log(`[sync-version-metadata] Updated ${changedEntries.join(" + ")} from package.json`)
