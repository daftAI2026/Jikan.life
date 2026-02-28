/**
 * [INPUT]: 依赖 react(useMemo), @/lib/utils(cn), home-sidebar-visuals 预览组件 与 i18n/date 视图数据
 * [OUTPUT]: 对外提供 HomeSidebarCards（风格卡片数据构造与渲染循环）
 * [POS]: registry/sections 的 HomeSidebar 卡片层，封装 year/life/goal 卡片字典与交互渲染细节
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { useMemo } from "react"
import { cn } from "@/lib/utils"
import { GoalVisual, LifeVisual, YearVisual } from "./home-sidebar-visuals"

const HIDDEN_STYLE_CARD_IDS = new Set(["life"])

function HomeSidebarCards({ selectedStyle, onStyleSelect, yearStats, goalPreviewLayout, t }) {
    const styleCards = useMemo(
        () => [
            {
                id: "year",
                title: t("type.year.name"),
                description: t("type.year.description"),
                preview: (
                    <div className="origin-center scale-[1]">
                        <YearVisual percent={yearStats.percent} />
                    </div>
                ),
                stats: [
                    { label: t("type.year.statDay"), value: String(yearStats.day) },
                    { label: t("type.year.statWeek"), value: String(yearStats.week) },
                    { label: t("type.year.statComplete"), value: `${yearStats.percent}%` },
                ],
            },
            {
                id: "life",
                title: t("type.life.name"),
                description: t("type.life.description"),
                preview: (
                    <div className="origin-center scale-[1]">
                        <LifeVisual />
                    </div>
                ),
                stats: [
                    { label: t("type.life.statWeeks"), value: t("type.life.valueWeeks") },
                    { label: t("type.life.statYears"), value: t("type.life.valueYears") },
                ],
            },
            {
                id: "goal",
                title: t("type.goal.name"),
                description: t("type.goal.description"),
                preview: (
                    <div className="origin-center scale-[1.8]">
                        <GoalVisual layout={goalPreviewLayout} />
                    </div>
                ),
                stats: [
                    { label: t("type.goal.statTargetDate"), value: t("type.goal.valueTarget") },
                    { label: t("type.goal.statTracking"), value: t("type.goal.valueDaily") },
                ],
            },
        ],
        [t, yearStats.day, yearStats.week, yearStats.percent, goalPreviewLayout]
    )

    const visibleStyleCards = useMemo(
        () => styleCards.filter((style) => !HIDDEN_STYLE_CARD_IDS.has(style.id)),
        [styleCards]
    )

    return (
        <div className="flex min-h-0 flex-1 flex-col">
            {visibleStyleCards.map((style, index) => {
                const isSelected = selectedStyle === style.id
                const stats = style.stats

                return (
                    <article
                        key={style.id}
                        onClick={() => onStyleSelect?.(style.id)}
                        className={cn("group flex min-h-0 flex-1 cursor-pointer flex-col", index > 0 && "border-t border-kumo-line")}
                    >
                        <div
                            className={cn(
                                "mx-1.5 my-3 flex min-h-0 flex-1 flex-col rounded-lg px-4 py-4 transition-colors",
                                isSelected ? "bg-kumo-tint" : "bg-kumo-elevated group-hover:bg-kumo-tint"
                            )}
                        >
                            <div className="mb-3 flex aspect-square w-full items-center justify-center overflow-hidden rounded-lg border border-kumo-line bg-kumo-elevated">
                                {style.preview}
                            </div>

                            <div className="mb-0 min-h-[28px]">
                                <h3
                                    className={cn(
                                        "text-lg leading-tight font-semibold transition-colors",
                                        isSelected ? "text-kumo-default" : "text-kumo-strong group-hover:text-kumo-default"
                                    )}
                                >
                                    {style.title}
                                </h3>
                            </div>

                            <p className="mb-2 h-[60px] overflow-hidden text-xs leading-5 whitespace-pre-line text-kumo-subtle line-clamp-3">
                                {style.description}
                            </p>

                            <div
                                className="mt-auto grid items-center divide-x divide-kumo-line border-y border-kumo-line py-2"
                                style={{ gridTemplateColumns: `repeat(${stats.length}, minmax(0, 1fr))` }}
                            >
                                {stats.map((stat, statIndex) => (
                                    <div
                                        key={`${style.id}-stat-${stat.label}`}
                                        className={cn(
                                            "min-w-0",
                                            statIndex === 0 ? "pr-2" : statIndex === stats.length - 1 ? "pl-2" : "px-2"
                                        )}
                                    >
                                        <p className="text-lg leading-none font-medium text-kumo-default">
                                            <span>{stat.value}</span>
                                        </p>
                                        <p className="mt-0.5 text-[9px] uppercase tracking-[0.14em] text-kumo-subtle">
                                            {stat.label}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </article>
                )
            })}
        </div>
    )
}

export { HomeSidebarCards }
