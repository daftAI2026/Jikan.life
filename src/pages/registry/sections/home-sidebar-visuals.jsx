/**
 * [INPUT]: 依赖 @/lib/utils(cn) 与 shared/goal-ring-geometry.js（Goal 圆环几何）
 * [OUTPUT]: 对外提供 YEAR_GRID_COLUMNS、YearVisual、LifeVisual、GoalVisual
 * [POS]: registry/sections 的 HomeSidebar 视觉层，封装三类风格卡预览渲染
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { cn } from "@/lib/utils"
import { getGoalRingGeometry } from "../../../../shared/goal-ring-geometry.js"

const YEAR_GRID_COLUMNS = 10
const YEAR_DOT_STATE_TOKENS = {
    today: "bg-kumo-contrast",
    completed: "bg-kumo-contrast/75",
    pending: "bg-kumo-contrast/12",
}

function getYearDotState(index, filledCount, totalDots) {
    const todayIndex = Math.min(totalDots - 1, Math.max(0, filledCount - 1))
    if (index === todayIndex) return "today"
    if (index < filledCount) return "completed"
    return "pending"
}

function YearVisual({ percent }) {
    const totalDots = YEAR_GRID_COLUMNS * YEAR_GRID_COLUMNS
    const filledCount = Math.min(totalDots, Math.max(0, percent))

    return (
        <div
            className="grid place-items-center gap-[4px] p-4"
            style={{ gridTemplateColumns: `repeat(${YEAR_GRID_COLUMNS}, minmax(0, 1fr))` }}
        >
            {Array.from({ length: totalDots }).map((_, index) => {
                const dotState = getYearDotState(index, filledCount, totalDots)
                return (
                    <div
                        key={`year-dot-${index}`}
                        data-dot-state={dotState}
                        className={cn(
                            "h-[10px] w-[10px] origin-center scale-[0.84] rounded-full transition-colors duration-500",
                            YEAR_DOT_STATE_TOKENS[dotState]
                        )}
                    />
                )
            })}
        </div>
    )
}

function LifeVisual() {
    const filledCount = 25
    const totalDots = 65

    return (
        <div className="grid grid-cols-[repeat(13,1fr)] place-items-center gap-[2px] p-4">
            {Array.from({ length: totalDots }).map((_, index) => (
                <div
                    key={`life-dot-${index}`}
                    className={cn(
                        "h-[6px] w-[6px] rounded-full transition-colors duration-500",
                        index < filledCount ? "bg-kumo-contrast" : "bg-kumo-fill"
                    )}
                />
            ))}
        </div>
    )
}

function GoalVisual({ layout }) {
    const { ring, daysRemaining, daysLeftText, numberFontSize, labelFontSize, labelY } = layout
    const ringGeometry = getGoalRingGeometry(ring.progress)
    const strokeWidth = 100 * 0.025
    const circumference = 2 * Math.PI * ring.radius
    const strokeDashoffset = circumference * ringGeometry.strokeDashoffsetRatio

    return (
        <div className="flex h-full items-center justify-center">
            <div className="relative h-[100px] w-[100px]">
                <svg className="h-full w-full" viewBox="0 0 100 100">
                    <circle
                        cx={ring.centerX}
                        cy={ring.centerY}
                        r={ring.radius}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={strokeWidth}
                        className="text-kumo-fill"
                    />
                    {ringGeometry.isVisible && (
                        <circle
                            cx={ring.centerX}
                            cy={ring.centerY}
                            r={ring.radius}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={strokeWidth}
                            strokeLinecap="round"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            transform={`rotate(-90 ${ring.centerX} ${ring.centerY})`}
                            className="text-kumo-contrast transition-all duration-1000 ease-out"
                        />
                    )}
                    <text
                        x={ring.centerX}
                        y={ring.centerY - 1}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize={numberFontSize}
                        fontWeight="700"
                        className="fill-current text-kumo-contrast"
                    >
                        {daysRemaining}
                    </text>
                    <text
                        x={ring.centerX}
                        y={labelY + 8}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize={labelFontSize + 1}
                        fontWeight="400"
                        className="fill-current text-kumo-subtle"
                    >
                        {daysLeftText}
                    </text>
                </svg>
            </div>
        </div>
    )
}

export { GoalVisual, LifeVisual, YEAR_GRID_COLUMNS, YearVisual }
