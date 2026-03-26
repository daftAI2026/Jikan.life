/**
 * [INPUT]: 依赖 node:test/node:assert、tests/helpers/source-test-helpers，以及 worker/generators/og.js
 * [OUTPUT]: 向 `node --test` 注册 OG 分享卡护栏用例，锁定 `/og-image.png` 动态入口、`?yes=1` 语义与参考图构图
 * [POS]: tests/ 的 OG 分享卡回归护栏，防止白底 25 列点阵版式、尺寸与 worker 路由契约漂移
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { test } from "node:test"
import assert from "node:assert/strict"
import { path, pathToFileURL, readSource } from "./helpers/source-test-helpers.js"

const FIXED_NOW_ISO = "2026-03-26T08:00:00.000Z"

function withFixedDate(run) {
  const RealDate = Date
  class MockDate extends RealDate {
    constructor(...args) {
      if (args.length === 0) {
        super(FIXED_NOW_ISO)
        return
      }
      super(...args)
    }

    static now() {
      return new RealDate(FIXED_NOW_ISO).getTime()
    }
  }

  globalThis.Date = MockDate
  try {
    return run()
  } finally {
    globalThis.Date = RealDate
  }
}

function countMatches(source, pattern) {
  return source.match(pattern)?.length ?? 0
}

test("wrangler and worker route the OG image path through the worker before assets fallback", () => {
  const wranglerSource = readSource("wrangler.toml")
  const workerSource = readSource("worker/index.js")
  const assetsFetchIndex = workerSource.indexOf("env.ASSETS.fetch(request)")
  const ogRouteIndex = workerSource.indexOf("url.pathname === '/og-image.png'")

  assert.match(wranglerSource, /run_worker_first\s*=\s*\[[^\]]*"\/generate"[^\]]*"\/og-image\.png"[^\]]*"\/health"[^\]]*"\/app"[^\]]*"\/app\/"[^\]]*\]/s)
  assert.match(workerSource, /url\.pathname === ['"]\/og-image\.png['"]/)
  assert.match(workerSource, /const origin = url\.origin/)
  assert.match(workerSource, /replaceAll\(\s*['"]https:\/\/jikan\.life\/og-image\.png\?yes=1['"],\s*`\$\{origin\}\/og-image\.png\?yes=1`\s*\)/)
  assert.ok(ogRouteIndex !== -1, "worker should match /og-image.png")
  assert.ok(ogRouteIndex < assetsFetchIndex, "OG route must run before static asset fallback")
})

test("index.html points social cards at the dynamic OG route and declares share dimensions", () => {
  const html = readSource("index.html")

  assert.match(html, /<meta property="og:image" content="https:\/\/jikan\.life\/og-image\.png\?yes=1" \/>/)
  assert.match(html, /<meta property="og:image:width" content="1200" \/>/)
  assert.match(html, /<meta property="og:image:height" content="630" \/>/)
  assert.match(html, /<meta property="og:image:type" content="image\/png" \/>/)
  assert.match(html, /<meta property="og:image:alt" content="Jikan annual progress share card" \/>/)
  assert.match(html, /<meta property="twitter:image" content="https:\/\/jikan\.life\/og-image\.png\?yes=1" \/>/)
  assert.match(html, /<meta property="twitter:image:alt" content="Jikan annual progress share card" \/>/)
})

test("OG share SVG reproduces the reference layout as a white card with a 25x5 dot field", async () => {
  const ogPath = path.join(process.cwd(), "worker/generators/og.js")
  const {
    OG_GRID_COLUMNS,
    OG_GRID_ROWS,
    OG_IMAGE_HEIGHT,
    OG_IMAGE_WIDTH,
    generateOgShareSvg,
    resolveOgFilledColumns,
  } = await import(pathToFileURL(ogPath).href)

  const svg = withFixedDate(() => generateOgShareSvg())
  const totalDots = OG_GRID_COLUMNS * OG_GRID_ROWS
  const filledColumns = resolveOgFilledColumns(23)
  const filledDots = filledColumns * OG_GRID_ROWS

  assert.equal(OG_IMAGE_WIDTH, 1200)
  assert.equal(OG_IMAGE_HEIGHT, 630)
  assert.equal(OG_GRID_COLUMNS, 25)
  assert.equal(OG_GRID_ROWS, 5)
  assert.equal(resolveOgFilledColumns(0), 0)
  assert.equal(resolveOgFilledColumns(1), 1)
  assert.equal(resolveOgFilledColumns(4), 1)
  assert.equal(resolveOgFilledColumns(5), 2)
  assert.equal(resolveOgFilledColumns(23), 6)
  assert.equal(resolveOgFilledColumns(100), 25)
  assert.match(svg, /<svg[^>]*width="1200"[^>]*height="630"/)
  assert.match(svg, /<rect x="0" y="0" width="1200" height="630" fill="#FFFFFF" rx="0" \/>/)
  assert.match(svg, /<text x="50" y="355"[^>]*font-size="44"[^>]*font-weight="600"[^>]*text-anchor="start"[^>]*>2026<\/text>/)
  assert.match(svg, /<text x="863\.07" y="354"[^>]*font-size="40"[^>]*font-weight="600"[^>]*text-anchor="start"[^>]*>23% Complete<\/text>/)
  assert.equal(countMatches(svg, /<circle\b/g), totalDots)
  assert.equal(countMatches(svg, /<circle[^>]*fill="rgba\(0,0,0, 1\)"/g), filledDots)
  assert.equal(countMatches(svg, /<circle[^>]*fill="rgba\(0,0,0, 0\.15\)"/g), totalDots - filledDots)
  assert.match(svg, /<circle cx="60\.8027" cy="402\.619" r="10\.8027" fill="rgba\(0,0,0, 1\)" \/>/)
  assert.match(svg, /<circle cx="1139\.2" cy="569\.197" r="10\.8027" fill="rgba\(0,0,0, 0\.15\)" \/>/)
})
