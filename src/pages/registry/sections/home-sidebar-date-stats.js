/**
 * [INPUT]: 依赖 src/lib/date-utils.js 的本地日期/日历数学 与 shared/wallpaper-text.js 的 Goal 预览标签文案
 * [OUTPUT]: 对外提供 getYearStats、getGoalPreviewLayout、getYearSidebarStats、getGoalSidebarStats
 * [POS]: registry/sections 的 HomeSidebar 日期统计层，封装年进度统计、Year/Goal 卡统计文案语义与 Goal 卡片预览专用布局真相源
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { getDayOfYear, getDaysInYear } from "../../../lib/date-utils.js"
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
    return { year, day, week, percent, totalDays }
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

function getYearSidebarStats({ yearStats, copy }) {
    return [
        {
            label: copy.statDay,
            value: String(yearStats.day),
            inlineText: copy.inlineDay,
            inlineAlign: "start",
        },
        {
            label: copy.statComplete,
            value: `${yearStats.percent}%`,
            inlineText: copy.inlineComplete,
            inlineAlign: "end",
        },
    ]
}

function getGoalSidebarStats({ copy, values }) {
    return [
        {
            label: copy.statTargetDate,
            value: values.target,
            inlineText: copy.inlineTarget,
            inlineAlign: "start",
        },
        {
            label: copy.statTracking,
            value: values.daily,
            inlineText: copy.inlineTracking,
            inlineAlign: "end",
        },
    ]
}

export { getGoalPreviewLayout, getGoalSidebarStats, getYearSidebarStats, getYearStats }
