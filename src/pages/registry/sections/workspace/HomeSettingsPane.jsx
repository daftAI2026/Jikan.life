/**
 * [INPUT]: 依赖 @/components/ui/kumo(SkeletonLine)、SettingsCardShell、SetupGuidePanel、cards/CARD_REGISTRY，以及父级传入的 Set-it/AutoFlow/effectiveLayoutTier 参数
 * [OUTPUT]: 对外提供 HomeSettingsPane（右侧设置面板，支持空态 6 卡 Skeleton Base 与按 stage 渐进 reveal；Year 保持 5 卡宽收口；mid 下单列等分行）与 SETTINGS_CARD_IDS 常量
 * [POS]: registry/sections/workspace 的右侧设置面板，负责卡片编排、空态引导与 sm/lg Guide 宿主，Set-it/AutoFlow/effectiveLayoutTier 状态由 HomeGrid 上提统一管理（mid 复用桌面壳层，并将层级透传到卡片渲染层）
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { SkeletonLine } from "@/components/ui/kumo"
import { getLocalTodayISO } from "@/lib/date-utils"
import { CARD_REGISTRY } from "./cards"
import { SettingsCardShell } from "./SettingsCardShell"
import { SetupGuidePanel } from "./SetupGuidePanel"

const YEAR_SETTINGS_CARD_IDS = ["location", "wallpaper-lang", "colors", "device", "url"]
const LIFE_SETTINGS_CARD_IDS = ["location", "wallpaper-lang", "life-fields", "colors", "device", "url"]
const GOAL_SETTINGS_CARD_IDS = ["location", "wallpaper-lang", "goal-fields", "colors", "device", "url"]
const SETTINGS_CARD_IDS = LIFE_SETTINGS_CARD_IDS
const SETTINGS_CARD_MARKS = ["➊", "➋", "➌", "➍", "➎", "➏"]
const SKELETON_SLOT_MARKS = ["➊", "➋", "➌", "➍", "➎", "➏"]
const MID_SKELETON_ROW_COUNT = 6
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
    } = props
    const isMid = effectiveLayoutTier === "mid"
    const isLg = effectiveLayoutTier === "lg"
    const isDesktopShell = isMid || isLg
    const guideVisibilityClassName = effectiveLayoutTier === "md" ? "hidden" : "block"
    const guideAsideClassName = isMid ? "lg:!border-l" : undefined
    const rowCount = resolveMidRowCount(config.selectedType)
    const gridInlineStyle = isMid ? { gridTemplateRows: `repeat(${rowCount}, minmax(0, 1fr))` } : undefined
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
        todayISO,
        t,
        url,
    }
    const cardOrder = resolveCardOrderByType(config.selectedType)
    const unlockedCount = Math.min(cardOrder.length, Math.max(0, revealStage))

    return (
        <div
            className={[
                "relative h-full min-h-0 overflow-x-hidden overflow-y-auto md:h-auto md:overflow-y-visible",
                isDesktopShell ? "md:h-full md:overflow-y-hidden" : "",
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
                        const card = CARD_REGISTRY[cardId]
                        if (!card) return null

                        const isUnlocked = slotIndex < unlockedCount
                        const resolvedTitle = card.resolveTitle
                            ? card.resolveTitle(cardViewModel)
                            : card.titleKey
                                ? t(card.titleKey)
                                : card.title
                        const resolvedTitleTooltip = card.titleTooltipKey
                            ? t(card.titleTooltipKey)
                            : card.titleTooltip
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
                                    ? card.render(cardViewModel)
                                    : <SettingsCardSkeleton onRequestRevealAll={onRequestRevealAll} />}
                            </SettingsCardShell>
                        )
                    })}
            </section>
            <SetupGuidePanel
                open={isSetupPanelOpen}
                platform={setupPlatform}
                onClose={onCloseSetupPanel}
                t={t}
                url={url}
                visibilityClassName={guideVisibilityClassName}
                asideClassName={guideAsideClassName}
            />
        </div>
    )
}

export { HomeSettingsPane, SETTINGS_CARD_IDS }
