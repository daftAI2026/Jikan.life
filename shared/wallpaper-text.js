/**
 * [INPUT]: 无外部依赖（纯函数文本映射与脚本检测）
 * [OUTPUT]: 对外提供 getWallpaperText/getWallpaperFontFamily/resolveTextFontFamily/resolveFontBufferLanguages
 * [POS]: shared/ 壁纸渲染文本核心，服务 renderer 与 worker 的同构文案输出与多语言 goalName 字体决策
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

/* ========================================================================
   Wallpaper Text i18n
   ======================================================================== */

const WALLPAPER_TEXT = {
    en: {
        daysLeft: '{n} days left',
        dayLeft: '{n} day left',
        daysLeftLabel: 'days left',
        dayLeftLabel: 'day left',
        goalDefault: 'Goal',
        complete: '{n}% complete',
        weeksLeft: '{n} weeks left',
        weekLeft: '{n} week left',
        lived: '{n}% lived',
    },
    'zh-CN': {
        daysLeft: '剩余 {n} 天',
        dayLeft: '剩余 {n} 天',
        daysLeftLabel: '剩余天数',
        dayLeftLabel: '剩余天数',
        goalDefault: '目标',
        complete: '进度 {n}%',
        weeksLeft: '剩余 {n} 周',
        weekLeft: '剩余 {n} 周',
        lived: '已度过 {n}%',
    },
    'zh-TW': {
        daysLeft: '剩餘 {n} 天',
        dayLeft: '剩餘 {n} 天',
        daysLeftLabel: '剩餘天數',
        dayLeftLabel: '剩餘天數',
        goalDefault: '目標',
        complete: '進度 {n}%',
        weeksLeft: '剩餘 {n} 週',
        weekLeft: '剩餘 {n} 週',
        lived: '已度過 {n}%',
    },
    ja: {
        daysLeft: '残り {n} 日',
        dayLeft: '残り {n} 日',
        daysLeftLabel: '残り日数',
        dayLeftLabel: '残り日数',
        goalDefault: '目標',
        complete: '{n}% 経過',
        weeksLeft: '残り {n} 週',
        weekLeft: '残り {n} 週',
        lived: '{n}% 経過',
    },
};

export function getWallpaperText(lang, key, value) {
    const texts = WALLPAPER_TEXT[lang] || WALLPAPER_TEXT['en'];
    const text = texts[key] || WALLPAPER_TEXT['en'][key] || key;
    return text.replace('{n}', value);
}

const WALLPAPER_FONT_FAMILY = {
    en: '"Inter", sans-serif',
    'zh-CN': '"Noto Sans SC", "Inter", sans-serif',
    'zh-TW': '"Noto Sans TC", "Inter", sans-serif',
    ja: '"Noto Sans JP", "Inter", sans-serif'
};

const FONT_FAMILY_BY_LANG = {
    en: ['"Inter"', 'sans-serif'],
    'zh-CN': ['"Noto Sans SC"', '"Inter"', 'sans-serif'],
    'zh-TW': ['"Noto Sans TC"', '"Inter"', 'sans-serif'],
    ja: ['"Noto Sans JP"', '"Inter"', 'sans-serif'],
}

const PRIMARY_FONT_BY_LANG = {
    en: '"Inter"',
    'zh-CN': '"Noto Sans SC"',
    'zh-TW': '"Noto Sans TC"',
    ja: '"Noto Sans JP"',
}

const HIRAGANA_OR_KATAKANA_REGEX = /[\u3040-\u30FF]/
const HAN_REGEX = /[\u3400-\u4DBF\u4E00-\u9FFF\uF900-\uFAFF]/

export function getWallpaperFontFamily(lang = 'en') {
    return WALLPAPER_FONT_FAMILY[lang] || WALLPAPER_FONT_FAMILY.en;
}

function pushUnique(list, value) {
    if (value && !list.includes(value)) list.push(value)
}

function resolveGoalTextLanguages(lang = 'en', text = '') {
    const normalized = typeof text === 'string' ? text.trim() : ''
    if (!normalized) return []

    const resolved = []
    const hasKana = HIRAGANA_OR_KATAKANA_REGEX.test(normalized)
    const hasHan = HAN_REGEX.test(normalized)

    if (hasKana) pushUnique(resolved, 'ja')

    if (hasHan) {
        if (hasKana) {
            pushUnique(resolved, lang === 'zh-TW' ? 'zh-TW' : lang === 'ja' ? 'ja' : 'zh-CN')
        } else if (lang === 'ja') {
            pushUnique(resolved, 'ja')
        } else if (lang === 'zh-TW') {
            pushUnique(resolved, 'zh-TW')
        } else {
            pushUnique(resolved, 'zh-CN')
        }
    }

    return resolved
}

export function resolveFontBufferLanguages(lang = 'en', text = '') {
    const resolved = []
    const baseLang = lang === 'zh-CN' || lang === 'zh-TW' || lang === 'ja' ? lang : null
    const textLangs = resolveGoalTextLanguages(lang, text)

    textLangs.forEach((fontLang) => pushUnique(resolved, fontLang))
    pushUnique(resolved, baseLang)

    return resolved
}

export function resolveTextFontFamily(lang = 'en', text = '') {
    const fontLanguages = resolveFontBufferLanguages(lang, text)

    if (fontLanguages.length === 0) return getWallpaperFontFamily(lang)

    const familyParts = []
    fontLanguages.forEach((fontLang) => pushUnique(familyParts, PRIMARY_FONT_BY_LANG[fontLang]))
    pushUnique(familyParts, PRIMARY_FONT_BY_LANG.en)
    pushUnique(familyParts, 'sans-serif')

    return familyParts.join(', ')
}
