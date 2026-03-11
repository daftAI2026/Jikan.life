/**
 * [INPUT]: 依赖 shared/wallpaper-core 的字体真相源与浏览器 Date/Intl/navigator 运行时信号
 * [OUTPUT]: 对外提供锁屏 overlay 的多语言日期格式化、24 小时制时间格式、Apple 平台判定、字体栈决策与分钟/午夜刷新计时 helper
 * [POS]: workspace/lock-screen-overlay 的运行时策略层，给 `LockScreenOverlay.jsx` 提供真实日期、真实时间与按 Wallpaper Language 分流的字体真相源
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { getWallpaperFontFamily } from "../../../../../../shared/wallpaper-core.js"

const LOCK_SCREEN_TIME_FORMATTER = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
})

const APPLE_PLATFORM_REGEX = /(mac|iphone|ipad|ipod|ios)/i
const ENGLISH_MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
]
const ENGLISH_WEEKDAYS = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
]
const CHINESE_WEEKDAYS = ["日", "一", "二", "三", "四", "五", "六"]
const JAPANESE_WEEKDAYS = [
    "日曜日",
    "月曜日",
    "火曜日",
    "水曜日",
    "木曜日",
    "金曜日",
    "土曜日",
]

function formatEnglishLockScreenDate(date) {
    const weekday = ENGLISH_WEEKDAYS[date.getDay()]
    const month = ENGLISH_MONTHS[date.getMonth()]
    const day = date.getDate()
    return `${weekday}, ${month} ${day}`
}

function formatCjkLockScreenDate(date, wallpaperLang) {
    const month = date.getMonth() + 1
    const day = date.getDate()
    const weekday = wallpaperLang === "ja"
        ? JAPANESE_WEEKDAYS[date.getDay()]
        : `星期${CHINESE_WEEKDAYS[date.getDay()]}`

    return `${month}月${day}日 ${weekday}`
}

function formatLockScreenDate(date, wallpaperLang = "en") {
    if (wallpaperLang === "zh-CN" || wallpaperLang === "zh-TW" || wallpaperLang === "ja") {
        return formatCjkLockScreenDate(date, wallpaperLang)
    }

    return formatEnglishLockScreenDate(date)
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

function resolveLockScreenFontFamily(isApplePlatform, wallpaperLang) {
    if (wallpaperLang === "en") {
        return isApplePlatform ? "system-ui, sans-serif" : getWallpaperFontFamily("en")
    }

    return getWallpaperFontFamily(wallpaperLang)
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
    resolveLockScreenFontFamily,
}
