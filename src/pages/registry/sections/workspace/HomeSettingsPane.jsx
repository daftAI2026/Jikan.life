/**
 * [INPUT]: 依赖 SettingsCardShell、@/components/ui/kumo(Button/Input/Select/Collapsible)、旧表单链路(@/components/ui/color-picker/date-picker/datefield/calendar/field/button)、@internationalized/date
 * [OUTPUT]: 对外提供 HomeSettingsPane（右侧六卡视觉骨架，采用 CARD_REGISTRY + CARD_ORDER_BY_TYPE 双层结构并维持业务ID+legacy兼容；Goal 模式第3卡接入 goal-fields）与 SETTINGS_CARD_IDS 常量；开发态可通过 legacySettings=1 挂载旧表单
 * [POS]: registry/sections/workspace 的右侧设置面板，使用“业务语义层 + 位置编排层”驱动六卡迁移；当前保留 LegacySettingsForm 作为逐卡接入兜底
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { Button as KumoButton, Collapsible, Input, Select } from "@/components/ui/kumo"
import { Select as SelectBase } from "@base-ui/react/select"
import { Label } from "@/components/ui/field"
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

const SETTINGS_CARD_IDS = ["location", "wallpaper-lang", "colors", "device", "palettes", "url"]
const GOAL_SETTINGS_CARD_IDS = ["location", "wallpaper-lang", "goal-fields", "colors", "device", "url"]
const SETTINGS_CARD_MARKS = ["①", "②", "③", "④", "⑤", "⑥"]
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
        legacyId: "basics",
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
        legacyId: "type-params",
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
        legacyId: "goal-fields",
        title: "Goal",
        render: ({ actions, config, t, todayISO }) => (
            <div className="flex w-full max-w-full flex-col items-center gap-3 px-4 py-1">
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
    colors: {
        legacyId: "colors",
        titleKey: "config.colors",
        render: ({ actions, config, palettePresets, t }) => (
            <div className="flex w-full max-w-full flex-col items-center gap-3 px-4 py-1">
                <div className="w-[200px] max-w-full space-y-1.5">
                    <p className="text-xs text-kumo-subtle">{t("config.background")}</p>
                    <ColorPicker
                        className="w-[200px] max-w-full"
                        value={config.bgColor}
                        onChange={(value) => actions.setBackgroundColor(value)}
                    />
                </div>
                <div className="w-[200px] max-w-full space-y-1.5">
                    <p className="text-xs text-kumo-subtle">{t("config.accent")}</p>
                    <ColorPicker
                        className="w-[200px] max-w-full"
                        value={config.accentColor}
                        onChange={(value) => actions.setAccentColor(value)}
                    />
                </div>
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
        ),
    },
    palettes: {
        legacyId: "palettes",
        title: "Input (with validation)",
        render: () => (
            <Input
                label="Email"
                placeholder="name@example.com"
                type="email"
                variant="error"
            />
        ),
    },
    device: {
        legacyId: "device",
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
        legacyId: "url",
        title: "Collapsible",
        render: () => (
            <Collapsible label="What is Kumo?">
                Kumo is Cloudflare&apos;s component library.
            </Collapsible>
        ),
    },
}

const CARD_ORDER_BY_TYPE = {
    year: SETTINGS_CARD_IDS,
    life: SETTINGS_CARD_IDS,
    goal: GOAL_SETTINGS_CARD_IDS,
}

function resolveCardOrderByType(selectedType) {
    if (selectedType && CARD_ORDER_BY_TYPE[selectedType]) return CARD_ORDER_BY_TYPE[selectedType]
    return CARD_ORDER_BY_TYPE.year
}

function getLocalTodayISO() {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, "0")
    const day = String(now.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
}

/* ==================== 旧表单开关：仅开发态 + URL 参数 ==================== */
function shouldShowLegacySettings() {
    if (!import.meta.env.DEV || typeof window === "undefined") return false
    const params = new URLSearchParams(window.location.search)
    return params.get("legacySettings") === "1"
}

