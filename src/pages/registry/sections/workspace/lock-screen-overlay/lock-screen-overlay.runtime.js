/**
 * [INPUT]: 依赖浏览器 Date/Intl/navigator 运行时信号
 * [OUTPUT]: 对外提供锁屏 overlay 的英文日期格式化、24 小时制时间格式、Apple 平台判定、字体栈决策与分钟/午夜刷新计时 helper
 * [POS]: workspace/lock-screen-overlay 的运行时策略层，给 `LockScreenDarkOverlay.jsx` 提供真实日期、真实时间与英文字体分流真相源
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

const LOCK_SCREEN_DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
})
const LOCK_SCREEN_TIME_FORMATTER = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
})

const APPLE_PLATFORM_REGEX = /(mac|iphone|ipad|ipod|ios)/i

function formatLockScreenDate(date) {
    return LOCK_SCREEN_DATE_FORMATTER.format(date)
}

function formatLockScreenTime24(date) {
    return LOCK_SCREEN_TIME_FORMATTER.format(date)
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

function getMsUntilNextMinute(date) {
    const nextMinute = new Date(date.getTime())
    nextMinute.setSeconds(0, 0)
    nextMinute.setMinutes(nextMinute.getMinutes() + 1)

    return nextMinute.getTime() - date.getTime()
}

export {
    formatLockScreenDate,
    formatLockScreenTime24,
    getMsUntilNextLocalMidnight,
    getMsUntilNextMinute,
    isAppleRuntimePlatform,
    resolveLockScreenEnglishFontFamily,
}
