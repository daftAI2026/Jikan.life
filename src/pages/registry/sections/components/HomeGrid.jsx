/**
 * [INPUT]: 依赖 react(useEffect/useState), @/components/ui/kumo(useKumoToastManager), workspace/useHomeWallpaperConfig, HomePreviewPane, HomeSettingsPane, SetupGuidePanel
 * [OUTPUT]: 对外提供 HomeGrid 组件（preview|settings 双栏工作区 + Set-it 流程状态上提 + md 全区 Guide 宿主）
 * [POS]: registry/components 的主页工作区编排层，承接 selectedStyle 并统一驱动预览、配置与 Set-it 引导链路
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { useEffect, useState } from "react"
import { useKumoToastManager } from "@/components/ui/kumo"
import { HomePreviewPane } from "../workspace/HomePreviewPane"
import { HomeSettingsPane } from "../workspace/HomeSettingsPane"
import { SetupGuidePanel } from "../workspace/SetupGuidePanel"
import { useHomeWallpaperConfig } from "../workspace/useHomeWallpaperConfig"

const SETUP_FLOW_TYPES = new Set(["year", "goal"])

function HomeGrid({ selectedStyle }) {
    const viewModel = useHomeWallpaperConfig({ selectedStyle })
    const toastManager = useKumoToastManager()
    const [isSetupPanelOpen, setIsSetupPanelOpen] = useState(false)
    const [setupPlatform, setSetupPlatform] = useState("ios")

    useEffect(() => {
        if (!SETUP_FLOW_TYPES.has(viewModel.config.selectedType)) {
            setIsSetupPanelOpen(false)
        }
    }, [viewModel.config.selectedType])

    const handleSetIt = async () => {
        const ok = await viewModel.actions.copyUrl()
        if (!ok) return
        toastManager.add({ description: viewModel.t("url.copySuccess"), timeout: 3000 })
        setSetupPlatform(viewModel.selectedDevice.category === "Android" ? "android" : "ios")
        setIsSetupPanelOpen(true)
    }

    const handleCloseSetupPanel = () => {
        setIsSetupPanelOpen(false)
    }

    return (
        <div
            data-registry-workspace
            className="relative grid h-full min-h-0 grid-cols-1 overflow-x-hidden overflow-y-auto md:h-auto md:overflow-y-visible bg-kumo-elevated lg:h-full lg:grid-cols-2 lg:divide-x lg:divide-kumo-line lg:overflow-hidden"
        >
            <div className="pointer-events-none fixed top-[49px] right-[49px] bottom-0 left-12 z-40 hidden md:block lg:hidden">
                <SetupGuidePanel
                    open={isSetupPanelOpen}
                    platform={setupPlatform}
                    onClose={handleCloseSetupPanel}
                    t={viewModel.t}
                    url={viewModel.url}
                    containerClassName="overflow-x-hidden"
                    asideClassName="md:w-full md:border-l-0"
                />
            </div>

            <section
                data-registry-pane="preview"
                className="border-b border-kumo-line lg:min-h-0 lg:border-b-0"
            >
                <HomePreviewPane
                    config={viewModel.config}
                    selectedDevice={viewModel.selectedDevice}
                    t={viewModel.t}
                />
            </section>

            <section data-registry-pane="settings" className="lg:min-h-0">
                <HomeSettingsPane
                    t={viewModel.t}
                    config={viewModel.config}
                    selectedDevice={viewModel.selectedDevice}
                    palettePresets={viewModel.palettePresets}
                    countryOptions={viewModel.countryOptions}
                    languageOptions={viewModel.languageOptions}
                    deviceOptions={viewModel.deviceOptions}
                    url={viewModel.url}
                    actions={viewModel.actions}
                    onSetIt={handleSetIt}
                    isSetupPanelOpen={isSetupPanelOpen}
                    setupPlatform={setupPlatform}
                    onCloseSetupPanel={handleCloseSetupPanel}
                />
            </section>
        </div>
    )
}

export { HomeGrid }
