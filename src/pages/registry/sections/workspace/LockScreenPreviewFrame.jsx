/**
 * [INPUT]: 依赖 React children、lock-screen-overlay inline 组件、Figma bezel 静态 SVG 资源与 workspace bgColor / wallpaperLang / showWidgets
 * [OUTPUT]: 对外提供 LockScreenPreviewFrame 组件、LOCK_SCREEN_LAYOUT 常量、overlay 默认颜色协议
 * [POS]: registry/sections/workspace 的预览壳层，让 live preview 以 Wallpaper 槽位为基准反推整机缩放，并把 overlay 颜色控制、底部 action glass 背景色、Wallpaper Language、preview widget 可见性与统一 overlay scale 收口到稳定入口
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import {
    LockScreenOverlay,
    LOCK_SCREEN_OVERLAY_DEFAULT_COLORS,
    LOCK_SCREEN_OVERLAY_LAYER_IDS,
} from "./lock-screen-overlay"

const LOCK_SCREEN_LAYOUT = {
    shell: { width: 450, height: 920 },
    wallpaper: { width: 402, height: 874, left: 24, top: 23 },
    targetHeight: 510,
    scale: 510 / 874,
    assets: {
        bezel: "/preview/iPhone/lock-screen-bezel.svg",
    },
}

const scaledShellWidth = LOCK_SCREEN_LAYOUT.shell.width * LOCK_SCREEN_LAYOUT.scale
const scaledShellHeight = LOCK_SCREEN_LAYOUT.shell.height * LOCK_SCREEN_LAYOUT.scale
const scaledWallpaperWidth = LOCK_SCREEN_LAYOUT.wallpaper.width * LOCK_SCREEN_LAYOUT.scale
const scaledWallpaperHeight = LOCK_SCREEN_LAYOUT.wallpaper.height * LOCK_SCREEN_LAYOUT.scale
const scaledWallpaperLeft = LOCK_SCREEN_LAYOUT.wallpaper.left * LOCK_SCREEN_LAYOUT.scale
const scaledWallpaperTop = LOCK_SCREEN_LAYOUT.wallpaper.top * LOCK_SCREEN_LAYOUT.scale
const scaledWallpaperRadius = 54 * LOCK_SCREEN_LAYOUT.scale
const BEZEL_INSET = 1
const bezelScale = (scaledShellWidth - BEZEL_INSET * 2) / scaledShellWidth
const scaledBezelWidth = scaledShellWidth * bezelScale
const scaledBezelHeight = scaledShellHeight * bezelScale
const scaledBezelLeft = (scaledShellWidth - scaledBezelWidth) / 2
const scaledBezelTop = (scaledShellHeight - scaledBezelHeight) / 2

function LockScreenPreviewFrame({
    children,
    showOverlay = true,
    showWidgets = true,
    overlayColors,
    overlayBackgroundColor,
    wallpaperLang,
}) {
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
                <LockScreenOverlay
                    backgroundColor={overlayBackgroundColor}
                    colors={overlayColors}
                    overlayScale={LOCK_SCREEN_LAYOUT.scale}
                    showWidgets={showWidgets}
                    wallpaperLang={wallpaperLang}
                    className="z-10"
                    style={{
                        left: `${scaledWallpaperLeft}px`,
                        top: `${scaledWallpaperTop}px`,
                        width: `${scaledWallpaperWidth}px`,
                        height: `${scaledWallpaperHeight}px`,
                    }}
                />
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
    LOCK_SCREEN_LAYOUT,
    LOCK_SCREEN_OVERLAY_DEFAULT_COLORS,
    LOCK_SCREEN_OVERLAY_LAYER_IDS,
}
