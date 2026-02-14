/**
 * [INPUT]: 无依赖（纯函数模块）
 * [OUTPUT]: 布局计算（**Year 支持 cols/padding 覆盖**）、日期/颜色工具、i18n 文本生成
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

const MS_PER_DAY = 1000 * 60 * 60 * 24;
const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
export const GOAL_START_MIN_ISO = '1900-01-01';
export const GOAL_TARGET_MAX_ISO = '2100-12-31';

function isValidDateParts(year, month, day) {
    if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) return false;
    const date = new Date(Date.UTC(year, month - 1, day));
    return (
        date.getUTCFullYear() === year &&
        date.getUTCMonth() + 1 === month &&
        date.getUTCDate() === day
    );
}

export function toDayNumber({ year, month, day }) {
    return Math.floor(Date.UTC(year, month - 1, day) / MS_PER_DAY);
}

export function isValidISODateString(value) {
    if (typeof value !== 'string' || !ISO_DATE_REGEX.test(value)) return false;
    const [year, month, day] = value.split('-').map(Number);
    return isValidDateParts(year, month, day);
}

export function isISODateInRange(value, { min, max } = {}) {
    if (!isValidISODateString(value)) return false;
    if (min && (!isValidISODateString(min) || value < min)) return false;
    if (max && (!isValidISODateString(max) || value > max)) return false;
    return true;
}

export function validateGoalDateInputs({ goalStart, goalDate, todayISO }) {
    const errors = {
        goalStartError: '',
        goalDateError: ''
    };

    if (!isValidISODateString(todayISO)) {
        return errors;
    }

    if (goalStart && goalDate && isValidISODateString(goalStart) && isValidISODateString(goalDate) && goalStart > goalDate) {
        errors.goalStartError = 'error.goalStart.afterTarget';
        errors.goalDateError = 'error.goalDate.beforeStart';
        return errors;
    }

    if (goalStart) {
        const isValidStart = isISODateInRange(goalStart, {
            min: GOAL_START_MIN_ISO,
            max: todayISO
        });
        if (!isValidStart) {
            errors.goalStartError = 'error.goalStart.outOfRange';
        }
    }

    if (goalDate) {
        const isValidTarget = isISODateInRange(goalDate, {
            min: todayISO,
            max: GOAL_TARGET_MAX_ISO
        });
        if (!isValidTarget) {
            errors.goalDateError = 'error.goalDate.outOfRange';
        }
    }

    return errors;
}

function normalizeDateInput(input) {
    if (!input) return null;
    if (typeof input === 'string') {
        const parts = input.split('-');
        if (parts.length !== 3) return null;
        const year = Number(parts[0]);
        const month = Number(parts[1]);
        const day = Number(parts[2]);
        if (!isValidDateParts(year, month, day)) return null;
        return { year, month, day };
    }

    if (typeof input === 'object' && typeof input.year === 'number' && typeof input.month === 'number' && typeof input.day === 'number') {
        if (!isValidDateParts(input.year, input.month, input.day)) return null;
        return { year: input.year, month: input.month, day: input.day };
    }

    const date = new Date(input);
    if (Number.isNaN(date.getTime())) return null;
    return { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() };
}

function getLocalToday() {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
}

function clampNumber(value, min, max) {
    return Math.min(max, Math.max(min, value));
}

export function getDayOfYear(year, month, day) {
    const dayNumber = toDayNumber({ year, month, day });
    const startOfYear = toDayNumber({ year, month: 1, day: 1 });
    return dayNumber - startOfYear + 1;
}

export function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

export function getDaysInYear(year) {
    return isLeapYear(year) ? 366 : 365;
}

/**
 * Format goal date for display
 * @param {string} dateStr - ISO date string (YYYY-MM-DD)
 * @param {string} lang - Language code
 * @returns {string} Formatted date string
 */
export function formatGoalDate(dateStr, lang = 'en') {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return '';

    const localeMap = {
        'en': 'en-US',
        'zh-CN': 'zh-CN',
        'zh-TW': 'zh-TW',
        'ja': 'ja-JP'
    };
    const locale = localeMap[lang] || 'en-US';

    return date.toLocaleDateString(locale, {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });
}

/* ========================================================================
   Wallpaper Text i18n
   ======================================================================== */

