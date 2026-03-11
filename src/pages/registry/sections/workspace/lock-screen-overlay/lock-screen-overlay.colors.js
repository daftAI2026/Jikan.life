/**
 * [INPUT]: 依赖 accent hex 颜色字符串，无其他运行时依赖
 * [OUTPUT]: 对外提供 createLockScreenAccentOverlayColors 工具，生成主时钟/日期/widgets 的 overlay 颜色覆写映射
 * [POS]: workspace/lock-screen-overlay 的私有配色映射层，把 workspace accentColor 投影到 lock screen overlay，同时保留 widgets fg/bg 派生关系并排除 top 状态栏时间
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

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

export { createLockScreenAccentOverlayColors, resolveAccentAlpha }
