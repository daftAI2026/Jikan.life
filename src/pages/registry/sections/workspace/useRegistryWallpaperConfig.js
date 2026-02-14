/**
 * [INPUT]: 依赖 react hooks, @/lib/I18nContext, @/data/countries, @/data/devices, shared/palettes, shared/wallpaper-core
 * [OUTPUT]: 对外提供 useRegistryWallpaperConfig hook（统一管理 preview|settings 的配置状态与动作）
 * [POS]: registry/sections/workspace 的状态核心，作为 selectedStyle -> wallpaper config 的单一真相源
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { useCallback, useEffect, useMemo, useState } from "react"
import { countries, getTimezone } from "@/data/countries"
import { devices, getDevice } from "@/data/devices"
import { LANGUAGE_META } from "@/data/i18n"
import { useI18n } from "@/lib/I18nContext"
import { DEFAULT_PALETTE, PALETTE_PRESETS } from "../../../../../shared/palettes"
import {
    getSafeAccent,
    isValidISODateString,
    validateGoalDateInputs
} from "../../../../../shared/wallpaper-core"

const STYLE_TO_TYPE = {
    year: "year",
    life: "life",
    goal: "goal",
}

function normalizeHexColor(value, fallback) {
    if (typeof value !== "string") return fallback
    const trimmed = value.trim()
    if (!/^#([0-9a-fA-F]{6})$/.test(trimmed)) return fallback
    return trimmed.toUpperCase()
}

function getFlagEmoji(code) {
    const codePoints = code
        .toUpperCase()
        .split("")
        .map((char) => 127397 + char.charCodeAt(0))
    return String.fromCodePoint(...codePoints)
}

function getInitialConfig(selectedType) {
    const bgColor = normalizeHexColor(DEFAULT_PALETTE.bg, "#000000")
    const originalAccentColor = normalizeHexColor(DEFAULT_PALETTE.accent, "#FFFFFF")
    const accentColor = getSafeAccent(bgColor, originalAccentColor)

    return {
        selectedType,
        country: "",
        timezone: "",
        wallpaperLang: "en",
        bgColor,
        accentColor,
        originalAccentColor,
        dob: "",
        lifespan: 80,
        goalName: "",
        goalStart: "",
        goalDate: "",
        goalStartError: "",
        goalDateError: "",
        device: "iPhone 17 Pro Max",
    }
}

function clampLifespan(value) {
    const numeric = Number.parseInt(value, 10)
    if (Number.isNaN(numeric)) return 80
    return Math.min(120, Math.max(50, numeric))
}

function resolveSelectedType(selectedStyle) {
    return STYLE_TO_TYPE[selectedStyle] ?? "year"
}

function getLocalTodayISO() {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, "0")
    const day = String(now.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
}

function useRegistryWallpaperConfig({ selectedStyle }) {
    const { t } = useI18n()
    const selectedType = resolveSelectedType(selectedStyle)
    const [config, setConfig] = useState(() => getInitialConfig(selectedType))
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        setConfig((prev) => ({ ...prev, selectedType }))
    }, [selectedType])

    useEffect(() => {
        try {
            const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
            const country = countries.find((entry) => entry.timezone === timezone)
            setConfig((prev) => ({
                ...prev,
                country: country?.code ?? prev.country,
                timezone: country?.timezone ?? timezone ?? prev.timezone,
            }))
        } catch {
            // ignore auto-detect failures
        }
    }, [])

    const selectedDevice = useMemo(() => getDevice(config.device) ?? devices[0], [config.device])
    const palettePresets = useMemo(
        () =>
            PALETTE_PRESETS.map((preset) => ({
                ...preset,
                bg: normalizeHexColor(preset.bg, "#000000"),
                accent: normalizeHexColor(preset.accent, "#FFFFFF"),
            })),
        []
    )

    const countryOptions = useMemo(
        () =>
            countries.map((country) => ({
                value: country.code,
                label: `${getFlagEmoji(country.code)} ${country.name}`,
            })),
        []
    )

    const languageOptions = useMemo(
        () =>
            LANGUAGE_META.map((meta) => ({
                value: meta.code,
                flag: meta.flag,
                name: t(meta.labelKey),
            })),
        [t]
    )
    const todayISO = getLocalTodayISO()

    const deviceOptions = useMemo(() => devices.map((device) => device.name), [])

    const generateUrl = useCallback(() => {
        if (!config.selectedType) return ""

        const params = new URLSearchParams()
        params.set("type", config.selectedType)
        params.set("bg", config.bgColor.replace("#", ""))
        params.set("accent", config.accentColor.replace("#", ""))
        params.set("width", String(selectedDevice.width))
        params.set("height", String(selectedDevice.height))
        params.set("clockHeight", String(selectedDevice.clockHeight))
        params.set("lang", config.wallpaperLang)

        if (selectedDevice.cols) params.set("cols", String(selectedDevice.cols))
        if (selectedDevice.padding) params.set("padding", String(selectedDevice.padding))
        if (config.country) params.set("country", config.country)
        if (config.timezone) params.set("tz", config.timezone)

        if (config.selectedType === "life" && config.dob) {
            params.set("dob", config.dob)
            params.set("lifespan", String(clampLifespan(config.lifespan)))
        }

        if (config.selectedType === "goal") {
            const goalDateErrors = validateGoalDateInputs({
                goalStart: config.goalStart,
                goalDate: config.goalDate,
                todayISO
            })
            if (config.goalName.trim()) params.set("goalName", encodeURIComponent(config.goalName.trim()))
            if (config.goalStart && !goalDateErrors.goalStartError) params.set("goalStart", config.goalStart)
            if (config.goalDate && !goalDateErrors.goalDateError) params.set("goal", config.goalDate)
        }

        const origin = typeof window !== "undefined" ? window.location.origin : "https://jikan.life"
        return `${origin}/generate?${params.toString()}`
    }, [config, selectedDevice, todayISO])

    const updateConfig = useCallback((updater) => {
        setConfig((prev) => {
            const next = typeof updater === "function" ? updater(prev) : { ...prev, ...updater }
            const bgColor = normalizeHexColor(next.bgColor, prev.bgColor)
            const originalAccentColor = normalizeHexColor(next.originalAccentColor, next.accentColor)
            const accentColor = getSafeAccent(bgColor, originalAccentColor)
            return {
                ...next,
                bgColor,
                originalAccentColor,
                accentColor,
            }
        })
    }, [])

    const actions = useMemo(
        () => ({
            setCountry(value) {
                updateConfig((prev) => ({
                    ...prev,
                    country: value,
                    timezone: getTimezone(value),
                }))
            },
            setWallpaperLang(value) {
                updateConfig({ wallpaperLang: value })
            },
            setBackgroundColor(value) {
                updateConfig({ bgColor: value })
            },
            setAccentColor(value) {
                updateConfig({ originalAccentColor: value })
            },
            applyPalette(bg, accent) {
                updateConfig({
                    bgColor: bg,
                    originalAccentColor: accent,
                })
            },
            setDob(value) {
                updateConfig({ dob: value })
            },
            setLifespan(value) {
                updateConfig({ lifespan: value })
            },
            normalizeLifespan() {
                updateConfig((prev) => ({ ...prev, lifespan: clampLifespan(prev.lifespan) }))
            },
            setGoalName(value) {
                updateConfig({ goalName: value })
            },
            setGoalStart(value) {
                updateConfig((prev) => {
                    if (!value) {
                        const next = { ...prev, goalStart: "" }
                        const nextErrors = validateGoalDateInputs({
                            goalStart: next.goalStart,
                            goalDate: next.goalDate,
                            todayISO
                        })
                        return {
                            ...next,
                            goalStartError: nextErrors.goalStartError,
                            goalDateError: nextErrors.goalDateError
                        }
                    }

                    if (!isValidISODateString(value)) {
                        return { ...prev, goalStartError: "error.goalStart.outOfRange" }
                    }

                    const nextErrors = validateGoalDateInputs({
                        goalStart: value,
                        goalDate: prev.goalDate,
                        todayISO
                    })
                    if (nextErrors.goalStartError) {
                        return {
                            ...prev,
                            goalStartError: nextErrors.goalStartError,
                            goalDateError: nextErrors.goalDateError || prev.goalDateError
                        }
                    }

                    return {
                        ...prev,
                        goalStart: value,
                        goalStartError: nextErrors.goalStartError,
                        goalDateError: nextErrors.goalDateError
                    }
                })
            },
            setGoalDate(value) {
                updateConfig((prev) => {
                    if (!value) {
                        const next = { ...prev, goalDate: "" }
                        const nextErrors = validateGoalDateInputs({
                            goalStart: next.goalStart,
                            goalDate: next.goalDate,
                            todayISO
                        })
                        return {
                            ...next,
                            goalStartError: nextErrors.goalStartError,
                            goalDateError: nextErrors.goalDateError
                        }
                    }

                    if (!isValidISODateString(value)) {
                        return { ...prev, goalDateError: "error.goalDate.outOfRange" }
                    }

                    const nextErrors = validateGoalDateInputs({
                        goalStart: prev.goalStart,
                        goalDate: value,
                        todayISO
                    })
                    if (nextErrors.goalDateError) {
                        return {
                            ...prev,
                            goalStartError: nextErrors.goalStartError || prev.goalStartError,
                            goalDateError: nextErrors.goalDateError
                        }
                    }

                    return {
                        ...prev,
                        goalDate: value,
                        goalStartError: nextErrors.goalStartError,
                        goalDateError: nextErrors.goalDateError
                    }
                })
            },
            setDevice(value) {
                updateConfig({ device: value })
            },
            async copyUrl() {
                const url = generateUrl()
                if (!url) return false

                try {
                    await navigator.clipboard.writeText(url)
                    setCopied(true)
                    window.setTimeout(() => setCopied(false), 1500)
                    return true
                } catch {
                    setCopied(false)
                    return false
                }
            },
        }),
        [generateUrl, todayISO, updateConfig]
    )

    return {
        t,
        config,
        copied,
        selectedDevice,
        palettePresets,
        countryOptions,
        languageOptions,
        deviceOptions,
        url: generateUrl(),
        actions,
    }
}

export { useRegistryWallpaperConfig }
