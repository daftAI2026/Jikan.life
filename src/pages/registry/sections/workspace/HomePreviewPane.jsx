/**
 * [INPUT]: 依赖 react hooks, @/lib/renderer(drawYearProgress/drawLifeCalendar/drawGoalCountdown), LockScreenPreviewFrame 与 lock-screen-overlay 配色映射 helper
 * [OUTPUT]: 对外提供 HomePreviewPane 组件（Figma 锁屏壳 + 空态提示文案/实时 Canvas 预览）
 * [POS]: registry/sections/workspace 的左侧预览面板，根据选型状态切换提示文案与真实壁纸渲染，并按导出坐标严格等比缩放后投影到固定锁屏 Wallpaper 槽位；同时把 workspace accentColor 投影到主时钟/日期/widgets，把 bgColor 投影到 top 状态栏 token 配色
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { useCallback, useEffect, useRef } from "react"
import { drawGoalCountdown, drawLifeCalendar, drawYearProgress } from "@/lib/renderer"
import { LockScreenPreviewFrame, LOCK_SCREEN_DARK_LAYOUT } from "./LockScreenPreviewFrame"
import {
    createLockScreenAccentOverlayColors,
    createLockScreenTopOverlayColors,
} from "./lock-screen-overlay/lock-screen-overlay.colors"

const SCREEN_WIDTH = LOCK_SCREEN_DARK_LAYOUT.wallpaper.width * LOCK_SCREEN_DARK_LAYOUT.scale
const SCREEN_HEIGHT = LOCK_SCREEN_DARK_LAYOUT.targetHeight
const rendererByType = {
    year: drawYearProgress,
    life: drawLifeCalendar,
    goal: drawGoalCountdown,
}

function HomePreviewPane({ config, selectedDevice, t }) {
    const canvasRef = useRef(null)
    const overlayColors = {
        ...createLockScreenTopOverlayColors(config.bgColor),
        ...createLockScreenAccentOverlayColors(config.accentColor),
    }

    const drawPreview = useCallback(() => {
        const canvas = canvasRef.current
        if (!canvas || !config.selectedType) return

        const baseWidth = selectedDevice.width
        const baseHeight = selectedDevice.height
        // Use "cover" scaling so wallpaper fills the phone screen area.
        const previewScale = Math.max(SCREEN_WIDTH / baseWidth, SCREEN_HEIGHT / baseHeight)
        const previewWidth = baseWidth * previewScale
        const previewHeight = baseHeight * previewScale
        const dpr = window.devicePixelRatio || 1

        canvas.width = Math.max(1, Math.ceil(previewWidth * dpr))
        canvas.height = Math.max(1, Math.ceil(previewHeight * dpr))
        canvas.style.width = `${previewWidth}px`
        canvas.style.height = `${previewHeight}px`

        const ctx = canvas.getContext("2d")
        if (!ctx) return
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
        ctx.clearRect(0, 0, previewWidth, previewHeight)
        ctx.fillStyle = config.bgColor
        ctx.fillRect(0, 0, previewWidth, previewHeight)

        const renderConfig = {
            ...config,
            cols: selectedDevice.cols,
            padding: selectedDevice.padding,
        }
        const drawWallpaperPreview = rendererByType[config.selectedType]
        if (!drawWallpaperPreview) return

        /* -----------------------------------------------------------------
           Preview should be a scaled version of the final wallpaper render.
           All wallpaper types share one export-space draw path here.
           ----------------------------------------------------------------- */
        ctx.save()
        ctx.scale(previewScale, previewScale)
        drawWallpaperPreview(ctx, baseWidth, baseHeight, renderConfig, selectedDevice.clockHeight)
        ctx.restore()
    }, [config, selectedDevice])

    useEffect(() => {
        drawPreview()
    }, [drawPreview])

    return (
        <div className="flex h-full min-h-[420px] flex-col items-center justify-center gap-4 px-6 py-8">
            <LockScreenPreviewFrame showOverlay={Boolean(config.selectedType)} overlayColors={overlayColors}>
                {config.selectedType ? (
                    <canvas
                        ref={canvasRef}
                        className="block shrink-0"
                        aria-label="Wallpaper live preview canvas"
                    />
                ) : (
                    <div className="px-6 text-center text-sm text-kumo-subtle">
                        {t("preview.selectType")}
                    </div>
                )}
            </LockScreenPreviewFrame>
            <p className="text-base font-medium text-kumo-subtle uppercase">
                {t("preview.hint")}
            </p>
        </div>
    )
}

export { HomePreviewPane }
