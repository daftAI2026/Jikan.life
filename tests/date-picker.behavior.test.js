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

test("DatePickerContent uses AriaPopover with default dismissable behavior", () => {
  const source = readSource("src/components/ui/date-picker.jsx")
  // AriaPopover 直接导入（./popover 已换成 Kumo Popover，不兼容 react-aria DatePicker）
  assert.match(source, /Popover as AriaPopover/)
  // 不能用 isNonModal（会禁用外部点击关闭）
  assert.doesNotMatch(source, /isNonModal/)
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

