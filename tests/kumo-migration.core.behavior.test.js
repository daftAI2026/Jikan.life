/**
 * [INPUT]: 依赖 node:test/node:assert 与 tests/helpers/source-test-helpers
 * [OUTPUT]: 向 `node --test` 注册核心域迁移护栏用例，覆盖 shared 渲染核心、Worker、字体决策、i18n 与日期/编码兼容语义
 * [POS]: tests/ 迁移护栏（主题二：渲染核心、Worker、i18n 与主题）
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { test } from "node:test"
import assert from "node:assert/strict"
import { assertNamedImports, listFiles, path, pathToFileURL, readSource } from "./helpers/source-test-helpers.js"

const FIXED_NOW_ISO = "2026-03-10T09:10:11.000Z"

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

test("Wallpaper preview shares one language font strategy from shared core", async () => {
  const corePath = path.join(process.cwd(), "shared/wallpaper-core.js")
  const { getWallpaperFontFamily, resolveTextFontFamily } = await import(`file://${corePath}`)
  const rendererSource = readSource("src/lib/renderer.js")
  const yearSource = readSource("worker/generators/year.js")
  const lifeSource = readSource("worker/generators/life.js")
  const indexSource = readSource("index.html")

  assert.equal(typeof getWallpaperFontFamily, "function")
  assert.equal(getWallpaperFontFamily("en"), '"Inter", sans-serif')
  assert.equal(getWallpaperFontFamily("zh-CN"), '"Noto Sans SC", "Inter", sans-serif')
  assert.equal(getWallpaperFontFamily("zh-TW"), '"Noto Sans TC", "Inter", sans-serif')
  assert.equal(getWallpaperFontFamily("ja"), '"Noto Sans JP", "Inter", sans-serif')
  assert.equal(resolveTextFontFamily("en", "没什么"), '"Noto Sans SC", "Inter", sans-serif')
  assert.equal(resolveTextFontFamily("en", "Launch カタカナ"), '"Noto Sans JP", "Inter", sans-serif')

  assert.match(rendererSource, /getWallpaperFontFamily/)
  assert.match(rendererSource, /resolveTextFontFamily/)
  assert.doesNotMatch(rendererSource, /"SF Mono"|"Menlo"|"Courier New"/)
  assert.doesNotMatch(yearSource, /font-family="Inter"/)
  assert.doesNotMatch(lifeSource, /font-family="Inter"/)

  assert.match(indexSource, /Noto\+Sans\+SC/)
  assert.match(indexSource, /Noto\+Sans\+TC/)
  assert.match(indexSource, /Noto\+Sans\+JP/)
})

test("Worker SVG reuses shared getWallpaperFontFamily without local font map", () => {
  const svgSource = readSource("worker/svg.js")
  const workerSource = readSource("worker/index.js")

  assertNamedImports(svgSource, "../shared/wallpaper-core.js", ["getWallpaperFontFamily"])
  assert.match(svgSource, /getWallpaperFontFamily\(lang\)/)
  assert.doesNotMatch(svgSource, /FONT_FAMILY_BY_LANG/)
  assert.match(workerSource, /resolveFontBufferLanguages/)
  assert.match(workerSource, /loadFonts\(validated\.lang,\s*validated\.goalName\)/)
})

test("GoalStart is wired through registry config state and URL generation", () => {
  const hookSource = readSource("src/pages/registry/sections/workspace/useHomeWallpaperConfig.js")
  const actionsSource = readSource("src/pages/registry/sections/workspace/config-actions.js")
  const initSource = readSource("src/pages/registry/sections/workspace/config-init.js")
  const urlBuilderSource = readSource("src/pages/registry/sections/workspace/url-builder.js")

  assert.match(initSource, /goalStart:\s*""/)
  assert.match(initSource, /goalStartError:\s*""/)
  assert.match(initSource, /goalDateError:\s*""/)
  assert.match(urlBuilderSource, /validateGoalDateInputs/)
  assert.match(urlBuilderSource, /if \(config\.goalStart && !goalDateErrors\.goalStartError\) params\.set\("goalStart", config\.goalStart\)/)
  assert.match(hookSource, /createConfigActions/)
  assert.match(actionsSource, /setGoalStart\(value\)/)
  assert.match(actionsSource, /setGoalRange\(\{\s*startISO,\s*endISO\s*\}\)/)
})

test("Goal date actions are composed through config-actions and explicit updater functions", () => {
  const source = readSource("src/pages/registry/sections/workspace/useHomeWallpaperConfig.js")
  const actionsSource = readSource("src/pages/registry/sections/workspace/config-actions.js")
  const updaterSource = readSource("src/pages/registry/sections/workspace/goal-date-updater.js")

  assert.match(source, /import \{ createConfigActions \} from "\.\/config-actions"/)
  assert.match(source, /import \{ applyGoalDateUpdate, applyGoalRangeUpdate, applyGoalStartUpdate \} from "\.\/goal-date-updater"/)
  assert.match(source, /createConfigActions\(\{[\s\S]*goalUpdateFns:\s*\{[\s\S]*applyGoalRangeUpdate,[\s\S]*applyGoalStartUpdate,[\s\S]*applyGoalDateUpdate,[\s\S]*\}/)

  assert.match(actionsSource, /setGoalRange\(\{\s*startISO,\s*endISO\s*\}\)/)
  assert.match(actionsSource, /goalUpdateFns\.applyGoalRangeUpdate\(prev,\s*\{[\s\S]*startISO,[\s\S]*endISO,[\s\S]*todayISO,[\s\S]*\}\)/)
  assert.match(actionsSource, /setGoalStart\(value\)/)
  assert.match(actionsSource, /goalUpdateFns\.applyGoalStartUpdate\(prev,\s*\{[\s\S]*value,[\s\S]*todayISO,[\s\S]*\}\)/)
  assert.match(actionsSource, /setGoalDate\(value\)/)
  assert.match(actionsSource, /goalUpdateFns\.applyGoalDateUpdate\(prev,\s*\{[\s\S]*value,[\s\S]*todayISO,[\s\S]*\}\)/)

  assert.match(updaterSource, /function applyGoalRangeUpdate\(prev,\s*\{\s*startISO,\s*endISO,\s*todayISO\s*\}\)/)
  assert.match(updaterSource, /function applyGoalStartUpdate\(prev,\s*\{\s*value,\s*todayISO\s*\}\)/)
  assert.match(updaterSource, /function applyGoalDateUpdate\(prev,\s*\{\s*value,\s*todayISO\s*\}\)/)
})

test("Unified goal date updater preserves legacy range/start/date behavior", async () => {
  const updaterPath = path.join(process.cwd(), "src/pages/registry/sections/workspace/goal-date-updater.js")
  const {
    applyGoalRangeUpdate,
    applyGoalStartUpdate,
    applyGoalDateUpdate,
  } = await import(`file://${updaterPath}`)

  const baseState = {
    goalStart: "2026-03-01",
    goalDate: "2026-04-01",
    goalStartError: "",
    goalDateError: "",
  }

  const rangeState = applyGoalRangeUpdate(baseState, {
    startISO: "2026-03-10",
    endISO: "2026-03-25",
    todayISO: "2026-03-01",
  })
  assert.equal(rangeState.goalStart, "2026-03-10")
  assert.equal(rangeState.goalDate, "2026-03-25")
  assert.equal(rangeState.goalStartError, "")
  assert.equal(rangeState.goalDateError, "")

  const clearedRangeState = applyGoalRangeUpdate(baseState, {
    startISO: "",
    endISO: "",
    todayISO: "2026-03-01",
  })
  assert.equal(clearedRangeState.goalStart, "")
  assert.equal(clearedRangeState.goalDate, "")
  assert.equal(clearedRangeState.goalStartError, "")
  assert.equal(clearedRangeState.goalDateError, "")

  const invalidStartState = applyGoalStartUpdate(baseState, {
    value: "2026-02-30",
    todayISO: "2026-03-01",
  })
  assert.equal(invalidStartState.goalStart, "2026-03-01")
  assert.equal(invalidStartState.goalStartError, "error.goalStart.outOfRange")
  assert.equal(invalidStartState.goalDateError, "")

  const rejectedStartState = applyGoalStartUpdate(baseState, {
    value: "2026-05-01",
    todayISO: "2026-03-01",
  })
  assert.equal(rejectedStartState.goalStart, "2026-03-01")
  assert.equal(rejectedStartState.goalStartError, "error.goalStart.afterTarget")
  assert.equal(rejectedStartState.goalDateError, "error.goalDate.beforeStart")

  const clearedDateState = applyGoalDateUpdate(baseState, {
    value: "",
    todayISO: "2026-03-01",
  })
  assert.equal(clearedDateState.goalDate, "")
  assert.equal(clearedDateState.goalStartError, "")
  assert.equal(clearedDateState.goalDateError, "")

  const invalidDateState = applyGoalDateUpdate(baseState, {
    value: "bad-date",
    todayISO: "2026-03-01",
  })
  assert.equal(invalidDateState.goalDate, "2026-04-01")
  assert.equal(invalidDateState.goalStartError, "")
  assert.equal(invalidDateState.goalDateError, "error.goalDate.outOfRange")

  const rejectedDateState = applyGoalDateUpdate(baseState, {
    value: "2026-02-01",
    todayISO: "2026-03-01",
  })
  assert.equal(rejectedDateState.goalDate, "2026-04-01")
  assert.equal(rejectedDateState.goalStartError, "error.goalStart.afterTarget")
  assert.equal(rejectedDateState.goalDateError, "error.goalDate.beforeStart")
})

test("Home settings goal config uses date range label and unified goal-range action", () => {
  const source = readSource("src/pages/registry/sections/workspace/cards/goal-fields-card.jsx")

  assert.match(source, /t\("config\.dateRange"\)/)
  assert.match(source, /startISO=\{config\.goalStart\}/)
  assert.match(source, /endISO=\{config\.goalDate\}/)
  assert.match(source, /onChange=\{actions\.setGoalRange\}/)
  assert.match(source, /config\.goalStartError \|\| config\.goalDateError/)
  assert.match(source, /t\(config\.goalStartError \|\| config\.goalDateError\)/)
})

test("Renderer and worker pass goalStart into shared goal layout", () => {
  const rendererSource = readSource("src/lib/renderer.js")
  const workerIndexSource = readSource("worker/index.js")
  const goalGeneratorSource = readSource("worker/generators/goal.js")

  assert.match(rendererSource, /goalStart:\s*config\.goalStart/)
  assert.match(workerIndexSource, /goalStart:\s*validated\.goalStart/)
  assert.match(goalGeneratorSource, /goalStart,/)
  assert.match(goalGeneratorSource, /goalStart,\s*goalName: resolvedGoalName/)
})

test("Renderer uses shared timezone date parts instead of browser-local now for preview layouts", () => {
  const rendererSource = readSource("src/lib/renderer.js")

  assert.match(rendererSource, /getDatePartsInTimezone/)
  assert.doesNotMatch(rendererSource, /function getLocalToday\(/)
  assert.doesNotMatch(rendererSource, /const now = new Date\(\);/)
})

test("Goal default label follows wallpaper language when goalName is empty", async () => {
  const rendererSource = readSource("src/lib/renderer.js")
  const goalGeneratorSource = readSource("worker/generators/goal.js")
  const corePath = path.join(process.cwd(), "shared/wallpaper-core.js")
  const { getWallpaperText } = await import(`file://${corePath}`)
  const validationSource = readSource("worker/validation.js")

  assert.equal(getWallpaperText("en", "goalDefault", ""), "Goal")
  assert.equal(getWallpaperText("zh-CN", "goalDefault", ""), "目标")
  assert.equal(getWallpaperText("zh-TW", "goalDefault", ""), "目標")
  assert.equal(getWallpaperText("ja", "goalDefault", ""), "目標")
  assert.match(rendererSource, /goalName:\s*config\.goalName\?\.trim\(\)\s*\|\|\s*getWallpaperText\(config\.wallpaperLang,\s*'goalDefault',\s*''\)/)
  assert.match(goalGeneratorSource, /const resolvedGoalName = goalName\?\.trim\(\) \|\| getWallpaperText\(lang,\s*'goalDefault',\s*''\)/)
  assert.match(validationSource, /goalName:\s*z\.string\(\)\.max\(100,\s*"Goal name too long"\)\.default\(''\)/)
})

test("Goal preview and worker render goalName with foreground accent, not background contrast", () => {
  const rendererSource = readSource("src/lib/renderer.js")
  const goalGeneratorSource = readSource("worker/generators/goal.js")

  assert.match(rendererSource, /if \(layout\.goalName\) \{[\s\S]*ctx\.fillStyle = safeAccent;/)
  assert.match(rendererSource, /const goalNameFontFamily = resolveTextFontFamily\(config\.wallpaperLang,\s*layout\.goalName\)/)
  assert.doesNotMatch(rendererSource, /ctx\.fillStyle = contrastAlpha\(bgColor, 0\.9\);/)

  assert.match(goalGeneratorSource, /const goalNameFontFamily = resolveTextFontFamily\(lang,\s*layout\.goalName\)/)
  assert.match(goalGeneratorSource, /if \(layout\.goalName\) \{[\s\S]*fill: accentFill,[\s\S]*fontFamily: goalNameFontFamily,/)
  assert.doesNotMatch(goalGeneratorSource, /fill: svgContrastAlpha\(bgColor, 0\.9\),/)
})

test("Goal worker resolves multilingual goalName font family independently from wallpaper language", async () => {
  const goalGeneratorPath = pathToFileURL(path.join(process.cwd(), "worker/generators/goal.js")).href
  const { generateGoalCountdown } = await import(goalGeneratorPath)

  const svg = withFixedDate(() => generateGoalCountdown({
    width: 1080,
    height: 2340,
    bgColor: "#000000",
    accentColor: "#FFFFFF",
    timezone: "Asia/Shanghai",
    goalDate: "2026-04-24",
    goalStart: "2026-03-12",
    goalName: "Launch 没什么 カタカナ",
    clockHeight: 0.217,
    lang: "en",
    foregroundOverride: null,
  }))

  assert.match(svg, /font-family="&quot;Noto Sans JP&quot;, &quot;Noto Sans SC&quot;, &quot;Inter&quot;, sans-serif" text-anchor="middle" dominant-baseline="middle">Launch 没什么 カタカナ<\/text>/)
  assert.match(svg, />days left<\/text>/)
})

test("Goal URL builder keeps raw unicode goalName so worker validation sees the real text length", async () => {
  const validationPath = pathToFileURL(path.join(process.cwd(), "worker/validation.js")).href
  const { validateParams } = await import(validationPath)
  const urlBuilderSource = readSource("src/pages/registry/sections/workspace/url-builder.js")
  const goalName = "目标" + "冲刺".repeat(19)
  const params = new URLSearchParams()
  params.set("goalName", goalName)
  params.set("type", "goal")
  params.set("bg", "000000")
  params.set("accent", "FFFFFF")
  params.set("width", "1179")
  params.set("height", "2556")
  params.set("clockHeight", "0.217")
  params.set("lang", "zh-CN")
  params.set("goalStart", "2026-03-01")
  params.set("goal", "2026-06-01")

  assert.doesNotMatch(urlBuilderSource, /encodeURIComponent\(config\.goalName\.trim\(\)\)/)
  assert.match(params.toString(), /goalName=%E7%9B%AE/)
  assert.doesNotMatch(params.toString(), /goalName=%25E7/)

  const parsed = validateParams(new URL(`https://jikan.life/generate?${params.toString()}`))
  assert.equal(parsed.goalName, goalName)
})

test("Worker goal SVG uses shared goal ring stroke width and number offset", async () => {
  const goalGeneratorPath = pathToFileURL(path.join(process.cwd(), "worker/generators/goal.js")).href
  const corePath = pathToFileURL(path.join(process.cwd(), "shared/wallpaper-core.js")).href
  const { generateGoalCountdown } = await import(goalGeneratorPath)
  const { computeGoalLayout } = await import(corePath)

  const options = {
    width: 1179,
    height: 2556,
    bgColor: "#0B1020",
    accentColor: "#F59E0B",
    timezone: "UTC",
    goalDate: "2026-12-31",
    goalStart: "2026-01-01",
    goalName: "目标发布",
    clockHeight: 0.18,
    lang: "zh-CN",
    foregroundOverride: null,
  }
  const svg = withFixedDate(() => generateGoalCountdown(options))
  const layout = computeGoalLayout({
    width: options.width,
    height: options.height,
    bgColor: options.bgColor,
    accentColor: options.accentColor,
    clockHeight: options.clockHeight,
    lang: options.lang,
    goalDate: options.goalDate,
    goalStart: options.goalStart,
    goalName: options.goalName,
    today: { year: 2026, month: 3, day: 10 },
  })

  assert.match(svg, /stroke-width="8"/)

  const numberYMatch = svg.match(/<text x="589\.5" y="([^"]+)"[^>]*>296<\/text>/)
  assert.ok(numberYMatch, "expected goal days number text node")
  assert.equal(Number(numberYMatch[1]), layout.ring.centerY - 4)
})

test("Goal completion ring uses completed progress semantics from shared layout", async () => {
  const corePath = pathToFileURL(path.join(process.cwd(), "shared/wallpaper-core.js")).href
  const { computeGoalLayout } = await import(corePath)

  const explicitWindowLayout = computeGoalLayout({
    width: 1179,
    height: 2556,
    bgColor: "#0B1020",
    accentColor: "#F59E0B",
    clockHeight: 0.18,
    lang: "en",
    goalDate: "2025-01-20",
    goalStart: "2025-01-01",
    goalName: "Goal",
    today: { year: 2025, month: 1, day: 10 },
  })

  const fallbackWindowLayout = computeGoalLayout({
    width: 1179,
    height: 2556,
    bgColor: "#0B1020",
    accentColor: "#F59E0B",
    clockHeight: 0.18,
    lang: "en",
    goalDate: "2025-02-10",
    goalName: "Goal",
    today: { year: 2025, month: 2, day: 1 },
  })

  const pastGoalLayout = computeGoalLayout({
    width: 1179,
    height: 2556,
    bgColor: "#0B1020",
    accentColor: "#F59E0B",
    clockHeight: 0.18,
    lang: "en",
    goalDate: "2025-01-09",
    goalName: "Goal",
    today: { year: 2025, month: 1, day: 10 },
  })

  assert.equal(explicitWindowLayout.daysRemaining, 10)
  assert(Math.abs(explicitWindowLayout.ring.progress - (9 / 19)) < 0.0001, `Expected 9/19, got ${explicitWindowLayout.ring.progress}`)
  assert(Math.abs(fallbackWindowLayout.ring.progress - (21 / 30)) < 0.0001, `Expected 21/30, got ${fallbackWindowLayout.ring.progress}`)
  assert.equal(pastGoalLayout.ring.progress, 1)
})

test("Goal renderers consume shared goal ring geometry instead of inline math", () => {
  const sidebarVisualsSource = readSource("src/pages/registry/sections/home-sidebar-visuals.jsx")
  const rendererSource = readSource("src/lib/renderer.js")
  const goalWorkerSource = readSource("worker/generators/goal.js")

  assert.match(sidebarVisualsSource, /getGoalRingGeometry/)
  assert.match(rendererSource, /getGoalRingGeometry/)
  assert.match(goalWorkerSource, /getGoalRingGeometry/)
})

test("Shared goal layout keeps goal name at 73% height for preview and worker consumers", async () => {
  const corePath = pathToFileURL(path.join(process.cwd(), "shared/wallpaper-core.js")).href
  const { computeGoalLayout } = await import(corePath)
  const rendererSource = readSource("src/lib/renderer.js")
  const goalWorkerSource = readSource("worker/generators/goal.js")

  const width = 1179
  const height = 2556
  const layout = computeGoalLayout({
    width,
    height,
    bgColor: "#0B1020",
    accentColor: "#F59E0B",
    clockHeight: 0.18,
    lang: "en",
    goalDate: "2026-12-31",
    goalStart: "2026-01-01",
    goalName: "Goal",
    today: { year: 2026, month: 3, day: 10 },
  })

  assert.equal(layout.goalNameY, height * 0.73)
  assert.match(rendererSource, /fillText\(layout\.goalName,\s*ring\.centerX,\s*layout\.goalNameY\)/)
  assert.match(goalWorkerSource, /text\(ring\.centerX,\s*layout\.goalNameY,\s*layout\.goalName/)
})

test("Worker life SVG keeps current-week radius identical to preview layout", async () => {
  const lifeGeneratorPath = pathToFileURL(path.join(process.cwd(), "worker/generators/life.js")).href
  const corePath = pathToFileURL(path.join(process.cwd(), "shared/wallpaper-core.js")).href
  const { generateLifeCalendar } = await import(lifeGeneratorPath)
  const { computeLifeLayout } = await import(corePath)

  const options = {
    width: 1179,
    height: 2556,
    bgColor: "#0F172A",
    accentColor: "#22D3EE",
    timezone: "UTC",
    dob: "1995-07-14",
    lifespan: 85,
    clockHeight: 0.22,
    lang: "ja",
    foregroundOverride: null,
  }
  const svg = withFixedDate(() => generateLifeCalendar(options))
  const layout = computeLifeLayout({
    width: options.width,
    height: options.height,
    bgColor: options.bgColor,
    accentColor: options.accentColor,
    clockHeight: options.clockHeight,
    lang: options.lang,
    dob: options.dob,
    lifespan: options.lifespan,
    today: { year: 2026, month: 3, day: 10 },
  })
  const currentWeekDot = layout.dots.find((dot) => dot.isCurrentWeek)

  assert.ok(currentWeekDot, "expected current week dot")

  const escapedCx = String(currentWeekDot.cx).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  const escapedCy = String(currentWeekDot.cy).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  const radiusMatch = svg.match(new RegExp(`<circle cx="${escapedCx}" cy="${escapedCy}" r="([^"]+)" fill="#22D3EE" \\/>`))
  assert.ok(radiusMatch, "expected current week circle in worker svg")
  assert.equal(Number(radiusMatch[1]), currentWeekDot.radius)
})

test("Worker validation enforces goalStart schema, year range, and relation to goal", () => {
  const source = readSource("worker/validation.js")

  assert.match(source, /goalStart:\s*dateSchema\.optional\(\)/)
  assert.match(source, /GOAL_START_MIN_ISO/)
  assert.match(source, /GOAL_TARGET_MAX_ISO/)
  assert.match(source, /Goal start date must be between 1900-01-01 and 2100-12-31/)
  assert.match(source, /Goal target date must be between 1900-01-01 and 2100-12-31/)
  assert.match(source, /if \(data\.goalStart && data\.goal && data\.goalStart > data\.goal\)/)
  assert.match(source, /Goal start date must be on or before the goal date/)
})

test("i18n keeps range errors in all languages and removes legacy start-date keys", () => {
  const source = readSource("src/data/i18n.js")

  const startDateCount = (source.match(/'config\.startDate':/g) || []).length
  const placeholderCount = (source.match(/'placeholder\.selectStartDate':/g) || []).length
  const startRangeErrorCount = (source.match(/'error\.goalStart\.outOfRange':/g) || []).length
  const targetRangeErrorCount = (source.match(/'error\.goalDate\.outOfRange':/g) || []).length
  const startAfterTargetErrorCount = (source.match(/'error\.goalStart\.afterTarget':/g) || []).length
  const targetBeforeStartErrorCount = (source.match(/'error\.goalDate\.beforeStart':/g) || []).length

  assert.equal(startDateCount, 0)
  assert.equal(placeholderCount, 0)
  assert.equal(startRangeErrorCount, 4)
  assert.equal(targetRangeErrorCount, 4)
  assert.equal(startAfterTargetErrorCount, 4)
  assert.equal(targetBeforeStartErrorCount, 4)
})

test("i18n includes date range and preset labels in all languages", () => {
  const source = readSource("src/data/i18n.js")

  const dateRangeCount = (source.match(/'config\.dateRange':/g) || []).length
  const dateRangePlaceholderCount = (source.match(/'placeholder\.selectDateRange':/g) || []).length
  const next30Count = (source.match(/'preset\.range\.next30':/g) || []).length
  const next90Count = (source.match(/'preset\.range\.next90':/g) || []).length

  assert.equal(dateRangeCount, 4)
  assert.equal(dateRangePlaceholderCount, 4)
  assert.equal(next30Count, 4)
  assert.equal(next90Count, 4)
})

test("i18n includes set button key in all languages", () => {
  const source = readSource("src/data/i18n.js")
  const setKeyCount = (source.match(/'url\.set':/g) || []).length

  assert.equal(setKeyCount, 4)
})

test("i18n includes device tooltip key in all languages", () => {
  const source = readSource("src/data/i18n.js")
  const deviceTooltipCount = (source.match(/'config\.deviceTooltip':/g) || []).length

  assert.equal(deviceTooltipCount, 4)
})

test("i18n includes iOS shortcut clipboard keys in all languages", () => {
  const source = readSource("src/data/i18n.js")
  const action1Count = (source.match(/'setup\.ios\.step3\.action1':/g) || []).length
  const action2Count = (source.match(/'setup\.ios\.step3\.action2':/g) || []).length
  const action2DescCount = (source.match(/'setup\.ios\.step3\.action2Desc':/g) || []).length
  const copyTooltipCount = (source.match(/'setup\.ios\.step3\.copyTooltip':/g) || []).length
  const copiedTooltipCount = (source.match(/'setup\.ios\.step3\.copiedTooltip':/g) || []).length
  const copyActionCount = (source.match(/'setup\.ios\.step3\.copyAction':/g) || []).length
  const legacyStep3DescCount = (source.match(/'setup\.ios\.step3Desc':/g) || []).length

  assert.equal(action1Count, 4)
  assert.equal(action2Count, 4)
  assert.equal(action2DescCount, 4)
  assert.equal(copyTooltipCount, 4)
  assert.equal(copiedTooltipCount, 4)
  assert.equal(copyActionCount, 4)
  assert.equal(legacyStep3DescCount, 0)
})

test("ThemeToggle uses single 'mode' key without 'theme' dual-write", () => {
  const source = readSource("src/pages/registry/sections/ThemeToggle.jsx")

  assert.match(source, /localStorage\.setItem\("mode"/)
  assert.doesNotMatch(source, /localStorage\.setItem\("theme"/)
  assert.doesNotMatch(source, /localStorage\.getItem\("theme"\)/)
})

test("HomePage keeps desktop-only ThemeToggle in tools rail box", () => {
  const source = readSource("src/pages/registry/HomePage.jsx")

  assert.match(source, /fixed top-0 right-0/)
  assert.match(source, /w-\[var\(--registry-tools-rail-width\)\]/)
  assert.match(source, /hidden/)
  assert.match(source, /md:grid/)
  assert.match(source, /place-items-center/)
  assert.doesNotMatch(source, /fixed top-0 right-2/)
})

test("HomeSidebar centers desktop menu toggle in rail header box", () => {
  const source = readSource("src/pages/registry/sections/HomeSidebar.jsx")

  assert.match(source, /absolute inset-0 grid place-items-center/)
  assert.doesNotMatch(source, /absolute top-2 right-1/)
})

test("Source code has no local date UI imports", () => {
  const sourceFiles = listFiles("src").filter((file) => /\.(jsx?|tsx?)$/.test(file))
  const blockedImportPattern = /@\/components\/ui\/(date-picker|datefield|calendar|dropdown-menu)|settings-card-date-picker-field|\/dropdown-menu/
  const offenders = sourceFiles.filter((file) => blockedImportPattern.test(readSource(file)))

  assert.deepEqual(offenders, [], `source files should not import removed local date UI: ${offenders.join(", ")}`)
})
