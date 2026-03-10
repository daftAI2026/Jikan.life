/**
 * [INPUT]: 依赖 shared/date-math + shared/wallpaper-color-core + shared/wallpaper-text
 * [OUTPUT]: 对外提供 formatGoalDate/computeYearLayout/computeLifeLayout/computeGoalLayout（含 Goal 渲染指标）
 * [POS]: shared/ 壁纸布局计算核心，负责 Year/Life/Goal 三类几何、统计数据与 Goal 关键渲染指标
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

import { getDayOfYear, getDaysInYear, toDayNumber } from "./date-math.js";
import { getSafeAccent } from "./wallpaper-color-core.js";
import { getWallpaperText } from "./wallpaper-text.js";

function isValidDateParts(year, month, day) {
    if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) return false;
    const date = new Date(Date.UTC(year, month - 1, day));
    return (
        date.getUTCFullYear() === year &&
        date.getUTCMonth() + 1 === month &&
        date.getUTCDate() === day
    );
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
        numberY: centerY - 4,
        labelY: centerY + (height * 0.08),
        goalNameY: height * 0.75,
        targetDateY: height * 0.77, // 新增
        ringStrokeWidth: 6,
        numberFontSize: width * 0.2, // 修正：原版是 0.2
        labelFontSize: width * 0.04, // 修正：原版是 0.04
        nameFontSize: width * 0.05 // 修正：原版是 0.05
    };
}
