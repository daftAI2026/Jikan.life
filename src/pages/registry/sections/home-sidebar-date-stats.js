/**
 * [INPUT]: 依赖 @/lib/date-utils 的本地日期/日历数学 与 shared/wallpaper-core 的 Goal 布局计算
 * [OUTPUT]: 对外提供 getYearStats、getGoalPreviewLayout
 * [POS]: registry/sections 的 HomeSidebar 日期统计层，封装年进度与 Goal 预览布局数据
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { addDays, getDayOfYear, getDaysInYear, getLocalDateParts } from "@/lib/date-utils"
import { computeGoalLayout } from "../../../../shared/wallpaper-core"

function getYearStats(now = new Date()) {
    const year = now.getFullYear()
    const day = getDayOfYear(year, now.getMonth() + 1, now.getDate())
    const totalDays = getDaysInYear(year)
    const week = Math.ceil(day / 7)
    const percent = Math.round((day / totalDays) * 100)
    return { day, week, percent, totalDays }
}

function getGoalPreviewLayout(lang) {
    const todayDate = new Date()
    const today = getLocalDateParts(todayDate)
    const goalDate = getLocalDateParts(addDays(todayDate, 69))
    const goalStart = getLocalDateParts(addDays(todayDate, -31))

    return computeGoalLayout({
        width: 100,
        height: 100,
        bgColor: "000000",
        accentColor: "FFFFFF",
        clockHeight: 0.22,
        lang,
        goalDate,
        goalStart,
        today,
    })
}

export { getGoalPreviewLayout, getYearStats }
