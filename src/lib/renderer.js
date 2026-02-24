/**
 * [INPUT]: 依赖 shared/wallpaper-core.js
 * [OUTPUT]: 对外提供 drawYearProgress, drawLifeCalendar, drawGoalCountdown (Canvas 2D)
 * [POS]: lib/ 的前端 Canvas 渲染适配器，调用共享核心计算布局，**传递设备级 cols/padding 参数**
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

import {
    computeYearLayout,
    computeLifeLayout,
    computeGoalLayout,
    hexToRgba,
    contrastAlpha,
    getSafeAccent,
    getDayOfYear as coreDayOfYear,
    getDaysInYear,
    isLeapYear,
    getWallpaperText,
    getWallpaperFontFamily,
    formatGoalDate
} from '../../shared/wallpaper-core.js';

// Re-export utilities for backward compatibility
export {
    hexToRgba,
    contrastAlpha,
    getSafeAccent,
    isLeapYear,
    getWallpaperText
};

// Legacy getDayOfYear (takes no args, uses current date)
export function getDayOfYear() {
    const now = new Date();
    return coreDayOfYear(now.getFullYear(), now.getMonth() + 1, now.getDate());
}

function getLocalToday() {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
}

/* ========================================================================
   drawStats - Canvas text rendering helper
   ======================================================================== */

export function drawStats(ctx, width, y, text1, text2, config, fontScale = 1) {
    const safeAccent = getSafeAccent(config.bgColor, config.accentColor);
    const fontFamily = getWallpaperFontFamily(config.wallpaperLang);

    const font1 = `500 ${width * 0.032 * fontScale}px ${fontFamily}`;
    const font2 = `500 ${width * 0.032 * fontScale}px ${fontFamily}`;

    ctx.font = font1;
    const w1 = ctx.measureText(text1).width;
    ctx.font = font2;
    const w2 = ctx.measureText(text2).width;

    const totalW = w1 + w2;
    const x = (width - totalW) / 2;

    ctx.fillStyle = safeAccent;
    ctx.font = font1;
    ctx.textAlign = 'left';
    ctx.fillText(text1, x, y);

    ctx.fillStyle = contrastAlpha(config.bgColor, 0.5, config.foregroundOverride);
    ctx.font = font2;
    ctx.fillText(text2, x + w1, y);
}

/* ========================================================================
   drawYearProgress - Canvas Year Grid Renderer
   ======================================================================== */

export function drawYearProgress(ctx, width, height, config, clockHeight) {
    const now = new Date();
    const layout = computeYearLayout({
        width,
        height,
        bgColor: config.bgColor,
        accentColor: config.accentColor,
        clockHeight,
        lang: config.wallpaperLang,
        year: now.getFullYear(),
        month: now.getMonth() + 1,
        day: now.getDate(),
        cols: config.cols,
        padding: config.padding
    });

    // Draw dots
    for (const dot of layout.dots) {
        if (dot.isToday) {
            ctx.fillStyle = layout.safeAccent;
        } else if (dot.isCompleted) {
            ctx.fillStyle = hexToRgba(layout.safeAccent, 0.75);
        } else {
            ctx.fillStyle = contrastAlpha(layout.bgColor, 0.12, config.foregroundOverride);
        }
        ctx.beginPath();
        ctx.arc(dot.cx, dot.cy, dot.radius, 0, Math.PI * 2);
        ctx.fill();
    }

    // Draw stats
    drawStats(ctx, width, layout.stats.y, layout.stats.daysText, ` · ${layout.stats.completeText}`, config);
}

/* ========================================================================
   drawLifeCalendar - Canvas Life Grid Renderer
   ======================================================================== */

export function drawLifeCalendar(ctx, width, height, config, clockHeight) {
    const today = getLocalToday();
    const layout = computeLifeLayout({
        width,
        height,
        bgColor: config.bgColor,
        accentColor: config.accentColor,
        clockHeight,
        lang: config.wallpaperLang,
        dob: config.dob,
        lifespan: config.lifespan,
        today
    });

    // Draw dots
    for (const dot of layout.dots) {
        if (dot.isCurrentWeek) {
            ctx.fillStyle = layout.safeAccent;
        } else if (dot.isLived) {
            ctx.fillStyle = hexToRgba(layout.safeAccent, 0.75);
        } else {
            ctx.fillStyle = contrastAlpha(layout.bgColor, 0.06, config.foregroundOverride);
        }
        ctx.beginPath();
        ctx.arc(dot.cx, dot.cy, dot.radius, 0, Math.PI * 2);
        ctx.fill();
    }

    // Draw stats
    drawStats(ctx, width, layout.stats.y, layout.stats.weeksText, ` · ${layout.stats.livedText}`, config, 0.8);
}

/* ========================================================================
   drawGoalCountdown - Canvas Goal Ring Renderer
   ======================================================================== */

export function drawGoalCountdown(ctx, width, height, config, clockHeight) {
    const today = getLocalToday();
    const layout = computeGoalLayout({
        width,
        height,
        bgColor: config.bgColor,
        accentColor: config.accentColor,
        clockHeight,
        lang: config.wallpaperLang,
        goalDate: config.goalDate,
        goalStart: config.goalStart,
        goalName: config.goalName?.trim() || getWallpaperText(config.wallpaperLang, 'goalDefault', ''),
        today
    });

    const { ring, safeAccent, bgColor } = layout;
    const fontFamily = getWallpaperFontFamily(config.wallpaperLang);

    // Background ring
    ctx.strokeStyle = contrastAlpha(bgColor, 0.1, config.foregroundOverride);
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(ring.centerX, ring.centerY, ring.radius, 0, Math.PI * 2);
    ctx.stroke();

    // Progress arc
    if (ring.progress > 0) {
        ctx.strokeStyle = safeAccent;
        ctx.lineWidth = 6;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.arc(ring.centerX, ring.centerY, ring.radius, -Math.PI / 2, -Math.PI / 2 + (Math.PI * 2 * ring.progress));
        ctx.stroke();
    }

    // Days number (center)
    ctx.fillStyle = safeAccent;
    ctx.font = `700 ${layout.numberFontSize}px ${fontFamily}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(layout.daysRemaining.toString(), ring.centerX, ring.centerY - 4);

    // "X days left" label
    ctx.fillStyle = contrastAlpha(bgColor, 0.5, config.foregroundOverride);
    ctx.font = `400 ${layout.labelFontSize}px ${fontFamily}`;
    ctx.fillText(layout.daysLeftText, ring.centerX, layout.labelY);

    // Goal name
    if (layout.goalName) {
        ctx.fillStyle = safeAccent;
        ctx.font = `600 ${layout.nameFontSize}px ${fontFamily}`;
        ctx.fillText(layout.goalName, ring.centerX, layout.goalNameY);
    }

    // Target date text is intentionally hidden for now.
    // if (config.goalDate) {
    //     const dateStr = formatGoalDate(config.goalDate, config.wallpaperLang);
    //     ctx.fillStyle = contrastAlpha(bgColor, 0.4, config.foregroundOverride);
    //     ctx.font = `400 ${width * 0.028}px ${fontFamily}`;
    //     ctx.fillText(dateStr, ring.centerX, layout.targetDateY);
    // }
}
