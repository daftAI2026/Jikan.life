/**
 * [INPUT]: 依赖 LockScreenPreviewFrame、workspace/mobile-preview-sizing、YearPreviewSvg、GoalPreviewSvg、lock-screen-overlay 配色/材质映射 helper，以及父级显式透传的 showOverlay/previewTargetHeight
 * [OUTPUT]: 对外提供 HomePreviewPane 组件（Figma 锁屏壳 + 空态提示文案/Year-Goal inline SVG 预览；segmented 下消费父级预算后的预览目标高度）
 * [POS]: registry/sections/workspace 的左侧预览面板，根据选型状态切换提示文案与真实壁纸渲染，并以浏览器原生 SVG 直接贴合锁屏 Wallpaper 槽位；同时把 workspace accentColor 投影到主时钟/日期/widgets，把 bgColor 投影到 top 状态栏 token 配色与底部 action glass 材质，并把父级控制的 preview chrome reveal、wallpaperLang、goal-only widget 可见性与 segmented 预算后的 target height 透传给锁屏 overlay
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { GoalPreviewSvg } from "./GoalPreviewSvg"
import { LockScreenPreviewFrame } from "./LockScreenPreviewFrame"
import { DEFAULT_LOCK_SCREEN_TARGET_HEIGHT } from "./mobile-preview-sizing"
import {
    createLockScreenAccentOverlayColors,
    createLockScreenTopOverlayColors,
} from "./lock-screen-overlay/lock-screen-overlay.colors"
import { YearPreviewSvg } from "./YearPreviewSvg"

function HomePreviewPane({ config, previewTargetHeight, selectedDevice, showOverlay, t }) {
    const showWidgets = config.selectedType !== "goal"
    const isCompactPreview = previewTargetHeight < DEFAULT_LOCK_SCREEN_TARGET_HEIGHT
    const overlayColors = {
        ...createLockScreenTopOverlayColors(config.bgColor),
        ...createLockScreenAccentOverlayColors(config.accentColor),
    }
    const previewContent = config.selectedType === "year"
        ? <YearPreviewSvg config={config} selectedDevice={selectedDevice} />
        : config.selectedType === "goal"
            ? <GoalPreviewSvg config={config} selectedDevice={selectedDevice} />
            : null

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
                {previewContent ? (
                    previewContent
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
