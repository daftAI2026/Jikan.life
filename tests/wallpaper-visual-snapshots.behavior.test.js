/**
 * [INPUT]: 依赖 node:test/node:assert/node:crypto 与 worker/generators/*
 * [OUTPUT]: 对外提供 Year/Life/Goal SVG 视觉快照哈希护栏
 * [POS]: tests/ 渲染稳定性护栏，锁定“所见即所得”输出不漂移
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { test } from "node:test"
import assert from "node:assert/strict"
import { createHash } from "node:crypto"

import { generateYearCalendar } from "../worker/generators/year.js"
import { generateLifeCalendar } from "../worker/generators/life.js"
import { generateGoalCountdown } from "../worker/generators/goal.js"

const FIXED_NOW_ISO = "2026-03-01T09:10:11.000Z"

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

test("Year calendar SVG snapshot hash stays stable", () => {
  const svg = withFixedDate(() =>
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

  assert.equal(sha256(svg), "ddbc1767454357d57fe1b5f7c1fbff2f5607ba7b059cbb445b9e77335457e1c5")
})

test("Life calendar SVG snapshot hash stays stable", () => {
  const svg = withFixedDate(() =>
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

  assert.equal(sha256(svg), "97ff695c260e709ee5a0310f90c2c7d4d5e1ef70790cef5e1c64061761017659")
})

test("Goal countdown SVG snapshot hash stays stable", () => {
  const svg = withFixedDate(() =>
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

  assert.equal(sha256(svg), "5f1980d0b89ba9e4e20c49cdde8a6e7a70f0cfa8e0498193b07b996fc71d039c")
})
