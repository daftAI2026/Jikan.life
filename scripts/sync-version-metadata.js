/**
 * [INPUT]: 依赖 node:fs 与 node:path，读取 package.json/README.md/package-lock.json
 * [OUTPUT]: 对外提供统一版本元数据同步能力（README 徽章 + package-lock 顶层版本，支持 --check）
 * [POS]: scripts/ 的版本真相源同步器，以 package.json version 驱动发布元数据一致性
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import fs from "node:fs"
import path from "node:path"

/* ---------- 路径与运行模式 ---------- */
const rootDir = process.cwd()
const packageJsonPath = path.join(rootDir, "package.json")
const readmePath = path.join(rootDir, "README.md")
const packageLockPath = path.join(rootDir, "package-lock.json")
const isCheckMode = process.argv.includes("--check")

/* ---------- 读取版本真相源 ---------- */
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"))
const version = packageJson?.version

if (typeof version !== "string" || version.trim() === "") {
  console.error("[sync-version-metadata] package.json version is missing or invalid.")
  process.exit(1)
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
const readmeChanged = updatedReadme !== readmeSource

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
  readmeChanged,
  packageLock: packageLockSyncState,
}

/* ---------- check 模式：只校验不写入 ---------- */
if (isCheckMode) {
  const mismatchEntries = []
  if (syncState.readmeChanged) mismatchEntries.push("README version badge")
  if (syncState.packageLock.packageLockChanged) mismatchEntries.push("package-lock top-level version metadata")

  if (mismatchEntries.length > 0) {
    console.error(`[sync-version-metadata] Out of sync: ${mismatchEntries.join(", ")}. Expected version: ${version}`)
    process.exit(1)
  }

  console.log(`[sync-version-metadata] OK: README and package-lock match ${version}`)
  process.exit(0)
}

/* ---------- write 模式：最小化写入 ---------- */
if (!readmeChanged && !packageLockChanged) {
  console.log(`[sync-version-metadata] No change needed. Metadata already uses ${version}`)
  process.exit(0)
}

if (readmeChanged) {
  fs.writeFileSync(readmePath, updatedReadme)
}

if (packageLockChanged) {
  fs.writeFileSync(packageLockPath, `${JSON.stringify(packageLock, null, 2)}\n`)
}

const changedEntries = []
if (readmeChanged) changedEntries.push("README version badge")
if (packageLockChanged) changedEntries.push("package-lock top-level version metadata")
console.log(`[sync-version-metadata] Updated ${changedEntries.join(" + ")} to ${version}`)
