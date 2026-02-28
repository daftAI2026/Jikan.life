/**
 * [INPUT]: 依赖 updateConfig/generateUrl/todayISO 与外部注入的业务依赖（timezone、device、goal updater、lifespan）
 * [OUTPUT]: 对外提供 createConfigActions（生成 workspace 配置动作集合）
 * [POS]: workspace 动作工厂层，收敛 set/apply/copyUrl 更新语义，供 useHomeWallpaperConfig 编排层消费
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

function createConfigActions({ updateConfig, generateUrl, todayISO, deps }) {
    const { getTimezone, normalizeDeviceName, clampLifespan, goalUpdateFns } = deps

    return {
        setCountry(value) {
            updateConfig((prev) => ({
                ...prev,
                country: value,
                timezone: getTimezone(value),
            }))
        },
        setWallpaperLang(value) {
            updateConfig({ wallpaperLang: value })
        },
        setBackgroundColor(value) {
            updateConfig({ bgColor: value })
        },
        setAccentColor(value) {
            updateConfig({ originalAccentColor: value })
        },
        applyPalette(bg, accent) {
            updateConfig({
                bgColor: bg,
                originalAccentColor: accent,
                foregroundOverride: null,
            })
        },
        setForegroundOverride(value) {
            updateConfig({ foregroundOverride: value })
        },
        resetForeground() {
            updateConfig({ foregroundOverride: null })
        },
        setDob(value) {
            updateConfig({ dob: value })
        },
        setLifespan(value) {
            updateConfig({ lifespan: value })
        },
        normalizeLifespan() {
            updateConfig((prev) => ({ ...prev, lifespan: clampLifespan(prev.lifespan) }))
        },
        setGoalName(value) {
            updateConfig({ goalName: value })
        },
        setGoalRange({ startISO, endISO }) {
            updateConfig((prev) => goalUpdateFns.applyGoalRangeUpdate(prev, {
                startISO,
                endISO,
                todayISO,
            }))
        },
        setGoalStart(value) {
            updateConfig((prev) => goalUpdateFns.applyGoalStartUpdate(prev, {
                value,
                todayISO,
            }))
        },
        setGoalDate(value) {
            updateConfig((prev) => goalUpdateFns.applyGoalDateUpdate(prev, {
                value,
                todayISO,
            }))
        },
        setDevice(value) {
            updateConfig({ device: normalizeDeviceName(value) })
        },
        async copyUrl() {
            const url = generateUrl()
            if (!url) return false

            try {
                await navigator.clipboard.writeText(url)
                return true
            } catch {
                return false
            }
        },
    }
}

export { createConfigActions }
