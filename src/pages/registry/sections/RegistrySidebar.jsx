/**
 * [INPUT]: 依赖 react(useMemo/useState), @cloudflare/kumo(Button/cn), @phosphor-icons/react(XIcon), KumoMenuIcon
 * [OUTPUT]: 对外提供 RegistrySidebar 受控侧边栏组件（支持 selectedStyle/onStyleChange）
 * [POS]: pages/registry/sections 的左侧导航与风格选择器，保留云 logo 交互动效与 data-sidebar-open 语义
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { useMemo, useState } from "react"
import { Button, cn } from "@cloudflare/kumo"
import { XIcon } from "@phosphor-icons/react"
import { KumoMenuIcon } from "./KumoMenuIcon"

const STYLE_CARDS = [
    {
        id: "year",
        title: "Year Progress",
        description: "Every day of the year as a grid. Watch your year fill up, one square at a time.",
    },
    {
        id: "life",
        title: "Life Calendar",
        description: "Every week of your life as a dot. A powerful reminder to make each week count.",
    },
    {
        id: "goal",
        title: "Goal Countdown",
        description: "Count down to what matters. Big launch, vacation, or life milestone.",
    },
]

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
    return { day, week, percent }
}

function YearVisual() {
    const stats = getYearStats()
    const filledCount = Math.floor(stats.day / 8)
    const totalDots = 36

    return (
        <div className="grid grid-cols-[repeat(12,1fr)] place-items-center gap-[4px] p-4">
            {Array.from({ length: totalDots }).map((_, index) => (
                <div
                    key={`year-dot-${index}`}
                    className={cn(
                        "h-[10px] w-[10px] rounded-full transition-colors duration-500",
                        index < filledCount ? "bg-kumo-contrast" : "bg-kumo-fill"
                    )}
                />
            ))}
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

function GoalVisual() {
    return (
        <div className="flex h-full items-center justify-center">
            <div className="relative h-[100px] w-[100px]">
                <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                    <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="4"
                        className="text-kumo-fill"
                    />
                    <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeDasharray="283"
                        strokeDashoffset="100"
                        className="text-kumo-contrast transition-all duration-1000 ease-out"
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="font-mono text-2xl leading-none font-bold text-kumo-contrast">42</span>
                    <span className="mt-1 text-[10px] uppercase tracking-wider text-kumo-subtle">DAY</span>
                </div>
            </div>
        </div>
    )
}

function RegistrySidebar({ currentPath: _currentPath, selectedStyle = "year", onStyleChange }) {
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    const yearStats = useMemo(() => getYearStats(), [])
    const cardStats = useMemo(
        () => ({
            year: [
                { label: "DAY", value: String(yearStats.day) },
                { label: "WEEK", value: String(yearStats.week) },
                { label: "COMPLETE", value: `${yearStats.percent}%` },
            ],
            life: [
                { label: "TOTAL WEEKS", value: "4,160" },
                { label: "YEARS", value: "80" },
            ],
            goal: [
                { label: "GOALS", value: "∞" },
                { label: "UPDATES", value: "Daily" },
            ],
        }),
        [yearStats.day, yearStats.week, yearStats.percent]
    )

    const handleStyleSelect = (styleId) => {
        onStyleChange?.(styleId)
    }

    const navContent = (
        <div className="flex h-full min-h-0 flex-col bg-kumo-elevated text-kumo-strong">
            <div className="px-1 pb-2">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-kumo-subtle">
                    Choose Your Style
                </p>
            </div>

            <div className="flex min-h-0 flex-1 flex-col">
                {STYLE_CARDS.map((style, index) => {
                    const isSelected = selectedStyle === style.id
                    const stats = cardStats[style.id]

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
                                <div className="mb-3 flex h-[84px] items-center justify-center overflow-hidden rounded-lg border border-kumo-line bg-kumo-elevated">
                                    {style.id === "year" && (
                                        <div className="origin-center scale-[0.84]">
                                            <YearVisual />
                                        </div>
                                    )}
                                    {style.id === "life" && (
                                        <div className="origin-center scale-[1]">
                                            <LifeVisual />
                                        </div>
                                    )}
                                    {style.id === "goal" && (
                                        <div className="origin-center scale-[0.8]">
                                            <GoalVisual />
                                        </div>
                                    )}
                                </div>

                                <div className="mb-1">
                                    <h3
                                        className={cn(
                                            "text-base leading-tight font-semibold transition-colors",
                                            isSelected
                                                ? "text-kumo-default"
                                                : "text-kumo-strong group-hover:text-kumo-default"
                                        )}
                                    >
                                        {style.title}
                                    </h3>
                                </div>

                                <p className="mb-2 text-xs leading-5 text-kumo-subtle">{style.description}</p>

                                <div
                                    className="grid items-center divide-x divide-kumo-line border-y border-kumo-line py-2"
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
                                            <p className="font-mono text-lg leading-none text-kumo-default">
                                                {stat.value}
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
            <div className="fixed inset-x-0 top-0 z-50 flex h-[49px] items-center justify-between border-b border-kumo-line bg-kumo-elevated px-3 md:hidden">
                <Button
                    variant="ghost"
                    shape="square"
                    aria-label="Open menu"
                    onClick={() => setMobileMenuOpen((v) => !v)}
                >
                    <KumoMenuIcon />
                </Button>
                <h1 className="text-base font-medium">Jikan</h1>
                <div className="size-9" />
            </div>

            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-kumo-line bg-kumo-elevated md:hidden",
                    "transition-transform duration-300 will-change-transform",
                    mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="flex h-[49px] flex-none items-center justify-between border-b border-kumo-line px-3">
                    <h1 className="text-base font-medium">Jikan</h1>
                    <Button
                        variant="ghost"
                        shape="square"
                        aria-label="Close menu"
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
                            aria-label="Toggle sidebar"
                            aria-pressed={sidebarOpen}
                            onClick={() => setSidebarOpen((v) => !v)}
                        >
                            <KumoMenuIcon />
                        </Button>
                    </div>
                </div>
            </div>

            <div className="pointer-events-none fixed top-0 left-12 z-50 hidden h-[49px] items-center px-3 font-medium select-none md:flex">
                <h1 className="text-base">Jikan</h1>
            </div>

            <aside
                data-sidebar-open={sidebarOpen}
                className={cn(
                    "fixed inset-y-0 left-12 z-40 hidden w-64 flex-col bg-kumo-elevated md:flex",
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