const WALLPAPER_TEXT = {
    en: {
        daysLeft: '{n} days left',
        dayLeft: '{n} day left',
        daysLeftLabel: 'days left',
        dayLeftLabel: 'day left',
        complete: '{n}% complete',
        weeksLeft: '{n} weeks left',
        weekLeft: '{n} week left',
        lived: '{n}% lived',
    },
    'zh-CN': {
        daysLeft: '剩余 {n} 天',
        dayLeft: '剩余 {n} 天',
        daysLeftLabel: '天剩余',
        dayLeftLabel: '天剩余',
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
        complete: '進度 {n}%',
        weeksLeft: '剩餘 {n} 週',
        weekLeft: '剩餘 {n} 週',
        lived: '已度過 {n}%',
    },
    ja: {
        daysLeft: '残り {n} 日',
        dayLeft: '残り {n} 日',
        daysLeftLabel: '日残り',
        dayLeftLabel: '日残り',
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
        day,
        cols: optCols,
        padding: optPadding
    } = options;

    const dayOfYear = getDayOfYear(year, month, day);
    const totalDays = getDaysInYear(year);

    // ========== 设备级参数 (支持覆盖) ==========
    const cols = optCols ?? 15;
    const paddingRatio = optPadding ?? 0.20;

    const rows = Math.ceil(totalDays / cols);

    const clockSpace = height * (clockHeight + 0.05);
    const padding = width * paddingRatio;

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
        lifespan = 80,
        today
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
    const radius = Math.max(0, cellSize / 2 - 0.5);

    const gridWidth = (cellSize * cols) + (gap * (cols - 1));
    const gridHeight = (cellSize * rows) + (gap * (rows - 1));
    const startX = (width - gridWidth) / 2;
    const startY = clockSpace;

    const totalWeeks = rows * cols;
    const safeAccent = getSafeAccent(bgColor, accentColor);

    const todayDate = normalizeDateInput(today) || getLocalToday();
    const dobDate = normalizeDateInput(dob);

    let rawWeeksLived = 0;
    if (dobDate && todayDate) {
        rawWeeksLived = Math.floor((toDayNumber(todayDate) - toDayNumber(dobDate)) / 7);
    }

    const weeksLived = clampNumber(rawWeeksLived, 0, totalWeeks);
    const weeksLeft = Math.max(0, totalWeeks - weeksLived);
    const percent = totalWeeks === 0 ? 0 : clampNumber(Math.round((weeksLived / totalWeeks) * 100), 0, 100);
    const hasCurrentWeek = rawWeeksLived >= 0 && rawWeeksLived < totalWeeks;

    // Generate dot data
    const dots = [];
    for (let i = 0; i < totalWeeks; i++) {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const cx = startX + col * (cellSize + gap) + cellSize / 2;
        const cy = startY + row * (cellSize + gap) + cellSize / 2;

        const isLived = i < weeksLived;
        const isCurrentWeek = hasCurrentWeek && i === rawWeeksLived;

        dots.push({ cx, cy, isLived, isCurrentWeek, radius });
    }

    // Stats
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
        goalStart,
        goalName,
        today
    } = options;

    // Center point (adjusted for clock)
    const clockSpace = height * clockHeight;
    const centerX = width / 2;
    const centerY = clockSpace + (height - clockSpace) * 0.4;
    const ringRadius = width * 0.28;

    let daysRemaining = 0;
    let progress = 0;
    const todayDate = normalizeDateInput(today) || getLocalToday();
    const goal = normalizeDateInput(goalDate);
    const start = normalizeDateInput(goalStart);
    if (goal && todayDate) {
        const goalDay = toDayNumber(goal);
        const todayDay = toDayNumber(todayDate);
        const startDay = start
            ? toDayNumber(start)
            : Math.min(todayDay, goalDay - 30);

        daysRemaining = Math.max(0, goalDay - todayDay);
        const totalDays = Math.max(1, goalDay - startDay);
        progress = clampNumber(daysRemaining / totalDays, 0, 1);
    }

    const safeAccent = getSafeAccent(bgColor, accentColor);
    const daysLeftText = getWallpaperText(lang, daysRemaining === 1 ? 'dayLeftLabel' : 'daysLeftLabel');

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
