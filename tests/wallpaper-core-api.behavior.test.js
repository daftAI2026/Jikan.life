/**
 * [INPUT]: 依赖 node:test/node:assert 与 shared/wallpaper-core.js
 * [OUTPUT]: 向 `node --test` 注册 `shared/wallpaper-core.js` facade API 护栏用例，冻结导出集合并校验关键常量、文案、日期校验与字体解析兼容行为
 * [POS]: tests/ 核心共享模块护栏，锁定 facade 导出集合与关键行为
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { test } from "node:test"
import assert from "node:assert/strict"
import { path } from "./helpers/source-test-helpers.js"

const EXPECTED_EXPORTS = [
  "GOAL_START_MIN_ISO",
  "GOAL_TARGET_MAX_ISO",
  "YEAR_DOT_RADIUS_SCALE",
  "YEAR_TODAY_DOT_RADIUS_SCALE",
  "computeGoalLayout",
  "computeLifeLayout",
  "computeYearLayout",
  "contrastAlpha",
  "formatGoalDate",
  "getContrastBase",
  "getContrastRatio",
  "getDatePartsInTimezone",
  "getDayOfYear",
  "getDaysInYear",
  "getLuminance",
  "resolveTextFontFamily",
  "resolveFontBufferLanguages",
  "getSafeAccent",
  "getWallpaperFontFamily",
  "getWallpaperText",
  "hexToRgba",
  "isBlackOrWhite",
  "isISODateInRange",
  "isLeapYear",
  "isTooClose",
  "isValidISODateString",
  "resolveContrastBase",
  "toDayNumber",
  "validateGoalDateInputs",
].sort()

test("wallpaper-core exports exact stable API surface", async () => {
  const corePath = path.join(process.cwd(), "shared/wallpaper-core.js")
  const coreModule = await import(`file://${corePath}`)
  const actualExports = Object.keys(coreModule).sort()

  assert.deepEqual(actualExports, EXPECTED_EXPORTS)
})

test("wallpaper-core keeps key constants and text defaults", async () => {
  const corePath = path.join(process.cwd(), "shared/wallpaper-core.js")
  const {
    GOAL_START_MIN_ISO,
    GOAL_TARGET_MAX_ISO,
    YEAR_DOT_RADIUS_SCALE,
    YEAR_TODAY_DOT_RADIUS_SCALE,
    getWallpaperText,
    getWallpaperFontFamily,
    resolveTextFontFamily,
    resolveFontBufferLanguages,
  } = await import(`file://${corePath}`)

  assert.equal(GOAL_START_MIN_ISO, "1900-01-01")
  assert.equal(GOAL_TARGET_MAX_ISO, "2100-12-31")
  assert.equal(YEAR_DOT_RADIUS_SCALE, 0.8)
  assert.equal(YEAR_TODAY_DOT_RADIUS_SCALE, 1.12)

  assert.equal(getWallpaperText("en", "goalDefault", ""), "Goal")
  assert.equal(getWallpaperText("zh-CN", "goalDefault", ""), "目标")
  assert.equal(getWallpaperText("zh-TW", "goalDefault", ""), "目標")
  assert.equal(getWallpaperText("ja", "goalDefault", ""), "目標")
  assert.equal(getWallpaperText("ja", "complete", "22"), "22% 経過")

  assert.equal(getWallpaperFontFamily("en"), "\"Inter\", sans-serif")
  assert.equal(getWallpaperFontFamily("zh-CN"), "\"Noto Sans SC\", \"Inter\", sans-serif")
  assert.equal(getWallpaperFontFamily("zh-TW"), "\"Noto Sans TC\", \"Inter\", sans-serif")
  assert.equal(getWallpaperFontFamily("ja"), "\"Noto Sans JP\", \"Inter\", sans-serif")

  assert.equal(resolveTextFontFamily("en", "Launch"), "\"Inter\", sans-serif")
  assert.equal(resolveTextFontFamily("en", "没什么"), "\"Noto Sans SC\", \"Inter\", sans-serif")
  assert.equal(resolveTextFontFamily("en", "Launch 没什么"), "\"Noto Sans SC\", \"Inter\", sans-serif")
  assert.equal(resolveTextFontFamily("en", "カタカナ"), "\"Noto Sans JP\", \"Inter\", sans-serif")
  assert.deepEqual(resolveFontBufferLanguages("en", "Launch"), [])
  assert.deepEqual(resolveFontBufferLanguages("en", "没什么"), ["zh-CN"])
  assert.deepEqual(resolveFontBufferLanguages("zh-TW", "沒什麼"), ["zh-TW"])
})

test("wallpaper-core keeps goal date validation behavior", async () => {
  const corePath = path.join(process.cwd(), "shared/wallpaper-core.js")
  const { validateGoalDateInputs } = await import(`file://${corePath}`)

  assert.deepEqual(
    validateGoalDateInputs({
      goalStart: "2026-04-01",
      goalDate: "2026-03-01",
      todayISO: "2026-02-01",
    }),
    {
      goalStartError: "error.goalStart.afterTarget",
      goalDateError: "error.goalDate.beforeStart",
    }
  )

  assert.deepEqual(
    validateGoalDateInputs({
      goalStart: "2026-02-01",
      goalDate: "2026-03-01",
      todayISO: "2026-02-15",
    }),
    {
      goalStartError: "",
      goalDateError: "",
    }
  )
})
