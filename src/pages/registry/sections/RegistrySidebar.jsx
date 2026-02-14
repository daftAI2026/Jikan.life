/**
 * [INPUT]: 依赖 react(useMemo/useState), @cloudflare/kumo(Button/cn), @phosphor-icons/react(XIcon), KumoMenuIcon, @/lib/I18nContext, shared/wallpaper-core(computeGoalLayout)
 * [OUTPUT]: 对外提供 RegistrySidebar 受控侧边栏组件（支持 selectedStyle/onStyleChange）
 * [POS]: pages/registry/sections 的左侧导航与风格选择器，保留云 logo 交互动效与 data-sidebar-open 语义
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { useMemo, useState } from "react"
import { Button, cn } from "@cloudflare/kumo"
import { XIcon } from "@phosphor-icons/react"
import { KumoMenuIcon } from "./KumoMenuIcon"
import { useI18n } from "@/lib/I18nContext"
import { computeGoalLayout } from "../../../../shared/wallpaper-core"

// ---- Sidebar Style Feature Flags ----
// 隐藏但不删除：后续恢复只需从集合中移除对应 id。
const HIDDEN_STYLE_CARD_IDS = new Set(["life"])
const YEAR_GRID_COLUMNS = 12
const YEAR_DOT_STATE_TOKENS = {
    today: "bg-kumo-contrast",
    completed: "bg-kumo-contrast/75",
    pending: "bg-kumo-contrast/12",
}

function getYearDotState(index, filledCount) {
    const todayIndex = filledCount > 0 ? filledCount - 1 : -1
    if (index === todayIndex) return "today"
    if (index < filledCount) return "completed"
    return "pending"
}

function getDayOfYear() {
    const now = new Date()
    const start = new Date(now.getFullYear(), 0, 0)
    const diff = now.getTime() - start.getTime()
    return Math.floor(diff / (1000 * 60 * 60 * 24))
}

function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
}

function getYearStats() {
    const now = new Date()
    const day = getDayOfYear()
    const totalDays = isLeapYear(now.getFullYear()) ? 366 : 365
    const week = Math.ceil(day / 7)
    const percent = Math.round((day / totalDays) * 100)
    return { day, week, percent, totalDays }
}

function getLocalDateParts() {
    const now = new Date()
    return { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() }
}

function addDays(dateParts, days) {
    const date = new Date(dateParts.year, dateParts.month - 1, dateParts.day)
    date.setDate(date.getDate() + days)
    return { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() }
}

function YearVisual() {
    const stats = getYearStats()
    const totalDots = YEAR_GRID_COLUMNS * YEAR_GRID_COLUMNS
    const filledCount = Math.min(totalDots, Math.round((stats.day / stats.totalDays) * totalDots))

    return (
        <div
            className="grid place-items-center gap-[4px] p-4"
            style={{ gridTemplateColumns: `repeat(${YEAR_GRID_COLUMNS}, minmax(0, 1fr))` }}
        >
            {Array.from({ length: totalDots }).map((_, index) => {
                const dotState = getYearDotState(index, filledCount)
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
    const strokeWidth = 100 * 0.035
    const circumference = 2 * Math.PI * ring.radius
    const strokeDashoffset = circumference * (1 - ring.progress)

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
                    {ring.progress > 0 && (
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

function RegistrySidebar({ currentPath: _currentPath, selectedStyle = "year", onStyleChange }) {
    const { t, lang } = useI18n()
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const goalPreviewLayout = useMemo(() => {
        const today = getLocalDateParts()
        const goalDate = addDays(today, 69)
        const goalStart = addDays(today, -31)
        return computeGoalLayout({
            width: 100,
            height: 100,
            bgColor: "000000",
            accentColor: "FFFFFF",
            clockHeight: 0.22,
            lang,
            goalDate,
            goalStart,
            today
        })
    }, [lang])

    const yearStats = useMemo(() => getYearStats(), [])
    const styleCards = useMemo(
        () => [
            {
                id: "year",
                title: t("type.year.name"),
                description: t("type.year.description"),
                preview: (
                    <div className="origin-center scale-[0.84]">
                        <YearVisual />
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
                    { label: t("type.goal.statGoals"), value: "∞" },
                    { label: t("type.goal.statUpdates"), value: t("type.goal.valueDaily") },
                ],
            },
        ],
        [t, yearStats.day, yearStats.week, yearStats.percent, goalPreviewLayout]
    )
    const visibleStyleCards = useMemo(
        () => styleCards.filter((style) => !HIDDEN_STYLE_CARD_IDS.has(style.id)),
        [styleCards]
    )

    const handleStyleSelect = (styleId) => {
        onStyleChange?.(styleId)
    }

    const navContent = (
        <div className="flex h-full min-h-0 flex-col bg-kumo-elevated text-kumo-strong">
            <div className="px-1 pb-1">
                <p className="text-xs leading-4 font-semibold text-kumo-subtle">
                    {t("types.header")}
                </p>
            </div>

            <div className="flex min-h-0 flex-1 flex-col">
                {visibleStyleCards.map((style, index) => {
                    const isSelected = selectedStyle === style.id
                    const stats = style.stats

                    return (
                        <article
                            key={style.id}
                            onClick={() => handleStyleSelect(style.id)}
                            className={cn(
                                "group flex min-h-0 flex-1 cursor-pointer flex-col",
                                index > 0 && "border-t border-kumo-line"
                            )}
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
                                            isSelected
                                                ? "text-kumo-default"
                                                : "text-kumo-strong group-hover:text-kumo-default"
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
                                                statIndex === 0
                                                    ? "pr-2"
                                                    : statIndex === stats.length - 1
                                                        ? "pl-2"
                                                        : "px-2"
                                            )}
                                        >
                                            <p className="text-lg leading-none font-medium text-kumo-default">
                                                <span
                                                    className={cn(
                                                        stat.value === "∞" && "inline-block origin-center scale-[1.16]"
                                                    )}
                                                >
                                                    {stat.value}
                                                </span>
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
        </div>
    )

    return (
        <>
            <div className="fixed inset-x-0 top-0 z-50 flex h-[49px] items-center justify-between border-b border-kumo-line bg-kumo-elevated px-3 text-kumo-default md:hidden">
                <Button
                    variant="ghost"
                    shape="square"
                    aria-label={t("registry.menu.open")}
                    onClick={() => setMobileMenuOpen((v) => !v)}
                >
                    <KumoMenuIcon />
                </Button>
                <h1 className="text-base font-medium">Jikan</h1>
                <div className="size-9" />
            </div>

            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-kumo-line bg-kumo-elevated text-kumo-default md:hidden",
                    "transition-transform duration-300 will-change-transform",
                    mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="flex h-[49px] flex-none items-center justify-between border-b border-kumo-line px-3 text-kumo-default">
                    <h1 className="text-base font-medium">Jikan</h1>
                    <Button
                        variant="ghost"
                        shape="square"
                        aria-label={t("registry.menu.close")}
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        <XIcon size={20} />
                    </Button>
                </div>
                <div className="min-h-0 grow overflow-hidden px-3 py-3 text-sm">{navContent}</div>
            </aside>

            <div className="fixed inset-y-0 left-0 z-50 hidden w-12 border-r border-kumo-line bg-kumo-elevated md:block">
                <div className="relative h-[49px] border-b border-kumo-line">
                    <div className="absolute top-2 right-1">
                        <Button
                            variant="ghost"
                            shape="square"
                            aria-label={t("registry.sidebar.toggle")}
                            aria-pressed={sidebarOpen}
                            onClick={() => setSidebarOpen((v) => !v)}
                        >
                            <KumoMenuIcon />
                        </Button>
                    </div>
                </div>
            </div>

            <div className="pointer-events-none fixed top-0 left-12 z-50 hidden h-[49px] items-center px-3 font-medium text-kumo-default select-none md:flex">
                <h1 className="text-base">Jikan</h1>
            </div>

            <aside
                data-sidebar-open={sidebarOpen}
                className={cn(
                    "fixed inset-y-0 left-12 z-40 hidden w-[290px] flex-col bg-kumo-elevated text-kumo-default md:flex",
                    "transition-transform duration-300 ease-out will-change-transform",
                    sidebarOpen ? "translate-x-0 border-r border-kumo-line" : "-translate-x-full"
                )}
            >
                <div className="h-[49px] flex-none border-b border-kumo-line" />
                <div className="min-h-0 grow overflow-hidden px-3 py-3 text-sm">{navContent}</div>
            </aside>
        </>
    )
}

export { RegistrySidebar }
