/**
 * [INPUT]: 依赖 react hooks, @/lib/renderer(drawYearProgress/drawLifeCalendar/drawGoalCountdown)
 * [OUTPUT]: 对外提供 RegistryPreviewPane 组件（手机壳 + 实时 Canvas 预览）
 * [POS]: registry/sections/workspace 的左侧预览面板，根据 selectedType 与配置实时渲染壁纸
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { useCallback, useEffect, useRef } from "react"
import { drawGoalCountdown, drawLifeCalendar, drawYearProgress } from "@/lib/renderer"

function RegistryPreviewPane({ config, selectedDevice, t }) {
    const canvasRef = useRef(null)

    const drawPreview = useCallback(() => {
        const canvas = canvasRef.current
        if (!canvas || !config.selectedType) return

        const baseWidth = selectedDevice.width
        const baseHeight = selectedDevice.height
        const maxWidth = 220
        const maxHeight = 470
        const scale = Math.min(maxWidth / baseWidth, maxHeight / baseHeight)
        const width = Math.max(1, Math.floor(baseWidth * scale))
        const height = Math.max(1, Math.floor(baseHeight * scale))
        const dpr = window.devicePixelRatio || 1

        canvas.width = Math.floor(width * dpr)
        canvas.height = Math.floor(height * dpr)
        canvas.style.width = `${width}px`
        canvas.style.height = `${height}px`

        const ctx = canvas.getContext("2d")
        if (!ctx) return
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
        ctx.clearRect(0, 0, width, height)
        ctx.fillStyle = config.bgColor
        ctx.fillRect(0, 0, width, height)

        const renderConfig = {
            ...config,
            cols: selectedDevice.cols,
            padding: selectedDevice.padding,
        }

        if (config.selectedType === "year") {
            drawYearProgress(ctx, width, height, renderConfig, selectedDevice.clockHeight)
            return
        }

        if (config.selectedType === "life") {
            drawLifeCalendar(ctx, width, height, renderConfig, selectedDevice.clockHeight)
            return
        }

        drawGoalCountdown(ctx, width, height, renderConfig, selectedDevice.clockHeight)
    }, [config, selectedDevice])

    useEffect(() => {
        drawPreview()
    }, [drawPreview])

    return (
        <div className="flex h-full min-h-[420px] flex-col items-center justify-center gap-4 px-6 py-8">
            <div className="relative h-[530px] w-[260px] rounded-[40px] bg-kumo-recessed p-[10px] shadow-xl ring-1 ring-kumo-line">
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
            <p className="text-[11px] font-semibold tracking-[0.2em] text-kumo-subtle uppercase">
                {t("preview.hint")}
            </p>
        </div>
    )
}

export { RegistryPreviewPane }
