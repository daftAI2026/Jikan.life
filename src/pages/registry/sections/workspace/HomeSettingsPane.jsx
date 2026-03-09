/**
 * [INPUT]: 依赖 react(useState)、@/components/ui/kumo(SkeletonLine)、HomeSettingsPaneBottomTabsLayout、SettingsCardShell、SetupGuidePanel、cards/CARD_REGISTRY，以及父级传入的 Set-it/AutoFlow/effectiveLayoutTier/bottom-tabs/guide-host 参数
 * [OUTPUT]: 对外提供 HomeSettingsPane（右侧设置面板，支持空态 6 卡 Skeleton Base、grid 布局与 `md + drawer open` 的底部 Tabs 单卡布局；空态也支持全量 tabs + 单卡 skeleton，且 tabs/title 壳层常驻后仅切换文案 skeleton 态）与 SETTINGS_CARD_IDS 常量
 * [POS]: registry/sections/workspace 的右侧设置面板编排层，负责卡片顺序、reveal/skeleton、pane 级 Guide 宿主与 `useAnchoredSetupRow` 语义收口；md bottom-tabs 专属视图已提取到私有文件，pane 只保留分流与业务编排
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { useState } from "react"
import { SkeletonLine } from "@/components/ui/kumo"
import { getLocalTodayISO } from "@/lib/date-utils"
import { CARD_REGISTRY } from "./cards"
import { HomeSettingsPaneBottomTabsLayout } from "./HomeSettingsPaneBottomTabsLayout"
import { SettingsCardShell } from "./SettingsCardShell"
import { SetupGuidePanel } from "./SetupGuidePanel"

const YEAR_SETTINGS_CARD_IDS = ["location", "wallpaper-lang", "colors", "device", "url"]
const LIFE_SETTINGS_CARD_IDS = ["location", "wallpaper-lang", "life-fields", "colors", "device", "url"]
const GOAL_SETTINGS_CARD_IDS = ["location", "wallpaper-lang", "goal-fields", "colors", "device", "url"]
const SETTINGS_CARD_IDS = LIFE_SETTINGS_CARD_IDS
const MD_BOTTOM_TABS_EMPTY_STATE_CARD_IDS = ["location", "wallpaper-lang", "goal-fields", "colors", "device", "url"]
const MD_BOTTOM_TABS_SLOT_COUNT = 6
const SETTINGS_SLOT_MARKS = ["➊", "➋", "➌", "➍", "➎", "➏"]
const MID_SKELETON_ROW_COUNT = MD_BOTTOM_TABS_SLOT_COUNT
const CARD_SHELL_CLASS_BY_TYPE = {
    year: {
        url: "md:col-span-2",
    },
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
    if (selectedType === "goal" || selectedType === "life") return MD_BOTTOM_TABS_SLOT_COUNT
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
                    ? SETTINGS_SLOT_MARKS.map((indexMark, slotIndex) => (
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
                                indexMark={SETTINGS_SLOT_MARKS[slotIndex]}
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
    const activeCardDefinition = currentActiveTab
        ? resolveCardDefinition(currentActiveTab, cardViewModel, t)
        : null
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
        activeCardDefinition={activeCardDefinition}
        SettingsCardSkeleton={SettingsCardSkeleton}
        SettingsCardTitleSkeleton={SettingsCardTitleSkeleton}
        onCloseSetupPanel={onCloseSetupPanel}
        onRequestRevealAll={onRequestRevealAll}
        isSetupPanelOpen={isSetupPanelOpen}
        setActiveTabId={setActiveTabId}
        setupPlatform={setupPlatform}
        slotMarks={SETTINGS_SLOT_MARKS}
        shouldRenderPaneGuideHost={shouldRenderPaneGuideHost}
        t={t}
        url={url}
    />

    return gridLayout
}

export { HomeSettingsPane, SETTINGS_CARD_IDS }
