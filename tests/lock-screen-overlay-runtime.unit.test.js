/**
 * [INPUT]: 依赖 node:test/node:assert、node:path/node:url 与 lock-screen-overlay runtime helper
 * [OUTPUT]: 向 `node --test` 注册锁屏 overlay runtime helper 单测，覆盖多语言日期格式、24 小时制时间格式、Apple 判定、字体栈决策与分钟/午夜刷新计时
 * [POS]: tests/ 的锁屏 overlay 运行时语义护栏，防止真实日期与真实系统时间回退成写死字符串或脱离 Wallpaper Language
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { test } from "node:test"
import assert from "node:assert/strict"
import path from "node:path"
import { pathToFileURL } from "node:url"
import { getWallpaperFontFamily } from "../shared/wallpaper-core.js"

const runtimeModuleUrl = pathToFileURL(
  path.join(process.cwd(), "src/pages/registry/sections/workspace/lock-screen-overlay/lock-screen-overlay.runtime.js")
).href

async function importRuntimeModule() {
  return import(`${runtimeModuleUrl}?v=${Date.now()}`)
}

test("Lock screen overlay runtime formats localized dates from wallpaper language", async () => {
  const { formatLockScreenDate } = await importRuntimeModule()
  const date = new Date(2026, 2, 11, 12, 0, 0)

  assert.equal(
    formatLockScreenDate(date, "en"),
    "Wednesday, March 11"
  )
  assert.equal(formatLockScreenDate(date, "zh-CN"), "3月11日 星期三")
  assert.equal(formatLockScreenDate(date, "zh-TW"), "3月11日 星期三")
  assert.equal(formatLockScreenDate(date, "ja"), "3月11日 水曜日")
  assert.equal(formatLockScreenDate(date, "fr"), "Wednesday, March 11")
})

test("Lock screen overlay runtime formats 24-hour time as HH:mm", async () => {
  const { formatLockScreenTime24 } = await importRuntimeModule()

  assert.equal(
    formatLockScreenTime24(new Date("2026-03-11T10:24:00")),
    "10:24"
  )
  assert.equal(
    formatLockScreenTime24(new Date("2026-03-11T01:05:00")),
    "01:05"
  )
})

test("Lock screen overlay runtime detects Apple platforms from browser signals", async () => {
  const { isAppleRuntimePlatform } = await importRuntimeModule()

  assert.equal(
    isAppleRuntimePlatform({ platform: "MacIntel", userAgent: "Mozilla/5.0" }),
    true
  )
  assert.equal(
    isAppleRuntimePlatform({ userAgentData: { platform: "iOS" }, userAgent: "Mozilla/5.0" }),
    true
  )
  assert.equal(
    isAppleRuntimePlatform({ platform: "Win32", userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" }),
    false
  )
  assert.equal(
    isAppleRuntimePlatform({ platform: "Linux armv8l", userAgent: "Mozilla/5.0 (Linux; Android 15)" }),
    false
  )
})

test("Lock screen overlay runtime resolves localized font family by platform and language", async () => {
  const { resolveLockScreenFontFamily } = await importRuntimeModule()

  assert.equal(resolveLockScreenFontFamily(true, "en"), "system-ui, sans-serif")
  assert.equal(resolveLockScreenFontFamily(false, "en"), getWallpaperFontFamily("en"))
  assert.equal(resolveLockScreenFontFamily(false, "zh-CN"), getWallpaperFontFamily("zh-CN"))
  assert.equal(resolveLockScreenFontFamily(false, "zh-TW"), getWallpaperFontFamily("zh-TW"))
  assert.equal(resolveLockScreenFontFamily(false, "ja"), getWallpaperFontFamily("ja"))
})

test("Lock screen overlay runtime uses one ASCII space between date and weekday in CJK locales", async () => {
  const { formatLockScreenDate } = await importRuntimeModule()
  const zhDate = formatLockScreenDate(new Date(2026, 2, 11, 12, 0, 0), "zh-CN")
  const jaDate = formatLockScreenDate(new Date(2026, 2, 11, 12, 0, 0), "ja")

  assert.match(zhDate, /^\d+月\d+日 星期[一二三四五六日]$/)
  assert.match(jaDate, /^\d+月\d+日 [月火水木金土日]曜日$/)
  assert.equal((zhDate.match(/ /g) ?? []).length, 1)
  assert.equal((jaDate.match(/ /g) ?? []).length, 1)
})

test("Lock screen overlay runtime computes milliseconds until next local midnight", async () => {
  const { getMsUntilNextLocalMidnight } = await importRuntimeModule()

  const duration = getMsUntilNextLocalMidnight(new Date("2026-03-11T12:34:56"))

  assert.ok(duration > 0)
  assert.ok(duration <= 24 * 60 * 60 * 1000)
})

test("Lock screen overlay runtime computes milliseconds until next minute boundary", async () => {
  const { getMsUntilNextMinute } = await importRuntimeModule()

  const duration = getMsUntilNextMinute(new Date("2026-03-11T12:34:56.250"))

  assert.ok(duration > 0)
  assert.ok(duration <= 60 * 1000)
})
