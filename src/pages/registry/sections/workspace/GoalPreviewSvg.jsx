/**
 * [INPUT]: 依赖 shared/wallpaper-core.js 的 computeGoalLayout/getDatePartsInTimezone/getWallpaperText/getWallpaperFontFamily/resolveTextFontFamily/contrastAlpha 与 shared/goal-ring-geometry.js
 * [OUTPUT]: 对外提供 GoalPreviewSvg 组件
 * [POS]: workspace 的 Goal inline SVG 预览渲染器，直接消费共享布局真相源与圆环几何，只负责浏览器侧矢量绘制
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import {
    computeGoalLayout,
    contrastAlpha,
    getDatePartsInTimezone,
    getWallpaperFontFamily,
    getWallpaperText,
    resolveTextFontFamily,
} from "../../../../../shared/wallpaper-core.js"
import { getGoalRingGeometry } from "../../../../../shared/goal-ring-geometry.js"

function GoalPreviewSvg({ config, selectedDevice }) {
    const baseWidth = selectedDevice.width
    const baseHeight = selectedDevice.height
    const today = getDatePartsInTimezone(config.timezone)
    const resolvedGoalName = config.goalName?.trim() || getWallpaperText(config.wallpaperLang, "goalDefault", "")
    const layout = computeGoalLayout({
        width: baseWidth,
        height: baseHeight,
        bgColor: config.bgColor,
        accentColor: config.accentColor,
        clockHeight: selectedDevice.clockHeight,
        lang: config.wallpaperLang,
        goalDate: config.goalDate,
        goalStart: config.goalStart,
        goalName: resolvedGoalName,
        today,
    })
    const ringGeometry = getGoalRingGeometry(layout.ring.progress)
    const circumference = 2 * Math.PI * layout.ring.radius
    const sharedFontFamily = getWallpaperFontFamily(config.wallpaperLang)
    const labelFill = contrastAlpha(layout.bgColor, 0.5, config.foregroundOverride)
    const backgroundFill = contrastAlpha(layout.bgColor, 0.1, config.foregroundOverride)
    const goalNameFontFamily = resolveTextFontFamily(config.wallpaperLang, layout.goalName)

    return (
        <svg
            aria-label="Wallpaper live preview"
            className="block"
            role="img"
            viewBox={`0 0 ${baseWidth} ${baseHeight}`}
            width="100%"
            height="100%"
            preserveAspectRatio="xMidYMid slice"
            xmlns="http://www.w3.org/2000/svg"
        >
            <rect x={0} y={0} width={baseWidth} height={baseHeight} fill={layout.bgColor} />
            <circle
                cx={layout.ring.centerX}
                cy={layout.ring.centerY}
                r={layout.ring.radius}
                fill="none"
                stroke={backgroundFill}
                strokeWidth={layout.ringStrokeWidth}
            />
            {ringGeometry.isVisible ? (
                <circle
                    cx={layout.ring.centerX}
                    cy={layout.ring.centerY}
                    r={layout.ring.radius}
                    fill="none"
                    stroke={layout.safeAccent}
                    strokeWidth={layout.ringStrokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference * ringGeometry.strokeDashoffsetRatio}
                    transform={`rotate(-90 ${layout.ring.centerX} ${layout.ring.centerY})`}
                />
            ) : null}
            <text
                x={layout.ring.centerX}
                y={layout.numberY}
                fill={layout.safeAccent}
                fontFamily={sharedFontFamily}
                fontSize={layout.numberFontSize}
                fontWeight={700}
                textAnchor="middle"
                dominantBaseline="middle"
            >
                {layout.daysRemaining}
            </text>
            <text
                x={layout.ring.centerX}
                y={layout.labelY}
                fill={labelFill}
                fontFamily={sharedFontFamily}
                fontSize={layout.labelFontSize}
                fontWeight={400}
                textAnchor="middle"
                dominantBaseline="middle"
            >
                {layout.daysLeftText}
            </text>
            {layout.goalName ? (
                <text
                    x={layout.ring.centerX}
                    y={layout.goalNameY}
                    fill={layout.safeAccent}
                    fontFamily={goalNameFontFamily}
                    fontSize={layout.nameFontSize}
                    fontWeight={600}
                    textAnchor="middle"
                    dominantBaseline="middle"
                >
                    {layout.goalName}
                </text>
            ) : null}
        </svg>
    )
}

export { GoalPreviewSvg }
