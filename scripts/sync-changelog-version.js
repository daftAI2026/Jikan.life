/**
 * [INPUT]: 依赖 node:fs 与 node:path，读取 CHANGELOG.md 与 package.json
 * [OUTPUT]: 以 CHANGELOG.md 首个 ## [x.x.x] 为真相源，同步版本号到 package.json
 * [POS]: scripts/ 的版本逆向同步器，弥合 CHANGELOG 语义版本与 package.json 机器版本的断裂
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import fs from "node:fs"
import path from "node:path"

/* ---------- 路径 ---------- */
const rootDir = process.cwd()
const changelogPath = path.join(rootDir, "CHANGELOG.md")
const packageJsonPath = path.join(rootDir, "package.json")

/* ---------- 从 CHANGELOG 提取最新版本 ---------- */
const changelog = fs.readFileSync(changelogPath, "utf8")
const versionMatch = changelog.match(/^## \[(\d+\.\d+\.\d+)\]/m)

if (!versionMatch) {
    console.error("[sync-changelog-version] No version found in CHANGELOG.md (expected ## [x.x.x])")
    process.exit(1)
}

const changelogVersion = versionMatch[1]

/* ---------- 比对 package.json ---------- */
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"))
const currentVersion = packageJson.version

if (currentVersion === changelogVersion) {
    console.log(`[sync-changelog-version] Already in sync: ${currentVersion}`)
    process.exit(0)
}

/* ---------- 写入 ---------- */
packageJson.version = changelogVersion
fs.writeFileSync(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`)
console.log(`[sync-changelog-version] Updated package.json: ${currentVersion} → ${changelogVersion}`)
