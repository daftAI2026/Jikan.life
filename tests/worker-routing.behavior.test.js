/**
 * [INPUT]: 依赖 node:test/node:assert 与 tests/helpers/source-test-helpers
 * [OUTPUT]: 向 `node --test` 注册 Worker 路由护栏用例，锁定废弃入口 `/app` 的边缘层永久重定向、内部资源拦截与首页 HTML 前导构建注释剥离契约
 * [POS]: tests/ Worker 路由与部署契约护栏，防止 `/app` 再次回流为 SPA 200 壳页面，并锁定公开资源边界与首页 HTML 改写边界
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

test("Worker blocks internal CLAUDE docs and component registry before assets fetch", () => {
  const source = readSource("worker/index.js")
  const internalBlockIndex = source.indexOf("url.pathname.endsWith('/CLAUDE.md')")
  const assetsFetchIndex = source.indexOf("env.ASSETS.fetch(request)")

  assert.notEqual(internalBlockIndex, -1, "worker should block internal CLAUDE docs before assets fallback")
  assert.match(
    source,
    /url\.pathname\.endsWith\(['"]\/CLAUDE\.md['"]\)\s*\|\|\s*url\.pathname === ['"]\/api\/component-registry['"]/,
    "worker should block public access to CLAUDE docs and static component registry"
  )
  assert.match(
    source,
    /new Response\(['"]Not Found['"],\s*\{\s*status:\s*404,\s*headers:\s*corsHeaders\s*\}\)/s,
    "blocked internal resources should return a 404 without falling through to asset fetch"
  )
  assert.ok(
    internalBlockIndex < assetsFetchIndex,
    "internal resource block must happen before static asset fallback"
  )
})

test("Worker strips only the leading build comment before doctype instead of deleting all HTML comments", () => {
  const source = readSource("worker/index.js")

  assert.match(
    source,
    /html\s*=\s*html\.replace\(\/\^\[\\s\\S]\*\?\(\<\!doctype\)\/i,\s*['"]\$1['"]\)/,
    "worker should strip only the leading pre-doctype build comment"
  )
  assert.doesNotMatch(
    source,
    /html\s*=\s*html\.replace\(\/<!--\[\\s\\S]\*\?-->\s\*\/g,\s*['"]['"]\)/,
    "worker should not globally delete every HTML comment"
  )

  const html = `<!-- build comment -->\n<!doctype html>\n<html><head><!-- Open Graph / Facebook --><script>const keep = "<!--keep-->";</script></head><body><!-- body note --></body></html>`
  const stripped = html.replace(/^[\s\S]*?(<!doctype)/i, "$1")

  assert.match(stripped, /^<!doctype html>/i)
  assert.match(stripped, /<!-- Open Graph \/ Facebook -->/)
  assert.match(stripped, /<!--keep-->/)
  assert.match(stripped, /<!-- body note -->/)
})
