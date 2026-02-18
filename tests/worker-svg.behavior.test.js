/**
 * [INPUT]: 依赖 node:test, node:assert/strict, worker/svg.js
 * [OUTPUT]: Worker SVG 字体属性回归测试（防止 XML 属性双引号构造错误）
 * [POS]: tests/ Worker 渲染护栏，约束 createSVG 的 font-family 属性始终合法
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { test } from "node:test"
import assert from "node:assert/strict"

import { createSVG } from "../worker/svg.js"

test("createSVG should not emit invalid double-quote font-family attribute", () => {
  const svg = createSVG(100, 200, "", "en")
  const secondLine = svg.split("\n")[1]

  assert.ok(secondLine.includes('font-family="'))
  assert.doesNotMatch(secondLine, /font-family=""/)
})
