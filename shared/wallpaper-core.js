/**
 * [INPUT]: 无依赖（纯函数模块）
 * [OUTPUT]: 布局计算、颜色工具、i18n 文本生成
 * [POS]: shared/ 下的同构核心，供 Frontend Canvas 和 Worker SVG 共享
 * [PROTOCOL]: 变更时同步更新 renderer.js 和 worker/generators/*.js
 */

/* ========================================================================
   Color Utilities
   ======================================================================== */

export function hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function getLuminance(hex) {
    hex = hex.replace('#', '');
    if (hex.length === 3) {
        hex = hex.split('').map(c => c + c).join('');
    }
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;
    const toLinear = (c) => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

export function getContrastBase(bgHex) {
    return getLuminance(bgHex) > 0.5 ? '0,0,0' : '255,255,255';
}

export function contrastAlpha(bgHex, alpha) {
    return `rgba(${getContrastBase(bgHex)}, ${alpha})`;
}

export function isTooClose(hex1, hex2) {
    const l1 = getLuminance(hex1);
    const l2 = getLuminance(hex2);
    const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    return ratio < 2;
}

export function isBlackOrWhite(hex) {
    const luminance = getLuminance(hex);
    return luminance < 0.1 || luminance > 0.9;
}

/**
 * 获取安全的强调色
 * 规则：如果 accentHex 与背景对比度不足，则反转为黑或白
 * 同时返回 original 处理逻辑
 */
export function getSafeAccent(bgHex, accentHex) {
    if (isBlackOrWhite(accentHex) && isTooClose(bgHex, accentHex)) {
        return getLuminance(bgHex) > 0.5 ? '#000000' : '#FFFFFF';
    }
    return accentHex;
}

/**
 * 状态同步建议 (Frontend 使用):
 * 用户原始选择 -> originalAccentColor
 * 自动微调后 -> accentColor
 */

/* ========================================================================
   Date Utilities
   ======================================================================== */

export function getDayOfYear(year, month, day) {
    const date = new Date(year, month - 1, day);
    const start = new Date(year, 0, 0);
    const diff = date - start;
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
}

export function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

export function getDaysInYear(year) {
    return isLeapYear(year) ? 366 : 365;
}

/* ========================================================================
   Wallpaper Text i18n
   ======================================================================== */

const WALLPAPER_TEXT = {
    en: {
        daysLeft: '{n} days left',
        dayLeft: '{n} day left',
        complete: '{n}% complete',
        weeksLeft: '{n} weeks left',
        weekLeft: '{n} week left',
        lived: '{n}% lived',
    },
    'zh-CN': {
        daysLeft: '剩余 {n} 天',
        dayLeft: '剩余 {n} 天',
        complete: '进度 {n}%',
        weeksLeft: '剩余 {n} 周',
        weekLeft: '剩余 {n} 周',
        lived: '已度过 {n}%',
    },
    'zh-TW': {
        daysLeft: '剩餘 {n} 天',
        dayLeft: '剩餘 {n} 天',
        complete: '進度 {n}%',
        weeksLeft: '剩餘 {n} 週',
        weekLeft: '剩餘 {n} 週',
        lived: '已度過 {n}%',
    },
    ja: {
        daysLeft: '残り {n} 日',
        dayLeft: '残り {n} 日',
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

/* ========================================================================
   Year Progress Layout Computation
   ======================================================================== */

/**
 * Compute year progress layout data
 * @returns {Object} Layout data for rendering
 */
export function computeYearLayout(options) {
    const {
        width,
        height,
        bgColor,
        accentColor,
        clockHeight = 0.22,
        lang = 'en',
        year,
        month,
        day
    } = options;

    const dayOfYear = getDayOfYear(year, month, day);
    const totalDays = getDaysInYear(year);

    const cols = 15;
    const rows = Math.ceil(totalDays / cols);

    const clockSpace = height * (clockHeight + 0.05);
    const padding = width * 0.20;

    const availableWidth = width - (padding * 2);
    const gap = Math.max(3, width * 0.008);
    const cellSize = (availableWidth - (gap * (cols - 1))) / cols;
    const dotRadius = (cellSize / 2) * 0.85;

    const gridWidth = (cellSize * cols) + (gap * (cols - 1));
    const gridHeight = (cellSize * rows) + (gap * (rows - 1));
    const startX = (width - gridWidth) / 2;
    const startY = clockSpace + (height * 0.02);

    const safeAccent = getSafeAccent(bgColor, accentColor);

    // Generate dot data
    const dots = [];
    for (let i = 0; i < totalDays; i++) {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const cx = startX + col * (cellSize + gap) + cellSize / 2;
        const cy = startY + row * (cellSize + gap) + cellSize / 2;

        const isCompleted = i < dayOfYear;
        const isToday = i === dayOfYear - 1;

        dots.push({ cx, cy, isCompleted, isToday, radius: isToday ? dotRadius * 1.12 : dotRadius });
    }

    // Stats
    const daysRemaining = totalDays - dayOfYear;
    const progressPercent = Math.round((dayOfYear / totalDays) * 100);
    const statsY = startY + gridHeight + (height * 0.025);

    const daysText = getWallpaperText(lang, daysRemaining === 1 ? 'dayLeft' : 'daysLeft', daysRemaining);
    const completeText = getWallpaperText(lang, 'complete', progressPercent);

    return {
        dots,
        stats: { y: statsY, daysText, completeText, centerX: width / 2 },
        safeAccent,
        bgColor,
        fontSize: width * 0.032
    };
}

/* ========================================================================
   Life Calendar Layout Computation
   ======================================================================== */

export function computeLifeLayout(options) {
    const {
        width,
        height,
        bgColor,
        accentColor,
        clockHeight = 0.22,
        lang = 'en',
        dob,
        lifespan = 80
    } = options;

    const cols = 52;
    const rows = lifespan;

    const clockSpace = height * clockHeight;
    const padding = width * 0.04;
    const statsHeight = height * 0.06;

    const availableWidth = width - (padding * 2);
    const availableHeight = height - clockSpace - statsHeight - (height * 0.05);

    const gap = Math.max(1.5, width * 0.003);
    const cellSize = Math.min(
        (availableWidth - (gap * (cols - 1))) / cols,
        (availableHeight - (gap * (rows - 1))) / rows
    );
    const radius = cellSize / 2 - 0.5;

    let weeksLived = 0;
    if (dob) {
        const dobDate = new Date(dob);
        const now = new Date();
        const msPerWeek = 7 * 24 * 60 * 60 * 1000;
        weeksLived = Math.floor((now - dobDate) / msPerWeek);
    }

    const gridWidth = (cellSize * cols) + (gap * (cols - 1));
    const gridHeight = (cellSize * rows) + (gap * (rows - 1));
    const startX = (width - gridWidth) / 2;
    const startY = clockSpace;

    const totalWeeks = rows * cols;
    const safeAccent = getSafeAccent(bgColor, accentColor);

    // Generate dot data
    const dots = [];
    for (let i = 0; i < totalWeeks; i++) {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const cx = startX + col * (cellSize + gap) + cellSize / 2;
        const cy = startY + row * (cellSize + gap) + cellSize / 2;

        const isLived = i < weeksLived;
        const isCurrentWeek = i === weeksLived;

        dots.push({ cx, cy, isLived, isCurrentWeek, radius });
    }

    // Stats
    const weeksLeft = totalWeeks - weeksLived;
    const percent = Math.round((weeksLived / totalWeeks) * 100);
    const statsY = startY + gridHeight + (height * 0.035);

    const weeksText = getWallpaperText(lang, weeksLeft === 1 ? 'weekLeft' : 'weeksLeft', weeksLeft.toLocaleString());
    const livedText = getWallpaperText(lang, 'lived', percent);

    return {
        dots,
        stats: { y: statsY, weeksText, livedText, centerX: width / 2 },
        safeAccent,
        bgColor,
        fontSize: width * 0.032 * 0.8
    };
}

/* ========================================================================
   Goal Countdown Layout Computation
   ======================================================================== */

export function computeGoalLayout(options) {
    const {
        width,
        height,
        bgColor,
        accentColor,
        clockHeight = 0.22,
        lang = 'en',
        goalDate,
        goalName
    } = options;

    // Center point (adjusted for clock)
    const clockSpace = height * clockHeight;
    const centerX = width / 2;
    const centerY = clockSpace + (height - clockSpace) * 0.4;
    const ringRadius = width * 0.28;

    let daysRemaining = 0;
    let progress = 0;
    if (goalDate) {
        const goal = new Date(goalDate);
        const now = new Date();
        daysRemaining = Math.max(0, Math.ceil((goal - now) / (1000 * 60 * 60 * 24)));
        // 修正：原版 progress 计算逻辑
        const totalDays = Math.max(daysRemaining + 1, 365);
        progress = Math.min(1, 1 - (daysRemaining / totalDays));
    }

    const safeAccent = getSafeAccent(bgColor, accentColor);
    const daysLeftText = getWallpaperText(lang, daysRemaining === 1 ? 'dayLeft' : 'daysLeft', daysRemaining);

    return {
        ring: { centerX, centerY, radius: ringRadius, progress },
        daysRemaining,
        daysLeftText,
        goalName,
        safeAccent,
        bgColor,
        labelY: centerY + (height * 0.08),
        goalNameY: height * 0.75,
        targetDateY: height * 0.77, // 新增
        numberFontSize: width * 0.2, // 修正：原版是 0.2
        labelFontSize: width * 0.04, // 修正：原版是 0.04
        nameFontSize: width * 0.05 // 修正：原版是 0.05
    };
}
