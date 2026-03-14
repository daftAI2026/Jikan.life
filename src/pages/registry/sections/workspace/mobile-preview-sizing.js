/**
 * [INPUT]: 依赖 segmented workspace 高度与锁屏基准几何常量
 * [OUTPUT]: 对外提供锁屏预览几何真相源与 segmented/mobile 预览高度解析函数（LOCK_SCREEN_LAYOUT、resolveLockScreenLayoutMetrics、resolveMobilePreviewTargetHeight、resolvePreviewTargetHeight）
 * [POS]: registry/sections/workspace 的 segmented 预览尺寸单一真相源，被 HomeGrid、HomePreviewPane 与 LockScreenPreviewFrame 共享；mobile 与 md segmented 共享同一手机壳最大尺度，只在短窗时按首卡预算收缩
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

const LOCK_SCREEN_LAYOUT = {
    shell: { width: 450, height: 920 },
    wallpaper: { width: 402, height: 874, left: 24, top: 23 },
    assets: {
        bezel: "/preview/iPhone/lock-screen-bezel.svg",
    },
}

const DEFAULT_LOCK_SCREEN_TARGET_HEIGHT = 510
const MOBILE_PREVIEW_MIN_TARGET_HEIGHT = 180
const MOBILE_PREVIEW_MAX_TARGET_HEIGHT = DEFAULT_LOCK_SCREEN_TARGET_HEIGHT
const SETTINGS_CARD_MIN_HEIGHT = 220
const SEGMENTED_TABS_RAIL_HEIGHT = 48
const MOBILE_PREVIEW_STACK_OVERHEAD = 60
const LOCK_SCREEN_WALLPAPER_RADIUS = 54

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max)
}

function resolveLockScreenLayoutMetrics(targetHeight = DEFAULT_LOCK_SCREEN_TARGET_HEIGHT) {
    const resolvedTargetHeight = Number.isFinite(targetHeight)
        ? Math.max(MOBILE_PREVIEW_MIN_TARGET_HEIGHT, targetHeight)
        : DEFAULT_LOCK_SCREEN_TARGET_HEIGHT
    const scale = resolvedTargetHeight / LOCK_SCREEN_LAYOUT.wallpaper.height

    return {
        scale,
        shellWidth: LOCK_SCREEN_LAYOUT.shell.width * scale,
        shellHeight: LOCK_SCREEN_LAYOUT.shell.height * scale,
        wallpaperWidth: LOCK_SCREEN_LAYOUT.wallpaper.width * scale,
        wallpaperHeight: LOCK_SCREEN_LAYOUT.wallpaper.height * scale,
        wallpaperLeft: LOCK_SCREEN_LAYOUT.wallpaper.left * scale,
        wallpaperTop: LOCK_SCREEN_LAYOUT.wallpaper.top * scale,
        wallpaperRadius: LOCK_SCREEN_WALLPAPER_RADIUS * scale,
    }
}

function resolveMobilePreviewTargetHeight({ workspaceHeight }) {
    if (!Number.isFinite(workspaceHeight) || workspaceHeight <= 0) {
        return MOBILE_PREVIEW_MAX_TARGET_HEIGHT
    }

    const availablePreviewBlockHeight = workspaceHeight - (SETTINGS_CARD_MIN_HEIGHT + SEGMENTED_TABS_RAIL_HEIGHT)
    const availableWallpaperTargetHeight = Math.floor((availablePreviewBlockHeight - MOBILE_PREVIEW_STACK_OVERHEAD) * LOCK_SCREEN_LAYOUT.wallpaper.height / LOCK_SCREEN_LAYOUT.shell.height)

    return clamp(
        availableWallpaperTargetHeight,
        MOBILE_PREVIEW_MIN_TARGET_HEIGHT,
        MOBILE_PREVIEW_MAX_TARGET_HEIGHT
    )
}

function resolvePreviewTargetHeight({ effectiveLayoutTier, useSegmentedWorkspaceLayout, workspaceHeight }) {
    if (!useSegmentedWorkspaceLayout) return DEFAULT_LOCK_SCREEN_TARGET_HEIGHT
    if (!["mobile", "md"].includes(effectiveLayoutTier)) return DEFAULT_LOCK_SCREEN_TARGET_HEIGHT
    return resolveMobilePreviewTargetHeight({ workspaceHeight })
}

export {
    DEFAULT_LOCK_SCREEN_TARGET_HEIGHT,
    LOCK_SCREEN_LAYOUT,
    resolveLockScreenLayoutMetrics,
    resolveMobilePreviewTargetHeight,
    resolvePreviewTargetHeight,
}
