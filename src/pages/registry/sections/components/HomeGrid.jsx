/**
 * [INPUT]: 依赖 react(useCallback/useEffect/useRef/useState), @/components/ui/kumo(useKumoToastManager), sections/useRegistryBlockingScrollLock, workspace/useHomeWallpaperConfig, HomePreviewPane, HomeSettingsPane, SetupGuidePanel, effective-layout-tier 的桌面壳/segmented helper，以及 effectiveLayoutTier/sidebarOpen
 * [OUTPUT]: 对外提供 HomeGrid 组件（preview|settings 工作区 + Set-it 流程状态上提 + 首次 AutoFlow stage 管理 + onboarding=force 测试覆盖；mobile 与 `md + 抽屉打开` 共用 segmented workspace，mobile guide 宿主覆盖 header 以下整块内容）
 * [POS]: registry/components 的主页工作区编排层，承接 selectedStyle/forceOnboarding/effectiveLayoutTier/sidebarOpen 并统一驱动预览、配置、AutoFlow 与 Set-it 引导链路（Guide 打开时锁背景滚动；segmented workspace 的壳层判定在此收口，空态也直接进入该模式）
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { useCallback, useEffect, useRef, useState } from "react"
import { useKumoToastManager } from "@/components/ui/kumo"
import { shouldUseDesktopWorkspaceShell, shouldUseSegmentedWorkspace } from "../../effective-layout-tier"
import { useRegistryBlockingScrollLock } from "../useRegistryBlockingScrollLock"
import { HomePreviewPane } from "../workspace/HomePreviewPane"
import { HomeSettingsPane } from "../workspace/HomeSettingsPane"
import { SetupGuidePanel } from "../workspace/SetupGuidePanel"
import { useHomeWallpaperConfig } from "../workspace/useHomeWallpaperConfig"

const SETUP_FLOW_TYPES = new Set(["year", "goal"])
const AUTOFLOW_INTERVAL_MS = 500
const AUTOFLOW_STORAGE_KEY = "registry.settingsAutoflow.v1"

function resolveMaxRevealStage(selectedType) {
    if (!selectedType) return 0
    if (selectedType === "year") return 5
    return 6
}

function HomeGrid({
    selectedStyle,
    forceOnboarding = false,
    effectiveLayoutTier = "lg",
    sidebarOpen = false,
}) {
    const viewModel = useHomeWallpaperConfig({ selectedStyle })
    const toastManager = useKumoToastManager()
    const isDesktopShell = shouldUseDesktopWorkspaceShell({ effectiveLayoutTier, sidebarOpen })
    const useSegmentedWorkspaceLayout = shouldUseSegmentedWorkspace({ effectiveLayoutTier, sidebarOpen })
    const paneEffectiveLayoutTier = effectiveLayoutTier === "md" && !sidebarOpen ? "mid" : effectiveLayoutTier
    const segmentedWorkspaceLayoutClassName = effectiveLayoutTier === "mobile"
        ? "h-full grid-rows-[auto_minmax(0,1fr)] overflow-y-hidden"
        : "md:h-[calc(100vh-var(--registry-topbar-height))] md:grid-rows-[auto_minmax(0,1fr)] md:overflow-hidden"
    const workspaceLayoutClassName = useSegmentedWorkspaceLayout
        ? segmentedWorkspaceLayoutClassName
        : isDesktopShell
            ? "md:h-full md:grid-cols-2 md:divide-x md:divide-kumo-line md:overflow-hidden"
            : "overflow-y-auto overscroll-y-contain md:h-auto md:overflow-y-visible md:overscroll-y-auto"
    const shouldRenderGridGuideHost = effectiveLayoutTier === "md" && sidebarOpen
    const shouldRenderMobileGuideHost = effectiveLayoutTier === "mobile"
    const shouldRenderPaneGuideHost = !shouldRenderGridGuideHost && !shouldRenderMobileGuideHost
    const guideHostClassName = [
        "pointer-events-none fixed top-[var(--registry-topbar-height)] right-[var(--registry-tools-rail-width)] bottom-0 z-40 hidden md:block",
        sidebarOpen
            ? "left-[calc(var(--registry-rail-width)+var(--registry-sidebar-panel-width))]"
            : "left-[var(--registry-rail-width)]",
        isDesktopShell ? "md:hidden" : "",
    ].join(" ")
    const [isSetupPanelOpen, setIsSetupPanelOpen] = useState(false)
    const [setupPlatform, setSetupPlatform] = useState("ios")
    const setupTriggerRef = useRef(null)
    const [revealStage, setRevealStage] = useState(0)
    const [hasSeenAutoflow, setHasSeenAutoflow] = useState(() => {
        if (typeof window === "undefined") return false
        return window.localStorage.getItem(AUTOFLOW_STORAGE_KEY) === "1"
    })

    useRegistryBlockingScrollLock(isSetupPanelOpen)

    const markAutoflowSeen = useCallback(() => {
        if (forceOnboarding) return
        if (hasSeenAutoflow) return
        setHasSeenAutoflow(true)
        if (typeof window !== "undefined") {
            window.localStorage.setItem(AUTOFLOW_STORAGE_KEY, "1")
        }
    }, [forceOnboarding, hasSeenAutoflow])

    useEffect(() => {
        if (!SETUP_FLOW_TYPES.has(viewModel.config.selectedType)) {
            setIsSetupPanelOpen(false)
        }
    }, [viewModel.config.selectedType])

    useEffect(() => {
        const maxStage = resolveMaxRevealStage(viewModel.config.selectedType)
        const shouldSkipAutoflow = hasSeenAutoflow && !forceOnboarding
        if (!maxStage) {
            setRevealStage(0)
            return
        }

        if (shouldSkipAutoflow) {
            setRevealStage(maxStage)
            return
        }

        // Keep preview ready first, then unlock card #1 on first tick.
        setRevealStage(0)
        let currentStage = 0
        const timerId = window.setInterval(() => {
            currentStage += 1
            if (currentStage >= maxStage) {
                setRevealStage(maxStage)
                markAutoflowSeen()
                window.clearInterval(timerId)
                return
            }
            setRevealStage(currentStage)
        }, AUTOFLOW_INTERVAL_MS)

        return () => window.clearInterval(timerId)
    }, [forceOnboarding, hasSeenAutoflow, markAutoflowSeen, viewModel.config.selectedType])

    const handleSetIt = async (triggerElement) => {
        const ok = await viewModel.actions.copyUrl()
        if (!ok) return
        setupTriggerRef.current = triggerElement ?? null
        toastManager.add({ description: viewModel.t("url.copySuccess"), timeout: 3000 })
        setSetupPlatform(viewModel.selectedDevice.category === "Android" ? "android" : "ios")
        setIsSetupPanelOpen(true)
    }

    const handleCloseSetupPanel = () => {
        setIsSetupPanelOpen(false)
        if (!setupTriggerRef.current) return
        window.requestAnimationFrame(() => {
            setupTriggerRef.current?.focus?.({ preventScroll: true })
        })
    }

    const handleRevealAll = useCallback(() => {
        const maxStage = resolveMaxRevealStage(viewModel.config.selectedType)
        if (!maxStage) return
        setRevealStage(maxStage)
        markAutoflowSeen()
    }, [markAutoflowSeen, viewModel.config.selectedType])

    return (
        <div
            data-registry-workspace
            className={[
                "relative grid h-full min-h-0 grid-cols-1 overflow-x-hidden bg-kumo-elevated",
                workspaceLayoutClassName,
            ].join(" ")}
        >
            {shouldRenderGridGuideHost ? (
                <div className={guideHostClassName}>
                    <SetupGuidePanel
                        open={isSetupPanelOpen}
                        platform={setupPlatform}
                        onClose={handleCloseSetupPanel}
                        t={viewModel.t}
                        url={viewModel.url}
                        containerClassName="overflow-hidden overscroll-none"
                        asideClassName="md:w-full md:border-l-0 md:border-r"
                    />
                </div>
            ) : null}
            {shouldRenderMobileGuideHost ? (
                <div className="pointer-events-none absolute inset-0 z-40 md:hidden">
                    <SetupGuidePanel
                        open={isSetupPanelOpen}
                        platform={setupPlatform}
                        onClose={handleCloseSetupPanel}
                        t={viewModel.t}
                        url={viewModel.url}
                        containerClassName="overflow-hidden overscroll-none"
                    />
                </div>
            ) : null}

            <section
                data-registry-pane="preview"
                className={[
                    "border-b border-kumo-line",
                    isDesktopShell ? "md:min-h-0 md:border-b-0" : "",
                ].join(" ")}
            >
                <HomePreviewPane
                    config={viewModel.config}
                    selectedDevice={viewModel.selectedDevice}
                    t={viewModel.t}
                />
            </section>

            <section
                data-registry-pane="settings"
                className={useSegmentedWorkspaceLayout ? "min-h-0" : isDesktopShell ? "md:min-h-0" : ""}
            >
                <HomeSettingsPane
                    t={viewModel.t}
                    config={viewModel.config}
                    selectedDevice={viewModel.selectedDevice}
                    palettePresets={viewModel.palettePresets}
                    countryOptions={viewModel.countryOptions}
                    languageOptions={viewModel.languageOptions}
                    url={viewModel.url}
                    actions={viewModel.actions}
                    onSetIt={handleSetIt}
                    isSetupPanelOpen={isSetupPanelOpen}
                    setupPlatform={setupPlatform}
                    onCloseSetupPanel={handleCloseSetupPanel}
                    revealStage={revealStage}
                    onRequestRevealAll={handleRevealAll}
                    effectiveLayoutTier={paneEffectiveLayoutTier}
                    useSegmentedWorkspaceLayout={useSegmentedWorkspaceLayout}
                    shouldRenderPaneGuideHost={shouldRenderPaneGuideHost}
                />
            </section>
        </div>
    )
}

export { HomeGrid }
