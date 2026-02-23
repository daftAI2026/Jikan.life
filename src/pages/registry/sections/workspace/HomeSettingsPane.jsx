/**
 * [INPUT]: 依赖 SettingsCardShell、@/components/ui/kumo(Button/Input/Select/Collapsible)、@/components/ui/color-picker/date-picker/datefield/calendar/field/button、@internationalized/date
 * [OUTPUT]: 对外提供 HomeSettingsPane（右侧设置面板，采用 CARD_REGISTRY + CARD_ORDER_BY_TYPE 双层结构并输出业务ID选择器；Year 模式完成 5+6 合并为第⑤宽卡 Set 收口，Goal/Life 模式在第③卡承载专属字段并保持第⑥卡 Set 收口）与 SETTINGS_CARD_IDS 常量
 * [POS]: registry/sections/workspace 的右侧设置面板，使用“业务语义层 + 位置编排层”驱动六卡迁移
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { useEffect, useState } from "react"
import { Button as KumoButton, Collapsible, Input, Select } from "@/components/ui/kumo"
import { Select as SelectBase } from "@base-ui/react/select"
import { devices } from "@/data/devices"
import { Calendar as CalendarIcon } from "@phosphor-icons/react"
import { ColorPicker } from "@/components/ui/color-picker"
import { DatePicker, DatePickerContent } from "@/components/ui/date-picker"
import { DateInput } from "@/components/ui/datefield"
import {
    Calendar,
    CalendarCell,
    CalendarGrid,
    CalendarGridBody,
    CalendarGridHeader,
    CalendarHeaderCell,
    CalendarHeading,
    MonthYearPicker,
} from "@/components/ui/calendar"
import { FieldGroup } from "@/components/ui/field"
import { Button } from "@/components/ui/button"
import { parseDate } from "@internationalized/date"
import { GOAL_START_MIN_ISO, GOAL_TARGET_MAX_ISO } from "../../../../../shared/wallpaper-core"
import { SettingsCardShell } from "./SettingsCardShell"
import { SetupGuidePanel } from "./SetupGuidePanel"

const YEAR_SETTINGS_CARD_IDS = ["location", "wallpaper-lang", "colors", "device", "url"]
const LIFE_SETTINGS_CARD_IDS = ["location", "wallpaper-lang", "life-fields", "colors", "device", "url"]
const GOAL_SETTINGS_CARD_IDS = ["location", "wallpaper-lang", "goal-fields", "colors", "device", "url"]
const SETTINGS_CARD_IDS = LIFE_SETTINGS_CARD_IDS
const SETTINGS_CARD_MARKS = ["①", "②", "③", "④", "⑤", "⑥"]
const SETUP_FLOW_TYPES = new Set(["year", "goal"])
const CARD_SHELL_CLASS_BY_TYPE = {
    year: {
        url: "md:col-span-2",
    },
}
const CARD_DATE_FIELD_GROUP_CLASS_NAME =
    "flex h-9 w-[200px] max-w-full items-center gap-2 rounded-lg border-0 bg-kumo-control px-3 text-base ring ring-kumo-line shadow-none data-[focus-within]:ring-1 data-[focus-within]:ring-kumo-ring data-[focus-within]:ring-offset-0"
const CARD_DATE_INPUT_CLASS_NAME = "min-w-0 flex-1 bg-transparent px-0 text-base text-kumo-default whitespace-nowrap"
const CARD_DATE_TRIGGER_CLASS_NAME =
    "size-5 shrink-0 self-center bg-transparent p-0 text-kumo-default hover:bg-transparent focus-visible:ring-0"

function SettingsCardDatePickerField({ value, onChange, minValue, maxValue }) {
    return (
        <DatePicker
            className="w-[200px] max-w-full"
            value={value ? parseDate(value) : null}
            onChange={(date) => onChange(date ? date.toString() : "")}
            minValue={minValue ? parseDate(minValue) : undefined}
            maxValue={maxValue ? parseDate(maxValue) : undefined}
        >
            <FieldGroup className={CARD_DATE_FIELD_GROUP_CLASS_NAME} variant="ghost">
                <DateInput className={CARD_DATE_INPUT_CLASS_NAME} variant="ghost" />
                <Button slot="trigger" variant="ghost" size="icon" className={CARD_DATE_TRIGGER_CLASS_NAME}>
                    <CalendarIcon aria-hidden className="size-4" />
                </Button>
            </FieldGroup>
            <DatePickerContent>
                <Calendar>
                    <CalendarHeading />
                    <MonthYearPicker />
                    <CalendarGrid>
                        <CalendarGridHeader>
                            {(day) => <CalendarHeaderCell>{day}</CalendarHeaderCell>}
                        </CalendarGridHeader>
                        <CalendarGridBody>
                            {(date) => <CalendarCell date={date} />}
                        </CalendarGridBody>
                    </CalendarGrid>
                </Calendar>
            </DatePickerContent>
        </DatePicker>
    )
}

const CARD_REGISTRY = {
    location: {
        titleKey: "config.location",
        titleTooltipKey: "config.locationTooltip",
        render: ({ actions, config, countryOptions, t }) => (
            <Select
                className="w-[200px] max-w-full"
                value={config.country}
                onValueChange={(value) => actions.setCountry(value ?? "")}
                renderValue={(value) => {
                    if (!value) return t("placeholder.selectCountry")
                    const option = countryOptions.find((item) => item.value === value)
                    return option?.label ?? value
                }}
            >
                {countryOptions.map((option) => (
                    <Select.Option key={option.value} value={option.value}>
                        {option.label}
                    </Select.Option>
                ))}
            </Select>
        ),
    },
    "wallpaper-lang": {
        titleKey: "config.wallpaperLang",
        render: ({ actions, config, languageOptions }) => (
            <Select
                className="w-[200px] max-w-full"
                value={config.wallpaperLang}
                onValueChange={(value) => {
                    if (value) actions.setWallpaperLang(value)
                }}
                renderValue={(value) => {
                    const option = languageOptions.find((item) => item.value === value)
                    if (!option) return "🇺🇸 English"
                    return (
                        <span className="inline-flex items-center gap-1.5">
                            <span className="leading-none">{option.flag}</span>
                            <span className="leading-none">{option.name}</span>
                        </span>
                    )
                }}
            >
                {languageOptions.map((option) => (
                    <Select.Option key={option.value} value={option.value}>
                        <span className="inline-flex items-center gap-1.5">
                            <span className="leading-none">{option.flag}</span>
                            <span className="leading-none">{option.name}</span>
                        </span>
                    </Select.Option>
                ))}
            </Select>
        ),
    },
    "goal-fields": {
        title: "Goal",
        render: ({ actions, config, t, todayISO }) => (
            <div className="flex w-full max-w-full flex-col items-center gap-4 px-4 py-1">
                <div className="w-[200px] max-w-full space-y-1.5">
                    <p className="text-xs text-kumo-subtle">{t("config.goalName")}</p>
                    <Input
                        className="w-[200px] max-w-full"
                        value={config.goalName}
                        onChange={(event) => actions.setGoalName(event.target.value)}
                        placeholder={t("placeholder.goalName")}
                    />
                </div>
                <div className="w-[200px] max-w-full space-y-1.5">
                    <p className="text-xs text-kumo-subtle">{t("config.startDate")}</p>
                    <SettingsCardDatePickerField
                        value={config.goalStart}
                        onChange={actions.setGoalStart}
                        minValue={GOAL_START_MIN_ISO}
                        maxValue={GOAL_TARGET_MAX_ISO}
                    />
                    {config.goalStartError && <p className="text-xs text-kumo-warning">{t(config.goalStartError)}</p>}
                </div>
                <div className="w-[200px] max-w-full space-y-1.5">
                    <p className="text-xs text-kumo-subtle">{t("config.targetDate")}</p>
                    <SettingsCardDatePickerField
                        value={config.goalDate}
                        onChange={actions.setGoalDate}
                        minValue={config.goalStart || todayISO}
                        maxValue={GOAL_TARGET_MAX_ISO}
                    />
                    {config.goalDateError && <p className="text-xs text-kumo-warning">{t(config.goalDateError)}</p>}
                </div>
            </div>
        ),
    },
    "life-fields": {
        title: "Life",
        render: ({ actions, config, t, todayISO }) => (
            <div className="flex w-full max-w-full flex-col items-center gap-4 px-4 py-1">
                <div className="w-[200px] max-w-full space-y-1.5">
                    <div className="inline-flex items-center gap-1 text-xs text-kumo-subtle">
                        <span>{t("config.dateOfBirth")}</span>
                        <span>{t("config.dateOfBirthHint")}</span>
                    </div>
                    <SettingsCardDatePickerField
                        value={config.dob}
                        onChange={actions.setDob}
                        maxValue={todayISO}
                    />
                </div>
                <div className="w-[200px] max-w-full space-y-1.5">
                    <div className="inline-flex items-center gap-1 text-xs text-kumo-subtle">
                        <span>{t("config.lifespan")}</span>
                        <span>{t("config.lifespanHint")}</span>
                    </div>
                    <Input
                        className="w-[200px] max-w-full"
                        type="number"
                        min={50}
                        max={120}
                        value={config.lifespan}
                        onChange={(event) => actions.setLifespan(event.target.value)}
                        onBlur={actions.normalizeLifespan}
                    />
                </div>
            </div>
        ),
    },
    colors: {
        titleKey: "config.colors",
        render: ({ actions, config, palettePresets, t }) => (
            <div className="flex w-full max-w-full flex-col items-center gap-4 px-4 py-1">
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
                <div className="w-[200px] max-w-full space-y-1.5">
                    <p className="text-xs text-kumo-subtle">{t("config.colorPresets")}</p>
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
                </div>
            </div>
        ),
    },
    device: {
        titleKey: "config.device",
        render: ({ actions, config, selectedDevice, t }) => (
            <div className="flex w-full max-w-full flex-col items-center gap-1.5 py-1">
                <Select
                    className="w-[200px] max-w-full"
                    value={config.device}
                    onValueChange={(value) => {
                        if (value) actions.setDevice(value)
                    }}
                    renderValue={(value) => value || config.device}
                >
                    {["iPhone", "Android", "iPad"].map((category) => (
                        <SelectBase.Group key={category}>
                            <SelectBase.GroupLabel className="px-2 py-1.5 text-base font-medium text-kumo-subtle select-none">
                                {category}
                            </SelectBase.GroupLabel>
                            {devices
                                .filter((device) => device.category === category)
                                .map((device) => (
                                    <Select.Option key={device.name} value={device.name}>
                                        {device.name}
                                    </Select.Option>
                                ))}
                        </SelectBase.Group>
                    ))}
                </Select>
                <p className="w-[200px] max-w-full pl-[12px] text-xs text-kumo-subtle">
                    {selectedDevice.width} × {selectedDevice.height}
                </p>
            </div>
        ),
    },
    url: {
        resolveTitle: ({ config, t }) =>
            SETUP_FLOW_TYPES.has(config.selectedType) ? t("setup.title") : "Collapsible",
        title: "Collapsible",
        render: ({ config, copied, onSetIt, t, url }) => {
            if (config.selectedType === "year") {
                return (
                    <div className="w-full px-4 py-1 md:px-[calc(25%-100px)]">
                        <div className="flex max-w-full flex-col gap-2 md:flex-row md:items-center md:gap-2">
                            <Input
                                value={url || t("url.placeholder")}
                                readOnly
                                className="min-w-0 w-full font-mono text-xs md:flex-1"
                            />
                            <KumoButton
                                variant="secondary"
                                className="min-w-[88px] justify-center px-4 text-center transition-colors not-disabled:hover:!bg-kumo-tint md:shrink-0"
                                onClick={() => void onSetIt()}
                            >
                                {copied ? t("url.copied") : t("url.set")}
                            </KumoButton>
                        </div>
                    </div>
                )
            }

            if (config.selectedType === "goal") {
                return (
                    <div className="flex w-[220px] max-w-full flex-col gap-2 px-3 py-1">
                        <Input
                            value={url || t("url.placeholder")}
                            readOnly
                            className="min-w-0 w-full font-mono text-xs"
                        />
                        <KumoButton
                            variant="secondary"
                            className="w-full justify-center text-center transition-colors not-disabled:hover:!bg-kumo-tint"
                            onClick={() => void onSetIt()}
                        >
                            {copied ? t("url.copied") : t("url.set")}
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
        copied,
        selectedDevice,
        palettePresets,
        countryOptions,
        languageOptions,
        url,
        actions,
    } = props
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
        setSetupPlatform(selectedDevice.category === "Android" ? "android" : "ios")
        setIsSetupPanelOpen(true)
    }

    const handleCloseSetupPanel = () => {
        setIsSetupPanelOpen(false)
    }

    const cardViewModel = {
        actions,
        config,
        copied,
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
            />
        </div>
    )
}

export { HomeSettingsPane, SETTINGS_CARD_IDS }
