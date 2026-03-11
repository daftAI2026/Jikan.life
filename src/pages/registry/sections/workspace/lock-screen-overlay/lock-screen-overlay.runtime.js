/**
 * [INPUT]: 依赖浏览器 Date/Intl/navigator 运行时信号
 * [OUTPUT]: 对外提供锁屏 overlay 的英文日期格式化、Apple 平台判定、字体栈决策与午夜刷新计时 helper
 * [POS]: workspace/lock-screen-overlay 的运行时策略层，给 `LockScreenDarkOverlay.jsx` 提供真实日期与英文字体分流真相源
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

const LOCK_SCREEN_DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
})

const APPLE_PLATFORM_REGEX = /(mac|iphone|ipad|ipod|ios)/i

function formatLockScreenDate(date) {
    return LOCK_SCREEN_DATE_FORMATTER.format(date)
}

function isAppleRuntimePlatform(navigatorLike) {
    if (!navigatorLike || typeof navigatorLike !== "object") return false

    const platformSignals = [
        navigatorLike.userAgentData?.platform,
        navigatorLike.platform,
        navigatorLike.userAgent,
        navigatorLike.vendor,
    ]

    return platformSignals.some((signal) => (
        typeof signal === "string" && APPLE_PLATFORM_REGEX.test(signal)
    ))
}

function resolveLockScreenEnglishFontFamily(isApplePlatform) {
    return isApplePlatform ? "system-ui, sans-serif" : "\"Inter\", system-ui, sans-serif"
}

function getMsUntilNextLocalMidnight(date) {
    const nextMidnight = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate() + 1,
        0,
        0,
        0,
        0
    )

    return nextMidnight.getTime() - date.getTime()
}

export {
    formatLockScreenDate,
    getMsUntilNextLocalMidnight,
    isAppleRuntimePlatform,
    resolveLockScreenEnglishFontFamily,
}
