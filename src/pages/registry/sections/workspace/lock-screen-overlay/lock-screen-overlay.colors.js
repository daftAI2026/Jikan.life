/**
 * [INPUT]: 依赖 shared/wallpaper-core 的背景明暗判断与 accent/bg hex 颜色字符串
 * [OUTPUT]: 对外提供 createLockScreenAccentOverlayColors、createLockScreenTopOverlayColors 与 resolveAccentAlpha 工具，生成 lock screen overlay 的颜色覆写映射
 * [POS]: workspace/lock-screen-overlay 的私有配色映射层，把 workspace accentColor 投影到主时钟/日期/widgets，把 bgColor 投影到 top 状态栏与 home indicator token，并保留 widgets fg/bg 派生关系
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { getContrastBase } from "../../../../../../shared/wallpaper-core.js"

const TOP_COLOR_FOR_DARK_BG = "var(--text-color-kumo-inverse)"
const TOP_COLOR_FOR_LIGHT_BG = "var(--text-color-kumo-default)"

function isHexColor(value) {
    return typeof value === "string" && /^#([0-9a-fA-F]{6})$/.test(value.trim())
}

function resolveAccentAlpha(accentColor, alpha) {
    if (!isHexColor(accentColor)) return undefined

    const normalized = accentColor.trim()
    const red = Number.parseInt(normalized.slice(1, 3), 16)
    const green = Number.parseInt(normalized.slice(3, 5), 16)
    const blue = Number.parseInt(normalized.slice(5, 7), 16)

    return `rgba(${red}, ${green}, ${blue}, ${alpha})`
}

function resolveTopTokenColor(bgColor) {
    if (!isHexColor(bgColor)) return undefined
    return getContrastBase(bgColor) === "255,255,255" ? TOP_COLOR_FOR_DARK_BG : TOP_COLOR_FOR_LIGHT_BG
}

function createLockScreenAccentOverlayColors(accentColor) {
    if (!isHexColor(accentColor)) return {}

    return {
        "time-shape": accentColor,
        "date-text": accentColor,
        "widgets-complication-1-fg": accentColor,
        "widgets-complication-2-fg": accentColor,
        "widgets-complication-3-fg": accentColor,
        "widgets-complication-4-fg": accentColor,
        "widgets-complication-1-bg": resolveAccentAlpha(accentColor, 0.15),
        "widgets-complication-2-bg": resolveAccentAlpha(accentColor, 0.15),
        "widgets-complication-3-bg": resolveAccentAlpha(accentColor, 0.15),
        "widgets-complication-4-bg": resolveAccentAlpha(accentColor, 0.15),
    }
}

function createLockScreenTopOverlayColors(bgColor) {
    const topColor = resolveTopTokenColor(bgColor)
    if (!topColor) return {}

    return {
        "home-indicator": topColor,
        "status-bar-leading": topColor,
        "status-bar-trailing": topColor,
        battery: topColor,
        wifi: topColor,
        cellular: topColor,
    }
}

export { createLockScreenAccentOverlayColors, createLockScreenTopOverlayColors, resolveAccentAlpha }
