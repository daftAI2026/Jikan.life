/**
 * [INPUT]: 依赖 node:test/node:assert 与 registry HomeSidebarCards 的可见卡/激活卡 helper
 * [OUTPUT]: 向 `node --test` 注册 HomeSidebarCards 单测，锁定隐藏卡过滤与移动端 active style 回退语义
 * [POS]: tests/ Registry style sidebar 护栏，防止移动端 segmented tabs 与可见卡数据源漂移
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { test } from "node:test"
import assert from "node:assert/strict"
import {
  resolveSidebarActiveStyleId,
  resolveVisibleStyleCards,
} from "../src/pages/registry/sections/home-sidebar-style-cards.js"

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
