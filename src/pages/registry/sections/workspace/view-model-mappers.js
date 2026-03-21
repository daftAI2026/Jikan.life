/**
 * [INPUT]: 依赖 countries、i18n meta、palettes 与设备可见性策略
 * [OUTPUT]: 对外提供 mapPalettePresets、mapCountryOptions、mapLanguageOptions、mapVisibleDevices
 * [POS]: workspace 视图模型映射层，封装 UI option/preset 组装细节
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
function mapPalettePresets(presets, normalizeHexColor) {
    return presets.map((preset) => ({
        ...preset,
        bg: normalizeHexColor(preset.bg, "#000000"),
        accent: normalizeHexColor(preset.accent, "#FFFFFF"),
    }))
}

function getFlagEmoji(code) {
    const codePoints = code
        .toUpperCase()
        .split("")
        .map((char) => 127397 + char.charCodeAt(0))
    return String.fromCodePoint(...codePoints)
}

const COUNTRY_FLAG_OVERRIDES = {
    TW: "🇨🇳",
}

function mapCountryOptions(countries) {
    return countries.map((country) => ({
        value: country.code,
        label: `${COUNTRY_FLAG_OVERRIDES[country.code] ?? getFlagEmoji(country.code)} ${country.name}`,
    }))
}

function mapLanguageOptions(languageMeta, t) {
    return languageMeta.map((meta) => ({
        value: meta.code,
        flag: meta.flag,
        name: t(meta.labelKey),
    }))
}

export { mapCountryOptions, mapLanguageOptions, mapPalettePresets }
