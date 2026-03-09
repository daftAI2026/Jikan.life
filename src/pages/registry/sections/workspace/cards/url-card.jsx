/**
 * [INPUT]: 依赖 Kumo Button/Input/Collapsible 与 url actions/config/effectiveLayoutTier/useAnchoredSetupRow 链路（Set it 回调可接收触发元素）
 * [OUTPUT]: 对外提供 urlCard 定义（Set it 收口卡，含 Year/Goal 专属布局与单卡收口语义下的 anchored row 抗挤压布局）
 * [POS]: workspace/cards 的流程收口卡，承接 URL 展示与 Set it 触发（effective mid 或 md bottom-tabs 单卡收口时对齐标题左锚/序号右锚）
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { Button as KumoButton, Collapsible, Input } from "@/components/ui/kumo"

const SETUP_FLOW_TYPES = new Set(["year", "goal"])

function renderMidAnchoredUrlRow({ onSetIt, t, url }) {
    return (
        <div className="w-full px-4 py-1">
            <div className="grid w-full max-w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
                <Input
                    value={url || t("url.placeholder")}
                    readOnly
                    aria-label={t("url.placeholder")}
                    className="min-w-0 w-full font-mono text-xs"
                />
                <KumoButton
                    variant="secondary"
                    className="min-w-[88px] shrink-0 justify-center px-4 text-center transition-colors not-disabled:hover:!bg-kumo-tint"
                    onClick={(event) => void onSetIt(event.currentTarget)}
                >
                    {t("url.set")}
                </KumoButton>
            </div>
        </div>
    )
}

const urlCard = {
    resolveTitle: ({ config, t }) =>
        SETUP_FLOW_TYPES.has(config.selectedType) ? t("setup.title") : "Collapsible",
    title: "Collapsible",
    render: ({ config, effectiveLayoutTier, onSetIt, t, url, useAnchoredSetupRow }) => {
        const isMidYear = config.selectedType === "year" && effectiveLayoutTier === "mid"
        const isMidGoal = config.selectedType === "goal" && effectiveLayoutTier === "mid"
        const shouldUseAnchoredSetupRow = useAnchoredSetupRow || isMidYear || isMidGoal

        if (config.selectedType === "year") {
            if (shouldUseAnchoredSetupRow) {
                return renderMidAnchoredUrlRow({ onSetIt, t, url })
            }

            return (
                <div className="w-full px-4 py-1 md:px-[calc(25%-100px)]">
                    <div className="flex max-w-full flex-col gap-2 md:flex-row md:items-center md:gap-2">
                        <Input
                            value={url || t("url.placeholder")}
                            readOnly
                            aria-label={t("url.placeholder")}
                            className="min-w-0 w-full font-mono text-xs md:flex-1"
                        />
                        <KumoButton
                            variant="secondary"
                            className="min-w-[88px] justify-center px-4 text-center transition-colors not-disabled:hover:!bg-kumo-tint md:shrink-0"
                            onClick={(event) => void onSetIt(event.currentTarget)}
                        >
                            {t("url.set")}
                        </KumoButton>
                    </div>
                </div>
            )
        }

        if (config.selectedType === "goal") {
            if (shouldUseAnchoredSetupRow) {
                return renderMidAnchoredUrlRow({ onSetIt, t, url })
            }

            return (
                <div className="flex w-[220px] max-w-full flex-col gap-2 px-3 py-1">
                    <Input
                        value={url || t("url.placeholder")}
                        readOnly
                        aria-label={t("url.placeholder")}
                        className="min-w-0 w-full font-mono text-xs"
                    />
                    <KumoButton
                        variant="secondary"
                        className="w-full justify-center text-center transition-colors not-disabled:hover:!bg-kumo-tint"
                        onClick={(event) => void onSetIt(event.currentTarget)}
                    >
                        {t("url.set")}
                    </KumoButton>
                </div>
            )
        }

        return (
            <Collapsible label="What is Kumo?">
                Kumo is Cloudflare&apos;s component library.
            </Collapsible>
        )
    },
}

export { urlCard }
