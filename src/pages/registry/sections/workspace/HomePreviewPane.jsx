/**
 * [INPUT]: 依赖 react hooks, @/lib/renderer(drawYearProgress/drawLifeCalendar/drawGoalCountdown)
 * [OUTPUT]: 对外提供 HomePreviewPane 组件（手机壳 + 空态提示文案/实时 Canvas 预览）
 * [POS]: registry/sections/workspace 的左侧预览面板，根据选型状态切换提示文案与真实壁纸渲染，并按导出坐标严格等比缩放到 preview 视口
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { useCallback, useEffect, useRef } from "react"
import { drawGoalCountdown, drawLifeCalendar, drawYearProgress } from "@/lib/renderer"

const SCREEN_WIDTH = 240
const SCREEN_HEIGHT = 510
const rendererByType = {
    year: drawYearProgress,
    life: drawLifeCalendar,
    goal: drawGoalCountdown,
}

function HomePreviewPane({ config, selectedDevice, t }) {
    const canvasRef = useRef(null)

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
            <div className="relative h-[530px] w-[260px] rounded-[40px] bg-kumo-recessed p-[10px] ring-1 ring-kumo-line">
                <div className="absolute top-[10px] left-1/2 z-10 h-[28px] w-[100px] -translate-x-1/2 rounded-b-2xl bg-kumo-strong" />
                <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-[32px] bg-kumo-base">
                    {config.selectedType ? (
                        <canvas
                            ref={canvasRef}
                            className="rounded-[24px]"
                            aria-label="Wallpaper live preview canvas"
                        />
                    ) : (
                        <div className="px-6 text-center text-sm text-kumo-subtle">
                            {t("preview.selectType")}
                        </div>
                    )}
                </div>
                <div className="absolute bottom-4 left-1/2 h-1 w-[100px] -translate-x-1/2 rounded-full bg-kumo-subtle/50" />
            </div>
            <p className="text-base font-medium text-kumo-subtle uppercase">
                {t("preview.hint")}
            </p>
        </div>
    )
}

export { HomePreviewPane }
