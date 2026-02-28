/**
 * [INPUT]: 依赖浏览器/Node Date 原生对象 与 shared/date-math 的日期数学函数
 * [OUTPUT]: 对外提供 toLocalDate、toISODate、getLocalTodayISO、getLocalDateParts、getLocalDateKey、addDays、getDayOfYear、getDaysInYear、isLeapYear
 * [POS]: lib/ 日期基础工具，统一前端本地日期格式转换、日偏移与日历数学复用
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

import {
    getDayOfYear as sharedGetDayOfYear,
    getDaysInYear as sharedGetDaysInYear,
    isLeapYear as sharedIsLeapYear,
} from "../../shared/date-math.js"

function isValidDate(date) {
    return date instanceof Date && !Number.isNaN(date.getTime())
}

function toLocalDate(isoDate) {
    if (typeof isoDate !== "string") return undefined
    if (!/^\d{4}-\d{2}-\d{2}$/.test(isoDate)) return undefined

    const [year, month, day] = isoDate.split("-").map(Number)
    const date = new Date(year, month - 1, day)
    if (date.getFullYear() !== year || date.getMonth() + 1 !== month || date.getDate() !== day) {
        return undefined
    }
    return date
}

function toISODate(date) {
    if (!isValidDate(date)) return ""
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
}

function getLocalTodayISO() {
    return toISODate(new Date())
}

function getLocalDateParts(date = new Date()) {
    if (!isValidDate(date)) {
        const fallback = new Date()
        return { year: fallback.getFullYear(), month: fallback.getMonth() + 1, day: fallback.getDate() }
    }
    return { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() }
}

function getLocalDateKey(date = new Date()) {
    const { year, month, day } = getLocalDateParts(date)
    return `${year}-${month}-${day}`
}

function addDays(date, days) {
    const safeDate = isValidDate(date) ? date : new Date()
    const next = new Date(safeDate.getFullYear(), safeDate.getMonth(), safeDate.getDate())
    next.setDate(next.getDate() + Number(days || 0))
    return next
}

const getDayOfYear = sharedGetDayOfYear
const getDaysInYear = sharedGetDaysInYear
const isLeapYear = sharedIsLeapYear

export {
    toLocalDate,
    toISODate,
    getLocalTodayISO,
    getLocalDateParts,
    getLocalDateKey,
    addDays,
    getDayOfYear,
    getDaysInYear,
    isLeapYear,
}
