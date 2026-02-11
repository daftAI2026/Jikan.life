/**
 * [INPUT]: 依赖 node:test, node:assert/strict, node:fs
 * [OUTPUT]: DatePicker 相关行为约束的静态回归测试
 * [POS]: tests/ 本地回归护栏（已被 .gitignore 忽略）
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { test } from "node:test"
import assert from "node:assert/strict"
import fs from "node:fs"
import path from "node:path"

const readSource = (relativePath) => {
  const filePath = path.join(process.cwd(), relativePath)
  return fs.readFileSync(filePath, "utf8")
}

test("SelectContent supports non-portalled rendering and auto-focus control", () => {
  const source = readSource("src/components/ui/select.jsx")

  assert.match(source, /portalled\s*=\s*true/)
  assert.match(source, /preventAutoFocus\s*=\s*false/)
  assert.match(source, /onOpenAutoFocus/)
  assert.match(source, /onCloseAutoFocus/)
  assert.match(source, /event\.preventDefault\(\)/)
  assert.match(source, /SelectPrimitive\.Portal/)
})

test("MonthYearPicker keeps selects inside the DatePicker popover", () => {
  const source = readSource("src/components/ui/calendar.jsx")
  const portalledMatches = source.match(/portalled=\{false\}/g) ?? []
  const preventMatches = source.match(/preventAutoFocus/g) ?? []

  assert.ok(portalledMatches.length >= 2)
  assert.ok(preventMatches.length >= 2)
})

test("MonthYearPicker allows configuring year bounds", () => {
  const source = readSource("src/components/ui/calendar.jsx")

  assert.match(source, /minYear/)
  assert.match(source, /maxYear/)
  assert.match(source, /currentYear/)
})

test("DateSegment uses tighter rounding for input segments", () => {
  const source = readSource("src/components/ui/datefield.jsx")
  assert.match(source, /rounded-sm/)
})
