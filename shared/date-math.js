/**
 * [INPUT]: 无依赖（纯函数模块）
 * [OUTPUT]: 对外提供 toDayNumber、isLeapYear、getDaysInYear、getDayOfYear
 * [POS]: shared/ 的日期数学真相源，供 wallpaper-core 与前端日期工具复用
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

export { toDayNumber, isLeapYear, getDaysInYear, getDayOfYear }
