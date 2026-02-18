/**
 * [INPUT]: 依赖 @/components/ui/kumo(Button/Input/Select), @/components/ui/(color-picker/date-picker/datefield/calendar/field/button), @internationalized/date, workspace 配置 hook 返回的 view model
 * [OUTPUT]: 对外提供 RegistrySettingsPane 组件（Make it yours 属性配置面板）
 * [POS]: registry/sections/workspace 的右侧设置面板，承载 location/language/colors/device/url 与 life|goal 条件字段
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { Button as KumoButton, Input, Select } from "@/components/ui/kumo"
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

function getLocalTodayISO() {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, "0")
    const day = String(now.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
}

function RegistrySettingsPane({
    t,
    config,
    copied,
    selectedDevice,
    palettePresets,
    countryOptions,
    languageOptions,
    deviceOptions,
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
        <div className="h-full overflow-y-auto px-8 py-8">
            <div className="mx-auto w-full max-w-[760px] space-y-8">
                <div className="space-y-3">
                    <p className="text-xs font-semibold tracking-[0.2em] text-kumo-subtle uppercase">
                        {t("customize.header")}
                    </p>
                    <h2 className="text-5xl leading-none font-semibold tracking-tight text-kumo-strong">
                        {t("customize.title")}
                    </h2>
                </div>

                <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                    <div className="space-y-4">
                        <Label tooltip={t("config.locationTooltip")}>
                            {t("config.location")}
                        </Label>
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
                        <label className="block text-sm font-medium text-kumo-default">
                            {t("config.wallpaperLang")}
                        </label>
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
                            <label className="block text-sm font-medium text-kumo-default">
                                {t("config.goalName")}
                            </label>
                            <Input
                                className="w-full"
                                value={config.goalName}
                                onChange={(event) => actions.setGoalName(event.target.value)}
                                placeholder={t("placeholder.goalName")}
                                disabled={!typeReady}
                            />
                        </div>
                        <div className="space-y-4">
                            <label className="block text-sm font-medium text-kumo-default">
                                {t("config.startDate")}
                            </label>
                            {renderDatePickerField({
                                value: config.goalStart,
                                onChange: actions.setGoalStart,
                                minValue: GOAL_START_MIN_ISO,
                                maxValue: todayISO,
                            })}
                            {config.goalStartError && (
                                <p className="text-xs text-kumo-warning">{t(config.goalStartError)}</p>
                            )}
                        </div>
                        <div className="space-y-4">
                            <label className="block text-sm font-medium text-kumo-default">
                                {t("config.targetDate")}
                            </label>
                            {renderDatePickerField({
                                value: config.goalDate,
                                onChange: actions.setGoalDate,
                                minValue: todayISO,
                                maxValue: GOAL_TARGET_MAX_ISO,
                            })}
                            {config.goalDateError && (
                                <p className="text-xs text-kumo-warning">{t(config.goalDateError)}</p>
                            )}
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
                        {['iPhone', 'Android', 'iPad'].map((category) => (
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
        </div>
    )
}

export { RegistrySettingsPane }
