/**
 * [INPUT]: 依赖 node:fs/node:path/node:crypto 与 worker/generators/{year,life,goal}
 * [OUTPUT]: 对外提供壁纸 SVG 快照哈希同步脚本，回写 tests/wallpaper-visual-snapshots.behavior.test.js 的 Year/Life/Goal 基线
 * [POS]: scripts/ 视觉基线同步器，用固定 Date 生成 Worker SVG 并消除手工抄写 sha256 的重复劳动
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { createHash } from "node:crypto"
import fs from "node:fs"
import path from "node:path"

import { generateGoalCountdown } from "../worker/generators/goal.js"
import { generateLifeCalendar } from "../worker/generators/life.js"
import { generateYearCalendar } from "../worker/generators/year.js"

const FIXED_NOW_ISO = "2026-03-01T09:10:11.000Z"
const rootDir = process.cwd()
const snapshotTestPath = path.join(rootDir, "tests", "wallpaper-visual-snapshots.behavior.test.js")

const SNAPSHOT_HASHES = {
  year: withFixedDate(() =>
    sha256(
      generateYearCalendar({
        width: 1179,
        height: 2556,
        bgColor: "#111114",
        accentColor: "#6AA6FF",
        timezone: "UTC",
        clockHeight: 0.22,
        lang: "en",
        cols: 15,
        padding: 0.2,
        foregroundOverride: null,
      })
    )
  ),
  life: withFixedDate(() =>
    sha256(
      generateLifeCalendar({
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
      })
    )
  ),
  goal: withFixedDate(() =>
    sha256(
      generateGoalCountdown({
        width: 1179,
        height: 2556,
        bgColor: "#0B1020",
        accentColor: "#F59E0B",
        timezone: "UTC",
        goalDate: "2026-12-31",
        goalStart: "2026-01-01",
        goalName: "",
        clockHeight: 0.18,
        lang: "zh-CN",
        foregroundOverride: null,
      })
    )
  ),
}

let source = fs.readFileSync(snapshotTestPath, "utf8")

for (const [key, hash] of Object.entries(SNAPSHOT_HASHES)) {
  const pattern = new RegExp(`(${key}:\\s*")[^"]+(")`)
  if (!pattern.test(source)) {
    console.error(`[sync-wallpaper-snapshots] Missing EXPECTED_HASHES.${key} in tests/wallpaper-visual-snapshots.behavior.test.js`)
    process.exit(1)
  }
  source = source.replace(pattern, `$1${hash}$2`)
}

fs.writeFileSync(snapshotTestPath, source)
console.log("[sync-wallpaper-snapshots] Synced hashes:")
for (const [key, hash] of Object.entries(SNAPSHOT_HASHES)) {
  console.log(`- ${key}: ${hash}`)
}

function sha256(value) {
  return createHash("sha256").update(value).digest("hex")
}

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
