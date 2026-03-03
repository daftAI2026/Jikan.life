/**
 * [INPUT]: 依赖 react(useEffect/useMemo/useState), react-router-dom, registry/sections (HomeTopbar/HomeSidebar/ThemeToggle/MobileFooter/HomeGrid), localStorage(registry.settingsAutoflow.v1), effective-layout-tier 判定器
 * [OUTPUT]: 对外提供 HomePage 页面组件（向工作区透传 effectiveLayoutTier）
 * [POS]: pages/registry 的路由入口，维护 selectedStyle（首访空态/回访默认 year）与 sidebarOpen 状态，挂载 Registry 页面级滚动治理标记并编排双栏工作区与全局工具入口
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { useEffect, useMemo, useState } from "react"
import { useLocation } from "react-router-dom"
import { HomeTopbar } from "./sections/HomeTopbar"
import { HomeSidebar } from "./sections/HomeSidebar"
import { ThemeToggle } from "./sections/ThemeToggle"
import { MobileFooter } from "./sections/MobileFooter"
import { HomeGrid } from "./sections/components/HomeGrid"
import { resolveEffectiveLayoutTier } from "./effective-layout-tier"

const AUTOFLOW_STORAGE_KEY = "registry.settingsAutoflow.v1"
const ONBOARDING_FORCE_QUERY_VALUE = "force"

function isForceOnboardingEnabled(search) {
    const params = new URLSearchParams(search)
    return params.get("onboarding") === ONBOARDING_FORCE_QUERY_VALUE
}

function HomePage() {
    const location = useLocation()
    const forceOnboarding = useMemo(() => isForceOnboardingEnabled(location.search), [location.search])
    const [selectedStyle, setSelectedStyle] = useState(null)
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const [viewportWidth, setViewportWidth] = useState(() => {
        if (typeof window === "undefined") return 0
        return window.innerWidth
    })
    const effectiveLayoutTier = resolveEffectiveLayoutTier({ viewportWidth, sidebarOpen })
    const isEffectiveLg = effectiveLayoutTier === "lg"

    useEffect(() => {
        if (!forceOnboarding) return
        setSelectedStyle(null)
    }, [forceOnboarding])

    useEffect(() => {
        if (forceOnboarding) return
        if (typeof window === "undefined") return
        if (selectedStyle !== null) return

        const hasSeenAutoflow = window.localStorage.getItem(AUTOFLOW_STORAGE_KEY) === "1"
        if (hasSeenAutoflow) {
            setSelectedStyle("year")
        }
    }, [forceOnboarding, selectedStyle])

    useEffect(() => {
        const root = document.documentElement
        root.setAttribute("data-registry-page", "true")

        return () => {
            root.removeAttribute("data-registry-page")
            root.removeAttribute("data-registry-blocking")
        }
    }, [])

    useEffect(() => {
        if (typeof window === "undefined") return undefined

        const handleResize = () => {
            setViewportWidth(window.innerWidth)
        }

        handleResize()
        window.addEventListener("resize", handleResize)
        return () => {
            window.removeEventListener("resize", handleResize)
        }
    }, [])

    return (
        <div className="isolate">
            <HomeSidebar
                currentPath={location.pathname}
                selectedStyle={selectedStyle}
                onStyleChange={setSelectedStyle}
                sidebarOpen={sidebarOpen}
                onSidebarOpenChange={setSidebarOpen}
            />

            <div className="pointer-events-auto fixed top-0 right-0 z-50 hidden h-[var(--registry-topbar-height)] w-[var(--registry-tools-rail-width)] place-items-center md:grid">
                <ThemeToggle />
            </div>

            <MobileFooter />

            <div
                id="main-content"
                className={[
                    "main-content registry-main-content-mobile-height mt-[var(--registry-topbar-height)] overflow-hidden transition-[margin] duration-300 md:mt-0 md:h-screen md:ml-[var(--registry-rail-width)] md:overflow-y-auto md:overscroll-y-none",
                    isEffectiveLg ? "md:overflow-y-hidden" : "",
                ].join(" ")}
            >
                <div className={["flex h-full flex-col md:h-auto", isEffectiveLg ? "md:h-full" : ""].join(" ")}>
                    <HomeTopbar hideLanguage={!sidebarOpen} />
                    <main className="flex min-h-0 grow flex-col md:pr-12">
                        <div
                            className={[
                                "mx-auto h-full w-full grow overflow-hidden border-r border-kumo-line md:h-auto",
                                isEffectiveLg ? "md:h-full" : "",
                            ].join(" ")}
                        >
                            <HomeGrid
                                selectedStyle={selectedStyle}
                                forceOnboarding={forceOnboarding}
                                effectiveLayoutTier={effectiveLayoutTier}
                            />
                        </div>
                    </main>
                </div>
            </div>
        </div>
    )
}

export default HomePage
