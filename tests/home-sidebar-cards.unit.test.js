/**
 * [INPUT]: 依赖 node:test/node:assert 与 registry HomeSidebarCards 的可见卡/激活卡 helper、Year/Goal 统计文案 helper
 * [OUTPUT]: 向 `node --test` 注册 HomeSidebarCards 单测，锁定隐藏卡过滤、移动端 active style 回退与多语言 Year/Goal 统计文案语义
 * [POS]: tests/ Registry style sidebar 护栏，防止移动端 segmented tabs、可见卡数据源与多语言 Year/Goal 统计文案排布漂移
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { test } from "node:test"
import assert from "node:assert/strict"
import {
  resolveSidebarActiveStyleId,
  resolveVisibleStyleCards,
} from "../src/pages/registry/sections/home-sidebar-style-cards.js"
import { getGoalSidebarStats, getYearSidebarStats, getYearStats } from "../src/pages/registry/sections/home-sidebar-date-stats.js"
import { splitSidebarMixedTextRuns } from "../src/pages/registry/sections/home-sidebar-mixed-text.js"

const SAMPLE_STYLE_CARDS = [
  { id: "year", title: "Year" },
  { id: "life", title: "Life" },
  { id: "goal", title: "Goal" },
]

test("home sidebar filters hidden style cards out of the shared visible cards list", () => {
  assert.deepEqual(
    resolveVisibleStyleCards(SAMPLE_STYLE_CARDS).map((card) => card.id),
    ["year", "goal"]
  )
})

test("home sidebar falls back to the first visible style when selected style is hidden", () => {
  assert.equal(resolveSidebarActiveStyleId("life", resolveVisibleStyleCards(SAMPLE_STYLE_CARDS)), "year")
})

test("home sidebar falls back to the first visible style when selected style is null", () => {
  assert.equal(resolveSidebarActiveStyleId(null, resolveVisibleStyleCards(SAMPLE_STYLE_CARDS)), "year")
})

test("home sidebar preserves the selected style when it remains visible", () => {
  assert.equal(resolveSidebarActiveStyleId("goal", resolveVisibleStyleCards(SAMPLE_STYLE_CARDS)), "goal")
})

test("home sidebar year stats still expose the calendar year for future composition needs", () => {
  const stats = getYearStats(new Date("2026-03-21T00:00:00Z"))

  assert.equal(stats.year, 2026)
})

test("home sidebar composes english year stats without the dynamic year prefix", () => {
  const stats = getYearSidebarStats({
    yearStats: { year: 2026, day: 80, week: 12, percent: 22 },
    copy: { statDay: "Days", statComplete: "Complete", inlineDay: "Day 80", inlineComplete: "22% Complete" },
  })

  assert.equal(stats.length, 2)
  assert.equal(stats[0].inlineText, "Day 80")
  assert.equal(stats[0].inlineAlign, "start")
  assert.equal(stats[0].label, "Days")
  assert.equal(stats[0].value, "80")
  assert.equal(stats[1].inlineText, "22% Complete")
  assert.equal(stats[1].inlineAlign, "end")
  assert.equal(stats[1].label, "Complete")
  assert.equal(stats[1].value, "22%")
})

test("home sidebar localizes zh-CN year stats into the shared inline two-column layout", () => {
  const stats = getYearSidebarStats({
    yearStats: { year: 2026, day: 80, week: 12, percent: 22 },
    copy: { statDay: "天", statComplete: "完成度", inlineDay: "第 80 天", inlineComplete: "进度 22%" },
  })

  assert.equal(stats.length, 2)
  assert.equal(stats[0].inlineText, "第 80 天")
  assert.equal(stats[0].inlineAlign, "start")
  assert.equal(stats[0].label, "天")
  assert.equal(stats[0].value, "80")
  assert.equal(stats[1].inlineText, "进度 22%")
  assert.equal(stats[1].inlineAlign, "end")
})

test("home sidebar localizes japanese year stats without the year prefix inside the inline sentence", () => {
  const stats = getYearSidebarStats({
    yearStats: { year: 2026, day: 80, week: 12, percent: 22 },
    copy: { statDay: "日", statComplete: "経過", inlineDay: "80 日目", inlineComplete: "22% 経過" },
  })

  assert.equal(stats[0].inlineText, "80 日目")
  assert.equal(stats[0].inlineAlign, "start")
  assert.equal(stats[1].inlineText, "22% 経過")
  assert.equal(stats[1].inlineAlign, "end")
})

test("home sidebar splits japanese mixed year title into latin and japanese runs", () => {
  const runs = splitSidebarMixedTextRuns("2026 年度進捗", "ja")

  assert.deepEqual(runs, [
    { kind: "latin", text: "2026 " },
    { kind: "ja", text: "年度進捗" },
  ])
})

test("home sidebar splits japanese mixed year stats into latin and japanese runs", () => {
  assert.deepEqual(splitSidebarMixedTextRuns("80 日目", "ja"), [
    { kind: "latin", text: "80 " },
    { kind: "ja", text: "日目" },
  ])

  assert.deepEqual(splitSidebarMixedTextRuns("22% 経過", "ja"), [
    { kind: "latin", text: "22% " },
    { kind: "ja", text: "経過" },
  ])
})

test("home sidebar keeps english and chinese year copy as single runs", () => {
  assert.deepEqual(splitSidebarMixedTextRuns("2026 Year Progress", "en"), [
    { kind: "latin", text: "2026 Year Progress" },
  ])

  assert.deepEqual(splitSidebarMixedTextRuns("第 80 天", "zh-CN"), [
    { kind: "latin", text: "第 80 天" },
  ])
})

test("home sidebar collapses english goal stats into the shared inline two-column layout", () => {
  const stats = getGoalSidebarStats({
    copy: { statTargetDate: "Date", statTracking: "Tracking", inlineTarget: "Target", inlineTracking: "Daily tracking" },
    values: { target: "Target", daily: "Daily" },
  })

  assert.equal(stats.length, 2)
  assert.equal(stats[0].inlineText, "Target")
  assert.equal(stats[0].inlineAlign, "start")
  assert.equal(stats[1].inlineText, "Daily tracking")
  assert.equal(stats[1].inlineAlign, "end")
})
