/**
 * [INPUT]: 依赖 node:test/node:assert 与 tests/helpers/source-test-helpers
 * [OUTPUT]: 向 `node --test` 注册 Worker 路由护栏用例，锁定废弃入口 `/app` 的边缘层永久重定向配置
 * [POS]: tests/ Worker 路由与部署契约护栏，防止 `/app` 再次回流为 SPA 200 壳页面
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { test } from "node:test"
import assert from "node:assert/strict"
import { readSource } from "./helpers/source-test-helpers.js"

test("Wrangler routes / and /app through worker before SPA assets fallback", () => {
  const source = readSource("wrangler.toml")

  assert.match(source, /run_worker_first\s*=\s*\[[^\]]*"\/"[^\]]*"\/generate"[^\]]*"\/health"[^\]]*"\/app"[^\]]*"\/app\/"[^\]]*\]/s)
  assert.match(source, /not_found_handling\s*=\s*"single-page-application"/)
})

test("Worker redirects deprecated /app entrypoints to / before assets fetch", () => {
  const source = readSource("worker/index.js")
  const redirectIndex = source.indexOf(`url.pathname === '/app'`)
  const assetsFetchIndex = source.indexOf("env.ASSETS.fetch(request)")

  assert.notEqual(redirectIndex, -1, "worker should match deprecated /app pathname")
  assert.match(source, /url\.pathname === ['"]\/app['"]\s*\|\|\s*url\.pathname === ['"]\/app\/['"]/)
  assert.match(source, /status:\s*308/)
  assert.match(source, /(?:['"]Location['"]|Location):\s*['"]\/['"]/)
  assert.ok(
    redirectIndex < assetsFetchIndex,
    "deprecated /app redirect must happen before static asset fallback"
  )
  assert.doesNotMatch(
    source,
    /['"]Location['"]:\s*url\.(?:pathname|toString|href|search)/,
    "deprecated /app redirect should not propagate legacy path or query string"
  )
})
