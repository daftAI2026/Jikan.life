/**
 * [INPUT]: 依赖 react(useLayoutEffect/useRef/useState)、@/components/ui/kumo(SkeletonLine/Tabs)、md-bottom-tabs-widths、SettingsCardShell、SetupGuidePanel、cards/CARD_REGISTRY，以及父级传入的 Set-it/AutoFlow/effectiveLayoutTier/bottom-tabs/guide-host 参数
 * [OUTPUT]: 对外提供 HomeSettingsPane（右侧设置面板，支持空态 6 卡 Skeleton Base、grid 布局与 `md + drawer open` 的底部 Tabs 单卡布局；空态也支持全量 tabs + 单卡 skeleton，且 tabs/title 壳层常驻后仅切换文案 skeleton 态）与 SETTINGS_CARD_IDS 常量
 * [POS]: registry/sections/workspace 的右侧设置面板，负责卡片编排、空态引导与 pane 级 Guide 宿主；布局模式由 HomeGrid 显式收口后透传，避免 pane 内再次推理 sidebar 语义；md bottom-tabs 宽度由“自然宽测量 + 分配算法”单向投影回 trigger 本体，title/tab label 的 reveal 与卡片主体解锁解耦
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { useLayoutEffect, useRef, useState } from "react"
import { SkeletonLine, Tabs } from "@/components/ui/kumo"
import { getLocalTodayISO } from "@/lib/date-utils"
import { CARD_REGISTRY } from "./cards"
import { resolveMdBottomTabWidths } from "./md-bottom-tabs-widths"
import { SettingsCardShell } from "./SettingsCardShell"
import { SetupGuidePanel } from "./SetupGuidePanel"

const YEAR_SETTINGS_CARD_IDS = ["location", "wallpaper-lang", "colors", "device", "url"]
const LIFE_SETTINGS_CARD_IDS = ["location", "wallpaper-lang", "life-fields", "colors", "device", "url"]
const GOAL_SETTINGS_CARD_IDS = ["location", "wallpaper-lang", "goal-fields", "colors", "device", "url"]
const SETTINGS_CARD_IDS = LIFE_SETTINGS_CARD_IDS
const MD_BOTTOM_TABS_EMPTY_STATE_CARD_IDS = ["location", "wallpaper-lang", "goal-fields", "colors", "device", "url"]
const SETTINGS_CARD_MARKS = ["➊", "➋", "➌", "➍", "➎", "➏"]
const SKELETON_SLOT_MARKS = ["➊", "➋", "➌", "➍", "➎", "➏"]
const MID_SKELETON_ROW_COUNT = 6
const MD_BOTTOM_TAB_MEASURE_TRIGGER_CLASSNAME = "inline-flex items-center rounded-lg px-2.5 text-base whitespace-nowrap"
const MD_BOTTOM_TAB_TRIGGER_CLASSNAMES = [
    "min-w-0 justify-center w-[var(--md-tab-w-0)] [flex:0_0_var(--md-tab-w-0)]",
    "min-w-0 justify-center w-[var(--md-tab-w-1)] [flex:0_0_var(--md-tab-w-1)]",
    "min-w-0 justify-center w-[var(--md-tab-w-2)] [flex:0_0_var(--md-tab-w-2)]",
    "min-w-0 justify-center w-[var(--md-tab-w-3)] [flex:0_0_var(--md-tab-w-3)]",
    "min-w-0 justify-center w-[var(--md-tab-w-4)] [flex:0_0_var(--md-tab-w-4)]",
    "min-w-0 justify-center w-[var(--md-tab-w-5)] [flex:0_0_var(--md-tab-w-5)]",
]
const CARD_SHELL_CLASS_BY_TYPE = {
    year: {
        url: "md:col-span-2",
    },
}
const MD_TAB_LABEL_KEY_BY_CARD_ID = {
    location: "config.location",
    "wallpaper-lang": "config.wallpaperLang",
    "goal-fields": "config.goal",
    "life-fields": "config.life",
    colors: "config.colors",
    device: "config.device",
    url: "setup.title",
}

const CARD_ORDER_BY_TYPE = {
    year: YEAR_SETTINGS_CARD_IDS,
    life: LIFE_SETTINGS_CARD_IDS,
    goal: GOAL_SETTINGS_CARD_IDS,
}

function resolveCardOrderByType(selectedType) {
    if (selectedType && CARD_ORDER_BY_TYPE[selectedType]) return CARD_ORDER_BY_TYPE[selectedType]
    return []
}

function resolveMdBottomTabsCardOrder(selectedType) {
    if (!selectedType) return MD_BOTTOM_TABS_EMPTY_STATE_CARD_IDS
    return resolveCardOrderByType(selectedType)
}

function resolveMdBottomTabsRevealedCardIds(selectedType, cardOrder, unlockedCount) {
    if (!selectedType) return []
    return cardOrder.slice(0, unlockedCount)
}

function resolveMidRowCount(selectedType) {
    if (selectedType === "year") return 5
    if (selectedType === "goal" || selectedType === "life") return 6
    return MID_SKELETON_ROW_COUNT
}

function resolveCardShellClassName({ selectedType, cardId, isMid }) {
    if (isMid) return ""
    if (!selectedType) return ""
    return CARD_SHELL_CLASS_BY_TYPE[selectedType]?.[cardId] ?? ""
}

function resolveCardDefinition(cardId, cardViewModel, t) {
    const card = CARD_REGISTRY[cardId]
    if (!card) return null

    const resolvedTitle = card.resolveTitle
        ? card.resolveTitle(cardViewModel)
        : card.titleKey
            ? t(card.titleKey)
            : card.title
    const resolvedTitleTooltip = card.titleTooltipKey
        ? t(card.titleTooltipKey)
        : card.titleTooltip

    return {
        card,
        resolvedTitle,
        resolvedTitleTooltip,
    }
}

function resolveMdTabLabel(cardId, t) {
    const labelKey = MD_TAB_LABEL_KEY_BY_CARD_ID[cardId]
    if (!labelKey) return cardId
    return t(labelKey)
}

function SettingsCardSkeleton({ onRequestRevealAll }) {
    const canFastForward = typeof onRequestRevealAll === "function"

    return (
        <button
            type="button"
            aria-label={canFastForward ? "Reveal all settings cards" : undefined}
            className={canFastForward ? "w-full cursor-pointer px-4 py-2 text-left" : "w-full cursor-default px-4 py-2 text-left"}
            onClick={canFastForward ? onRequestRevealAll : undefined}
            disabled={!canFastForward}
        >
            <div className="mx-auto flex w-[200px] max-w-full flex-col gap-2">
                <SkeletonLine minWidth={48} maxWidth={68} />
                <SkeletonLine minWidth={78} maxWidth={100} />
                <SkeletonLine minWidth={64} maxWidth={88} />
                <SkeletonLine minWidth={42} maxWidth={62} />
            </div>
        </button>
    )
}

function SettingsCardTitleSkeleton() {
    return (
        <span className="inline-flex w-[84px] max-w-full">
            <SkeletonLine minWidth={100} maxWidth={100} />
        </span>
    )
}

function SettingsTabLabelSkeleton() {
    return (
        <span className="inline-flex w-full max-w-[84px]">
            <SkeletonLine minWidth={100} maxWidth={100} />
        </span>
    )
}

function areTabWidthsEqual(left, right) {
    if (left.length !== right.length) return false
    return left.every((width, index) => Math.abs(width - right[index]) < 0.5)
}

function resolveMdBottomTabsWidthVars(widths) {
    return widths.reduce((styleVars, width, index) => {
        styleVars[`--md-tab-w-${index}`] = `${Math.max(0, width)}px`
        return styleVars
    }, {})
}

function resolveMdBottomTabTriggerClassName(index) {
    return MD_BOTTOM_TAB_TRIGGER_CLASSNAMES[index] ?? "min-w-0 justify-center"
}

function resolveMdBottomTabLabelContent(cardId, isLabelRevealed, t) {
    if (!isLabelRevealed) return <SettingsTabLabelSkeleton />
    return <span className="block min-w-0 truncate text-center">{resolveMdTabLabel(cardId, t)}</span>
}

function resolveMdBottomTabsActiveTitle({
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

function HomeSettingsPaneBottomTabsLayout({
    bottomTabsCardOrder,
    revealedTabs,
    cardViewModel,
    currentActiveTab,
    onCloseSetupPanel,
    onRequestRevealAll,
    isSetupPanelOpen,
    setActiveTabId,
    setupPlatform,
    shouldRenderPaneGuideHost,
    t,
    url,
}) {
    const tabsContainerRef = useRef(null)
    const measureTriggerRefs = useRef([])
    const [distributedTabWidths, setDistributedTabWidths] = useState([])

    const activeSlotIndex = currentActiveTab ? bottomTabsCardOrder.indexOf(currentActiveTab) : 0
    const activeCardDefinition = currentActiveTab
        ? resolveCardDefinition(currentActiveTab, cardViewModel, t)
        : null
    const isActiveTabRevealed = revealedTabs.includes(currentActiveTab)
    const activeTitleState = resolveMdBottomTabsActiveTitle({
        activeCardDefinition,
        currentActiveTab,
        isActiveTabRevealed,
    })
    const measureLabels = bottomTabsCardOrder.map((cardId) => resolveMdTabLabel(cardId, t))
    const tabLabelsKey = measureLabels.join("|")
    const bottomTabsWidthVars = resolveMdBottomTabsWidthVars(distributedTabWidths)

    useLayoutEffect(() => {
        if (bottomTabsCardOrder.length === 0) {
            setDistributedTabWidths([])
            return undefined
        }

        const containerElement = tabsContainerRef.current
        if (!containerElement) return undefined

        let frameId = 0
        let resizeObserver = null

        const measureTabWidths = () => {
            const naturalWidths = measureTriggerRefs.current
                .slice(0, bottomTabsCardOrder.length)
                .map((element) => element?.getBoundingClientRect().width ?? 0)
            const tabsListElement = containerElement.querySelector('[role="tablist"]')
            const availableWidth = tabsListElement?.getBoundingClientRect().width ?? containerElement.getBoundingClientRect().width
            const nextWidths = resolveMdBottomTabWidths({ naturalWidths, containerWidth: availableWidth })

            setDistributedTabWidths((previousWidths) => (
                areTabWidthsEqual(previousWidths, nextWidths) ? previousWidths : nextWidths
            ))
        }

        const scheduleMeasurement = () => {
            cancelAnimationFrame(frameId)
            frameId = requestAnimationFrame(measureTabWidths)
        }

        scheduleMeasurement()

        if (typeof ResizeObserver === "function") {
            resizeObserver = new ResizeObserver(scheduleMeasurement)
            resizeObserver.observe(containerElement)
            const tabsListElement = containerElement.querySelector('[role="tablist"]')
            if (tabsListElement) resizeObserver.observe(tabsListElement)
        }

        return () => {
            cancelAnimationFrame(frameId)
            resizeObserver?.disconnect()
        }
    }, [tabLabelsKey, bottomTabsCardOrder.length])

    return (
        <div className="relative flex h-full min-h-0 flex-col overflow-hidden">
            <div className="flex-1 min-h-0 overflow-hidden">
                {currentActiveTab ? (
                    <SettingsCardShell
                        cardId={currentActiveTab}
                        title={activeTitleState.title}
                        titleTooltip={activeTitleState.titleTooltip}
                        indexMark={SETTINGS_CARD_MARKS[Math.max(0, activeSlotIndex)]}
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
                        indexMark={SETTINGS_CARD_MARKS[0]}
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
                            listClassName="w-full"
                            variant="segmented"
                            tabs={bottomTabsCardOrder.map((cardId, index) => ({
                                value: cardId,
                                label: resolveMdBottomTabLabelContent(cardId, revealedTabs.includes(cardId), t),
                                className: resolveMdBottomTabTriggerClassName(index),
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

function HomeSettingsPaneGridLayout({
    cardOrder,
    cardViewModel,
    config,
    isLg,
    isMid,
    isSetupPanelOpen,
    onCloseSetupPanel,
    onRequestRevealAll,
    rowCount,
    setupPlatform,
    shouldRenderPaneGuideHost,
    t,
    unlockedCount,
    url,
}) {
    const isDesktopShell = isMid || isLg
    const gridInlineStyle = isMid ? { gridTemplateRows: `repeat(${rowCount}, minmax(0, 1fr))` } : undefined

    return (
        <div
            className={[
                "relative h-full min-h-0 overflow-x-hidden overflow-y-auto",
                isDesktopShell ? "md:h-full md:overflow-y-hidden" : "md:h-auto md:overflow-y-visible",
            ].join(" ")}
        >
            <section
                data-home-settings-grid
                style={gridInlineStyle}
                className={[
                    "grid auto-rows-min grid-cols-1 gap-px bg-kumo-line",
                    isMid ? "md:grid-cols-1" : "md:grid-cols-2",
                    isLg ? "md:h-full md:min-h-0 md:grid-rows-3 md:auto-rows-fr" : "",
                    isMid ? "md:h-full md:min-h-0 md:auto-rows-fr" : "",
                ].join(" ")}
            >
                {!config.selectedType
                    ? SKELETON_SLOT_MARKS.map((indexMark, slotIndex) => (
                        <SettingsCardShell
                            key={`skeleton-slot-${slotIndex + 1}`}
                            cardId={`skeleton-slot-${slotIndex + 1}`}
                            title={<SettingsCardTitleSkeleton />}
                            indexMark={indexMark}
                            isIndexActive={false}
                            compactAtDesktop={isDesktopShell}
                        >
                            <SettingsCardSkeleton />
                        </SettingsCardShell>
                    ))
                    : cardOrder.map((cardId, slotIndex) => {
                        const cardDefinition = resolveCardDefinition(cardId, cardViewModel, t)
                        if (!cardDefinition) return null

                        const isUnlocked = slotIndex < unlockedCount
                        const resolvedTitle = cardDefinition.resolvedTitle
                        const resolvedTitleTooltip = cardDefinition.resolvedTitleTooltip
                        const title = isUnlocked ? resolvedTitle : <SettingsCardTitleSkeleton />
                        const titleTooltip = isUnlocked ? resolvedTitleTooltip : undefined

                        return (
                            <SettingsCardShell
                                key={cardId}
                                cardId={cardId}
                                title={title}
                                titleTooltip={titleTooltip}
                                indexMark={SETTINGS_CARD_MARKS[slotIndex]}
                                isIndexActive={isUnlocked}
                                className={resolveCardShellClassName({ selectedType: config.selectedType, cardId, isMid })}
                                compactAtDesktop={isDesktopShell}
                            >
                                {isUnlocked
                                    ? cardDefinition.card.render(cardViewModel)
                                    : <SettingsCardSkeleton onRequestRevealAll={onRequestRevealAll} />}
                            </SettingsCardShell>
                        )
                    })}
            </section>
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

function HomeSettingsPane(props) {
    const {
        t,
        config,
        selectedDevice,
        palettePresets,
        countryOptions,
        languageOptions,
        url,
        actions,
        onSetIt,
        isSetupPanelOpen,
        setupPlatform,
        onCloseSetupPanel,
        revealStage = 0,
        onRequestRevealAll,
        effectiveLayoutTier = "lg",
        useMdBottomTabsLayout = false,
        shouldRenderPaneGuideHost = true,
    } = props
    const [activeTabId, setActiveTabId] = useState(null)
    const isMid = effectiveLayoutTier === "mid"
    const isLg = effectiveLayoutTier === "lg"
    const shouldUseAnchoredSetupRow = effectiveLayoutTier === "mid" || useMdBottomTabsLayout
    const rowCount = resolveMidRowCount(config.selectedType)
    const todayISO = getLocalTodayISO()

    const cardViewModel = {
        actions,
        config,
        effectiveLayoutTier,
        onSetIt,
        selectedDevice,
        palettePresets,
        countryOptions,
        languageOptions,
        useAnchoredSetupRow: shouldUseAnchoredSetupRow,
        todayISO,
        t,
        url,
    }
    const cardOrder = resolveCardOrderByType(config.selectedType)
    const bottomTabsCardOrder = resolveMdBottomTabsCardOrder(config.selectedType)
    const unlockedCount = Math.min(cardOrder.length, Math.max(0, revealStage))
    const revealedTabs = resolveMdBottomTabsRevealedCardIds(config.selectedType, cardOrder, unlockedCount)
    const currentActiveTab = bottomTabsCardOrder.includes(activeTabId) ? activeTabId : bottomTabsCardOrder[0]
    const gridLayout = (
        <HomeSettingsPaneGridLayout
            cardOrder={cardOrder}
            cardViewModel={cardViewModel}
            config={config}
            isLg={isLg}
            isMid={isMid}
            isSetupPanelOpen={isSetupPanelOpen}
            onCloseSetupPanel={onCloseSetupPanel}
            onRequestRevealAll={onRequestRevealAll}
            rowCount={rowCount}
            setupPlatform={setupPlatform}
            shouldRenderPaneGuideHost={shouldRenderPaneGuideHost}
            t={t}
            unlockedCount={unlockedCount}
            url={url}
        />
    )

    if (useMdBottomTabsLayout) return <HomeSettingsPaneBottomTabsLayout
        bottomTabsCardOrder={bottomTabsCardOrder}
        revealedTabs={revealedTabs}
        cardViewModel={cardViewModel}
        currentActiveTab={currentActiveTab}
        onCloseSetupPanel={onCloseSetupPanel}
        onRequestRevealAll={onRequestRevealAll}
        isSetupPanelOpen={isSetupPanelOpen}
        setActiveTabId={setActiveTabId}
        setupPlatform={setupPlatform}
        shouldRenderPaneGuideHost={shouldRenderPaneGuideHost}
        t={t}
        url={url}
    />

    return gridLayout
}

export { HomeSettingsPane, SETTINGS_CARD_IDS }
