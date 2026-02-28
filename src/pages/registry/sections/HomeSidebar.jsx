/**
 * [INPUT]: 依赖 react(useEffect/useMemo/useState) 与浏览器定时器(setTimeout), @/components/ui/kumo(Button), @phosphor-icons/react(XIcon), @/lib/utils(cn), @/lib/date-utils(getLocalDateKey), JikanMenuIcon, @/lib/I18nContext, useRegistryBlockingScrollLock, home-sidebar-date-stats, home-sidebar-cards
 * [OUTPUT]: 对外提供 HomeSidebar 侧边栏组件（支持 selectedStyle/onStyleChange 与 sidebarOpen/onSidebarOpenChange），Year 预览输出 10x10 点阵并在本地午夜自动刷新
 * [POS]: pages/registry/sections 的侧栏布局容器层，保留云 logo 交互动效与 data-sidebar-open 语义，承载 Year 预览日切刷新与移动抽屉滚动锁；卡片渲染细节委托 home-sidebar-cards
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/kumo"
import { XIcon } from "@phosphor-icons/react"
import { getLocalDateKey } from "@/lib/date-utils"
import { cn } from "@/lib/utils"
import { JikanMenuIcon } from "./JikanMenuIcon"
import { getGoalPreviewLayout, getYearStats } from "./home-sidebar-date-stats"
import { HomeSidebarCards } from "./home-sidebar-cards"
import { useI18n } from "@/lib/I18nContext"
import { useRegistryBlockingScrollLock } from "./useRegistryBlockingScrollLock"

function HomeSidebar({
    currentPath: _currentPath,
    selectedStyle = "year",
    onStyleChange,
    sidebarOpen,
    onSidebarOpenChange,
}) {
    const { t, lang } = useI18n()
    const [internalSidebarOpen, setInternalSidebarOpen] = useState(true)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [todayKey, setTodayKey] = useState(() => getLocalDateKey())
    const isSidebarOpen = typeof sidebarOpen === "boolean" ? sidebarOpen : internalSidebarOpen

    useRegistryBlockingScrollLock(mobileMenuOpen)

    const handleSidebarToggle = () => {
        const nextOpen = !isSidebarOpen
        if (typeof onSidebarOpenChange === "function") {
            onSidebarOpenChange(nextOpen)
            return
        }
        setInternalSidebarOpen(nextOpen)
    }

    const goalPreviewLayout = useMemo(() => getGoalPreviewLayout(lang), [lang])

    useEffect(() => {
        let timeoutId

        const scheduleNextTick = () => {
            const now = new Date()
            const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
            const delay = Math.max(1000, nextMidnight.getTime() - now.getTime())
            timeoutId = setTimeout(() => {
                setTodayKey(getLocalDateKey())
                scheduleNextTick()
            }, delay)
        }

        scheduleNextTick()
        return () => clearTimeout(timeoutId)
    }, [])

    useEffect(() => {
        if (typeof window === "undefined") return

        const mediaQuery = window.matchMedia("(min-width: 768px)")
        const handleBreakpoint = (event) => {
            if (event.matches) setMobileMenuOpen(false)
        }

        if (mediaQuery.matches) setMobileMenuOpen(false)

        if (typeof mediaQuery.addEventListener === "function") {
            mediaQuery.addEventListener("change", handleBreakpoint)
            return () => mediaQuery.removeEventListener("change", handleBreakpoint)
        }

        mediaQuery.addListener(handleBreakpoint)
        return () => mediaQuery.removeListener(handleBreakpoint)
    }, [])

    const yearStats = useMemo(() => getYearStats(), [todayKey])

    const handleStyleSelect = (styleId) => {
        onStyleChange?.(styleId)
    }

    const navContent = (
        <div className="flex h-full min-h-0 flex-col bg-kumo-elevated text-kumo-strong">
            <div className="flex h-5 items-center px-1">
                <p className="text-base leading-4 font-medium text-kumo-subtle">
                    {t("types.header")}
                </p>
            </div>
            <HomeSidebarCards
                selectedStyle={selectedStyle}
                onStyleSelect={handleStyleSelect}
                yearStats={yearStats}
                goalPreviewLayout={goalPreviewLayout}
                t={t}
            />
        </div>
    )

    return (
        <>
            <div className="fixed inset-x-0 top-0 z-50 flex h-[var(--registry-topbar-height)] items-center justify-between border-b border-kumo-line bg-kumo-elevated px-3 text-kumo-default md:hidden">
                <Button
                    variant="ghost"
                    shape="square"
                    aria-label={t("registry.menu.open")}
                    onClick={() => setMobileMenuOpen((v) => !v)}
                >
                    <JikanMenuIcon />
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
                <div className="flex h-[var(--registry-topbar-height)] flex-none items-center justify-between border-b border-kumo-line px-3 text-kumo-default">
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

            <div className="fixed inset-y-0 left-0 z-50 hidden w-[var(--registry-rail-width)] border-r border-kumo-line bg-kumo-elevated md:block">
                <div className="relative h-[var(--registry-topbar-height)] border-b border-kumo-line">
                    <div className="absolute inset-0 grid place-items-center">
                        <Button
                            variant="ghost"
                            shape="square"
                            aria-label={t("registry.sidebar.toggle")}
                            aria-pressed={isSidebarOpen}
                            onClick={handleSidebarToggle}
                        >
                            <JikanMenuIcon />
                        </Button>
                    </div>
                </div>
            </div>

            <div className="pointer-events-none fixed top-0 left-[var(--registry-rail-width)] z-50 hidden h-[var(--registry-topbar-height)] items-center px-3 font-medium text-kumo-default select-none md:flex">
                <h1 className="text-base">Jikan</h1>
            </div>

            <aside
                data-sidebar-open={isSidebarOpen}
                className={cn(
                    "fixed inset-y-0 left-[var(--registry-rail-width)] z-40 hidden w-[var(--registry-sidebar-panel-width)] flex-col bg-kumo-elevated text-kumo-default md:flex",
                    "transition-transform duration-300 ease-out will-change-transform",
                    isSidebarOpen ? "translate-x-0 border-r border-kumo-line" : "-translate-x-full"
                )}
            >
                <div className="h-[var(--registry-topbar-height)] flex-none border-b border-kumo-line" />
                <div className="min-h-0 grow overflow-hidden px-3 py-3 text-sm">{navContent}</div>
            </aside>
        </>
    )
}

export { HomeSidebar }
