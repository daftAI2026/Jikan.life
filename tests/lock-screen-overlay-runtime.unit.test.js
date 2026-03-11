/**
 * [INPUT]: 依赖 node:test/node:assert、node:path/node:url 与 lock-screen-overlay runtime helper
 * [OUTPUT]: 向 `node --test` 注册锁屏 overlay runtime helper 单测，覆盖英文日期格式、Apple 判定、字体栈决策与午夜刷新计时
 * [POS]: tests/ 的锁屏 overlay 运行时语义护栏，防止真实日期与英文设备字体分流回退成写死字符串
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { test } from "node:test"
import assert from "node:assert/strict"
import path from "node:path"
import { pathToFileURL } from "node:url"

const runtimeModuleUrl = pathToFileURL(
  path.join(process.cwd(), "src/pages/registry/sections/workspace/lock-screen-overlay/lock-screen-overlay.runtime.js")
).href

async function importRuntimeModule() {
  return import(`${runtimeModuleUrl}?v=${Date.now()}`)
}

test("Lock screen overlay runtime formats English date as weekday month day", async () => {
  const { formatLockScreenDate } = await importRuntimeModule()

  assert.equal(
    formatLockScreenDate(new Date("2026-03-11T12:00:00Z")),
    "Wednesday, March 11"
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

test("Lock screen overlay runtime resolves English font family by platform", async () => {
  const { resolveLockScreenEnglishFontFamily } = await importRuntimeModule()

  assert.equal(resolveLockScreenEnglishFontFamily(true), "system-ui, sans-serif")
  assert.equal(resolveLockScreenEnglishFontFamily(false), "\"Inter\", system-ui, sans-serif")
})

test("Lock screen overlay runtime computes milliseconds until next local midnight", async () => {
  const { getMsUntilNextLocalMidnight } = await importRuntimeModule()

  const duration = getMsUntilNextLocalMidnight(new Date("2026-03-11T12:34:56"))

  assert.ok(duration > 0)
  assert.ok(duration <= 24 * 60 * 60 * 1000)
})
