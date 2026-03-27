/**
 * [INPUT]: 依赖 react hooks, @/lib/I18nContext, @/lib/date-utils, @/data/{countries,devices,i18n}, shared/{palettes,random-palette}, workspace/{config-init,config-actions,goal-date-updater,url-builder,view-model-mappers,device-visibility}
 * [OUTPUT]: 对外提供 useHomeWallpaperConfig hook（统一管理 preview|settings 的配置状态与动作）
 * [POS]: registry/sections/workspace 的状态编排核心，管理生命周期/设备/URL/random-preset 桥接并委托 config-actions 产出动作层（支持未选风格空态）
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { useCallback, useEffect, useMemo, useState } from "react"
import { countries, getTimezone } from "@/data/countries"
import { devices, getDevice, normalizeDeviceName } from "@/data/devices"
import { LANGUAGE_META } from "@/data/i18n"
import { getLocalTodayISO } from "@/lib/date-utils"
import { useI18n } from "@/lib/I18nContext"
import { PALETTE_PRESETS } from "../../../../../shared/palettes"
import { generateRandomPalette } from "../../../../../shared/random-palette"
import { PRIMARY_VISIBLE_DEVICE_CATEGORY, isVisibleDeviceCategory } from "./device-visibility"
import {
    clampLifespan,
    getInitialConfig,
    normalizeHexColor,
    resolvePalette,
    resolveSelectedType,
} from "./config-init"
import { createConfigActions } from "./config-actions"
import { applyGoalDateUpdate, applyGoalRangeUpdate, applyGoalStartUpdate } from "./goal-date-updater"
import { buildWallpaperUrl } from "./url-builder"
import { mapCountryOptions, mapLanguageOptions, mapPalettePresets } from "./view-model-mappers"

function useHomeWallpaperConfig({ selectedStyle }) {
    const { t } = useI18n()
    const selectedType = resolveSelectedType(selectedStyle)
    const [config, setConfig] = useState(() => getInitialConfig(selectedType))
    const [randomPaletteCandidate, setRandomPaletteCandidate] = useState(() => generateRandomPalette())

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

    useEffect(() => {
        setConfig((prev) => {
            const normalizedDevice = normalizeDeviceName(prev.device)
            const resolvedDevice = getDevice(normalizedDevice)
            const fallbackVisibleDevice =
                devices.find((device) => device.category === PRIMARY_VISIBLE_DEVICE_CATEGORY)
                ?? devices.find((device) => isVisibleDeviceCategory(device.category))
                ?? devices[0]
            const nextDevice =
                isVisibleDeviceCategory(resolvedDevice?.category)
                    ? normalizedDevice
                    : fallbackVisibleDevice?.name ?? normalizedDevice
            if (nextDevice === prev.device) return prev
            return { ...prev, device: nextDevice }
        })
    }, [])

    const selectedDevice = useMemo(() => {
        const resolvedDevice = getDevice(config.device)
        if (isVisibleDeviceCategory(resolvedDevice?.category)) return resolvedDevice
        return (
            devices.find((device) => device.category === PRIMARY_VISIBLE_DEVICE_CATEGORY)
            ?? devices.find((device) => isVisibleDeviceCategory(device.category))
            ?? devices[0]
        )
    }, [config.device])

    const palettePresets = useMemo(() => mapPalettePresets(PALETTE_PRESETS, normalizeHexColor, randomPaletteCandidate), [randomPaletteCandidate])
    const countryOptions = useMemo(() => mapCountryOptions(countries), [])
    const languageOptions = useMemo(() => mapLanguageOptions(LANGUAGE_META, t), [t])
    const todayISO = getLocalTodayISO()

    const generateUrl = useCallback(() => {
        return buildWallpaperUrl({
            config,
            selectedDevice,
            todayISO,
            clampLifespan,
        })
    }, [config, selectedDevice, todayISO])

    const updateConfig = useCallback((updater) => {
        setConfig((prev) => {
            const next = typeof updater === "function" ? updater(prev) : { ...prev, ...updater }
            return resolvePalette(next, prev)
        })
    }, [])

    const actions = useMemo(() => {
        const actions = createConfigActions({
            updateConfig,
            generateUrl,
            todayISO,
            deps: {
                getTimezone,
                normalizeDeviceName,
                clampLifespan,
                goalUpdateFns: {
                    applyGoalRangeUpdate,
                    applyGoalStartUpdate,
                    applyGoalDateUpdate,
                },
            },
        })

        function applyRandomPalette() {
            const nextPalette = generateRandomPalette()
            setRandomPaletteCandidate(nextPalette)
            actions.applyPalette(nextPalette.bg, nextPalette.accent)
        }

        return {
            ...actions,
            applyRandomPalette,
        }
    }, [generateUrl, todayISO, updateConfig])

    return {
        t,
        config,
        selectedDevice,
        palettePresets,
        countryOptions,
        languageOptions,
        randomPaletteCandidate,
        url: generateUrl(),
        actions,
    }
}

export { useHomeWallpaperConfig }
