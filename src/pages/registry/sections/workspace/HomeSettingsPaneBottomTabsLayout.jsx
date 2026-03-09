/**
 * [INPUT]: 依赖 react(useRef)、@/components/ui/kumo(Tabs)、use-md-bottom-tabs-metrics、SettingsCardShell、SetupGuidePanel，以及 HomeSettingsPane 透传的 bottom-tabs 编排结果与 skeleton 组件
 * [OUTPUT]: 对外提供 HomeSettingsPaneBottomTabsLayout 私有组件，承载 md bottom-tabs 完整视图链
 * [POS]: registry/sections/workspace 的 bottom-tabs 视图层，负责 active card 壳、tabs rail、隐藏测量节点与 tab label skeleton；不持有业务编排真相源
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { useRef } from "react"
import { SkeletonLine, Tabs } from "@/components/ui/kumo"
import { SettingsCardShell } from "./SettingsCardShell"
import { SetupGuidePanel } from "./SetupGuidePanel"
import { useMdBottomTabsMetrics } from "./use-md-bottom-tabs-metrics"

const MD_BOTTOM_TAB_WIDTH_VAR_PREFIX = "--md-tab-w-"
const MD_BOTTOM_TAB_MEASURE_TRIGGER_CLASSNAME = "inline-flex items-center rounded-lg px-2.5 text-base whitespace-nowrap"
const MD_TAB_LABEL_KEY_BY_CARD_ID = {
    location: "config.location",
    "wallpaper-lang": "config.wallpaperLang",
    "goal-fields": "config.goal",
    "life-fields": "config.life",
    colors: "config.colors",
    device: "config.device",
    url: "setup.title",
}

function SettingsTabLabelSkeleton() {
    return (
        <span className="inline-flex w-full max-w-[84px]">
            <SkeletonLine minWidth={100} maxWidth={100} />
        </span>
    )
}

function resolveMdTabLabel(cardId, t) {
    const labelKey = MD_TAB_LABEL_KEY_BY_CARD_ID[cardId]
    if (!labelKey) return cardId
    return t(labelKey)
}

function resolveMdBottomTabsWidthVarName(index) {
    return `${MD_BOTTOM_TAB_WIDTH_VAR_PREFIX}${index}`
}

function resolveMdBottomTabsWidthVars(widths) {
    return widths.reduce((styleVars, width, index) => {
        styleVars[resolveMdBottomTabsWidthVarName(index)] = `${Math.max(0, width)}px`
        return styleVars
    }, {})
}

function resolveMdBottomTabTriggerClassName(index, tabCount) {
    const triggerClassNames = Array.from({ length: tabCount }, (_, triggerIndex) => {
        const widthVarName = resolveMdBottomTabsWidthVarName(triggerIndex)
        return `min-w-0 justify-center w-[var(${widthVarName})] [flex:0_0_var(${widthVarName})]`
    })
    return triggerClassNames[index] ?? "min-w-0 justify-center"
}

function resolveMdBottomTabLabelContent(cardId, isLabelRevealed, t) {
    if (!isLabelRevealed) return <SettingsTabLabelSkeleton />
    return <span className="block min-w-0 truncate text-center">{resolveMdTabLabel(cardId, t)}</span>
}

function resolveMdBottomTabsActiveTitle({
    SettingsCardTitleSkeleton,
    activeCardDefinition,
    currentActiveTab,
    isActiveTabRevealed,
}) {
    if (!currentActiveTab || !isActiveTabRevealed || !activeCardDefinition) {
        return {
            title: <SettingsCardTitleSkeleton />,
            titleTooltip: undefined,
            isIndexActive: false,
        }
    }

    return {
        title: activeCardDefinition.resolvedTitle,
        titleTooltip: activeCardDefinition.resolvedTitleTooltip,
        isIndexActive: true,
    }
}

export function HomeSettingsPaneBottomTabsLayout({
    SettingsCardSkeleton,
    SettingsCardTitleSkeleton,
    activeCardDefinition,
    bottomTabsCardOrder,
    cardViewModel,
    currentActiveTab,
    isSetupPanelOpen,
    onCloseSetupPanel,
    onRequestRevealAll,
    revealedTabs,
    setActiveTabId,
    setupPlatform,
    shouldRenderPaneGuideHost,
    slotMarks,
    t,
    url,
}) {
    const tabsContainerRef = useRef(null)
    const measureTriggerRefs = useRef([])
    const activeSlotIndex = currentActiveTab ? bottomTabsCardOrder.indexOf(currentActiveTab) : 0
    const isActiveTabRevealed = revealedTabs.includes(currentActiveTab)
    const activeTitleState = resolveMdBottomTabsActiveTitle({
        SettingsCardTitleSkeleton,
        activeCardDefinition,
        currentActiveTab,
        isActiveTabRevealed,
    })
    const measureLabels = bottomTabsCardOrder.map((cardId) => resolveMdTabLabel(cardId, t))
    const { distributedTabWidths, indicatorClassName } = useMdBottomTabsMetrics({
        tabsContainerRef,
        measureTriggerRefs,
        measureLabels,
    })
    const bottomTabsWidthVars = resolveMdBottomTabsWidthVars(distributedTabWidths)
    const tabCount = bottomTabsCardOrder.length

    return (
        <div className="relative flex h-full min-h-0 flex-col overflow-hidden">
            <div className="flex-1 min-h-0 overflow-hidden">
                {currentActiveTab ? (
                    <SettingsCardShell
                        cardId={currentActiveTab}
                        title={activeTitleState.title}
                        titleTooltip={activeTitleState.titleTooltip}
                        indexMark={slotMarks[Math.max(0, activeSlotIndex)]}
                        isIndexActive={activeTitleState.isIndexActive}
                        className="h-full"
                        compactAtDesktop={false}
                    >
                        {isActiveTabRevealed && activeCardDefinition
                            ? activeCardDefinition.card.render(cardViewModel)
                            : <SettingsCardSkeleton onRequestRevealAll={cardViewModel.config.selectedType ? onRequestRevealAll : undefined} />}
                    </SettingsCardShell>
                ) : (
                    <SettingsCardShell
                        cardId="skeleton-slot-1"
                        title={<SettingsCardTitleSkeleton />}
                        indexMark={slotMarks[0]}
                        isIndexActive={false}
                        className="h-full"
                        compactAtDesktop={false}
                    >
                        <SettingsCardSkeleton />
                    </SettingsCardShell>
                )}
            </div>
            <div className="border-t border-kumo-line bg-kumo-elevated" style={{ height: "var(--registry-topbar-height)" }}>
                {bottomTabsCardOrder.length > 0 ? (
                    <div
                        ref={tabsContainerRef}
                        data-home-md-bottom-tabs
                        className="relative flex h-full items-center px-3"
                        style={bottomTabsWidthVars}
                    >
                        <div aria-hidden className="pointer-events-none absolute left-0 top-0 invisible flex font-medium">
                            {measureLabels.map((label, index) => (
                                <span
                                    key={`measure-${bottomTabsCardOrder[index]}`}
                                    ref={(element) => {
                                        measureTriggerRefs.current[index] = element
                                    }}
                                    className={MD_BOTTOM_TAB_MEASURE_TRIGGER_CLASSNAME}
                                >
                                    {label}
                                </span>
                            ))}
                        </div>
                        <Tabs
                            className="w-full"
                            indicatorClassName={indicatorClassName}
                            listClassName="w-full"
                            variant="segmented"
                            tabs={bottomTabsCardOrder.map((cardId, index) => ({
                                value: cardId,
                                label: resolveMdBottomTabLabelContent(cardId, revealedTabs.includes(cardId), t),
                                className: resolveMdBottomTabTriggerClassName(index, tabCount),
                            }))}
                            value={currentActiveTab}
                            onValueChange={setActiveTabId}
                        />
                    </div>
                ) : (
                    <div className="flex h-full items-center gap-2 px-3">
                        {bottomTabsCardOrder.map((cardId) => (
                            <div key={cardId} className="flex min-w-0 flex-1 justify-center">
                                <SettingsTabLabelSkeleton />
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {shouldRenderPaneGuideHost ? (
                <SetupGuidePanel
                    open={isSetupPanelOpen}
                    platform={setupPlatform}
                    onClose={onCloseSetupPanel}
                    t={t}
                    url={url}
                />
            ) : null}
        </div>
    )
}
