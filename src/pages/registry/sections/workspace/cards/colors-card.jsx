/**
 * [INPUT]: 依赖 Kumo Button、ColorPicker、palettePresets 与颜色 actions/config/effectiveLayoutTier 链路
 * [OUTPUT]: 对外提供 colorsCard 定义（Colors 业务卡）
 * [POS]: workspace/cards 的颜色配置卡，承接 background/accent 与 presets 应用（mid+year/goal 下采用双列排布）
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { Button as KumoButton } from "@/components/ui/kumo"
import { ColorPicker } from "@/components/ui/color-picker"
import { CardField, CardFieldsStack } from "./CardField"

function renderPresetButtons({ actions, palettePresets, className }) {
    return (
        <div className={className}>
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
    )
}

const colorsCard = {
    titleKey: "config.colors",
    render: ({ actions, config, effectiveLayoutTier, palettePresets, t }) => {
        const isMidYearOrGoal = effectiveLayoutTier === "mid" && (config.selectedType === "year" || config.selectedType === "goal")

        if (isMidYearOrGoal) {
            return (
                <div className="flex w-full max-w-full items-start justify-center gap-4 px-4 py-1">
                    <CardField className="space-y-2">
                        <div className="grid w-[200px] max-w-full grid-cols-1 gap-2">
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
                        {renderPresetButtons({
                            actions,
                            palettePresets,
                            className: "w-[200px] max-w-full grid grid-cols-4 gap-2",
                        })}
                    </CardField>
                </div>
            )
        }

        return (
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
                    {renderPresetButtons({
                        actions,
                        palettePresets,
                        className: "flex w-[200px] max-w-full flex-wrap gap-2",
                    })}
                </CardField>
            </CardFieldsStack>
        )
    },
}

export { colorsCard }
