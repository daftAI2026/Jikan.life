/**
 * [INPUT]: 依赖 node:test/node:assert 与 workspace/md-bottom-tabs-widths 的宽度分配算法
 * [OUTPUT]: md 底部 tabs 宽度分配单测，锁定“余量均分 + 最长项先压到次长项 + 压平后再联动收缩”语义
 * [POS]: tests/ 工作区 md bottom-tabs 布局算法护栏，防止自然宽分配规则回退成恒等宽或横向滚动
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { test } from "node:test"
import assert from "node:assert/strict"
import { resolveMdBottomTabWidths } from "../src/pages/registry/sections/workspace/md-bottom-tabs-widths.js"

test("md bottom tabs distribute positive remaining width evenly on top of natural widths", () => {
  assert.deepEqual(
    resolveMdBottomTabWidths({
      naturalWidths: [80, 120, 160],
      containerWidth: 420,
    }),
    [100, 140, 180]
  )
})

test("md bottom tabs first shrink only the single longest tab toward the second-longest width", () => {
  assert.deepEqual(
    resolveMdBottomTabWidths({
      naturalWidths: [80, 120, 160],
      containerWidth: 330,
    }),
    [80, 120, 130]
  )
})

test("md bottom tabs level the longest tab to the second-longest before shrinking the next tier", () => {
  assert.deepEqual(
    resolveMdBottomTabWidths({
      naturalWidths: [80, 120, 160],
      containerWidth: 320,
    }),
    [80, 120, 120]
  )
})

test("md bottom tabs shrink the longest group together only after the tallest item has been leveled", () => {
  assert.deepEqual(
    resolveMdBottomTabWidths({
      naturalWidths: [80, 120, 160],
      containerWidth: 300,
    }),
    [80, 110, 110]
  )
})

test("md bottom tabs preserve item order while shrinking longest tabs toward shorter peers", () => {
  assert.deepEqual(
    resolveMdBottomTabWidths({
      naturalWidths: [160, 80, 120],
      containerWidth: 300,
    }),
    [110, 80, 110]
  )
})

test("md bottom tabs shrink all tabs evenly after every item has been leveled", () => {
  assert.deepEqual(
    resolveMdBottomTabWidths({
      naturalWidths: [80, 120, 160],
      containerWidth: 210,
    }),
    [70, 70, 70]
  )
})
