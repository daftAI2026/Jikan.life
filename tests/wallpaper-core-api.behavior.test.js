/**
 * [INPUT]: 依赖 node:test/node:assert 与 shared/wallpaper-core.js
 * [OUTPUT]: 对外提供 wallpaper-core API 兼容性护栏测试
 * [POS]: tests/ 核心共享模块护栏，锁定 facade 导出集合与关键行为
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { test } from "node:test"
import assert from "node:assert/strict"
import { path } from "./helpers/source-test-helpers.js"

const EXPECTED_EXPORTS = [
  "GOAL_START_MIN_ISO",
  "GOAL_TARGET_MAX_ISO",
  "computeGoalLayout",
  "computeLifeLayout",
  "computeYearLayout",
  "contrastAlpha",
  "formatGoalDate",
  "getContrastBase",
  "getDatePartsInTimezone",
  "getDayOfYear",
  "getDaysInYear",
  "getLuminance",
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
    getWallpaperText,
    getWallpaperFontFamily,
  } = await import(`file://${corePath}`)

  assert.equal(GOAL_START_MIN_ISO, "1900-01-01")
  assert.equal(GOAL_TARGET_MAX_ISO, "2100-12-31")

  assert.equal(getWallpaperText("en", "goalDefault", ""), "Goal")
  assert.equal(getWallpaperText("zh-CN", "goalDefault", ""), "目标")
  assert.equal(getWallpaperText("zh-TW", "goalDefault", ""), "目標")
  assert.equal(getWallpaperText("ja", "goalDefault", ""), "目標")

  assert.equal(getWallpaperFontFamily("en"), "\"Inter\", sans-serif")
  assert.equal(getWallpaperFontFamily("zh-CN"), "\"Noto Sans SC\", \"Inter\", sans-serif")
  assert.equal(getWallpaperFontFamily("zh-TW"), "\"Noto Sans TC\", \"Inter\", sans-serif")
  assert.equal(getWallpaperFontFamily("ja"), "\"Noto Sans JP\", \"Inter\", sans-serif")
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
