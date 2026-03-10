/**
 * [INPUT]: 依赖 shared/wallpaper-core.js(computeGoalLayout/formatGoalDate/getWallpaperText/resolveTextFontFamily), ../svg.js, ../timezone.js
 * [OUTPUT]: generateGoalCountdown 函数 (SVG string)
 * [POS]: Worker 目标倒计时生成器，使用共享核心计算布局，支持 foregroundOverride、本地化 goalDefault 与 goalName 多语言字体解析
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

import { createSVG, rect, text, arc, parseColor, contrastAlpha as svgContrastAlpha } from '../svg.js';
import { getDateInTimezone } from '../timezone.js';
import { computeGoalLayout, formatGoalDate, getWallpaperText, resolveTextFontFamily } from '../../shared/wallpaper-core.js';

/**
 * Generate Goal Countdown Wallpaper
 * Shows countdown to a specific goal date with circular progress
 */
export function generateGoalCountdown(options) {
    const {
        width,
        height,
        bgColor,
        accentColor,
        timezone,
        goalDate,
        goalStart,
        goalName = '',
        clockHeight = 0.18,
        lang = 'en',
        foregroundOverride = null
    } = options;
    const resolvedGoalName = goalName?.trim() || getWallpaperText(lang, 'goalDefault', '');

    // Use shared core for layout computation
    const today = getDateInTimezone(timezone);

    const layout = computeGoalLayout({
        width,
        height,
        bgColor,
        accentColor,
        clockHeight,
        lang,
        goalDate,
        goalStart,
        goalName: resolvedGoalName,
        today
    });

    const { ring, safeAccent } = layout;

    const content = [];
    const bgFill = parseColor(bgColor);
    const accentFill = parseColor(safeAccent);
    const ringMuted = svgContrastAlpha(bgColor, 0.1, foregroundOverride);

    // Background
    content.push(rect(0, 0, width, height, bgFill));

    // Background circle
    content.push(`<circle cx="${ring.centerX}" cy="${ring.centerY}" r="${ring.radius}" stroke="${ringMuted}" stroke-width="${layout.ringStrokeWidth}" fill="none" />`);

    // Progress arc
    if (ring.progress > 0) {
        const endAngle = ring.progress * 360;
        content.push(arc(ring.centerX, ring.centerY, ring.radius, 0, endAngle, accentFill, layout.ringStrokeWidth));
    }

    // Days number
    content.push(text(ring.centerX, layout.numberY, layout.daysRemaining.toString(), {
        fill: accentFill,
        fontSize: layout.numberFontSize,
        fontWeight: '700',
        textAnchor: 'middle',
        dominantBaseline: 'middle'
    }));

    // "days left" label
    content.push(text(ring.centerX, layout.labelY, layout.daysLeftText, {
        fill: svgContrastAlpha(bgColor, 0.5, foregroundOverride),
        fontSize: layout.labelFontSize,
        fontWeight: '400',
        textAnchor: 'middle',
        dominantBaseline: 'middle'
    }));

    // Goal name
    if (layout.goalName) {
        const goalNameFontFamily = resolveTextFontFamily(lang, layout.goalName);
        content.push(text(ring.centerX, layout.goalNameY, layout.goalName, {
            fill: accentFill,
            fontSize: layout.nameFontSize,
            fontWeight: '600',
            fontFamily: goalNameFontFamily,
            textAnchor: 'middle',
            dominantBaseline: 'middle'
        }));
    }

    // Target date text is intentionally hidden for now.
    // if (goalDate) {
    //     const dateStr = formatGoalDate(goalDate, lang);
    //     content.push(text(ring.centerX, layout.targetDateY, dateStr, {
    //         fill: svgContrastAlpha(bgColor, 0.4, foregroundOverride),
    //         fontSize: width * 0.028,
    //         fontWeight: '400',
    //         textAnchor: 'middle',
    //         dominantBaseline: 'middle'
    //     }));
    // }

    return createSVG(width, height, content.join(''), lang);
}
