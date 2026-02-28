/**
 * [INPUT]: 无外部依赖（纯函数文本映射）
 * [OUTPUT]: 对外提供 getWallpaperText/getWallpaperFontFamily
 * [POS]: shared/ 壁纸渲染文本核心，服务 renderer 与 worker 的同构文案输出
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
        daysLeftLabel: '天',
        dayLeftLabel: '天',
        goalDefault: '目标',
        complete: '进度 {n}%',
        weeksLeft: '剩余 {n} 周',
        weekLeft: '剩余 {n} 周',
        lived: '已度过 {n}%',
    },
    'zh-TW': {
        daysLeft: '剩餘 {n} 天',
        dayLeft: '剩餘 {n} 天',
        daysLeftLabel: '天',
        dayLeftLabel: '天',
        goalDefault: '目標',
        complete: '進度 {n}%',
        weeksLeft: '剩餘 {n} 週',
        weekLeft: '剩餘 {n} 週',
        lived: '已度過 {n}%',
    },
    ja: {
        daysLeft: '残り {n} 日',
        dayLeft: '残り {n} 日',
        daysLeftLabel: '日',
        dayLeftLabel: '日',
        goalDefault: '目標',
        complete: '{n}% 完了',
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

export function getWallpaperFontFamily(lang = 'en') {
    return WALLPAPER_FONT_FAMILY[lang] || WALLPAPER_FONT_FAMILY.en;
}
