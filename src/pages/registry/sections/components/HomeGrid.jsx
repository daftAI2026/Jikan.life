/**
 * [INPUT]: 依赖 workspace/useHomeWallpaperConfig, HomePreviewPane, HomeSettingsPane
 * [OUTPUT]: 对外提供 HomeGrid 组件（preview|settings 双栏工作区）
 * [POS]: registry/components 的主页工作区编排层，承接 selectedStyle 并驱动预览与配置联动
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { HomePreviewPane } from "../workspace/HomePreviewPane"
import { HomeSettingsPane } from "../workspace/HomeSettingsPane"
import { useHomeWallpaperConfig } from "../workspace/useHomeWallpaperConfig"

function HomeGrid({ selectedStyle }) {
    const viewModel = useHomeWallpaperConfig({ selectedStyle })

    return (
        <div
            data-registry-workspace
            className="grid h-full min-h-0 grid-cols-1 overflow-y-auto bg-kumo-elevated lg:grid-cols-2 lg:divide-x lg:divide-kumo-line lg:overflow-hidden"
        >
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
                />
            </section>
        </div>
    )
}

export { HomeGrid }
