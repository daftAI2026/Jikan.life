/**
 * [INPUT]: 依赖 @cloudflare/kumo(Button/Input/Select), workspace 配置 hook 返回的 view model
 * [OUTPUT]: 对外提供 RegistrySettingsPane 组件（Make it yours 属性配置面板）
 * [POS]: registry/sections/workspace 的右侧设置面板，承载 location/language/colors/device/url 与 life|goal 条件字段
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { Button, Input, Select } from "@cloudflare/kumo"

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
                        <label className="flex items-baseline justify-between text-sm">
                            <span className="font-medium text-kumo-default">{t("config.location")}</span>
                            <span className="text-xs text-kumo-subtle">{t("config.locationHint")}</span>
                        </label>
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
                        <label className="flex items-baseline justify-between text-sm">
                            <span className="font-medium text-kumo-default">{t("config.wallpaperLang")}</span>
                            <span className="text-xs text-kumo-subtle invisible">
                                {t("config.locationHint")}
                            </span>
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
                            <Input
                                type="date"
                                value={config.dob}
                                onChange={(event) => actions.setDob(event.target.value)}
                                disabled={!typeReady}
                            />
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
                    <div className="grid grid-cols-1 gap-5 rounded-lg border border-kumo-line bg-kumo-control p-5 xl:grid-cols-2">
                        <div className="space-y-4">
                            <label className="block text-sm font-medium text-kumo-default">
                                {t("config.goalName")}
                            </label>
                            <Input
                                value={config.goalName}
                                onChange={(event) => actions.setGoalName(event.target.value)}
                                placeholder={t("placeholder.goalName")}
                                disabled={!typeReady}
                            />
                        </div>
                        <div className="space-y-4">
                            <label className="block text-sm font-medium text-kumo-default">
                                {t("config.targetDate")}
                            </label>
                            <Input
                                type="date"
                                value={config.goalDate}
                                onChange={(event) => actions.setGoalDate(event.target.value)}
                                disabled={!typeReady}
                            />
                        </div>
                    </div>
                )}

                <div className="space-y-4">
                    <label className="text-sm font-medium text-kumo-default">{t("config.colors")}</label>
                    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                        <div className="space-y-4">
                            <span className="text-xs text-kumo-subtle">{t("config.background")}</span>
                            <div className="flex items-center gap-2">
                                <input
                                    type="color"
                                    value={config.bgColor}
                                    onChange={(event) => actions.setBackgroundColor(event.target.value)}
                                    className="h-9 w-11 rounded border border-kumo-line bg-transparent p-1"
                                    aria-label={t("config.background")}
                                    disabled={!typeReady}
                                />
                                <Input
                                    value={config.bgColor}
                                    onChange={(event) => actions.setBackgroundColor(event.target.value)}
                                    disabled={!typeReady}
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <span className="text-xs text-kumo-subtle">{t("config.accent")}</span>
                            <div className="flex items-center gap-2">
                                <input
                                    type="color"
                                    value={config.originalAccentColor}
                                    onChange={(event) => actions.setAccentColor(event.target.value)}
                                    className="h-9 w-11 rounded border border-kumo-line bg-transparent p-1"
                                    aria-label={t("config.accent")}
                                    disabled={!typeReady}
                                />
                                <Input
                                    value={config.originalAccentColor}
                                    onChange={(event) => actions.setAccentColor(event.target.value)}
                                    disabled={!typeReady}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {palettePresets.map((preset) => (
                            <Button
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
                            </Button>
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
                        {deviceOptions.map((name) => (
                            <Select.Option key={name} value={name}>
                                {name}
                            </Select.Option>
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
                        <Button
                            variant="secondary"
                            className="shrink-0"
                            onClick={() => void actions.copyUrl()}
                            disabled={!typeReady}
                        >
                            {copied ? t("url.copied") : t("url.copy")}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export { RegistrySettingsPane }
