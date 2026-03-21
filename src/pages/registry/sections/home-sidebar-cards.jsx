/**
 * [INPUT]: 依赖 react(useMemo), @/components/ui/kumo(Tabs), @/lib/utils(cn), MobileFooter, home-sidebar-visuals 预览组件、home-sidebar-style-cards 纯 helper、home-sidebar-date-stats 的 Year 统计文案 helper、home-sidebar-mixed-text 的日文混排分段 helper 与 i18n/date 视图数据
 * [OUTPUT]: 对外提供 HomeSidebarCards（桌面多卡列表 + 移动 segmented 单卡查看器）
 * [POS]: registry/sections 的 HomeSidebar 卡片层，封装 year/life/goal 卡片字典、可见卡过滤与移动/桌面双布局渲染细节；移动端 tabs 只负责查看卡片，不直接提交 selectedStyle
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { useMemo } from "react"
import { Tabs } from "@/components/ui/kumo"
import { cn } from "@/lib/utils"
import { GoalVisual, LifeVisual, YearVisual } from "./home-sidebar-visuals"
import { resolveSidebarActiveStyleId, resolveVisibleStyleCards } from "./home-sidebar-style-cards"
import { getGoalSidebarStats, getYearSidebarStats } from "./home-sidebar-date-stats"
import { splitSidebarMixedTextRuns } from "./home-sidebar-mixed-text"
import { MobileFooter } from "./MobileFooter"

const JAPANESE_MIXED_TEXT_FONT_FAMILY = '"Noto Sans JP", "Inter", ui-sans-serif, system-ui, sans-serif'

function renderMixedSidebarText(text, lang) {
    const runs = splitSidebarMixedTextRuns(text, lang)

    if (runs.length <= 1) return text

    return runs.map((run, index) => (
        <span
            key={`${run.kind}-${index}-${run.text}`}
            style={run.kind === "ja" ? { fontFamily: JAPANESE_MIXED_TEXT_FONT_FAMILY } : undefined}
        >
            {run.text}
        </span>
    ))
}

function StyleCard({ isSelected, layoutMode, onSelect, style }) {
    const stats = style.stats
    const isMobileSegmented = layoutMode === "mobile-segmented"
    const hasInlineStatsLayout = stats.every((stat) => Boolean(stat.inlineText))
    const titleToneClass = isSelected ? "text-kumo-default" : "text-kumo-strong group-hover:text-kumo-default"

    return (
        <article
            onClick={onSelect}
            className={cn(
                "group flex cursor-pointer flex-col",
                isMobileSegmented ? "h-full min-h-0 flex-1" : "min-h-0 flex-1",
                !isMobileSegmented && style.showDivider ? "border-t border-kumo-line" : null
            )}
        >
            <div
                className={cn(
                    "mx-1.5 my-3 flex flex-col rounded-lg px-4 py-4 transition-colors",
                    isMobileSegmented ? "min-h-0 flex-1" : "min-h-0 flex-1",
                    isSelected ? "bg-kumo-tint" : "bg-kumo-elevated group-hover:bg-kumo-tint"
                )}
            >
                <div
                    className={cn(
                        "mb-3 flex w-full shrink-0 items-center justify-center overflow-hidden rounded-lg border border-kumo-line bg-kumo-elevated",
                        isMobileSegmented ? "min-h-0 flex-1" : "aspect-square"
                    )}
                >
                    {style.preview}
                </div>

                <div className="mb-0 flex min-h-[28px] items-start justify-between gap-3">
                    <h3
                        className={cn(
                            "min-w-0 text-lg leading-tight font-semibold transition-colors",
                            titleToneClass
                        )}
                    >
                        {style.title}
                    </h3>
                </div>

                <p
                    className={cn(
                        "overflow-hidden text-xs leading-5 whitespace-pre-line text-kumo-subtle",
                        isMobileSegmented ? "mb-3 min-h-[40px] line-clamp-2" : "mb-2 h-[60px] line-clamp-3"
                    )}
                >
                    {style.description}
                </p>

                <div
                    className={cn(
                        "mt-auto grid items-center py-2",
                        hasInlineStatsLayout ? "border-b border-kumo-line" : "border-y border-kumo-line",
                        hasInlineStatsLayout ? null : "divide-x divide-kumo-line"
                    )}
                    style={{ gridTemplateColumns: `repeat(${stats.length}, minmax(0, 1fr))` }}
                >
                    {stats.map((stat, statIndex) => (
                        <div
                            key={`${style.id}-stat-${stat.label}`}
                            className={cn(
                                "min-w-0",
                                statIndex === 0 ? "pr-2" : statIndex === stats.length - 1 ? "pl-2" : "px-2",
                                stat.inlineAlign === "end" ? "text-right" : null
                            )}
                        >
                            {stat.inlineText ? (
                                <div className="relative">
                                    <div aria-hidden="true" className="invisible">
                                        <p className="text-lg leading-none font-medium text-kumo-default">
                                            <span>{stat.value}</span>
                                        </p>
                                        <p className="mt-0.5 text-[9px] uppercase tracking-[0.14em] text-kumo-subtle">
                                            {stat.label}
                                        </p>
                                    </div>
                                    <div
                                            className={cn(
                                                "absolute inset-0 flex items-center",
                                                stat.inlineAlign === "end" ? "justify-end" : null
                                            )}
                                        >
                                        <p
                                            className={cn(
                                                "text-lg leading-none font-medium whitespace-nowrap transition-colors",
                                                titleToneClass
                                            )}
                                        >
                                            {stat.inlineText}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <p className="text-lg leading-none font-medium text-kumo-default">
                                        <span>{stat.value}</span>
                                    </p>
                                    <p className="mt-0.5 text-[9px] uppercase tracking-[0.14em] text-kumo-subtle">
                                        {stat.label}
                                    </p>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </article>
    )
}

function HomeSidebarCards({
    layoutMode = "desktop-list",
    selectedStyle,
    viewedStyle,
    onStyleSelect,
    onViewedStyleChange,
    yearStats,
    goalPreviewLayout,
    lang,
    t,
}) {
    const styleCards = useMemo(
        () => [
            {
                id: "year",
                title: renderMixedSidebarText(t("type.year.name", { year: String(yearStats.year) }), lang),
                description: t("type.year.description"),
                preview: (
                    <div className="origin-center scale-[1]">
                        <YearVisual percent={yearStats.percent} />
                    </div>
                ),
                stats: getYearSidebarStats({
                    yearStats,
                    copy: {
                        statDay: t("type.year.statDay"),
                        statComplete: t("type.year.statComplete"),
                        inlineDay: renderMixedSidebarText(t("type.year.inlineDay", { n: String(yearStats.day) }), lang),
                        inlineComplete: renderMixedSidebarText(t("type.year.inlineComplete", { n: `${yearStats.percent}%` }), lang),
                    },
                }),
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
                stats: getGoalSidebarStats({
                    copy: {
                        statTargetDate: t("type.goal.statTargetDate"),
                        statTracking: t("type.goal.statTracking"),
                        inlineTarget: t("type.goal.inlineTarget"),
                        inlineTracking: t("type.goal.inlineTracking"),
                    },
                    values: {
                        target: t("type.goal.valueTarget"),
                        daily: t("type.goal.valueDaily"),
                    },
                }),
            },
        ],
        [goalPreviewLayout, lang, t, yearStats]
    )

    const visibleStyleCards = useMemo(() => resolveVisibleStyleCards(styleCards), [styleCards])
    const viewerStyleId = layoutMode === "mobile-segmented" ? viewedStyle : selectedStyle
    const activeStyleId = resolveSidebarActiveStyleId(viewerStyleId, visibleStyleCards)
    const activeStyle = visibleStyleCards.find((style) => style.id === activeStyleId) ?? null

    if (layoutMode === "mobile-segmented") {
        return (
            <div className="flex min-h-0 flex-1 flex-col">
                <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
                    {activeStyle ? (
                        <StyleCard
                            isSelected={selectedStyle === activeStyle.id}
                            layoutMode={layoutMode}
                            onSelect={() => onStyleSelect?.(activeStyle.id)}
                            style={activeStyle}
                        />
                    ) : null}
                </div>
                <div className="-mx-3 flex items-center overflow-hidden bg-kumo-elevated" style={{ height: "calc(var(--registry-topbar-height) + 0.75rem)" }}>
                    <div className="flex h-[var(--registry-topbar-height)] w-full items-center px-3">
                        <div className="w-full px-1.5">
                            <Tabs
                                className="w-full"
                                listClassName="w-full"
                                variant="segmented"
                                tabs={visibleStyleCards.map((style) => ({
                                    value: style.id,
                                    label: <span className="block min-w-0 truncate text-center whitespace-nowrap">{style.title}</span>,
                                    className: "min-w-0 basis-0 flex-1 justify-center",
                                }))}
                                value={activeStyleId}
                                onValueChange={onViewedStyleChange}
                            />
                        </div>
                    </div>
                </div>
                <MobileFooter fixed={false} className="-mx-3" />
            </div>
        )
    }

    return (
        <div className="flex min-h-0 flex-1 flex-col">
            {visibleStyleCards.map((style, index) => {
                const isSelected = selectedStyle === style.id

                return (
                    <StyleCard
                        key={style.id}
                        isSelected={isSelected}
                        layoutMode={layoutMode}
                        onSelect={() => onStyleSelect?.(style.id)}
                        style={{ ...style, showDivider: index > 0 }}
                    />
                )
            })}
        </div>
    )
}

export { HomeSidebarCards }
