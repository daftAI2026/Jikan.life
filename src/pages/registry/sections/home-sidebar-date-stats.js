/**
 * [INPUT]: 依赖 @/lib/date-utils 的本地日期/日历数学 与 shared/wallpaper-text.js 的 Goal 预览标签文案
 * [OUTPUT]: 对外提供 getYearStats、getGoalPreviewLayout
 * [POS]: registry/sections 的 HomeSidebar 日期统计层，封装年进度统计与 Goal 卡片预览专用布局真相源
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { getDayOfYear, getDaysInYear } from "@/lib/date-utils"
import { getWallpaperText } from "../../../../shared/wallpaper-text.js"

const GOAL_PREVIEW_PROGRESS = 0.69
const GOAL_PREVIEW_DAYS_REMAINING = 69
const GOAL_PREVIEW_RING = { centerX: 50, centerY: 50, radius: 34.5, progress: GOAL_PREVIEW_PROGRESS }
const GOAL_PREVIEW_NUMBER_FONT_SIZE = 24
const GOAL_PREVIEW_LABEL_FONT_SIZE = 5
const GOAL_PREVIEW_LABEL_Y = 69

function getYearStats(now = new Date()) {
    const year = now.getFullYear()
    const day = getDayOfYear(year, now.getMonth() + 1, now.getDate())
    const totalDays = getDaysInYear(year)
    const week = Math.ceil(day / 7)
    const percent = Math.round((day / totalDays) * 100)
    return { day, week, percent, totalDays }
}

function getGoalPreviewLayout(lang) {
    return {
        ring: { ...GOAL_PREVIEW_RING },
        daysRemaining: GOAL_PREVIEW_DAYS_REMAINING,
        daysLeftText: getWallpaperText(lang, "daysLeftLabel", ""),
        numberFontSize: GOAL_PREVIEW_NUMBER_FONT_SIZE,
        labelFontSize: GOAL_PREVIEW_LABEL_FONT_SIZE,
        labelY: GOAL_PREVIEW_LABEL_Y,
    }
}

export { getGoalPreviewLayout, getYearStats }
