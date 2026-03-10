/**
 * [INPUT]: 依赖 node:test/node:assert/node:path/node:url 与 shared/date-math 模块
 * [OUTPUT]: 日期数学单测（闰年、年天数、年内序号、日号一致性 + 时区日期归一）
 * [POS]: tests/ 的 shared 日期真相源护栏，防止多实现分裂与公式回归
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { test } from "node:test"
import assert from "node:assert/strict"
import path from "node:path"
import { pathToFileURL } from "node:url"

const dateMathModuleUrl = pathToFileURL(path.join(process.cwd(), "shared/date-math.js")).href
const {
    toDayNumber,
    isLeapYear,
    getDaysInYear,
    getDayOfYear,
    getDatePartsInTimezone,
} = await import(dateMathModuleUrl)

test("isLeapYear follows Gregorian rules", () => {
    assert.equal(isLeapYear(2024), true)
    assert.equal(isLeapYear(2025), false)
    assert.equal(isLeapYear(1900), false)
    assert.equal(isLeapYear(2000), true)
})

test("getDaysInYear maps leap and common years correctly", () => {
    assert.equal(getDaysInYear(2024), 366)
    assert.equal(getDaysInYear(2025), 365)
})

test("getDayOfYear computes first and last day boundaries", () => {
    assert.equal(getDayOfYear(2025, 1, 1), 1)
    assert.equal(getDayOfYear(2025, 12, 31), 365)
    assert.equal(getDayOfYear(2024, 12, 31), 366)
})

test("toDayNumber increases by one across adjacent days", () => {
    const day1 = toDayNumber({ year: 2026, month: 3, day: 1 })
    const day2 = toDayNumber({ year: 2026, month: 3, day: 2 })
    assert.equal(day2 - day1, 1)
})

test("getDatePartsInTimezone resolves day boundaries from a shared timezone source", () => {
    const fixedNow = new Date("2026-03-10T23:30:00.000Z")

    assert.deepEqual(getDatePartsInTimezone("UTC", fixedNow), {
        year: 2026,
        month: 3,
        day: 10,
    })

    assert.deepEqual(getDatePartsInTimezone("Asia/Tokyo", fixedNow), {
        year: 2026,
        month: 3,
        day: 11,
    })
})
