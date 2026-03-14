/**
 * [INPUT]: 依赖移动端工作区高度与锁屏基准几何常量
 * [OUTPUT]: 对外提供锁屏预览几何真相源与移动端预览高度解析函数（LOCK_SCREEN_LAYOUT、resolveLockScreenLayoutMetrics、resolveMobilePreviewTargetHeight、resolvePreviewTargetHeight）
 * [POS]: registry/sections/workspace 的移动端预览尺寸单一真相源，被 HomeGrid、HomePreviewPane 与 LockScreenPreviewFrame 共享
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
const MOBILE_PREVIEW_MIN_TARGET_HEIGHT = 220
const MOBILE_PREVIEW_MAX_TARGET_HEIGHT = 380
const MOBILE_PREVIEW_RESERVED_SETTINGS_HEIGHT = 192
const MOBILE_PREVIEW_RESERVED_CHROME_HEIGHT = 56
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

    const constrainedHeight = workspaceHeight
        - MOBILE_PREVIEW_RESERVED_SETTINGS_HEIGHT
        - MOBILE_PREVIEW_RESERVED_CHROME_HEIGHT

    return Math.round(
        clamp(
            constrainedHeight,
            MOBILE_PREVIEW_MIN_TARGET_HEIGHT,
            MOBILE_PREVIEW_MAX_TARGET_HEIGHT
        )
    )
}

function resolvePreviewTargetHeight({ effectiveLayoutTier, workspaceHeight }) {
    if (effectiveLayoutTier !== "mobile") return DEFAULT_LOCK_SCREEN_TARGET_HEIGHT
    return resolveMobilePreviewTargetHeight({ workspaceHeight })
}

export {
    DEFAULT_LOCK_SCREEN_TARGET_HEIGHT,
    LOCK_SCREEN_LAYOUT,
    resolveLockScreenLayoutMetrics,
    resolveMobilePreviewTargetHeight,
    resolvePreviewTargetHeight,
}
