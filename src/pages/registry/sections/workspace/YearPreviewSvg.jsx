/**
 * [INPUT]: 依赖 shared/wallpaper-core.js 的 computeYearLayout/getDatePartsInTimezone/getWallpaperFontFamily/contrastAlpha
 * [OUTPUT]: 对外提供 YearPreviewSvg 组件
 * [POS]: workspace 的 Year inline SVG 预览渲染器，直接消费共享布局真相源并只负责浏览器侧矢量绘制
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import {
    computeYearLayout,
    contrastAlpha,
    getDatePartsInTimezone,
    getWallpaperFontFamily,
} from "../../../../../shared/wallpaper-core.js"

function YearPreviewSvg({ config, selectedDevice }) {
    const baseWidth = selectedDevice.width
    const baseHeight = selectedDevice.height
    const today = getDatePartsInTimezone(config.timezone)
    const layout = computeYearLayout({
        width: baseWidth,
        height: baseHeight,
        bgColor: config.bgColor,
        accentColor: config.accentColor,
        clockHeight: selectedDevice.clockHeight,
        lang: config.wallpaperLang,
        year: today.year,
        month: today.month,
        day: today.day,
        cols: selectedDevice.cols,
        padding: selectedDevice.padding,
    })
    const fontFamily = getWallpaperFontFamily(config.wallpaperLang)
    const pendingFill = contrastAlpha(layout.bgColor, 0.12, config.foregroundOverride)
    const statsFill = contrastAlpha(layout.bgColor, 0.5, config.foregroundOverride)

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
            {layout.dots.map((dot, index) => (
                <circle
                    key={index}
                    cx={dot.cx}
                    cy={dot.cy}
                    r={dot.radius}
                    fill={dot.isToday ? layout.safeAccent : dot.isCompleted ? layout.safeAccent : pendingFill}
                    fillOpacity={!dot.isToday && dot.isCompleted ? 0.75 : undefined}
                />
            ))}
            <text
                x={layout.stats.centerX}
                y={layout.stats.y}
                fontFamily={fontFamily}
                fontSize={layout.fontSize}
                fontWeight={500}
                textAnchor="middle"
                dominantBaseline="middle"
            >
                <tspan fill={layout.safeAccent}>{layout.stats.daysText}</tspan>
                <tspan fill={statsFill}> · {layout.stats.completeText}</tspan>
            </text>
        </svg>
    )
}

export { YearPreviewSvg }
