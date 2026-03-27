/**
 * [INPUT]: 依赖 Kumo Button、ColorPicker、@phosphor-icons/react(Shuffle)、palettePresets 与颜色 actions/config/effectiveLayoutTier 链路
 * [OUTPUT]: 对外提供 colorsCard 定义（Colors 业务卡）
 * [POS]: workspace/cards 的颜色配置卡，承接 background/accent 与 presets 应用；preset-8 额外收口为黑色 Shuffle 随机入口（effective mid 时 year/goal 仅保留与 lg 同构的 picker 区）
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { Shuffle } from "@phosphor-icons/react"
import { Button as KumoButton } from "@/components/ui/kumo"
import { ColorPicker } from "@/components/ui/color-picker"
import { CardField, CardFieldsStack } from "./CardField"

function RandomPresetIcon() {
    return (
        <Shuffle aria-hidden="true" color="var(--color-black)" size={20} weight="duotone" />
    )
}

function renderPresetButtons({ actions, palettePresets, className, t }) {
    return (
        <div className={className}>
            {palettePresets.map((preset) => (
                <KumoButton
                    key={preset.id}
                    aria-label={preset.kind === "random" ? t("config.randomPreset") : undefined}
                    variant="secondary"
                    size="sm"
                    className="min-w-0 px-2"
                    onClick={() => preset.kind === "random" ? actions.applyRandomPalette() : actions.applyPalette(preset.bg, preset.accent)}
                    title={preset.kind === "random" ? t("config.randomPreset") : undefined}
                >
                    {preset.kind === "random" ? (
                        <span className="inline-flex w-7 items-center justify-center">
                            <RandomPresetIcon />
                        </span>
                    ) : (
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
                    )}
                </KumoButton>
            ))}
        </div>
    )
}

function renderColorPickers({ actions, className, config, t }) {
    return (
        <div className={className}>
            <div className="min-w-0">
                <p className="mb-1.5 text-xs text-kumo-subtle">{t("config.background")}</p>
                <ColorPicker
                    className="w-full"
                    value={config.bgColor}
                    showValue={false}
                    onChange={(value) => actions.setBackgroundColor(value)}
                />
            </div>
            <div className="min-w-0">
                <p className="mb-1.5 text-xs text-kumo-subtle">{t("config.accent")}</p>
                <ColorPicker
                    className="w-full"
                    value={config.accentColor}
                    showValue={false}
                    onChange={(value) => actions.setAccentColor(value)}
                />
            </div>
        </div>
    )
}

const colorsCard = {
    titleKey: "config.colors",
    render: ({ actions, config, effectiveLayoutTier, palettePresets, t }) => {
        const isMidYearOrGoal = effectiveLayoutTier === "mid" && (config.selectedType === "year" || config.selectedType === "goal")

        if (isMidYearOrGoal) {
            return (
                <CardFieldsStack>
                    <CardField className="space-y-2">
                        {renderColorPickers({
                            actions,
                            className: "grid w-[200px] max-w-full grid-cols-2 gap-2",
                            config,
                            t,
                        })}
                    </CardField>
                </CardFieldsStack>
            )
        }

        return (
            <CardFieldsStack>
                <CardField className="space-y-2">
                    {renderColorPickers({
                        actions,
                        className: "grid w-[200px] max-w-full grid-cols-2 gap-2",
                        config,
                        t,
                    })}
                </CardField>
                <CardField label={t("config.colorPresets")} labelClassName="block">
                    {renderPresetButtons({
                        actions,
                        palettePresets,
                        className: "flex w-[200px] max-w-full flex-wrap gap-2",
                        t,
                    })}
                </CardField>
            </CardFieldsStack>
        )
    },
}

export { colorsCard }
