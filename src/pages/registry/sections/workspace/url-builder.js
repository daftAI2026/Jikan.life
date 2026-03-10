/**
 * [INPUT]: 依赖 shared/wallpaper-core 的 Goal 日期校验、生命周期收敛器
 * [OUTPUT]: 对外提供 buildWallpaperUrl
 * [POS]: workspace URL 构建层，统一三类壁纸参数序列化规则
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { validateGoalDateInputs } from "../../../../../shared/wallpaper-core"

function buildWallpaperUrl({ config, selectedDevice, todayISO, clampLifespan }) {
    if (!config.selectedType) return ""

    const params = new URLSearchParams()
    params.set("type", config.selectedType)
    params.set("bg", config.bgColor.replace("#", ""))
    params.set("accent", config.accentColor.replace("#", ""))
    if (config.foregroundOverride) {
        params.set("fg", config.foregroundOverride === "#FFFFFF" ? "light" : "dark")
    }
    params.set("width", String(selectedDevice.width))
    params.set("height", String(selectedDevice.height))
    params.set("clockHeight", String(selectedDevice.clockHeight))
    params.set("lang", config.wallpaperLang)

    if (selectedDevice.cols) params.set("cols", String(selectedDevice.cols))
    if (selectedDevice.padding) params.set("padding", String(selectedDevice.padding))
    if (config.country) params.set("country", config.country)
    if (config.timezone) params.set("tz", config.timezone)

    if (config.selectedType === "life" && config.dob) {
        params.set("dob", config.dob)
        params.set("lifespan", String(clampLifespan(config.lifespan)))
    }

    if (config.selectedType === "goal") {
        const goalDateErrors = validateGoalDateInputs({
            goalStart: config.goalStart,
            goalDate: config.goalDate,
            todayISO,
        })
        if (config.goalName.trim()) params.set("goalName", config.goalName.trim())
        if (config.goalStart && !goalDateErrors.goalStartError) params.set("goalStart", config.goalStart)
        if (config.goalDate && !goalDateErrors.goalDateError) params.set("goal", config.goalDate)
    }

    const origin = typeof window !== "undefined" ? window.location.origin : "https://jikan.life"
    return `${origin}/generate?${params.toString()}`
}

export { buildWallpaperUrl }
