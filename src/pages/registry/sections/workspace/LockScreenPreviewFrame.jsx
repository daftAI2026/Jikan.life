/**
 * [INPUT]: 依赖 React children、Figma 锁屏静态 SVG 资源
 * [OUTPUT]: 对外提供 LockScreenPreviewFrame 组件与 LOCK_SCREEN_DARK_LAYOUT 常量
 * [POS]: registry/sections/workspace 的预览壳层，让 live preview 以 Wallpaper 槽位为基准反推整机缩放
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
const LOCK_SCREEN_DARK_LAYOUT = {
    shell: { width: 450, height: 920 },
    wallpaper: { width: 402, height: 874, left: 24, top: 23 },
    targetHeight: 510,
    scale: 510 / 874,
    assets: {
        overlay: "/preview/ios26001/lock-screen-dark-overlay.svg",
        bezel: "/preview/ios26001/lock-screen-dark-bezel.svg",
    },
}

const scaledShellWidth = LOCK_SCREEN_DARK_LAYOUT.shell.width * LOCK_SCREEN_DARK_LAYOUT.scale
const scaledShellHeight = LOCK_SCREEN_DARK_LAYOUT.shell.height * LOCK_SCREEN_DARK_LAYOUT.scale
const scaledWallpaperWidth = LOCK_SCREEN_DARK_LAYOUT.wallpaper.width * LOCK_SCREEN_DARK_LAYOUT.scale
const scaledWallpaperHeight = LOCK_SCREEN_DARK_LAYOUT.wallpaper.height * LOCK_SCREEN_DARK_LAYOUT.scale
const scaledWallpaperLeft = LOCK_SCREEN_DARK_LAYOUT.wallpaper.left * LOCK_SCREEN_DARK_LAYOUT.scale
const scaledWallpaperTop = LOCK_SCREEN_DARK_LAYOUT.wallpaper.top * LOCK_SCREEN_DARK_LAYOUT.scale
const scaledWallpaperRadius = 54 * LOCK_SCREEN_DARK_LAYOUT.scale
const BEZEL_INSET = 1
const bezelScale = (scaledShellWidth - BEZEL_INSET * 2) / scaledShellWidth
const scaledBezelWidth = scaledShellWidth * bezelScale
const scaledBezelHeight = scaledShellHeight * bezelScale
const scaledBezelLeft = (scaledShellWidth - scaledBezelWidth) / 2
const scaledBezelTop = (scaledShellHeight - scaledBezelHeight) / 2

function LockScreenPreviewFrame({ children, showOverlay = true }) {
    return (
        <div
            className="relative shrink-0"
            data-preview-shell="lock-screen-dark"
            style={{
                width: `${scaledShellWidth}px`,
                height: `${scaledShellHeight}px`,
            }}
        >
            <div
                className="absolute flex items-center justify-center overflow-hidden bg-kumo-base"
                data-preview-wallpaper-viewport="lock-screen-dark"
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
                <img
                    src={LOCK_SCREEN_DARK_LAYOUT.assets.overlay}
                    alt=""
                    aria-hidden="true"
                    className="pointer-events-none absolute z-10 block"
                    style={{
                        left: `${scaledWallpaperLeft}px`,
                        top: `${scaledWallpaperTop}px`,
                        width: `${scaledWallpaperWidth}px`,
                        height: `${scaledWallpaperHeight}px`,
                    }}
                />
            ) : null}
            <img
                src={LOCK_SCREEN_DARK_LAYOUT.assets.bezel}
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

export { LockScreenPreviewFrame, LOCK_SCREEN_DARK_LAYOUT }
