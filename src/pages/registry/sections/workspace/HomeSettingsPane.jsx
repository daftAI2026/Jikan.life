/**
 * [INPUT]: 依赖 SettingsCardShell、SetupGuidePanel、cards/CARD_REGISTRY，以及父级传入的 Set-it 流程控制参数（onSetIt/isSetupPanelOpen/setupPlatform/onCloseSetupPanel）
 * [OUTPUT]: 对外提供 HomeSettingsPane（右侧设置面板，采用 CARD_REGISTRY + CARD_ORDER_BY_TYPE 双层结构并输出业务ID选择器；Year 模式完成 5+6 合并为第⑤宽卡 Set 收口，Goal/Life 模式在第③卡承载专属字段并保持第⑥卡 Set 收口）与 SETTINGS_CARD_IDS 常量
 * [POS]: registry/sections/workspace 的右侧设置面板，负责卡片编排与 sm/lg Guide 宿主，Set-it 流程状态由 HomeGrid 上提统一管理
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { CARD_REGISTRY } from "./cards"
import { SettingsCardShell } from "./SettingsCardShell"
import { SetupGuidePanel } from "./SetupGuidePanel"

const YEAR_SETTINGS_CARD_IDS = ["location", "wallpaper-lang", "colors", "device", "url"]
const LIFE_SETTINGS_CARD_IDS = ["location", "wallpaper-lang", "life-fields", "colors", "device", "url"]
const GOAL_SETTINGS_CARD_IDS = ["location", "wallpaper-lang", "goal-fields", "colors", "device", "url"]
const SETTINGS_CARD_IDS = LIFE_SETTINGS_CARD_IDS
const SETTINGS_CARD_MARKS = ["➊", "➋", "➌", "➍", "➎", "➏"]
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
    return CARD_ORDER_BY_TYPE.year
}

function resolveCardShellClassName(selectedType, cardId) {
    if (!selectedType) return ""
    return CARD_SHELL_CLASS_BY_TYPE[selectedType]?.[cardId] ?? ""
}

function getLocalTodayISO() {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, "0")
    const day = String(now.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
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
    } = props
    const todayISO = getLocalTodayISO()

    const cardViewModel = {
        actions,
        config,
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

    return (
        <div className="relative h-full min-h-0 overflow-x-hidden overflow-y-auto md:h-auto md:overflow-y-visible lg:h-full lg:overflow-y-hidden">
            <section
                data-home-settings-grid
                className="grid auto-rows-min grid-cols-1 gap-px bg-kumo-line md:grid-cols-2 lg:h-full lg:min-h-0 lg:grid-rows-3 lg:auto-rows-fr"
            >
                {cardOrder.map((cardId, slotIndex) => {
                    const card = CARD_REGISTRY[cardId]
                    if (!card) return null
                    return (
                        <SettingsCardShell
                            key={cardId}
                            cardId={cardId}
                            title={card.resolveTitle ? card.resolveTitle(cardViewModel) : card.titleKey ? t(card.titleKey) : card.title}
                            titleTooltip={card.titleTooltipKey ? t(card.titleTooltipKey) : card.titleTooltip}
                            indexMark={SETTINGS_CARD_MARKS[slotIndex]}
                            className={resolveCardShellClassName(config.selectedType, cardId)}
                        >
                            {card.render(cardViewModel)}
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
                visibilityClassName="md:hidden lg:block"
            />
        </div>
    )
}

export { HomeSettingsPane, SETTINGS_CARD_IDS }
