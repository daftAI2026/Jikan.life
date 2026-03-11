/**
 * [INPUT]: 依赖 shared/palettes 与 shared/wallpaper-core 的安全色计算
 * [OUTPUT]: 对外提供 STYLE_TO_TYPE、resolveSelectedType、clampLifespan、getInitialConfig
 * [POS]: workspace 配置初始化层，统一默认值、类型映射与颜色归一；维护 accent auto/manual 模式边界
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { DEFAULT_PALETTE } from "../../../../../shared/palettes"
import { getSafeAccent } from "../../../../../shared/wallpaper-core"

const STYLE_TO_TYPE = {
    year: "year",
    life: "life",
    goal: "goal",
}

function normalizeHexColor(value, fallback) {
    if (typeof value !== "string") return fallback
    const trimmed = value.trim()
    if (!/^#([0-9a-fA-F]{6})$/.test(trimmed)) return fallback
    return trimmed.toUpperCase()
}

function resolveAccentMode(value, fallback = "auto") {
    return value === "manual" || value === "auto" ? value : fallback
}

function getInitialConfig(selectedType) {
    const bgColor = normalizeHexColor(DEFAULT_PALETTE.bg, "#000000")
    const originalAccentColor = normalizeHexColor(DEFAULT_PALETTE.accent, "#FFFFFF")
    const accentColor = getSafeAccent(bgColor, originalAccentColor)

    return {
        selectedType,
        country: "",
        timezone: "",
        wallpaperLang: "en",
        bgColor,
        accentColor,
        originalAccentColor,
        accentMode: "auto",
        foregroundOverride: null,
        dob: "",
        lifespan: 80,
        goalName: "",
        goalStart: "",
        goalDate: "",
        goalStartError: "",
        goalDateError: "",
        device: "iPhone 17 Pro Max",
    }
}

function clampLifespan(value) {
    const numeric = Number.parseInt(value, 10)
    if (Number.isNaN(numeric)) return 80
    return Math.min(120, Math.max(50, numeric))
}

function resolveSelectedType(selectedStyle) {
    return STYLE_TO_TYPE[selectedStyle] ?? null
}

function resolvePalette(next, prev) {
    const bgColor = normalizeHexColor(next.bgColor, prev.bgColor)
    const accentMode = resolveAccentMode(next.accentMode, resolveAccentMode(prev.accentMode))
    const originalAccentColor = normalizeHexColor(
        next.originalAccentColor,
        next.accentColor ?? prev.originalAccentColor ?? prev.accentColor ?? "#FFFFFF"
    )
    const accentColor = accentMode === "manual"
        ? normalizeHexColor(next.accentColor, prev.accentColor ?? originalAccentColor)
        : getSafeAccent(bgColor, originalAccentColor)

    return {
        ...next,
        bgColor,
        originalAccentColor,
        accentColor,
        accentMode,
    }
}

export {
    STYLE_TO_TYPE,
    clampLifespan,
    getInitialConfig,
    normalizeHexColor,
    resolvePalette,
    resolveSelectedType,
}
