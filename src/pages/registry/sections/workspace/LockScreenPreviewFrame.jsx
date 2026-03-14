/**
 * [INPUT]: 依赖 React children、lock-screen-overlay inline 组件、workspace/mobile-preview-sizing 的锁屏几何真相源与 workspace bgColor / wallpaperLang / showWidgets / targetHeight
 * [OUTPUT]: 对外提供 LockScreenPreviewFrame 组件、overlay 默认颜色协议
 * [POS]: registry/sections/workspace 的预览壳层，让 live preview 以 Wallpaper 槽位为基准反推整机缩放，并把 overlay 颜色控制、底部 action glass 背景色、Wallpaper Language、preview widget 可见性与可变 targetHeight 收口到稳定入口；overlay 进入时统一经由外层 wrapper 做轻量淡入，不把动画污染到内部 live 层树
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import {
    LockScreenOverlay,
    LOCK_SCREEN_OVERLAY_DEFAULT_COLORS,
    LOCK_SCREEN_OVERLAY_LAYER_IDS,
} from "./lock-screen-overlay"
import {
    DEFAULT_LOCK_SCREEN_TARGET_HEIGHT,
    LOCK_SCREEN_LAYOUT,
    resolveLockScreenLayoutMetrics,
} from "./mobile-preview-sizing"
const BEZEL_INSET = 1

function LockScreenPreviewFrame({
    children,
    targetHeight = DEFAULT_LOCK_SCREEN_TARGET_HEIGHT,
    showOverlay = true,
    showWidgets = true,
    overlayColors,
    overlayBackgroundColor,
    wallpaperLang,
}) {
    const layoutMetrics = resolveLockScreenLayoutMetrics(targetHeight)
    const scaledShellWidth = layoutMetrics.shellWidth
    const scaledShellHeight = layoutMetrics.shellHeight
    const scaledWallpaperWidth = layoutMetrics.wallpaperWidth
    const scaledWallpaperHeight = layoutMetrics.wallpaperHeight
    const scaledWallpaperLeft = layoutMetrics.wallpaperLeft
    const scaledWallpaperTop = layoutMetrics.wallpaperTop
    const scaledWallpaperRadius = layoutMetrics.wallpaperRadius
    const bezelScale = (layoutMetrics.shellWidth - BEZEL_INSET * 2) / layoutMetrics.shellWidth
    const scaledBezelWidth = layoutMetrics.shellWidth * bezelScale
    const scaledBezelHeight = layoutMetrics.shellHeight * bezelScale
    const scaledBezelLeft = (layoutMetrics.shellWidth - scaledBezelWidth) / 2
    const scaledBezelTop = (layoutMetrics.shellHeight - scaledBezelHeight) / 2

    return (
        <div
            className="relative shrink-0"
            data-preview-shell="lock-screen"
            style={{
                width: `${scaledShellWidth}px`,
                height: `${scaledShellHeight}px`,
            }}
        >
            <div
                className="absolute flex items-center justify-center overflow-hidden bg-kumo-base"
                data-preview-wallpaper-viewport="lock-screen"
                style={{
                    left: `${scaledWallpaperLeft}px`,
                    top: `${scaledWallpaperTop}px`,
                    width: `${scaledWallpaperWidth}px`,
                    height: `${scaledWallpaperHeight}px`,
                    borderRadius: `${scaledWallpaperRadius}px`,
                }}
            >
                {children}
            </div>
            {showOverlay ? (
                <div
                    data-preview-overlay="lock-screen"
                    className="absolute inset-0 z-10 animate-in fade-in duration-500"
                >
                    <LockScreenOverlay
                        backgroundColor={overlayBackgroundColor}
                        colors={overlayColors}
                        overlayScale={layoutMetrics.scale}
                        showWidgets={showWidgets}
                        wallpaperLang={wallpaperLang}
                        style={{
                            left: `${scaledWallpaperLeft}px`,
                            top: `${scaledWallpaperTop}px`,
                            width: `${scaledWallpaperWidth}px`,
                            height: `${scaledWallpaperHeight}px`,
                        }}
                    />
                </div>
            ) : null}
            <img
                src={LOCK_SCREEN_LAYOUT.assets.bezel}
                alt=""
                aria-hidden="true"
                className="pointer-events-none absolute z-20 block"
                style={{
                    left: `${scaledBezelLeft}px`,
                    top: `${scaledBezelTop}px`,
                    width: `${scaledBezelWidth}px`,
                    height: `${scaledBezelHeight}px`,
                }}
            />
        </div>
    )
}

export {
    LockScreenPreviewFrame,
    LOCK_SCREEN_OVERLAY_DEFAULT_COLORS,
    LOCK_SCREEN_OVERLAY_LAYER_IDS,
}
