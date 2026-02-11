/**
 * [INPUT]: 依赖 workspace/useRegistryWallpaperConfig, RegistryPreviewPane, RegistrySettingsPane
 * [OUTPUT]: 对外提供 HomeGrid 组件（preview|settings 双栏工作区）
 * [POS]: registry/components 的主页工作区编排层，承接 selectedStyle 并驱动预览与配置联动
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { RegistryPreviewPane } from "../workspace/RegistryPreviewPane"
import { RegistrySettingsPane } from "../workspace/RegistrySettingsPane"
import { useRegistryWallpaperConfig } from "../workspace/useRegistryWallpaperConfig"

function HomeGrid({ selectedStyle }) {
    const viewModel = useRegistryWallpaperConfig({ selectedStyle })

    return (
        <div
            data-registry-workspace
            className="grid h-full min-h-0 grid-cols-1 overflow-y-auto bg-kumo-elevated lg:grid-cols-2 lg:divide-x lg:divide-kumo-line lg:overflow-hidden"
        >
            <section
                data-registry-pane="preview"
                className="border-b border-kumo-line lg:min-h-0 lg:border-b-0"
            >
                <RegistryPreviewPane
                    config={viewModel.config}
                    selectedDevice={viewModel.selectedDevice}
                    t={viewModel.t}
                />
            </section>

            <section data-registry-pane="settings" className="lg:min-h-0">
                <RegistrySettingsPane
                    t={viewModel.t}
                    config={viewModel.config}
                    copied={viewModel.copied}
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
