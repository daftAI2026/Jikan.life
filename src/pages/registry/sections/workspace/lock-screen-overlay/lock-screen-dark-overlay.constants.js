/**
 * [INPUT]: 无运行时依赖，仅维护锁屏 overlay 的稳定 layer id 与默认 dark 配色
 * [OUTPUT]: 对外提供 LOCK_SCREEN_DARK_OVERLAY_LAYER_IDS 与 LOCK_SCREEN_DARK_OVERLAY_DEFAULT_COLORS 常量
 * [POS]: workspace/lock-screen-overlay 的协议层，约束 overlay 组件与上游颜色覆写入口共享同一真相源
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
const LOCK_SCREEN_DARK_OVERLAY_LAYER_IDS = [
    "home-indicator",
    "action-left-bg",
    "action-left-icon",
    "action-right-bg",
    "action-right-icon",
    "widgets-complication-1-bg",
    "widgets-complication-1-fg",
    "widgets-complication-2-bg",
    "widgets-complication-2-fg",
    "widgets-complication-3-bg",
    "widgets-complication-3-fg",
    "widgets-complication-4-bg",
    "widgets-complication-4-fg",
    "swipe-indicator",
    "date-text",
    "time-shape",
    "status-bar-leading",
    "status-bar-trailing",
    "battery",
    "wifi",
    "cellular",
]

const WIDGET_FOREGROUND_COLOR = "var(--text-color-kumo-inverse)"
const WIDGET_BACKGROUND_COLOR = "color-mix(in srgb, var(--text-color-kumo-inverse) 15%, transparent)"

const LOCK_SCREEN_DARK_OVERLAY_DEFAULT_COLORS = {
    "home-indicator": "#FFFFFF",
    "action-left-bg": "rgba(255, 255, 255, 0.07)",
    "action-left-icon": "#D9D9D9",
    "action-right-bg": "rgba(255, 255, 255, 0.07)",
    "action-right-icon": "#D9D9D9",
    "widgets-complication-1-bg": WIDGET_BACKGROUND_COLOR,
    "widgets-complication-1-fg": WIDGET_FOREGROUND_COLOR,
    "widgets-complication-2-bg": WIDGET_BACKGROUND_COLOR,
    "widgets-complication-2-fg": WIDGET_FOREGROUND_COLOR,
    "widgets-complication-3-bg": WIDGET_BACKGROUND_COLOR,
    "widgets-complication-3-fg": WIDGET_FOREGROUND_COLOR,
    "widgets-complication-4-bg": WIDGET_BACKGROUND_COLOR,
    "widgets-complication-4-fg": WIDGET_FOREGROUND_COLOR,
    "swipe-indicator": "rgba(255, 255, 255, 0.5)",
    "date-text": "#F5F5F5",
    "time-shape": "#F7F7F7",
    "status-bar-leading": "#FFFFFF",
    "status-bar-trailing": "#FFFFFF",
    battery: "#FFFFFF",
    wifi: "#FFFFFF",
    cellular: "#FFFFFF",
}

Object.freeze(LOCK_SCREEN_DARK_OVERLAY_DEFAULT_COLORS)

export { LOCK_SCREEN_DARK_OVERLAY_DEFAULT_COLORS, LOCK_SCREEN_DARK_OVERLAY_LAYER_IDS }
