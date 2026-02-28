/**
 * [INPUT]: 依赖 Kumo Button、ColorPicker、palettePresets 与颜色 actions/config 链路
 * [OUTPUT]: 对外提供 colorsCard 定义（Colors 业务卡）
 * [POS]: workspace/cards 的颜色配置卡，承接 background/accent 与 presets 应用
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { Button as KumoButton } from "@/components/ui/kumo"
import { ColorPicker } from "@/components/ui/color-picker"
import { CardField, CardFieldsStack } from "./CardField"

const colorsCard = {
    titleKey: "config.colors",
    render: ({ actions, config, palettePresets, t }) => (
        <CardFieldsStack>
            <CardField className="space-y-2">
                <div className="grid w-[200px] max-w-full grid-cols-2 gap-2">
                    <div className="min-w-0 space-y-1.5">
                        <p className="text-xs text-kumo-subtle">{t("config.background")}</p>
                        <ColorPicker
                            className="w-full"
                            value={config.bgColor}
                            showValue={false}
                            onChange={(value) => actions.setBackgroundColor(value)}
                        />
                    </div>
                    <div className="min-w-0 space-y-1.5">
                        <p className="text-xs text-kumo-subtle">{t("config.accent")}</p>
                        <ColorPicker
                            className="w-full"
                            value={config.accentColor}
                            showValue={false}
                            onChange={(value) => actions.setAccentColor(value)}
                        />
                    </div>
                </div>
            </CardField>
            <CardField label={t("config.colorPresets")} labelClassName="block">
                <div className="flex w-[200px] max-w-full flex-wrap gap-2">
                    {palettePresets.map((preset) => (
                        <KumoButton
                            key={preset.id}
                            variant="secondary"
                            size="sm"
                            className="min-w-0 px-2"
                            onClick={() => actions.applyPalette(preset.bg, preset.accent)}
                        >
                            <span className="inline-flex items-center gap-1">
                                <span
                                    className="inline-block h-3 w-3 rounded-full border border-kumo-line"
                                    style={{ backgroundColor: preset.bg }}
                                />
                                <span
                                    className="inline-block h-3 w-3 rounded-full border border-kumo-line"
                                    style={{ backgroundColor: preset.accent }}
                                />
                            </span>
                        </KumoButton>
                    ))}
                </div>
            </CardField>
        </CardFieldsStack>
    ),
}

export { colorsCard }