function LegacySettingsForm({
    t,
    config,
    copied,
    selectedDevice,
    palettePresets,
    countryOptions,
    languageOptions,
    url,
    actions,
}) {
    const typeReady = Boolean(config.selectedType)
    const todayISO = getLocalTodayISO()
    const dateFieldGroupClassName =
        "flex h-9 w-full items-center gap-2 rounded-lg border-0 bg-kumo-control px-3 text-base ring ring-kumo-line shadow-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 data-[focus-within]:ring-1 data-[focus-within]:ring-kumo-ring data-[focus-within]:ring-offset-0"
    const dateInputClassName = "min-w-0 flex-1 bg-transparent px-0 text-base text-kumo-default whitespace-nowrap"
    const dateTriggerClassName =
        "size-5 shrink-0 self-center bg-transparent p-0 text-kumo-default hover:bg-transparent focus-visible:ring-0"
    const renderDatePickerField = ({ value, onChange, minValue, maxValue }) => (
        <DatePicker
            className="w-full"
            value={value ? parseDate(value) : null}
            onChange={(date) => onChange(date ? date.toString() : "")}
            minValue={minValue ? parseDate(minValue) : undefined}
            maxValue={maxValue ? parseDate(maxValue) : undefined}
            isDisabled={!typeReady}
        >
            <FieldGroup className={dateFieldGroupClassName} variant="ghost">
                <DateInput className={dateInputClassName} variant="ghost" />
                <Button slot="trigger" variant="ghost" size="icon" className={dateTriggerClassName}>
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

    return (
        <div className="space-y-8 rounded-xl ring ring-kumo-line bg-kumo-recessed p-6">
            <div className="space-y-3">
                <p className="text-xs font-semibold tracking-[0.2em] text-kumo-subtle uppercase">{t("customize.header")}</p>
                <h2 className="text-3xl leading-none font-semibold tracking-tight text-kumo-strong">Legacy Settings</h2>
            </div>

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                <div className="space-y-4">
                    <Label tooltip={t("config.locationTooltip")}>{t("config.location")}</Label>
                    <Select
                        className="w-full"
                        value={config.country}
                        onValueChange={(value) => actions.setCountry(value ?? "")}
                        renderValue={(value) => {
                            if (!value) return t("placeholder.selectCountry")
                            const option = countryOptions.find((item) => item.value === value)
                            return option?.label ?? value
                        }}
                        disabled={!typeReady}
                    >
                        {countryOptions.map((option) => (
                            <Select.Option key={option.value} value={option.value}>
                                {option.label}
                            </Select.Option>
                        ))}
                    </Select>
                </div>

                <div className="space-y-4">
                    <label className="block text-sm font-medium text-kumo-default">{t("config.wallpaperLang")}</label>
                    <Select
                        className="w-full"
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
                        disabled={!typeReady}
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
                </div>
            </div>

            {config.selectedType === "life" && (
                <div className="grid grid-cols-1 gap-5 rounded-lg border border-kumo-line bg-kumo-control p-5 xl:grid-cols-2">
                    <div className="space-y-4">
                        <label className="flex items-baseline justify-between text-sm">
                            <span className="font-medium text-kumo-default">{t("config.dateOfBirth")}</span>
                            <span className="text-xs text-kumo-subtle">{t("config.dateOfBirthHint")}</span>
                        </label>
                        {renderDatePickerField({
                            value: config.dob,
                            onChange: actions.setDob,
                            maxValue: todayISO,
                        })}
                    </div>
                    <div className="space-y-4">
                        <label className="flex items-baseline justify-between text-sm">
                            <span className="font-medium text-kumo-default">{t("config.lifespan")}</span>
                            <span className="text-xs text-kumo-subtle">{t("config.lifespanHint")}</span>
                        </label>
                        <Input
                            type="number"
                            min={50}
                            max={120}
                            value={config.lifespan}
                            onChange={(event) => actions.setLifespan(event.target.value)}
                            onBlur={actions.normalizeLifespan}
                            disabled={!typeReady}
                        />
                    </div>
                </div>
            )}

            {config.selectedType === "goal" && (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-kumo-default">{t("config.goalName")}</label>
                        <Input
                            className="w-full"
                            value={config.goalName}
                            onChange={(event) => actions.setGoalName(event.target.value)}
                            placeholder={t("placeholder.goalName")}
                            disabled={!typeReady}
                        />
                    </div>
                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-kumo-default">{t("config.startDate")}</label>
                        {renderDatePickerField({
                            value: config.goalStart,
                            onChange: actions.setGoalStart,
                            minValue: GOAL_START_MIN_ISO,
                            maxValue: GOAL_TARGET_MAX_ISO,
                        })}
                        {config.goalStartError && <p className="text-xs text-kumo-warning">{t(config.goalStartError)}</p>}
                    </div>
                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-kumo-default">{t("config.targetDate")}</label>
                        {renderDatePickerField({
                            value: config.goalDate,
                            onChange: actions.setGoalDate,
                            minValue: config.goalStart || todayISO,
                            maxValue: GOAL_TARGET_MAX_ISO,
                        })}
                        {config.goalDateError && <p className="text-xs text-kumo-warning">{t(config.goalDateError)}</p>}
                    </div>
                </div>
            )}

            <div className="space-y-4">
                <label className="text-sm font-medium text-kumo-default">{t("config.colors")}</label>
                <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                    <div className="space-y-4">
                        <span className="text-xs text-kumo-subtle">{t("config.background")}</span>
                        <ColorPicker
                            value={config.bgColor}
                            onChange={(value) => actions.setBackgroundColor(value)}
                            disabled={!typeReady}
                        />
                    </div>

                    <div className="space-y-4">
                        <span className="text-xs text-kumo-subtle">{t("config.accent")}</span>
                        <ColorPicker
                            value={config.accentColor}
                            onChange={(value) => actions.setAccentColor(value)}
                            disabled={!typeReady}
                        />
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    {palettePresets.map((preset) => (
                        <KumoButton
                            key={preset.id}
                            variant="secondary"
                            size="sm"
                            onClick={() => actions.applyPalette(preset.bg, preset.accent)}
                            disabled={!typeReady}
                        >
                            <span
                                className="mr-2 inline-block h-3 w-3 rounded-full border border-kumo-line"
                                style={{ backgroundColor: preset.bg }}
                            />
                            <span
                                className="mr-2 inline-block h-3 w-3 rounded-full border border-kumo-line"
                                style={{ backgroundColor: preset.accent }}
                            />
                            {preset.name}
                        </KumoButton>
                    ))}
                </div>
            </div>

            <div className="space-y-4">
                <label className="flex items-baseline justify-between text-sm">
                    <span className="font-medium text-kumo-default">{t("config.device")}</span>
                    <span className="text-xs text-kumo-subtle">
                        {selectedDevice.width} × {selectedDevice.height}
                    </span>
                </label>
                <Select
                    className="w-full"
                    value={config.device}
                    onValueChange={(value) => {
                        if (value) actions.setDevice(value)
                    }}
                    renderValue={(value) => value || config.device}
                    disabled={!typeReady}
                >
                    {["iPhone", "Android", "iPad"].map((category) => (
                        <SelectBase.Group key={category}>
                            <SelectBase.GroupLabel className="px-2 py-1.5 text-base font-medium text-kumo-subtle select-none">
                                {category}
                            </SelectBase.GroupLabel>
                            {devices
                                .filter((d) => d.category === category)
                                .map((d) => (
                                    <Select.Option key={d.name} value={d.name}>
                                        {d.name}
                                    </Select.Option>
                                ))}
                        </SelectBase.Group>
                    ))}
                </Select>
            </div>

            <div className="space-y-4">
                <label className="block text-sm font-medium text-kumo-default">{t("config.url")}</label>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <Input
                        value={url || t("url.placeholder")}
                        readOnly
                        className="min-w-0 flex-1 font-mono text-xs"
                        disabled={!typeReady}
                    />
                    <KumoButton
                        variant="secondary"
                        className="shrink-0"
                        onClick={() => void actions.copyUrl()}
                        disabled={!typeReady}
                    >
                        {copied ? t("url.copied") : t("url.copy")}
                    </KumoButton>
                </div>
            </div>
        </div>
    )
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
    const todayISO = getLocalTodayISO()

    const cardViewModel = {
        actions,
        config,
        selectedDevice,
        palettePresets,
        countryOptions,
        languageOptions,
        todayISO,
        t,
    }
    const cardOrder = resolveCardOrderByType(config.selectedType)

    const showLegacySettings = shouldShowLegacySettings()

    return (
        <div className="h-full min-h-0 overflow-y-auto lg:overflow-hidden">
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
                            legacyCardId={card.legacyId}
                            title={card.titleKey ? t(card.titleKey) : card.title}
                            titleTooltip={card.titleTooltipKey ? t(card.titleTooltipKey) : card.titleTooltip}
                            indexMark={SETTINGS_CARD_MARKS[slotIndex]}
                        >
                            {card.render(cardViewModel)}
                        </SettingsCardShell>
                    )
                })}
            </section>

            {showLegacySettings && (
                <section data-home-settings-legacy className="space-y-3 border-t border-kumo-line bg-kumo-elevated p-6">
                    <p className="text-xs font-medium tracking-[0.14em] text-kumo-subtle uppercase">
                        Legacy form is enabled in dev mode (`legacySettings=1`).
                    </p>
                    <LegacySettingsForm
                        t={t}
                        config={config}
                        copied={copied}
                        selectedDevice={selectedDevice}
                        palettePresets={palettePresets}
                        countryOptions={countryOptions}
                        languageOptions={languageOptions}
                        url={url}
                        actions={actions}
                    />
                </section>
            )}
        </div>
    )
}

export { HomeSettingsPane, SETTINGS_CARD_IDS }
