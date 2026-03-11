/**
 * [INPUT]: 依赖 shared/wallpaper-core 的背景明暗判断与 accent/bg hex 颜色字符串
 * [OUTPUT]: 对外提供 createLockScreenAccentOverlayColors、createLockScreenActionGlassMaterial、createLockScreenTopOverlayColors 与 resolveAccentAlpha 工具，生成 lock screen overlay 的颜色覆写映射与底部 action glass 材质 token
 * [POS]: workspace/lock-screen-overlay 的私有配色映射层，把 workspace accentColor 投影到主时钟/日期/widgets，把 bgColor 投影到 top 状态栏、home indicator 与底部 action glass/icon token，并为 swipe-indicator 提供基于 bgColor 的动态拟合色
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { getContrastBase } from "../../../../../../shared/wallpaper-core.js"

const TOP_COLOR_FOR_DARK_BG = "var(--color-white)"
const TOP_COLOR_FOR_LIGHT_BG = "var(--color-black)"
const ACTION_GLASS_BLUR = "blur(6px)"
const ACTION_GLASS_DARK_MATERIAL = Object.freeze({
    background: "rgba(255, 255, 255, 0.02)",
    borderColor: "rgba(255, 255, 255, 0.3)",
    topHighlightColor: "rgba(255, 255, 255, 0.8)",
    leftHighlightColor: "rgba(255, 255, 255, 0.8)",
    innerGlowShadow:
        "inset 0 1px 0 rgba(255, 255, 255, 0.5), inset 0 -1px 0 rgba(255, 255, 255, 0.1), inset 0 0 0 0 rgba(255, 255, 255, 0)",
})
const ACTION_GLASS_COLORED_MATERIAL = Object.freeze({
    background: "rgba(255, 255, 255, 0.06)",
    borderColor: "rgba(255, 255, 255, 0.3)",
    topHighlightColor: "rgba(255, 255, 255, 0.8)",
    leftHighlightColor: "rgba(255, 255, 255, 0.8)",
    innerGlowShadow:
        "inset 0 1px 0 rgba(255, 255, 255, 0.5), inset 0 -1px 0 rgba(255, 255, 255, 0.1), inset 0 0 0 0 rgba(255, 255, 255, 0)",
})
const ACTION_GLASS_LIGHT_MATERIAL = Object.freeze({
    background: "rgba(255, 255, 255, 0.09)",
    borderColor: "rgba(255, 255, 255, 0.26)",
    topHighlightColor: "rgba(255, 255, 255, 0.72)",
    leftHighlightColor: "rgba(255, 255, 255, 0.72)",
    innerGlowShadow:
        "inset 0 1px 0 rgba(255, 255, 255, 0.42), inset 0 -1px 0 rgba(255, 255, 255, 0.1), inset 0 0 0 0 rgba(255, 255, 255, 0)",
})
const SWIPE_INDICATOR_DARK_RGB = { red: 64, green: 64, blue: 64 }
const SWIPE_INDICATOR_LIGHT_RGB = { red: 205, green: 209, blue: 204 }
const SWIPE_INDICATOR_NEUTRAL_SATURATION_MAX = 0.18
const SWIPE_INDICATOR_EXTREME_LUMINANCE_MIN = 0.02
const SWIPE_INDICATOR_EXTREME_LUMINANCE_MAX = 0.96

function isHexColor(value) {
    return typeof value === "string" && /^#([0-9a-fA-F]{6})$/.test(value.trim())
}

function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value))
}

function parseHexColor(hexColor) {
    const normalized = hexColor.trim()
    return {
        red: Number.parseInt(normalized.slice(1, 3), 16),
        green: Number.parseInt(normalized.slice(3, 5), 16),
        blue: Number.parseInt(normalized.slice(5, 7), 16),
    }
}

function formatHexChannel(channel) {
    return clamp(Math.round(channel), 0, 255).toString(16).padStart(2, "0").toUpperCase()
}

function formatHexColor({ red, green, blue }) {
    return `#${formatHexChannel(red)}${formatHexChannel(green)}${formatHexChannel(blue)}`
}

function srgbChannelToLinear(channel) {
    const normalized = channel / 255
    if (normalized <= 0.04045) return normalized / 12.92
    return ((normalized + 0.055) / 1.055) ** 2.4
}

function resolveRelativeLuminance({ red, green, blue }) {
    return (
        srgbChannelToLinear(red) * 0.2126 +
        srgbChannelToLinear(green) * 0.7152 +
        srgbChannelToLinear(blue) * 0.0722
    )
}

function resolveHslColor({ red, green, blue }) {
    const normalizedRed = red / 255
    const normalizedGreen = green / 255
    const normalizedBlue = blue / 255
    const maxChannel = Math.max(normalizedRed, normalizedGreen, normalizedBlue)
    const minChannel = Math.min(normalizedRed, normalizedGreen, normalizedBlue)
    const delta = maxChannel - minChannel
    const lightness = (maxChannel + minChannel) / 2

    if (delta === 0) {
        return { hue: 0, saturation: 0, lightness }
    }

    const saturation = delta / (1 - Math.abs(2 * lightness - 1))
    let hue
    if (maxChannel === normalizedRed) {
        hue = ((normalizedGreen - normalizedBlue) / delta) % 6
    } else if (maxChannel === normalizedGreen) {
        hue = (normalizedBlue - normalizedRed) / delta + 2
    } else {
        hue = (normalizedRed - normalizedGreen) / delta + 4
    }

    return {
        hue: (hue * 60 + 360) % 360,
        saturation,
        lightness,
    }
}

function hueToRgb(channelA, channelB, hue) {
    const normalizedHue = (hue % 1 + 1) % 1
    if (normalizedHue < 1 / 6) return channelA + (channelB - channelA) * 6 * normalizedHue
    if (normalizedHue < 1 / 2) return channelB
    if (normalizedHue < 2 / 3) return channelA + (channelB - channelA) * (2 / 3 - normalizedHue) * 6
    return channelA
}

function resolveRgbColorFromHsl({ hue, saturation, lightness }) {
    if (saturation === 0) {
        const gray = lightness * 255
        return { red: gray, green: gray, blue: gray }
    }

    const channelB =
        lightness < 0.5
            ? lightness * (1 + saturation)
            : lightness + saturation - lightness * saturation
    const channelA = 2 * lightness - channelB
    const normalizedHue = hue / 360

    return {
        red: hueToRgb(channelA, channelB, normalizedHue + 1 / 3) * 255,
        green: hueToRgb(channelA, channelB, normalizedHue) * 255,
        blue: hueToRgb(channelA, channelB, normalizedHue - 1 / 3) * 255,
    }
}

function mixChannel(start, end, progress) {
    return start + (end - start) * progress
}

function smoothstep(progress) {
    const clamped = clamp(progress, 0, 1)
    return clamped * clamped * (3 - 2 * clamped)
}

function resolveAccentAlpha(accentColor, alpha) {
    if (!isHexColor(accentColor)) return undefined

    const { red, green, blue } = parseHexColor(accentColor)

    return `rgba(${red}, ${green}, ${blue}, ${alpha})`
}

function resolveTopTokenColor(bgColor) {
    if (!isHexColor(bgColor)) return undefined
    return getContrastBase(bgColor) === "255,255,255" ? TOP_COLOR_FOR_DARK_BG : TOP_COLOR_FOR_LIGHT_BG
}

function createLockScreenActionGlassMaterial(bgColor) {
    if (!isHexColor(bgColor)) {
        return {
            blur: ACTION_GLASS_BLUR,
            ...ACTION_GLASS_COLORED_MATERIAL,
        }
    }

    const backgroundRgb = parseHexColor(bgColor)
    const relativeLuminance = resolveRelativeLuminance(backgroundRgb)
    const backgroundHsl = resolveHslColor(backgroundRgb)
    const material =
        relativeLuminance >= 0.88
            ? ACTION_GLASS_LIGHT_MATERIAL
            : backgroundHsl.saturation > SWIPE_INDICATOR_NEUTRAL_SATURATION_MAX &&
                relativeLuminance > SWIPE_INDICATOR_EXTREME_LUMINANCE_MIN &&
                relativeLuminance < SWIPE_INDICATOR_EXTREME_LUMINANCE_MAX
              ? ACTION_GLASS_COLORED_MATERIAL
              : ACTION_GLASS_DARK_MATERIAL

    return {
        blur: ACTION_GLASS_BLUR,
        ...material,
    }
}

function resolveNeutralSwipeIndicatorColor(backgroundRgb) {
    const luminanceProgress = smoothstep(resolveRelativeLuminance(backgroundRgb))

    return formatHexColor({
        red: mixChannel(SWIPE_INDICATOR_DARK_RGB.red, SWIPE_INDICATOR_LIGHT_RGB.red, luminanceProgress),
        green: mixChannel(SWIPE_INDICATOR_DARK_RGB.green, SWIPE_INDICATOR_LIGHT_RGB.green, luminanceProgress),
        blue: mixChannel(SWIPE_INDICATOR_DARK_RGB.blue, SWIPE_INDICATOR_LIGHT_RGB.blue, luminanceProgress),
    })
}

function resolveSwipeIndicatorColor(bgColor) {
    if (!isHexColor(bgColor)) return undefined

    const backgroundRgb = parseHexColor(bgColor)
    const relativeLuminance = resolveRelativeLuminance(backgroundRgb)
    const backgroundHsl = resolveHslColor(backgroundRgb)

    if (
        relativeLuminance <= SWIPE_INDICATOR_EXTREME_LUMINANCE_MIN ||
        relativeLuminance >= SWIPE_INDICATOR_EXTREME_LUMINANCE_MAX ||
        backgroundHsl.saturation <= SWIPE_INDICATOR_NEUTRAL_SATURATION_MAX
    ) {
        return resolveNeutralSwipeIndicatorColor(backgroundRgb)
    }

    /* -----------------------------------------------------------------
       近似真机观感: 保留 hue，降低彩度，并把亮度收敛到可读区间。
       ----------------------------------------------------------------- */
    const softenedHue =
        backgroundHsl.hue < 24 || backgroundHsl.hue > 336 ? backgroundHsl.hue * 0.85 : backgroundHsl.hue

    return formatHexColor(
        resolveRgbColorFromHsl({
            hue: softenedHue,
            saturation: clamp(backgroundHsl.saturation * 0.735, 0.18, 0.46),
            lightness: clamp(0.56 + (backgroundHsl.lightness - 0.32) * 0.18, 0.52, 0.72),
        })
    )
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
    const swipeIndicatorColor = resolveSwipeIndicatorColor(bgColor)
    if (!topColor || !swipeIndicatorColor) return {}

    return {
        "home-indicator": topColor,
        "action-left-icon": topColor,
        "action-right-icon": topColor,
        "status-bar-leading": topColor,
        "status-bar-trailing": topColor,
        battery: topColor,
        wifi: topColor,
        cellular: topColor,
        "swipe-indicator": swipeIndicatorColor,
    }
}

export {
    createLockScreenAccentOverlayColors,
    createLockScreenActionGlassMaterial,
    createLockScreenTopOverlayColors,
    resolveAccentAlpha,
}
