/**
 * [INPUT]: 无依赖（纯函数模块）
 * [OUTPUT]: 对外提供 toDayNumber、isLeapYear、getDaysInYear、getDayOfYear、getDatePartsInTimezone
 * [POS]: shared/ 的日期数学真相源，供 wallpaper-core、前端日期工具与跨端时区日期归一复用
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

const MS_PER_DAY = 1000 * 60 * 60 * 24

function toDayNumber({ year, month, day }) {
    return Math.floor(Date.UTC(year, month - 1, day) / MS_PER_DAY)
}

function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)
}

function getDaysInYear(year) {
    return isLeapYear(year) ? 366 : 365
}

function getDayOfYear(year, month, day) {
    const dayNumber = toDayNumber({ year, month, day })
    const startOfYear = toDayNumber({ year, month: 1, day: 1 })
    return dayNumber - startOfYear + 1
}

function getLocalDateParts(now) {
    return {
        year: now.getFullYear(),
        month: now.getMonth() + 1,
        day: now.getDate(),
    }
}

function getDatePartsInTimezone(timezone, now = new Date()) {
    if (!timezone) return getLocalDateParts(now)

    try {
        const formatter = new Intl.DateTimeFormat("en-CA", {
            timeZone: timezone,
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        })
        const parts = formatter.formatToParts(now)

        return {
            year: Number.parseInt(parts.find((part) => part.type === "year")?.value, 10),
            month: Number.parseInt(parts.find((part) => part.type === "month")?.value, 10),
            day: Number.parseInt(parts.find((part) => part.type === "day")?.value, 10),
        }
    } catch {
        return getLocalDateParts(now)
    }
}

export { toDayNumber, isLeapYear, getDaysInYear, getDayOfYear, getDatePartsInTimezone }
