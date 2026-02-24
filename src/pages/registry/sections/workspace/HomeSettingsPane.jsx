/**
 * [INPUT]: 依赖 SettingsCardShell、SetupGuidePanel 与 cards/CARD_REGISTRY
 * [OUTPUT]: 对外提供 HomeSettingsPane（右侧设置面板，采用 CARD_REGISTRY + CARD_ORDER_BY_TYPE 双层结构并输出业务ID选择器；Year 模式完成 5+6 合并为第⑤宽卡 Set 收口，Goal/Life 模式在第③卡承载专属字段并保持第⑥卡 Set 收口）与 SETTINGS_CARD_IDS 常量
 * [POS]: registry/sections/workspace 的右侧设置面板，使用“业务语义层 + 位置编排层”驱动六卡迁移
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { useEffect, useState } from "react"
import { useKumoToastManager } from "@/components/ui/kumo"
import { CARD_REGISTRY } from "./cards"
import { SettingsCardShell } from "./SettingsCardShell"
import { SetupGuidePanel } from "./SetupGuidePanel"

const YEAR_SETTINGS_CARD_IDS = ["location", "wallpaper-lang", "colors", "device", "url"]
const LIFE_SETTINGS_CARD_IDS = ["location", "wallpaper-lang", "life-fields", "colors", "device", "url"]
const GOAL_SETTINGS_CARD_IDS = ["location", "wallpaper-lang", "goal-fields", "colors", "device", "url"]
const SETTINGS_CARD_IDS = LIFE_SETTINGS_CARD_IDS
const SETTINGS_CARD_MARKS = ["➊", "➋", "➌", "➍", "➎", "➏"]
const SETUP_FLOW_TYPES = new Set(["year", "goal"])
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
    } = props
    const toastManager = useKumoToastManager()
    const [isSetupPanelOpen, setIsSetupPanelOpen] = useState(false)
    const [setupPlatform, setSetupPlatform] = useState("ios")
    const todayISO = getLocalTodayISO()

    useEffect(() => {
        if (!SETUP_FLOW_TYPES.has(config.selectedType)) {
            setIsSetupPanelOpen(false)
        }
    }, [config.selectedType])

    const handleSetIt = async () => {
        const ok = await actions.copyUrl()
        if (!ok) return
        toastManager.add({ description: t("url.copySuccess"), timeout: 3000 })
        setSetupPlatform(selectedDevice.category === "Android" ? "android" : "ios")
        setIsSetupPanelOpen(true)
    }

    const handleCloseSetupPanel = () => {
        setIsSetupPanelOpen(false)
    }

    const cardViewModel = {
        actions,
        config,
        onSetIt: handleSetIt,
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
        <div className="relative h-full min-h-0 overflow-y-auto lg:overflow-hidden">
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
                onClose={handleCloseSetupPanel}
                t={t}
                url={url}
            />
        </div>
    )
}

export { HomeSettingsPane, SETTINGS_CARD_IDS }
