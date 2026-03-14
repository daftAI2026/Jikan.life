/**
 * [INPUT]: 依赖 react hooks, @/lib/renderer(drawYearProgress/drawLifeCalendar/drawGoalCountdown), LockScreenPreviewFrame、workspace/mobile-preview-sizing 与 lock-screen-overlay 配色/材质映射 helper，以及父级显式透传的 showOverlay/previewTargetHeight
 * [OUTPUT]: 对外提供 HomePreviewPane 组件（Figma 锁屏壳 + 空态提示文案/实时 Canvas 预览；segmented 下消费父级预算后的预览目标高度）
 * [POS]: registry/sections/workspace 的左侧预览面板，根据选型状态切换提示文案与真实壁纸渲染，并按导出坐标严格等比缩放后投影到锁屏 Wallpaper 槽位；同时把 workspace accentColor 投影到主时钟/日期/widgets，把 bgColor 投影到 top 状态栏 token 配色与底部 action glass 材质，并把父级控制的 preview chrome reveal、wallpaperLang、goal-only widget 可见性与 segmented 预算后的 target height 透传给锁屏 overlay
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { useCallback, useEffect, useRef } from "react"
import { drawGoalCountdown, drawLifeCalendar, drawYearProgress } from "@/lib/renderer"
import { LockScreenPreviewFrame } from "./LockScreenPreviewFrame"
import {
    DEFAULT_LOCK_SCREEN_TARGET_HEIGHT,
    resolveLockScreenLayoutMetrics,
} from "./mobile-preview-sizing"
import {
    createLockScreenAccentOverlayColors,
    createLockScreenTopOverlayColors,
} from "./lock-screen-overlay/lock-screen-overlay.colors"

const rendererByType = {
    year: drawYearProgress,
    life: drawLifeCalendar,
    goal: drawGoalCountdown,
}

function HomePreviewPane({ config, previewTargetHeight, selectedDevice, showOverlay, t }) {
    const canvasRef = useRef(null)
    const showWidgets = config.selectedType !== "goal"
    const layoutMetrics = resolveLockScreenLayoutMetrics(previewTargetHeight)
    const isCompactPreview = previewTargetHeight < DEFAULT_LOCK_SCREEN_TARGET_HEIGHT
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
        const previewScale = Math.max(layoutMetrics.wallpaperWidth / baseWidth, layoutMetrics.wallpaperHeight / baseHeight)
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
    }, [config, layoutMetrics.wallpaperHeight, layoutMetrics.wallpaperWidth, selectedDevice])

    useEffect(() => {
        drawPreview()
    }, [drawPreview])

    return (
        <div
            className={[
                "flex h-full flex-col items-center justify-center",
                isCompactPreview ? "min-h-0 gap-3 px-4 py-4" : "min-h-[420px] gap-4 px-6 py-8",
            ].join(" ")}
        >
            <LockScreenPreviewFrame
                targetHeight={previewTargetHeight}
                showOverlay={showOverlay}
                showWidgets={showWidgets}
                overlayColors={overlayColors}
                overlayBackgroundColor={config.bgColor}
                wallpaperLang={config.wallpaperLang}
            >
                {config.selectedType ? (
                    <canvas
                        ref={canvasRef}
                        className="block shrink-0"
                        aria-label="Wallpaper live preview canvas"
                    />
                ) : (
                    <div className={isCompactPreview ? "px-4 text-center text-sm text-kumo-subtle" : "px-6 text-center text-sm text-kumo-subtle"}>
                        {t("preview.selectType")}
                    </div>
                )}
            </LockScreenPreviewFrame>
            <p className={isCompactPreview ? "text-sm font-medium text-kumo-subtle uppercase" : "text-base font-medium text-kumo-subtle uppercase"}>
                {t("preview.hint")}
            </p>
        </div>
    )
}

export { HomePreviewPane }
